class ChipManager {
    constructor(game, key, values) {
        this.game = game;
        this.key = key;
        this.values = values;

        this.stackChips = true;
        this.colorUp = true;
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
        if (value === this.value) {
            return;
        }

        if (this.colorUp) {
            this.clear();
            this.value = value;
        } else {
            value -= this.value;
            this.value += value;
        }

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
            chip.frameName = this.values[valuesPtr].toString();

            if (this.stackChips) {
                chip.y = yPos;
                yPos -= 5;
            } else {
                if (this.chips.length === 1) {
                    chip.x = 0;
                    chip.y = 0;
                } else {
                    let variation = this.displayGroup.width / 2;
                    chip.x = this.game.rnd.integerInRange(-variation, variation);
                    chip.y = this.game.rnd.integerInRange(-variation, variation);
                }
            }
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