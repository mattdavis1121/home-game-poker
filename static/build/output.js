(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _Boot = require("./states/Boot");

var _Boot2 = _interopRequireDefault(_Boot);

var _Load = require("./states/Load");

var _Load2 = _interopRequireDefault(_Load);

var _Main = require("./states/Main");

var _Main2 = _interopRequireDefault(_Main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Game = function (_Phaser$Game) {
    _inherits(Game, _Phaser$Game);

    function Game() {
        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, {
            width: 1920,
            height: 1080
        }));

        _this.state.add("boot", _Boot2.default, false);
        _this.state.add("load", _Load2.default, false);
        _this.state.add("main", _Main2.default, false);

        _this.state.start("boot");
        return _this;
    }

    return Game;
}(Phaser.Game);

new Game();

},{"./states/Boot":15,"./states/Load":16,"./states/Main":17}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SSE = function () {
    function SSE(game, url) {
        _classCallCheck(this, SSE);

        this.game = game;
        this.url = url;
        this.listeners = [];
        this.source = new EventSource(this.url);
    }

    /**
     * @summary Re adds all listeners to this.source
     *
     * I originally wrote this to support client reconnects, but I don't need
     * that anymore. Keeping the listener code just in case.
     */


    _createClass(SSE, [{
        key: "reAddAllListeners",
        value: function reAddAllListeners() {
            var listeners = this.listeners;
            this.listeners = [];
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                this.addListener.apply(this, [listener.type, listener.callback, listener.callbackContext].concat(_toConsumableArray(listener.args)));
            }
        }
    }, {
        key: "addListener",
        value: function addListener(type, callback, callbackContext) {
            for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                args[_key - 3] = arguments[_key];
            }

            // Store listeners for eventual reconnect
            this.listeners.push({
                "type": type,
                "callback": callback,
                "callbackContext": callbackContext,
                "args": args
            });

            this.source.addEventListener(type, function (event) {
                callback.call.apply(callback, [callbackContext].concat(args, [event]));
            });
        }
    }]);

    return SSE;
}();

exports.default = SSE;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Util = function () {
    function Util() {
        _classCallCheck(this, Util);
    }

    _createClass(Util, null, [{
        key: "parseCurrency",

        /**
         * @summary Return a formatted currency string from an integer
         */
        value: function parseCurrency(int) {
            var val = int / 100;
            return "$" + val.toFixed(2);
        }
    }]);

    return Util;
}();

exports.default = Util;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A Phaser.Button with a Phaser.Text centered on the button
 *
 * This class is merely a thin wrapper around Phaser.Button to allow for
 * easy use of a text label on the button. The text is a child of the button,
 * so it moves when the button moves. It's centered on the button and scales
 * automatically to fix within the button's bounds.
 *
 * If none of the label functionality is used, this class is identical to
 * Phaser.Button.
 */
var Button = function (_Phaser$Button) {
    _inherits(Button, _Phaser$Button);

    function Button(game, x, y, key, callback, callbackcontext, overFrame, outFrame, downFrame, upFrame) {
        _classCallCheck(this, Button);

        var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, game, x, y, key, callback, callbackcontext, overFrame, outFrame, downFrame, upFrame));

        _this.padding = 0;
        _this.label = new Phaser.Text(_this.game, 0, 0, "");
        _this.addChild(_this.label);

        // Must add to game world manually if not using game.add.button
        _this.game.world.add(_this);
        return _this;
    }

    _createClass(Button, [{
        key: "setText",
        value: function setText(text) {
            this.label.text = text;
            this.rePosLabel();
        }
    }, {
        key: "setTextStyle",
        value: function setTextStyle(style) {
            this.label.setStyle(style);
            this.rePosLabel();
        }
    }, {
        key: "setPadding",
        value: function setPadding(padding) {
            this.padding = padding;
            this.rePosLabel();
        }
    }, {
        key: "rePosLabel",
        value: function rePosLabel() {
            this.label.scale.setTo(1);
            var textArea = this.width - this.padding * 2;
            if (this.label.width > textArea) {
                var reducedScale = textArea / this.label.width;
                this.label.scale.setTo(reducedScale);
            }
            this.label.centerX = this.width / 2;
            this.label.centerY = this.height / 2;
        }
    }]);

    return Button;
}(Phaser.Button);

exports.default = Button;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Card = function () {
    function Card(game, manager) {
        _classCallCheck(this, Card);

        this.game = game;
        this.manager = manager;
        this.name = null; // String ID of card, e.g. 'Kh' or '7s'
        this.sprite = null;
    }

    _createClass(Card, [{
        key: "initialize",
        value: function initialize(data) {
            this.name = data.name;
        }
    }, {
        key: "initializeDisplay",
        value: function initializeDisplay() {
            this.sprite = this.game.add.sprite(0, 0, "cards");
            this.sprite.anchor.setTo(0.5);
            this.sprite.scale.setTo(1.5);

            this.updateDisplay();
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            this.sprite.frameName = this.name ? this.name : "back";
        }
    }]);

    return Card;
}();

exports.default = Card;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function () {
    function Controller(game, playerId, token) {
        _classCallCheck(this, Controller);

        this.game = game;
        this.playerId = playerId;
        this.token = token;
    }

    /**
     * @summary Set the access token used to authenticate on API calls
     * @param {string} token - The Flask-JWT-Extended access token
     */


    _createClass(Controller, [{
        key: 'setToken',
        value: function setToken(token) {
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

    }, {
        key: 'sendRequest',
        value: function sendRequest(endpoint, data) {
            var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "POST";

            var xhr = new XMLHttpRequest();
            xhr.open(method, endpoint);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var resp = JSON.parse(xhr.responseText);
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

    }, {
        key: 'action',
        value: function action(data) {
            var url = this.buildUrl("action");
            this.sendRequest(url, data);
        }
    }, {
        key: 'check',
        value: function check() {
            var data = this.buildPayload("CHECK");
            this.action(data);
        }
    }, {
        key: 'bet',
        value: function bet(amt) {
            var data = this.buildPayload("BET", amt);
            this.action(data);
        }
    }, {
        key: 'fold',
        value: function fold() {
            var data = this.buildPayload("FOLD");
            this.action(data);
        }

        /**
         * @summary Send a beacon to the server on disconnect
         *
         * This allows for server to know when a client disconnects so
         * it can clean up as necessary. No guarantee that this message
         * will go through, so must have redundant measures in place.
         */

    }, {
        key: 'disconnectBeacon',
        value: function disconnectBeacon() {
            var data = {};
            var url = "/disconnect/";
            navigator.sendBeacon(url, data);
        }
    }, {
        key: 'join',
        value: function join() {
            var data = { "userId": this.game.initialData.userId };
            var url = this.buildUrl("join");
            this.sendRequest(url, data);
        }
    }, {
        key: 'buildPayload',
        value: function buildPayload(actionType) {
            var betAmt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            return {
                "playerId": this.playerId,
                "actionType": actionType,
                "betAmt": betAmt
            };
        }
    }, {
        key: 'buildUrl',
        value: function buildUrl(endpoint) {
            return this.game.initialData.tableUrl + endpoint + "/";
        }
    }]);

    return Controller;
}();

exports.default = Controller;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Util = require("../Util");

var _Util2 = _interopRequireDefault(_Util);

var _Button = require("./Button");

var _Button2 = _interopRequireDefault(_Button);

var _Slider = require("./Slider");

var _Slider2 = _interopRequireDefault(_Slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Panel = function () {
    function Panel(game, key) {
        _classCallCheck(this, Panel);

        this.game = game;
        this.key = key;
        this.betAmt = 0;
        this.minDenom = 1;
        this.primaryClicked = new Phaser.Signal();
        this.secondaryClicked = new Phaser.Signal();
        this.slider = new _Slider2.default(this.game, "panel");
        this.display = {};
        this.displayGroup = this.game.add.group();
    }

    _createClass(Panel, [{
        key: "initialize",
        value: function initialize() {
            var _this = this;

            this.display.primary = this.makeButton(0, 0, "lg", this.primaryClicked);
            this.display.secondary = this.makeButton(270, 0, "sml", this.secondaryClicked);

            this.slider.initializeDisplay();
            this.slider.indexChanged.add(function (index) {
                return _this.setBetAmt(_this.minDenom * index);
            }, this);
            this.display.slider = this.slider.bar;
            this.display.slider.y = 70;

            this.displayGroup.add(this.display.primary);
            this.displayGroup.add(this.display.secondary);
            this.displayGroup.add(this.display.slider);
        }
    }, {
        key: "makeButton",
        value: function makeButton(x, y, size, signal) {
            var button = new _Button2.default(this.game, x, y, this.key);
            button.onInputUp.add(signal.dispatch, signal);
            button.setFrames("btn_" + size + "_over", "btn_" + size + "_out", "btn_" + size + "_down", "btn_" + size + "_up");
            button.setTextStyle(this.game.config.panel.textStyle);
            return button;
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            this.display.primary.setText("BET " + _Util2.default.parseCurrency(this.betAmt));
        }
    }, {
        key: "setBetAmt",
        value: function setBetAmt(bet) {
            this.betAmt = bet;
            this.updateDisplay();
        }
    }, {
        key: "setMinDenom",
        value: function setMinDenom(denom) {
            this.minDenom = denom;
            this.updateDisplay();
        }
    }]);

    return Panel;
}();

exports.default = Panel;

},{"../Util":3,"./Button":4,"./Slider":10}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Util = require("../Util");

var _Util2 = _interopRequireDefault(_Util);

var _CardManager = require("../managers/CardManager");

var _CardManager2 = _interopRequireDefault(_CardManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(game, manager) {
        _classCallCheck(this, Player);

        this.game = game;
        this.manager = manager;

        this.id = null;
        this.userId = null;
        this.balance = null;
        this.sittingOut = null;
        this.seat = null;
        this.name = null;

        this.isDealer = false;
        this.isNext = false;
        this.isUser = false;

        this.display = {};
        this.displayGroup = this.game.add.group();

        this.cards = new _CardManager2.default(this.game);
    }

    _createClass(Player, [{
        key: "initialize",
        value: function initialize(data) {
            this.id = data.id;
            this.userId = data.userId;
            this.balance = data.balance;
            this.sittingOut = data.sittingOut;
            this.seat = data.seat;
            this.name = data.name;
            this.isUser = data.isUser;

            this.cards.initialize(2);
        }
    }, {
        key: "initializeDisplay",
        value: function initializeDisplay() {
            this.display.background = this.displayGroup.create(0, 0, this.game.textures.whiteRect);
            this.display.background.anchor.setTo(0.5);

            this.display.name = this.game.add.text(0, -20, "");
            this.display.name.anchor.setTo(0.5);
            this.displayGroup.add(this.display.name);

            this.display.balance = this.game.add.text(0, 20, "");
            this.display.balance.anchor.setTo(0.5);
            this.displayGroup.add(this.display.balance);

            this.display.cards = this.cards.displayGroup;
            this.display.cards.centerX = 0;
            this.display.cards.centerY = -120;
            this.displayGroup.add(this.display.cards);

            this.display.dealerButton = this.game.add.sprite(0, 0, "dealerButton");
            this.display.dealerButton.left = this.display.background.left + 5;
            this.display.dealerButton.bottom = this.display.background.bottom - 5;
            this.displayGroup.add(this.display.dealerButton);

            this.display.nextIndicator = this.game.add.sprite(0, 0, "redCircle");
            this.display.nextIndicator.right = this.display.background.right - 5;
            this.display.nextIndicator.bottom = this.display.background.bottom - 5;
            this.displayGroup.add(this.display.nextIndicator);

            this.updateDisplay();
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            this.display.name.text = this.name;
            this.display.balance.text = _Util2.default.parseCurrency(this.balance);
            this.display.dealerButton.visible = this.isDealer === true;
            this.display.nextIndicator.visible = this.isNext === true;
        }
    }, {
        key: "update",
        value: function update(data) {
            // TODO - Flesh out the rest of the data -- do I like this method?
            this.balance = data.balance === undefined ? this.balance : data.balance;
            this.isDealer = data.isDealer === undefined ? this.isDealer : data.isDealer;
            this.isNext = data.isNext === undefined ? this.isNext : data.isNext;
            this.updateDisplay();
        }
    }]);

    return Player;
}();

exports.default = Player;

},{"../Util":3,"../managers/CardManager":12}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Util = require("../Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pot = function () {
    function Pot(game) {
        _classCallCheck(this, Pot);

        this.game = game;
        this.amount = 0;
        this.sprite = null;
    }

    _createClass(Pot, [{
        key: "initializeDisplay",
        value: function initializeDisplay() {
            this.sprite = this.makeBtn(0, 0, "", this.game.textures.whiteRect, function () {});
            this.updateDisplay();
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            this.sprite.text.text = _Util2.default.parseCurrency(this.amount);
        }
    }, {
        key: "setAmount",
        value: function setAmount(amount) {
            this.amount = amount;
            this.updateDisplay();
        }
    }, {
        key: "makeBtn",
        value: function makeBtn(x, y, text, texture, callback) {
            var callbackContext = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : this;

            var btn = this.game.add.button(x, y, texture, callback, callbackContext);
            btn.anchor.setTo(0.5);

            var btnText = this.game.add.text(0, 0, text);
            btnText.anchor.setTo(0.5);
            btn.addChild(btnText);
            btn.text = btnText;

            return btn;
        }
    }]);

    return Pot;
}();

exports.default = Pot;

},{"../Util":3}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * TODO - Combine end assets into bar asset
 *
 * This looks pretty good, but the bar is hard to click. Need to make the
 * entire sprite taller. I could do something like add an invisible sprite
 * as a child of the bar which is what's in charge of accepting input, but
 * I think just changing the asset itself is the better choice.
 */

var Slider = function () {
    function Slider(game, key) {
        _classCallCheck(this, Slider);

        this.game = game;
        this.key = key;
        this.bar = null; // The slider bar sprite
        this.marker = null; // The draggable marker sprite
        this.index = 0; // Current index of marker
        this.length = 1; // Total number of indices
        this.prevX = 0; // Needed to know when marker snaps to new pos
        this.display = {};
        this.indexChanged = new Phaser.Signal();
    }

    _createClass(Slider, [{
        key: "initializeDisplay",
        value: function initializeDisplay() {
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
            this.marker.input.boundsRect = new Phaser.Rectangle(-this.marker.width / 2, 22, this.bar.width + this.marker.width, this.marker.height);
            this.marker.input.enableSnap(this.bar.width / this.length, 1);
            this.marker.events.onDragUpdate.add(this.markerDragged, this);
            this.display.marker = this.marker;
            this.bar.addChild(this.marker);
        }
    }, {
        key: "setIndex",
        value: function setIndex(index) {
            this.index = index;
            this.indexChanged.dispatch(index);
        }
    }, {
        key: "setLength",
        value: function setLength(length) {
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

    }, {
        key: "barClicked",
        value: function barClicked(bar, pointer) {
            // If the slider hasn't been dragged before being clicked, we need
            // to spoof some cache data. Set the start point of the drag to the
            // leftmost point of the bar.
            if (!this.marker.input._dragPoint.x) {
                var ptr = new Phaser.Pointer(this.game, pointer.id, pointer.pointerMode);
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

    }, {
        key: "markerDragged",
        value: function markerDragged(marker, pointer, x, y, snap) {
            if (snap.x !== this.prevX) {
                this.prevX = snap.x;
                this.setIndex(this.prevX / this.marker.input.snapX);
            }
        }
    }]);

    return Slider;
}();

exports.default = Slider;

},{}],11:[function(require,module,exports){
module.exports={
  "panel": {
    "padding": 10,
    "textStyle": {
      "font": "bold 22pt Arial",
      "fill": "white"
    },
    "pos": {
      "x": 1480,
      "y": 790
    }
  }
}
},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Card = require("../classes/Card");

var _Card2 = _interopRequireDefault(_Card);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CardManager = function () {
    function CardManager(game) {
        _classCallCheck(this, CardManager);

        this.game = game;
        this.cards = [];
        this.displayGroup = this.game.add.group();
    }

    _createClass(CardManager, [{
        key: "initialize",
        value: function initialize(num_cards) {
            for (var i = 0; i < num_cards; i++) {
                var card = new _Card2.default(this.game, this);
                card.initialize({});
                card.initializeDisplay();

                this.cards.push(card);
                this.displayGroup.add(card.sprite);
            }

            this.displayGroup.align(-1, 1, this.cards[0].sprite.width * 1.2, 0);
        }
    }, {
        key: "setCardNames",
        value: function setCardNames(names) {
            console.log(names);
            for (var i = 0; i < names.length; i++) {
                this.cards[i].name = names[i];
                this.cards[i].updateDisplay();
            }
        }
    }, {
        key: "reset",
        value: function reset() {
            for (var i = 0; i < this.cards.length; i++) {
                this.cards[i].name = null;
                this.cards[i].updateDisplay();
            }
        }
    }]);

    return CardManager;
}();

exports.default = CardManager;

},{"../classes/Card":5}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Player = require("../classes/Player");

var _Player2 = _interopRequireDefault(_Player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PlayerManager = function () {
    function PlayerManager(game) {
        _classCallCheck(this, PlayerManager);

        this.game = game;

        this.players = []; // Direct access to the Player objects
        this.userPlayer = null; // The user's player object, if available

        // Contains all display elements for all players in the game
        this.displayGroup = this.game.add.group();
    }

    _createClass(PlayerManager, [{
        key: "initialize",
        value: function initialize(playerData) {
            for (var i = 0; i < playerData.length; i++) {
                var player = new _Player2.default(this.game, this);
                player.initialize(playerData[i]);
                player.initializeDisplay();

                this.players.push(player);
                this.displayGroup.add(player.displayGroup);

                if (playerData[i].isUser === true) {
                    this.userPlayer = player;
                }
            }

            if (this.players.length) {
                this.displayGroup.align(-1, 1, this.players[0].displayGroup.width * 1.2, 0);
            }
        }
    }, {
        key: "getById",
        value: function getById(id) {
            // TODO - Do this without iterating -- build map on init?
            // TODO - Should this ever return null?
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i].id === id) {
                    return this.players[i];
                }
            }
            return null;
        }
    }]);

    return PlayerManager;
}();

exports.default = PlayerManager;

},{"../classes/Player":8}],14:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isString = function isString(val) {
  return typeof val === 'string';
};
var isBlob = function isBlob(val) {
  return val instanceof Blob;
};

polyfill.call((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window : undefined || {});

function polyfill() {
  if (isSupported.call(this)) return;

  if (!('navigator' in this)) this.navigator = {};
  this.navigator.sendBeacon = sendBeacon.bind(this);
};

function sendBeacon(url, data) {
  var event = this.event && this.event.type;
  var sync = event === 'unload' || event === 'beforeunload';

  var xhr = 'XMLHttpRequest' in this ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
  xhr.open('POST', url, !sync);
  xhr.withCredentials = true;
  xhr.setRequestHeader('Accept', '*/*');

  if (isString(data)) {
    xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    xhr.responseType = 'text/plain';
  } else if (isBlob(data) && data.type) {
    xhr.setRequestHeader('Content-Type', data.type);
  }

  try {
    xhr.send(data);
  } catch (error) {
    return false;
  }

  return true;
}

function isSupported() {
  return 'navigator' in this && 'sendBeacon' in this.navigator;
}

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _Controller = require("../classes/Controller");

var _Controller2 = _interopRequireDefault(_Controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Boot = function (_Phaser$State) {
    _inherits(Boot, _Phaser$State);

    function Boot() {
        _classCallCheck(this, Boot);

        return _possibleConstructorReturn(this, (Boot.__proto__ || Object.getPrototypeOf(Boot)).apply(this, arguments));
    }

    _createClass(Boot, [{
        key: "init",
        value: function init() {
            this.game.initialData = initialData;
            this.game.config = _config2.default;

            // TODO - This should come from somehwere dynamic
            this.game.rules = {
                minDenom: 25,
                blinds: {
                    small: 25,
                    big: 50
                }
            };

            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;

            this.game.controller = new _Controller2.default(this.game, this.game.initialData.playerId, this.game.initialData.token);
        }
    }, {
        key: "create",
        value: function create() {
            this.game.state.start("load");
        }
    }]);

    return Boot;
}(Phaser.State);

exports.default = Boot;

},{"../classes/Controller":6,"../config":11}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Load = function (_Phaser$State) {
    _inherits(Load, _Phaser$State);

    function Load() {
        _classCallCheck(this, Load);

        return _possibleConstructorReturn(this, (Load.__proto__ || Object.getPrototypeOf(Load)).apply(this, arguments));
    }

    _createClass(Load, [{
        key: "preload",
        value: function preload() {
            this.game.load.image("background", "/static/assets/hd/background.png");
            this.game.load.image("dealerButton", "/static/assets/hd/dealerbutton.png");
            this.game.load.image("redCircle", "/static/assets/hd/redcircle.png");
            this.game.load.atlasJSONHash("cards", "/static/assets/hd/cards.png", "/static/assets/hd/cards.json");
            this.game.load.atlasJSONHash("panel", "/static/assets/hd/panel.png", "/static/assets/hd/panel.json");

            this.game.textures = this.createCustomTextures();
        }
    }, {
        key: "create",
        value: function create() {
            this.game.state.start("main");
        }
    }, {
        key: "createCustomTextures",
        value: function createCustomTextures() {
            var textures = {};

            var graphics = this.game.add.graphics();
            graphics.lineStyle(4, 0x000000);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(100, 100, 100, 100);
            textures["whiteSquare"] = graphics.generateTexture();
            graphics.destroy();

            graphics = this.game.add.graphics();
            graphics.lineStyle(4, 0x000000);
            graphics.beginFill(0xFFFFFF);
            graphics.drawRect(0, 0, 300, 100);

            textures["whiteRect"] = graphics.generateTexture();

            graphics.destroy();

            return textures;
        }
    }]);

    return Load;
}(Phaser.State);

exports.default = Load;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CardManager = require("../managers/CardManager");

var _CardManager2 = _interopRequireDefault(_CardManager);

var _Panel = require("../classes/Panel");

var _Panel2 = _interopRequireDefault(_Panel);

var _PlayerManager = require("../managers/PlayerManager");

var _PlayerManager2 = _interopRequireDefault(_PlayerManager);

var _Pot = require("../classes/Pot");

var _Pot2 = _interopRequireDefault(_Pot);

var _SSE = require("../SSE");

var _SSE2 = _interopRequireDefault(_SSE);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Main = function (_Phaser$State) {
    _inherits(Main, _Phaser$State);

    function Main() {
        _classCallCheck(this, Main);

        return _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).apply(this, arguments));
    }

    _createClass(Main, [{
        key: "init",
        value: function init() {
            var _this2 = this;

            this.table_sse = new _SSE2.default(this.game, this.game.initialData.tableSSEUrl);
            this.user_sse = new _SSE2.default(this.game, this.game.initialData.userSSEUrl);

            window.addEventListener("unload", function () {
                _this2.game.controller.disconnectBeacon();
            }, false);
        }
    }, {
        key: "create",
        value: function create() {
            var _this3 = this;

            this.background = this.game.add.image(0, 0, "background");
            this.dealBtn = this.makeBtn(100, 100, "deal", this.game.textures.whiteSquare, this.deal);

            this.game.players = new _PlayerManager2.default(this.game);
            this.game.players.initialize(this.game.initialData.players);
            this.game.players.displayGroup.centerX = this.game.world.centerX;
            this.game.players.displayGroup.centerY = this.game.world.centerX / 6;

            this.game.board = new _CardManager2.default(this.game);
            this.game.board.initialize(5);
            this.game.board.displayGroup.centerX = this.game.world.centerX;
            this.game.board.displayGroup.centerY = this.game.world.centerY;

            this.game.pot = new _Pot2.default(this.game);
            this.game.pot.initializeDisplay();
            this.game.pot.sprite.centerX = this.game.world.centerX;
            this.game.pot.sprite.centerY = this.game.world.centerY - 140;

            this.game.panel = new _Panel2.default(this.game, "panel");
            this.game.panel.initialize();
            this.game.panel.setMinDenom(this.game.rules.minDenom);
            this.game.panel.slider.setLength(this.game.players.userPlayer.balance / this.game.rules.minDenom);
            this.game.panel.displayGroup.x = this.game.config.panel.pos.x;
            this.game.panel.displayGroup.y = this.game.config.panel.pos.y;
            this.registerListeners();

            this.table_sse.addListener("newHand", function (event) {
                var data = JSON.parse(event.data);
                console.log("newHand: ", data);
                _this3.game.board.reset();
                for (var i = 0; i < _this3.game.players.players.length; i++) {
                    var player = _this3.game.players.players[i];
                    player.cards.reset();
                    player.update({
                        isDealer: player.id === data.dealer,
                        isNext: player.id === data.next
                    });
                }
                _this3.game.pot.setAmount(0);
            });
            this.table_sse.addListener("action", function (event) {
                var data = JSON.parse(event.data);
                console.log("action: ", data);
                _this3.game.board.setCardNames(data.board);
                _this3.game.players.getById(data.playerId).update({ balance: data.playerBalance, isNext: false });
                _this3.game.players.getById(data.next).update({ isNext: true });
                _this3.game.pot.setAmount(data.pot);
            });
            this.table_sse.addListener("handComplete", function (event) {
                var data = JSON.parse(event.data);
                console.log("handComplete: ", data);
                for (var i = 0; i < data.winners.length; i++) {
                    var winner = data.winners[i];
                    _this3.game.players.getById(winner.id).update({ balance: winner.balance });
                }
            });
            this.table_sse.addListener("newPlayer", function (event) {
                var data = JSON.parse(event.data);
                console.log("newPlayer: ", data);
            }, this);

            this.user_sse.addListener("newHand", function (event) {
                var data = JSON.parse(event.data);
                console.log("newHand: ", data);
                for (var i = 0; i < _this3.game.players.players.length; i++) {
                    if (_this3.game.players.players[i].id === _this3.game.initialData.playerId) {
                        _this3.game.players.players[i].cards.setCardNames(data.holdings);
                    }
                }
            }, this);
            this.user_sse.addListener("newPlayer", function (event) {
                var data = JSON.parse(event.data);
                console.log("newPlayer: ", data);
                _this3.game.controller.setToken(data.token);
            }, this);
        }
    }, {
        key: "registerListeners",
        value: function registerListeners() {
            // this.game.panel.betClicked.add(betAmt => this.game.controller.bet(betAmt));
            // this.game.panel.checkClicked.add(this.game.controller.check, this.game.controller);
            // this.game.panel.foldClicked.add(this.game.controller.fold, this.game.controller);
            // this.game.panel.joinClicked.add(this.game.controller.join, this.game.controller);

            this.game.panel.primaryClicked.add(function () {
                return console.log("primaryClicked");
            });
            this.game.panel.secondaryClicked.add(function () {
                return console.log("secondaryClicked");
            });
        }
    }, {
        key: "update",
        value: function update() {}
    }, {
        key: "makeBtn",
        value: function makeBtn(x, y, text, texture, callback) {
            var btn = this.game.add.button(x, y, texture, callback, this);
            btn.anchor.setTo(0.5);

            var btnText = this.game.add.text(0, 0, text);
            btnText.anchor.setTo(0.5);
            btn.addChild(btnText);
            btn.text = btnText;

            return btn;
        }
    }, {
        key: "deal",
        value: function deal() {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/tables/' + this.game.initialData.tableName + '/deal/');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                tableName: initialData.tableName
            }));
        }
    }]);

    return Main;
}(Phaser.State);

exports.default = Main;

},{"../SSE":2,"../classes/Panel":7,"../classes/Pot":9,"../managers/CardManager":12,"../managers/PlayerManager":13}]},{},[1,14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1NTRS5qcyIsInN0YXRpYy9zcmMvVXRpbC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9CdXR0b24uanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQ2FyZC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9Db250cm9sbGVyLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BhbmVsLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BsYXllci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9Qb3QuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvU2xpZGVyLmpzIiwic3RhdGljL3NyYy9jb25maWcuanNvbiIsInN0YXRpYy9zcmMvbWFuYWdlcnMvQ2FyZE1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL1BsYXllck1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL3BvbHlmaWxscy9zZW5kYmVhY29uLmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvQm9vdC5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL0xvYWQuanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9NYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNLEk7OztBQUNGLG9CQUFjO0FBQUE7O0FBQUEsZ0hBQ0o7QUFDRixtQkFBTyxJQURMO0FBRUYsb0JBQVE7QUFGTixTQURJOztBQU1WLGNBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLGNBQXZCLEVBQTZCLEtBQTdCO0FBQ0EsY0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLE1BQWYsRUFBdUIsY0FBdkIsRUFBNkIsS0FBN0I7QUFDQSxjQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBZixFQUF1QixjQUF2QixFQUE2QixLQUE3Qjs7QUFFQSxjQUFLLEtBQUwsQ0FBVyxL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aUIsR0FBakI7O0FBRUEsZ0JBQUksVUFBVSxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsSUFBZCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixJQUF6QixDQUFkO0FBQ0Esb0JBQVEsTUFBUixDQUFlLEtBQWYsQ0FBcUIsR0FBckI7QUFDQSxnQkFBSSxRQUFKLENBQWEsT0FBYjtBQUNBLGdCQUFJLElBQUosR0FBVyxPQUFYOztBQUVBLG1CQUFPLEdBQVA7QUFDSDs7OytCQUVNO0FBQ0gsZ0JBQUksTUFBTSxJQUFJLGNBQUosRUFBVjtBQUNBLGdCQUFJLElBQUosQ0FBUyxNQUFULEVBQWlCLGFBQWEsS0FBSyxJQUFMLENBQVUsV0FBVixDQUFzQixTQUFuQyxHQUErQyxRQUFoRTtBQUNBLGdCQUFJLGdCQUFKLENBQXFCLGNBQXJCLEVBQXFDLGtCQUFyQztBQUNBLGdCQUFJLElBQUosQ0FBUyxLQUFLLFNBQUwsQ0FBZTtBQUNwQiwyQkFBVyxZQUFZO0FBREgsYUFBZixDQUFUO0FBR0g7Ozs7RUF6SGMsT0FBTyxLOztrQkE0SFgsSSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBCb290IGZyb20gXCIuL3N0YXRlcy9Cb290XCI7XG5pbXBvcnQgTG9hZCBmcm9tIFwiLi9zdGF0ZXMvTG9hZFwiO1xuaW1wb3J0IE1haW4gZnJvbSBcIi4vc3RhdGVzL01haW5cIjtcblxuY2xhc3MgR2FtZSBleHRlbmRzIFBoYXNlci5HYW1lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgd2lkdGg6IDE5MjAsXG4gICAgICAgICAgICBoZWlnaHQ6IDEwODBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJib290XCIsIEJvb3QsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJsb2FkXCIsIExvYWQsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJtYWluXCIsIE1haW4sIGZhbHNlKTtcblxuICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KFwiYm9vdFwiKTtcbiAgICB9XG59XG5cbm5ldyBHYW1lKCk7IiwiY2xhc3MgU1NFIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB1cmwpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIHRoaXMuc291cmNlID0gbmV3IEV2ZW50U291cmNlKHRoaXMudXJsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZSBhZGRzIGFsbCBsaXN0ZW5lcnMgdG8gdGhpcy5zb3VyY2VcbiAgICAgKlxuICAgICAqIEkgb3JpZ2luYWxseSB3cm90ZSB0aGlzIHRvIHN1cHBvcnQgY2xpZW50IHJlY29ubmVjdHMsIGJ1dCBJIGRvbid0IG5lZWRcbiAgICAgKiB0aGF0IGFueW1vcmUuIEtlZXBpbmcgdGhlIGxpc3RlbmVyIGNvZGUganVzdCBpbiBjYXNlLlxuICAgICAqL1xuICAgIHJlQWRkQWxsTGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnM7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICB0aGlzLmFkZExpc3RlbmVyKGxpc3RlbmVyLnR5cGUsIGxpc3RlbmVyLmNhbGxiYWNrLCBsaXN0ZW5lci5jYWxsYmFja0NvbnRleHQsIC4uLmxpc3RlbmVyLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncykge1xuICAgICAgICAvLyBTdG9yZSBsaXN0ZW5lcnMgZm9yIGV2ZW50dWFsIHJlY29ubmVjdFxuICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKHtcbiAgICAgICAgICAgIFwidHlwZVwiOiB0eXBlLFxuICAgICAgICAgICAgXCJjYWxsYmFja1wiOiBjYWxsYmFjayxcbiAgICAgICAgICAgIFwiY2FsbGJhY2tDb250ZXh0XCI6IGNhbGxiYWNrQ29udGV4dCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBhcmdzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc291cmNlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncywgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNTRTsiLCJjbGFzcyBVdGlsIHtcbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZXR1cm4gYSBmb3JtYXR0ZWQgY3VycmVuY3kgc3RyaW5nIGZyb20gYW4gaW50ZWdlclxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZUN1cnJlbmN5KGludCkge1xuICAgICAgICBsZXQgdmFsID0gaW50IC8gMTAwO1xuICAgICAgICByZXR1cm4gXCIkXCIgKyB2YWwudG9GaXhlZCgyKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWw7IiwiLyoqXG4gKiBBIFBoYXNlci5CdXR0b24gd2l0aCBhIFBoYXNlci5UZXh0IGNlbnRlcmVkIG9uIHRoZSBidXR0b25cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIG1lcmVseSBhIHRoaW4gd3JhcHBlciBhcm91bmQgUGhhc2VyLkJ1dHRvbiB0byBhbGxvdyBmb3JcbiAqIGVhc3kgdXNlIG9mIGEgdGV4dCBsYWJlbCBvbiB0aGUgYnV0dG9uLiBUaGUgdGV4dCBpcyBhIGNoaWxkIG9mIHRoZSBidXR0b24sXG4gKiBzbyBpdCBtb3ZlcyB3aGVuIHRoZSBidXR0b24gbW92ZXMuIEl0J3MgY2VudGVyZWQgb24gdGhlIGJ1dHRvbiBhbmQgc2NhbGVzXG4gKiBhdXRvbWF0aWNhbGx5IHRvIGZpeCB3aXRoaW4gdGhlIGJ1dHRvbidzIGJvdW5kcy5cbiAqXG4gKiBJZiBub25lIG9mIHRoZSBsYWJlbCBmdW5jdGlvbmFsaXR5IGlzIHVzZWQsIHRoaXMgY2xhc3MgaXMgaWRlbnRpY2FsIHRvXG4gKiBQaGFzZXIuQnV0dG9uLlxuICovXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBQaGFzZXIuQnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSkge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSk7XG5cbiAgICAgICAgdGhpcy5wYWRkaW5nID0gMDtcbiAgICAgICAgdGhpcy5sYWJlbCA9IG5ldyBQaGFzZXIuVGV4dCh0aGlzLmdhbWUsIDAsIDAsIFwiXCIpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMubGFiZWwpO1xuXG4gICAgICAgIC8vIE11c3QgYWRkIHRvIGdhbWUgd29ybGQgbWFudWFsbHkgaWYgbm90IHVzaW5nIGdhbWUuYWRkLmJ1dHRvblxuICAgICAgICB0aGlzLmdhbWUud29ybGQuYWRkKHRoaXMpO1xuICAgIH1cblxuICAgIHNldFRleHQodGV4dCkge1xuICAgICAgICB0aGlzLmxhYmVsLnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnJlUG9zTGFiZWwoKTtcbiAgICB9XG5cbiAgICBzZXRUZXh0U3R5bGUoc3R5bGUpIHtcbiAgICAgICAgdGhpcy5sYWJlbC5zZXRTdHlsZShzdHlsZSk7XG4gICAgICAgIHRoaXMucmVQb3NMYWJlbCgpO1xuICAgIH1cblxuICAgIHNldFBhZGRpbmcocGFkZGluZykge1xuICAgICAgICB0aGlzLnBhZGRpbmcgPSBwYWRkaW5nO1xuICAgICAgICB0aGlzLnJlUG9zTGFiZWwoKTtcbiAgICB9XG5cbiAgICByZVBvc0xhYmVsKCkge1xuICAgICAgICB0aGlzLmxhYmVsLnNjYWxlLnNldFRvKDEpO1xuICAgICAgICBsZXQgdGV4dEFyZWEgPSB0aGlzLndpZHRoIC0gdGhpcy5wYWRkaW5nICogMjtcbiAgICAgICAgaWYgKHRoaXMubGFiZWwud2lkdGggPiB0ZXh0QXJlYSkge1xuICAgICAgICAgICAgbGV0IHJlZHVjZWRTY2FsZSA9IHRleHRBcmVhIC8gdGhpcy5sYWJlbC53aWR0aDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2NhbGUuc2V0VG8ocmVkdWNlZFNjYWxlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhYmVsLmNlbnRlclggPSB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgdGhpcy5sYWJlbC5jZW50ZXJZID0gdGhpcy5oZWlnaHQgLyAyO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBCdXR0b247IiwiY2xhc3MgQ2FyZCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgbWFuYWdlcikge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsOyAgIC8vIFN0cmluZyBJRCBvZiBjYXJkLCBlLmcuICdLaCcgb3IgJzdzJ1xuICAgICAgICB0aGlzLnNwcml0ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCBcImNhcmRzXCIpO1xuICAgICAgICB0aGlzLnNwcml0ZS5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5zcHJpdGUuc2NhbGUuc2V0VG8oMS41KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZU5hbWUgPSB0aGlzLm5hbWUgPyB0aGlzLm5hbWUgOiBcImJhY2tcIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmQ7IiwiY2xhc3MgQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgcGxheWVySWQsIHRva2VuKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgYWNjZXNzIHRva2VuIHVzZWQgdG8gYXV0aGVudGljYXRlIG9uIEFQSSBjYWxsc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIFRoZSBGbGFzay1KV1QtRXh0ZW5kZWQgYWNjZXNzIHRva2VuXG4gICAgICovXG4gICAgc2V0VG9rZW4odG9rZW4pIHtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICAgKlxuICAgICAqIE9ubHkgZXJyb3JzIGFyZSByZXBvcnRlZC4gU3VjY2VzcyBpcyBzaWxlbnQuIEdhbWUgY2hhbmdlcyByZXN1bHRpbmdcbiAgICAgKiBmcm9tIHJlcXVlc3RzIGFyZSBoYW5kbGVkIHZpYSBTZXJ2ZXIgU2VudCBFdmVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW5kcG9pbnQgLSBUaGUgZW5kcG9pbnQgb24gdGhlIHNlcnZlciB0byBzZW5kIHJlcXVlc3QgdG9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIFRoZSBwYXlsb2FkIHRvIHNlbmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZD1cIlBPU1RdIC0gVGhlIEhUVFAgbWV0aG9kIHRvIHVzZVxuICAgICAqL1xuICAgIHNlbmRSZXF1ZXN0KGVuZHBvaW50LCBkYXRhLCBtZXRob2QgPSBcIlBPU1RcIikge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKG1ldGhvZCwgZW5kcG9pbnQpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIGxldCByZXNwID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAvLyBJbnZhbGlkIHJlcXVlc3QgZXJyb3JcbiAgICAgICAgICAgICAgICBpZiAocmVzcC5zdWNjZXNzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4ocmVzcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCAmJiB4aHIuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAvLyBGYWlsZWQgcmVxdWVzdCBlcnJvclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIHRoaXMudG9rZW4pO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhbiBhY3Rpb24gcmVxdWVzdFxuICAgICAqXG4gICAgICogVGhpcyBpcyB0aGUgbW9zdCBoZWF2aWx5LXVzZWQgcmVxdWVzdCB0eXBlIGluIHRoZSBnYW1lLiBBbGwgaW4tZ2FtZVxuICAgICAqIGFjdGlvbnMgKGJldCwgY2hlY2ssIGZvbGQpIGhhcHBlbiBoZXJlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgLSBUaGUgcGF5bG9hZCB0byBzZW5kXG4gICAgICovXG4gICAgYWN0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImFjdGlvblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGNoZWNrKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJDSEVDS1wiKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgYmV0KGFtdCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJCRVRcIiwgYW10KTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgZm9sZCgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiRk9MRFwiKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhIGJlYWNvbiB0byB0aGUgc2VydmVyIG9uIGRpc2Nvbm5lY3RcbiAgICAgKlxuICAgICAqIFRoaXMgYWxsb3dzIGZvciBzZXJ2ZXIgdG8ga25vdyB3aGVuIGEgY2xpZW50IGRpc2Nvbm5lY3RzIHNvXG4gICAgICogaXQgY2FuIGNsZWFuIHVwIGFzIG5lY2Vzc2FyeS4gTm8gZ3VhcmFudGVlIHRoYXQgdGhpcyBtZXNzYWdlXG4gICAgICogd2lsbCBnbyB0aHJvdWdoLCBzbyBtdXN0IGhhdmUgcmVkdW5kYW50IG1lYXN1cmVzIGluIHBsYWNlLlxuICAgICAqL1xuICAgIGRpc2Nvbm5lY3RCZWFjb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgY29uc3QgdXJsID0gXCIvZGlzY29ubmVjdC9cIjtcbiAgICAgICAgbmF2aWdhdG9yLnNlbmRCZWFjb24odXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBqb2luKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge1widXNlcklkXCI6IHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VySWR9O1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiam9pblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGJ1aWxkUGF5bG9hZChhY3Rpb25UeXBlLCBiZXRBbXQgPSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcInBsYXllcklkXCI6IHRoaXMucGxheWVySWQsXG4gICAgICAgICAgICBcImFjdGlvblR5cGVcIjogYWN0aW9uVHlwZSxcbiAgICAgICAgICAgIFwiYmV0QW10XCI6IGJldEFtdFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYnVpbGRVcmwoZW5kcG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZVVybCArIGVuZHBvaW50ICsgXCIvXCI7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyOyIsImltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCIuL0J1dHRvblwiO1xuaW1wb3J0IFNsaWRlciBmcm9tIFwiLi9TbGlkZXJcIjtcblxuY2xhc3MgUGFuZWwge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5iZXRBbXQgPSAwO1xuICAgICAgICB0aGlzLm1pbkRlbm9tID0gMTtcbiAgICAgICAgdGhpcy5wcmltYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2xpZGVyID0gbmV3IFNsaWRlcih0aGlzLmdhbWUsIFwicGFuZWxcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeSA9IHRoaXMubWFrZUJ1dHRvbigwLCAwLCBcImxnXCIsIHRoaXMucHJpbWFyeUNsaWNrZWQpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDI3MCwgMCwgXCJzbWxcIiwgdGhpcy5zZWNvbmRhcnlDbGlja2VkKTtcblxuICAgICAgICB0aGlzLnNsaWRlci5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgICAgICB0aGlzLnNsaWRlci5pbmRleENoYW5nZWQuYWRkKChpbmRleCkgPT4gdGhpcy5zZXRCZXRBbXQodGhpcy5taW5EZW5vbSAqIGluZGV4KSwgdGhpcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zbGlkZXIgPSB0aGlzLnNsaWRlci5iYXI7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zbGlkZXIueSA9IDcwO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkucHJpbWFyeSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zbGlkZXIpO1xuICAgIH1cblxuICAgIG1ha2VCdXR0b24oeCwgeSwgc2l6ZSwgc2lnbmFsKSB7XG4gICAgICAgIGxldCBidXR0b24gPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgeCwgeSwgdGhpcy5rZXkpO1xuICAgICAgICBidXR0b24ub25JbnB1dFVwLmFkZChzaWduYWwuZGlzcGF0Y2gsIHNpZ25hbCk7XG4gICAgICAgIGJ1dHRvbi5zZXRGcmFtZXMoXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9vdmVyXCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9vdXRcIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX2Rvd25cIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX3VwXCJcbiAgICAgICAgKTtcbiAgICAgICAgYnV0dG9uLnNldFRleHRTdHlsZSh0aGlzLmdhbWUuY29uZmlnLnBhbmVsLnRleHRTdHlsZSk7XG4gICAgICAgIHJldHVybiBidXR0b247XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuc2V0VGV4dChcIkJFVCBcIiArIFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLmJldEFtdCkpO1xuICAgIH1cblxuICAgIHNldEJldEFtdChiZXQpIHtcbiAgICAgICAgdGhpcy5iZXRBbXQgPSBiZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldE1pbkRlbm9tKGRlbm9tKSB7XG4gICAgICAgIHRoaXMubWluRGVub20gPSBkZW5vbTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYW5lbDsiLCJpbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuXG5jbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIG1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcblxuICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBudWxsO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBudWxsO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBudWxsO1xuICAgICAgICB0aGlzLnNlYXQgPSBudWxsO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuaXNEZWFsZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc05leHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc1VzZXIgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7fTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG5cbiAgICAgICAgdGhpcy5jYXJkcyA9IG5ldyBDYXJkTWFuYWdlcih0aGlzLmdhbWUpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoZGF0YSkge1xuICAgICAgICB0aGlzLmlkID0gZGF0YS5pZDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBkYXRhLnVzZXJJZDtcbiAgICAgICAgdGhpcy5iYWxhbmNlID0gZGF0YS5iYWxhbmNlO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBkYXRhLnNpdHRpbmdPdXQ7XG4gICAgICAgIHRoaXMuc2VhdCA9IGRhdGEuc2VhdDtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICB0aGlzLmlzVXNlciA9IGRhdGEuaXNVc2VyO1xuXG4gICAgICAgIHRoaXMuY2FyZHMuaW5pdGlhbGl6ZSgyKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhY2tncm91bmQgPSB0aGlzLmRpc3BsYXlHcm91cC5jcmVhdGUoMCwgMCwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlUmVjdCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIC0yMCwgXCJcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5Lm5hbWUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDIwLCBcIlwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuYmFsYW5jZSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzID0gdGhpcy5jYXJkcy5kaXNwbGF5R3JvdXA7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcy5jZW50ZXJYID0gMDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLmNlbnRlclkgPSAtMTIwO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmNhcmRzKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgXCJkZWFsZXJCdXR0b25cIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24ubGVmdCA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLmxlZnQgKyA1O1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmJvdHRvbSA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLmJvdHRvbSAtIDU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwicmVkQ2lyY2xlXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvci5yaWdodCA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLnJpZ2h0IC0gNTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IuYm90dG9tID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQuYm90dG9tIC0gNTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS50ZXh0ID0gdGhpcy5uYW1lO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS50ZXh0ID0gVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuYmFsYW5jZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24udmlzaWJsZSA9IHRoaXMuaXNEZWFsZXIgPT09IHRydWU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yLnZpc2libGUgPSB0aGlzLmlzTmV4dCA9PT0gdHJ1ZTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZGF0YSkge1xuICAgICAgICAvLyBUT0RPIC0gRmxlc2ggb3V0IHRoZSByZXN0IG9mIHRoZSBkYXRhIC0tIGRvIEkgbGlrZSB0aGlzIG1ldGhvZD9cbiAgICAgICAgdGhpcy5iYWxhbmNlID0gZGF0YS5iYWxhbmNlID09PSB1bmRlZmluZWQgPyB0aGlzLmJhbGFuY2UgOiBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuaXNEZWFsZXIgPSBkYXRhLmlzRGVhbGVyID09PSB1bmRlZmluZWQgPyB0aGlzLmlzRGVhbGVyIDogZGF0YS5pc0RlYWxlcjtcbiAgICAgICAgdGhpcy5pc05leHQgPSBkYXRhLmlzTmV4dCA9PT0gdW5kZWZpbmVkID8gdGhpcy5pc05leHQgOiBkYXRhLmlzTmV4dDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcblxuY2xhc3MgUG90IHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuYW1vdW50ID0gMDtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBudWxsO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZSA9IHRoaXMubWFrZUJ0bigwLCAwLCBcIlwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVSZWN0LCAoKSA9PiB7fSk7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlLnRleHQudGV4dCA9IFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLmFtb3VudCk7XG4gICAgfVxuXG4gICAgc2V0QW1vdW50KGFtb3VudCkge1xuICAgICAgICB0aGlzLmFtb3VudCA9IGFtb3VudDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgbWFrZUJ0bih4LCB5LCB0ZXh0LCB0ZXh0dXJlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0ID0gdGhpcykge1xuICAgICAgICBsZXQgYnRuID0gdGhpcy5nYW1lLmFkZC5idXR0b24oeCwgeSwgdGV4dHVyZSwgY2FsbGJhY2ssIGNhbGxiYWNrQ29udGV4dCk7XG4gICAgICAgIGJ0bi5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICBsZXQgYnRuVGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAwLCB0ZXh0KTtcbiAgICAgICAgYnRuVGV4dC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgYnRuLmFkZENoaWxkKGJ0blRleHQpO1xuICAgICAgICBidG4udGV4dCA9IGJ0blRleHQ7XG5cbiAgICAgICAgcmV0dXJuIGJ0bjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBvdDsiLCIvKipcbiAqIFRPRE8gLSBDb21iaW5lIGVuZCBhc3NldHMgaW50byBiYXIgYXNzZXRcbiAqXG4gKiBUaGlzIGxvb2tzIHByZXR0eSBnb29kLCBidXQgdGhlIGJhciBpcyBoYXJkIHRvIGNsaWNrLiBOZWVkIHRvIG1ha2UgdGhlXG4gKiBlbnRpcmUgc3ByaXRlIHRhbGxlci4gSSBjb3VsZCBkbyBzb21ldGhpbmcgbGlrZSBhZGQgYW4gaW52aXNpYmxlIHNwcml0ZVxuICogYXMgYSBjaGlsZCBvZiB0aGUgYmFyIHdoaWNoIGlzIHdoYXQncyBpbiBjaGFyZ2Ugb2YgYWNjZXB0aW5nIGlucHV0LCBidXRcbiAqIEkgdGhpbmsganVzdCBjaGFuZ2luZyB0aGUgYXNzZXQgaXRzZWxmIGlzIHRoZSBiZXR0ZXIgY2hvaWNlLlxuICovXG5cbmNsYXNzIFNsaWRlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJhciA9IG51bGw7ICAvLyBUaGUgc2xpZGVyIGJhciBzcHJpdGVcbiAgICAgICAgdGhpcy5tYXJrZXIgPSBudWxsOyAgLy8gVGhlIGRyYWdnYWJsZSBtYXJrZXIgc3ByaXRlXG4gICAgICAgIHRoaXMuaW5kZXggPSAwOyAgLy8gQ3VycmVudCBpbmRleCBvZiBtYXJrZXJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAxOyAgLy8gVG90YWwgbnVtYmVyIG9mIGluZGljZXNcbiAgICAgICAgdGhpcy5wcmV2WCA9IDA7ICAvLyBOZWVkZWQgdG8ga25vdyB3aGVuIG1hcmtlciBzbmFwcyB0byBuZXcgcG9zXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuYmFyID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCB0aGlzLmtleSwgXCJzbGlkZXJfYmFyX2V4dGVuZGVkXCIpO1xuICAgICAgICB0aGlzLmJhci5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dERvd24uYWRkKHRoaXMuYmFyQ2xpY2tlZCwgdGhpcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYXIgPSB0aGlzLmJhcjtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubGVmdEVuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgdGhpcy5iYXIuaGVpZ2h0IC8gMiwgdGhpcy5rZXksIFwic2xpZGVyX2VuZFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmxlZnRFbmQuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuYmFyLmFkZENoaWxkKHRoaXMuZGlzcGxheS5sZWZ0RW5kKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkucmlnaHRFbmQgPSB0aGlzLmdhbWUuYWRkLmltYWdlKDQwMCwgdGhpcy5iYXIuaGVpZ2h0IC8gMiwgdGhpcy5rZXksIFwic2xpZGVyX2VuZFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnJpZ2h0RW5kLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLmJhci5hZGRDaGlsZCh0aGlzLmRpc3BsYXkucmlnaHRFbmQpO1xuXG4gICAgICAgIHRoaXMubWFya2VyID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMjIsIHRoaXMua2V5LCBcInNsaWRlcl9tYXJrZXJcIik7XG4gICAgICAgIHRoaXMubWFya2VyLmFuY2hvci5zZXRUbygwLjUsIDApO1xuICAgICAgICB0aGlzLm1hcmtlci5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm1hcmtlci5pbnB1dC5lbmFibGVEcmFnKCk7XG4gICAgICAgIHRoaXMubWFya2VyLmlucHV0LmFsbG93VmVydGljYWxEcmFnID0gZmFsc2U7XG4gICAgICAgIHRoaXMubWFya2VyLmlucHV0LmJvdW5kc1JlY3QgPSBuZXcgUGhhc2VyLlJlY3RhbmdsZShcbiAgICAgICAgICAgIC10aGlzLm1hcmtlci53aWR0aCAvIDIsXG4gICAgICAgICAgICAyMixcbiAgICAgICAgICAgIHRoaXMuYmFyLndpZHRoICsgdGhpcy5tYXJrZXIud2lkdGgsXG4gICAgICAgICAgICB0aGlzLm1hcmtlci5oZWlnaHRcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuaW5wdXQuZW5hYmxlU25hcCh0aGlzLmJhci53aWR0aCAvIHRoaXMubGVuZ3RoLCAxKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuZXZlbnRzLm9uRHJhZ1VwZGF0ZS5hZGQodGhpcy5tYXJrZXJEcmFnZ2VkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1hcmtlciA9IHRoaXMubWFya2VyO1xuICAgICAgICB0aGlzLmJhci5hZGRDaGlsZCh0aGlzLm1hcmtlcik7XG4gICAgfVxuXG4gICAgc2V0SW5kZXgoaW5kZXgpIHtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZC5kaXNwYXRjaChpbmRleCk7XG4gICAgfVxuXG4gICAgc2V0TGVuZ3RoKGxlbmd0aCkge1xuICAgICAgICBpZiAobGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3Qgc2V0IHNsaWRlciBsZW5ndGggbGVzcyB0aGFuIDFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAobGVuZ3RoID4gdGhpcy5iYXIud2lkdGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IFNldHRpbmcgc2xpZGVyIHN0b3BzIGdyZWF0ZXIgdGhhbiBsZW5ndGggbWF5IHJlc3VsdCBpbiB1bmV4cGVjdGVkIGJlaGF2aW9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICB0aGlzLm1hcmtlci5pbnB1dC5lbmFibGVTbmFwKHRoaXMuYmFyLndpZHRoIC8gbGVuZ3RoLCAxKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBDYWxsYmFjayBmb3IgaW5wdXQgZGlyZWN0bHkgb24gdGhlIHNsaWRlciBiYXJcbiAgICAgKlxuICAgICAqIEFsbG93cyB1c2VycyB0byBjbGljayBvbiB0aGUgYmFyIGFuZCBoYXZlIHRoZSBtYXJrZXIgc25hcCB0byB0aGVcbiAgICAgKiBjbGlja2VkIHBvc2l0aW9uIGJ5IGV4cGxvaXRpbmcgc29tZSBvZiBQaGFzZXIncyBpbnRlcm5hbHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5TcHJpdGV9IGJhciAtIFRoZSBjbGlja2VkIHNwcml0ZSwgc2hvdWxkIGFsd2F5cyBiZSB0aGlzLmJhclxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlBvaW50ZXJ9IHBvaW50ZXIgLSBUaGUgcG9pbnRlciByZXNwb25zaWJsZSBmb3IgdGhlIGNsaWNrXG4gICAgICovXG4gICAgYmFyQ2xpY2tlZChiYXIsIHBvaW50ZXIpIHtcbiAgICAgICAgLy8gSWYgdGhlIHNsaWRlciBoYXNuJ3QgYmVlbiBkcmFnZ2VkIGJlZm9yZSBiZWluZyBjbGlja2VkLCB3ZSBuZWVkXG4gICAgICAgIC8vIHRvIHNwb29mIHNvbWUgY2FjaGUgZGF0YS4gU2V0IHRoZSBzdGFydCBwb2ludCBvZiB0aGUgZHJhZyB0byB0aGVcbiAgICAgICAgLy8gbGVmdG1vc3QgcG9pbnQgb2YgdGhlIGJhci5cbiAgICAgICAgaWYgKCF0aGlzLm1hcmtlci5pbnB1dC5fZHJhZ1BvaW50LngpIHtcbiAgICAgICAgICAgIGxldCBwdHIgPSBuZXcgUGhhc2VyLlBvaW50ZXIodGhpcy5nYW1lLCBwb2ludGVyLmlkLCBwb2ludGVyLnBvaW50ZXJNb2RlKTtcbiAgICAgICAgICAgIHB0ci54ID0gdGhpcy5tYXJrZXIud29ybGQueDtcbiAgICAgICAgICAgIHB0ci55ID0gdGhpcy5tYXJrZXIud29ybGQueTtcbiAgICAgICAgICAgIHRoaXMubWFya2VyLmlucHV0LnN0YXJ0RHJhZyhwdHIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWFya2VyLmlucHV0LnVwZGF0ZURyYWcocG9pbnRlciwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgQ2FsbGJhY2sgZm9yIG1hcmtlci4gRGlzcGF0Y2ggc2lnbmFsIG9uIHNuYXAuXG4gICAgICpcbiAgICAgKiBUaGUgb25EcmFnVXBkYXRlIGNhbGxiYWNrIGlzIGNhbGxlZCB2ZXJ5IGZyZXF1ZW50bHkgYnkgUGhhc2VyLCBidXRcbiAgICAgKiBub3QgYWxsIG9mIHRoYXQgaW5mb3JtYXRpb24gaXMgaGVscGZ1bC4gVGhpcyBmaWx0ZXJzIG91dCBtb3N0IG9mIHRob3NlXG4gICAgICogY2FsbHMgc28gYWxsIHdlIHNlZSBhcmUgdGhlIHVwZGF0ZXMgZm9yIHNuYXBzIHRvIG5ldyBsb2NhdGlvbnMgb25cbiAgICAgKiB0aGUgYmFyLlxuICAgICAqXG4gICAgICogTk9URTogVGhlIHBhcmFtcyBwYXNzZWQgdG8gdGhpcyBmdW5jdGlvbiBhcmUgZGVmaW5lZCBieSBQaGFzZXJcbiAgICAgKiBpbnRlcm5hbHMuIEFsbCB0aGF0J3MgYmVpbmcgdXNlZCBoZXJlIGlzIHRoZSBzbmFwIHBhcmFtLCB3aGljaCBpcyBob3dcbiAgICAgKiB3ZSBrbm93IGlmIHRoZSBtYXJrZXIgaGFzIHNuYXBwZWQgdG8gYSBuZXcgbG9jYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5TcHJpdGV9IG1hcmtlciAtIFRoZSBkcmFnZ2VkIG1hcmtlciwgdW51c2VkXG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBwb2ludGVyIGluaXRpYXRpbmcgdGhlIGRyYWcsIHVudXNlZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIG5ldyBYIGNvb3JkaW5hdGUgb2YgdGhlIHNwcml0ZSwgdW51c2VkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgbmV3IFkgY29vcmRpbmF0ZSBvZiB0aGUgc3ByaXRlLCB1bnVzZWRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Qb2ludH0gc25hcCAtIFRoZSBQb2ludCB0byB3aGljaCB0aGUgbWFya2VyIHNuYXBwZWRcbiAgICAgKi9cbiAgICBtYXJrZXJEcmFnZ2VkKG1hcmtlciwgcG9pbnRlciwgeCwgeSwgc25hcCkge1xuICAgICAgICBpZiAoc25hcC54ICE9PSB0aGlzLnByZXZYKSB7XG4gICAgICAgICAgICB0aGlzLnByZXZYID0gc25hcC54O1xuICAgICAgICAgICAgdGhpcy5zZXRJbmRleCh0aGlzLnByZXZYIC8gdGhpcy5tYXJrZXIuaW5wdXQuc25hcFgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbGlkZXI7IiwibW9kdWxlLmV4cG9ydHM9e1xuICBcInBhbmVsXCI6IHtcbiAgICBcInBhZGRpbmdcIjogMTAsXG4gICAgXCJ0ZXh0U3R5bGVcIjoge1xuICAgICAgXCJmb250XCI6IFwiYm9sZCAyMnB0IEFyaWFsXCIsXG4gICAgICBcImZpbGxcIjogXCJ3aGl0ZVwiXG4gICAgfSxcbiAgICBcInBvc1wiOiB7XG4gICAgICBcInhcIjogMTQ4MCxcbiAgICAgIFwieVwiOiA3OTBcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgQ2FyZCBmcm9tIFwiLi4vY2xhc3Nlcy9DYXJkXCI7XG5cbmNsYXNzIENhcmRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuY2FyZHMgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShudW1fY2FyZHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fY2FyZHM7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNhcmQgPSBuZXcgQ2FyZCh0aGlzLmdhbWUsIHRoaXMpO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplKHt9KTtcbiAgICAgICAgICAgIGNhcmQuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICAgICAgdGhpcy5jYXJkcy5wdXNoKGNhcmQpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKGNhcmQuc3ByaXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFsaWduKC0xLCAxLCB0aGlzLmNhcmRzWzBdLnNwcml0ZS53aWR0aCAqIDEuMiwgMCk7XG4gICAgfVxuXG4gICAgc2V0Q2FyZE5hbWVzKG5hbWVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKG5hbWVzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS5uYW1lID0gbmFtZXNbaV07XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZE1hbmFnZXI7IiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vY2xhc3Nlcy9QbGF5ZXJcIjtcblxuY2xhc3MgUGxheWVyTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdOyAgLy8gRGlyZWN0IGFjY2VzcyB0byB0aGUgUGxheWVyIG9iamVjdHNcbiAgICAgICAgdGhpcy51c2VyUGxheWVyID0gbnVsbDsgIC8vIFRoZSB1c2VyJ3MgcGxheWVyIG9iamVjdCwgaWYgYXZhaWxhYmxlXG5cbiAgICAgICAgLy8gQ29udGFpbnMgYWxsIGRpc3BsYXkgZWxlbWVudHMgZm9yIGFsbCBwbGF5ZXJzIGluIHRoZSBnYW1lXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUocGxheWVyRGF0YSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllckRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMuZ2FtZSwgdGhpcyk7XG4gICAgICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZShwbGF5ZXJEYXRhW2ldKTtcbiAgICAgICAgICAgIHBsYXllci5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgICAgICB0aGlzLnBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHBsYXllci5kaXNwbGF5R3JvdXApO1xuXG4gICAgICAgICAgICBpZiAocGxheWVyRGF0YVtpXS5pc1VzZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJQbGF5ZXIgPSBwbGF5ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWxpZ24oLTEsIDEsIHRoaXMucGxheWVyc1swXS5kaXNwbGF5R3JvdXAud2lkdGggKiAxLjIsIDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QnlJZChpZCkge1xuICAgICAgICAvLyBUT0RPIC0gRG8gdGhpcyB3aXRob3V0IGl0ZXJhdGluZyAtLSBidWlsZCBtYXAgb24gaW5pdD9cbiAgICAgICAgLy8gVE9ETyAtIFNob3VsZCB0aGlzIGV2ZXIgcmV0dXJuIG51bGw/XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXJNYW5hZ2VyOyIsImNvbnN0IGlzU3RyaW5nID0gdmFsID0+IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xuY29uc3QgaXNCbG9iID0gdmFsID0+IHZhbCBpbnN0YW5jZW9mIEJsb2I7XG5cbnBvbHlmaWxsLmNhbGwodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgPyB3aW5kb3cgOiB0aGlzIHx8IHt9KTtcblxuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gIGlmIChpc1N1cHBvcnRlZC5jYWxsKHRoaXMpKSByZXR1cm47XG5cbiAgaWYgKCEoJ25hdmlnYXRvcicgaW4gdGhpcykpIHRoaXMubmF2aWdhdG9yID0ge307XG4gIHRoaXMubmF2aWdhdG9yLnNlbmRCZWFjb24gPSBzZW5kQmVhY29uLmJpbmQodGhpcyk7XG59O1xuXG5mdW5jdGlvbiBzZW5kQmVhY29uKHVybCwgZGF0YSkge1xuICBjb25zdCBldmVudCA9IHRoaXMuZXZlbnQgJiYgdGhpcy5ldmVudC50eXBlO1xuICBjb25zdCBzeW5jID0gZXZlbnQgPT09ICd1bmxvYWQnIHx8IGV2ZW50ID09PSAnYmVmb3JldW5sb2FkJztcblxuICBjb25zdCB4aHIgPSAoJ1hNTEh0dHBSZXF1ZXN0JyBpbiB0aGlzKSA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7XG4gIHhoci5vcGVuKCdQT1NUJywgdXJsLCAhc3luYyk7XG4gIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJyovKicpO1xuXG5cbiAgaWYgKGlzU3RyaW5nKGRhdGEpKSB7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKTtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gJ3RleHQvcGxhaW4nO1xuICB9IGVsc2UgaWYgKGlzQmxvYihkYXRhKSAmJiBkYXRhLnR5cGUpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgZGF0YS50eXBlKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgeGhyLnNlbmQoZGF0YSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xuICByZXR1cm4gKCduYXZpZ2F0b3InIGluIHRoaXMpICYmICgnc2VuZEJlYWNvbicgaW4gdGhpcy5uYXZpZ2F0b3IpO1xufSIsImltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSBcIi4uL2NsYXNzZXMvQ29udHJvbGxlclwiO1xuXG5jbGFzcyBCb290IGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmdhbWUuaW5pdGlhbERhdGEgPSBpbml0aWFsRGF0YTtcbiAgICAgICAgdGhpcy5nYW1lLmNvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICAvLyBUT0RPIC0gVGhpcyBzaG91bGQgY29tZSBmcm9tIHNvbWVod2VyZSBkeW5hbWljXG4gICAgICAgIHRoaXMuZ2FtZS5ydWxlcyA9IHtcbiAgICAgICAgICAgIG1pbkRlbm9tOiAyNSxcbiAgICAgICAgICAgIGJsaW5kczoge1xuICAgICAgICAgICAgICAgIHNtYWxsOiAyNSxcbiAgICAgICAgICAgICAgICBiaWc6IDUwXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEucGxheWVySWQsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50b2tlbik7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoXCJsb2FkXCIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQm9vdDsiLCJjbGFzcyBMb2FkIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBwcmVsb2FkKCkge1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcImJhY2tncm91bmRcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9iYWNrZ3JvdW5kLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJkZWFsZXJCdXR0b25cIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9kZWFsZXJidXR0b24ucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcInJlZENpcmNsZVwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3JlZGNpcmNsZS5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJjYXJkc1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NhcmRzLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NhcmRzLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJwYW5lbFwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3BhbmVsLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3BhbmVsLmpzb25cIik7XG5cbiAgICAgICAgdGhpcy5nYW1lLnRleHR1cmVzID0gdGhpcy5jcmVhdGVDdXN0b21UZXh0dXJlcygpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibWFpblwiKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDdXN0b21UZXh0dXJlcygpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0ge307XG5cbiAgICAgICAgbGV0IGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoNCwgMHgwMDAwMDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgxMDAsIDEwMCwgMTAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlU3F1YXJlXCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgMzAwLCAxMDApO1xuXG4gICAgICAgIHRleHR1cmVzW1wid2hpdGVSZWN0XCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG5cbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0dXJlcztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYWQ7IiwiaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuaW1wb3J0IFBhbmVsIGZyb20gXCIuLi9jbGFzc2VzL1BhbmVsXCI7XG5pbXBvcnQgUGxheWVyTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvUGxheWVyTWFuYWdlclwiO1xuaW1wb3J0IFBvdCBmcm9tIFwiLi4vY2xhc3Nlcy9Qb3RcIjtcbmltcG9ydCBTU0UgZnJvbSBcIi4uL1NTRVwiO1xuXG5jbGFzcyBNYWluIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLnRhYmxlX3NzZSA9IG5ldyBTU0UodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVTU0VVcmwpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlID0gbmV3IFNTRSh0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VyU1NFVXJsKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInVubG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5kaXNjb25uZWN0QmVhY29uKCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgXCJiYWNrZ3JvdW5kXCIpO1xuICAgICAgICB0aGlzLmRlYWxCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAxMDAsIFwiZGVhbFwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuZGVhbCk7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMgPSBuZXcgUGxheWVyTWFuYWdlcih0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVycy5pbml0aWFsaXplKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5wbGF5ZXJzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZGlzcGxheUdyb3VwLmNlbnRlclggPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWDtcbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZGlzcGxheUdyb3VwLmNlbnRlclkgPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWCAvIDY7XG5cbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkID0gbmV3IENhcmRNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5pbml0aWFsaXplKDUpO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmNlbnRlclggPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWDtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5jZW50ZXJZID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclk7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBvdCA9IG5ldyBQb3QodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgICAgICB0aGlzLmdhbWUucG90LnNwcml0ZS5jZW50ZXJYID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclg7XG4gICAgICAgIHRoaXMuZ2FtZS5wb3Quc3ByaXRlLmNlbnRlclkgPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWSAtIDE0MDtcblxuICAgICAgICB0aGlzLmdhbWUucGFuZWwgPSBuZXcgUGFuZWwodGhpcy5nYW1lLCBcInBhbmVsXCIpO1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuaW5pdGlhbGl6ZSgpO1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0TWluRGVub20odGhpcy5nYW1lLnJ1bGVzLm1pbkRlbm9tKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNsaWRlci5zZXRMZW5ndGgodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5iYWxhbmNlIC8gdGhpcy5nYW1lLnJ1bGVzLm1pbkRlbm9tKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmRpc3BsYXlHcm91cC54ID0gdGhpcy5nYW1lLmNvbmZpZy5wYW5lbC5wb3MueDtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmRpc3BsYXlHcm91cC55ID0gdGhpcy5nYW1lLmNvbmZpZy5wYW5lbC5wb3MueTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVycygpO1xuXG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwibmV3SGFuZFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld0hhbmQ6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5yZXNldCgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV07XG4gICAgICAgICAgICAgICAgcGxheWVyLmNhcmRzLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGlzRGVhbGVyOiBwbGF5ZXIuaWQgPT09IGRhdGEuZGVhbGVyLFxuICAgICAgICAgICAgICAgICAgICBpc05leHQ6IHBsYXllci5pZCA9PT0gZGF0YS5uZXh0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucG90LnNldEFtb3VudCgwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiYWN0aW9uXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWN0aW9uOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQuc2V0Q2FyZE5hbWVzKGRhdGEuYm9hcmQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLnBsYXllcklkKS51cGRhdGUoe2JhbGFuY2U6IGRhdGEucGxheWVyQmFsYW5jZSwgaXNOZXh0OiBmYWxzZX0pO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpLnVwZGF0ZSh7aXNOZXh0OiB0cnVlfSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucG90LnNldEFtb3VudChkYXRhLnBvdCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImhhbmRDb21wbGV0ZVwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhhbmRDb21wbGV0ZTogXCIsIGRhdGEpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLndpbm5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgd2lubmVyID0gZGF0YS53aW5uZXJzW2ldO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQod2lubmVyLmlkKS51cGRhdGUoe2JhbGFuY2U6IHdpbm5lci5iYWxhbmNlfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1BsYXllclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3UGxheWVyOiBcIiwgZGF0YSk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMudXNlcl9zc2UuYWRkTGlzdGVuZXIoXCJuZXdIYW5kXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdIYW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXS5pZCA9PT0gdGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV0uY2FyZHMuc2V0Q2FyZE5hbWVzKGRhdGEuaG9sZGluZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMudXNlcl9zc2UuYWRkTGlzdGVuZXIoXCJuZXdQbGF5ZXJcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1BsYXllcjogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuc2V0VG9rZW4oZGF0YS50b2tlbik7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyTGlzdGVuZXJzKCkge1xuICAgICAgICAvLyB0aGlzLmdhbWUucGFuZWwuYmV0Q2xpY2tlZC5hZGQoYmV0QW10ID0+IHRoaXMuZ2FtZS5jb250cm9sbGVyLmJldChiZXRBbXQpKTtcbiAgICAgICAgLy8gdGhpcy5nYW1lLnBhbmVsLmNoZWNrQ2xpY2tlZC5hZGQodGhpcy5nYW1lLmNvbnRyb2xsZXIuY2hlY2ssIHRoaXMuZ2FtZS5jb250cm9sbGVyKTtcbiAgICAgICAgLy8gdGhpcy5nYW1lLnBhbmVsLmZvbGRDbGlja2VkLmFkZCh0aGlzLmdhbWUuY29udHJvbGxlci5mb2xkLCB0aGlzLmdhbWUuY29udHJvbGxlcik7XG4gICAgICAgIC8vIHRoaXMuZ2FtZS5wYW5lbC5qb2luQ2xpY2tlZC5hZGQodGhpcy5nYW1lLmNvbnRyb2xsZXIuam9pbiwgdGhpcy5nYW1lLmNvbnRyb2xsZXIpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5wcmltYXJ5Q2xpY2tlZC5hZGQoKCkgPT4gY29uc29sZS5sb2coXCJwcmltYXJ5Q2xpY2tlZFwiKSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZWNvbmRhcnlDbGlja2VkLmFkZCgoKSA9PiBjb25zb2xlLmxvZyhcInNlY29uZGFyeUNsaWNrZWRcIikpO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcblxuICAgIH1cblxuICAgIG1ha2VCdG4oeCwgeSwgdGV4dCwgdGV4dHVyZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ0biA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKHgsIHksIHRleHR1cmUsIGNhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgYnRuLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIGxldCBidG5UZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDAsIHRleHQpO1xuICAgICAgICBidG5UZXh0LmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICBidG4uYWRkQ2hpbGQoYnRuVGV4dCk7XG4gICAgICAgIGJ0bi50ZXh0ID0gYnRuVGV4dDtcblxuICAgICAgICByZXR1cm4gYnRuO1xuICAgIH1cblxuICAgIGRlYWwoKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL3RhYmxlcy8nICsgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlTmFtZSArICcvZGVhbC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYWluOyJdfQ==
