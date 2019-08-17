import pytest
from poker import *


@pytest.fixture
def base_hand():
    return PokerHand(deal=False)


def test_determine_dealer_seat():
    assert determine_next_seat(0, [2, 4, 5, 8]) == 2
    assert determine_next_seat(2, [2, 4, 5, 8]) == 4
    assert determine_next_seat(3, [2, 4, 5, 8]) == 4
    assert determine_next_seat(4, [2, 4, 5, 8]) == 5
    assert determine_next_seat(8, [2, 4, 5, 8]) == 2


def test_determine_winners():
    board = [Card.new('Qs'), Card.new('Jh'), Card.new('Th'), Card.new('6s'),
             Card.new('2c')]
    straight1 = (1, [Card.new('Ac'), Card.new('Kc')])
    straight2 = (2, [Card.new('As'), Card.new('Kd')])
    straight3 = (3, [Card.new('9h'), Card.new('8c')])
    trips = (4, [Card.new('Jc'), Card.new('Js')])

    assert determine_winners([straight1, straight2], board) == [1, 2]
    assert determine_winners([straight1, straight3], board) == [1]
    assert determine_winners([straight2, straight3], board) == [2]
    assert determine_winners([straight3, trips], board) == [3]

    with_kicker1 = (5, [Card.new('Qh'), Card.new('8h')])
    with_kicker2 = (6, [Card.new('Qd'), Card.new('7c')])
    assert determine_winners([with_kicker1, with_kicker2], board) == [5]

    no_kicker1 = (7, [Card.new('Ts'), Card.new('4s')])
    no_kicker2 = (8, [Card.new('Tc'), Card.new('3c')])
    assert determine_winners([no_kicker1, no_kicker2], board) == [7, 8]


class TestPokerHand:
    def test_deal_fails(self, base_hand):
        with pytest.raises(NotImplementedError):
            base_hand.deal()

