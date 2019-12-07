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
        let delay = 0;
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (player.chips.chips.length) {
                let chips = player.chips.chips.slice();
                let value = player.chips.value;
                this.game.time.events.add(delay, () => {
                    this.amount += value;
                    this.chips.takeChips(chips);
                }, this);
                delay += 100;
            }
        }
    }
}

export default Pot;