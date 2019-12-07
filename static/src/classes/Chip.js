class Chip extends Phaser.Sprite {
    constructor(game, x, y, key, manager) {
        super(game, x, y, key);
        game.world.add(this);

        this.game = game;
        this.key = key;
        this.manager = manager;

        this.id = ++Chip.counter;
        this._value = 0;
        this.angle = 0;

        this.anchor.setTo(0.5);
        this.inputEnabled = true;
        this.rotateRandom();
    }

    set value(value) {
        this._value = value;
        this.frameName = value.toString();
    }

    get value() {
        return this._value;
    }

    clone(chip) {
        this.x = chip.worldPosition.x - this.parent.worldPosition.x;
        this.y = chip.worldPosition.y - this.parent.worldPosition.y;
        this.key = chip.key;
        this.angle = chip.angle;
        this.value = chip.value;
    }

    rotateRandom() {
        this.angle = this.game.rnd.integerInRange(-180, 180);
    }
}

Chip.counter = 0;

export default Chip;