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


class TestPokerHand:
    def test_deal_fails(self, base_hand):
        with pytest.raises(NotImplementedError):
            base_hand.deal()

