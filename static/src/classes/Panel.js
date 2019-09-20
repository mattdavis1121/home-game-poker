import Util from "../Util";
import Button from "./Button";
import Slider from "./Slider";
import Action from "./Action";

class Panel {
    constructor(game, key) {
        this.game = game;
        this.key = key;
        this.betAmt = 0;
        this.minDenom = 1;
        this.primaryClicked = new Phaser.Signal();
        this.primaryAction = Action.BET;
        this.secondaryClicked = new Phaser.Signal();
        this.secondaryAction = Action.CHECK;
        this.slider = new Slider(this.game, "panel");
        this.display = {};
        this.displayGroup = this.game.add.group();
    }

    initialize() {
        this.display.primary = this.makeButton(0, 0, "lg", () => this.primaryClicked.dispatch(this.primaryAction));
        this.display.secondary = this.makeButton(270, 0, "sml", () => this.secondaryClicked.dispatch(this.secondaryAction));

        this.slider.initializeDisplay();
        this.slider.indexChanged.add((index) => this.setBetAmt(this.minDenom * index), this);
        this.slider.sliderWheel.add(this.singleStepBet, this);
        this.display.slider = this.slider.bar;
        this.display.slider.y = 70;

        this.displayGroup.add(this.display.primary);
        this.displayGroup.add(this.display.secondary);
        this.displayGroup.add(this.display.slider);
    }

    makeButton(x, y, size, signal) {
        let button = new Button(this.game, x, y, this.key);
        button.onInputUp.add(signal);
        button.setFrames(
            "btn_" + size + "_over",
            "btn_" + size + "_out",
            "btn_" + size + "_down",
            "btn_" + size + "_up"
        );
        button.setTextStyle(this.game.config.panel.textStyle);
        return button;
    }

    updateDisplay() {
        let p = "BET " + Util.parseCurrency(this.betAmt);
        let s = this.secondaryAction === Action.CHECK ? "CHECK" : "FOLD";
        this.display.primary.setText(p);
        this.display.secondary.setText(s);
    }

    setBetAmt(bet) {
        this.betAmt = bet;
        this.updateDisplay();
    }

    setMinDenom(denom) {
        this.minDenom = denom;
        this.updateDisplay();
    }

    setPrimaryAction(action) {
        this.primaryAction = action;
        this.updateDisplay();
    }

    setSecondaryAction(action) {
        this.secondaryAction = action;
        this.updateDisplay();
    }

    setEnabled(enabled) {
        this.display.primary.setEnabled(enabled);
        this.display.secondary.setEnabled(enabled);
        this.slider.setEnabled(enabled);
    }

    /**
     * @summary Increment or decrement this.betAmt
     * @param {Phaser.Mouse.wheelDelta} modifier - +1 or -1
     */
    singleStepBet(modifier) {
        let index = this.slider.index + modifier;
        if (index >= 0 && index <= this.slider.length) {
            this.slider.setIndex(index, true);
        }
    }
}

export default Panel;