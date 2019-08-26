import Player from "../classes/Player";

class PlayerManager {
    constructor(game) {
        this.game = game;

        // Direct access to the Player objects themselves
        this.players = [];

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
        }

        this.displayGroup.align(-1, 1, this.players[0].displayGroup.width * 1.2, 0);
        this.displayGroup.position.setTo(this.game.world.centerX / 2, this.game.world.centerY / 6);
    }
}

export default PlayerManager;