class Panel {
    constructor(game) {
        this.game = game;

        this.display = {};
        this.displayGroup = this.game.add.group();
    }

    initialize() {
        this.display.check = this.makeBtn(0, 0, "CHECK", this.game.textures.whiteSquare, this.checkClicked);
        this.display.bet = this.makeBtn(0, 0, "BET", this.game.textures.whiteSquare, this.betClicked);
        this.display.fold = this.makeBtn(0, 0, "FOLD", this.game.textures.whiteSquare, this.foldClicked);
    }

    makeBtn(x, y, text, texture, callback) {
        let btn = this.game.add.button(x, y, texture, callback, this);
        btn.anchor.setTo(0.5);

        let btnText = this.game.add.text(0, 0, text);
        btnText.anchor.setTo(0.5);
        btn.addChild(btnText);
        btn.text = btnText;

        return btn;
    }

    sendRequest(endpoint, data, method = "post") {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                this.checkClicked(xhr.responseText)
            }
        };
        xhr.open(method, endpoint);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
    }

    checkClicked() {

    }

    handle() {

    }

    betClicked() {

    }

    foldClicked() {

    }
}

export default Panel;