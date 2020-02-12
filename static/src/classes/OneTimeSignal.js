/**
 * A signal which automatically calls added listeners if previously dispatched
 *
 * Before being dispatched, a OneTimeSignal works identically to Phaser.Signal.
 * You can add listeners to it and they will not be called until the signal
 * is dispatched. After being dispatched for the first time, any calls to
 * `add` will automatically execute the registered listener.
 *
 * @class OneTimeSignal
 */
class OneTimeSignal extends Phaser.Signal {
    constructor() {
        super();
        this._dispatched = false;
        this._args = [];
    }

    add(listener, listenerContext, priority, ...args) {
        const binding = super.add(listener, listenerContext, priority, ...args);

        if (this._dispatched) {
            binding.execute(this._args);
        }

        return binding;
    }

    dispatch(...args) {
        super.dispatch(...args);
        this._dispatched = true;
        this._args = args;
    }
}

export default OneTimeSignal;
