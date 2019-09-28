/**
 * @summary A utility class of Poker-specific functionality
 */
class Poker {
    // TODO - This utility is highly-specific to NL games, maybe even to NLHE.
    //  Need to make it more generic eventually to allow for other game
    //  types. Limit and pot-limit games will work completely differently.
    //  Antes are also not supported.

    /**
     * @summary Generate all legal raises for player
     * @param {number} smallBlind - The small blind for the game
     * @param {number} bigBlind - The big blind for the game
     * @param {number} roundBet - The leading bet for this betting round
     * @param {number} playerRoundBet - The amount this player has contributed to the pot so far this round
     * @param {number} prevRaise - The amount the previous raise increased the bet
     * @param {number} playerBalance - The amount the player has available to bet
     * @returns {number[]} - The valid raises
     */
    static generateRaises(smallBlind, bigBlind, roundBet, playerRoundBet, prevRaise, playerBalance) {
        let raise = Poker.getMinRaise(bigBlind, roundBet, playerRoundBet, prevRaise, playerBalance);
        let raises = [raise];

        while (raise + smallBlind <= playerBalance) {
            raise += smallBlind;
            raises.push(raise);
        }

        if (raise < playerBalance) {
            raises.push(playerBalance);
        }

        return raises;
    }

    /**
     * @summary Get the minimum allowable bet for player
     *
     * If no bets have occurred in current round, the min bet is a
     * check (bet of 0), otherwise it's a call.
     *
     * @param {number} roundBet - The leading bet for this betting round
     * @param {number} playerRoundBet - The amount this player has contributed to the pot so far this round
     * @param {number} playerBalance - The amount the player has available to bet
     * @returns {number}
     */
    static getMinBet(roundBet, playerRoundBet, playerBalance) {
        let minBet = roundBet === 0 ? 0 : roundBet - playerRoundBet;
        if (playerBalance < minBet) {
            minBet = playerBalance;
        }
        return minBet;
    }

    /**
     * @summary Get the minimum allowable raise for player
     *
     * NOTE: A raise here may actually mean a bet in poker terms. In the
     * parlance of this utility, a raise is an aggressive action, or something
     * which would force other players to contribute more to the pot than
     * the otherwise would have.
     *
     * @param {number} bigBlind - The big blind for the game
     * @param {number} roundBet - The leading bet for this betting round
     * @param {number} playerRoundBet - The amount this player has contributed to the pot so far this round
     * @param {number} prevRaise - The amount the previous raise increased the bet
     * @param {number} playerBalance - The amount the player has available to bet
     * @returns {number}
     */
    static getMinRaise(bigBlind, roundBet, playerRoundBet, prevRaise, playerBalance) {
        let minRaise = roundBet === 0 ? bigBlind : roundBet - playerRoundBet + prevRaise;
        if (playerBalance < minRaise) {
            minRaise = playerBalance;
        }
        return minRaise;
    }
}

export default Poker;