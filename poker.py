from deuces import Deck, Card, Evaluator


def determine_next_seat(prev_seat, seats):
    try:
        prev_seat_index = seats.index(prev_seat)
        return seats[(prev_seat_index + 1) % len(seats)]
    except ValueError:
        sorted_seats = sorted(seats)
        for seat in sorted_seats:
            if prev_seat < seat:
                return seat
        return sorted_seats[0]


def determine_winners(players_and_cards, board):
    """
    Find the player with the most valuable five-card hand, using
    two hole cards and five community cards.

    :return: List of Player objects
    """
    evaluator = Evaluator()
    winners = []
    high_score = None
    for player_id, cards in players_and_cards:
        score = evaluator.evaluate(cards, board)
        if high_score is None or score < high_score:
            high_score = score
            winners = [player_id]
        elif score == high_score:
            winners.append(player_id)
    return winners


def determine_min_raise(big_blind, round_bet, player_round_bet, prev_raise, player_balance):
    round_bet = round_bet if round_bet is not None else 0
    player_round_bet = player_round_bet if player_round_bet is not None else 0
    prev_raise = prev_raise if prev_raise is not None else 0

    min_raise = big_blind
    if round_bet != 0:
        min_raise = round_bet - player_round_bet + prev_raise
    return min(min_raise, player_balance)


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
