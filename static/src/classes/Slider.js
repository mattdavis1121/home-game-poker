/**
 * A slider UI element
 *
 * Represented by a bar sprite and a marker sprite. Despite how it may
 * look, all input occurs on the bar and updates are made to the
 * marker's position based on those inputs.
 */
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
        this.bar = this.game.add.image(0, 0, this.key, "slider_bar");
        this.bar.inputEnabled = true;
        this.bar.events.onInputDown.add(this.startDrag, this);
        this.bar.events.onInputUp.add(this.stopDrag, this);
        this.bar.events.onInputOver.add(() => this.enableSliderWheel(true));
        this.bar.events.onInputOut.add(() => this.enableSliderWheel(false));
        this.display.bar = this.bar;

        this.marker = this.game.add.sprite(0, 0, this.key, "slider_marker");
        this.marker.anchor.setTo(0.5, 0);
        this.marker.bottom = this.bar.bottom;
        this.display.marker = this.marker;
        this.bar.addChild(this.marker);
    }

    /**
     * @summary Enable slider dragging and initiate first drag event
     * @param {Phaser.Sprite} bar - The bar sprite that was clicked
     * @param {Phaser.Pointer} pointer - The pointer which initiated the click
     */
    startDrag(bar, pointer) {
        // Initial call to updateDrag allows changing bet with click on bar
        this.updateDrag(pointer, pointer.x, pointer.y);
        this.game.input.addMoveCallback(this.updateDrag, this);
    }

    /**
     * @summary Disable slider dragging
     */
    stopDrag() {
        this.game.input.deleteMoveCallback(this.updateDrag, this);
    }

    /**
     * @summary Calculate slider index based on drag input
     * @param {Phaser.Pointer} pointer - The sliding pointer
     * @param {number} x - The x coordinate of pointer
     * @param {number} y - The y coordinate of pointer
     */
    updateDrag(pointer, x, y) {
        let localX = x - this.bar.world.x;  // Click pos in relation to bar

        // Prevent dragging past bar bounds
        if (localX < 0) {
            localX = 0;
        } else if (localX > this.bar.width) {
            localX = this.bar.width;
        }

        const index = Math.round(localX / this.bar.width * this.length);
        this.setIndex(index);
    }

    /**
     * @summary Set the index of the slider and report the new value
     *
     * Optionally update the visual position of the marker on the slider.
     *
     * @param {number} index - New index to set on slider
     * @param {boolean} [updatePos=true] - Update the position of marker?
     */
    setIndex(index, updatePos = true) {
        if (index !== this.index) {
            this.index = index;
            this.indexChanged.dispatch(index);

            if (updatePos) {
                if (this.length === 1) {
                    // When only one bet available, it's a max bet
                    this.marker.x = this.bar.width;
                } else {
                    this.marker.x = this.bar.width / this.length * this.index;
                }
            }
        }
    }

    /**
     * @summary Update the length property
     *
     * The length property describes how many discrete bets the slider bar
     * must represent. The slider does not care about what the specific bet
     * it represents is, only that it has some number of indices along its
     * length and that it must report its index to listeners.
     *
     * @param {number} length - The new length to set
     */
    setLength(length) {
        if (length <= 0) {
            console.error("Cannot set slider length less than 1");
            return;
        } else if (length > this.bar.width) {
            console.warn("Warning: Setting slider stops greater than length may result in unexpected behavior");
        }
        this.length = length;
    }

    /**
     * @summary Enable or disable the slider
     * @param {boolean} enabled - Is the slider enabled?
     */
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