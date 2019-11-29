import {ActionText} from "../classes/Action";
import CardManager from "../managers/CardManager";
import ChipManager from "../managers/ChipManager";
import Nameplate from "../classes/Nameplate";

class Player {
    constructor(game, chipConfig) {
        this.game = game;
        this.chipConfig = chipConfig;

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

        this.displayGroup = this.game.add.group();
        this.display = {
            nameplate: null,
            cards: null,
            dealerButton: null,
            nextIndicator: null,
            chips: null
        };

        this.cards = new CardManager(this.game);
        this.chips = new ChipManager(this.game, "chips", this.game.config.denoms);
        this.nameplate = new Nameplate(this.game, 0, 0, "nameplate");
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
        this.display.nameplate = this.nameplate;
        this.display.nameplate.initializeDisplay();

        this.display.cards = this.cards.displayGroup;
        this.cards.displayGroup.align(-1, 1, (this.nameplate.width / this.cards.length) * 0.5, 0);
        this.display.cards.centerX = this.display.nameplate.centerX;
        this.display.cards.bottom = this.display.nameplate.bottom - this.display.nameplate.height * 0.2;

        this.display.dealerButton = this.game.add.sprite(0, 0, "dealerButton");
        this.display.dealerButton.left = this.display.nameplate.left + 5;
        this.display.dealerButton.bottom = this.display.nameplate.bottom - 5;

        this.display.nextIndicator = this.game.add.sprite(0, 0, "redCircle");
        this.display.nextIndicator.right = this.display.nameplate.right - 5;
        this.display.nextIndicator.bottom = this.display.nameplate.bottom - 5;

        this.display.chips = this.chips.displayGroup;
        this.display.chips.x = this.chipConfig[this.seat].x;
        this.display.chips.y = this.chipConfig[this.seat].y;

        this.displayGroup.add(this.chips.displayGroup);
        this.displayGroup.add(this.display.cards);
        this.displayGroup.add(this.display.nameplate);
        this.displayGroup.add(this.display.dealerButton);
        this.displayGroup.add(this.display.nextIndicator);

        this.updateDisplay();
    }

    updateDisplay() {
        this.display.nameplate.name = this.name;
        this.display.nameplate.balance = this.balance;
        this.display.dealerButton.visible = this.isDealer === true;
        this.display.nextIndicator.visible = this.isNext === true;
    }

    update(data) {
        // TODO - Flesh out the rest of the data -- do I like this method?
        this.balance = data.balance === undefined ? this.balance : data.balance;
        this.isDealer = data.isDealer === undefined ? this.isDealer : data.isDealer;
        this.isNext = data.isNext === undefined ? this.isNext : data.isNext;
        this.roundBet = data.roundBet === undefined ? this.roundBet : data.roundBet;
        this.chips.setValue(this.roundBet);
        this.updateDisplay();
    }

    action(data) {
        this.update({
            balance: data.playerBalance,
            roundBet: data.playerRoundBet
        });

        let actionText = ActionText[data.actionType];

    }
}

export default Player;