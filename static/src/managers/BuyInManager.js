import Button from "../classes/Button";

class BuyInManager {
    constructor(game, key) {
        this.game = game;
        this.key = key;
        this.buyInRequested = new Phaser.Signal();
        this.seats = {};

        this.display = {"buttons": [], "modal": null, "inputBox": null};
        this.buttonsGroup = this.game.add.group();
        this.displayGroup = this.game.add.group();
        this.displayGroup.addChild(this.buttonsGroup);

        this.buttonsVisible = true;
        this.modalVisible = false;

        this.data = {"seatNum": null, "buyIn": null};
    }

    update() {
        if (this.display.inputField && this.display.inputField.visible) {
            this.display.inputField.update();
        }
    }

    initialize(seatConfig, occupiedSeats, modalConfig) {
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
            this.display.buttons.push(button);
            this.buttonsGroup.add(button);
        }
        this.buttonsGroup.visible = this.buttonsVisible;

        this.display.modal = this.game.add.image(modalConfig.x, modalConfig.y, this.key, "modal");
        this.displayGroup.addChild(this.display.modal);
        this.display.modal.visible = this.modalVisible;

        this.display.inputBox = this.game.add.image(modalConfig.inputBox.x, modalConfig.inputBox.y, this.key, "input_box");
        this.display.modal.addChild(this.display.inputBox);

        this.display.inputField = this.game.add.inputField(modalConfig.inputField.x, modalConfig.inputField.y, {
            font: '32px Arial',
            fill: '#333333',
            width: 220,
            padding: 8,
            borderWidth: 0,
            placeHolder: '20.00',
            type: PhaserInput.InputType.number,
            fillAlpha: 0
        });
        this.display.inputBox.addChild(this.display.inputField);

        const btnTextStyle = {
            "font": "bold 22pt Arial",
            "fill": "white",
            "align": "center"
        };

        this.display.cancel = new Button(this.game, modalConfig.cancelButton.x, modalConfig.cancelButton.y, this.key, this.cancel, this);
        this.display.cancel.setFrames(
            "btn_secondary_over",
            "btn_secondary_out",
            "btn_secondary_down",
            "btn_secondary_up"
        );
        this.display.cancel.setTextStyle(btnTextStyle);
        this.display.cancel.setText("CANCEL");
        this.display.modal.addChild(this.display.cancel);

        this.display.submit = new Button(this.game, modalConfig.submitButton.x, modalConfig.submitButton.y, this.key, this.submit, this);
        this.display.submit.setFrames(
            "btn_primary_over",
            "btn_primary_out",
            "btn_primary_down",
            "btn_primary_up"
        );
        this.display.submit.setTextStyle(btnTextStyle);
        this.display.submit.setText("BUY IN");
        this.display.modal.addChild(this.display.submit);


        // TODO - Remove
        this.display.modal.inputEnabled = true;
        this.display.modal.input.enableDrag();
        console.log(this.display.inputField);
        this.display.inputField.focusIn.add(() => console.log("focus in"));
        this.display.inputField.focusOut.add(() => console.log("focus out"));

        this.updateDisplay();
    }

    newPlayer(playerData) {
        this.seats[playerData.seat].occupied = true;
        this.updateDisplay();
    }

    playerLeft(playerData) {
        this.seats[playerData.seat].occupied = false;
        this.updateDisplay();
    }

    updateDisplay() {
        for (let seatNum in this.seats) {
            let seat = this.seats[seatNum];
            seat.button.visible = !seat.occupied;
        }
        this.buttonsGroup.visible = this.buttonsVisible;
        this.display.modal.visible = this.modalVisible;
    }

    buttonClicked(button) {
        this.data.seatNum = button.seatNum;
        this.buttonsVisible = false;
        this.modalVisible = true;
        this.updateDisplay();
    }

    cancel() {
        this.data = {"seatNum": null, "buyIn": null};
        this.buttonsVisible = true;
        this.modalVisible = false;
        this.updateDisplay();
    }

    submit() {
        this.data.buyIn = this.display.inputField.value;
        this.buyInRequested.dispatch(this.data.seatNum, this.data.buyIn);
        this.data = {"seatNum": null, "buyIn": null};
        this.modalVisible = false;
        this.buttonsVisible = false;
        this.updateDisplay();
    }
}

export default BuyInManager;