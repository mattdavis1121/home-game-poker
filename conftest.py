import pytest
import datetime

from app import create_app
from app import db as _db
from models import *

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
def group(db):
    return Group.create(id=1, name="test_group", active=True,
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
def make_table():
    def _make_table(*args, **kwargs):
        return Table.create(*args, **kwargs)
    return _make_table


@pytest.fixture
def table(group):
    return Table.create(id=1, group_id=group.id, name="QuicklyRunningHumans",
                        seats=9, created_utc=datetime.datetime(2019, 7, 31))


@pytest.fixture
def make_user():
    def _make_user(*args, **kwargs):
        return User.create(*args, **kwargs)
    return _make_user


@pytest.fixture
def user(group, role):
    return User.create(id=1, group_id=group.id, role_id=role.id,
                       email="test@example.com", display_name=None,
                       password="test", active=True,
                       created_utc=datetime.datetime(2019, 7, 31))


@pytest.fixture
def make_player():
    def _make_player(*args, **kwargs):
        return Player.create(*args, **kwargs)
    return _make_player


@pytest.fixture
def player(user, table):
    return Player.create(id=1, user_id=user.id, table_id=table.id,
                         stack=0, sitting_out=False, seat=0,
                         created_utc=datetime.datetime(2019, 7, 31))
