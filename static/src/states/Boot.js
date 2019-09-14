import Controller from "../classes/Controller";

class Boot extends Phaser.State {
    init() {
        this.game.initialData = initialData;

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