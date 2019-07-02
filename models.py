import random
from enum import IntEnum

from flask_login import UserMixin

from database import db, BaseModel
from extensions import bcrypt


def make_random_name():
    adjectives = ["quickly", "grossly", "slowly", "heavily", "noisily", "aptly", "strongly", "mechanically", "barely", "tirelessly"]
    gerunds = ["running", "jumping", "eating", "talking", "playing", "gambling", "breathing", "squishing", "bluffing", "shooting"]
    nouns = ["humans", "donkeys", "puppies", "boulders", "crocodiles", "dinosaurs", "spectators", "amphibians", "kittens", "aliens"]

    return "".join([random.choice(words).title() for words in (adjectives, gerunds, nouns)])


class User(UserMixin, BaseModel):
    """A user of the app."""

    __tablename__ = "users"
    email = db.Column(db.String(80), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=False, nullable=True)    # For display only
    password = db.Column(db.Binary(128), nullable=True)  # The hashed password
    active = db.Column(db.Boolean(), default=False)
    is_admin = db.Column(db.Boolean(), default=False)

    holdings = db.relationship("Holding", backref="user", lazy="dynamic")
    table_id = db.Column(db.Integer, db.ForeignKey("tables.id"), nullable=True)

    def __init__(self, username, email, password=None, **kwargs):
        """Create instance."""
        db.Model.__init__(self, username=username, email=email, **kwargs)
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

    def __repr__(self):
        """Represent instance as a unique string."""
        return "<User({username!r})>".format(username=self.username)

    def join_table(self, table, position=None):
        if table == self.current_table:
            # Ignore if user already sitting at this table
            return True

        try:
            # TODO - Does player have enough money to sit down?

            if position is None:
                position = table.open_position

            new_player = Player.create(position=position, user_id=self.id,
                                       table_id=table.id)

            # TODO - Don't track current table on User model
            self.update(table=table)
            return True
        except:
            # TODO - Handle
            return False

    def leave_table(self):
        if self.table:
            self.update(table=None)

    @property
    def current_holding(self):
        if not self.table:
            return None

        # TODO - It's possible that a user as multiple current holdings, but it shouldn't be
        return self.holdings.filter_by(in_progress=True).first()

    @property
    def current_table(self):
        return self.table


class Player(BaseModel):
    """
    A player at a poker table.

    Each user may only have once associated Player record at a time. This table
    represents a user's attendance at a table, their position and stack, etc.

    These records are transient and should not be used to store long-term data.

    """
    __tablename__ = "players"

    balance = db.Column(db.Integer, nullable=False, default=500000)
    position = db.Column(db.Integer, nullable=False, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    table_id = db.Column(db.Integer, db.ForeignKey("tables.id"), nullable=False)


class Table(BaseModel):
    __tablename__ = "tables"

    name = db.Column(db.String(80), unique=False, nullable=False, default=make_random_name)
    seats = db.Column(db.Integer, nullable=False, default=9)    # Number of seats at the table
    users = db.relationship("User", backref="table", lazy=True)
    players = db.relationship("Player", backref="table", lazy="dynamic")
    hands = db.relationship("Hand", backref="table", lazy="dynamic")

    @property
    def current_hand(self):
        # TODO - It's possible that a table has two in-progress hands, but it shouldn't be
        return self.hands.filter_by(in_progress=True).first()

    @property
    def open_position(self):
        filled_positions = [player.position for player in self.players.order_by(Player.position).all()]
        i = 0
        while i < self.seats:
            if i not in filled_positions:
                return i
            i += 1
        return False

    def __repr__(self):
        return "Table: {}".format(self.name)


class Hand(BaseModel):
    """A hand of poker."""

    __tablename__ = "hands"
    holdings = db.relationship("Holding", backref="hand", lazy=True)
    board = db.Column(db.ARRAY(db.Integer), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey("tables.id"), nullable=False)
    dealer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    dealer_pos = db.Column(db.Integer, nullable=False, default=0)
    next_to_act_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    next_to_act_pos = db.Column(db.Integer, nullable=False, default=0)
    pot_pennies = db.Column(db.Integer, nullable=False, default=0)
    in_progress = db.Column(db.Boolean, nullable=False, default=True)

    actions = db.relationship("Action", backref="hand", lazy="dynamic")

    def to_dict(self):
        return {
            **{
                "holdings": [hold.to_dict() for hold in self.holdings],
                "board": self.board,
                "table_id": self.table_id,
                "dealer_pos": self.dealer_pos,
                "next_to_act_pos": self.next_to_act_pos,
                "pot_pennies": self.pot_pennies,
                "in_progress": self.in_progress,
                "actions": [action.to_dict() for action in self.actions]
            },
            **super().to_dict()
        }

    def resolve_action(self, bet=0):
        self.pot_pennies += bet
        self.next_to_act_pos = self.next_to_act_pos + 1 % self.num_players
        self.next_to_act_id = User.query.get(self.next_to_act_id).id

    @property
    def num_players(self):
        return len(self.holdings)


class Holding(BaseModel):
    """A single player's hole cards for a single hand."""

    __tablename__ = "holdings"
    cards = db.Column(db.ARRAY(db.Integer), nullable=False)
    hand_id = db.Column(db.Integer, db.ForeignKey("hands.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    in_progress = db.Column(db.Boolean, nullable=False, default=True)

    def to_dict(self):
        return {
            **{
                "cards": self.cards,
                "hand_id": self.hand_id,
                "user_id": self.user_id
            },
            **super().to_dict()
        }


class ActionTypes(IntEnum):
    FOLD = 0
    CALL = 1
    RAISE = 2
    BLIND = 3


class Action(BaseModel):
    """A single action within a hand of poker -- e.g. Bet, Fold, etc"""

    __tablename__ = "actions"
    hand_id = db.Column(db.Integer, db.ForeignKey("hands.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    holding_id = db.Column(db.Integer, db.ForeignKey("holdings.id"), nullable=False)
    action_type = db.Column(db.Enum(ActionTypes), nullable=False)

    def to_dict(self):
        return {
            **{
                "hand_id": self.hand_id,
                "user_id": self.user_id,
                "holding_id": self.holding_id,
                "action_type": self.action_type
            },
            **super().to_dict()
        }
