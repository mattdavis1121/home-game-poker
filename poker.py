from deuces import Deck, Card, Evaluator


def determine_next_seat(prev_seat, seats):
    try:
        dealer_index = seats.index(prev_seat)
        return seats[(dealer_index + 1) % len(seats)]
    except ValueError:
        sorted_seats = sorted(seats)
        for seat in sorted_seats:
            if prev_seat < seat:
                return seat
        return sorted_seats[0]


class PokerHand:
    def __init__(self, num_players=0, players=None, deal=True):
        self.num_players = num_players
        self.holdings = []
        self.board = []

        if deal:
            self.deal()

    def deal(self):
        raise NotImplementedError(
            "Cannot deal base PokerHand class hands. "
            "Please use one of the game-specific hand types."
        )


class TexasHoldemHand(PokerHand):
    def __init__(self, num_players=0, deal=True):
        super().__init__(num_players, deal)
        self.rounds = 4 # preflop, flop, turn, river

    def deal(self):
        deck = Deck()
        self.holdings = [deck.draw(2) for i in range(self.num_players)]
        self.board = deck.draw(5)

    @classmethod
    def from_hand_record(cls, record):
        hand = cls(deal=False)
        hand.num_players = len(record.holdings)
        hand.holdings = record.holdings
        hand.board = record.board
        return hand


# TODO - Remove test code
if __name__ == "__main__":
    h = TexasHoldemHand(5)
