import OneTimeSignal from "./OneTimeSignal";

const BUTTON_STYLES = {
    PLAIN: 0,
    LETTER: 1,
    TEXT: 2
};

class DealerButton extends Phaser.Sprite {
    constructor(game, x, y, key, config) {
        key = key || "dealerButton";
        super(game, x, y, key);
        game.world.add(this);

        this.game = game;
        this.key = key;
        this.config = config || this.game.config.dealerButton;

        this._seat = 0;
        this.frame = BUTTON_STYLES.TEXT;

        this.anchor.setTo(0.5);
        this.seat = 0;
    }

    set seat(seatNum) {
        this._seat = seatNum;
        this.x = this.config[seatNum].x;
        this.y = this.config[seatNum].y;
    }

    moveToSeat(seatNum) {
        const finished = new OneTimeSignal();
        const x = this.config[seatNum].x;
        const y = this.config[seatNum].y;

        this.game.add.tween(this).to({x: x, y: y}, 500, Phaser.Easing.Quadratic.InOut, true).onComplete.add(finished.dispatch, finished);

        return finished;
    }
}

export default DealerButton;
