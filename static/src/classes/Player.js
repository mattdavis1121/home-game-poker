import Util from "../Util";
import CardManager from "../managers/CardManager";

class Player {
    constructor(game, manager) {
        this.game = game;
        this.manager = manager;

        this.id = null;
        this.userId = null;
        this.balance = null;
        this.sittingOut = null;
        this.seat = null;
        this.name = null;

        this.display = {};
        this.displayGroup = this.game.add.group();

        this.cards = new CardManager(this.game);
    }

    initialize(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.balance = data.balance;
        this.sittingOut = data.sittingOut;
        this.seat = data.seat;
        this.name = data.name;

        this.cards.initialize();
    }

    initializeDisplay() {
        this.display.background = this.displayGroup.create(0, 0, this.game.textures.whiteRect);
        this.display.background.anchor.setTo(0.5);

        this.display.name = this.game.add.text(0, -20, "");
        this.display.name.anchor.setTo(0.5);
        this.displayGroup.add(this.display.name);

        this.display.balance = this.game.add.text(0, 20, "");
        this.display.balance.anchor.setTo(0.5);
        this.displayGroup.add(this.display.balance);

        this.display.cards = this.cards.displayGroup;
        this.display.cards.centerX = 0;
        this.display.cards.centerY = -120;
        this.displayGroup.add(this.display.cards);

        this.updateDisplay();
    }

    updateDisplay() {
        this.display.name.text = this.name;
        this.display.balance.text = Util.parseCurrency(this.balance);
    }
}

export default Player;