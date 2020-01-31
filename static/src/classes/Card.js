const FLIP_SPEED_MS = 500;
const ZOOM = 1.2;

class Card extends Phaser.Sprite {
    constructor(game, x, y, key, manager) {
        super(game, x, y, key);
        game.world.add(this);

        this.game = game;
        this.key = key;
        this.manager = manager;

        this._name = null;
        this._faceUp = null;

        this.anchor.setTo(0.5);
        this.inputEnabled = true;
        this.updateDisplay();
    }

    set name(name) {
        this._name = name;
        this.updateDisplay();
    }

    get name() {
        return this._name;
    }

    set faceUp(faceUp) {
        if (faceUp && !this._name) {
            console.warn("Can't turn nameless card face up");
            return;
        }

        this._faceUp = faceUp;
        this.updateDisplay();
    }

    get faceUp() {
        return this._faceUp;
    }

    initialize(data) {
        this.name = data.name;
        // TODO - initialize faceUp
    }

    updateDisplay() {
        this.frameName = this._faceUp ? this._name : "back";
    }

    flip() {
        this.faceUp = !this.faceUp;
    }

    animateFlip() {
        if (!this._name) {
            console.warn("Can't flip a card without a name");
            return;
        }

        let flipTween = this.game.add.tween(this.scale).to({x: 0, y: ZOOM}, FLIP_SPEED_MS / 2);
        let backFlipTween = this.game.add.tween(this.scale).to({x: 1, y: 1}, FLIP_SPEED_MS / 2);
        flipTween.onComplete.add(() => {
            this.flip();
            backFlipTween.start();
        });
        flipTween.start();
        return backFlipTween.onComplete;
    }
}

export default Card;
