import ChipManager from "../managers/ChipManager";

class Pot {
    constructor(game) {
        this.game = game;
        this.amount = 0;
        this.sprite = null;
        this.chips = new ChipManager(this.game, "chips", this.game.config.denoms);
        this.chips.stackChips = false;
        this.chips.colorUp = false;
    }

    initializeDisplay() {
        this.chips.initializeDisplay();
    }

    updateDisplay() {
        this.chips.setValue(this.amount);
    }

    setAmount(amount) {
        this.amount = amount;
        this.updateDisplay();
    }

    gatherChips(players) {
        const finished = new Phaser.Signal();
        const playersWithChips = players.filter(player => player.chips.chips.length);

        let delay = 0;
        for (let i = 0; i < playersWithChips.length; i++) {
            const player = playersWithChips[i];
            this.game.time.events.add(delay, () => {
                this.amount += player.chips.value;
                const takeChipsFinished = this.chips.takeChips(player.chips.chips);

                if (i === playersWithChips.length - 1) {
                    takeChipsFinished.add(() => finished.dispatch());
                }
            }, this);
            delay += 100;
        }

        return finished;
    }
}

export default Pot;
