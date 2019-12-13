/**
 * @summary Track and queue tweens game wide
 *
 * It's easy to chain tweens when they're created at the same point
 * in time, but what if two tweens are created at completely different
 * points? What if those tweens need to run consecutively, the second
 * waiting for the first to complete before starting?
 */

class TweenQueue {
    constructor(game) {
        this.game = game;

        this.queue = [];
        this.current = null;
    }

    get running() {
        return !!this.current;
    }

    /**
     * @summary Add a tween to the queue
     * @param {Phaser.Tween} tween - The tween to add to the queue
     */
    add(tween) {
        // Tweens added to the queue may have other onComplete callbacks,
        // but they must at least have this one, which triggers the
        // next tween in the queue to begin
        tween.onComplete.add(this.next, this);

        // Add to the front, remove from the back
        this.queue.unshift(tween);

        // Auto start the chain if it's not already running
        if (!this.running) {
            this.next();
        }
    }

    /**
     * @summary Start the next tween in the queue
     */
    next() {
        this.current = this.queue.pop();
        if (this.current) {
            this.current.start();
        }
    }
}

export default TweenQueue;