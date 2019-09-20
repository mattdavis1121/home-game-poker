import Player from "../classes/Player";

class PlayerManager {
    constructor(game) {
        this.game = game;

        this.players = [];  // Direct access to the Player objects
        this.userPlayer = null;  // The user's player object, if available

        // Contains all display elements for all players in the game
        this.displayGroup = this.game.add.group();
    }

    initialize(playerData) {
        for (let i = 0; i < playerData.length; i++) {
            let player = new Player(this.game, this);
            player.initialize(playerData[i]);
            player.initializeDisplay();

            this.players.push(player);
            this.displayGroup.add(player.displayGroup);

            if (playerData[i].isUser === true) {
                this.userPlayer = player;
            }
        }

        if (this.players.length) {
            this.displayGroup.align(-1, 1, this.players[0].displayGroup.width * 1.2, 0);
        }
    }

    getById(id) {
        // TODO - Do this without iterating -- build map on init?
        // TODO - Should this ever return null?
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].id === id) {
                return this.players[i];
            }
        }
        return null;
    }
}

export default PlayerManager;