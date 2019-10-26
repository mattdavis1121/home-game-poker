import config from "../config";
import Controller from "../classes/Controller";

class Boot extends Phaser.State {
    init() {
        this.game.initialData = initialData;
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
}

export default Boot;