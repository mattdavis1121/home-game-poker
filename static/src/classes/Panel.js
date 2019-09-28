import Util from "../Util";
import Button from "./Button";
import Slider from "./Slider";
import Action from "./Action";

class Panel {
    constructor(game, key) {
        this.game = game;
        this.key = key;
        this.bets = [0];
        this.primaryClicked = new Phaser.Signal();
        this.primaryAction = Action.BET;
        this.primaryBet = 0;
        this.secondaryClicked = new Phaser.Signal();
        this.secondaryAction = Action.CHECK;
        this.secondaryBet = 0;
        this.tertiaryClicked = new Phaser.Signal();
        this.tertiaryAction = Action.FOLD;
        this.slider = new Slider(this.game, "panel");
        this.display = {};
        this.displayGroup = this.game.add.group();
        this.visible = false;
    }

    initialize() {
        this.display.primary = this.makeButton(0, 0, "med", () => this.primaryClicked.dispatch(this.primaryAction, this.primaryBet));
        this.display.secondary = this.makeButton(135, 0, "med", () => this.secondaryClicked.dispatch(this.secondaryAction, this.secondaryBet));
        this.display.tertiary = this.makeButton(270, 0, "med", () => this.tertiaryClicked.dispatch(this.tertiaryAction, 0));

        this.slider.initializeDisplay();
        this.slider.indexChanged.add((index) => this.setPrimaryBet(this.bets[index]), this);
        this.slider.sliderWheel.add(this.singleStepBet, this);
        this.display.slider = this.slider.bar;
        this.display.slider.y = 70;

        this.displayGroup.add(this.display.primary);
        this.displayGroup.add(this.display.secondary);
        this.displayGroup.add(this.display.tertiary);
        this.displayGroup.add(this.display.slider);
    }

    makeButton(x, y, size, callback) {
        let button = new Button(this.game, x, y, this.key);
        button.onInputUp.add(callback);
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
        let primaryText = "BET " + Util.parseCurrency(this.primaryBet);
        this.display.primary.setText(primaryText);

        let secondaryText = "CHECK";
        if (this.secondaryAction !== Action.CHECK) {
            secondaryText = "CALL " + Util.parseCurrency(this.secondaryBet);
        }
        this.display.secondary.setText(secondaryText);

        this.display.tertiary.setText("FOLD");
        this.slider.setLength(this.bets.length - 1);
        this.displayGroup.visible = this.visible;
    }

    setBets(bets) {
        this.bets = bets;
        this.primaryBet = bets[0];
        this.updateDisplay();
    }

    setPrimaryBet(bet) {
        this.primaryBet = bet;
        this.updateDisplay();
    }

    setSecondaryBet(bet) {
        this.secondaryBet = bet;
        this.secondaryAction = bet === 0 ? Action.CHECK : Action.BET;
        this.updateDisplay();
    }

    /**
     * @summary Hide or show the entire panel
     * @param {boolean} visible
     */
    setVisible(visible) {
        this.visible = visible;
        this.updateDisplay();
    }

    /**
     * @summary Increment or decrement this.primaryBet
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