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
        this.roundBet = 0;  // Sum bets by player in current betting round

        this.isDealer = false;
        this.isNext = false;
        this.isUser = false;

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
        this.isUser = data.isUser;

        this.cards.initialize(2);
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

        this.display.dealerButton = this.game.add.sprite(0, 0, "dealerButton");
        this.display.dealerButton.left = this.display.background.left + 5;
        this.display.dealerButton.bottom = this.display.background.bottom - 5;
        this.displayGroup.add(this.display.dealerButton);

        this.display.nextIndicator = this.game.add.sprite(0, 0, "redCircle");
        this.display.nextIndicator.right = this.display.background.right - 5;
        this.display.nextIndicator.bottom = this.display.background.bottom - 5;
        this.displayGroup.add(this.display.nextIndicator);

        this.updateDisplay();
    }

    updateDisplay() {
        this.display.name.text = this.name;
        this.display.balance.text = Util.parseCurrency(this.balance);
        this.display.dealerButton.visible = this.isDealer === true;
        this.display.nextIndicator.visible = this.isNext === true;
    }

    update(data) {
        // TODO - Flesh out the rest of the data -- do I like this method?
        this.balance = data.balance === undefined ? this.balance : data.balance;
        this.isDealer = data.isDealer === undefined ? this.isDealer : data.isDealer;
        this.isNext = data.isNext === undefined ? this.isNext : data.isNext;
        this.roundBet = data.roundBet === undefined ? this.roundBet : data.roundBet;
        this.updateDisplay();
    }
}

export default Player;