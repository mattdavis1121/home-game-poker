import Label from "./Label";
import Util from "../Util";

class Nameplate extends Phaser.Image {
    constructor(game, x, y, key, config) {
        super(game, x, y, key);
        game.world.add(this);

        this.game = game;
        this.key = key;
        this.config = config || this.game.config.nameplate;

        this.display = {
            nameplate: null,
            name: null,
            balance: null,
            flash: null
        };
    }

    initializeDisplay() {
        this.display.nameplate = this;

        this.display.name = new Label(this.game, this.config.name.x, this.config.name.y, "", this.config.name.style);
        this.display.name.setTextBounds(0, 0, this.display.nameplate.width - 20, 0);
        this.addChild(this.display.name);

        this.display.balance = new Label(this.game, this.config.balance.x, this.config.balance.y, "", this.config.balance.style);
        this.display.balance.setTextBounds(0, 0, this.display.nameplate.width - 20, 0);
        this.addChild(this.display.balance);

        this.display.flash = new Label(this.game, this.display.nameplate.centerX, this.display.nameplate.centerY, "", this.config.flash.style);
        this.display.flash.setTextBounds(0, 0, this.display.nameplate.width - 20, 0);
        this.display.flash.anchor.setTo(0.5);
        this.display.flash.visible = false;
        this.addChild(this.display.flash);
    }

    /**
     * @summary Flash text for duration
     * @param {string} text - The text to displays
     * @param {number} [duration=2000] - Milliseconds to display text
     */
    flash(text, duration = 2000) {
        this.display.name.visible = false;
        this.display.balance.visible = false;
        this.display.flash.visible = true;
        this.display.flash.setText(text);

        this.game.time.events.add(duration, () => {
            this.display.name.visible = true;
            this.display.balance.visible = true;
            this.display.flash.visible = false;
        }, this);
    }

    set name(name) {
        this.display.name.setText(name);
    }

    set balance(balance) {
        this.display.balance.setText(Util.parseCurrency(balance));
    }
}

export default Nameplate;