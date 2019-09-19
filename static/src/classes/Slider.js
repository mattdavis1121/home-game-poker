/**
 * TODO - Combine end assets into bar asset
 *
 * This looks pretty good, but the bar is hard to click. Need to make the
 * entire sprite taller. I could do something like add an invisible sprite
 * as a child of the bar which is what's in charge of accepting input, but
 * I think just changing the asset itself is the better choice.
 */

class Slider {
    constructor(game, key) {
        this.game = game;
        this.key = key;
        this.bar = null;  // The slider bar sprite
        this.marker = null;  // The draggable marker sprite
        this.index = 0;  // Current index of marker
        this.length = 1;  // Total number of indices
        this.prevX = 0;  // Needed to know when marker snaps to new pos
        this.display = {};
        this.indexChanged = new Phaser.Signal();
    }

    initializeDisplay() {
        this.bar = this.game.add.image(0, 0, this.key, "slider_bar_extended");
        this.bar.inputEnabled = true;
        this.bar.events.onInputDown.add(this.barClicked, this);
        this.display.bar = this.bar;

        this.display.leftEnd = this.game.add.image(0, this.bar.height / 2, this.key, "slider_end");
        this.display.leftEnd.anchor.setTo(0.5);
        this.bar.addChild(this.display.leftEnd);

        this.display.rightEnd = this.game.add.image(400, this.bar.height / 2, this.key, "slider_end");
        this.display.rightEnd.anchor.setTo(0.5);
        this.bar.addChild(this.display.rightEnd);

        this.marker = this.game.add.sprite(0, 22, this.key, "slider_marker");
        this.marker.anchor.setTo(0.5, 0);
        this.marker.inputEnabled = true;
        this.marker.input.enableDrag();
        this.marker.input.allowVerticalDrag = false;
        this.marker.input.boundsRect = new Phaser.Rectangle(
            -this.marker.width / 2,
            22,
            this.bar.width + this.marker.width,
            this.marker.height
        );
        this.marker.input.enableSnap(this.bar.width / this.length, 1);
        this.marker.events.onDragUpdate.add(this.markerDragged, this);
        this.display.marker = this.marker;
        this.bar.addChild(this.marker);
    }

    setIndex(index) {
        this.index = index;
        this.indexChanged.dispatch(index);
    }

    setLength(length) {
        if (length <= 0) {
            console.error("Cannot set slider length less than 1");
            return;
        } else if (length > this.bar.width) {
            console.warn("Warning: Setting slider stops greater than length may result in unexpected behavior");
        }
        this.length = length;
        this.marker.input.enableSnap(this.bar.width / length, 1);
    }

    /**
     * @summary Callback for input directly on the slider bar
     *
     * Allows users to click on the bar and have the marker snap to the
     * clicked position by exploiting some of Phaser's internals.
     *
     * @param {Phaser.Sprite} bar - The clicked sprite, should always be this.bar
     * @param {Phaser.Pointer} pointer - The pointer responsible for the click
     */
    barClicked(bar, pointer) {
        // If the slider hasn't been dragged before being clicked, we need
        // to spoof some cache data. Set the start point of the drag to the
        // leftmost point of the bar.
        if (!this.marker.input._dragPoint.x) {
            let ptr = new Phaser.Pointer(this.game, pointer.id, pointer.pointerMode);
            ptr.x = this.marker.world.x;
            ptr.y = this.marker.world.y;
            this.marker.input.startDrag(ptr);
        }
        this.marker.input.updateDrag(pointer, true);
    }

    /**
     * @summary Callback for marker. Dispatch signal on snap.
     *
     * The onDragUpdate callback is called very frequently by Phaser, but
     * not all of that information is helpful. This filters out most of those
     * calls so all we see are the updates for snaps to new locations on
     * the bar.
     *
     * NOTE: The params passed to this function are defined by Phaser
     * internals. All that's being used here is the snap param, which is how
     * we know if the marker has snapped to a new location.
     *
     * @param {Phaser.Sprite} marker - The dragged marker, unused
     * @param {Phaser.Pointer} pointer - The pointer initiating the drag, unused
     * @param {number} x - The new X coordinate of the sprite, unused
     * @param {number} y - The new Y coordinate of the sprite, unused
     * @param {Phaser.Point} snap - The Point to which the marker snapped
     */
    markerDragged(marker, pointer, x, y, snap) {
        if (snap.x !== this.prevX) {
            this.prevX = snap.x;
            this.setIndex(this.prevX / this.marker.input.snapX);
        }
    }
}

export default Slider;