/**
 * @summary A utility class of Poker-specific functionality
 */
class Poker {
    static generateBets(smallBlind, bigBlind, roundBet, playerRoundBet, prevRaise, playerBalance) {
        let bets = [];
        let minBet = roundBet === 0 ? bigBlind : roundBet - playerRoundBet;
        let minRaise = roundBet - playerRoundBet + prevRaise;

        if (playerBalance < minBet) {
            // Player can't afford minimum bet, all in only option
            bets.push(playerBalance);
            return bets;
        }
        bets.push(minBet);

        if (minRaise > 0) {
            if (playerBalance < minRaise) {
                // Call possible, but only legal raise is all-in
                bets.push(playerBalance);
                return bets;
            }
            bets.push(minRaise);
        }

        let bet = bets[bets.length - 1];
        while ((bet + smallBlind) <= playerBalance) {
            bet += smallBlind;
            bets.push(bet);
        }

        if (bet < playerBalance) {
            bets.push(playerBalance);
        }

        return bets;
    }
}

export default Poker;