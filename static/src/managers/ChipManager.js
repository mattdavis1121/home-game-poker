class ChipManager {
    constructor(game, key, values) {
        this.game = game;
        this.key = key;
        this.values = values;

        this.chips = [];
        this.pool = [];
        this.value = 0;
        this.displayGroup = this.game.add.group();
    }

    initialize() {

    }

    getChip() {
        let chip = this.pool.pop();
        if (!chip) {
            chip = this.game.add.sprite(0, 0, this.key);
            chip.angle = this.game.rnd.integerInRange(-180, 180);   // Random rotation
            chip.anchor.setTo(0.5);
        }
        chip.revive();
        this.chips.push(chip);
        return chip;
    }

    setValue(value) {
        this.clear();
        this.value = value;
        let yPos = 0;
        let valuesPtr = this.values.length - 1;
        while (value >= 25) {
            while (value < this.values[valuesPtr]) {
                valuesPtr--;
                if (valuesPtr === 0) {
                    break;
                }
            }
            let chip = this.getChip();
            chip.y = yPos;
            chip.frameName = this.values[valuesPtr].toString();
            yPos -= 5;
            value -= this.values[valuesPtr];
            this.displayGroup.addChild(chip);
        }
    }

    clear() {
        let chip;
        while (chip = this.chips.pop()) {
            this.pool.push(chip);
            chip.kill();
        }
    }
}

export default ChipManager;