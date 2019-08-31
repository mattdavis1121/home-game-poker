class SSE {
    constructor(game, url) {
        this.game = game;
        this.url = url;
        this.source = null;

        // TODO - Replace this hack with heartbeats
        this.connect();
        this.source.onerror = this.connect;
    }

    connect() {
        this.source = new EventSource(this.url);
    }

    addListener(type, callback, callbackContext, ...args) {
        this.source.addEventListener(type, (event) => {
            callback.call(callbackContext, ...args, event);
        });
    }
}

export default SSE;