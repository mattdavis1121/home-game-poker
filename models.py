import json
import random
from enum import IntEnum
from datetime import datetime as dt

from flask_login import UserMixin

from deuces import Card as PokerCard
from poker import determine_next_seat, determine_winners
from database import db, BaseModel
from extensions import bcrypt
from exceptions import (TableFullError, SeatOccupiedError,
                        DuplicateActiveRecordError, InsufficientPlayersError,
                        InvalidCardError, InvalidRoundNumberError,
                        InsufficientBalanceError)


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

groups_users = db.Table("groups_users",
    db.Column("group_id", db.Integer, db.ForeignKey("groups.id"), primary_key=True, nullable=False),
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True, nullable=False)
)


class Group(BaseModel):
    __tablename__ = "groups"

    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(80), unique=True)
    active = db.Column(db.Boolean, default=True)
    paid_through = db.Column(db.Date, nullable=True)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)

    creator = db.relationship("User", lazy=True, foreign_keys="[Group.creator_id]")
    tables = db.relationship("Table", backref="group", lazy=True)
    users = db.relationship('User', secondary=groups_users, lazy='subquery',
                            backref=db.backref('groups', lazy=True))


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

    users = db.relationship("User", backref="role", lazy=True)


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
    email = db.Column(db.String(80), nullable=False, unique=True)
    display_name = db.Column(db.String(80), nullable=True)
    password = db.Column(db.Binary(128))
    active = db.Column(db.Boolean, default=True)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)

    players = db.relationship("Player", backref="user", lazy=True)
    active_player = db.relationship("Player", secondary=players_active,
                                     lazy="subquery",
                                     uselist=False)
    sse_channels = db.relationship("SSEChannel", backref="user", lazy=True)

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

    @property
    def name(self):
        if self.display_name:
            return self.display_name
        return self.email

    def belongs_to(self, group):
        """Is user a member of group?"""
        return self in group.users


class SSEChannel(BaseModel):
    """Map users to SSE channels for easy removal."""
    __tablename__ = "sse_channels"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    sse_id = db.Column(db.Integer, nullable=False)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)


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
        :return: The newly created player
        """
        # TODO: Check for player already at a seat

        taken_seats = [ap.seat for ap in self.active_players]
        if seat and (seat in taken_seats):
            raise SeatOccupiedError
        else:
            # Search for open seat
            for i in range(self.seats):
                if i not in taken_seats:
                    seat = i
                    break

            if seat is None:
                raise TableFullError

        player = Player.create(user_id=user.id, table_id=self.id, seat=seat)
        user.active_player = player
        self.save()

        return player

    def new_hand(self, hand_type):
        if self.active_hand:
            raise DuplicateActiveRecordError("Table already has active hand")

        if len(self.ready_players) < 2:
            raise InsufficientPlayersError

        poker_hand = hand_type(num_players=len(self.ready_players))
        hand = Hand(table_id=self.id, rounds=poker_hand.rounds)

        ready_player_seats = [player.seat for player in self.ready_players]
        if self.previous_hand:
            dealer_seat = determine_next_seat(self.previous_hand.dealer.seat,
                                              ready_player_seats)
            under_the_gun = determine_next_seat(dealer_seat, ready_player_seats)
            hand.dealer_id = self.player_at_seat(dealer_seat).id
            hand.next_id = self.player_at_seat(under_the_gun).id
        else:
            hand.dealer_id = self.player_at_seat(ready_player_seats[0]).id
            hand.next_id = self.player_at_seat(ready_player_seats[1]).id

        hand.save()
        hand.new_betting_round()
        hand.new_pot()

        hand.new_holding(cards=poker_hand.board)
        for i, poker_holding in enumerate(poker_hand.holdings):
            hand.new_holding(player=self.ready_players[i], cards=poker_holding)

        self.active_hand = hand
        self.save()

        return hand

    def player_at_seat(self, seat):
        return self.players.filter_by(seat=seat).join(players_active).first()


class Player(BaseModel):
    __tablename__ = "players"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey("tables.id"), nullable=False)
    balance = db.Column(db.Integer, default=0)
    sitting_out = db.Column(db.Boolean, default=False)
    seat = db.Column(db.Integer)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)

    holdings = db.relationship("Holding", backref="player", lazy="dynamic")

    @property
    def active_holding(self):
        if not self.table.active_hand:
            return None
        return self.holdings.filter_by(hand_id=self.table.active_hand.id).first()

    def serialize(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "balance": self.balance,
            "sittingOut": self.sitting_out,
            "seat": self.seat
        }


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
    rounds = db.Column(db.Integer, nullable=False)  # Number of betting rounds per hand
    state = db.Column(db.Enum(State), default=State.OPEN)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)

    betting_rounds = db.relationship("BettingRound", backref="hand", lazy=True, order_by="BettingRound.id")
    active_betting_round = db.relationship("BettingRound",
                                           secondary=betting_rounds_active,
                                           lazy="subquery", uselist=False)
    pots = db.relationship("Pot", backref="hand", lazy=True, order_by="desc(Pot.created_utc)")
    holdings = db.relationship("Holding", backref="hand", lazy="dynamic")
    dealer = db.relationship("Player", lazy=True, foreign_keys="[Hand.dealer_id]")
    next_to_act = db.relationship("Player", backref="hand", lazy=True, foreign_keys="[Hand.next_id]")

    @property
    def player_holdings(self):
        return sorted(self.holdings.filter_by(is_board=False).all(),
                      key=lambda holding: holding.player.seat)

    @property
    def players(self):
        return [holding.player for holding in self.player_holdings]

    @property
    def live_holdings(self):
        return sorted(
            self.holdings.filter_by(is_board=False, active=True).all(),
            key=lambda holding: holding.player.seat)

    @property
    def live_players(self):
        return [holding.player for holding in self.live_holdings]

    @property
    def board(self):
        return self.holdings.filter_by(is_board=True).first()

    @property
    def active_pot(self):
        if not self.pots:
            return None
        return self.pots[0]

    @property
    def complete(self):
        return self.state == State.CLOSED

    @property
    def pots_paid(self):
        return [pot for pot in self.pots if pot.closed]

    @property
    def winners(self):
        return [pot.winner for pot in self.pots_paid]

    def new_betting_round(self):
        """Start a new betting round for the hand."""
        round_num = 0
        if self.betting_rounds:
            # New round num will be one greater than previous
            round_num = self.betting_rounds[-1].round_num + 1

            if round_num > self.rounds - 1:
                raise InvalidRoundNumberError

        new_round = BettingRound(hand_id=self.id, round_num=round_num)
        self.active_betting_round = new_round
        self.save()

        return new_round

    def new_pot(self):
        return Pot.create(hand_id=self.id, amount=0)

    def new_holding(self, player=None, cards=None, **kwargs):
        kwargs["player_id"] = None if player is None else player.id
        kwargs["is_board"] = player is None
        return Holding.create(hand_id=self.id, cards=cards, **kwargs)

    def resolve_action(self, action, current_bet, total_bet):
        if action.type == ActionType.FOLD:
            action.holding.fold()
        else:
            self.active_betting_round.new_bet(action.player, current_bet)

            self.active_pot.amount += current_bet
            if self.active_betting_round.bettor is None or (
                    total_bet > self.active_betting_round.bet):
                self.active_betting_round.raise_amt = total_bet
                if self.active_betting_round.bet is not None:
                    self.active_betting_round.raise_amt = total_bet - self.active_betting_round.bet
                self.active_betting_round.bet = total_bet
                self.active_betting_round.bettor = action.player

        self.update_next_to_act()
        hand_complete = len(self.live_holdings) == 1

        # Bet has gone around table. Betting round complete.
        if self.next_to_act == self.active_betting_round.bettor:
            self.active_betting_round.close()

            if not hand_complete:
                next_seat = determine_next_seat(self.dealer.seat, [player.seat for player in self.live_players])
                self.next_to_act = self.table.player_at_seat(next_seat)

                try:
                    self.new_betting_round()
                except InvalidRoundNumberError:
                    # Final round of hand complete
                    hand_complete = True

        if hand_complete:
            winners = self.determine_winners()
            pots = [self.active_pot]
            if len(winners) > 1:
                pots = self.active_pot.split(children=len(winners))

            # Pay all winners and set pot(s) to CLOSED
            for winner, pot in zip(winners, pots):
                winner.update(balance=winner.balance + pot.amount)
                pot.update(state=PotState.CLOSED, winner_id=winner.id)

            self.close()

        self.save()

    def determine_winners(self):
        """
        Find the player(s) with the most valuable five-card hand, using
        two hole cards and five community cards.

        :return: List of Player objects
        """
        players_and_cards = [(holding.player.id, holding.codes) for holding in self.live_holdings]
        winners = determine_winners(players_and_cards, self.board.codes)
        return [Player.query.get(winner) for winner in winners]

    def update_next_to_act(self):
        seats = [holding.player.seat for holding in self.live_holdings]
        seat = determine_next_seat(self.next_to_act.seat, seats)
        self.next_to_act = self.table.player_at_seat(seat)
        return self.next_to_act

    def close(self):
        # if any([pot.state == PotState.OPEN for pot in self.pots]):
        #     raise Exception("Can't close a hand with open pots")
        # elif any([round.state == State.OPEN for round in self.betting_rounds]):
        #     raise Exception("Can't close a hand with open betting rounds")
        self.state = State.CLOSED
        self.table.active_hand = None
        self.save()


class PotState(IntEnum):
    VOID = -1
    CLOSED = 0
    OPEN = 1
    SPLIT = 2


class Pot(BaseModel):
    """
    A collection of bets to be won in a hand of poker

    TODO - Allow multiple pots per hand (sidepots)
    """
    __tablename__ = "pots"
    __table_args__ = (
        db.CheckConstraint("(state != 'CLOSED' AND winner_id IS NULL) OR "
                           "(state = 'CLOSED' and winner_id IS NOT NULL)"),
    )

    id = db.Column(db.Integer, primary_key=True)
    hand_id = db.Column(db.Integer, db.ForeignKey("hands.id"), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("pots.id"), nullable=True)
    winner_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=True)
    amount = db.Column(db.Integer, default=0)
    state = db.Column(db.Enum(PotState), nullable=False, default=State.OPEN)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)

    parent = db.relationship("Pot", backref="children", remote_side=[id], lazy=True)
    winner = db.relationship("Player", lazy=True)

    @property
    def closed(self):
        return self.state == PotState.CLOSED

    def split(self, children=2):
        self.update(state=PotState.SPLIT)
        for child in range(children):
            amount = self.amount // children
            if child == 0:
                # Add remainder of uneven pot to first child
                amount += self.amount % children
            Pot.create(hand_id=self.hand.id, parent_id=self.id, amount=amount)
        return self.children


class BettingRound(BaseModel):
    __tablename__= "betting_rounds"

    id = db.Column(db.Integer, primary_key=True)
    hand_id = db.Column(db.Integer, db.ForeignKey("hands.id"), nullable=False)
    bettor_id = db.Column(db.Integer, db.ForeignKey("players.id"))
    round_num = db.Column(db.Integer, nullable=False)
    bet = db.Column(db.Integer)  # The highest current bet for round
    raise_amt = db.Column(db.Integer)
    state = db.Column(db.Enum(State), nullable=False, default=State.OPEN)
    created_utc = db.Column(db.DateTime, default=dt.utcnow)

    bets = db.relationship("Bet", backref="betting_round", lazy="dynamic")
    bettor = db.relationship("Player", lazy=True)

    @property
    def sum(self):
        bets = self.bets.all()
        if not bets:
            return 0
        return sum([bet.amount for bet in bets])

    def player_bets(self, player):
        return self.bets.filter_by(player_id=player.id).all()

    def sum_player_bets(self, player):
        player_bets = self.player_bets(player)
        if not player_bets:
            return 0
        return sum([bet.amount for bet in player_bets])

    def new_bet(self, player, amount):
        if amount > player.balance:
            raise InsufficientBalanceError

        if amount > 0:
            player.update(balance=player.balance - amount)

        return Bet.create(player_id=player.id, betting_round_id=self.id,
                          amount=amount)

    def close(self):
        self.state = State.CLOSED
        self.hand.active_betting_round = None
        self.save()


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

    actions = db.relationship("Action", backref="holding", lazy=True)
    cards = db.relationship("Card", secondary=cards, lazy="subquery",
                           backref=db.backref("holding", lazy=True))

    def __init__(self, cards=None, **kwargs):
        super().__init__(**kwargs)
        if cards:
            self.add_cards(cards)

    @property
    def codes(self):
        """Get the Deuces codes for each card in holding"""
        return [card.code for card in self.cards]

    def add_cards(self, cards):
        """
        Append to cards collection and create new Card records if necessary
        :param cards: List of card ints or objects
        :return: cards collection
        """
        ints_or_objs = list(cards)
        for card in ints_or_objs:
            if isinstance(card, int):
                card = Card.get_or_create(card)
            elif not isinstance(card, Card):
                raise InvalidCardError
            self.cards.append(card)
        return self.cards

    def fold(self):
        self.update(active=False)


class Card(BaseModel):
    __tablename__ = "cards"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.Integer)    # Deuces code for card
    suit = db.Column(db.String(1), nullable=False)
    rank = db.Column(db.String(1), nullable=False)

    @property
    def name(self):
        return "{}{}".format(self.rank, self.suit)

    @classmethod
    def get_or_create(cls, code):
        """
        Lookup a card by its code and create if it doesn't exist
        :param code: Deuces card code
        :return: The created Card
        """
        card = cls.query.filter_by(code=code).first()
        if not card:
            rank, suit = PokerCard.int_to_str(code)
            card = cls.create(code=code, suit=suit, rank=rank)
        return card


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

    @property
    def player(self):
        return self.holding.player
