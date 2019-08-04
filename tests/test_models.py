import pytest
import datetime
import sqlalchemy

from models import *
from exceptions import *
from poker import TexasHoldemHand
from deuces import Card as PokerCard


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


class TestHand:
    def test_holdings_relationship(self, hand, make_holding):
        holding = make_holding(player_id=hand.dealer_id, hand_id=hand.id)

        assert len(hand.holdings.all()) == 1
        assert hand.holdings[0] is holding

    def test_board_and_player_holdings_relationships(self, hand, make_holding):
        player_holding1 = make_holding(player_id=hand.dealer_id, hand_id=hand.id)
        player_holding2 = make_holding(player_id=hand.next_id, hand_id=hand.id)
        board = make_holding(hand_id=hand.id, is_board=True)

        assert len(hand.holdings.all()) == 3

        assert len(hand.player_holdings) == 2
        assert hand.player_holdings[0] is player_holding1
        assert hand.player_holdings[1] is player_holding2

        assert hand.board is not None
        assert hand.board is board

    def test_new_holding(self, hand):
        assert len(hand.holdings.all()) == 0
        assert len(hand.player_holdings) == 0
        assert hand.board is None

        player_holding = hand.new_holding(player=hand.dealer)
        assert len(hand.holdings.all()) == 1
        assert len(hand.player_holdings) == 1
        assert hand.holdings.first() == player_holding
        assert hand.player_holdings[0] == player_holding
        assert hand.board is None
        assert player_holding.hand is hand

        board = hand.new_holding()
        assert len(hand.holdings.all()) == 2
        assert len(hand.player_holdings) == 1
        assert hand.board is not None
        assert hand.board is board
        assert board.hand is hand

    def test_betting_rounds_relationship(self, hand, make_betting_round):
        assert len(hand.betting_rounds) == 0

        betting_round1 = make_betting_round(hand_id=hand.id)
        assert len(hand.betting_rounds) == 1
        assert hand.betting_rounds[0] is betting_round1

        betting_round2 = make_betting_round(hand_id=hand.id)
        assert len(hand.betting_rounds) == 2
        assert hand.betting_rounds[1] is betting_round2

    def test_active_betting_round_relationship(self, hand, make_betting_round):
        assert hand.active_betting_round is None

        betting_round1 = make_betting_round(hand_id=hand.id)
        hand.active_betting_round = betting_round1
        assert hand.active_betting_round is not None
        assert hand.active_betting_round is betting_round1

        betting_round2 = make_betting_round(hand_id=hand.id)
        hand.active_betting_round = betting_round2
        assert hand.active_betting_round is not None
        assert hand.active_betting_round is not betting_round1
        assert hand.active_betting_round is betting_round2

    def test_new_betting_round(self, hand):
        assert len(hand.betting_rounds) == 0

        betting_round1 = hand.new_betting_round()
        assert len(hand.betting_rounds) == 1
        assert hand.betting_rounds[0] == betting_round1
        assert hand.active_betting_round == betting_round1
        assert betting_round1.round_num == 0

        betting_round2 = hand.new_betting_round()
        assert len(hand.betting_rounds) == 2
        assert betting_round1 in hand.betting_rounds
        assert hand.active_betting_round == betting_round2
        assert betting_round2.round_num == 1

    def test_dealer_relationship(self, group, role, table, make_hand,
                                 make_player, make_user):
        players = []
        for i in range(2):
            user = make_user(email="test{}@example.com".format(i),
                             password="test", group_id=group.id,
                             role_id=role.id)
            player = make_player(user_id=user.id, table_id=table.id, seat=i)
            user.active_player = player
            players.append(player)

        hand = make_hand(table_id=table.id, dealer_id=players[0].id,
                         next_id=players[1].id)

        assert hand.dealer is not None
        assert hand.dealer is players[0]


class TestHolding:
    def test_init(self, hand, make_holding):
        holding_no_cards = make_holding(player_id=hand.dealer.id, hand_id=hand.id)
        assert holding_no_cards.id > 0
        assert len(holding_no_cards.cards) == 0
        assert len(Card.query.all()) == 0

        holding_cards_ints = make_holding(player_id=hand.dealer.id,
                                          hand_id=hand.id,
                                          cards=[PokerCard.new('As'),
                                                 PokerCard.new('Ac')])
        assert holding_cards_ints.id > 0
        assert len(holding_cards_ints.cards) == 2
        assert len(Card.query.all()) == 2

        holding_cards_objs = make_holding(player_id=hand.dealer.id,
                                          hand_id=hand.id,
                                          cards=Card.query.all())
        assert holding_cards_objs.id > 0
        assert len(holding_cards_objs.cards) == 2
        assert len(Card.query.all()) == 2

        with pytest.raises(InvalidCardError):
            make_holding(player_id=hand.dealer.id, hand_id=hand.id,
                         cards=["invalid card"])

        with pytest.raises(sqlalchemy.exc.IntegrityError):
            make_holding(player_id=None, is_board=False, hand_id=hand.id)

    def test_cards_relationship(self, hand, make_holding, make_card):
        holding = make_holding(player_id=hand.dealer.id, hand_id=hand.id)
        card1 = make_card(code=PokerCard.new('As'))
        card2 = make_card(code=PokerCard.new('Ac'))

        assert len(holding.cards) == 0

        holding.cards.append(card1)
        assert len(holding.cards) == 1
        assert holding.cards[0] is card1

        holding.cards.append(card2)
        assert len(holding.cards) == 2
        assert holding.cards[1] is card2

    def test_codes_property(self, hand, make_holding):
        holding = make_holding(player_id=hand.dealer.id, hand_id=hand.id,
                               cards=[PokerCard.new('As'),
                                      PokerCard.new('Ac')])
        assert holding.codes == [PokerCard.new('As'), PokerCard.new('Ac')]

    def test_add_cards(self, hand, make_holding):
        holding = make_holding(player_id=hand.dealer_id, hand_id=hand.id)
        assert len(holding.cards) == 0
        assert len(Card.query.all()) == 0

        holding.add_cards([PokerCard.new('As'), PokerCard.new('Ac')])
        assert len(holding.cards) == 2
        assert len(Card.query.all()) == 2

        holding.add_cards([PokerCard.new('As'), PokerCard.new('Ac')])
        assert len(holding.cards) == 4
        assert len(Card.query.all()) == 2

        holding.add_cards(holding.cards)
        assert len(holding.cards) == 8
        assert len(Card.query.all()) == 2

        with pytest.raises(InvalidCardError):
            holding.add_cards('not an int or Card obj')
