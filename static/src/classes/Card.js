class Card extends Phaser.Sprite {
    constructor(game, x, y, key, manager, autoHide = false) {
        super(game, x, y, key);
        game.world.add(this);

        this.game = game;
        this.key = key;
        this.manager = manager;

        this.name = null;  // String ID of card, e.g. 'Kh' or '7s'
        this.autoHide = autoHide;

        this.anchor.setTo(0.5);
        this.inputEnabled = true;
        this.updateDisplay();
    }

    initialize(data) {
        this.name = data.name;
    }

    initializeDisplay() {
        this.updateDisplay();
    }

    updateDisplay() {
        this.frameName = this.name ? this.name : "back";

        // Auto-hide face down cards, if flag set
        // This will cause problems if manually hiding and showing
        // cards. E.g. manually set card to hidden even though it has
        // a truthy `name` property, then call it will become visible
        // again when updateDisplay is called if `autoHide` is true.
        this.visible = !this.autoHide || this.name;
    }
}

export default Card;
