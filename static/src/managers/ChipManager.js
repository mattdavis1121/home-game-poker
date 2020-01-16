import Chip from "../classes/Chip";
import Util from "../Util";

class Tooltip {
    constructor(game, key, padding = 10) {
        this.game = game;
        this.key = key;
        this.padding = padding;

        this._text = "";

        this.displayGroup = this.game.add.group();
        this.display = {
            background: null,
            text: null
        }
    }

    set text(text) {
        this._text = text;
        this.display.text.text = text;
        this.rePos();
    }

    get text() {
        return this._text;
    }

    set visible(visible) {
        this.displayGroup.visible = visible;
    }

    initializeDisplay() {
        this.display.background = this.game.add.sprite(0, 0, this.key);
        this.display.background.anchor.setTo(0.5);

        this.display.text = this.game.add.text(0, 2, "");   // TODO - No magic numbers (leaving for now because fuck trying to position text vertically)
        this.display.text.setStyle({
            "font": "16pt Arial",
            "fill": "#FFFFFF"
        });
        this.display.text.anchor.setTo(0.5);

        this.displayGroup.add(this.display.background);
        this.displayGroup.add(this.display.text);
        this.displayGroup.visible = false;
    }

    rePos() {
        this.display.text.scale.setTo(1);
        const textArea = this.display.background.width - (this.padding * 2);
        if (this.display.text.width > textArea) {
            this.display.text.scale.setTo(textArea / this.display.text.width);
        }
    }
}

class ChipManager {
    constructor(game, key, values) {
        this.game = game;
        this.key = key;
        this.values = values;

        this.stackChips = true;
        this.colorUp = true;
        this.chips = [];
        this.pool = [];
        this._value = null;
        this.tooltip = new Tooltip(this.game, this.game.textures.textUnderlay);
        this.displayGroup = this.game.add.group();
        this.display = {
            chips: this.game.add.group(),
            tooltip: this.tooltip.displayGroup
        };
        this.transferAnimation = this.animateChipCascade;
        this.pileRadius = 30;
    }

    set value(value) {
        this._value = value;
        this.tooltip.text = Util.parseCurrency(this._value);
    }

    get value() {
        return this._value;
    }

    initializeDisplay() {
        this.tooltip.initializeDisplay();
        this.display.tooltip.y = this.display.tooltip.height;
        this.displayGroup.add(this.display.chips);
        this.displayGroup.add(this.display.tooltip);
        this.setValue(0);
    }

    getChip() {
        let chip = this.pool.pop();
        if (!chip) {
            chip = new Chip(this.game, 0, 0, this.key, this);
            this.setChipInputs(chip);
            this.display.chips.addChild(chip);
        }
        chip.revive();
        chip.parent.bringToTop(chip);
        this.chips.push(chip);
        return chip;
    }

    setChipInputs(chip) {
        chip.events.onInputOver.removeAll();
        chip.events.onInputOver.add(() => {this.tooltip.visible = true});

        chip.events.onInputOut.removeAll();
        chip.events.onInputOut.add(() => {this.tooltip.visible = false});
    }

    setValue(value) {
        if (value === this._value) {
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
            chip.value = this.values[valuesPtr];

            if (this.stackChips) {
                chip.y = yPos;
                yPos -= 5;
            } else {
                if (this.chips.length === 1) {
                    chip.x = 0;
                    chip.y = 0;
                } else {
                    let randPos = this.randChipPos();
                    chip.x = randPos.x;
                    chip.y = randPos.y;
                }
            }
            value -= this.values[valuesPtr];
        }
    }

    clear() {
        let chip;
        while (chip = this.chips.pop()) {
            this.pool.push(chip);
            chip.kill();
        }
    }

    clearChip(chip) {
        // Remove chip from this.chips if found
        let found = false;
        for (let i = 0; i < this.chips.length; i++) {
            if (this.chips[i].id === chip.id) {
                this.chips.splice(i, 1);
                found = true;
                break;
            }
        }

        if (found) {
            this.pool.push(chip);
            chip.kill();
            return chip;
        }

        return null;
    }

    takeChips(chips) {
        chips = chips.slice();
        let newChips = [];
        for (let i = 0; i < chips.length; i++) {
            let newChip = this.takeChip(chips[i]);
            newChips.push(newChip);
        }

        return this.transferAnimation(newChips);
    }

    takeChip(srcChip) {
        let newChip = this.getChip();
        newChip.clone(srcChip);
        this.setChipInputs(newChip);

        srcChip.manager.clearChip(srcChip);

        this.value += srcChip.value;

        return newChip;
    }

    animateStackTransfer() {

    }

    animateChipCascade(chips) {
        const finished = new Phaser.Signal();

        let delay = 0;
        for (let i = 0; i < chips.length; i++) {
            let chip = chips[i];
            this.game.time.events.add(delay, () => {
                let randPos = this.randChipPos();
                let tween = this.game.add.tween(chip).to({x: randPos.x, y: randPos.y}, 200, Phaser.Easing.Quadratic.InOut, true);

                if (i === chips.length - 1) {
                    tween.onComplete.add(finished.dispatch, finished);
                }
            }, this);
            delay += 100;
        }

        return finished;
    }

    randChipPos() {
        return {
            x: this.game.rnd.integerInRange(-this.pileRadius, this.pileRadius),
            y: this.game.rnd.integerInRange(-this.pileRadius, this.pileRadius)
        };
    }
}

export default ChipManager;
