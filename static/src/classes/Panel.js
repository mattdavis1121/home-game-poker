import Util from "../Util";
import Button from "./Button";
import Slider from "./Slider";

class Panel {
    constructor(game, key) {
        this.game = game;
        this.key = key;

        this.display = {};
        this.displayGroup = this.game.add.group();

        this.betAmt = 0;
        this.minDenom = 1;

        this.primaryClicked = new Phaser.Signal();
        this.secondaryClicked = new Phaser.Signal();

        this.slider = new Slider(this.game, "panel");
    }

    initialize() {
        this.display.primary = this.makeButton(0, 0, "lg", this.primaryClicked);
        this.display.secondary = this.makeButton(270, 0, "sml", this.secondaryClicked);

        // TODO - Should be this.display.slider, panel is agnostic to what UI elements it contains
        this.slider.initializeDisplay();
        this.slider.indexChanged.add((index) => {
            this.betAmt = this.minDenom * index;
            this.updateDisplay();
        }, this);
        this.display.slider = this.slider.bar;
        this.display.slider.y = 70;
        this.slider.setLength(20);

        this.displayGroup.add(this.display.primary);
        this.displayGroup.add(this.display.secondary);
        this.displayGroup.add(this.display.slider);
    }

    makeButton(x, y, size, signal) {
        let button = new Button(this.game, x, y, this.key);
        button.onInputUp.add(signal.dispatch, signal);
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
        this.display.primary.setText("BET " + Util.parseCurrency(this.betAmt));
    }
}

export default Panel;