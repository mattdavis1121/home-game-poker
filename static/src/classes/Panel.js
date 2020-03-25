import Util from "../Util";
import Button from "./Button";
import Slider from "./Slider";
import {Action} from "./Action";

class Panel {
    constructor(game, key) {
        this.game = game;
        this.key = key;
        this.bets = [0];

        // Always dispatched with two args: actionType and betAmt
        this.buttonClicked = new Phaser.Signal();

        this.primaryAction = Action.BET;
        this.primaryBet = 0;
        this.secondaryAction = Action.CHECK;
        this.secondaryBet = 0;
        this.tertiaryAction = Action.FOLD;
        this.blindAction = Action.BLIND;
        this.blindBet = 0;

        this.slider = new Slider(this.game, "panel");
        this.display = {
            primaryGroup: this.game.add.group(),
            primary: null,
            secondary: null,
            tertiary: null,
            slider: null,
            blindGroup: this.game.add.group(),
            yes: null,
            no: null,
        };
        this.displayGroup = this.game.add.group();
        this.visible = false;
        this.alwaysVisible = false;
    }

    initialize() {
        this.display.primary = this.makeButton(0, 0, "med", () => this.buttonClicked.dispatch(this.primaryAction, this.primaryBet));
        this.display.secondary = this.makeButton(135, 0, "med", () => this.buttonClicked.dispatch(this.secondaryAction, this.secondaryBet));
        this.display.tertiary = this.makeButton(270, 0, "med", () => this.buttonClicked.dispatch(this.tertiaryAction, 0));

        this.slider.initializeDisplay();
        this.slider.indexChanged.add((index) => this.setPrimaryBet(this.bets[index]), this);
        this.slider.sliderWheel.add(this.singleStepBet, this);
        this.display.slider = this.slider.bar;
        this.display.slider.y = 60;

        this.display.primary.events.onInputOver.add(() => this.slider.enableSliderWheel(true));
        this.display.primary.events.onInputOut.add(() => this.slider.enableSliderWheel(false));

        this.display.primaryGroup.add(this.display.primary);
        this.display.primaryGroup.add(this.display.secondary);
        this.display.primaryGroup.add(this.display.tertiary);
        this.display.primaryGroup.add(this.display.slider);

        this.display.blind = this.makeButton(135, 0, "med", () => this.buttonClicked.dispatch(this.blindAction, this.blindBet));
        this.display.blind.setText("BLIND");
        this.display.sitOut = this.makeButton(270, 0, "med", () => console.log("PLAYER REQUESTED SIT OUT"));    // TODO - Real sit out action
        this.display.sitOut.setText("SIT OUT");

        this.display.blindGroup.add(this.display.blind);
        this.display.blindGroup.add(this.display.sitOut);

        this.displayGroup.add(this.display.primaryGroup);
        this.displayGroup.add(this.display.blindGroup);

        this.setActivePanelGroup("primary");

        this.updateDisplay();
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
        // Panel updates require players' current bets, so if
        // there is no next player we shouldn't update the display
        if (!this.game.players.nextPlayer) {
            return;
        }

        let actionText = this.game.roundBet === 0 ? "BET " : "RAISE TO\n";
        let primaryText = actionText + Util.parseCurrency(this.primaryBet + this.game.players.nextPlayer.roundBet);
        this.display.primary.setText(primaryText);

        let secondaryText = "CHECK";
        if (this.secondaryAction !== Action.CHECK) {
            secondaryText = "CALL " + Util.parseCurrency(this.secondaryBet);
        }
        this.display.secondary.setText(secondaryText);

        this.display.tertiary.setText("FOLD");
        this.displayGroup.visible = this.visible;
    }

    setBets(bets) {
        if (bets.length < 1) {
            console.error("Invalid bets. Panel must always have at least one valid bet.");
            return;
        }

        this.bets = bets;
        this.primaryBet = bets[0];
        this.slider.setLength(bets.length);
        this.slider.setIndex(0);
        this.slider.setEnabled(bets.length > 1);
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
        this.visible = visible || this.alwaysVisible;
        this.updateDisplay();
    }

    /**
     * @summary Increment or decrement this.primaryBet
     * @param {Phaser.Mouse.wheelDelta} modifier - +1 or -1
     */
    singleStepBet(modifier) {
        let index = this.slider.index + modifier;
        if (index >= 0 && index < this.slider.length) {
            this.slider.setIndex(index);
        }
    }

    setActivePanelGroup(groupName) {
        switch (groupName) {
            case "blind":
                this.display.blindGroup.visible = true;
                this.display.primaryGroup.visible = false;
                break;
            case "primary":
                this.display.blindGroup.visible = false;
                this.display.primaryGroup.visible = true;
                break;
        }
    }
}

export default Panel;
