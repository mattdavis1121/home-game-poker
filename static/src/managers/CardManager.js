import Card from "../classes/Card";

class CardManager {
    constructor(game, key = "cards") {
        this.game = game;
        this.key = key;
        this.cards = [];
        this.displayGroup = this.game.add.group();
        this._mask = null;  // A mask applied to all cards in displayGroup
    }

    initialize(numCards) {
        for (let i = 0; i < numCards; i++) {
            let card = new Card(this.game, 0, 0, this.key, this);
            card.initialize({});

            this.cards.push(card);
            this.displayGroup.add(card);
        }
    }

    setCardNames(names) {
        for (let i = 0; i < names.length; i++) {
            this.cards[i].name = names[i];
        }
    }

    setCardsFaceUp(faceUp) {
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].faceUp = faceUp;
        }
    }

    reset() {
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].name = null;
            this.cards[i].updateDisplay();
        }
    }

    flip() {
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].flip();
        }
    }

    animateFlip() {
        for (let i = 0; i < this.cards.length; i++) {
            let complete = this.cards[i].animateFlip();

            if (i === this.cards.length - 1) {
                return complete;
            }
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

    get cardWidth() {
        if (!this.cards.length) {
            return 0;
        }
        return this.cards[0].width;
    }
}

export default CardManager;
