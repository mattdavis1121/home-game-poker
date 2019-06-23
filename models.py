import random
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

    holdings = db.relationship("Holding", backref="user", lazy=True)
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

    def join_table(self, table):
        self.update(table=table)

    def leave_table(self):
        if self.table:
            self.update(table=None)


class Player(BaseModel):
    __tablename__ = "players"

    name = db.Column(db.String(80), unique=False, nullable=False)
    balance = db.Column(db.Integer, nullable=False, default=500000)


class Table(BaseModel):
    __tablename__ = "tables"

    name = db.Column(db.String(80), unique=False, nullable=False, default=make_random_name)
    users = db.relationship("User", backref="table", lazy=True)
    hands = db.relationship("Hand", backref="table", lazy=True)

    def __repr__(self):
        return "Table: {}".format(self.name)


class Hand(BaseModel):
    """A hand of poker."""

    __tablename__ = "hands"
    holdings = db.relationship("Holding", backref="hand", lazy=True)
    board = db.Column(db.ARRAY(db.Integer), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey("tables.id"), nullable=False)

    # @classmethod
    # def from_poker_hand(cls, poker_hand):
    #     record = cls()
    #     record.board = poker_hand.board
    #     for holding in poker_hand.holdings:
    #         record.holdings.append(Holding)
    #     return record


class Holding(BaseModel):
    """A single player's hole cards for a single hand."""

    __tablename__ = "holdings"
    cards = db.Column(db.ARRAY(db.Integer), nullable=False)
    hand_id = db.Column(db.Integer, db.ForeignKey("hands.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
