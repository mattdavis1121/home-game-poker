import pytest
import datetime

from app import create_app
from app import db as _db
from models import *
from deuces import Card as PokerCard

# TODO - Collapse all make_* fixtures. Object factory?


@pytest.fixture
def app():
    app = create_app()
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite://"
    return app


@pytest.fixture
def db(app):
    _db.app = app
    _db.create_all()
    return _db


@pytest.fixture
def make_group():
    def _make_group(*args, **kwargs):
        return Group.create(*args, **kwargs)
    return _make_group


@pytest.fixture
def group(user):
    return Group.create(id=1, creator_id = user.id, name="test_group", active=True,
                        paid_through=datetime.date(2020, 7, 31),
                        created_utc=datetime.datetime(2019, 7, 31))


@pytest.fixture
def make_role():
    def _make_role(*args, **kwargs):
        return Role.create(*args, **kwargs)
    return _make_role


@pytest.fixture
def role(db):
    return Role.create(id=1, name="admin")


@pytest.fixture
def make_user():
    def _make_user(*args, **kwargs):
        return User.create(*args, **kwargs)
    return _make_user


@pytest.fixture
def user(role):
    return User.create(id=1, role_id=role.id,
                       email="test@example.com", display_name=None,
                       password="test", active=True,
                       created_utc=datetime.datetime(2019, 7, 31))


@pytest.fixture
def make_table():
    def _make_table(*args, **kwargs):
        return Table.create(*args, **kwargs)
    return _make_table


@pytest.fixture
def table(group):
    return Table.create(id=1, group_id=group.id, name="QuicklyRunningHumans",
                        seats=9, created_utc=datetime.datetime(2019, 7, 31))


@pytest.fixture
def make_player():
    def _make_player(*args, **kwargs):
        return Player.create(*args, **kwargs)
    return _make_player


@pytest.fixture
def player(user, table):
    return Player.create(id=1, user_id=user.id, table_id=table.id,
                         balance=2000, sitting_out=False, seat=0,
                         created_utc=datetime.datetime(2019, 7, 31))


@pytest.fixture
def make_betting_round():
    def _make_betting_round(*args, **kwargs):
        return BettingRound.create(*args, **kwargs)
    return _make_betting_round


@pytest.fixture
def betting_round(hand):
    return BettingRound.create(id=1, hand_id=hand.id, round_num=0, bet=None,
                               bettor_id=None, state=State.OPEN,
                               created_utc=datetime.datetime(2019, 7, 31))


@pytest.fixture
def make_bet():
    def _make_bet(*args, **kwargs):
        return Bet.create(*args, **kwargs)
    return _make_bet


@pytest.fixture
def bet(betting_round):
    return Bet.create(id=1, player_id=betting_round.hand.dealer_id,
                      betting_round_id=betting_round.id, amount=100,
                      created_utc=datetime.datetime(2019, 7, 31))


@pytest.fixture
def make_hand():
    def _make_hand(*args, **kwargs):
        return Hand.create(*args, **kwargs)
    return _make_hand


@pytest.fixture
def hand(table, group, role, make_user, make_player):
    players = []
    for i in range(2):
        user = make_user(email="test{}@example.com".format(i),
                         password="test",
                         role_id=role.id)
        player = make_player(user_id=user.id, table_id=table.id, seat=i,
                             balance=2000)
        user.active_player = player
        players.append(player)

    return Hand.create(id=1, table_id=table.id, dealer_id=players[0].id,
                       next_id=players[1].id, rounds=4, state=State.OPEN,
                       created_utc=datetime.datetime(2019, 7, 31))


@pytest.fixture
def make_pot():
    def _make_pot(*args, **kwargs):
        return Pot.create(*args, **kwargs)
    return _make_pot


@pytest.fixture
def pot(hand):
    return Pot.create(id=1, hand_id=hand.id, amount=0,
                      created_utc=datetime.datetime(2019, 7, 31))


@pytest.fixture
def make_holding():
    def _make_holding(*args, **kwargs):
        return Holding.create(*args, **kwargs)
    return _make_holding


@pytest.fixture
def holding(hand):
    return Holding.create(id=1, player_id=hand.dealer_id, hand_id=hand.id,
                          is_board=False, active=True,
                          created_utc=datetime.datetime(2019, 7, 31),
                          cards=[PokerCard.new('As'), PokerCard.new('Ac')])


@pytest.fixture
def make_card():
    def _make_card(*args, **kwargs):
        return Card.create(*args, **kwargs)
    return _make_card


@pytest.fixture
def card():
    return Card.create(id=1, code=PokerCard.new('As'))


@pytest.fixture
def make_action():
    def _make_action(*args, **kwargs):
        return Action.create(*args, **kwargs)
    return _make_action


@pytest.fixture
def action(holding):
    return Action.create(id=1, holding_id=holding.id, type=ActionType.CHECK,
                         created_utc=datetime.datetime(2019, 7, 31))
