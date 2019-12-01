class Load extends Phaser.State {
    preload() {
        this.game.load.image("background", "/static/assets/hd/background.png");
        this.game.load.image("dealerButton", "/static/assets/hd/dealerbutton.png");
        this.game.load.image("redCircle", "/static/assets/hd/redcircle.png");
        this.game.load.atlasJSONHash("cards", "/static/assets/hd/cards.png", "/static/assets/hd/cards.json");
        this.game.load.atlasJSONHash("panel", "/static/assets/hd/panel.png", "/static/assets/hd/panel.json");
        this.game.load.atlasJSONHash("buyIn", "/static/assets/hd/buyin.png", "/static/assets/hd/buyin.json");
        this.game.load.atlasJSONHash("chips", "/static/assets/hd/chips.png", "/static/assets/hd/chips.json");
        this.game.load.atlasJSONHash("nameplate", "/static/assets/hd/nameplate.png", "/static/assets/hd/nameplate.json");

        this.game.textures = this.createCustomTextures();

        this.loadPlugins();
    }

    create() {
        this.game.state.start("main");
    }

    createCustomTextures() {
        let textures = {};

        let graphics = this.game.add.graphics();
        graphics.lineStyle(4, 0x000000);
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

        graphics = this.game.add.graphics();
        graphics.beginFill(0x000000, 0.5);
        graphics.drawRect(0, 0, this.game.width, this.game.height);
        textures["modalBackground"] = graphics.generateTexture();
        graphics.destroy();


        graphics = this.game.add.graphics();
        graphics.beginFill(0x000000, 0.5);
        graphics.drawRect(0, 0, this.game.config.popup.width, this.game.config.popup.height);
        textures["textUnderlay"] = graphics.generateTexture();
        graphics.destroy();

        return textures;
    }

    loadPlugins() {
        this.game.add.plugin(PhaserInput.Plugin);
    }
}

export default Load;