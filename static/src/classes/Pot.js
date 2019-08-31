import Util from "../Util";

class Pot {
    constructor(game) {
        this.game = game;
        this.amount = 0;
        this.sprite = null;
    }

    initializeDisplay() {
        this.sprite = this.makeBtn(0, 0, "", this.game.textures.whiteRect, () => {});
        this.updateDisplay();
    }

    updateDisplay() {
        this.sprite.text.text = Util.parseCurrency(this.amount);
    }

    setAmount(amount) {
        this.amount = amount;
        this.updateDisplay();
    }

    makeBtn(x, y, text, texture, callback, callbackContext = this) {
        let btn = this.game.add.button(x, y, texture, callback, callbackContext);
        btn.anchor.setTo(0.5);

        let btnText = this.game.add.text(0, 0, text);
        btnText.anchor.setTo(0.5);
        btn.addChild(btnText);
        btn.text = btnText;

        return btn;
    }
}

export default Pot;