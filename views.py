import json

from flask import render_template, redirect, url_for, request, jsonify, abort
from flask_login import login_required, login_user, logout_user, current_user
from flask_jwt_extended import (create_access_token, jwt_required,
                                get_jwt_identity)
from flask_sse import ServerSentEventsBlueprint, Message
from sqlalchemy.exc import IntegrityError

from app import app, db
from sse import sse
# TODO - Clean up imports
from models import (Table, User, Hand, Holding, Action, ActionType,
                    BettingRound, Player, SSEChannel, Group, Transaction)
from forms import RegisterGroupForm, RegisterUserForm, LoginForm
from exceptions import TableFullError, SeatOccupiedError, PlayerNotAtTableError
from extensions import login_manager, scheduler
from poker import TexasHoldemHand, determine_min_raise


login_manager.login_view = "login"
HEARTBEAT_FREQ = 14  # Allows for two attempts within 30s Heroku window
EMULATOR_ENABLED = app.config['EMULATOR']


def members_only(user, group):
    if not user.belongs_to(group):
        abort(403)


@login_manager.user_loader
def load_user(user_id):
    """Load user by ID."""
    return User.query.get(int(user_id))


@scheduler.task('interval', id='heartbeat', seconds=HEARTBEAT_FREQ)
def heartbeat():
    """Send data to every channel regularly to keep alive"""
    with app.app_context():
        for channel in sse.redis.pubsub_channels():
            sse.publish({"alive": True}, type="heartbeat", channel=channel)


@app.route("/")
def index():
    if current_user.is_authenticated:
        return redirect(url_for("groups"))
    else:
        return redirect(url_for("login"))


@app.route("/login/", methods=["POST", "GET"])
def login():
    form = LoginForm(request.form)
    if form.validate_on_submit():
        login_user(form.user)
        redirect_url = request.args.get('next') or url_for("groups")
        return redirect(redirect_url)
    return render_template("login.html", form=form)


@app.route("/logout/")
@login_required
def logout():
    """Logout."""
    logout_user()
    return redirect(url_for("index"))


@app.route("/disconnect/", methods=["POST", "GET"])
def disconnect():
    data = request.get_json()
    for channel in current_user.sse_channels:
        sse.redis.client_kill_filter(_id=channel.sse_id)
        db.session.delete(channel)
    db.session.commit()
    return jsonify({"success": True})


@app.route("/register/", methods=["POST", "GET"])
def register():
    form = RegisterUserForm()
    if form.validate_on_submit():
        new_user = User.create(
            email=form.email.data,
            password=form.password.data,
            active=True,
            role_id=1
        )
        login_user(new_user)
        redirect_url = request.args.get('next') or url_for("groups")
        return redirect(redirect_url)
    return render_template("register.html", form=form)


@app.route("/groups/", methods=["POST", "GET"])
@login_required
def groups():
    form = RegisterGroupForm()
    records = current_user.groups
    if request.method == "POST":
        if form.validate_on_submit():
            new_group = Group.create(name=form.name.data,
                                     creator_id=current_user.id)
            current_user.groups.append(new_group)
            current_user.save()
            return redirect(url_for("group", id=new_group.id))
    return render_template("groups.html", form=form, groups=records)


@app.route("/groups/<id>", methods=["POST", "GET"])
@login_required
def group(id):
    record = Group.query.get(id)
    members_only(current_user, record)
    if request.method == "POST":
        table = Table.create(group_id=record.id)
        return redirect(url_for("show_table", table_name=table.name))
    return render_template("group.html", group=record, tables=record.tables,
                           current_table=current_user.current_table)


@app.route("/tables/<table_name>/", methods=["GET"])
@login_required
def show_table(table_name):
    table = Table.query.filter_by(name=table_name).first()
    members_only(current_user, table.group)
    players = [player.serialize() for player in table.active_players]
    for player in players:
        player["name"] = User.query.get(player["userId"]).name
        player["isUser"] = player["userId"] == current_user.id
    token = create_access_token(identity=current_user.id)
    return render_template("game.html", table=table,
                           players=json.dumps(players), token=token,
                           emulate=EMULATOR_ENABLED)


@app.route("/tables/<table_name>/join/", methods=["POST"])
@jwt_required
def join_table(table_name):
    data = request.get_json()
    table = Table.query.filter_by(name=table_name).first()
    user = User.query.get(get_jwt_identity())
    position = data.get("position")
    raw_amount = data.get("amount", "0")

    if not user:
        return jsonify({"success": False, "msg": "No user found"}), 401
    if user.active_player:
        return jsonify({"success": False, "msg": "Can only occupy one seat at a time"})

    # TODO - This converts the decimal input to an int and rounds down to the
    #  nearest small blind buy in. Is that what I should be doing? Will
    #  probably need some way to tell the players what happened.
    pennies = int(float(raw_amount) * 100)
    rounded_amount = (pennies // table.stakes.small) * table.stakes.small

    try:
        player = table.join(user, position)
        player.update(balance=rounded_amount)
        user.new_transaction(-rounded_amount)

        player_data = player.serialize()
        player_data["name"] = user.name
        sse.publish(player_data, type="newPlayer", channel=table.name)

        return jsonify({"success": True})
    except SeatOccupiedError:
        return jsonify({"success": False, "msg": "Seat {} is occupied".format(position)})
    except TableFullError:
        return jsonify({"success": False, "msg": "Table {} is full".format(table.id)})
    except Exception as e:
        return jsonify({"success": False, "msg": "Unknown exception", "exception": e})


@app.route("/tables/<table_name>/leave/", methods=["POST"])
@jwt_required
def leave_table(table_name):
    data = request.get_json()
    table = Table.query.filter_by(name=table_name).first()
    user = User.query.get(get_jwt_identity())

    if not user:
        return jsonify({"success": False, "msg": "No user found"}), 401
    if not user.active_player:
        return jsonify({"success": False, "msg": "No active player"})

    try:
        user.new_transaction(user.active_player.balance)
        player_data = user.active_player.serialize()
        table.leave(user.active_player)
        sse.publish(player_data, type="playerLeft", channel=table.name)
        return jsonify({"success": True})
    except PlayerNotAtTableError:
        return jsonify({"success": False, "msg": "Player is not at table {}".format(table.id)})
    except Exception as e:
        return jsonify({"success": False, "msg": "Unknown exception", "exception": e})


@app.route("/tables/<table_name>/new-hand/", methods=["POST"])
def new_hand(table_name):
    table = Table.query.filter_by(name=table_name).first()
    hand = table.new_hand(TexasHoldemHand)

    sse.publish({
        "id": hand.id,
        "next": hand.next_to_act.id,
        "dealer": hand.dealer.id,
        "start_utc": hand.created_utc
    }, type="newHand", channel=table.name)

    return jsonify({"success": True, "hand": hand.id})


@app.route("/tables/<table_name>/deal/", methods=["POST"])
def deal(table_name):
    table = Table.query.filter_by(name=table_name).first()

    if not table.active_hand:
        return jsonify({"success": False, "msg": "No active hand to deal"})
    elif table.active_hand.antes_owed or table.active_hand.blinds_owed:
        return jsonify({"success": False, "msg": "Can't deal before pre-hand bets complete"})
    elif table.active_hand.dealt:
        return jsonify({"success": False, "msg": "Hand already dealt"})

    hand = table.active_hand
    hand.deal(TexasHoldemHand, table.ready_players)  # TODO - get hand type from json

    sse.publish({
        "id": hand.id,
        "next": hand.next_to_act.id,
        "dealer": hand.dealer.id,
        "numPlayers": len(hand.players)
    }, type="deal", channel=table.name)

    if EMULATOR_ENABLED:
        sse.publish([{
            "playerId": holding.player_id,
            "holdings": [card.name for card in holding.cards]
        } for holding in hand.player_holdings], type="emulateDeal", channel=table.name)

    for holding in hand.player_holdings:
        sse.publish({
            "id": hand.id,
            "playerId": holding.player_id,
            "holdings": [card.name for card in holding.cards]
        }, type="deal", channel=holding.player.user_id)

    return jsonify({"success": True, "hand": hand.id})


@app.route("/tables/<table_name>/action/", methods=["POST"])
@jwt_required
def action(table_name):
    table = Table.query.filter_by(name=table_name).first()
    hand = table.active_hand
    if not hand:
        # TODO - Handle no current hand state
        return jsonify({"success": False, "msg": "No current hand"})

    data = request.get_json()
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"success": False, "msg": "No user found"}), 401

    player = user.active_player
    if EMULATOR_ENABLED:
        player = hand.next_to_act
    if not player:
        return jsonify({"success": False, "msg": "No player found"})
    elif player not in table.active_players:
        return jsonify({"success": False, "msg": "Can't act while sitting at a different table"})
    elif player not in table.ready_players:
        return jsonify({"success": False, "msg": "Can't act while sitting out"})

    if player != hand.next_to_act:
        # TODO - Handle action by wrong user state
        return jsonify({"success": False, "msg": "Player acting out of turn"})

    try:
        action_type = ActionType[data.get("actionType")]
    except KeyError:
        return jsonify({"success": False, "msg": "Invalid action type"})

    current_bet = data.get("betAmt", 0)
    prev_bet = hand.active_betting_round.sum_player_bets(player)
    total_bet = prev_bet + current_bet

    if hand.antes_owed:
        if action_type != ActionType.BLIND:  # TODO - Create ANTE type?
            return jsonify({"success": False, "msg": "Expected ante"})
        elif current_bet != hand.stakes.ante and current_bet != player.balance:
            return jsonify({"success": False, "msg": "Incorrect ante amount"})
    elif hand.blinds_owed:
        if action_type != ActionType.BLIND:
            return jsonify({"success": False, "msg": "Expected blind"})

        expected_blind = hand.stakes.small if hand.active_betting_round.sum == 0 else hand.stakes.big
        if current_bet != expected_blind and current_bet != player.balance:
            # TODO - Solve for all-in on big blind
            #  This should allow players to bet amounts other than SB or BB
            #  but it will fail to set the expected bet to the BB if the player
            #  who should have paid the full BB went all-in for less.
            return jsonify({"success": False, "msg": "Incorrect blind amount"})
    else:
        if not hand.dealt:
            return jsonify({"success": False, "msg": "Can't take action before hand dealt"})
        if action_type == ActionType.BLIND:
            return jsonify({"success": False, "msg": "Cannot post blind after hand dealt"})
        elif action_type == ActionType.CHECK:
            current_bet = 0
            if hand.active_betting_round.bet and not prev_bet == hand.active_betting_round.bet:
                return jsonify({"success": False, "msg": "Cannot check if bet > 0"})
        elif action_type == ActionType.BET:
            if current_bet > player.balance:
                return jsonify({"success": False, "msg": "Bet > balance"})
            elif hand.active_betting_round.bet and total_bet < hand.active_betting_round.bet and total_bet != player.balance:
                return jsonify({"success": False, "msg": "Bet < current bet"})
            elif total_bet < determine_min_raise(hand.stakes.big, hand.active_betting_round.bet, prev_bet, hand.active_betting_round.raise_amt, player.balance) and total_bet != hand.active_betting_round.bet:
                return jsonify({"success": False, "msg": "Bet < minimum bet"})

    prev_num_rounds = len(hand.betting_rounds)

    try:
        act = Action.create(holding_id=player.active_holding.id,
                            type=data.get("actionType"))
        hand.resolve_action(act, current_bet, total_bet)
    except IntegrityError:
        return jsonify({"success": False, "msg": "Database error"})
    except Exception as e:
        return jsonify({"success": False, "msg": "Unknown error", "error": str(e)})

    # TODO - This is such a hack. Fix it.
    # Number of cards showing at each round num
    try:
        num_up_cards = [0, 3, 4, 5]
        num_up_cards_round = num_up_cards[hand.active_betting_round.round_num]
        up_cards = [card.name for card in hand.board.cards][:num_up_cards_round]
    except AttributeError:
        # Hand has ended, so hand.active_betting_round is None
        up_cards = []

    sse.publish({
        "id": act.id,
        "handId": hand.id,
        "playerId": act.player.id,
        "playerBalance": act.player.balance,
        "actionType": act.type,
        "pot": hand.active_pot.amount,
        "next": hand.next_to_act.id,
        "board": up_cards,
        "bet": current_bet,
        "roundBet": hand.active_betting_round.bet if hand.active_betting_round else 0,
        "roundRaise": hand.active_betting_round.raise_amt if hand.active_betting_round else 0,
        "playerRoundBet": total_bet  # Sum of player's bets for this betting round (THIS WILL FAIL ON ALL-IN SIDE POTS)
    }, type="action", channel=table.name)

    if prev_num_rounds < len(hand.betting_rounds):
        sse.publish({
            "id": hand.active_betting_round.id,
            "handId": hand.id,
            "roundNum": hand.active_betting_round.round_num,
        }, type="newRound", channel=table.name)

    if hand.complete:
        sse.publish({
            "id": hand.id,
            "winners": [{
                "id": pot.winner.id,
                "amount": pot.amount,
                "balance": pot.winner.balance
            } for pot in hand.pots_paid]
        }, type="handComplete", channel=table.name)

    return jsonify({"success": True})
