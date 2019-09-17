import Util from "../Util";
import Button from "./Button";
import Slider from "./Slider";

class Panel {
    constructor(game) {
        this.game = game;

        this.display = {};
        this.displayGroup = this.game.add.group();

        this.betAmt = 10;

        this.betClicked = new Phaser.Signal();
        this.checkClicked = new Phaser.Signal();
        this.foldClicked = new Phaser.Signal();
        this.joinClicked = new Phaser.Signal();

        this.slider = new Slider(this.game, "panel");
    }

    initialize() {
        const style = this.game.config.panel.textStyle;
        const padding = this.game.config.panel.padding;

        this.display.primary = new Button(this.game, 0, 0, "panel", () => console.log("primary clicked"), this, "btn_lg_over", "btn_lg_out", "btn_lg_down", "btn_lg_up", "BET $0.00", style, padding);
        this.display.secondary = new Button(this.game, 270, 0, "panel", () => console.log("secondary clicked"), this, "btn_sml_over", "btn_sml_out", "btn_sml_down", "btn_sml_up", "Check", style, padding);

        this.slider.initializeDisplay();
        this.minDenom = 25;
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

    updateDisplay() {
        this.display.primary.setText("BET " + Util.parseCurrency(this.betAmt));
    }
}

export default Panel;