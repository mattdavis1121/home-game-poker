from flask import render_template, redirect, url_for, request, jsonify
from flask_login import login_required, login_user, logout_user, current_user
from sqlalchemy.exc import IntegrityError

from app import app, sse
from models import Table, User, Hand, Holding, Action, ActionType, BettingRound
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
            username=form.email.data,
            active=True
        )
        login_user(new_user)
        redirect_url = request.args.get('next') or url_for("tables")
        return redirect(redirect_url)
    return render_template("register.html", form=form)


@app.route("/tables/", methods=["POST", "GET"])
@login_required
def tables():
    if request.method == "POST":
        table = Table()
        table.save()
        return redirect(url_for("show_table", table_name=table.name))
    else:
        records = Table.query.all()
        return render_template("index.html", tables=records)


@app.route("/tables/<table_name>/", methods=["GET"])
@login_required
def show_table(table_name):
    table = Table.query.filter_by(name=table_name).first()

    # TODO - This shouldn't happen here
    current_user.join_table(table=table)

    return render_template("game.html", table=table)


@app.route("/tables/<table_name>/deal/", methods=["POST"])
def deal(table_name):
    table = Table.query.filter_by(name=table_name).first()
    hand = table.new_hand()

    # TODO - new_hand() returns False if it fails and a Hand object if success. Probably wrong.
    if hand is False:
        return jsonify({"success": False, "msg": "Cannot start a hand while hand in progress."})

    sse.publish({
        "id": hand.id,
        "start_utc": hand.created_utc
    }, type="newHand", channel=table.name)

    for holding in hand.holdings:
        sse.publish({
            "id": hand.id,
            "user_id": holding.user.id,
            "holdings":holding.cards
        }, type="newHand", channel="{}_u{}".format(table.name, holding.user.id))

    return jsonify({"success": True, "hand": hand.id})


@app.route("/tables/<table_name>/action/", methods=["POST"])
def action(table_name):
    data = request.get_json()
    table = Table.query.filter_by(name=table_name).first()

    hand = table.current_hand
    if not hand:
        # TODO - Handle no current hand state
        return jsonify({"success": False, "msg": "No current hand"})

    user = User.query.get(data.get("userId", -1))
    if not user:
        # TODO - Handle no found user state
        return jsonify({"success": False, "msg": "No user found"})
    elif user.id != hand.next_to_act_id:
        # TODO - Handle action by wrong user state
        return jsonify({"success": False, "msg": "User acting out of turn"})

    try:
        action_type = ActionType[data.get("actionType")]
    except KeyError:
        return jsonify({"success": False, "msg": "Invalid action type"})

    current_bet = data.get("betAmt", 0)
    prev_bet = hand.current_betting_round.user_total_bet(user.id)
    total_bet = prev_bet + current_bet

    if action_type == ActionType.BLIND:
        if hand.board:
            return jsonify({"success": False, "msg": "Cannot post blind after hand dealt"})
    elif action_type == ActionType.CHECK:
        if hand.current_bet > 0:
            return jsonify({"success": False, "msg": "Cannot check if bet > 0"})
    elif action_type == ActionType.BET:
        if current_bet > user.player.balance:
            return jsonify({"success": False, "msg": "Bet > balance"})
        elif total_bet < hand.current_bet:
            return jsonify({"success": False, "msg": "Bet < current bet"})
        # TODO - Check for illegal raise here (enforce raise minimum)

    hand.current_betting_round.new_bet(user.id, current_bet)

    try:
        act = Action.create(action_type=data.get("actionType"),
                            hand_id=hand.id,
                            user_id=user.id,
                            holding_id=user.current_holding.id)
        hand.resolve_action(act, current_bet, total_bet)
    except IntegrityError:
        return jsonify({"success": False, "msg": "Database error"})
    except:
        return jsonify({"success": False, "msg": "Unknown error"})

    return jsonify({"success": True})


@app.route("/button_clicked", methods=["POST"])
@login_required
def button_clicked():
    data = request.get_json()
    table = Table.query.filter_by(name=data["tableName"]).first()
    sse.publish({"clicked": True}, type="event", channel=table.name)
    return "Message sent!"
