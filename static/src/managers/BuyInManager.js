import Button from "../classes/Button";

class BuyInManager {
    constructor(game, key) {
        this.game = game;
        this.key = key;
        this.seats = {};
        this.displayGroup = this.game.add.group();
        this.buyInRequested = new Phaser.Signal();
        this.groupVisible = true;
        this.takenSeats = [];
    }

    initialize(seatConfig, occupiedSeats) {
        for (let i = 0; i < seatConfig.length; i++) {
            let button = new Button(this.game, seatConfig[i].x, seatConfig[i].y, this.key, this.buttonClicked, this);
            button.seatNum = i; // Store for use on click
            button.setFrames(
                "btn_buyin_over",
                "btn_buyin_out",
                "btn_buyin_down",
                "btn_buyin_up"
            );
            button.setText("Buy In");
            this.seats[i] = {
                "button": button,
                "occupied": occupiedSeats.indexOf(i) !== -1
            };
            this.displayGroup.add(button);
        }
        this.updateDisplay();
    }

    updateDisplay() {
        for (let seatNum in this.seats) {
            let seat = this.seats[seatNum];
            seat.button.visible = !seat.occupied;
        }
        this.displayGroup.visible = this.groupVisible;
    }

    buttonClicked(button) {
        this.buyInRequested.dispatch(button.seatNum);
    }
}

export default BuyInManager;