import json

from flask import render_template, redirect, url_for, request, jsonify
from flask_login import login_required, login_user, logout_user, current_user
from sqlalchemy.exc import IntegrityError

from app import app, sse
from models import (Table, User, Hand, Holding, Action, ActionType,
                    BettingRound, Player)
from forms import RegisterForm, LoginForm
from extensions import login_manager
from poker import TexasHoldemHand


login_manager.login_view = "login"


@login_manager.user_loader
def load_user(user_id):
    """Load user by ID."""
    return User.query.get(int(user_id))


@app.route("/")
def index():
    if current_user.is_authenticated:
        return redirect(url_for("tables"))
    else:
        return redirect(url_for("login"))


@app.route("/login/", methods=["POST", "GET"])
def login():
    form = LoginForm(request.form)
    if form.validate_on_submit():
        login_user(form.user)
        redirect_url = request.args.get('next') or url_for("tables")
        return redirect(redirect_url)
    return render_template("login.html", form=form)


@app.route("/logout/")
@login_required
def logout():
    """Logout."""
    logout_user()
    return redirect(url_for("index"))


@app.route("/register/", methods=["POST", "GET"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        new_user = User.create(
            email=form.email.data,
            password=form.password.data,
            active=True,
            role_id=1,
            group_id=1
        )
        login_user(new_user)
        redirect_url = request.args.get('next') or url_for("tables")
        return redirect(redirect_url)
    return render_template("register.html", form=form)


@app.route("/tables/", methods=["POST", "GET"])
@login_required
def tables():
    if request.method == "POST":
        table = Table(group_id=1)
        table.save()
        return redirect(url_for("show_table", table_name=table.name))
    else:
        records = Table.query.all()
        return render_template("index.html", tables=records)


@app.route("/tables/<table_name>/", methods=["GET"])
@login_required
def show_table(table_name):
    table = Table.query.filter_by(name=table_name).first()
    players = [player.serialize() for player in table.active_players]
    for player in players:
        player["name"] = User.query.get(player["userId"]).name
    return render_template("game.html", table=table, players=json.dumps(players))


@app.route("/tables/<table_name>/join/", methods=["POST"])
def join_table(table_name):
    data = request.get_json()
    table = Table.query.filter_by(name=table_name).first()
    user = User.query.get(data.get("userId", -1))
    position = data.get("position")

    if not user:
        return jsonify({"success": False, "msg": "No user found"})

    try:
        player = table.join(user, position)
        player.update(balance=5000)
        return jsonify({"success": True, "playerId": player.id})
    except Exception as e:
        return jsonify({"success": False, "msg": "Unknown exception", "exception": e})


@app.route("/tables/<table_name>/deal/", methods=["POST"])
def deal(table_name):
    table = Table.query.filter_by(name=table_name).first()
    hand = table.new_hand(hand_type=TexasHoldemHand)    # TODO - get hand type from json

    sse.publish({
        "id": hand.id,
        "next": hand.next_to_act.id,
        "dealer": hand.dealer.id,
        "numPlayers": len(hand.players),
        "start_utc": hand.created_utc
    }, type="newHand", channel=table.name)

    for holding in hand.player_holdings:
        sse.publish({
            "id": hand.id,
            "player_id": holding.player_id,
            "holdings": [card.name for card in holding.cards]
        }, type="newHand", channel="{}_u{}".format(table.name, holding.player.user_id))

    return jsonify({"success": True, "hand": hand.id})


@app.route("/tables/<table_name>/action/", methods=["POST"])
def action(table_name):
    data = request.get_json()
    table = Table.query.filter_by(name=table_name).first()

    hand = table.active_hand
    if not hand:
        # TODO - Handle no current hand state
        return jsonify({"success": False, "msg": "No current hand"})

    player = Player.query.get(data.get("playerId", -1))
    if not player:
        # TODO - Handle no found user state
        return jsonify({"success": False, "msg": "No player found"})
    elif player != hand.next_to_act:
        # TODO - Handle action by wrong user state
        return jsonify({"success": False, "msg": "Player acting out of turn"})

    try:
        action_type = ActionType[data.get("actionType")]
    except KeyError:
        return jsonify({"success": False, "msg": "Invalid action type"})

    current_bet = data.get("betAmt", 0)
    prev_bet = hand.active_betting_round.sum_player_bets(player)
    total_bet = prev_bet + current_bet

    if action_type == ActionType.BLIND:
        if hand.board:
            return jsonify({"success": False, "msg": "Cannot post blind after hand dealt"})
    elif action_type == ActionType.CHECK:
        current_bet = 0
        if hand.active_betting_round.bet:
            return jsonify({"success": False, "msg": "Cannot check if bet > 0"})
    elif action_type == ActionType.BET:
        if current_bet > player.balance:
            return jsonify({"success": False, "msg": "Bet > balance"})
        elif hand.active_betting_round.bet and total_bet < hand.active_betting_round.bet:
            return jsonify({"success": False, "msg": "Bet < current bet"})
        # TODO - Check for illegal raise here (enforce raise minimum)

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
        "id": hand.id,
        "playerId": act.player.id,
        "playerBalance": act.player.balance,
        "actionType": act.type,
        "pot": hand.active_pot.amount,
        "next": hand.next_to_act.id,
        "board": up_cards
    }, type="action", channel=table.name)

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


@app.route("/button_clicked", methods=["POST"])
@login_required
def button_clicked():
    data = request.get_json()
    table = Table.query.filter_by(name=data["tableName"]).first()
    sse.publish({"clicked": True}, type="event", channel=table.name)
    return "Message sent!"
