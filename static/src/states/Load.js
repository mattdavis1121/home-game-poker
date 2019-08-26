class Load extends Phaser.State {
    preload() {
        this.game.load.image("background", "/static/assets/hd/background.png");
        this.game.load.atlasJSONHash("cards", "/static/assets/hd/cards.png", "/static/assets/hd/cards.json");

        this.game.textures = this.createCustomTextures();
    }

    create() {
        this.game.state.start("main");
    }

    createCustomTextures() {
        let textures = {};

        let graphics = this.game.add.graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(100, 100, 100, 100);
        textures["whiteSquare"] = graphics.generateTexture();
        graphics.destroy();

        graphics = this.game.add.graphics();
        graphics.lineStyle(4, 0x000000);
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(0, 0, 300, 100);

        textures["whiteRect"] = graphics.generateTexture();

        graphics.destroy();

        return textures;
    }
}

export default Load;