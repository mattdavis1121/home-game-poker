import Util from "../Util";

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
    }

    initialize() {
        this.display.bet = this.makeBtn(0, 0, "", this.game.textures.whiteSquare, () => this.betClicked.dispatch(this.betAmt));
        this.display.check = this.makeBtn(0, 0, "CHECK", this.game.textures.whiteSquare, () => this.checkClicked.dispatch());
        this.display.fold = this.makeBtn(0, 0, "FOLD", this.game.textures.whiteSquare, () => this.foldClicked.dispatch());
        this.display.betUp = this.makeBtn(0, 0, "+$0.10", this.game.textures.whiteSquare, this.betUpClicked);
        this.display.betDown = this.makeBtn(0, 0, "-$0.10", this.game.textures.whiteSquare, this.betDownClicked);
        this.display.join = this.makeBtn(0, 0, "JOIN", this.game.textures.whiteSquare, () => this.joinClicked.dispatch());

        this.updateDisplay();

        this.displayGroup.align(-1, 1, this.displayGroup.children[0].width * 1.2, 0);
    }

    updateDisplay() {
        this.display.bet.text.text = "BET\n" + Util.parseCurrency(this.betAmt);
    }

    makeBtn(x, y, text, texture, callback, callbackContext = this) {
        let btn = this.game.add.button(x, y, texture, callback, callbackContext);
        btn.anchor.setTo(0.5);

        let btnText = this.game.add.text(0, 0, text);
        btnText.anchor.setTo(0.5);
        btn.addChild(btnText);
        btn.text = btnText;

        this.displayGroup.add(btn);

        return btn;
    }

    betUpClicked() {
        this.betAmt += 10;
        this.updateDisplay();
    }

    betDownClicked() {
        if (this.betAmt > 10) {
            this.betAmt -= 10;
            this.updateDisplay();
        }
    }
}

export default Panel;