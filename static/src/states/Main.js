import PlayerManager from "../managers/PlayerManager";
import SSE from "../SSE";

class Main extends Phaser.State {
    init() {
        this.gameData = initialData;
        this.table_sse = new SSE(this.game, this.gameData.tableSSEUrl);
        this.user_sse = new SSE(this.game, this.gameData.userSSEUrl);
    }

    create() {
        this.background = this.game.add.image(0, 0, "background");
        this.dealBtn = this.makeBtn(100, 100, "deal", this.game.textures.whiteSquare, this.deal);
        this.otherBtn = this.makeBtn(100, 200, "other", this.game.textures.whiteSquare, this.btnClicked);
        this.joinBtn = this.makeBtn(100, 300, "join", this.game.textures.whiteSquare, this.joinTable);

        this.card = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "cards");
        this.card.anchor.setTo(0.5);

        this.table_sse.addListener("event", this.updateBtn, this, this.otherBtn);
        this.table_sse.addListener("newHand", (event) => {console.log(event.data)}, this);

        this.user_sse.addListener("newHand", (event) => {console.log(event.data)}, this);

        this.game.players = new PlayerManager(this.game);
        this.game.players.initialize(this.gameData.players);
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

    joinTable() {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/tables/' + this.gameData.tableName + '/join/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            tableName: initialData.tableName,
            userId: initialData.userId
        }));
    }

    updateBtn(btn) {
        btn.tint = btn.tint === 0xffffff ? 0xff0000 : 0xffffff;
    }
}

export default Main;