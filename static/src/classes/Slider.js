class Slider {
    constructor(game, key) {
        this.game = game;
        this.key = key;
        this.bar = null;  // The slider bar sprite
        this.marker = null;  // The draggable marker sprite
        this.index = 0;  // Current index of marker
        this.length = 1;  // Total number of indices
        this.display = {};
        this.indexChanged = new Phaser.Signal();
        this.sliderWheel = new Phaser.Signal();
    }

    initializeDisplay() {
        this.bar = this.game.add.image(0, 0, this.key, "slider_bar_extended");
        this.bar.inputEnabled = true;
        this.bar.events.onInputDown.add(this.startDrag, this);
        this.bar.events.onInputUp.add(this.stopDrag, this);
        this.bar.events.onInputOver.add(() => this.enableSliderWheel(true));
        this.bar.events.onInputOut.add(() => this.enableSliderWheel(false));
        this.display.bar = this.bar;

        this.marker = this.game.add.sprite(0, 22, this.key, "slider_marker");
        this.marker.anchor.setTo(0.5, 0);
        this.display.marker = this.marker;
        this.bar.addChild(this.marker);
    }

    startDrag(bar, pointer) {
        // Initial call to updateDrag allows changing bet with click on bar
        this.updateDrag(pointer, pointer.x, pointer.y);
        this.game.input.addMoveCallback(this.updateDrag, this);
    }

    stopDrag() {
        this.game.input.deleteMoveCallback(this.updateDrag, this);
    }

    updateDrag(pointer, x, y) {
        let localX = x - this.bar.world.x;

        // Prevent dragging past bar bounds
        if (localX < 0) {
            localX = 0;
        } else if (localX > this.bar.width) {
            localX = this.bar.width;
        }

        const index = Math.round(localX / this.bar.width * this.length);
        this.setIndex(index, true);
    }

    setIndex(index, updatePos = false) {
        this.index = index;
        this.indexChanged.dispatch(index);

        if (updatePos) {
            this.marker.x = this.bar.width / this.length * this.index;
        }
    }

    setLength(length) {
        if (length <= 0) {
            console.error("Cannot set slider length less than 1");
            return;
        } else if (length > this.bar.width) {
            console.warn("Warning: Setting slider stops greater than length may result in unexpected behavior");
        }
        this.length = length;
    }

    setEnabled(enabled) {
        this.bar.inputEnabled = enabled;

        let tint = enabled ? 0xFFFFFF : 0x808080;
        this.display.bar.tint = tint;
        this.display.marker.tint = tint;
    }

    /**
     * @summary Enable or disable dispatch of signal on wheel scroll
     * @param {boolean} enabled - Is the callback enabled or disabled?
     */
    enableSliderWheel(enabled) {
        if (enabled) {
            this.game.input.mouse.mouseWheelCallback = () => {
                this.sliderWheel.dispatch(this.game.input.mouse.wheelDelta);
            };
        } else {
            this.game.input.mouse.mouseWheelCallback = null;
        }
    }
}

export default Slider;