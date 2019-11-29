class Card {
    constructor(game, manager) {
        this.game = game;
        this.manager = manager;
        this.name = null;   // String ID of card, e.g. 'Kh' or '7s'
        this.sprite = null;
    }

    initialize(data) {
        this.name = data.name;
    }

    initializeDisplay() {
        this.sprite = this.game.add.sprite(0, 0, "cards");
        this.sprite.anchor.setTo(0.5);

        this.updateDisplay();
    }

    updateDisplay() {
        this.sprite.frameName = this.name ? this.name : "back";
    }
}

export default Card;