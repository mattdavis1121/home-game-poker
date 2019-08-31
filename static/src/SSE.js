class SSE {
    constructor(game, url) {
        this.game = game;
        this.url = url;
        this.listeners = [];
        this.source = new EventSource(this.url);
        this.source.onerror = this.reconnect;
    }

    reconnect() {
        this.source = new EventSource(this.url);
        this.source.onerror = this.reconnect;  // TODO - Replace this hack with heartbeats

        let listeners = this.listeners;
        this.listeners = [];
        for (let i = 0; i < listeners.length; i++) {
            let listener = listeners[i];
            this.addListener(listener.type, listener.callback, listener.callbackContext, ...listener.args);
        }
    }

    addListener(type, callback, callbackContext, ...args) {
        // Store listeners for eventual reconnect
        this.listeners.push({
            "type": type,
            "callback": callback,
            "callbackContext": callbackContext,
            "args": args
        });

        this.source.addEventListener(type, (event) => {
            callback.call(callbackContext, ...args, event);
        });
    }
}

export default SSE;