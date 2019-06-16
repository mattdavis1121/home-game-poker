import SSE from "../SSE"

class Main extends Phaser.State {
    init() {
        this.sse = source;
    }

    create() {
        this.background = this.game.add.image(0, 0, "background");
        this.dealBtn = this.makeBtn("deal", this.game.textures.whiteRect, this.btnClicked);

        this.card = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "cards");
        this.card.anchor.setTo(0.5);

        this.sse.addEventListener("event", (event) => {
            this.handleEvent(event);
        });

        this.sse.addEventListener("event", () => {
            this.updateBtn();
        })
    }

    handleEvent(event) {
        console.log(event);
        console.log(this);
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

    btnClicked(btn) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/button_clicked');
        xhr.send();
    }

    updateBtn() {
        this.dealBtn.tint = this.dealBtn.tint === 0xffffff ? 0xff0000 : 0xffffff;
    }
}

export default Main;