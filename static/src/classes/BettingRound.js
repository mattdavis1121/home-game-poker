/**
 * A class to track important info for the game's current betting round
 *
 * This is mostly just a data storage class.
 */
class BettingRound {
    constructor(game) {
        this.game = game;
        this.number = 0;
        this.bet = 0;
        this.raise = 0;
    }

    // TODO - Should this class be a singleton that resets itself with
    //  each new round, or should the round itself get overwritten
    //  with a new instance each time?
    reset(newHand = false) {
        this.number = newHand ? 0 : this.number + 1;
        this.bet = 0;
        this.raise = 0;
    }
}

export default BettingRound;