import Button from "../classes/Button";

class BuyInManager {
    constructor(game, key) {
        this.game = game;
        this.key = key;
        this.displayGroup = this.game.add.group();
        this.buyInRequested = new Phaser.Signal();
    }

    initialize(seatConfig) {
        for (let i = 0; i < seatConfig.length; i++) {
            let button = new Button(this.game, seatConfig[i].x, seatConfig[i].y, this.key, () => {console.log("Buy in pressed: " + i)});
            button.setFrames(
                "btn_buyin_over",
                "btn_buyin_out",
                "btn_buyin_down",
                "btn_buyin_up"
            );
            button.setText("Buy In");
        }
    }
}

export default BuyInManager;