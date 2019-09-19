/**
 * A Phaser.Button with a Phaser.Text centered on the button
 *
 * This class is merely a thin wrapper around Phaser.Button to allow for
 * easy use of a text label on the button. The text is a child of the button,
 * so it moves when the button moves. It's centered on the button and scales
 * automatically to fix within the button's bounds.
 *
 * If none of the label functionality is used, this class is identical to
 * Phaser.Button.
 */
class Button extends Phaser.Button {
    constructor(game, x, y, key, callback, callbackcontext, overFrame, outFrame, downFrame, upFrame) {
        super(game, x, y, key, callback, callbackcontext, overFrame, outFrame, downFrame, upFrame);

        this.padding = 0;
        this.label = new Phaser.Text(this.game, 0, 0, "");
        this.addChild(this.label);

        // Must add to game world manually if not using game.add.button
        this.game.world.add(this);
    }

    setText(text) {
        this.label.text = text;
        this.rePosLabel();
    }

    setTextStyle(style) {
        this.label.setStyle(style);
        this.rePosLabel();
    }

    setPadding(padding) {
        this.padding = padding;
        this.rePosLabel();
    }

    rePosLabel() {
        this.label.scale.setTo(1);
        let textArea = this.width - this.padding * 2;
        if (this.label.width > textArea) {
            let reducedScale = textArea / this.label.width;
            this.label.scale.setTo(reducedScale);
        }
        this.label.centerX = this.width / 2;
        this.label.centerY = this.height / 2;
    }

}

export default Button;