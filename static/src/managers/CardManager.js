import Card from "../classes/Card";

class CardManager {
    constructor(game, key = "cards") {
        this.game = game;
        this.key = key;
        this.cards = [];
        this.displayGroup = this.game.add.group();
        this._mask = null;  // A mask applied to all cards in displayGroup
    }

    initialize(num_cards) {
        for (let i = 0; i < num_cards; i++) {
            let card = new Card(this.game, 0, 0, this.key, this);
            card.initialize({});
            card.initializeDisplay();

            this.cards.push(card);
            this.displayGroup.add(card);
        }
    }

    setCardNames(names) {
        for (let i = 0; i < names.length; i++) {
            this.cards[i].name = names[i];
            this.cards[i].updateDisplay();
        }
    }

    reset() {
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].name = null;
            this.cards[i].updateDisplay();
        }
    }

    get length() {
        return this.cards.length;
    }

    set mask(mask) {
        this._mask = mask;
        this.displayGroup.mask = mask;
    }

    get mask() {
        return this._mask;
    }
}

export default CardManager;
