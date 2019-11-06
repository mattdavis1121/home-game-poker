class Controller {
    constructor(game, playerId, token) {
        this.game = game;
        this.playerId = playerId;
        this.token = token;
    }

    /**
     * @summary Set the access token used to authenticate on API calls
     * @param {string} token - The Flask-JWT-Extended access token
     */
    setToken(token) {
        this.token = token;
    }

    /**
     * @summary Send a request to the server
     *
     * Only errors are reported. Success is silent. Game changes resulting
     * from requests are handled via Server Sent Events.
     *
     * @param {string} endpoint - The endpoint on the server to send request to
     * @param {object} data - The payload to send
     * @param {string} [method="POST] - The HTTP method to use
     */
    sendRequest(endpoint, data, method = "POST") {
        let xhr = new XMLHttpRequest();
        xhr.open(method, endpoint);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let resp = JSON.parse(xhr.responseText);
                // Invalid request error
                if (resp.success === false) {
                    console.warn(resp);
                }
            } else if (xhr.readyState === 4 && xhr.status !== 200) {
                // Failed request error
                console.error(JSON.parse(xhr.responseText));
            }
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
        xhr.send(JSON.stringify(data));
    }

    /**
     * @summary Send an action request
     *
     * This is the most heavily-used request type in the game. All in-game
     * actions (bet, check, fold) happen here.
     *
     * @param {object} data - The payload to send
     */
    action(data) {
        const url = this.buildUrl("action");
        this.sendRequest(url, data);
    }

    check() {
        const data = this.buildPayload("CHECK");
        this.action(data);
    }

    bet(amt) {
        const data = this.buildPayload("BET", amt);
        this.action(data);
    }

    fold() {
        const data = this.buildPayload("FOLD");
        this.action(data);
    }

    bb() {
        const data = this.buildPayload("BLIND", 50);
        this.action(data);
    }

    sb() {
        const data = this.buildPayload("BLIND", 25);
        this.action(data);
    }

    join(seatNum, buyIn) {
        const data = {"position": seatNum, "amount": buyIn};
        const url = this.buildUrl("join");
        this.sendRequest(url, data);
    }

    leave() {
        const data = {};
        const url = this.buildUrl("leave");
        this.sendRequest(url, data);
    }

    /**
     * @summary Send a beacon to the server on disconnect
     *
     * This allows for server to know when a client disconnects so
     * it can clean up as necessary. No guarantee that this message
     * will go through, so must have redundant measures in place.
     */
    disconnectBeacon() {
        const data = {};
        const url = "/disconnect/";
        navigator.sendBeacon(url, data);
    }

    buildPayload(actionType, betAmt = 0) {
        return {
            "playerId": this.playerId,
            "actionType": actionType,
            "betAmt": betAmt
        }
    }

    buildUrl(endpoint) {
        return this.game.initialData.tableUrl + endpoint + "/";
    }
}

export default Controller;