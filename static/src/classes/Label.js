/**
 * @summary Simple Phaser.Text extenstion to support automatic resizing
 *
 * If text bounds are set on instances of this class, then each time the text
 * or style is changed, the text will automatically scale itself down to fit
 * within those bounds horizontally. Vertical bounds are ignored.
 *
 * Possible upgrades:
 *   - Set minimum scale
 *   - If text still overflows min scale, then truncate
 */
class Label extends Phaser.Text {
    constructor(game, x, y, text, style) {
        super(game, x, y, text, style);
        this.anchor.setTo(0, 0.5);  // Center vertically to avoid jumps on resize
        this.resize();
    }

    setText(text, immediate) {
        super.setText(text, immediate);
        this.resize();
    }

    setStyle(style, update) {
        super.setStyle(style, update);
        this.resize();
    }

    /**
     * @summary Resize the text horizontally
     *
     * If text does not fit horizontally at full scale, then scale down
     * until it fits. Vertical overflow is ignored.
     */
    resize() {
        if (!this.textBounds) {
            return;
        }
        this.scale.setTo(1);
        if (this.width > this.textBounds.width) {
            this.scale.setTo(this.textBounds.width / this.width);
        }
    }
}

export default Label;