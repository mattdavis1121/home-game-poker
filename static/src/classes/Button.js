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

        this.enabled = true;
        this.labelPadding = 10;
        this.labelText = "";
        this.labelStyle = {};
        this.label = new Phaser.Text(this.game, 0, 0, this.labelText);
        this.addChild(this.label);

        // Must add to game world manually if not using game.add.button
        this.game.world.add(this);
    }

    /**
     * @summary Set the text displayed on the button
     * @param {string} text - The text to display
     * @param {boolean} force - Force display update despite of this.enabled?
     */
    setText(text, force = false) {
        this.labelText = text;
        this.updateLabel(force);
    }

    /**
     * @summary Set the style for the button text
     * @param {object} style - The text style to use
     * @param {boolean} force - Force display update despite of this.enabled?
     */
    setTextStyle(style, force = false) {
        this.labelStyle = style;
        this.updateLabel(force);
    }

    /**
     * @summary Set the padding between the text and the button perimeter
     * @param {number} padding - The padding in pixels
     * @param {boolean} force - Force display update despite of this.enabled?
     */
    setPadding(padding, force = false) {
        this.labelPadding = padding;
        this.updateLabel(force);
    }

    /**
     * @summary Enable or disable the button
     * On disable, disables all input to the button and renders it grayed
     * out. All updates are delayed until re-enable, unless forced.
     * @param {boolean} enabled - Enable or disable button?
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        this.inputEnabled = enabled;
        let tint = enabled ? 0xFFFFFF : 0x808080;
        this.tint = tint;
        this.label.tint = tint;

        // Update on re-enable
        if (enabled) {
            this.updateLabel();
        }
    }

    /**
     * @summary Update all button attributes to current properties
     *
     * If the button is disabled, this will have no effect. The
     * developer may optionally choose to force the update.
     *
     * @param {boolean} force - Force the update?
     */
    updateLabel(force = false) {
        if (this.enabled || force) {
            this.label.text = this.labelText;
            this.label.setStyle(this.labelStyle);
            this.rePosLabel();
        }
    }

    /**
     * @summary Scale label text to fit on button and center
     */
    rePosLabel() {
        this.label.scale.setTo(1);
        let textArea = this.width - this.labelPadding * 2;
        if (this.label.width > textArea) {
            let reducedScale = textArea / this.label.width;
            this.label.scale.setTo(reducedScale);
        }
        this.label.centerX = this.width / 2;
        this.label.centerY = this.height / 2;
    }

}

export default Button;