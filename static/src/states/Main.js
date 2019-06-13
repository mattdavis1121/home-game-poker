class Main extends Phaser.State {
    init() {

    }

    create() {
        this.background = this.game.add.image(0, 0, "background");
        this.dealBtn = this.makeBtn("deal", this.game.textures.whiteRect, this.btnClicked);

        this.card = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "cards");
        this.card.anchor.setTo(0.5);
    }

    update() {

    }

    makeBtn(text, texture, callback) {
        let btn = this.game.add.button(100, 100, texture, callback, this);
        btn.anchor.setTo(0.5);

        let btnText = this.game.add.text(0, 0, text);
        btnText.anchor.setTo(0.5);
        btn.addChild(btnText);
        btn.text = btnText;

        return btn;
    }

    btnClicked() {
        console.log("clicked")
    }
}

export default Main;