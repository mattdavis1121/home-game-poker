import SSE from "../SSE"

class Main extends Phaser.State {
    init() {
        this.gameData = initialData;
        this.sse = new SSE(this.game, this.gameData.sseUrl);
    }

    create() {
        this.background = this.game.add.image(0, 0, "background");
        this.dealBtn = this.makeBtn(100, 100, "deal", this.game.textures.whiteRect, this.deal);
        this.otherBtn = this.makeBtn(100, 200, "other", this.game.textures.whiteRect, this.btnClicked);

        this.card = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "cards");
        this.card.anchor.setTo(0.5);

        this.sse.addListener("event", this.updateBtn, this, this.otherBtn);
    }

    update() {

    }

    makeBtn(x, y, text, texture, callback) {
        let btn = this.game.add.button(x, y, texture, callback, this);
        btn.anchor.setTo(0.5);

        let btnText = this.game.add.text(0, 0, text);
        btnText.anchor.setTo(0.5);
        btn.addChild(btnText);
        btn.text = btnText;

        return btn;
    }

    btnClicked(btn) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/button_clicked');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            tableName: initialData.tableName,
        }));
    }

    deal() {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/tables/' + this.gameData.tableName + '/deal/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            tableName: initialData.tableName,
        }));
    }

    updateBtn(btn) {
        btn.tint = btn.tint === 0xffffff ? 0xff0000 : 0xffffff;
    }
}

export default Main;