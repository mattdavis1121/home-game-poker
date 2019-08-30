class Boot extends Phaser.State {
    init() {
        this.game.initialData = initialData;

        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
    }

    create() {
        this.game.state.start("load");
    }
}

export default Boot;