import Button from "../classes/Button";
import Chip from "../classes/Chip";

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

    getChip(value) {
        let chip = this.pool.pop();
        if (!chip) {
            chip = new Chip(this.game, this.key);
        }
        this.chips.push(chip);

        // chip.events.onKilled.add(this.recycleChip, this);

        chip.value = value;
        chip.frameName = value.toString();
        return chip;
    }

    setValue(value) {
        this.value = value;
        let i = 0;
        let j = this.values.length - 1;
        while (value >= 25) {
            while (value < this.values[j]) {
                j--;
                if (j === 0) {
                    break;
                }
            }
            let chip = this.game.add.sprite(0, i, this.key);
            chip.frameName = this.values[j].toString();
            chip.anchor.setTo(0.5);
            chip.angle = this.game.rnd.integerInRange(-180, 180);
            i -= 5;
            value -= this.values[j];
            this.displayGroup.addChild(chip);
        }
    }

    // clear() {
    //     let chip;
    //     while (chip = this.chips.pop()) {
    //         chip.kill();
    //     }
    // }
    //
    // recycleChip(chip) {
    //
    // }
}

export default ChipManager;