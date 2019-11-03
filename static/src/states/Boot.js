import config from "../config";
import Controller from "../classes/Controller";

class Boot extends Phaser.State {
    init() {
        this.game.initialData = this.augmentInitialData(initialData);
        this.game.config = config;

        // TODO - This should come from somewhere dynamic
        this.game.rules = {
            ante: 0,
            blinds: {
                small: 25,
                big: 50
            },
        };

        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        this.game.controller = new Controller(this.game, this.game.initialData.playerId, this.game.initialData.token);
    }

    create() {
        this.game.state.start("load");
    }

    /**
     * @Summary Calculate additional values to store on game.initialData
     *
     * To save on server-side processing and data-transfer load, this
     * method is a place to generate additional data needed by the game
     * which may be derived from the data sent from the back end.
     */
    augmentInitialData(initialData) {
        initialData.occupiedSeats = [];
        for (let i = 0; i < initialData.players.length; i++) {
            initialData.occupiedSeats.push(initialData.players[i].seat);
        }

        return initialData;
    }
}

export default Boot;