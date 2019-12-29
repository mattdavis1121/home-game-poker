class Card extends Phaser.Sprite {
    constructor(game, x, y, key, manager) {
        super(game, x, y, key);
        game.world.add(this);

        this.game = game;
        this.key = key;
        this.manager = manager;

        this.name = null;  // String ID of card, e.g. 'Kh' or '7s'

        this.anchor.setTo(0.5);
        this.inputEnabled = true;
    }

    initialize(data) {
        this.name = data.name;
    }

    initializeDisplay() {
        this.updateDisplay();
    }

    updateDisplay() {
        this.frameName = this.name ? this.name : "back";
    }
}

export default Card;
