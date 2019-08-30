import Card from "../classes/Card";

class CardManager {
    constructor(game) {
        this.game = game;
        this.cards = [];
        this.displayGroup = this.game.add.group();
    }

    initialize(num_cards) {
        for (let i = 0; i < num_cards; i++) {
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