from deuces import Deck, Card, Evaluator


class PokerHand:
    def __init__(self, num_players):
        self.num_players = num_players
        self.holdings = []
        self.board = []
        self.deal()

    def deal(self):
        raise NotImplementedError(
            "Cannot deal base PokerHand class hands. "
            "Please use one of the game-specific hand types."
        )


class TexasHoldemHand(PokerHand):
    def deal(self):
        deck = Deck()
        self.holdings = [deck.draw(2) for i in range(self.num_players)]
        self.board = deck.draw(5)


# TODO - Remove test code
if __name__ == "__main__":
    h = TexasHoldemHand(5)
