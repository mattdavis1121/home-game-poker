import Button from "./Button";

class Settings {
    constructor(game, key) {
        this.game = game;
        this.key = key;

        this.itemClicked = new Phaser.Signal();

        this.display = {
            icon: null,
            dropdownButtons: [],
            dropdownGroup: this.game.add.group(),
        };
        this.displayGroup = this.game.add.group();

        // Controls what items get added to in-game dropdown
        this.dropdownItems = ["leave"];
    }

    initializeDisplay() {
        this.display.icon = new Button(this.game, 0, 0, this.key, this.toggleDropdown, this);
        this.display.icon.frameName = "icon";

        for (let i = 0; i < this.dropdownItems.length; i++) {
            const itemName = this.dropdownItems[i];
            const button = new Button(this.game, 0, 0, this.key);

            button.right = this.display.icon.right;
            button.y = button.height * i + this.display.icon.height;

            button.setText(itemName);
            button.setFrames(
                "dropdown-over",
                "dropdown-out",
                "dropdown-down",
                "dropdown-over");
            button.onInputUp.add(() => {
                this.itemClicked.dispatch(itemName);
            }, this);

            this.display.dropdownButtons.push(button);
            this.display.dropdownGroup.add(button);
        }

        this.displayGroup.add(this.display.icon);
        this.displayGroup.add(this.display.dropdownGroup);

        this.display.dropdownGroup.visible = false;
    }

    toggleDropdown() {
        this.display.dropdownGroup.visible = !this.display.dropdownGroup.visible;
    }
}

export default Settings;
