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
            "nameplate": null,
            "name": null,
            "balance": null
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
    }

    /**
     * @summary Flash text
     */
    flash() {

    }

    set name(name) {
        this.display.name.setText(name);
    }

    set balance(balance) {
        this.display.balance.setText(Util.parseCurrency(balance));
    }
}

export default Nameplate;