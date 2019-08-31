class SSE {
    constructor(game, url) {
        this.game = game;
        this.url = url;
        this.source = null;

        this.connect();
    }

    connect() {
        this.source = new EventSource(this.url);
        this.source.onerror = this.connect;  // TODO - Replace this hack with heartbeats
    }

    addListener(type, callback, callbackContext, ...args) {
        this.source.addEventListener(type, (event) => {
            callback.call(callbackContext, ...args, event);
        });
    }
}

export default SSE;