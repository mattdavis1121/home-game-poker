import Card from "../classes/Card";

class CardManager {
    constructor(game) {
        this.game = game;
        this.cards = [];
        this.displayGroup = this.game.add.group();
    }

    initialize() {
        const NUM_CARDS = 2;    // TODO - get this from somewhere else
        for (let i = 0; i < NUM_CARDS; i++) {
            let card = new Card(this.game, this);
            card.initialize({});
            card.initializeDisplay();

            this.cards.push(card);
            this.displayGroup.add(card.sprite);
        }

        this.displayGroup.align(-1, 1, this.cards[0].sprite.width * 1.2, 0);
    }

    setCardNames(names) {
        console.log(names);
        for (let i = 0; i < names.length; i++) {
            this.cards[i].name = names[i];
            this.cards[i].updateDisplay();
        }
    }
}

export default CardManager;