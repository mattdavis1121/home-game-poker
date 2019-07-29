import random
from enum import IntEnum
from datetime import datetime as dt

from flask_login import UserMixin

from database import db, BaseModel
from extensions import bcrypt


def make_random_name():
    adjectives = ["quickly", "grossly", "slowly", "heavily", "noisily", "aptly", "strongly", "mechanically", "barely", "tirelessly"]
    gerunds = ["running", "jumping", "eating", "talking", "playing", "gambling", "breathing", "squishing", "bluffing", "shooting"]
    nouns = ["humans", "donkeys", "puppies", "boulders", "crocodiles", "dinosaurs", "spectators", "amphibians", "kittens", "aliens"]

    return "".join([random.choice(words).title() for words in (adjectives, gerunds, nouns)])


# Non-model tables must be defined first to build proper relationships
players_active = db.Table('players_active',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True, nullable=False, unique=True),
    db.Column('player_id', db.Integer, db.ForeignKey('players.id'), primary_key=True, nullable=False),
)

hands_active = db.Table("hands_active",
    db.Column("table_id", db.Integer, db.ForeignKey("tables.id"), primary_key=True, nullable=False),
    db.Column("hand_id", db.Integer, db.ForeignKey("hands.id"), primary_key=True, nullable=False)
)

betting_rounds_active = db.Table("betting_rounds_active",
    db.Column("betting_round_id", db.Integer, db.ForeignKey("betting_rounds.id"), primary_key=True, nullable=False),
    db.Column("hand_id", db.Integer, db.ForeignKey("hands.id"), primary_key=True, nullable=False)
)

cards = db.Table('holdings_to_cards',
    db.Column('holding_id', db.Integer, db.ForeignKey('holdings.id'), primary_key=True, nullable=False),
    db.Column('card_id', db.Integer, db.ForeignKey('cards.id'), primary_key=True, nullable=False),
    db.Column('exposed', db.Boolean, default=False)
)


class Group(BaseModel):
    __tablename__ = "groups"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    active = db.Column(db.Boolean, default=True)
    paid_through = db.Column(db.Date, nullable=True)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)


# TODO - Stub
class PaymentType(BaseModel):
    __tablename__ = "payment_types"

    id = db.Column(db.Integer, primary_key=True)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)


class Payment(BaseModel):
    """Real money payments for the service."""
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    payment_type_id = db.Column(db.Integer, db.ForeignKey("payment_types.id"), nullable=False)
    amount = db.Column(db.Integer)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)


class Role(BaseModel):
    __tablename__ = "roles"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True)


class User(UserMixin, BaseModel):
    """
    A user of the application.

    Different than Player. A user is responsible for all application-wide
    logic, with a focus on administration and payment. It's the human's link
    into the app. A Player represents poker-specific data.
    """
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey("groups.id"), nullable=False)
    email = db.Column(db.String(80))    # TODO - Must be unique within group
    display_name = db.Column(db.String(80), nullable=True)
    password = db.Column(db.Binary(128))
    active = db.Column(db.Boolean, default=True)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)

    active_player = db.relationship("Player", secondary=players_active,
                                     lazy="subquery",
                                     backref=db.backref("user", lazy=True),
                                     uselist=False)

    def __init__(self, email, password=None, **kwargs):
        """Create instance."""
        db.Model.__init__(self, email=email, **kwargs)
        if password:
            self.set_password(password)
        else:
            self.password = None

    def set_password(self, password):
        """Set password."""
        self.password = bcrypt.generate_password_hash(password)

    def check_password(self, value):
        """Check password."""
        return bcrypt.check_password_hash(self.password, value)

    @property
    def current_table(self):
        if not self.active_player:
            return None
        return self.active_player.table


class Transaction(BaseModel):
    """Buy-ins and cash-outs."""
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    amount = db.Column(db.Integer)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)


class Table(BaseModel):
    __tablename__ = "tables"

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey("groups.id"), nullable=False)
    name = db.Column(db.String(80), default=make_random_name)
    seats = db.Column(db.Integer, default=9)    # Max players allowed at table
    created_utc = db.Column(db.DateTime, default=dt.utcnow)

    players = db.relationship("Player", backref="table", lazy="dynamic",
                              order_by="Player.seat")
    hands = db.relationship("Hand", backref="table", lazy=True,
                            order_by="desc(Hand.created_utc)")
    active_hand = db.relationship("Hand", secondary=hands_active,
                                  lazy="subquery",
                                  uselist=False)

    @property
    def active_players(self):
        """
        Players sitting at table regardless of sitting_out value
        :return: List of Players
        """
        return self.players.join(players_active).all()

    @property
    def ready_players(self):
        """
        Active players who are not sitting out
        :return: List of Players
        """
        return self.players.filter_by(sitting_out=False).join(players_active).all()

    @property
    def previous_hand(self):
        """
        Get the most recent non-active hand for this table
        :return: Hand instance if exists, else None
        """
        previous_hand = None
        for hand in self.hands:
            if hand != self.active_hand:
                previous_hand = hand
                break
        return previous_hand

    def join(self, user, seat=None):
        """
        Sit a user down at this table

        First finds a suitable position if none provided, then creates a
        Player record representing the user's attendance at this table. Fail if
        provided seat is occupied, or if there are no open seats at the table.

        :param user: The User to seat at the table
        :param seat: The seat number to seat the User at
        :return: ID of the newly created player
        """
        # TODO: Check for player already at a seat

        taken_seats = [ap.seat for ap in self.active_players]
        if seat and (seat in taken_seats):
            raise Exception('seat taken')
        else:
            # Search for open seat
            for i in range(self.seats):
                if i not in taken_seats:
                    seat = i
                    break

            if seat is None:
                raise Exception('no open seats')

        player = Player.create(user_id=user.id, table_id=self.id, seat=seat)
        if user.active_player:
            user.active_player.delete()
        user.active_player = player
        self.save()

        return player.id

    def new_hand(self, hand_type):
        if self.active_hand:
            raise Exception("Table already has active hand")

        if len(self.ready_players) < 2:
            raise Exception("Not enough players")

        poker_hand = hand_type(num_players=len(self.ready_players))
        hand = Hand(table_id=self.id, rounds=poker_hand.rounds)

        # TODO - Pass dealer button around table each hand
        hand.dealer_id = self.ready_players[0].id
        hand.next_id = self.ready_players[1].id

        hand.save()
        hand.new_betting_round()


class Player(BaseModel):
    __tablename__ = "players"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey("tables.id"), nullable=False)
    stack = db.Column(db.Integer, default=0)
    sitting_out = db.Column(db.Boolean, default=False)
    seat = db.Column(db.Integer)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)


class State(IntEnum):
    VOID = -1
    CLOSED = 0
    OPEN = 1


class Hand(BaseModel):
    __tablename__ = "hands"

    id = db.Column(db.Integer, primary_key=True)
    table_id = db.Column(db.Integer, db.ForeignKey("tables.id"), nullable=False)
    dealer_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)
    next_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)
    rounds = db.Column(db.Integer)  # Number of betting rounds per hand
    state = db.Column(db.Enum(State), default=State.OPEN)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)

    active_betting_round = db.relationship("BettingRound",
                                           secondary=betting_rounds_active,
                                           lazy="subquery",
                                           backref=db.backref("hand", lazy=True),
                                           uselist=False)


class Pot(BaseModel):
    """
    A collection of bets to be won in a hand of poker

    TODO
        - Allow pots to be split
        - Allow multiple pots per hand (sidepots)
    """
    __tablename__ = "pots"

    id = db.Column(db.Integer, primary_key=True)
    hand_id = db.Column(db.Integer, db.ForeignKey("hands.id"), nullable=False)
    amount = db.Column(db.Integer)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)


class BettingRound(BaseModel):
    __tablename__= "betting_rounds"

    id = db.Column(db.Integer, primary_key=True)
    hand_id = db.Column(db.Integer, db.ForeignKey("hands.id"), nullable=False)
    round_num = db.Column(db.Integer)
    name = db.Column(db.String(80), nullable=True)  # preflop, flop, turn, etc
    bet = db.Column(db.Integer) # The highest current bet for round
    bettor = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)
    state = db.Column(db.Enum(State))
    created_utc = db.Column(db.DateTime, default=dt.utcnow)


class Bet(BaseModel):
    __tablename__= "bets"

    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)
    betting_round_id = db.Column(db.Integer, db.ForeignKey("betting_rounds.id"), nullable=False)
    amount = db.Column(db.Integer)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)


class Holding(BaseModel):
    __tablename__= "holdings"
    __table_args__ = (
        db.CheckConstraint("(player_id IS NOT NULL) OR (is_board = TRUE)"),
    )

    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=True)
    hand_id = db.Column(db.Integer, db.ForeignKey("hands.id"), nullable=False)
    is_board = db.Column(db.Boolean, default=False)
    active = db.Column(db.Boolean, default=True)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)

    cards = db.relationship("Card", secondary=cards, lazy="subquery",
                           backref=db.backref("holding", lazy=True))


class Card(BaseModel):
    __tablename__ = "cards"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.Integer)    # Deuces code for card


class ActionType(IntEnum):
    BLIND = 0
    FOLD = 1
    CHECK = 2
    BET = 3


class Action(BaseModel):
    __tablename__ = "actions"

    id = db.Column(db.Integer, primary_key=True)
    holding_id = db.Column(db.Integer, db.ForeignKey("holdings.id"), nullable=False)
    type = db.Column(db.Enum(ActionType))
    created_utc = db.Column(db.DateTime, default=dt.utcnow)