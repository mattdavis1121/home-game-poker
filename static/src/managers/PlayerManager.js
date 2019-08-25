import Player from "../classes/Player";

class PlayerManager {
    constructor(game) {
        this.game = game;

        // Direct access to the Player objects themselves
        this.players = [];

        // Contains all display elements for all players in the game
        this.group = this.game.add.group();
    }

    initialize(playerData) {
        for (let i = 0; i < playerData.length; i++) {
            let player = new Player(this.game);
            player.initialize(playerData[i]);
            player.initializeDisplay();

            this.players.push(player);
            this.group.add(player.displayGroup);
        }

        this.group.align(-1, 1, this.players[0].displayGroup.width * 1.2, 0);
        this.group.position.setTo(this.game.world.centerX / 2, this.game.world.centerY / 6);
    }
}

export default PlayerManager;