import random
from enum import IntEnum

from flask_login import UserMixin

from database import db, BaseModel
from extensions import bcrypt
from poker import TexasHoldemHand


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

    @property
    def player(self):
        return Player.query.filter_by(user_id=self.id).first()


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

    @property
    def user(self):
        return User.query.get(self.user_id)


class Table(BaseModel):
    __tablename__ = "tables"

    name = db.Column(db.String(80), unique=False, nullable=False, default=make_random_name)
    seats = db.Column(db.Integer, nullable=False, default=9)    # Number of seats at the table
    users = db.relationship("User", backref="table", lazy=True)
    players = db.relationship("Player", backref="table", lazy="dynamic")
    hands = db.relationship("Hand", backref="table", lazy="dynamic")

    def new_hand(self):
        if self.current_hand:
            return False

        previous_hand = self.previous_hand
        num_players = len(self.players.all())

        if num_players >= 2:
            poker_hand = TexasHoldemHand(num_players=num_players)
            hand = Hand(table_id=self.id, board=poker_hand.board, rounds=poker_hand.rounds)

            if previous_hand:
                hand.dealer_pos = (previous_hand.dealer_pos + 1) % num_players
                hand.next_to_act_pos = (hand.dealer_pos + 1) % num_players
            else:
                hand.dealer_pos = 0
                hand.next_to_act_pos = 1

            # TODO - These should be player IDs, not user
            hand.dealer_id = self.player_from_position(hand.dealer_pos).user_id
            hand.next_to_act_id = self.player_from_position(hand.next_to_act_pos).user_id

            hand.save()
            hand.new_betting_round(poker_hand.rounds[0])

            # TODO - Create Holding for each player at table. Holding model should use player_id, not user_id
            for i, player_holding in enumerate(poker_hand.holdings):
                Holding.create(user_id=self.users[i].id, hand_id=hand.id,
                               cards=player_holding)

            return hand

        return False

    @property
    def current_hand(self):
        # TODO - It's possible that a table has two in-progress hands, but it shouldn't be
        return self.hands.filter_by(in_progress=True).first()

    @property
    def previous_hand(self):
        return self.hands.filter_by(in_progress=False).order_by(Hand.created_utc.desc()).first()

    @property
    def open_position(self):
        filled_positions = [player.position for player in self.players.order_by(Player.position).all()]
        i = 0
        while i < self.seats:
            if i not in filled_positions:
                return i
            i += 1
        return False

    def player_from_position(self, position):
        return self.players.filter_by(position=position).first()

    def __repr__(self):
        return "Table: {}".format(self.name)


class Hand(BaseModel):
    """A hand of poker."""

    __tablename__ = "hands"
    holdings = db.relationship("Holding", backref="hand", lazy="dynamic")
    board = db.Column(db.ARRAY(db.Integer), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey("tables.id"), nullable=False)
    dealer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    dealer_pos = db.Column(db.Integer, nullable=False, default=0)
    next_to_act_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    next_to_act_pos = db.Column(db.Integer, nullable=False, default=0)
    pot_pennies = db.Column(db.Integer, nullable=False, default=0)
    in_progress = db.Column(db.Boolean, nullable=False, default=True)
    current_bet = db.Column(db.Integer, nullable=False, default=0)
    lead_bettor_pos = db.Column(db.Integer, nullable=True)
    rounds = db.Column(db.ARRAY(db.String), nullable=False)
    current_round_id = db.Column(db.Integer, nullable=False, default=0)

    actions = db.relationship("Action", backref="hand", lazy="dynamic")
    betting_rounds = db.relationship("BettingRound", backref="hand", lazy="dynamic")

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

    def resolve_action(self, action, current_bet, total_bet):
        self.pot_pennies += current_bet

        # TODO - Folds are working, but hand does not end if all players fold

        if action.action_type == ActionType.FOLD:
            User.query.get(self.next_to_act_id).current_holding.fold()

        else:
            if self.lead_bettor_pos is None or (total_bet > self.current_bet):
                self.current_bet = total_bet
                self.lead_bettor_pos = self.next_to_act_pos

        self.update_next_to_act()

        # Round is complete if:
        #   - hand_complete == True
        #   - This action is a check or call and next to act is initiator
        round_complete = self.next_to_act_pos == self.lead_bettor_pos
        if round_complete:
            self.current_bet = 0
            self.lead_bettor_pos = None
            self.go_to_next_round()

        # Hand is complete if:
        #   - This action is a fold and only one player remains
        #   - This action is a check or call, next to act is initiator, and no
        #     rounds remaining
        last_round = self.current_betting_round is None
        hand_complete = (last_round and round_complete) or self.num_live_hands == 1
        if hand_complete:
            self.in_progress = False
            # TODO - Pay winner(s)

        self.save()

    def new_betting_round(self, round_name=None):
        return BettingRound.create(name=round_name, hand_id=self.id)

    def go_to_next_round(self):
        self.current_betting_round.in_progress = False

        self.next_to_act_pos = (self.dealer_pos + 1) % self.num_players
        self.next_to_act_id = self.table.player_from_position(self.next_to_act_pos).user_id

        try:
            self.current_round_id += 1
            self.new_betting_round(self.rounds[self.current_round_id])
        except IndexError:
            # No next round, hand complete
            self.current_round_id = -1
            pass

    def update_next_to_act(self):
        start_pos = self.next_to_act_pos
        while True:
            self.next_to_act_pos = (self.next_to_act_pos + 1) % self.num_players
            self.next_to_act_id = self.table.player_from_position(self.next_to_act_pos).user_id

            # Found the next player with a live hand
            if self.holdings.filter_by(user_id=self.next_to_act_id).first().in_progress:
                return

            # Looked all the way around table, but all other players are folded
            if self.next_to_act_pos == start_pos:
                # TODO - Raise a custom error here
                raise KeyError

    @property
    def current_betting_round(self):
        return self.betting_rounds.filter_by(in_progress=True).first()

    @property
    def num_players(self):
        return len(self.holdings.all())

    @property
    def num_live_hands(self):
        return len(self.holdings.filter_by(in_progress=True).all())


class BettingRound(BaseModel):
    __tablename__ = "betting_rounds"

    name = db.Column(db.String(80), nullable=True)     # The common name for round (preflop, river, etc) TODO - Keep?
    hand_id = db.Column(db.Integer, db.ForeignKey("hands.id"), nullable=False)
    in_progress = db.Column(db.Boolean, nullable=False, default=True)

    bets = db.relationship("Bet", backref="betting_round", lazy="dynamic")

    # TODO - Stub
    def check_is_balanced(self):
        """Check if all users in hand have contributed the same amount."""
        return False

    def new_bet(self, user_id, amount=0):
        return Bet.create(user_id=user_id, amount=amount, betting_round_id=self.id)

    def user_total_bet(self, user_id):
        """Get sum of bets by a user in this round."""
        user_bets = self.bets.filter_by(user_id=user_id).all()
        if user_bets:
            return sum([bet.amount for bet in user_bets])
        else:
            return 0


class Bet(BaseModel):
    __tablename__ = "bets"

    amount = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    betting_round_id = db.Column(db.Integer, db.ForeignKey("betting_rounds.id"), nullable=False)


class Holding(BaseModel):
    """A single player's hole cards for a single hand."""

    __tablename__ = "holdings"
    cards = db.Column(db.ARRAY(db.Integer), nullable=False)
    hand_id = db.Column(db.Integer, db.ForeignKey("hands.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    in_progress = db.Column(db.Boolean, nullable=False, default=True)

    def fold(self):
        self.update(in_progress=False)

    def to_dict(self):
        return {
            **{
                "cards": self.cards,
                "hand_id": self.hand_id,
                "user_id": self.user_id
            },
            **super().to_dict()
        }


class ActionType(IntEnum):
    BLIND = 0
    FOLD = 1
    CHECK = 2
    BET = 3


class Action(BaseModel):
    """A single action within a hand of poker -- e.g. Bet, Fold, etc"""

    __tablename__ = "actions"
    hand_id = db.Column(db.Integer, db.ForeignKey("hands.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    holding_id = db.Column(db.Integer, db.ForeignKey("holdings.id"), nullable=False)
    action_type = db.Column(db.Enum(ActionType), nullable=False)

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
