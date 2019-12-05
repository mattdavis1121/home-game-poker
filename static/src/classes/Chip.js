class Chip extends Phaser.Sprite {
    constructor(game, x, y, key, manager) {
        super(game, x, y, key);
        game.world.add(this);

        this.game = game;
        this.key = key;
        this.manager = manager;

        this._value = 0;
        this.angle = 0;

        this.anchor.setTo(0.5);
        this.inputEnabled = true;
        this.rotateRandom();
    }

    set value(value) {
        this._value = value;
    }

    get value() {
        return this._value;
    }

    rotateRandom() {
        this.angle = this.game.rnd.integerInRange(-180, 180);
    }
}

export default Chip;