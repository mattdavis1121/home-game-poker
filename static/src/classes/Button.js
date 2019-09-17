/**
 * A Phaser.Button with a Phaser.Text centered on the button
 */
class Button extends Phaser.Button {
    constructor(game, x, y, key, callback, callbackcontext, overFrame, outFrame, downFrame, upFrame, text, style, padding = 0) {
        super(game, x, y, key, callback, callbackcontext, overFrame, outFrame, downFrame, upFrame);

        this.padding = padding;
        this.label = new Phaser.Text(this.game, 0, 0, "", style);
        this.addChild(this.label);
        this.setText(text);

        // Must add to game world manually if not using game.add.button
        this.game.world.add(this);
    }

    setText(text) {
        this.label.text = text;
        this.rePos();
    }

    rePos() {
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