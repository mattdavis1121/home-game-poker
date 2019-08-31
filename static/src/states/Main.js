import CardManager from "../managers/CardManager";
import Panel from "../classes/Panel";
import PlayerManager from "../managers/PlayerManager";
import Pot from "../classes/Pot";
import SSE from "../SSE";

class Main extends Phaser.State {
    init() {
        this.table_sse = new SSE(this.game, this.game.initialData.tableSSEUrl);
        this.user_sse = new SSE(this.game, this.game.initialData.userSSEUrl);
    }

    create() {
        this.background = this.game.add.image(0, 0, "background");
        this.dealBtn = this.makeBtn(100, 100, "deal", this.game.textures.whiteSquare, this.deal);
        this.otherBtn = this.makeBtn(100, 200, "other", this.game.textures.whiteSquare, this.btnClicked);
        this.joinBtn = this.makeBtn(100, 300, "join", this.game.textures.whiteSquare, this.joinTable);

        this.game.players = new PlayerManager(this.game);
        this.game.players.initialize(this.game.initialData.players);
        this.game.players.displayGroup.centerX = this.game.world.centerX;
        this.game.players.displayGroup.centerY = this.game.world.centerX / 6;

        this.game.board = new CardManager(this.game);
        this.game.board.initialize(5);
        this.game.board.displayGroup.centerX = this.game.world.centerX;
        this.game.board.displayGroup.centerY = this.game.world.centerY;

        this.game.pot = new Pot(this.game);
        this.game.pot.initializeDisplay();
        this.game.pot.sprite.centerX = this.game.world.centerX;
        this.game.pot.sprite.centerY = this.game.world.centerY - 140;

        this.game.panel = new Panel(this.game);
        this.game.panel.initialize();
        this.game.panel.displayGroup.centerX = this.game.world.centerX;
        this.game.panel.displayGroup.bottom = this.game.height - 20;
        this.registerListeners();

        this.table_sse.addListener("event", this.updateBtn, this, this.otherBtn);
        this.table_sse.addListener("newHand", event => {
            let data = JSON.parse(event.data);
            console.log("newHand: ", data);
            this.game.board.reset();
            for (let i = 0; i < this.game.players.players.length; i++) {
                let player = this.game.players.players[i];
                player.cards.reset();
                player.update({
                    isDealer: player.id === data.dealer,
                    isNext: player.id === data.next
                });
            }
            this.game.pot.setAmount(0);
        });
        this.table_sse.addListener("action", event => {
            let data = JSON.parse(event.data);
            console.log("action: ", data);
            this.game.board.setCardNames(data.board);
            this.game.players.getById(data.playerId).update({balance: data.playerBalance, isNext: false});
            this.game.players.getById(data.next).update({isNext: true});
            this.game.pot.setAmount(data.pot);
        });
        this.table_sse.addListener("handComplete", event => {
            let data = JSON.parse(event.data);
            console.log("handComplete: ", data);
            for (let i = 0; i < data.winners.length; i++) {
                let winner = data.winners[i];
                this.game.players.getById(winner.id).update({balance: winner.balance});
            }
        });

        this.user_sse.addListener("newHand", (event) => {
            let data = JSON.parse(event.data);
            console.log("newHand: ", data);
            for (let i = 0; i < this.game.players.players.length; i++) {
                if (this.game.players.players[i].id === this.game.initialData.playerId) {
                    this.game.players.players[i].cards.setCardNames(data.holdings);
                }
            }
        }, this);
    }

    registerListeners() {
        this.game.panel.betClicked.add(betAmt => this.game.controller.bet(betAmt));
        this.game.panel.checkClicked.add(this.game.controller.check, this.game.controller);
        this.game.panel.foldClicked.add(this.game.controller.fold, this.game.controller);
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
        xhr.open('POST', '/tables/' + this.game.initialData.tableName + '/deal/');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            tableName: initialData.tableName,
        }));
    }

    joinTable() {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/tables/' + this.game.initialData.tableName + '/join/');
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