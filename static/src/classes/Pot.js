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
}

export default Pot;