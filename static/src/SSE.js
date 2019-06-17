class SSE {
    constructor(game, url) {
        this.game = game;
        this.source = new EventSource(url);
    }

    addListener(type, callback, callbackContext, ...args) {
        this.source.addEventListener(type, (event) => {
            callback.call(callbackContext, ...args, event);
        });
    }
}

export default SSE;