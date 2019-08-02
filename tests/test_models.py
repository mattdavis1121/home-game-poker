import pytest
import datetime
from models import *
from exceptions import *
from poker import TexasHoldemHand


class TestGroup:
    def test_create(self, db):
        group = Group.create(id=1, name="test_group", active=True,
                             paid_through=datetime.date(2020, 7, 31),
                             created_utc=datetime.datetime(2019, 7, 31))

        assert group.id == 1
        assert group.name == "test_group"
        assert group.active
        assert group.paid_through >= datetime.date(2020, 7, 31)
        assert group.created_utc >= datetime.datetime(2019, 7, 31)

    def test_tables_relationship(self, group, make_table):
        assert len(group.tables) == 0
        make_table(group_id=group.id)
        assert len(group.tables) == 1
        make_table(group_id=group.id)
        assert len(group.tables) == 2
        group.tables[0].delete()
        assert len(group.tables) == 1


class TestTable:
    def test_create(self, group):
        table = Table.create(id=1, group_id=group.id,
                             name="QuicklyRunningHumans", seats=9,
                             created_utc=datetime.datetime(2019, 7, 31))

        assert table.id == 1
        assert table.group == group
        assert table.name == "QuicklyRunningHumans"
        assert table.seats == 9
        assert table.created_utc >= datetime.datetime(2019, 7, 31)

    def test_players(self, table, user, make_player):
        assert len(table.players.all()) == 0
        make_player(user_id=user.id, table_id=table.id)
        assert len(table.players.all()) == 1
        make_player(user_id=user.id, table_id=table.id)
        assert len(table.players.all()) == 2
        table.players.first().delete()
        assert len(table.players.all()) == 1

    def test_active_players(self, user, table, make_player):
        player1 = make_player(user_id=user.id, table_id=table.id)
        player2 = make_player(user_id=user.id, table_id=table.id)

        assert len(table.active_players) == 0
        user.active_player = player1
        assert len(table.active_players) == 1
        assert player1 in table.active_players

        user.active_player = player2
        assert len(table.active_players) == 1
        assert player1 not in table.active_players
        assert player2 in table.active_players

    def test_join(self, db, table, role, group, make_user):
        users = []
        for i in range(3):
            users.append(make_user(email="test{}@example.com".format(i),
                                   password="test", group_id=group.id,
                                   role_id=role.id))

        assert users[0].active_player is None

        table.join(users[0], seat=0)
        table.join(users[1], seat=1)
        assert users[0].active_player is not None
        assert users[0].active_player.table is table
        assert users[0].active_player.seat == 0
        assert users[1].active_player is not None
        assert users[1].active_player.table is table
        assert users[1].active_player.seat == 1

        table.join(users[0], seat=2)
        assert users[0].active_player.seat == 2

        # TODO - Check for custom error raised. This will still
        #  pass with a custom error, so it needs to be updated
        with pytest.raises(SeatOccupiedError):
            table.join(users[1], seat=2)

        users[0].active_player = None
        users[1].active_player = None
        table.join(users[0], seat=0)
        table.join(users[1], seat=1)
        table.join(users[2])
        assert users[2].active_player is not None
        assert users[2].active_player.table is table
        assert users[2].active_player.seat == 2

    def test_join_all_seats_full(self, group, role, make_table, make_user):
        table = make_table(group_id=group.id, seats=2)
        users = []
        for i in range(3):
            users.append(make_user(email="test{}@example.com".format(i),
                                   password="test", group_id=group.id,
                                   role_id=role.id))

        for user in users[:-1]:
            table.join(user)
        with pytest.raises(TableFullError):
            table.join(users[-1])

    def test_new_hand(self, table, group, role, make_user, make_player):
        num_players = 3
        with pytest.raises(InsufficientPlayersError):
            table.new_hand(TexasHoldemHand)

        for i in range(num_players):
            user = make_user(email="test{}@example.com".format(i),
                                   password="test", group_id=group.id,
                                   role_id=role.id)
            player = make_player(user_id=user.id, table_id=table.id, seat=i)
            user.active_player = player

        assert len(table.hands) == 0
        assert table.active_hand is None

        hand = table.new_hand(TexasHoldemHand)

        assert len(table.hands) == 1
        assert table.active_hand is not None
        assert table.active_hand is hand

        assert len(hand.player_holdings) == num_players
        assert hand.board is not None

        with pytest.raises(DuplicateActiveRecordError):
            table.new_hand(TexasHoldemHand)

        hand.status = State.CLOSED
        table.active_hand = None
        hand2 = table.new_hand(TexasHoldemHand)

        assert len(table.hands) == 2
        assert table.active_hand is not None
        assert table.active_hand is hand2



class TestUser:
    def test_password_hash(self, user):
        user.set_password("just_testing")
        assert user.password != "just_testing"
        assert user.check_password("just_testing")

    def test_players_relationship(self, user, table, make_player):
        assert len(user.players) == 0
        make_player(user_id=user.id, table_id=table.id)
        assert len(user.players) == 1
        make_player(user_id=user.id, table_id=table.id)
        assert len(user.players) == 2
        user.players[0].delete()
        assert len(user.players) == 1

    def test_active_player_relationship(self, user, table, make_player):
        player1 = make_player(user_id=user.id, table_id=table.id)
        player2 = make_player(user_id=user.id, table_id=table.id)

        assert user.active_player is None

        user.active_player = player1
        assert user.active_player is not None
        assert user.active_player is player1

        user.active_player = player2
        assert user.active_player is not None
        assert user.active_player is player2
        assert user.active_player is not player1

        user.active_player = None
        assert user.active_player is None
        assert user.active_player is not player1
        assert user.active_player is not player2

    def test_current_table(self, user, player):
        assert user.current_table is None
        user.active_player = player
        assert user.current_table is not None
        assert user.current_table == player.table
