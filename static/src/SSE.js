class SSE {
    constructor(game, url) {
        this.game = game;
        this.source = new EventSource(url);
    }

    addListener(type, callback, callbackContext, ...callbackArgs) {
        this.source.addEventListener(type, (event, ...callbackArgs) => {
            callbackContext.callback(...callbackArgs, event);
        });
    }
}