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

},{"./states/Boot":22,"./states/Load":23,"./states/Main":24}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @summary A utility class of Poker-specific functionality
 */
var Poker = function () {
    function Poker() {
        _classCallCheck(this, Poker);
    }

    _createClass(Poker, null, [{
        key: "generateRaises",

        // TODO - This utility is highly-specific to NL games, maybe even to NLHE.
        //  Need to make it more generic eventually to allow for other game
        //  types. Limit and pot-limit games will work completely differently.
        //  Antes are also not supported.

        /**
         * @summary Generate all legal raises for player
         * @param {number} smallBlind - The small blind for the game
         * @param {number} bigBlind - The big blind for the game
         * @param {number} roundBet - The leading bet for this betting round
         * @param {number} playerRoundBet - The amount this player has contributed to the pot so far this round
         * @param {number} prevRaise - The amount the previous raise increased the bet
         * @param {number} playerBalance - The amount the player has available to bet
         * @returns {number[]} - The valid raises
         */
        value: function generateRaises(smallBlind, bigBlind, roundBet, playerRoundBet, prevRaise, playerBalance) {
            var raise = Poker.getMinRaise(bigBlind, roundBet, playerRoundBet, prevRaise, playerBalance);
            var raises = [raise];

            while (raise + smallBlind <= playerBalance) {
                raise += smallBlind;
                raises.push(raise);
            }

            if (raise < playerBalance) {
                raises.push(playerBalance);
            }

            return raises;
        }

        /**
         * @summary Get the minimum allowable bet for player
         *
         * If no bets have occurred in current round, the min bet is a
         * check (bet of 0), otherwise it's a call.
         *
         * @param {number} roundBet - The leading bet for this betting round
         * @param {number} playerRoundBet - The amount this player has contributed to the pot so far this round
         * @param {number} playerBalance - The amount the player has available to bet
         * @returns {number}
         */

    }, {
        key: "getMinBet",
        value: function getMinBet(roundBet, playerRoundBet, playerBalance) {
            var minBet = roundBet === 0 ? 0 : roundBet - playerRoundBet;
            if (playerBalance < minBet) {
                minBet = playerBalance;
            }
            return minBet;
        }

        /**
         * @summary Get the minimum allowable raise for player
         *
         * NOTE: A raise here may actually mean a bet in poker terms. In the
         * parlance of this utility, a raise is an aggressive action, or something
         * which would force other players to contribute more to the pot than
         * the otherwise would have.
         *
         * @param {number} bigBlind - The big blind for the game
         * @param {number} roundBet - The leading bet for this betting round
         * @param {number} playerRoundBet - The amount this player has contributed to the pot so far this round
         * @param {number} prevRaise - The amount the previous raise increased the bet
         * @param {number} playerBalance - The amount the player has available to bet
         * @returns {number}
         */

    }, {
        key: "getMinRaise",
        value: function getMinRaise(bigBlind, roundBet, playerRoundBet, prevRaise, playerBalance) {
            var minRaise = roundBet === 0 ? bigBlind : roundBet - playerRoundBet + prevRaise;
            if (playerBalance < minRaise) {
                minRaise = playerBalance;
            }
            return minRaise;
        }
    }]);

    return Poker;
}();

exports.default = Poker;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Action = {
    BLIND: 0,
    FOLD: 1,
    CHECK: 2,
    BET: 3
};

var ActionText = {
    0: "BLIND",
    1: "FOLD",
    2: "CHECK",
    3: "BET"
};

exports.Action = Action;
exports.ActionText = ActionText;

},{}],6:[function(require,module,exports){
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

        _this.enabled = true;
        _this.labelPadding = 10;
        _this.labelText = "";
        _this.labelStyle = {};
        _this.label = new Phaser.Text(_this.game, 0, 0, _this.labelText);
        _this.addChild(_this.label);

        // Must add to game world manually if not using game.add.button
        _this.game.world.add(_this);
        return _this;
    }

    /**
     * @summary Set the text displayed on the button
     * @param {string} text - The text to display
     * @param {boolean} force - Force display update despite of this.enabled?
     */


    _createClass(Button, [{
        key: "setText",
        value: function setText(text) {
            var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.labelText = text;
            this.updateLabel(force);
        }

        /**
         * @summary Set the style for the button text
         * @param {object} style - The text style to use
         * @param {boolean} force - Force display update despite of this.enabled?
         */

    }, {
        key: "setTextStyle",
        value: function setTextStyle(style) {
            var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.labelStyle = style;
            this.updateLabel(force);
        }

        /**
         * @summary Set the padding between the text and the button perimeter
         * @param {number} padding - The padding in pixels
         * @param {boolean} force - Force display update despite of this.enabled?
         */

    }, {
        key: "setPadding",
        value: function setPadding(padding) {
            var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.labelPadding = padding;
            this.updateLabel(force);
        }

        /**
         * @summary Enable or disable the button
         * On disable, disables all input to the button and renders it grayed
         * out. All updates are delayed until re-enable, unless forced.
         * @param {boolean} enabled - Enable or disable button?
         */

    }, {
        key: "setEnabled",
        value: function setEnabled(enabled) {
            this.enabled = enabled;
            this.inputEnabled = enabled;
            var tint = enabled ? 0xFFFFFF : 0x808080;
            this.tint = tint;
            this.label.tint = tint;

            // Update on re-enable
            if (enabled) {
                this.updateLabel();
            }
        }

        /**
         * @summary Update all button attributes to current properties
         *
         * If the button is disabled, this will have no effect. The
         * developer may optionally choose to force the update.
         *
         * @param {boolean} force - Force the update?
         */

    }, {
        key: "updateLabel",
        value: function updateLabel() {
            var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            if (this.enabled || force) {
                this.label.text = this.labelText;
                this.label.setStyle(this.labelStyle);
                this.rePosLabel();
            }
        }

        /**
         * @summary Scale label text to fit on button and center
         */

    }, {
        key: "rePosLabel",
        value: function rePosLabel() {
            this.label.scale.setTo(1);
            var textAreaH = this.width - this.labelPadding * 2;
            var textAreaV = this.height - this.labelPadding * 2;
            if (this.label.width > textAreaH || this.label.height > textAreaV) {
                var reducedScaleH = textAreaH / this.label.width;
                var reducedScaleV = textAreaV / this.label.height;
                this.label.scale.setTo(Math.min(reducedScaleH, reducedScaleV));
            }
            this.label.centerX = this.width / 2;
            this.label.centerY = this.height / 2;
        }
    }]);

    return Button;
}(Phaser.Button);

exports.default = Button;

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Chip = function (_Phaser$Sprite) {
    _inherits(Chip, _Phaser$Sprite);

    function Chip(game, x, y, key, manager) {
        _classCallCheck(this, Chip);

        var _this = _possibleConstructorReturn(this, (Chip.__proto__ || Object.getPrototypeOf(Chip)).call(this, game, x, y, key));

        game.world.add(_this);

        _this.game = game;
        _this.key = key;
        _this.manager = manager;

        _this.id = ++Chip.counter;
        _this._value = 0;
        _this.angle = 0;

        _this.anchor.setTo(0.5);
        _this.inputEnabled = true;
        _this.rotateRandom();
        return _this;
    }

    _createClass(Chip, [{
        key: "clone",
        value: function clone(chip) {
            this.x = chip.worldPosition.x - this.parent.worldPosition.x;
            this.y = chip.worldPosition.y - this.parent.worldPosition.y;
            this.key = chip.key;
            this.angle = chip.angle;
            this.value = chip.value;
        }
    }, {
        key: "rotateRandom",
        value: function rotateRandom() {
            this.angle = this.game.rnd.integerInRange(-180, 180);
        }
    }, {
        key: "value",
        set: function set(value) {
            this._value = value;
            this.frameName = value.toString();
        },
        get: function get() {
            return this._value;
        }
    }]);

    return Chip;
}(Phaser.Sprite);

Chip.counter = 0;

exports.default = Chip;

},{}],9:[function(require,module,exports){
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
    }, {
        key: 'bb',
        value: function bb() {
            var data = this.buildPayload("BLIND", 50);
            this.action(data);
        }
    }, {
        key: 'sb',
        value: function sb() {
            var data = this.buildPayload("BLIND", 25);
            this.action(data);
        }
    }, {
        key: 'join',
        value: function join(seatNum, buyIn) {
            var data = { "position": seatNum, "amount": buyIn };
            var url = this.buildUrl("join");
            this.sendRequest(url, data);
        }
    }, {
        key: 'leave',
        value: function leave() {
            var data = {};
            var url = this.buildUrl("leave");
            this.sendRequest(url, data);
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

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @summary Simple Phaser.Text extenstion to support automatic resizing
 *
 * If text bounds are set on instances of this class, then each time the text
 * or style is changed, the text will automatically scale itself down to fit
 * within those bounds horizontally. Vertical bounds are ignored.
 *
 * Possible upgrades:
 *   - Set minimum scale
 *   - If text still overflows min scale, then truncate
 */
var Label = function (_Phaser$Text) {
    _inherits(Label, _Phaser$Text);

    function Label(game, x, y, text, style) {
        _classCallCheck(this, Label);

        var _this = _possibleConstructorReturn(this, (Label.__proto__ || Object.getPrototypeOf(Label)).call(this, game, x, y, text, style));

        _this.anchor.setTo(0, 0.5); // Center vertically to avoid jumps on resize
        _this.resize();
        return _this;
    }

    _createClass(Label, [{
        key: "setText",
        value: function setText(text, immediate) {
            _get(Label.prototype.__proto__ || Object.getPrototypeOf(Label.prototype), "setText", this).call(this, text, immediate);
            this.resize();
        }
    }, {
        key: "setStyle",
        value: function setStyle(style, update) {
            _get(Label.prototype.__proto__ || Object.getPrototypeOf(Label.prototype), "setStyle", this).call(this, style, update);
            this.resize();
        }

        /**
         * @summary Resize the text horizontally
         *
         * If text does not fit horizontally at full scale, then scale down
         * until it fits. Vertical overflow is ignored.
         */

    }, {
        key: "resize",
        value: function resize() {
            if (!this.textBounds) {
                return;
            }
            this.scale.setTo(1);
            if (this.width > this.textBounds.width) {
                this.scale.setTo(this.textBounds.width / this.width);
            }
        }
    }]);

    return Label;
}(Phaser.Text);

exports.default = Label;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Label = require("./Label");

var _Label2 = _interopRequireDefault(_Label);

var _Util = require("../Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Nameplate = function (_Phaser$Image) {
    _inherits(Nameplate, _Phaser$Image);

    function Nameplate(game, x, y, key, config) {
        _classCallCheck(this, Nameplate);

        var _this = _possibleConstructorReturn(this, (Nameplate.__proto__ || Object.getPrototypeOf(Nameplate)).call(this, game, x, y, key));

        game.world.add(_this);

        _this.game = game;
        _this.key = key;
        _this.config = config || _this.game.config.nameplate;

        _this.display = {
            nameplate: null,
            name: null,
            balance: null,
            flash: null
        };
        return _this;
    }

    _createClass(Nameplate, [{
        key: "initializeDisplay",
        value: function initializeDisplay() {
            this.display.nameplate = this;

            this.display.name = new _Label2.default(this.game, this.config.name.x, this.config.name.y, "", this.config.name.style);
            this.display.name.setTextBounds(0, 0, this.display.nameplate.width - 20, 0);
            this.addChild(this.display.name);

            this.display.balance = new _Label2.default(this.game, this.config.balance.x, this.config.balance.y, "", this.config.balance.style);
            this.display.balance.setTextBounds(0, 0, this.display.nameplate.width - 20, 0);
            this.addChild(this.display.balance);

            this.display.flash = new _Label2.default(this.game, this.display.nameplate.centerX, this.display.nameplate.centerY, "", this.config.flash.style);
            this.display.flash.setTextBounds(0, 0, this.display.nameplate.width - 20, 0);
            this.display.flash.anchor.setTo(0.5);
            this.display.flash.visible = false;
            this.addChild(this.display.flash);
        }

        /**
         * @summary Flash text for duration
         * @param {string} text - The text to displays
         * @param {number} [duration=2000] - Milliseconds to display text
         */

    }, {
        key: "flash",
        value: function flash(text) {
            var _this2 = this;

            var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;

            this.display.name.visible = false;
            this.display.balance.visible = false;
            this.display.flash.visible = true;
            this.display.flash.setText(text);

            this.game.time.events.add(duration, function () {
                _this2.display.name.visible = true;
                _this2.display.balance.visible = true;
                _this2.display.flash.visible = false;
            }, this);
        }
    }, {
        key: "name",
        set: function set(name) {
            this.display.name.setText(name);
        }
    }, {
        key: "balance",
        set: function set(balance) {
            this.display.balance.setText(_Util2.default.parseCurrency(balance));
        }
    }]);

    return Nameplate;
}(Phaser.Image);

exports.default = Nameplate;

},{"../Util":4,"./Label":10}],12:[function(require,module,exports){
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

var _Action = require("./Action");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Panel = function () {
    function Panel(game, key) {
        _classCallCheck(this, Panel);

        this.game = game;
        this.key = key;
        this.bets = [0];
        this.primaryClicked = new Phaser.Signal();
        this.primaryAction = _Action.Action.BET;
        this.primaryBet = 0;
        this.secondaryClicked = new Phaser.Signal();
        this.secondaryAction = _Action.Action.CHECK;
        this.secondaryBet = 0;
        this.tertiaryClicked = new Phaser.Signal();
        this.tertiaryAction = _Action.Action.FOLD;
        this.slider = new _Slider2.default(this.game, "panel");
        this.display = {};
        this.displayGroup = this.game.add.group();
        this.visible = false;
        this.alwaysVisible = false;
    }

    _createClass(Panel, [{
        key: "initialize",
        value: function initialize() {
            var _this = this;

            this.display.primary = this.makeButton(0, 0, "med", function () {
                return _this.primaryClicked.dispatch(_this.primaryAction, _this.primaryBet);
            });
            this.display.secondary = this.makeButton(135, 0, "med", function () {
                return _this.secondaryClicked.dispatch(_this.secondaryAction, _this.secondaryBet);
            });
            this.display.tertiary = this.makeButton(270, 0, "med", function () {
                return _this.tertiaryClicked.dispatch(_this.tertiaryAction, 0);
            });

            this.slider.initializeDisplay();
            this.slider.indexChanged.add(function (index) {
                return _this.setPrimaryBet(_this.bets[index]);
            }, this);
            this.slider.sliderWheel.add(this.singleStepBet, this);
            this.display.slider = this.slider.bar;
            this.display.slider.y = 60;

            this.display.primary.events.onInputOver.add(function () {
                return _this.slider.enableSliderWheel(true);
            });
            this.display.primary.events.onInputOut.add(function () {
                return _this.slider.enableSliderWheel(false);
            });

            this.displayGroup.add(this.display.primary);
            this.displayGroup.add(this.display.secondary);
            this.displayGroup.add(this.display.tertiary);
            this.displayGroup.add(this.display.slider);

            this.updateDisplay();
        }
    }, {
        key: "makeButton",
        value: function makeButton(x, y, size, callback) {
            var button = new _Button2.default(this.game, x, y, this.key);
            button.onInputUp.add(callback);
            button.setFrames("btn_" + size + "_over", "btn_" + size + "_out", "btn_" + size + "_down", "btn_" + size + "_up");
            button.setTextStyle(this.game.config.panel.textStyle);
            return button;
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            // Panel updates require players' current bets, so if
            // there is no next player we shouldn't update the display
            if (!this.game.players.nextPlayer) {
                return;
            }

            var actionText = this.game.roundBet === 0 ? "BET " : "RAISE TO\n";
            var primaryText = actionText + _Util2.default.parseCurrency(this.primaryBet + this.game.players.nextPlayer.roundBet);
            this.display.primary.setText(primaryText);

            var secondaryText = "CHECK";
            if (this.secondaryAction !== _Action.Action.CHECK) {
                secondaryText = "CALL " + _Util2.default.parseCurrency(this.secondaryBet);
            }
            this.display.secondary.setText(secondaryText);

            this.display.tertiary.setText("FOLD");
            this.displayGroup.visible = this.visible;
        }
    }, {
        key: "setBets",
        value: function setBets(bets) {
            if (bets.length < 1) {
                console.error("Invalid bets. Panel must always have at least one valid bet.");
                return;
            }

            this.bets = bets;
            this.primaryBet = bets[0];
            this.slider.setLength(bets.length);
            this.slider.setIndex(0);
            this.slider.setEnabled(bets.length > 1);
            this.updateDisplay();
        }
    }, {
        key: "setPrimaryBet",
        value: function setPrimaryBet(bet) {
            this.primaryBet = bet;
            this.updateDisplay();
        }
    }, {
        key: "setSecondaryBet",
        value: function setSecondaryBet(bet) {
            this.secondaryBet = bet;
            this.secondaryAction = bet === 0 ? _Action.Action.CHECK : _Action.Action.BET;
            this.updateDisplay();
        }

        /**
         * @summary Hide or show the entire panel
         * @param {boolean} visible
         */

    }, {
        key: "setVisible",
        value: function setVisible(visible) {
            this.visible = visible || this.alwaysVisible;
            this.updateDisplay();
        }

        /**
         * @summary Increment or decrement this.primaryBet
         * @param {Phaser.Mouse.wheelDelta} modifier - +1 or -1
         */

    }, {
        key: "singleStepBet",
        value: function singleStepBet(modifier) {
            var index = this.slider.index + modifier;
            if (index >= 0 && index <= this.slider.length) {
                this.slider.setIndex(index);
            }
        }
    }]);

    return Panel;
}();

exports.default = Panel;

},{"../Util":4,"./Action":5,"./Button":6,"./Slider":15}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Action = require("../classes/Action");

var _CardManager = require("../managers/CardManager");

var _CardManager2 = _interopRequireDefault(_CardManager);

var _ChipManager = require("../managers/ChipManager");

var _ChipManager2 = _interopRequireDefault(_ChipManager);

var _Nameplate = require("../classes/Nameplate");

var _Nameplate2 = _interopRequireDefault(_Nameplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(game, chipConfig) {
        _classCallCheck(this, Player);

        this.game = game;
        this.chipConfig = chipConfig;

        this.id = null;
        this.userId = null;
        this.balance = null;
        this.sittingOut = null;
        this.seat = null;
        this.name = null;
        this.roundBet = 0; // Sum bets by player in current betting round

        this.isDealer = false;
        this.isNext = false;
        this.isUser = false;

        this.displayGroup = this.game.add.group();
        this.display = {
            nameplate: null,
            cards: null,
            dealerButton: null,
            chips: null
        };

        this.cards = new _CardManager2.default(this.game);
        this.chips = new _ChipManager2.default(this.game, "chips", this.game.config.denoms);
        this.nameplate = new _Nameplate2.default(this.game, 0, 0, "nameplate");
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
            this.display.nameplate = this.nameplate;
            this.display.nameplate.initializeDisplay();

            this.display.cards = this.cards.displayGroup;
            this.cards.displayGroup.align(-1, 1, this.nameplate.width / this.cards.length * 0.5, 0);
            this.display.cards.centerX = this.display.nameplate.centerX;
            this.display.cards.bottom = this.display.nameplate.bottom - this.display.nameplate.height * 0.2;

            this.display.dealerButton = this.game.add.sprite(0, 0, "dealerButton");
            this.display.dealerButton.left = this.display.nameplate.left + 5;
            this.display.dealerButton.bottom = this.display.nameplate.bottom - 5;

            this.chips.initializeDisplay();
            this.display.chips = this.chips.displayGroup;
            this.display.chips.x = this.chipConfig[this.seat].x;
            this.display.chips.y = this.chipConfig[this.seat].y;

            this.displayGroup.add(this.chips.displayGroup);
            this.displayGroup.add(this.display.cards);
            this.displayGroup.add(this.display.nameplate);
            this.displayGroup.add(this.display.dealerButton);

            this.updateDisplay();
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            this.display.nameplate.name = this.name;
            this.display.nameplate.balance = this.balance;
            this.display.nameplate.frameName = this.isNext ? "red" : "base";
            this.display.dealerButton.visible = this.isDealer === true;
        }
    }, {
        key: "update",
        value: function update(data) {
            // TODO - Flesh out the rest of the data -- do I like this method?
            this.balance = data.balance === undefined ? this.balance : data.balance;
            this.isDealer = data.isDealer === undefined ? this.isDealer : data.isDealer;
            this.isNext = data.isNext === undefined ? this.isNext : data.isNext;
            this.roundBet = data.roundBet === undefined ? this.roundBet : data.roundBet;
            this.chips.setValue(this.roundBet);
            this.updateDisplay();
        }
    }, {
        key: "action",
        value: function action(data) {
            this.update({
                balance: data.playerBalance,
                roundBet: data.playerRoundBet
            });

            var actionText = _Action.ActionText[data.actionType];
        }
    }]);

    return Player;
}();

exports.default = Player;

},{"../classes/Action":5,"../classes/Nameplate":11,"../managers/CardManager":18,"../managers/ChipManager":19}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ChipManager = require("../managers/ChipManager");

var _ChipManager2 = _interopRequireDefault(_ChipManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pot = function () {
    function Pot(game) {
        _classCallCheck(this, Pot);

        this.game = game;
        this.amount = 0;
        this.sprite = null;
        this.chips = new _ChipManager2.default(this.game, "chips", this.game.config.denoms);
        this.chips.stackChips = false;
        this.chips.colorUp = false;
    }

    _createClass(Pot, [{
        key: "initializeDisplay",
        value: function initializeDisplay() {
            this.chips.initializeDisplay();
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            this.chips.setValue(this.amount);
        }
    }, {
        key: "setAmount",
        value: function setAmount(amount) {
            this.amount = amount;
            this.updateDisplay();
        }
    }, {
        key: "gatherChips",
        value: function gatherChips(players) {
            var _this = this;

            var delay = 0;
            for (var i = 0; i < players.length; i++) {
                var player = players[i];
                if (player.chips.chips.length) {
                    (function () {
                        var chips = player.chips.chips.slice();
                        var value = player.chips.value;
                        _this.game.time.events.add(delay, function () {
                            _this.amount += value;
                            _this.chips.takeChips(chips);
                        }, _this);
                        delay += 100;
                    })();
                }
            }
        }
    }]);

    return Pot;
}();

exports.default = Pot;

},{"../managers/ChipManager":19}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A slider UI element
 *
 * Represented by a bar sprite and a marker sprite. Despite how it may
 * look, all input occurs on the bar and updates are made to the
 * marker's position based on those inputs.
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
        this.display = {};
        this.indexChanged = new Phaser.Signal();
        this.sliderWheel = new Phaser.Signal();
    }

    _createClass(Slider, [{
        key: "initializeDisplay",
        value: function initializeDisplay() {
            var _this = this;

            this.bar = this.game.add.image(0, 0, this.key, "slider_bar");
            this.bar.inputEnabled = true;
            this.bar.events.onInputDown.add(this.startDrag, this);
            this.bar.events.onInputUp.add(this.stopDrag, this);
            this.bar.events.onInputOver.add(function () {
                return _this.enableSliderWheel(true);
            });
            this.bar.events.onInputOut.add(function () {
                return _this.enableSliderWheel(false);
            });
            this.display.bar = this.bar;

            this.marker = this.game.add.sprite(0, 0, this.key, "slider_marker");
            this.marker.anchor.setTo(0.5, 0);
            this.marker.bottom = this.bar.bottom;
            this.display.marker = this.marker;
            this.bar.addChild(this.marker);
        }

        /**
         * @summary Enable slider dragging and initiate first drag event
         * @param {Phaser.Sprite} bar - The bar sprite that was clicked
         * @param {Phaser.Pointer} pointer - The pointer which initiated the click
         */

    }, {
        key: "startDrag",
        value: function startDrag(bar, pointer) {
            // Initial call to updateDrag allows changing bet with click on bar
            this.updateDrag(pointer, pointer.x, pointer.y);
            this.game.input.addMoveCallback(this.updateDrag, this);
        }

        /**
         * @summary Disable slider dragging
         */

    }, {
        key: "stopDrag",
        value: function stopDrag() {
            this.game.input.deleteMoveCallback(this.updateDrag, this);
        }

        /**
         * @summary Calculate slider index based on drag input
         * @param {Phaser.Pointer} pointer - The sliding pointer
         * @param {number} x - The x coordinate of pointer
         * @param {number} y - The y coordinate of pointer
         */

    }, {
        key: "updateDrag",
        value: function updateDrag(pointer, x, y) {
            var localX = x - this.bar.world.x; // Click pos in relation to bar

            // Prevent dragging past bar bounds
            if (localX < 0) {
                localX = 0;
            } else if (localX > this.bar.width) {
                localX = this.bar.width;
            }

            // Subtract 1 from length because length is 1-indexed, indices are 0-indexed
            var index = Math.round(localX / this.bar.width * (this.length - 1));
            this.setIndex(index);
        }

        /**
         * @summary Set the index of the slider and report the new value
         *
         * Optionally update the visual position of the marker on the slider.
         *
         * @param {number} index - New index to set on slider
         * @param {boolean} [updatePos=true] - Update the position of marker?
         */

    }, {
        key: "setIndex",
        value: function setIndex(index) {
            var updatePos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (index !== this.index) {
                this.index = index;
                this.indexChanged.dispatch(index);

                if (updatePos) {
                    if (this.length === 1) {
                        // When only one bet available, it's a max bet
                        this.marker.x = this.bar.width;
                    } else {
                        // Subtract 1 from length because length is 1-indexed, indices are 0-indexed
                        this.marker.x = this.bar.width / (this.length - 1) * this.index;
                    }
                }
            }
        }

        /**
         * @summary Update the length property
         *
         * The length property describes how many discrete bets the slider bar
         * must represent. The slider does not care about what the specific bet
         * it represents is, only that it has some number of indices along its
         * length and that it must report its index to listeners.
         *
         * @param {number} length - The new length to set
         */

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
        }

        /**
         * @summary Enable or disable the slider
         * @param {boolean} enabled - Is the slider enabled?
         */

    }, {
        key: "setEnabled",
        value: function setEnabled(enabled) {
            this.bar.inputEnabled = enabled;

            var tint = enabled ? 0xFFFFFF : 0x808080;
            this.display.bar.tint = tint;
            this.display.marker.tint = tint;
        }

        /**
         * @summary Enable or disable dispatch of signal on wheel scroll
         * @param {boolean} enabled - Is the callback enabled or disabled?
         */

    }, {
        key: "enableSliderWheel",
        value: function enableSliderWheel(enabled) {
            var _this2 = this;

            if (enabled) {
                this.game.input.mouse.mouseWheelCallback = function () {
                    _this2.sliderWheel.dispatch(_this2.game.input.mouse.wheelDelta);
                };
            } else {
                this.game.input.mouse.mouseWheelCallback = null;
            }
        }
    }]);

    return Slider;
}();

exports.default = Slider;

},{}],16:[function(require,module,exports){
module.exports={
  "panel": {
    "padding": 10,
    "textStyle": {
      "font": "bold 22pt Arial",
      "fill": "white",
      "align": "center"
    },
    "pos": {
      "x": 1480,
      "y": 790
    }
  },
  "seats": {
    "10": [
      {"x": 860, "y": 200},
      {"x": 1178, "y": 200},
      {"x": 1522, "y": 342},
      {"x": 1522, "y": 626},
      {"x": 1178, "y": 894},
      {"x": 860, "y": 894},
      {"x": 542, "y": 894},
      {"x": 198, "y": 626},
      {"x": 198, "y": 342},
      {"x": 542, "y": 200}
    ],

    // TODO
    "8": [],
    "9": []
  },
  "buyInModal": {
    "x": 810,
    "y": 430,
    "inputBox": {
      "x": 15,
      "y": 86
    },
    "inputField": {
      "x": 30,
      "y": -2
    },
    "cancelButton": {
      "x": 15,
      "y": 145
    },
    "submitButton": {
      "x": 155,
      "y": 145
    }
  },
  "denoms": [5, 25, 100, 500, 2000],
  "chips": {
    "10": [
      {"x": 100, "y": 120},
      {"x": 100, "y": 120},
      {"x": -60, "y": 40},
      {"x": -60, "y": 40},
      {"x": 100, "y": -140},
      {"x": 100, "y": -140},
      {"x": 100, "y": -140},
      {"x": 240, "y": 40},
      {"x": 240, "y": 40},
      {"x": 100, "y": 120}
    ]
  },
  "nameplate": {
    "name": {
      "x": 10,
      "y": 30,
      "style": {
        "font": "bold 22pt Arial",
        "fill": "#333333"
      }
    },
    "balance": {
      "x": 10,
      "y": 60,
      "style": {
        "font": "16pt Arial",
        "boundsAlignH": "right",
        "fill": "#555555"
      }
    },
    "flash": {
      "style": {
        "font": "bold 30pt Arial",
        "fill": "#333333"
      }
    }
  },
  "popup": {
    "x": 0,
    "y": 10,
    "width": 60,
    "height": 20,
    "text": {
      "x": 6,
      "y": 18,
      "style": {
        "font": "12pt Arial",
        "boundsAlignH": "center",
        "boundsAlignV": "center",
        "fill": "#FFFFFF"
      }
    }
  }
}
},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Button = require("../classes/Button");

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BuyInManager = function () {
    function BuyInManager(game, key) {
        _classCallCheck(this, BuyInManager);

        this.game = game;
        this.key = key;
        this.buyInRequested = new Phaser.Signal();
        this.seats = {};

        this.display = { "buttons": [], "modal": null, "inputBox": null };
        this.buttonsGroup = this.game.add.group();
        this.displayGroup = this.game.add.group();
        this.displayGroup.addChild(this.buttonsGroup);

        this.buttonsVisible = true;
        this.modalVisible = false;

        this.data = { "seatNum": null, "buyIn": null };
    }

    _createClass(BuyInManager, [{
        key: "update",
        value: function update() {
            if (this.display.inputField && this.display.inputField.visible) {
                this.display.inputField.update();
            }
        }
    }, {
        key: "initialize",
        value: function initialize(seatConfig, occupiedSeats, modalConfig) {
            for (var i = 0; i < seatConfig.length; i++) {
                var button = new _Button2.default(this.game, seatConfig[i].x, seatConfig[i].y, this.key, this.buttonClicked, this);
                button.seatNum = i; // Store for use on click
                button.setFrames("btn_buyin_over", "btn_buyin_out", "btn_buyin_down", "btn_buyin_up");
                button.setText("Buy In");
                this.seats[i] = {
                    "button": button,
                    "occupied": occupiedSeats.indexOf(i) !== -1
                };
                this.display.buttons.push(button);
                this.buttonsGroup.add(button);
            }
            this.buttonsGroup.visible = this.buttonsVisible;

            this.display.modalBackground = this.game.add.image(0, 0, this.game.textures.modalBackground);
            this.display.modalBackground.visible = this.modalVisible;
            this.displayGroup.addChild(this.display.modalBackground);

            this.display.modal = this.game.add.image(modalConfig.x, modalConfig.y, this.key, "modal");
            this.display.modal.visible = this.modalVisible;
            this.displayGroup.addChild(this.display.modal);

            this.display.inputBox = this.game.add.image(modalConfig.inputBox.x, modalConfig.inputBox.y, this.key, "input_box");
            this.display.modal.addChild(this.display.inputBox);

            this.display.inputField = this.game.add.inputField(modalConfig.inputField.x, modalConfig.inputField.y, {
                font: '32px Arial',
                fill: '#333333',
                width: 220,
                padding: 8,
                borderWidth: 0,
                placeHolder: '20.00',
                type: PhaserInput.InputType.number,
                fillAlpha: 0
            });
            this.display.inputBox.addChild(this.display.inputField);

            var btnTextStyle = {
                "font": "bold 22pt Arial",
                "fill": "white",
                "align": "center"
            };

            this.display.cancel = new _Button2.default(this.game, modalConfig.cancelButton.x, modalConfig.cancelButton.y, this.key, this.cancel, this);
            this.display.cancel.setFrames("btn_secondary_over", "btn_secondary_out", "btn_secondary_down", "btn_secondary_up");
            this.display.cancel.setTextStyle(btnTextStyle);
            this.display.cancel.setText("CANCEL");
            this.display.modal.addChild(this.display.cancel);

            this.display.submit = new _Button2.default(this.game, modalConfig.submitButton.x, modalConfig.submitButton.y, this.key, this.submit, this);
            this.display.submit.setFrames("btn_primary_over", "btn_primary_out", "btn_primary_down", "btn_primary_up");
            this.display.submit.setTextStyle(btnTextStyle);
            this.display.submit.setText("BUY IN");
            this.display.modal.addChild(this.display.submit);

            this.updateDisplay();
        }
    }, {
        key: "newPlayer",
        value: function newPlayer(playerData) {
            this.seats[playerData.seat].occupied = true;
            this.updateDisplay();
        }
    }, {
        key: "playerLeft",
        value: function playerLeft(playerData) {
            this.seats[playerData.seat].occupied = false;
            this.updateDisplay();
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            for (var seatNum in this.seats) {
                var seat = this.seats[seatNum];
                seat.button.visible = !seat.occupied;
            }
            this.buttonsGroup.visible = this.buttonsVisible;
            this.display.modal.visible = this.modalVisible;
            this.display.modalBackground.visible = this.modalVisible;
        }
    }, {
        key: "buttonClicked",
        value: function buttonClicked(button) {
            this.data.seatNum = button.seatNum;
            this.buttonsVisible = false;
            this.modalVisible = true;
            this.updateDisplay();
        }
    }, {
        key: "cancel",
        value: function cancel() {
            this.data = { "seatNum": null, "buyIn": null };
            this.buttonsVisible = true;
            this.modalVisible = false;
            this.updateDisplay();
        }
    }, {
        key: "submit",
        value: function submit() {
            this.data.buyIn = this.display.inputField.value;
            this.buyInRequested.dispatch(this.data.seatNum, this.data.buyIn);
            this.data = { "seatNum": null, "buyIn": null };
            this.modalVisible = false;
            this.buttonsVisible = false;
            this.updateDisplay();
        }
    }, {
        key: "setButtonsVisible",
        value: function setButtonsVisible(visible) {
            this.buttonsVisible = visible;
            this.updateDisplay();
        }
    }]);

    return BuyInManager;
}();

exports.default = BuyInManager;

},{"../classes/Button":6}],18:[function(require,module,exports){
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
    }, {
        key: "length",
        get: function get() {
            return this.cards.length;
        }
    }]);

    return CardManager;
}();

exports.default = CardManager;

},{"../classes/Card":7}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Chip = require("../classes/Chip");

var _Chip2 = _interopRequireDefault(_Chip);

var _Util = require("../Util");

var _Util2 = _interopRequireDefault(_Util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tooltip = function () {
    function Tooltip(game, key) {
        var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

        _classCallCheck(this, Tooltip);

        this.game = game;
        this.key = key;
        this.padding = padding;

        this._text = "";

        this.displayGroup = this.game.add.group();
        this.display = {
            background: null,
            text: null
        };
    }

    _createClass(Tooltip, [{
        key: "initializeDisplay",
        value: function initializeDisplay() {
            this.display.background = this.game.add.sprite(0, 0, this.key);
            this.display.background.anchor.setTo(0.5);

            this.display.text = this.game.add.text(0, 2, ""); // TODO - No magic numbers (leaving for now because fuck trying to position text vertically)
            this.display.text.setStyle({
                "font": "16pt Arial",
                "fill": "#FFFFFF"
            });
            this.display.text.anchor.setTo(0.5);

            this.displayGroup.add(this.display.background);
            this.displayGroup.add(this.display.text);
            this.displayGroup.visible = false;
        }
    }, {
        key: "rePos",
        value: function rePos() {
            this.display.text.scale.setTo(1);
            var textArea = this.display.background.width - this.padding * 2;
            if (this.display.text.width > textArea) {
                this.display.text.scale.setTo(textArea / this.display.text.width);
            }
        }
    }, {
        key: "text",
        set: function set(text) {
            this._text = text;
            this.display.text.text = text;
            this.rePos();
        },
        get: function get() {
            return this._text;
        }
    }, {
        key: "visible",
        set: function set(visible) {
            this.displayGroup.visible = visible;
        }
    }]);

    return Tooltip;
}();

var ChipManager = function () {
    function ChipManager(game, key, values) {
        _classCallCheck(this, ChipManager);

        this.game = game;
        this.key = key;
        this.values = values;

        this.stackChips = true;
        this.colorUp = true;
        this.chips = [];
        this.pool = [];
        this._value = null;
        this.tooltip = new Tooltip(this.game, this.game.textures.textUnderlay);
        this.displayGroup = this.game.add.group();
        this.display = {
            chips: this.game.add.group(),
            tooltip: this.tooltip.displayGroup
        };
        this.transferAnimation = this.animateChipCascade;
        this.transferComplete = new Phaser.Signal();
        this.pileRadius = 30;
    }

    _createClass(ChipManager, [{
        key: "initializeDisplay",
        value: function initializeDisplay() {
            this.tooltip.initializeDisplay();
            this.display.tooltip.y = this.display.tooltip.height;
            this.displayGroup.add(this.display.chips);
            this.displayGroup.add(this.display.tooltip);
            this.setValue(0);
        }
    }, {
        key: "getChip",
        value: function getChip() {
            var chip = this.pool.pop();
            if (!chip) {
                chip = new _Chip2.default(this.game, 0, 0, this.key, this);
                this.setChipInputs(chip);
                this.display.chips.addChild(chip);
            }
            chip.revive();
            chip.parent.bringToTop(chip);
            this.chips.push(chip);
            return chip;
        }
    }, {
        key: "setChipInputs",
        value: function setChipInputs(chip) {
            var _this = this;

            chip.events.onInputOver.removeAll();
            chip.events.onInputOver.add(function () {
                _this.tooltip.visible = true;
            });

            chip.events.onInputOut.removeAll();
            chip.events.onInputOut.add(function () {
                _this.tooltip.visible = false;
            });
        }
    }, {
        key: "setValue",
        value: function setValue(value) {
            if (value === this._value) {
                return;
            }

            if (this.colorUp) {
                this.clear();
                this.value = value;
            } else {
                value -= this.value;
                this.value += value;
            }

            var yPos = 0;
            var valuesPtr = this.values.length - 1;
            while (value >= 25) {
                while (value < this.values[valuesPtr]) {
                    valuesPtr--;
                    if (valuesPtr === 0) {
                        break;
                    }
                }
                var chip = this.getChip();
                chip.value = this.values[valuesPtr];

                if (this.stackChips) {
                    chip.y = yPos;
                    yPos -= 5;
                } else {
                    if (this.chips.length === 1) {
                        chip.x = 0;
                        chip.y = 0;
                    } else {
                        var randPos = this.randChipPos();
                        chip.x = randPos.x;
                        chip.y = randPos.y;
                    }
                }
                value -= this.values[valuesPtr];
            }
        }
    }, {
        key: "clear",
        value: function clear() {
            var chip = void 0;
            while (chip = this.chips.pop()) {
                this.pool.push(chip);
                chip.kill();
            }
        }
    }, {
        key: "clearChip",
        value: function clearChip(chip) {
            // Remove chip from this.chips if found
            var found = false;
            for (var i = 0; i < this.chips.length; i++) {
                if (this.chips[i].id === chip.id) {
                    this.chips.splice(i, 1);
                    found = true;
                    break;
                }
            }

            if (found) {
                this.pool.push(chip);
                chip.kill();
                return chip;
            }

            return null;
        }
    }, {
        key: "takeChips",
        value: function takeChips(chips) {
            chips = chips.slice();
            var newChips = [];
            for (var i = 0; i < chips.length; i++) {
                var newChip = this.takeChip(chips[i]);
                newChips.push(newChip);
            }

            this.transferAnimation(newChips);
        }
    }, {
        key: "takeChip",
        value: function takeChip(srcChip) {
            var newChip = this.getChip();
            newChip.clone(srcChip);
            this.setChipInputs(newChip);

            srcChip.manager.clearChip(srcChip);

            this.value += srcChip.value;

            return newChip;
        }
    }, {
        key: "animateStackTransfer",
        value: function animateStackTransfer() {}
    }, {
        key: "animateChipCascade",
        value: function animateChipCascade(chips) {
            var _this2 = this;

            var delay = 0;

            var _loop = function _loop(i) {
                var chip = chips[i];
                _this2.game.time.events.add(delay, function () {
                    var randPos = _this2.randChipPos();
                    var tween = _this2.game.add.tween(chip).to({ x: randPos.x, y: randPos.y }, 200, Phaser.Easing.Quadratic.InOut, true);
                    tween.onComplete.add(function () {
                        _this2.value += chip.value;
                    });
                    if (i === chips.length - 1) {
                        tween.onComplete.add(function () {
                            return _this2.transferComplete.dispatch();
                        });
                    }
                }, _this2);
                delay += 100;
            };

            for (var i = 0; i < chips.length; i++) {
                _loop(i);
            }
        }
    }, {
        key: "randChipPos",
        value: function randChipPos() {
            return {
                x: this.game.rnd.integerInRange(-this.pileRadius, this.pileRadius),
                y: this.game.rnd.integerInRange(-this.pileRadius, this.pileRadius)
            };
        }
    }, {
        key: "value",
        set: function set(value) {
            this._value = value;
            this.tooltip.text = _Util2.default.parseCurrency(this._value);
        },
        get: function get() {
            return this._value;
        }
    }]);

    return ChipManager;
}();

exports.default = ChipManager;

},{"../Util":4,"../classes/Chip":8}],20:[function(require,module,exports){
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
    function PlayerManager(game, userId, seatConfig, chipConfig) {
        _classCallCheck(this, PlayerManager);

        this.game = game;
        this.userId = userId;
        this.seatConfig = seatConfig;
        this.chipConfig = chipConfig;

        this.players = []; // Direct access to the Player objects
        this.userPlayer = null; // The user's player object, if available
        this.nextPlayer = null; // The player that the game expects to act next

        // Contains all display elements for all players in the game
        this.displayGroup = this.game.add.group();
    }

    _createClass(PlayerManager, [{
        key: "initialize",
        value: function initialize(playerData) {
            for (var i = 0; i < playerData.length; i++) {
                this.newPlayer(playerData[i]);
            }
        }
    }, {
        key: "newPlayer",
        value: function newPlayer(playerData) {
            var player = new _Player2.default(this.game, this.chipConfig);
            player.initialize(playerData);
            player.initializeDisplay();

            player.displayGroup.x = this.seatConfig[playerData.seat].x;
            player.displayGroup.y = this.seatConfig[playerData.seat].y;

            this.players.push(player);
            this.displayGroup.add(player.displayGroup);

            if (player.userId === this.userId) {
                this.userPlayer = player;
            }

            return player;
        }
    }, {
        key: "playerLeft",
        value: function playerLeft(playerData) {
            var player = this.getById(playerData.id);

            if (!player) {
                console.warn("Could not find player at table");
                return;
            }

            player.displayGroup.destroy();
            for (var i = 0; i < this.players.length; i++) {
                if (this.players[i] === player) {
                    this.players.splice(i, 1);
                    break;
                }
            }

            if (player === this.userPlayer) {
                this.userPlayer = null;
            }

            return player;
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

        /**
         * @summary Get a list of all occupied seats at the table
         * @returns {number[]} - The IDs of occupied seats
         */

    }, {
        key: "getOccupiedSeats",
        value: function getOccupiedSeats() {
            var occupiedSeats = [];
            for (var i = 0; i < this.players.length; i++) {
                occupiedSeats.push(this.players[i].seat);
            }
            return occupiedSeats;
        }
    }]);

    return PlayerManager;
}();

exports.default = PlayerManager;

},{"../classes/Player":13}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
            this.game.initialData = this.augmentInitialData(initialData);
            this.game.config = _config2.default;

            // TODO - This should come from somewhere dynamic
            this.game.rules = {
                ante: 0,
                blinds: {
                    small: 25,
                    big: 50
                }
            };

            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;

            this.game.controller = new _Controller2.default(this.game, this.game.initialData.playerId, this.game.initialData.token);

            if (this.game.initialData.emulatorEnabled) {
                window.game = this.game;
            }
        }
    }, {
        key: "create",
        value: function create() {
            this.game.state.start("load");
        }

        /**
         * @Summary Calculate additional values to store on game.initialData
         *
         * To save on server-side processing and data-transfer load, this
         * method is a place to generate additional data needed by the game
         * which may be derived from the data sent from the back end.
         */

    }, {
        key: "augmentInitialData",
        value: function augmentInitialData(initialData) {
            initialData.occupiedSeats = [];
            for (var i = 0; i < initialData.players.length; i++) {
                initialData.occupiedSeats.push(initialData.players[i].seat);
            }

            return initialData;
        }
    }]);

    return Boot;
}(Phaser.State);

exports.default = Boot;

},{"../classes/Controller":9,"../config":16}],23:[function(require,module,exports){
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
            this.game.load.atlasJSONHash("buyIn", "/static/assets/hd/buyin.png", "/static/assets/hd/buyin.json");
            this.game.load.atlasJSONHash("chips", "/static/assets/hd/chips.png", "/static/assets/hd/chips.json");
            this.game.load.atlasJSONHash("nameplate", "/static/assets/hd/nameplate.png", "/static/assets/hd/nameplate.json");

            this.game.textures = this.createCustomTextures();

            this.loadPlugins();
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

            graphics = this.game.add.graphics();
            graphics.beginFill(0x000000, 0.5);
            graphics.drawRect(0, 0, this.game.width, this.game.height);
            textures["modalBackground"] = graphics.generateTexture();
            graphics.destroy();

            graphics = this.game.add.graphics();
            graphics.beginFill(0x000000, 0.5);
            graphics.drawRect(0, 0, this.game.config.popup.width, this.game.config.popup.height);
            textures["textUnderlay"] = graphics.generateTexture();
            graphics.destroy();

            return textures;
        }
    }, {
        key: "loadPlugins",
        value: function loadPlugins() {
            this.game.add.plugin(PhaserInput.Plugin);
        }
    }]);

    return Load;
}(Phaser.State);

exports.default = Load;

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Action = require("../classes/Action.js");

var _BuyInManager = require("../managers/BuyInManager");

var _BuyInManager2 = _interopRequireDefault(_BuyInManager);

var _CardManager = require("../managers/CardManager");

var _CardManager2 = _interopRequireDefault(_CardManager);

var _Panel = require("../classes/Panel");

var _Panel2 = _interopRequireDefault(_Panel);

var _PlayerManager = require("../managers/PlayerManager");

var _PlayerManager2 = _interopRequireDefault(_PlayerManager);

var _Pot = require("../classes/Pot");

var _Pot2 = _interopRequireDefault(_Pot);

var _Poker = require("../Poker");

var _Poker2 = _interopRequireDefault(_Poker);

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
            this.newHandBtn = this.makeBtn(100, 100, "new\nhand", this.game.textures.whiteSquare, this.newHand);
            this.dealBtn = this.makeBtn(100, 220, "deal", this.game.textures.whiteSquare, this.deal);
            this.leaveBtn = this.makeBtn(100, 340, "leave", this.game.textures.whiteSquare, this.leaveTable);
            this.bbBtn = this.makeBtn(100, 460, "BB", this.game.textures.whiteSquare, this.bb);
            this.sbBtn = this.makeBtn(100, 580, "SB", this.game.textures.whiteSquare, this.sb);

            var numSeats = 10; // TODO - Make dynamic
            this.game.players = new _PlayerManager2.default(this.game, this.game.initialData.userId, this.game.config.seats[numSeats], this.game.config.chips[numSeats]);
            this.game.players.initialize(this.game.initialData.players, this.game.config.seats[numSeats]);

            this.game.board = new _CardManager2.default(this.game);
            this.game.board.initialize(5);
            this.game.board.displayGroup.centerX = this.game.world.centerX;
            this.game.board.displayGroup.centerY = this.game.world.centerY;

            this.game.pot = new _Pot2.default(this.game);
            this.game.pot.initializeDisplay();
            this.game.pot.chips.displayGroup.centerX = this.game.world.centerX; // TODO - Positions in config
            this.game.pot.chips.displayGroup.centerY = this.game.world.centerY - 140;

            // TODO - These should go somewhere else. Maybe in Pot?
            this.game.roundBet = 0;
            this.game.roundRaise = 0;

            this.game.panel = new _Panel2.default(this.game, "panel");
            this.game.panel.initialize();
            this.game.panel.displayGroup.x = this.game.config.panel.pos.x;
            this.game.panel.displayGroup.y = this.game.config.panel.pos.y;
            this.game.panel.alwaysVisible = this.game.initialData.emulatorEnabled;

            this.game.buyIn = new _BuyInManager2.default(this.game, "buyIn");
            this.game.buyIn.initialize(this.game.config.seats[numSeats], this.game.players.getOccupiedSeats(), this.game.config.buyInModal);
            this.game.buyIn.setButtonsVisible(this.game.players.userPlayer === null);

            this.registerListeners();

            this.table_sse.addListener("newHand", function (event) {
                var data = JSON.parse(event.data);
                console.log("newHand: ", data);
                _this3.game.board.reset();
                _this3.game.roundBet = 0;
                _this3.game.roundRaise = 0;
                _this3.game.players.nextPlayer = _this3.game.players.getById(data.next);
                for (var i = 0; i < _this3.game.players.players.length; i++) {
                    var player = _this3.game.players.players[i];
                    player.cards.reset();
                    player.update({
                        isDealer: player.id === data.dealer,
                        isNext: player.id === data.next,
                        roundBet: 0
                    });
                }
                _this3.game.panel.setBets(_Poker2.default.generateRaises(_this3.game.rules.blinds.small, _this3.game.rules.blinds.big, _this3.game.roundBet, _this3.game.players.nextPlayer.roundBet, _this3.game.roundRaise, _this3.game.players.nextPlayer.balance));
                _this3.game.panel.setSecondaryBet(0);
                _this3.game.panel.setVisible(_this3.game.players.nextPlayer === _this3.game.players.userPlayer);
            });
            this.table_sse.addListener("deal", function (event) {
                var data = JSON.parse(event.data);
                console.log("deal: ", data);
                _this3.game.players.nextPlayer = _this3.game.players.getById(data.next);
                _this3.game.panel.setBets(_Poker2.default.generateRaises(_this3.game.rules.blinds.small, _this3.game.rules.blinds.big, _this3.game.roundBet, _this3.game.players.nextPlayer.roundBet, _this3.game.roundRaise, _this3.game.players.nextPlayer.balance));
                _this3.game.panel.setSecondaryBet(_Poker2.default.getMinBet(_this3.game.roundBet, _this3.game.players.nextPlayer.roundBet, _this3.game.players.nextPlayer.balance));
                _this3.game.panel.setVisible(_this3.game.players.nextPlayer === _this3.game.players.userPlayer);
            });
            if (this.game.initialData.emulatorEnabled) {
                this.table_sse.addListener("emulateDeal", function (event) {
                    var data = JSON.parse(event.data);
                    console.log("emulateDeal: ", data);
                    for (var i = 0; i < data.length; i++) {
                        var playerData = data[i];
                        _this3.game.players.getById(playerData.playerId).cards.setCardNames(playerData.holdings);
                    }
                });
            }
            this.table_sse.addListener("newRound", function (event) {
                var data = JSON.parse(event.data);
                console.log("newRound: ", data);
                _this3.game.pot.gatherChips(_this3.game.players.players);
                _this3.game.roundBet = 0;
                _this3.game.roundRaise = 0;
                for (var i = 0; i < _this3.game.players.players.length; i++) {
                    _this3.game.players.players[i].update({ roundBet: 0 });
                }
                _this3.game.panel.setBets(_Poker2.default.generateRaises(_this3.game.rules.blinds.small, _this3.game.rules.blinds.big, _this3.game.roundBet, _this3.game.players.nextPlayer.roundBet, _this3.game.roundRaise, _this3.game.players.nextPlayer.balance));
                _this3.game.panel.setSecondaryBet(0);
            });
            this.table_sse.addListener("action", function (event) {
                var data = JSON.parse(event.data);
                console.log("action: ", data);
                _this3.game.board.setCardNames(data.board);
                _this3.game.players.nextPlayer = _this3.game.players.getById(data.next);
                _this3.game.players.getById(data.playerId).update({
                    balance: data.playerBalance,
                    isNext: false,
                    roundBet: data.playerRoundBet
                });
                _this3.game.players.getById(data.playerId).nameplate.flash(_this3.parseActionText(data));
                _this3.game.players.getById(data.next).update({ isNext: true });
                _this3.game.roundBet = data.roundBet;
                _this3.game.roundRaise = data.roundRaise;

                _this3.game.panel.setBets(_Poker2.default.generateRaises(_this3.game.rules.blinds.small, _this3.game.rules.blinds.big, _this3.game.roundBet, _this3.game.players.nextPlayer.roundBet, _this3.game.roundRaise, _this3.game.players.nextPlayer.balance));
                _this3.game.panel.setSecondaryBet(_Poker2.default.getMinBet(_this3.game.roundBet, _this3.game.players.nextPlayer.roundBet, _this3.game.players.nextPlayer.balance));
                _this3.game.panel.setVisible(_this3.game.players.nextPlayer === _this3.game.players.userPlayer);
            });
            this.table_sse.addListener("handComplete", function (event) {
                var data = JSON.parse(event.data);
                console.log("handComplete: ", data);
                for (var i = 0; i < data.winners.length; i++) {
                    var winner = data.winners[i];
                    _this3.game.players.getById(winner.id).update({ balance: winner.balance });
                }
                _this3.game.pot.chips.clear();
                for (var _i = 0; _i < _this3.game.players.players.length; _i++) {
                    _this3.game.players.players[_i].chips.clear();
                }
            });
            this.table_sse.addListener("newPlayer", function (event) {
                var data = JSON.parse(event.data);
                console.log("newPlayer: ", data);
                _this3.game.players.newPlayer(data);
                _this3.game.buyIn.newPlayer(data);
                _this3.game.buyIn.setButtonsVisible(_this3.game.players.userPlayer === null);
            }, this);
            this.table_sse.addListener("playerLeft", function (event) {
                var data = JSON.parse(event.data);
                console.log("playerLeft: ", data);
                _this3.game.players.playerLeft(data);
                _this3.game.buyIn.playerLeft(data);
                _this3.game.buyIn.setButtonsVisible(_this3.game.players.userPlayer === null);
            }, this);
            this.user_sse.addListener("deal", function (event) {
                var data = JSON.parse(event.data);
                console.log("deal: ", data);
                _this3.game.players.userPlayer.cards.setCardNames(data.holdings);
            }, this);
        }
    }, {
        key: "registerListeners",
        value: function registerListeners() {
            this.game.panel.primaryClicked.add(this.handleAction, this);
            this.game.panel.secondaryClicked.add(this.handleAction, this);
            this.game.panel.tertiaryClicked.add(this.handleAction, this);
            this.game.buyIn.buyInRequested.add(this.game.controller.join, this.game.controller);
        }

        /**
         * @summary Route actions to controller requests
         * @param {number} action - The action to be requested, defined in Action.js
         * @param {number} bet - The bet (if any) to be sent to the controller
         */

    }, {
        key: "handleAction",
        value: function handleAction(action, bet) {
            switch (action) {
                case _Action.Action.FOLD:
                    this.game.controller.fold();
                    break;
                case _Action.Action.CHECK:
                    this.game.controller.check();
                    break;
                case _Action.Action.BET:
                    this.game.controller.bet(bet);
                    break;
                default:
                    console.warn("Invalid Action Type: " + action);
            }
        }

        /**
         * @summary Transform action data into more descriptive bet string
         *
         * All bets are bets, but some require more description to follow poker
         * convention. Specifically, a bet which just equals an existing bet is a
         * call, and one which increases an existing bet is a raise.
         *
         * NOTE: This function must be called BEFORE the state's `roundBet` and
         * `roundRaise` variables are updated, as this function must compare
         * new bet data against the previous state.
         *
         * @param actionData
         * @returns {string} - The text to be flashed
         */

    }, {
        key: "parseActionText",
        value: function parseActionText(actionData) {
            var actionText = _Action.ActionText[actionData.actionType];
            if (actionData.actionType === _Action.Action.BET) {
                if (actionData.playerRoundBet === this.game.roundBet) {
                    actionText = "CALL";
                } else if (actionData.playerRoundBet > this.game.roundBet && this.game.roundBet > 0) {
                    actionText = "RAISE";
                }

                if (actionData.playerBalance === 0) {
                    actionText = "ALL IN";
                }
            }
            return actionText;
        }
    }, {
        key: "update",
        value: function update() {
            this.game.buyIn.update();
        }
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
    }, {
        key: "newHand",
        value: function newHand() {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/tables/' + this.game.initialData.tableName + '/new-hand/');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                tableName: initialData.tableName
            }));
        }
    }, {
        key: "leaveTable",
        value: function leaveTable() {
            this.game.controller.leave();
        }
    }, {
        key: "bb",
        value: function bb() {
            this.game.controller.bb();
        }
    }, {
        key: "sb",
        value: function sb() {
            this.game.controller.sb();
        }
    }, {
        key: "generateBets",
        value: function generateBets(playerRoundBet, playerBalance) {
            return _Poker2.default.generateBets(25, 50, this.game.roundBet, playerRoundBet, this.game.roundRaise, playerBalance);
        }
    }]);

    return Main;
}(Phaser.State);

exports.default = Main;

},{"../Poker":2,"../SSE":3,"../classes/Action.js":5,"../classes/Panel":12,"../classes/Pot":14,"../managers/BuyInManager":17,"../managers/CardManager":18,"../managers/PlayerManager":20}]},{},[1,21])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NoaXAuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQ29udHJvbGxlci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9MYWJlbC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9OYW1lcGxhdGUuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGFuZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGxheWVyLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BvdC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9TbGlkZXIuanMiLCJzdGF0aWMvc3JjL2NvbmZpZy5qc29uIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9CdXlJbk1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL0NhcmRNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9DaGlwTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvUGxheWVyTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvcG9seWZpbGxzL3NlbmRiZWFjb24uanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Cb290LmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTG9hZC5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL01haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU0sSTs7O0FBQ0Ysb0JBQWM7QUFBQTs7QUFBQSxnSEFDSjtBQUNGLG1CQUFPLElBREw7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QW5DLEdBQStDLFlBQWhFO0FBQ0EsZ0JBQUksZ0JBQUosQ0FBcUIsY0FBckIsRUFBcUMsa0JBQXJDO0FBQ0EsZ0JBQUksSUFBSixDQUFTLEtBQUssU0FBTCxDQUFlO0FBQ3BCLDJCQUFXLFlBQVk7QUFESCxhQUFmLENBQVQ7QUFHSDs7O3FDQUVZO0FBQ1QsaUJBQUssSUFBTCxDQUFVLFVBQVYsQ0FBcUIsS0FBckI7QUFDSDs7OzZCQUVJO0FBQ0QsaUJBQUssSUFBTCxDQUFVLFVBQVYsQ0FBcUIsRUFBckI7QUFDSDs7OzZCQUVJO0FBQ0QsaUJBQUssSUFBTCxDQUFVLFVBQVYsQ0FBcUIsRUFBckI7QUFDSDs7O3FDQUVZLGMsRUFBZ0IsYSxFQUFlO0FBQ3hDLG1CQUFPLGdCQUFNLFlBQU4sQ0FBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkIsS0FBSyxJQUFMLENBQVUsUUFBckMsRUFBK0MsY0FBL0MsRUFBK0QsS0FBSyxJQUFMLENBQVUsVUFBekUsRUFBcUYsYUFBckYsQ0FBUDtBQUNIOzs7O0VBalFjLE9BQU8sSzs7a0JBb1FYLEkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgQm9vdCBmcm9tIFwiLi9zdGF0ZXMvQm9vdFwiO1xuaW1wb3J0IExvYWQgZnJvbSBcIi4vc3RhdGVzL0xvYWRcIjtcbmltcG9ydCBNYWluIGZyb20gXCIuL3N0YXRlcy9NYWluXCI7XG5cbmNsYXNzIEdhbWUgZXh0ZW5kcyBQaGFzZXIuR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKHtcbiAgICAgICAgICAgIHdpZHRoOiAxOTIwLFxuICAgICAgICAgICAgaGVpZ2h0OiAxMDgwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkKFwiYm9vdFwiLCBCb290LCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc3RhdGUuYWRkKFwibG9hZFwiLCBMb2FkLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc3RhdGUuYWRkKFwibWFpblwiLCBNYWluLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5zdGFydChcImJvb3RcIik7XG4gICAgfVxufVxuXG5uZXcgR2FtZSgpOyIsIi8qKlxuICogQHN1bW1hcnkgQSB1dGlsaXR5IGNsYXNzIG9mIFBva2VyLXNwZWNpZmljIGZ1bmN0aW9uYWxpdHlcbiAqL1xuY2xhc3MgUG9rZXIge1xuICAgIC8vIFRPRE8gLSBUaGlzIHV0aWxpdHkgaXMgaGlnaGx5LXNwZWNpZmljIHRvIE5MIGdhbWVzLCBtYXliZSBldmVuIHRvIE5MSEUuXG4gICAgLy8gIE5lZWQgdG8gbWFrZSBpdCBtb3JlIGdlbmVyaWMgZXZlbnR1YWxseSB0byBhbGxvdyBmb3Igb3RoZXIgZ2FtZVxuICAgIC8vICB0eXBlcy4gTGltaXQgYW5kIHBvdC1saW1pdCBnYW1lcyB3aWxsIHdvcmsgY29tcGxldGVseSBkaWZmZXJlbnRseS5cbiAgICAvLyAgQW50ZXMgYXJlIGFsc28gbm90IHN1cHBvcnRlZC5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdlbmVyYXRlIGFsbCBsZWdhbCByYWlzZXMgZm9yIHBsYXllclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzbWFsbEJsaW5kIC0gVGhlIHNtYWxsIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119IC0gVGhlIHZhbGlkIHJhaXNlc1xuICAgICAqL1xuICAgIHN0YXRpYyBnZW5lcmF0ZVJhaXNlcyhzbWFsbEJsaW5kLCBiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IHJhaXNlID0gUG9rZXIuZ2V0TWluUmFpc2UoYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICAgICAgbGV0IHJhaXNlcyA9IFtyYWlzZV07XG5cbiAgICAgICAgd2hpbGUgKHJhaXNlICsgc21hbGxCbGluZCA8PSBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgICAgICByYWlzZSArPSBzbWFsbEJsaW5kO1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocmFpc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJhaXNlIDwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocGxheWVyQmFsYW5jZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmFpc2VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgYmV0IGZvciBwbGF5ZXJcbiAgICAgKlxuICAgICAqIElmIG5vIGJldHMgaGF2ZSBvY2N1cnJlZCBpbiBjdXJyZW50IHJvdW5kLCB0aGUgbWluIGJldCBpcyBhXG4gICAgICogY2hlY2sgKGJldCBvZiAwKSwgb3RoZXJ3aXNlIGl0J3MgYSBjYWxsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5CZXQocm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCBtaW5CZXQgPSByb3VuZEJldCA9PT0gMCA/IDAgOiByb3VuZEJldCAtIHBsYXllclJvdW5kQmV0O1xuICAgICAgICBpZiAocGxheWVyQmFsYW5jZSA8IG1pbkJldCkge1xuICAgICAgICAgICAgbWluQmV0ID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluQmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgcmFpc2UgZm9yIHBsYXllclxuICAgICAqXG4gICAgICogTk9URTogQSByYWlzZSBoZXJlIG1heSBhY3R1YWxseSBtZWFuIGEgYmV0IGluIHBva2VyIHRlcm1zLiBJbiB0aGVcbiAgICAgKiBwYXJsYW5jZSBvZiB0aGlzIHV0aWxpdHksIGEgcmFpc2UgaXMgYW4gYWdncmVzc2l2ZSBhY3Rpb24sIG9yIHNvbWV0aGluZ1xuICAgICAqIHdoaWNoIHdvdWxkIGZvcmNlIG90aGVyIHBsYXllcnMgdG8gY29udHJpYnV0ZSBtb3JlIHRvIHRoZSBwb3QgdGhhblxuICAgICAqIHRoZSBvdGhlcndpc2Ugd291bGQgaGF2ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5SYWlzZShiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IG1pblJhaXNlID0gcm91bmRCZXQgPT09IDAgPyBiaWdCbGluZCA6IHJvdW5kQmV0IC0gcGxheWVyUm91bmRCZXQgKyBwcmV2UmFpc2U7XG4gICAgICAgIGlmIChwbGF5ZXJCYWxhbmNlIDwgbWluUmFpc2UpIHtcbiAgICAgICAgICAgIG1pblJhaXNlID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluUmFpc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb2tlcjsiLCJjbGFzcyBTU0Uge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVybCkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodGhpcy51cmwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJlIGFkZHMgYWxsIGxpc3RlbmVycyB0byB0aGlzLnNvdXJjZVxuICAgICAqXG4gICAgICogSSBvcmlnaW5hbGx5IHdyb3RlIHRoaXMgdG8gc3VwcG9ydCBjbGllbnQgcmVjb25uZWN0cywgYnV0IEkgZG9uJ3QgbmVlZFxuICAgICAqIHRoYXQgYW55bW9yZS4gS2VlcGluZyB0aGUgbGlzdGVuZXIgY29kZSBqdXN0IGluIGNhc2UuXG4gICAgICovXG4gICAgcmVBZGRBbGxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycztcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobGlzdGVuZXIudHlwZSwgbGlzdGVuZXIuY2FsbGJhY2ssIGxpc3RlbmVyLmNhbGxiYWNrQ29udGV4dCwgLi4ubGlzdGVuZXIuYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIFN0b3JlIGxpc3RlbmVycyBmb3IgZXZlbnR1YWwgcmVjb25uZWN0XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgICAgXCJ0eXBlXCI6IHR5cGUsXG4gICAgICAgICAgICBcImNhbGxiYWNrXCI6IGNhbGxiYWNrLFxuICAgICAgICAgICAgXCJjYWxsYmFja0NvbnRleHRcIjogY2FsbGJhY2tDb250ZXh0LFxuICAgICAgICAgICAgXCJhcmdzXCI6IGFyZ3NcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU1NFOyIsImNsYXNzIFV0aWwge1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJldHVybiBhIGZvcm1hdHRlZCBjdXJyZW5jeSBzdHJpbmcgZnJvbSBhbiBpbnRlZ2VyXG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlQ3VycmVuY3koaW50KSB7XG4gICAgICAgIGxldCB2YWwgPSBpbnQgLyAxMDA7XG4gICAgICAgIHJldHVybiBcIiRcIiArIHZhbC50b0ZpeGVkKDIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXRpbDsiLCJjb25zdCBBY3Rpb24gPSB7XG4gICAgQkxJTkQ6IDAsXG4gICAgRk9MRDogMSxcbiAgICBDSEVDSzogMixcbiAgICBCRVQ6IDNcbn07XG5cbmNvbnN0IEFjdGlvblRleHQgPSB7XG4gICAgMDogXCJCTElORFwiLFxuICAgIDE6IFwiRk9MRFwiLFxuICAgIDI6IFwiQ0hFQ0tcIixcbiAgICAzOiBcIkJFVFwiXG59O1xuXG5leHBvcnQge0FjdGlvbiwgQWN0aW9uVGV4dH07IiwiLyoqXG4gKiBBIFBoYXNlci5CdXR0b24gd2l0aCBhIFBoYXNlci5UZXh0IGNlbnRlcmVkIG9uIHRoZSBidXR0b25cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIG1lcmVseSBhIHRoaW4gd3JhcHBlciBhcm91bmQgUGhhc2VyLkJ1dHRvbiB0byBhbGxvdyBmb3JcbiAqIGVhc3kgdXNlIG9mIGEgdGV4dCBsYWJlbCBvbiB0aGUgYnV0dG9uLiBUaGUgdGV4dCBpcyBhIGNoaWxkIG9mIHRoZSBidXR0b24sXG4gKiBzbyBpdCBtb3ZlcyB3aGVuIHRoZSBidXR0b24gbW92ZXMuIEl0J3MgY2VudGVyZWQgb24gdGhlIGJ1dHRvbiBhbmQgc2NhbGVzXG4gKiBhdXRvbWF0aWNhbGx5IHRvIGZpeCB3aXRoaW4gdGhlIGJ1dHRvbidzIGJvdW5kcy5cbiAqXG4gKiBJZiBub25lIG9mIHRoZSBsYWJlbCBmdW5jdGlvbmFsaXR5IGlzIHVzZWQsIHRoaXMgY2xhc3MgaXMgaWRlbnRpY2FsIHRvXG4gKiBQaGFzZXIuQnV0dG9uLlxuICovXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBQaGFzZXIuQnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSkge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSk7XG5cbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSAxMDtcbiAgICAgICAgdGhpcy5sYWJlbFRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSB7fTtcbiAgICAgICAgdGhpcy5sYWJlbCA9IG5ldyBQaGFzZXIuVGV4dCh0aGlzLmdhbWUsIDAsIDAsIHRoaXMubGFiZWxUZXh0KTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmxhYmVsKTtcblxuICAgICAgICAvLyBNdXN0IGFkZCB0byBnYW1lIHdvcmxkIG1hbnVhbGx5IGlmIG5vdCB1c2luZyBnYW1lLmFkZC5idXR0b25cbiAgICAgICAgdGhpcy5nYW1lLndvcmxkLmFkZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHRleHQgZGlzcGxheWVkIG9uIHRoZSBidXR0b25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGRpc3BsYXlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0VGV4dCh0ZXh0LCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxUZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBzdHlsZSBmb3IgdGhlIGJ1dHRvbiB0ZXh0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gVGhlIHRleHQgc3R5bGUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFRleHRTdHlsZShzdHlsZSwgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSBzdHlsZTtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBwYWRkaW5nIGJldHdlZW4gdGhlIHRleHQgYW5kIHRoZSBidXR0b24gcGVyaW1ldGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmcgLSBUaGUgcGFkZGluZyBpbiBwaXhlbHNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0UGFkZGluZyhwYWRkaW5nLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxQYWRkaW5nID0gcGFkZGluZztcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIGJ1dHRvblxuICAgICAqIE9uIGRpc2FibGUsIGRpc2FibGVzIGFsbCBpbnB1dCB0byB0aGUgYnV0dG9uIGFuZCByZW5kZXJzIGl0IGdyYXllZFxuICAgICAqIG91dC4gQWxsIHVwZGF0ZXMgYXJlIGRlbGF5ZWQgdW50aWwgcmUtZW5hYmxlLCB1bmxlc3MgZm9yY2VkLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIEVuYWJsZSBvciBkaXNhYmxlIGJ1dHRvbj9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmxhYmVsLnRpbnQgPSB0aW50O1xuXG4gICAgICAgIC8vIFVwZGF0ZSBvbiByZS1lbmFibGVcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFVwZGF0ZSBhbGwgYnV0dG9uIGF0dHJpYnV0ZXMgdG8gY3VycmVudCBwcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBJZiB0aGUgYnV0dG9uIGlzIGRpc2FibGVkLCB0aGlzIHdpbGwgaGF2ZSBubyBlZmZlY3QuIFRoZVxuICAgICAqIGRldmVsb3BlciBtYXkgb3B0aW9uYWxseSBjaG9vc2UgdG8gZm9yY2UgdGhlIHVwZGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSB0aGUgdXBkYXRlP1xuICAgICAqL1xuICAgIHVwZGF0ZUxhYmVsKGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCB8fCBmb3JjZSkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbC50ZXh0ID0gdGhpcy5sYWJlbFRleHQ7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnNldFN0eWxlKHRoaXMubGFiZWxTdHlsZSk7XG4gICAgICAgICAgICB0aGlzLnJlUG9zTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNjYWxlIGxhYmVsIHRleHQgdG8gZml0IG9uIGJ1dHRvbiBhbmQgY2VudGVyXG4gICAgICovXG4gICAgcmVQb3NMYWJlbCgpIHtcbiAgICAgICAgdGhpcy5sYWJlbC5zY2FsZS5zZXRUbygxKTtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFIID0gdGhpcy53aWR0aCAtIHRoaXMubGFiZWxQYWRkaW5nICogMjtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFWID0gdGhpcy5oZWlnaHQgLSB0aGlzLmxhYmVsUGFkZGluZyAqIDI7XG4gICAgICAgIGlmICh0aGlzLmxhYmVsLndpZHRoID4gdGV4dEFyZWFIIHx8IHRoaXMubGFiZWwuaGVpZ2h0ID4gdGV4dEFyZWFWKSB7XG4gICAgICAgICAgICBjb25zdCByZWR1Y2VkU2NhbGVIID0gdGV4dEFyZWFIIC8gdGhpcy5sYWJlbC53aWR0aDtcbiAgICAgICAgICAgIGNvbnN0IHJlZHVjZWRTY2FsZVYgPSB0ZXh0QXJlYVYgLyB0aGlzLmxhYmVsLmhlaWdodDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2NhbGUuc2V0VG8oTWF0aC5taW4ocmVkdWNlZFNjYWxlSCwgcmVkdWNlZFNjYWxlVikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFiZWwuY2VudGVyWCA9IHRoaXMud2lkdGggLyAyO1xuICAgICAgICB0aGlzLmxhYmVsLmNlbnRlclkgPSB0aGlzLmhlaWdodCAvIDI7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjsiLCJjbGFzcyBDYXJkIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBtYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7ICAgLy8gU3RyaW5nIElEIG9mIGNhcmQsIGUuZy4gJ0toJyBvciAnN3MnXG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKGRhdGEpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwiY2FyZHNcIik7XG4gICAgICAgIHRoaXMuc3ByaXRlLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lTmFtZSA9IHRoaXMubmFtZSA/IHRoaXMubmFtZSA6IFwiYmFja1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZDsiLCJjbGFzcyBDaGlwIGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwga2V5LCBtYW5hZ2VyKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSk7XG4gICAgICAgIGdhbWUud29ybGQuYWRkKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuXG4gICAgICAgIHRoaXMuaWQgPSArK0NoaXAuY291bnRlcjtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSAwO1xuICAgICAgICB0aGlzLmFuZ2xlID0gMDtcblxuICAgICAgICB0aGlzLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMucm90YXRlUmFuZG9tKCk7XG4gICAgfVxuXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZnJhbWVOYW1lID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG5cbiAgICBjbG9uZShjaGlwKSB7XG4gICAgICAgIHRoaXMueCA9IGNoaXAud29ybGRQb3NpdGlvbi54IC0gdGhpcy5wYXJlbnQud29ybGRQb3NpdGlvbi54O1xuICAgICAgICB0aGlzLnkgPSBjaGlwLndvcmxkUG9zaXRpb24ueSAtIHRoaXMucGFyZW50LndvcmxkUG9zaXRpb24ueTtcbiAgICAgICAgdGhpcy5rZXkgPSBjaGlwLmtleTtcbiAgICAgICAgdGhpcy5hbmdsZSA9IGNoaXAuYW5nbGU7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjaGlwLnZhbHVlO1xuICAgIH1cblxuICAgIHJvdGF0ZVJhbmRvbSgpIHtcbiAgICAgICAgdGhpcy5hbmdsZSA9IHRoaXMuZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoLTE4MCwgMTgwKTtcbiAgICB9XG59XG5cbkNoaXAuY291bnRlciA9IDA7XG5cbmV4cG9ydCBkZWZhdWx0IENoaXA7IiwiY2xhc3MgQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgcGxheWVySWQsIHRva2VuKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgYWNjZXNzIHRva2VuIHVzZWQgdG8gYXV0aGVudGljYXRlIG9uIEFQSSBjYWxsc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIFRoZSBGbGFzay1KV1QtRXh0ZW5kZWQgYWNjZXNzIHRva2VuXG4gICAgICovXG4gICAgc2V0VG9rZW4odG9rZW4pIHtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICAgKlxuICAgICAqIE9ubHkgZXJyb3JzIGFyZSByZXBvcnRlZC4gU3VjY2VzcyBpcyBzaWxlbnQuIEdhbWUgY2hhbmdlcyByZXN1bHRpbmdcbiAgICAgKiBmcm9tIHJlcXVlc3RzIGFyZSBoYW5kbGVkIHZpYSBTZXJ2ZXIgU2VudCBFdmVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW5kcG9pbnQgLSBUaGUgZW5kcG9pbnQgb24gdGhlIHNlcnZlciB0byBzZW5kIHJlcXVlc3QgdG9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIFRoZSBwYXlsb2FkIHRvIHNlbmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZD1cIlBPU1RdIC0gVGhlIEhUVFAgbWV0aG9kIHRvIHVzZVxuICAgICAqL1xuICAgIHNlbmRSZXF1ZXN0KGVuZHBvaW50LCBkYXRhLCBtZXRob2QgPSBcIlBPU1RcIikge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKG1ldGhvZCwgZW5kcG9pbnQpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIGxldCByZXNwID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAvLyBJbnZhbGlkIHJlcXVlc3QgZXJyb3JcbiAgICAgICAgICAgICAgICBpZiAocmVzcC5zdWNjZXNzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4ocmVzcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCAmJiB4aHIuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAvLyBGYWlsZWQgcmVxdWVzdCBlcnJvclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIHRoaXMudG9rZW4pO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhbiBhY3Rpb24gcmVxdWVzdFxuICAgICAqXG4gICAgICogVGhpcyBpcyB0aGUgbW9zdCBoZWF2aWx5LXVzZWQgcmVxdWVzdCB0eXBlIGluIHRoZSBnYW1lLiBBbGwgaW4tZ2FtZVxuICAgICAqIGFjdGlvbnMgKGJldCwgY2hlY2ssIGZvbGQpIGhhcHBlbiBoZXJlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgLSBUaGUgcGF5bG9hZCB0byBzZW5kXG4gICAgICovXG4gICAgYWN0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImFjdGlvblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGNoZWNrKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJDSEVDS1wiKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgYmV0KGFtdCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJCRVRcIiwgYW10KTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgZm9sZCgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiRk9MRFwiKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgYmIoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJMSU5EXCIsIDUwKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgc2IoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJMSU5EXCIsIDI1KTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgam9pbihzZWF0TnVtLCBidXlJbikge1xuICAgICAgICBjb25zdCBkYXRhID0ge1wicG9zaXRpb25cIjogc2VhdE51bSwgXCJhbW91bnRcIjogYnV5SW59O1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiam9pblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGxlYXZlKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJsZWF2ZVwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSBiZWFjb24gdG8gdGhlIHNlcnZlciBvbiBkaXNjb25uZWN0XG4gICAgICpcbiAgICAgKiBUaGlzIGFsbG93cyBmb3Igc2VydmVyIHRvIGtub3cgd2hlbiBhIGNsaWVudCBkaXNjb25uZWN0cyBzb1xuICAgICAqIGl0IGNhbiBjbGVhbiB1cCBhcyBuZWNlc3NhcnkuIE5vIGd1YXJhbnRlZSB0aGF0IHRoaXMgbWVzc2FnZVxuICAgICAqIHdpbGwgZ28gdGhyb3VnaCwgc28gbXVzdCBoYXZlIHJlZHVuZGFudCBtZWFzdXJlcyBpbiBwbGFjZS5cbiAgICAgKi9cbiAgICBkaXNjb25uZWN0QmVhY29uKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0IHVybCA9IFwiL2Rpc2Nvbm5lY3QvXCI7XG4gICAgICAgIG5hdmlnYXRvci5zZW5kQmVhY29uKHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgYnVpbGRQYXlsb2FkKGFjdGlvblR5cGUsIGJldEFtdCA9IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwicGxheWVySWRcIjogdGhpcy5wbGF5ZXJJZCxcbiAgICAgICAgICAgIFwiYWN0aW9uVHlwZVwiOiBhY3Rpb25UeXBlLFxuICAgICAgICAgICAgXCJiZXRBbXRcIjogYmV0QW10XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBidWlsZFVybChlbmRwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlVXJsICsgZW5kcG9pbnQgKyBcIi9cIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXI7IiwiLyoqXG4gKiBAc3VtbWFyeSBTaW1wbGUgUGhhc2VyLlRleHQgZXh0ZW5zdGlvbiB0byBzdXBwb3J0IGF1dG9tYXRpYyByZXNpemluZ1xuICpcbiAqIElmIHRleHQgYm91bmRzIGFyZSBzZXQgb24gaW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MsIHRoZW4gZWFjaCB0aW1lIHRoZSB0ZXh0XG4gKiBvciBzdHlsZSBpcyBjaGFuZ2VkLCB0aGUgdGV4dCB3aWxsIGF1dG9tYXRpY2FsbHkgc2NhbGUgaXRzZWxmIGRvd24gdG8gZml0XG4gKiB3aXRoaW4gdGhvc2UgYm91bmRzIGhvcml6b250YWxseS4gVmVydGljYWwgYm91bmRzIGFyZSBpZ25vcmVkLlxuICpcbiAqIFBvc3NpYmxlIHVwZ3JhZGVzOlxuICogICAtIFNldCBtaW5pbXVtIHNjYWxlXG4gKiAgIC0gSWYgdGV4dCBzdGlsbCBvdmVyZmxvd3MgbWluIHNjYWxlLCB0aGVuIHRydW5jYXRlXG4gKi9cbmNsYXNzIExhYmVsIGV4dGVuZHMgUGhhc2VyLlRleHQge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIHRleHQsIHN0eWxlKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIHRleHQsIHN0eWxlKTtcbiAgICAgICAgdGhpcy5hbmNob3Iuc2V0VG8oMCwgMC41KTsgIC8vIENlbnRlciB2ZXJ0aWNhbGx5IHRvIGF2b2lkIGp1bXBzIG9uIHJlc2l6ZVxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIHNldFRleHQodGV4dCwgaW1tZWRpYXRlKSB7XG4gICAgICAgIHN1cGVyLnNldFRleHQodGV4dCwgaW1tZWRpYXRlKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9XG5cbiAgICBzZXRTdHlsZShzdHlsZSwgdXBkYXRlKSB7XG4gICAgICAgIHN1cGVyLnNldFN0eWxlKHN0eWxlLCB1cGRhdGUpO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJlc2l6ZSB0aGUgdGV4dCBob3Jpem9udGFsbHlcbiAgICAgKlxuICAgICAqIElmIHRleHQgZG9lcyBub3QgZml0IGhvcml6b250YWxseSBhdCBmdWxsIHNjYWxlLCB0aGVuIHNjYWxlIGRvd25cbiAgICAgKiB1bnRpbCBpdCBmaXRzLiBWZXJ0aWNhbCBvdmVyZmxvdyBpcyBpZ25vcmVkLlxuICAgICAqL1xuICAgIHJlc2l6ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRleHRCb3VuZHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjYWxlLnNldFRvKDEpO1xuICAgICAgICBpZiAodGhpcy53aWR0aCA+IHRoaXMudGV4dEJvdW5kcy53aWR0aCkge1xuICAgICAgICAgICAgdGhpcy5zY2FsZS5zZXRUbyh0aGlzLnRleHRCb3VuZHMud2lkdGggLyB0aGlzLndpZHRoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGFiZWw7IiwiaW1wb3J0IExhYmVsIGZyb20gXCIuL0xhYmVsXCI7XG5pbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuXG5jbGFzcyBOYW1lcGxhdGUgZXh0ZW5kcyBQaGFzZXIuSW1hZ2Uge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGtleSwgY29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSk7XG4gICAgICAgIGdhbWUud29ybGQuYWRkKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZyB8fCB0aGlzLmdhbWUuY29uZmlnLm5hbWVwbGF0ZTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7XG4gICAgICAgICAgICBuYW1lcGxhdGU6IG51bGwsXG4gICAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgICAgYmFsYW5jZTogbnVsbCxcbiAgICAgICAgICAgIGZsYXNoOiBudWxsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc2V0IG5hbWUobmFtZSkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS5zZXRUZXh0KG5hbWUpO1xuICAgIH1cblxuICAgIHNldCBiYWxhbmNlKGJhbGFuY2UpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2Uuc2V0VGV4dChVdGlsLnBhcnNlQ3VycmVuY3koYmFsYW5jZSkpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlID0gdGhpcztcblxuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZSA9IG5ldyBMYWJlbCh0aGlzLmdhbWUsIHRoaXMuY29uZmlnLm5hbWUueCwgdGhpcy5jb25maWcubmFtZS55LCBcIlwiLCB0aGlzLmNvbmZpZy5uYW1lLnN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUuc2V0VGV4dEJvdW5kcygwLCAwLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLndpZHRoIC0gMjAsIDApO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuZGlzcGxheS5uYW1lKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZSA9IG5ldyBMYWJlbCh0aGlzLmdhbWUsIHRoaXMuY29uZmlnLmJhbGFuY2UueCwgdGhpcy5jb25maWcuYmFsYW5jZS55LCBcIlwiLCB0aGlzLmNvbmZpZy5iYWxhbmNlLnN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2Uuc2V0VGV4dEJvdW5kcygwLCAwLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLndpZHRoIC0gMjAsIDApO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuZGlzcGxheS5iYWxhbmNlKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2ggPSBuZXcgTGFiZWwodGhpcy5nYW1lLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmNlbnRlclgsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuY2VudGVyWSwgXCJcIiwgdGhpcy5jb25maWcuZmxhc2guc3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2guc2V0VGV4dEJvdW5kcygwLCAwLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLndpZHRoIC0gMjAsIDApO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2guYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmZsYXNoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBGbGFzaCB0ZXh0IGZvciBkdXJhdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gZGlzcGxheXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2R1cmF0aW9uPTIwMDBdIC0gTWlsbGlzZWNvbmRzIHRvIGRpc3BsYXkgdGV4dFxuICAgICAqL1xuICAgIGZsYXNoKHRleHQsIGR1cmF0aW9uID0gMjAwMCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2guc2V0VGV4dCh0ZXh0KTtcblxuICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKGR1cmF0aW9uLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBOYW1lcGxhdGU7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4vQnV0dG9uXCI7XG5pbXBvcnQgU2xpZGVyIGZyb20gXCIuL1NsaWRlclwiO1xuaW1wb3J0IHtBY3Rpb259IGZyb20gXCIuL0FjdGlvblwiO1xuXG5jbGFzcyBQYW5lbCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJldHMgPSBbMF07XG4gICAgICAgIHRoaXMucHJpbWFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnByaW1hcnlBY3Rpb24gPSBBY3Rpb24uQkVUO1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IEFjdGlvbi5DSEVDSztcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnRlcnRpYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMudGVydGlhcnlBY3Rpb24gPSBBY3Rpb24uRk9MRDtcbiAgICAgICAgdGhpcy5zbGlkZXIgPSBuZXcgU2xpZGVyKHRoaXMuZ2FtZSwgXCJwYW5lbFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbHdheXNWaXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkgPSB0aGlzLm1ha2VCdXR0b24oMCwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5wcmltYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnByaW1hcnlBY3Rpb24sIHRoaXMucHJpbWFyeUJldCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDEzNSwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5zZWNvbmRhcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMuc2Vjb25kYXJ5QWN0aW9uLCB0aGlzLnNlY29uZGFyeUJldCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkudGVydGlhcnkgPSB0aGlzLm1ha2VCdXR0b24oMjcwLCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnRlcnRpYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnRlcnRpYXJ5QWN0aW9uLCAwKSk7XG5cbiAgICAgICAgdGhpcy5zbGlkZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuaW5kZXhDaGFuZ2VkLmFkZCgoaW5kZXgpID0+IHRoaXMuc2V0UHJpbWFyeUJldCh0aGlzLmJldHNbaW5kZXhdKSwgdGhpcyk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNsaWRlcldoZWVsLmFkZCh0aGlzLnNpbmdsZVN0ZXBCZXQsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2xpZGVyID0gdGhpcy5zbGlkZXIuYmFyO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2xpZGVyLnkgPSA2MDtcblxuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeS5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHRoaXMuc2xpZGVyLmVuYWJsZVNsaWRlcldoZWVsKHRydWUpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHRoaXMuc2xpZGVyLmVuYWJsZVNsaWRlcldoZWVsKGZhbHNlKSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5wcmltYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zZWNvbmRhcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnRlcnRpYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zbGlkZXIpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG1ha2VCdXR0b24oeCwgeSwgc2l6ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ1dHRvbiA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCB4LCB5LCB0aGlzLmtleSk7XG4gICAgICAgIGJ1dHRvbi5vbklucHV0VXAuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgYnV0dG9uLnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX292ZXJcIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX291dFwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfdXBcIlxuICAgICAgICApO1xuICAgICAgICBidXR0b24uc2V0VGV4dFN0eWxlKHRoaXMuZ2FtZS5jb25maWcucGFuZWwudGV4dFN0eWxlKTtcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICAvLyBQYW5lbCB1cGRhdGVzIHJlcXVpcmUgcGxheWVycycgY3VycmVudCBiZXRzLCBzbyBpZlxuICAgICAgICAvLyB0aGVyZSBpcyBubyBuZXh0IHBsYXllciB3ZSBzaG91bGRuJ3QgdXBkYXRlIHRoZSBkaXNwbGF5XG4gICAgICAgIGlmICghdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFjdGlvblRleHQgPSB0aGlzLmdhbWUucm91bmRCZXQgPT09IDAgPyBcIkJFVCBcIiA6IFwiUkFJU0UgVE9cXG5cIjtcbiAgICAgICAgbGV0IHByaW1hcnlUZXh0ID0gYWN0aW9uVGV4dCArIFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLnByaW1hcnlCZXQgKyB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuc2V0VGV4dChwcmltYXJ5VGV4dCk7XG5cbiAgICAgICAgbGV0IHNlY29uZGFyeVRleHQgPSBcIkNIRUNLXCI7XG4gICAgICAgIGlmICh0aGlzLnNlY29uZGFyeUFjdGlvbiAhPT0gQWN0aW9uLkNIRUNLKSB7XG4gICAgICAgICAgICBzZWNvbmRhcnlUZXh0ID0gXCJDQUxMIFwiICsgVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuc2Vjb25kYXJ5QmV0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5LnNldFRleHQoc2Vjb25kYXJ5VGV4dCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnRlcnRpYXJ5LnNldFRleHQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xuICAgIH1cblxuICAgIHNldEJldHMoYmV0cykge1xuICAgICAgICBpZiAoYmV0cy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBiZXRzLiBQYW5lbCBtdXN0IGFsd2F5cyBoYXZlIGF0IGxlYXN0IG9uZSB2YWxpZCBiZXQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iZXRzID0gYmV0cztcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0c1swXTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0TGVuZ3RoKGJldHMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoMCk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNldEVuYWJsZWQoYmV0cy5sZW5ndGggPiAxKTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc2V0UHJpbWFyeUJldChiZXQpIHtcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRTZWNvbmRhcnlCZXQoYmV0KSB7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QmV0ID0gYmV0O1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IGJldCA9PT0gMCA/IEFjdGlvbi5DSEVDSyA6IEFjdGlvbi5CRVQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEhpZGUgb3Igc2hvdyB0aGUgZW50aXJlIHBhbmVsXG4gICAgICogQHBhcmFtIHtib29sZWFufSB2aXNpYmxlXG4gICAgICovXG4gICAgc2V0VmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGUgfHwgdGhpcy5hbHdheXNWaXNpYmxlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBJbmNyZW1lbnQgb3IgZGVjcmVtZW50IHRoaXMucHJpbWFyeUJldFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLk1vdXNlLndoZWVsRGVsdGF9IG1vZGlmaWVyIC0gKzEgb3IgLTFcbiAgICAgKi9cbiAgICBzaW5nbGVTdGVwQmV0KG1vZGlmaWVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuc2xpZGVyLmluZGV4ICsgbW9kaWZpZXI7XG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDw9IHRoaXMuc2xpZGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYW5lbDsiLCJpbXBvcnQge0FjdGlvblRleHR9IGZyb20gXCIuLi9jbGFzc2VzL0FjdGlvblwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuaW1wb3J0IENoaXBNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DaGlwTWFuYWdlclwiO1xuaW1wb3J0IE5hbWVwbGF0ZSBmcm9tIFwiLi4vY2xhc3Nlcy9OYW1lcGxhdGVcIjtcblxuY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBjaGlwQ29uZmlnKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuY2hpcENvbmZpZyA9IGNoaXBDb25maWc7XG5cbiAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlcklkID0gbnVsbDtcbiAgICAgICAgdGhpcy5iYWxhbmNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5zaXR0aW5nT3V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWF0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5yb3VuZEJldCA9IDA7ICAvLyBTdW0gYmV0cyBieSBwbGF5ZXIgaW4gY3VycmVudCBiZXR0aW5nIHJvdW5kXG5cbiAgICAgICAgdGhpcy5pc0RlYWxlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzTmV4dCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzVXNlciA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7XG4gICAgICAgICAgICBuYW1lcGxhdGU6IG51bGwsXG4gICAgICAgICAgICBjYXJkczogbnVsbCxcbiAgICAgICAgICAgIGRlYWxlckJ1dHRvbjogbnVsbCxcbiAgICAgICAgICAgIGNoaXBzOiBudWxsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5jYXJkcyA9IG5ldyBDYXJkTWFuYWdlcih0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmNoaXBzID0gbmV3IENoaXBNYW5hZ2VyKHRoaXMuZ2FtZSwgXCJjaGlwc1wiLCB0aGlzLmdhbWUuY29uZmlnLmRlbm9tcyk7XG4gICAgICAgIHRoaXMubmFtZXBsYXRlID0gbmV3IE5hbWVwbGF0ZSh0aGlzLmdhbWUsIDAsIDAsIFwibmFtZXBsYXRlXCIpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoZGF0YSkge1xuICAgICAgICB0aGlzLmlkID0gZGF0YS5pZDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBkYXRhLnVzZXJJZDtcbiAgICAgICAgdGhpcy5iYWxhbmNlID0gZGF0YS5iYWxhbmNlO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBkYXRhLnNpdHRpbmdPdXQ7XG4gICAgICAgIHRoaXMuc2VhdCA9IGRhdGEuc2VhdDtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICB0aGlzLmlzVXNlciA9IGRhdGEuaXNVc2VyO1xuXG4gICAgICAgIHRoaXMuY2FyZHMuaW5pdGlhbGl6ZSgyKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZSA9IHRoaXMubmFtZXBsYXRlO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmluaXRpYWxpemVEaXNwbGF5KCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzID0gdGhpcy5jYXJkcy5kaXNwbGF5R3JvdXA7XG4gICAgICAgIHRoaXMuY2FyZHMuZGlzcGxheUdyb3VwLmFsaWduKC0xLCAxLCAodGhpcy5uYW1lcGxhdGUud2lkdGggLyB0aGlzLmNhcmRzLmxlbmd0aCkgKiAwLjUsIDApO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMuY2VudGVyWCA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuY2VudGVyWDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLmJvdHRvbSA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuYm90dG9tIC0gdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5oZWlnaHQgKiAwLjI7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbiA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwiZGVhbGVyQnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmxlZnQgPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmxlZnQgKyA1O1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmJvdHRvbSA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuYm90dG9tIC0gNTtcblxuICAgICAgICB0aGlzLmNoaXBzLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jaGlwcyA9IHRoaXMuY2hpcHMuZGlzcGxheUdyb3VwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMueCA9IHRoaXMuY2hpcENvbmZpZ1t0aGlzLnNlYXRdLng7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jaGlwcy55ID0gdGhpcy5jaGlwQ29uZmlnW3RoaXMuc2VhdF0ueTtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5jaGlwcy5kaXNwbGF5R3JvdXApO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmNhcmRzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5uYW1lcGxhdGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbik7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5uYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmJhbGFuY2UgPSB0aGlzLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuZnJhbWVOYW1lID0gdGhpcy5pc05leHQgPyBcInJlZFwiIDogXCJiYXNlXCI7XG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24udmlzaWJsZSA9IHRoaXMuaXNEZWFsZXIgPT09IHRydWU7XG4gICAgfVxuXG4gICAgdXBkYXRlKGRhdGEpIHtcbiAgICAgICAgLy8gVE9ETyAtIEZsZXNoIG91dCB0aGUgcmVzdCBvZiB0aGUgZGF0YSAtLSBkbyBJIGxpa2UgdGhpcyBtZXRob2Q/XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGRhdGEuYmFsYW5jZSA9PT0gdW5kZWZpbmVkID8gdGhpcy5iYWxhbmNlIDogZGF0YS5iYWxhbmNlO1xuICAgICAgICB0aGlzLmlzRGVhbGVyID0gZGF0YS5pc0RlYWxlciA9PT0gdW5kZWZpbmVkID8gdGhpcy5pc0RlYWxlciA6IGRhdGEuaXNEZWFsZXI7XG4gICAgICAgIHRoaXMuaXNOZXh0ID0gZGF0YS5pc05leHQgPT09IHVuZGVmaW5lZCA/IHRoaXMuaXNOZXh0IDogZGF0YS5pc05leHQ7XG4gICAgICAgIHRoaXMucm91bmRCZXQgPSBkYXRhLnJvdW5kQmV0ID09PSB1bmRlZmluZWQgPyB0aGlzLnJvdW5kQmV0IDogZGF0YS5yb3VuZEJldDtcbiAgICAgICAgdGhpcy5jaGlwcy5zZXRWYWx1ZSh0aGlzLnJvdW5kQmV0KTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgYWN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoe1xuICAgICAgICAgICAgYmFsYW5jZTogZGF0YS5wbGF5ZXJCYWxhbmNlLFxuICAgICAgICAgICAgcm91bmRCZXQ6IGRhdGEucGxheWVyUm91bmRCZXRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGFjdGlvblRleHQgPSBBY3Rpb25UZXh0W2RhdGEuYWN0aW9uVHlwZV07XG5cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjsiLCJpbXBvcnQgQ2hpcE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NoaXBNYW5hZ2VyXCI7XG5cbmNsYXNzIFBvdCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmFtb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICAgICAgdGhpcy5jaGlwcyA9IG5ldyBDaGlwTWFuYWdlcih0aGlzLmdhbWUsIFwiY2hpcHNcIiwgdGhpcy5nYW1lLmNvbmZpZy5kZW5vbXMpO1xuICAgICAgICB0aGlzLmNoaXBzLnN0YWNrQ2hpcHMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jaGlwcy5jb2xvclVwID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuY2hpcHMuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmNoaXBzLnNldFZhbHVlKHRoaXMuYW1vdW50KTtcbiAgICB9XG5cbiAgICBzZXRBbW91bnQoYW1vdW50KSB7XG4gICAgICAgIHRoaXMuYW1vdW50ID0gYW1vdW50O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBnYXRoZXJDaGlwcyhwbGF5ZXJzKSB7XG4gICAgICAgIGxldCBkZWxheSA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBsYXllciA9IHBsYXllcnNbaV07XG4gICAgICAgICAgICBpZiAocGxheWVyLmNoaXBzLmNoaXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxldCBjaGlwcyA9IHBsYXllci5jaGlwcy5jaGlwcy5zbGljZSgpO1xuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IHBsYXllci5jaGlwcy52YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKGRlbGF5LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW1vdW50ICs9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaXBzLnRha2VDaGlwcyhjaGlwcyk7XG4gICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgZGVsYXkgKz0gMTAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb3Q7IiwiLyoqXG4gKiBBIHNsaWRlciBVSSBlbGVtZW50XG4gKlxuICogUmVwcmVzZW50ZWQgYnkgYSBiYXIgc3ByaXRlIGFuZCBhIG1hcmtlciBzcHJpdGUuIERlc3BpdGUgaG93IGl0IG1heVxuICogbG9vaywgYWxsIGlucHV0IG9jY3VycyBvbiB0aGUgYmFyIGFuZCB1cGRhdGVzIGFyZSBtYWRlIHRvIHRoZVxuICogbWFya2VyJ3MgcG9zaXRpb24gYmFzZWQgb24gdGhvc2UgaW5wdXRzLlxuICovXG5jbGFzcyBTbGlkZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5iYXIgPSBudWxsOyAgLy8gVGhlIHNsaWRlciBiYXIgc3ByaXRlXG4gICAgICAgIHRoaXMubWFya2VyID0gbnVsbDsgIC8vIFRoZSBkcmFnZ2FibGUgbWFya2VyIHNwcml0ZVxuICAgICAgICB0aGlzLmluZGV4ID0gMDsgIC8vIEN1cnJlbnQgaW5kZXggb2YgbWFya2VyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMTsgIC8vIFRvdGFsIG51bWJlciBvZiBpbmRpY2VzXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2xpZGVyV2hlZWwgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmJhciA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgdGhpcy5rZXksIFwic2xpZGVyX2JhclwiKTtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXREb3duLmFkZCh0aGlzLnN0YXJ0RHJhZywgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0VXAuYWRkKHRoaXMuc3RvcERyYWcsIHRoaXMpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHRoaXMuZW5hYmxlU2xpZGVyV2hlZWwodHJ1ZSkpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4gdGhpcy5lbmFibGVTbGlkZXJXaGVlbChmYWxzZSkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyID0gdGhpcy5iYXI7XG5cbiAgICAgICAgdGhpcy5tYXJrZXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCB0aGlzLmtleSwgXCJzbGlkZXJfbWFya2VyXCIpO1xuICAgICAgICB0aGlzLm1hcmtlci5hbmNob3Iuc2V0VG8oMC41LCAwKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuYm90dG9tID0gdGhpcy5iYXIuYm90dG9tO1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyID0gdGhpcy5tYXJrZXI7XG4gICAgICAgIHRoaXMuYmFyLmFkZENoaWxkKHRoaXMubWFya2VyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgc2xpZGVyIGRyYWdnaW5nIGFuZCBpbml0aWF0ZSBmaXJzdCBkcmFnIGV2ZW50XG4gICAgICogQHBhcmFtIHtQaGFzZXIuU3ByaXRlfSBiYXIgLSBUaGUgYmFyIHNwcml0ZSB0aGF0IHdhcyBjbGlja2VkXG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBwb2ludGVyIHdoaWNoIGluaXRpYXRlZCB0aGUgY2xpY2tcbiAgICAgKi9cbiAgICBzdGFydERyYWcoYmFyLCBwb2ludGVyKSB7XG4gICAgICAgIC8vIEluaXRpYWwgY2FsbCB0byB1cGRhdGVEcmFnIGFsbG93cyBjaGFuZ2luZyBiZXQgd2l0aCBjbGljayBvbiBiYXJcbiAgICAgICAgdGhpcy51cGRhdGVEcmFnKHBvaW50ZXIsIHBvaW50ZXIueCwgcG9pbnRlci55KTtcbiAgICAgICAgdGhpcy5nYW1lLmlucHV0LmFkZE1vdmVDYWxsYmFjayh0aGlzLnVwZGF0ZURyYWcsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IERpc2FibGUgc2xpZGVyIGRyYWdnaW5nXG4gICAgICovXG4gICAgc3RvcERyYWcoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5kZWxldGVNb3ZlQ2FsbGJhY2sodGhpcy51cGRhdGVEcmFnLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBDYWxjdWxhdGUgc2xpZGVyIGluZGV4IGJhc2VkIG9uIGRyYWcgaW5wdXRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Qb2ludGVyfSBwb2ludGVyIC0gVGhlIHNsaWRpbmcgcG9pbnRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSBvZiBwb2ludGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIG9mIHBvaW50ZXJcbiAgICAgKi9cbiAgICB1cGRhdGVEcmFnKHBvaW50ZXIsIHgsIHkpIHtcbiAgICAgICAgbGV0IGxvY2FsWCA9IHggLSB0aGlzLmJhci53b3JsZC54OyAgLy8gQ2xpY2sgcG9zIGluIHJlbGF0aW9uIHRvIGJhclxuXG4gICAgICAgIC8vIFByZXZlbnQgZHJhZ2dpbmcgcGFzdCBiYXIgYm91bmRzXG4gICAgICAgIGlmIChsb2NhbFggPCAwKSB7XG4gICAgICAgICAgICBsb2NhbFggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsWCA+IHRoaXMuYmFyLndpZHRoKSB7XG4gICAgICAgICAgICBsb2NhbFggPSB0aGlzLmJhci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN1YnRyYWN0IDEgZnJvbSBsZW5ndGggYmVjYXVzZSBsZW5ndGggaXMgMS1pbmRleGVkLCBpbmRpY2VzIGFyZSAwLWluZGV4ZWRcbiAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLnJvdW5kKGxvY2FsWCAvIHRoaXMuYmFyLndpZHRoICogKHRoaXMubGVuZ3RoIC0gMSkpO1xuICAgICAgICB0aGlzLnNldEluZGV4KGluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIGluZGV4IG9mIHRoZSBzbGlkZXIgYW5kIHJlcG9ydCB0aGUgbmV3IHZhbHVlXG4gICAgICpcbiAgICAgKiBPcHRpb25hbGx5IHVwZGF0ZSB0aGUgdmlzdWFsIHBvc2l0aW9uIG9mIHRoZSBtYXJrZXIgb24gdGhlIHNsaWRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIE5ldyBpbmRleCB0byBzZXQgb24gc2xpZGVyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXBkYXRlUG9zPXRydWVdIC0gVXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBtYXJrZXI/XG4gICAgICovXG4gICAgc2V0SW5kZXgoaW5kZXgsIHVwZGF0ZVBvcyA9IHRydWUpIHtcbiAgICAgICAgaWYgKGluZGV4ICE9PSB0aGlzLmluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZC5kaXNwYXRjaChpbmRleCk7XG5cbiAgICAgICAgICAgIGlmICh1cGRhdGVQb3MpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiBvbmx5IG9uZSBiZXQgYXZhaWxhYmxlLCBpdCdzIGEgbWF4IGJldFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgMSBmcm9tIGxlbmd0aCBiZWNhdXNlIGxlbmd0aCBpcyAxLWluZGV4ZWQsIGluZGljZXMgYXJlIDAtaW5kZXhlZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGggLyAodGhpcy5sZW5ndGggLSAxKSAqIHRoaXMuaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVXBkYXRlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgKlxuICAgICAqIFRoZSBsZW5ndGggcHJvcGVydHkgZGVzY3JpYmVzIGhvdyBtYW55IGRpc2NyZXRlIGJldHMgdGhlIHNsaWRlciBiYXJcbiAgICAgKiBtdXN0IHJlcHJlc2VudC4gVGhlIHNsaWRlciBkb2VzIG5vdCBjYXJlIGFib3V0IHdoYXQgdGhlIHNwZWNpZmljIGJldFxuICAgICAqIGl0IHJlcHJlc2VudHMgaXMsIG9ubHkgdGhhdCBpdCBoYXMgc29tZSBudW1iZXIgb2YgaW5kaWNlcyBhbG9uZyBpdHNcbiAgICAgKiBsZW5ndGggYW5kIHRoYXQgaXQgbXVzdCByZXBvcnQgaXRzIGluZGV4IHRvIGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbmV3IGxlbmd0aCB0byBzZXRcbiAgICAgKi9cbiAgICBzZXRMZW5ndGgobGVuZ3RoKSB7XG4gICAgICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCBzZXQgc2xpZGVyIGxlbmd0aCBsZXNzIHRoYW4gMVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChsZW5ndGggPiB0aGlzLmJhci53aWR0aCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogU2V0dGluZyBzbGlkZXIgc3RvcHMgZ3JlYXRlciB0aGFuIGxlbmd0aCBtYXkgcmVzdWx0IGluIHVuZXhwZWN0ZWQgYmVoYXZpb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIHNsaWRlclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIElzIHRoZSBzbGlkZXIgZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gZW5hYmxlZDtcblxuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyLnRpbnQgPSB0aW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIGRpc3BhdGNoIG9mIHNpZ25hbCBvbiB3aGVlbCBzY3JvbGxcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBJcyB0aGUgY2FsbGJhY2sgZW5hYmxlZCBvciBkaXNhYmxlZD9cbiAgICAgKi9cbiAgICBlbmFibGVTbGlkZXJXaGVlbChlbmFibGVkKSB7XG4gICAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQubW91c2UubW91c2VXaGVlbENhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyV2hlZWwuZGlzcGF0Y2godGhpcy5nYW1lLmlucHV0Lm1vdXNlLndoZWVsRGVsdGEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS5tb3VzZVdoZWVsQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbGlkZXI7IiwibW9kdWxlLmV4cG9ydHM9e1xuICBcInBhbmVsXCI6IHtcbiAgICBcInBhZGRpbmdcIjogMTAsXG4gICAgXCJ0ZXh0U3R5bGVcIjoge1xuICAgICAgXCJmb250XCI6IFwiYm9sZCAyMnB0IEFyaWFsXCIsXG4gICAgICBcImZpbGxcIjogXCJ3aGl0ZVwiLFxuICAgICAgXCJhbGlnblwiOiBcImNlbnRlclwiXG4gICAgfSxcbiAgICBcInBvc1wiOiB7XG4gICAgICBcInhcIjogMTQ4MCxcbiAgICAgIFwieVwiOiA3OTBcbiAgICB9XG4gIH0sXG4gIFwic2VhdHNcIjoge1xuICAgIFwiMTBcIjogW1xuICAgICAge1wieFwiOiA4NjAsIFwieVwiOiAyMDB9LFxuICAgICAge1wieFwiOiAxMTc4LCBcInlcIjogMjAwfSxcbiAgICAgIHtcInhcIjogMTUyMiwgXCJ5XCI6IDM0Mn0sXG4gICAgICB7XCJ4XCI6IDE1MjIsIFwieVwiOiA2MjZ9LFxuICAgICAge1wieFwiOiAxMTc4LCBcInlcIjogODk0fSxcbiAgICAgIHtcInhcIjogODYwLCBcInlcIjogODk0fSxcbiAgICAgIHtcInhcIjogNTQyLCBcInlcIjogODk0fSxcbiAgICAgIHtcInhcIjogMTk4LCBcInlcIjogNjI2fSxcbiAgICAgIHtcInhcIjogMTk4LCBcInlcIjogMzQyfSxcbiAgICAgIHtcInhcIjogNTQyLCBcInlcIjogMjAwfVxuICAgIF0sXG5cbiAgICAvLyBUT0RPXG4gICAgXCI4XCI6IFtdLFxuICAgIFwiOVwiOiBbXVxuICB9LFxuICBcImJ1eUluTW9kYWxcIjoge1xuICAgIFwieFwiOiA4MTAsXG4gICAgXCJ5XCI6IDQzMCxcbiAgICBcImlucHV0Qm94XCI6IHtcbiAgICAgIFwieFwiOiAxNSxcbiAgICAgIFwieVwiOiA4NlxuICAgIH0sXG4gICAgXCJpbnB1dEZpZWxkXCI6IHtcbiAgICAgIFwieFwiOiAzMCxcbiAgICAgIFwieVwiOiAtMlxuICAgIH0sXG4gICAgXCJjYW5jZWxCdXR0b25cIjoge1xuICAgICAgXCJ4XCI6IDE1LFxuICAgICAgXCJ5XCI6IDE0NVxuICAgIH0sXG4gICAgXCJzdWJtaXRCdXR0b25cIjoge1xuICAgICAgXCJ4XCI6IDE1NSxcbiAgICAgIFwieVwiOiAxNDVcbiAgICB9XG4gIH0sXG4gIFwiZGVub21zXCI6IFs1LCAyNSwgMTAwLCA1MDAsIDIwMDBdLFxuICBcImNoaXBzXCI6IHtcbiAgICBcIjEwXCI6IFtcbiAgICAgIHtcInhcIjogMTAwLCBcInlcIjogMTIwfSxcbiAgICAgIHtcInhcIjogMTAwLCBcInlcIjogMTIwfSxcbiAgICAgIHtcInhcIjogLTYwLCBcInlcIjogNDB9LFxuICAgICAge1wieFwiOiAtNjAsIFwieVwiOiA0MH0sXG4gICAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IC0xNDB9LFxuICAgICAge1wieFwiOiAxMDAsIFwieVwiOiAtMTQwfSxcbiAgICAgIHtcInhcIjogMTAwLCBcInlcIjogLTE0MH0sXG4gICAgICB7XCJ4XCI6IDI0MCwgXCJ5XCI6IDQwfSxcbiAgICAgIHtcInhcIjogMjQwLCBcInlcIjogNDB9LFxuICAgICAge1wieFwiOiAxMDAsIFwieVwiOiAxMjB9XG4gICAgXVxuICB9LFxuICBcIm5hbWVwbGF0ZVwiOiB7XG4gICAgXCJuYW1lXCI6IHtcbiAgICAgIFwieFwiOiAxMCxcbiAgICAgIFwieVwiOiAzMCxcbiAgICAgIFwic3R5bGVcIjoge1xuICAgICAgICBcImZvbnRcIjogXCJib2xkIDIycHQgQXJpYWxcIixcbiAgICAgICAgXCJmaWxsXCI6IFwiIzMzMzMzM1wiXG4gICAgICB9XG4gICAgfSxcbiAgICBcImJhbGFuY2VcIjoge1xuICAgICAgXCJ4XCI6IDEwLFxuICAgICAgXCJ5XCI6IDYwLFxuICAgICAgXCJzdHlsZVwiOiB7XG4gICAgICAgIFwiZm9udFwiOiBcIjE2cHQgQXJpYWxcIixcbiAgICAgICAgXCJib3VuZHNBbGlnbkhcIjogXCJyaWdodFwiLFxuICAgICAgICBcImZpbGxcIjogXCIjNTU1NTU1XCJcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiZmxhc2hcIjoge1xuICAgICAgXCJzdHlsZVwiOiB7XG4gICAgICAgIFwiZm9udFwiOiBcImJvbGQgMzBwdCBBcmlhbFwiLFxuICAgICAgICBcImZpbGxcIjogXCIjMzMzMzMzXCJcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFwicG9wdXBcIjoge1xuICAgIFwieFwiOiAwLFxuICAgIFwieVwiOiAxMCxcbiAgICBcIndpZHRoXCI6IDYwLFxuICAgIFwiaGVpZ2h0XCI6IDIwLFxuICAgIFwidGV4dFwiOiB7XG4gICAgICBcInhcIjogNixcbiAgICAgIFwieVwiOiAxOCxcbiAgICAgIFwic3R5bGVcIjoge1xuICAgICAgICBcImZvbnRcIjogXCIxMnB0IEFyaWFsXCIsXG4gICAgICAgIFwiYm91bmRzQWxpZ25IXCI6IFwiY2VudGVyXCIsXG4gICAgICAgIFwiYm91bmRzQWxpZ25WXCI6IFwiY2VudGVyXCIsXG4gICAgICAgIFwiZmlsbFwiOiBcIiNGRkZGRkZcIlxuICAgICAgfVxuICAgIH1cbiAgfVxufSIsImltcG9ydCBCdXR0b24gZnJvbSBcIi4uL2NsYXNzZXMvQnV0dG9uXCI7XG5cbmNsYXNzIEJ1eUluTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJ1eUluUmVxdWVzdGVkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5zZWF0cyA9IHt9O1xuXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcImJ1dHRvbnNcIjogW10sIFwibW9kYWxcIjogbnVsbCwgXCJpbnB1dEJveFwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmJ1dHRvbnNHcm91cCk7XG5cbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkICYmIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkLnZpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShzZWF0Q29uZmlnLCBvY2N1cGllZFNlYXRzLCBtb2RhbENvbmZpZykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXRDb25maWcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgc2VhdENvbmZpZ1tpXS54LCBzZWF0Q29uZmlnW2ldLnksIHRoaXMua2V5LCB0aGlzLmJ1dHRvbkNsaWNrZWQsIHRoaXMpO1xuICAgICAgICAgICAgYnV0dG9uLnNlYXROdW0gPSBpOyAvLyBTdG9yZSBmb3IgdXNlIG9uIGNsaWNrXG4gICAgICAgICAgICBidXR0b24uc2V0RnJhbWVzKFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX292ZXJcIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9vdXRcIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9kb3duXCIsXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fdXBcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRUZXh0KFwiQnV5IEluXCIpO1xuICAgICAgICAgICAgdGhpcy5zZWF0c1tpXSA9IHtcbiAgICAgICAgICAgICAgICBcImJ1dHRvblwiOiBidXR0b24sXG4gICAgICAgICAgICAgICAgXCJvY2N1cGllZFwiOiBvY2N1cGllZFNlYXRzLmluZGV4T2YoaSkgIT09IC0xXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmJ1dHRvbnMucHVzaChidXR0b24pO1xuICAgICAgICAgICAgdGhpcy5idXR0b25zR3JvdXAuYWRkKGJ1dHRvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAudmlzaWJsZSA9IHRoaXMuYnV0dG9uc1Zpc2libGU7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsQmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgdGhpcy5nYW1lLnRleHR1cmVzLm1vZGFsQmFja2dyb3VuZCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkubW9kYWxCYWNrZ3JvdW5kKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwgPSB0aGlzLmdhbWUuYWRkLmltYWdlKG1vZGFsQ29uZmlnLngsIG1vZGFsQ29uZmlnLnksIHRoaXMua2V5LCBcIm1vZGFsXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkubW9kYWwpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEJveCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UobW9kYWxDb25maWcuaW5wdXRCb3gueCwgbW9kYWxDb25maWcuaW5wdXRCb3gueSwgdGhpcy5rZXksIFwiaW5wdXRfYm94XCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmlucHV0Qm94KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZCA9IHRoaXMuZ2FtZS5hZGQuaW5wdXRGaWVsZChtb2RhbENvbmZpZy5pbnB1dEZpZWxkLngsIG1vZGFsQ29uZmlnLmlucHV0RmllbGQueSwge1xuICAgICAgICAgICAgZm9udDogJzMycHggQXJpYWwnLFxuICAgICAgICAgICAgZmlsbDogJyMzMzMzMzMnLFxuICAgICAgICAgICAgd2lkdGg6IDIyMCxcbiAgICAgICAgICAgIHBhZGRpbmc6IDgsXG4gICAgICAgICAgICBib3JkZXJXaWR0aDogMCxcbiAgICAgICAgICAgIHBsYWNlSG9sZGVyOiAnMjAuMDAnLFxuICAgICAgICAgICAgdHlwZTogUGhhc2VySW5wdXQuSW5wdXRUeXBlLm51bWJlcixcbiAgICAgICAgICAgIGZpbGxBbHBoYTogMFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0Qm94LmFkZENoaWxkKHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkKTtcblxuICAgICAgICBjb25zdCBidG5UZXh0U3R5bGUgPSB7XG4gICAgICAgICAgICBcImZvbnRcIjogXCJib2xkIDIycHQgQXJpYWxcIixcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICAgICAgICBcImFsaWduXCI6IFwiY2VudGVyXCJcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FuY2VsID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIG1vZGFsQ29uZmlnLmNhbmNlbEJ1dHRvbi54LCBtb2RhbENvbmZpZy5jYW5jZWxCdXR0b24ueSwgdGhpcy5rZXksIHRoaXMuY2FuY2VsLCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbC5zZXRGcmFtZXMoXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X291dFwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X2Rvd25cIixcbiAgICAgICAgICAgIFwiYnRuX3NlY29uZGFyeV91cFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0VGV4dFN0eWxlKGJ0blRleHRTdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0VGV4dChcIkNBTkNFTFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLmFkZENoaWxkKHRoaXMuZGlzcGxheS5jYW5jZWwpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQgPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgbW9kYWxDb25maWcuc3VibWl0QnV0dG9uLngsIG1vZGFsQ29uZmlnLnN1Ym1pdEJ1dHRvbi55LCB0aGlzLmtleSwgdGhpcy5zdWJtaXQsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc3VibWl0LnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX3ByaW1hcnlfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9vdXRcIixcbiAgICAgICAgICAgIFwiYnRuX3ByaW1hcnlfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV91cFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0VGV4dFN0eWxlKGJ0blRleHRTdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0VGV4dChcIkJVWSBJTlwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLmFkZENoaWxkKHRoaXMuZGlzcGxheS5zdWJtaXQpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuc2VhdHNbcGxheWVyRGF0YS5zZWF0XS5vY2N1cGllZCA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHBsYXllckxlZnQocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLnNlYXRzW3BsYXllckRhdGEuc2VhdF0ub2NjdXBpZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgZm9yIChsZXQgc2VhdE51bSBpbiB0aGlzLnNlYXRzKSB7XG4gICAgICAgICAgICBsZXQgc2VhdCA9IHRoaXMuc2VhdHNbc2VhdE51bV07XG4gICAgICAgICAgICBzZWF0LmJ1dHRvbi52aXNpYmxlID0gIXNlYXQub2NjdXBpZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAudmlzaWJsZSA9IHRoaXMuYnV0dG9uc1Zpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgIH1cblxuICAgIGJ1dHRvbkNsaWNrZWQoYnV0dG9uKSB7XG4gICAgICAgIHRoaXMuZGF0YS5zZWF0TnVtID0gYnV0dG9uLnNlYXROdW07XG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBjYW5jZWwoKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHtcInNlYXROdW1cIjogbnVsbCwgXCJidXlJblwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHN1Ym1pdCgpIHtcbiAgICAgICAgdGhpcy5kYXRhLmJ1eUluID0gdGhpcy5kaXNwbGF5LmlucHV0RmllbGQudmFsdWU7XG4gICAgICAgIHRoaXMuYnV5SW5SZXF1ZXN0ZWQuZGlzcGF0Y2godGhpcy5kYXRhLnNlYXROdW0sIHRoaXMuZGF0YS5idXlJbik7XG4gICAgICAgIHRoaXMuZGF0YSA9IHtcInNlYXROdW1cIjogbnVsbCwgXCJidXlJblwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRCdXR0b25zVmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1eUluTWFuYWdlcjsiLCJpbXBvcnQgQ2FyZCBmcm9tIFwiLi4vY2xhc3Nlcy9DYXJkXCI7XG5cbmNsYXNzIENhcmRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuY2FyZHMgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShudW1fY2FyZHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fY2FyZHM7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNhcmQgPSBuZXcgQ2FyZCh0aGlzLmdhbWUsIHRoaXMpO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplKHt9KTtcbiAgICAgICAgICAgIGNhcmQuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICAgICAgdGhpcy5jYXJkcy5wdXNoKGNhcmQpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKGNhcmQuc3ByaXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFsaWduKC0xLCAxLCB0aGlzLmNhcmRzWzBdLnNwcml0ZS53aWR0aCAqIDEuMiwgMCk7XG4gICAgfVxuXG4gICAgc2V0Q2FyZE5hbWVzKG5hbWVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG5hbWVzW2ldO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLm5hbWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgbGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYXJkcy5sZW5ndGg7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXJkTWFuYWdlcjsiLCJpbXBvcnQgQ2hpcCBmcm9tIFwiLi4vY2xhc3Nlcy9DaGlwXCI7XG5pbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuXG5jbGFzcyBUb29sdGlwIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXksIHBhZGRpbmcgPSAxMCkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5wYWRkaW5nID0gcGFkZGluZztcblxuICAgICAgICB0aGlzLl90ZXh0ID0gXCJcIjtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogbnVsbCxcbiAgICAgICAgICAgIHRleHQ6IG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCB0ZXh0KHRleHQpIHtcbiAgICAgICAgdGhpcy5fdGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXh0LnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnJlUG9zKCk7XG4gICAgfVxuXG4gICAgZ2V0IHRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICAgIH1cblxuICAgIHNldCB2aXNpYmxlKHZpc2libGUpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAudmlzaWJsZSA9IHZpc2libGU7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgdGhpcy5rZXkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAyLCBcIlwiKTsgICAvLyBUT0RPIC0gTm8gbWFnaWMgbnVtYmVycyAobGVhdmluZyBmb3Igbm93IGJlY2F1c2UgZnVjayB0cnlpbmcgdG8gcG9zaXRpb24gdGV4dCB2ZXJ0aWNhbGx5KVxuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dC5zZXRTdHlsZSh7XG4gICAgICAgICAgICBcImZvbnRcIjogXCIxNnB0IEFyaWFsXCIsXG4gICAgICAgICAgICBcImZpbGxcIjogXCIjRkZGRkZGXCJcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXh0LmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuYmFja2dyb3VuZCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkudGV4dCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZVBvcygpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQuc2NhbGUuc2V0VG8oMSk7XG4gICAgICAgIGNvbnN0IHRleHRBcmVhID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQud2lkdGggLSAodGhpcy5wYWRkaW5nICogMik7XG4gICAgICAgIGlmICh0aGlzLmRpc3BsYXkudGV4dC53aWR0aCA+IHRleHRBcmVhKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkudGV4dC5zY2FsZS5zZXRUbyh0ZXh0QXJlYSAvIHRoaXMuZGlzcGxheS50ZXh0LndpZHRoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgQ2hpcE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSwgdmFsdWVzKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcblxuICAgICAgICB0aGlzLnN0YWNrQ2hpcHMgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvbG9yVXAgPSB0cnVlO1xuICAgICAgICB0aGlzLmNoaXBzID0gW107XG4gICAgICAgIHRoaXMucG9vbCA9IFtdO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IG51bGw7XG4gICAgICAgIHRoaXMudG9vbHRpcCA9IG5ldyBUb29sdGlwKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLnRleHR1cmVzLnRleHRVbmRlcmxheSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7XG4gICAgICAgICAgICBjaGlwczogdGhpcy5nYW1lLmFkZC5ncm91cCgpLFxuICAgICAgICAgICAgdG9vbHRpcDogdGhpcy50b29sdGlwLmRpc3BsYXlHcm91cFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnRyYW5zZmVyQW5pbWF0aW9uID0gdGhpcy5hbmltYXRlQ2hpcENhc2NhZGU7XG4gICAgICAgIHRoaXMudHJhbnNmZXJDb21wbGV0ZSA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMucGlsZVJhZGl1cyA9IDMwO1xuICAgIH1cblxuICAgIHNldCB2YWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnRvb2x0aXAudGV4dCA9IFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLl92YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMudG9vbHRpcC5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgICAgICB0aGlzLmRpc3BsYXkudG9vbHRpcC55ID0gdGhpcy5kaXNwbGF5LnRvb2x0aXAuaGVpZ2h0O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmNoaXBzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS50b29sdGlwKTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSgwKTtcbiAgICB9XG5cbiAgICBnZXRDaGlwKCkge1xuICAgICAgICBsZXQgY2hpcCA9IHRoaXMucG9vbC5wb3AoKTtcbiAgICAgICAgaWYgKCFjaGlwKSB7XG4gICAgICAgICAgICBjaGlwID0gbmV3IENoaXAodGhpcy5nYW1lLCAwLCAwLCB0aGlzLmtleSwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNldENoaXBJbnB1dHMoY2hpcCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMuYWRkQ2hpbGQoY2hpcCk7XG4gICAgICAgIH1cbiAgICAgICAgY2hpcC5yZXZpdmUoKTtcbiAgICAgICAgY2hpcC5wYXJlbnQuYnJpbmdUb1RvcChjaGlwKTtcbiAgICAgICAgdGhpcy5jaGlwcy5wdXNoKGNoaXApO1xuICAgICAgICByZXR1cm4gY2hpcDtcbiAgICB9XG5cbiAgICBzZXRDaGlwSW5wdXRzKGNoaXApIHtcbiAgICAgICAgY2hpcC5ldmVudHMub25JbnB1dE92ZXIucmVtb3ZlQWxsKCk7XG4gICAgICAgIGNoaXAuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCgoKSA9PiB7dGhpcy50b29sdGlwLnZpc2libGUgPSB0cnVlfSk7XG5cbiAgICAgICAgY2hpcC5ldmVudHMub25JbnB1dE91dC5yZW1vdmVBbGwoKTtcbiAgICAgICAgY2hpcC5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4ge3RoaXMudG9vbHRpcC52aXNpYmxlID0gZmFsc2V9KTtcbiAgICB9XG5cbiAgICBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuX3ZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb2xvclVwKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSAtPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSArPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB5UG9zID0gMDtcbiAgICAgICAgbGV0IHZhbHVlc1B0ciA9IHRoaXMudmFsdWVzLmxlbmd0aCAtIDE7XG4gICAgICAgIHdoaWxlICh2YWx1ZSA+PSAyNSkge1xuICAgICAgICAgICAgd2hpbGUgKHZhbHVlIDwgdGhpcy52YWx1ZXNbdmFsdWVzUHRyXSkge1xuICAgICAgICAgICAgICAgIHZhbHVlc1B0ci0tO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZXNQdHIgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGNoaXAgPSB0aGlzLmdldENoaXAoKTtcbiAgICAgICAgICAgIGNoaXAudmFsdWUgPSB0aGlzLnZhbHVlc1t2YWx1ZXNQdHJdO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zdGFja0NoaXBzKSB7XG4gICAgICAgICAgICAgICAgY2hpcC55ID0geVBvcztcbiAgICAgICAgICAgICAgICB5UG9zIC09IDU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoaXBzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlwLnggPSAwO1xuICAgICAgICAgICAgICAgICAgICBjaGlwLnkgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByYW5kUG9zID0gdGhpcy5yYW5kQ2hpcFBvcygpO1xuICAgICAgICAgICAgICAgICAgICBjaGlwLnggPSByYW5kUG9zLng7XG4gICAgICAgICAgICAgICAgICAgIGNoaXAueSA9IHJhbmRQb3MueTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSAtPSB0aGlzLnZhbHVlc1t2YWx1ZXNQdHJdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGxldCBjaGlwO1xuICAgICAgICB3aGlsZSAoY2hpcCA9IHRoaXMuY2hpcHMucG9wKCkpIHtcbiAgICAgICAgICAgIHRoaXMucG9vbC5wdXNoKGNoaXApO1xuICAgICAgICAgICAgY2hpcC5raWxsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhckNoaXAoY2hpcCkge1xuICAgICAgICAvLyBSZW1vdmUgY2hpcCBmcm9tIHRoaXMuY2hpcHMgaWYgZm91bmRcbiAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hpcHNbaV0uaWQgPT09IGNoaXAuaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaXBzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgIHRoaXMucG9vbC5wdXNoKGNoaXApO1xuICAgICAgICAgICAgY2hpcC5raWxsKCk7XG4gICAgICAgICAgICByZXR1cm4gY2hpcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRha2VDaGlwcyhjaGlwcykge1xuICAgICAgICBjaGlwcyA9IGNoaXBzLnNsaWNlKCk7XG4gICAgICAgIGxldCBuZXdDaGlwcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbmV3Q2hpcCA9IHRoaXMudGFrZUNoaXAoY2hpcHNbaV0pO1xuICAgICAgICAgICAgbmV3Q2hpcHMucHVzaChuZXdDaGlwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudHJhbnNmZXJBbmltYXRpb24obmV3Q2hpcHMpO1xuICAgIH1cblxuICAgIHRha2VDaGlwKHNyY0NoaXApIHtcbiAgICAgICAgbGV0IG5ld0NoaXAgPSB0aGlzLmdldENoaXAoKTtcbiAgICAgICAgbmV3Q2hpcC5jbG9uZShzcmNDaGlwKTtcbiAgICAgICAgdGhpcy5zZXRDaGlwSW5wdXRzKG5ld0NoaXApO1xuXG4gICAgICAgIHNyY0NoaXAubWFuYWdlci5jbGVhckNoaXAoc3JjQ2hpcCk7XG5cbiAgICAgICAgdGhpcy52YWx1ZSArPSBzcmNDaGlwLnZhbHVlO1xuXG4gICAgICAgIHJldHVybiBuZXdDaGlwO1xuICAgIH1cblxuICAgIGFuaW1hdGVTdGFja1RyYW5zZmVyKCkge1xuXG4gICAgfVxuXG4gICAgYW5pbWF0ZUNoaXBDYXNjYWRlKGNoaXBzKSB7XG4gICAgICAgIGxldCBkZWxheSA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlwID0gY2hpcHNbaV07XG4gICAgICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKGRlbGF5LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJhbmRQb3MgPSB0aGlzLnJhbmRDaGlwUG9zKCk7XG4gICAgICAgICAgICAgICAgbGV0IHR3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2VlbihjaGlwKS50byh7eDogcmFuZFBvcy54LCB5OiByYW5kUG9zLnl9LCAyMDAsIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLkluT3V0LCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7dGhpcy52YWx1ZSArPSBjaGlwLnZhbHVlfSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IGNoaXBzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4gdGhpcy50cmFuc2ZlckNvbXBsZXRlLmRpc3BhdGNoKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgZGVsYXkgKz0gMTAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmFuZENoaXBQb3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKC10aGlzLnBpbGVSYWRpdXMsIHRoaXMucGlsZVJhZGl1cyksXG4gICAgICAgICAgICB5OiB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKC10aGlzLnBpbGVSYWRpdXMsIHRoaXMucGlsZVJhZGl1cylcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoaXBNYW5hZ2VyOyIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL2NsYXNzZXMvUGxheWVyXCI7XG5cbmNsYXNzIFBsYXllck1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVzZXJJZCwgc2VhdENvbmZpZywgY2hpcENvbmZpZykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgdGhpcy5zZWF0Q29uZmlnID0gc2VhdENvbmZpZztcbiAgICAgICAgdGhpcy5jaGlwQ29uZmlnID0gY2hpcENvbmZpZztcblxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTsgIC8vIERpcmVjdCBhY2Nlc3MgdG8gdGhlIFBsYXllciBvYmplY3RzXG4gICAgICAgIHRoaXMudXNlclBsYXllciA9IG51bGw7ICAvLyBUaGUgdXNlcidzIHBsYXllciBvYmplY3QsIGlmIGF2YWlsYWJsZVxuICAgICAgICB0aGlzLm5leHRQbGF5ZXIgPSBudWxsOyAgLy8gVGhlIHBsYXllciB0aGF0IHRoZSBnYW1lIGV4cGVjdHMgdG8gYWN0IG5leHRcblxuICAgICAgICAvLyBDb250YWlucyBhbGwgZGlzcGxheSBlbGVtZW50cyBmb3IgYWxsIHBsYXllcnMgaW4gdGhlIGdhbWVcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5uZXdQbGF5ZXIocGxheWVyRGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXdQbGF5ZXIocGxheWVyRGF0YSkge1xuICAgICAgICBsZXQgcGxheWVyID0gbmV3IFBsYXllcih0aGlzLmdhbWUsIHRoaXMuY2hpcENvbmZpZyk7XG4gICAgICAgIHBsYXllci5pbml0aWFsaXplKHBsYXllckRhdGEpO1xuICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnggPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS54O1xuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnkgPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS55O1xuXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChwbGF5ZXIuZGlzcGxheUdyb3VwKTtcblxuICAgICAgICBpZiAocGxheWVyLnVzZXJJZCA9PT0gdGhpcy51c2VySWQpIHtcbiAgICAgICAgICAgIHRoaXMudXNlclBsYXllciA9IHBsYXllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgcGxheWVyTGVmdChwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLmdldEJ5SWQocGxheWVyRGF0YS5pZCk7XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCBmaW5kIHBsYXllciBhdCB0YWJsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAuZGVzdHJveSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1tpXSA9PT0gcGxheWVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbGF5ZXIgPT09IHRoaXMudXNlclBsYXllcikge1xuICAgICAgICAgICAgdGhpcy51c2VyUGxheWVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgZ2V0QnlJZChpZCkge1xuICAgICAgICAvLyBUT0RPIC0gRG8gdGhpcyB3aXRob3V0IGl0ZXJhdGluZyAtLSBidWlsZCBtYXAgb24gaW5pdD9cbiAgICAgICAgLy8gVE9ETyAtIFNob3VsZCB0aGlzIGV2ZXIgcmV0dXJuIG51bGw/XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IGEgbGlzdCBvZiBhbGwgb2NjdXBpZWQgc2VhdHMgYXQgdGhlIHRhYmxlXG4gICAgICogQHJldHVybnMge251bWJlcltdfSAtIFRoZSBJRHMgb2Ygb2NjdXBpZWQgc2VhdHNcbiAgICAgKi9cbiAgICBnZXRPY2N1cGllZFNlYXRzKCkge1xuICAgICAgICBsZXQgb2NjdXBpZWRTZWF0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb2NjdXBpZWRTZWF0cy5wdXNoKHRoaXMucGxheWVyc1tpXS5zZWF0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2NjdXBpZWRTZWF0cztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllck1hbmFnZXI7IiwiY29uc3QgaXNTdHJpbmcgPSB2YWwgPT4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG5jb25zdCBpc0Jsb2IgPSB2YWwgPT4gdmFsIGluc3RhbmNlb2YgQmxvYjtcblxucG9seWZpbGwuY2FsbCh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6IHRoaXMgfHwge30pO1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgaWYgKGlzU3VwcG9ydGVkLmNhbGwodGhpcykpIHJldHVybjtcblxuICBpZiAoISgnbmF2aWdhdG9yJyBpbiB0aGlzKSkgdGhpcy5uYXZpZ2F0b3IgPSB7fTtcbiAgdGhpcy5uYXZpZ2F0b3Iuc2VuZEJlYWNvbiA9IHNlbmRCZWFjb24uYmluZCh0aGlzKTtcbn07XG5cbmZ1bmN0aW9uIHNlbmRCZWFjb24odXJsLCBkYXRhKSB7XG4gIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudCAmJiB0aGlzLmV2ZW50LnR5cGU7XG4gIGNvbnN0IHN5bmMgPSBldmVudCA9PT0gJ3VubG9hZCcgfHwgZXZlbnQgPT09ICdiZWZvcmV1bmxvYWQnO1xuXG4gIGNvbnN0IHhociA9ICgnWE1MSHR0cFJlcXVlc3QnIGluIHRoaXMpID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcbiAgeGhyLm9wZW4oJ1BPU1QnLCB1cmwsICFzeW5jKTtcbiAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnKi8qJyk7XG5cblxuICBpZiAoaXNTdHJpbmcoZGF0YSkpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSAndGV4dC9wbGFpbic7XG4gIH0gZWxzZSBpZiAoaXNCbG9iKGRhdGEpICYmIGRhdGEudHlwZSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCBkYXRhLnR5cGUpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICB4aHIuc2VuZChkYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gIHJldHVybiAoJ25hdmlnYXRvcicgaW4gdGhpcykgJiYgKCdzZW5kQmVhY29uJyBpbiB0aGlzLm5hdmlnYXRvcik7XG59IiwiaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgQ29udHJvbGxlciBmcm9tIFwiLi4vY2xhc3Nlcy9Db250cm9sbGVyXCI7XG5cbmNsYXNzIEJvb3QgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbml0aWFsRGF0YSA9IHRoaXMuYXVnbWVudEluaXRpYWxEYXRhKGluaXRpYWxEYXRhKTtcbiAgICAgICAgdGhpcy5nYW1lLmNvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICAvLyBUT0RPIC0gVGhpcyBzaG91bGQgY29tZSBmcm9tIHNvbWV3aGVyZSBkeW5hbWljXG4gICAgICAgIHRoaXMuZ2FtZS5ydWxlcyA9IHtcbiAgICAgICAgICAgIGFudGU6IDAsXG4gICAgICAgICAgICBibGluZHM6IHtcbiAgICAgICAgICAgICAgICBzbWFsbDogMjUsXG4gICAgICAgICAgICAgICAgYmlnOiA1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcklkLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudG9rZW4pO1xuXG4gICAgICAgIGlmICh0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkKSB7XG4gICAgICAgICAgICB3aW5kb3cuZ2FtZSA9IHRoaXMuZ2FtZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibG9hZFwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAU3VtbWFyeSBDYWxjdWxhdGUgYWRkaXRpb25hbCB2YWx1ZXMgdG8gc3RvcmUgb24gZ2FtZS5pbml0aWFsRGF0YVxuICAgICAqXG4gICAgICogVG8gc2F2ZSBvbiBzZXJ2ZXItc2lkZSBwcm9jZXNzaW5nIGFuZCBkYXRhLXRyYW5zZmVyIGxvYWQsIHRoaXNcbiAgICAgKiBtZXRob2QgaXMgYSBwbGFjZSB0byBnZW5lcmF0ZSBhZGRpdGlvbmFsIGRhdGEgbmVlZGVkIGJ5IHRoZSBnYW1lXG4gICAgICogd2hpY2ggbWF5IGJlIGRlcml2ZWQgZnJvbSB0aGUgZGF0YSBzZW50IGZyb20gdGhlIGJhY2sgZW5kLlxuICAgICAqL1xuICAgIGF1Z21lbnRJbml0aWFsRGF0YShpbml0aWFsRGF0YSkge1xuICAgICAgICBpbml0aWFsRGF0YS5vY2N1cGllZFNlYXRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5pdGlhbERhdGEucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaW5pdGlhbERhdGEub2NjdXBpZWRTZWF0cy5wdXNoKGluaXRpYWxEYXRhLnBsYXllcnNbaV0uc2VhdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5pdGlhbERhdGE7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb290OyIsImNsYXNzIExvYWQgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIHByZWxvYWQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwiYmFja2dyb3VuZFwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2JhY2tncm91bmQucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcImRlYWxlckJ1dHRvblwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2RlYWxlcmJ1dHRvbi5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwicmVkQ2lyY2xlXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcmVkY2lyY2xlLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImNhcmRzXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcInBhbmVsXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcGFuZWwucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcGFuZWwuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImJ1eUluXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV5aW4ucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV5aW4uanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImNoaXBzXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2hpcHMucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2hpcHMuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcIm5hbWVwbGF0ZVwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL25hbWVwbGF0ZS5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9uYW1lcGxhdGUuanNvblwiKTtcblxuICAgICAgICB0aGlzLmdhbWUudGV4dHVyZXMgPSB0aGlzLmNyZWF0ZUN1c3RvbVRleHR1cmVzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkUGx1Z2lucygpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibWFpblwiKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDdXN0b21UZXh0dXJlcygpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0ge307XG5cbiAgICAgICAgbGV0IGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoNCwgMHgwMDAwMDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgxMDAsIDEwMCwgMTAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlU3F1YXJlXCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgMzAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlUmVjdFwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweDAwMDAwMCwgMC41KTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgdGhpcy5nYW1lLndpZHRoLCB0aGlzLmdhbWUuaGVpZ2h0KTtcbiAgICAgICAgdGV4dHVyZXNbXCJtb2RhbEJhY2tncm91bmRcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweDAwMDAwMCwgMC41KTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgdGhpcy5nYW1lLmNvbmZpZy5wb3B1cC53aWR0aCwgdGhpcy5nYW1lLmNvbmZpZy5wb3B1cC5oZWlnaHQpO1xuICAgICAgICB0ZXh0dXJlc1tcInRleHRVbmRlcmxheVwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgcmV0dXJuIHRleHR1cmVzO1xuICAgIH1cblxuICAgIGxvYWRQbHVnaW5zKCkge1xuICAgICAgICB0aGlzLmdhbWUuYWRkLnBsdWdpbihQaGFzZXJJbnB1dC5QbHVnaW4pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9hZDsiLCJpbXBvcnQge0FjdGlvbiwgQWN0aW9uVGV4dH0gZnJvbSBcIi4uL2NsYXNzZXMvQWN0aW9uLmpzXCI7XG5pbXBvcnQgQnV5SW5NYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9CdXlJbk1hbmFnZXJcIjtcbmltcG9ydCBDYXJkTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2FyZE1hbmFnZXJcIjtcbmltcG9ydCBQYW5lbCBmcm9tIFwiLi4vY2xhc3Nlcy9QYW5lbFwiO1xuaW1wb3J0IFBsYXllck1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL1BsYXllck1hbmFnZXJcIjtcbmltcG9ydCBQb3QgZnJvbSBcIi4uL2NsYXNzZXMvUG90XCI7XG5pbXBvcnQgUG9rZXIgZnJvbSBcIi4uL1Bva2VyXCI7XG5pbXBvcnQgU1NFIGZyb20gXCIuLi9TU0VcIjtcblxuY2xhc3MgTWFpbiBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlU1NFVXJsKTtcbiAgICAgICAgdGhpcy51c2VyX3NzZSA9IG5ldyBTU0UodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudXNlclNTRVVybCk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmxvYWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuZGlzY29ubmVjdEJlYWNvbigpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSB0aGlzLmdhbWUuYWRkLmltYWdlKDAsIDAsIFwiYmFja2dyb3VuZFwiKTtcbiAgICAgICAgdGhpcy5uZXdIYW5kQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMTAwLCBcIm5ld1xcbmhhbmRcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLm5ld0hhbmQpO1xuICAgICAgICB0aGlzLmRlYWxCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAyMjAsIFwiZGVhbFwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuZGVhbCk7XG4gICAgICAgIHRoaXMubGVhdmVCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAzNDAsIFwibGVhdmVcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmxlYXZlVGFibGUpO1xuICAgICAgICB0aGlzLmJiQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgNDYwLCBcIkJCXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5iYik7XG4gICAgICAgIHRoaXMuc2JCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCA1ODAsIFwiU0JcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLnNiKTtcblxuICAgICAgICBjb25zdCBudW1TZWF0cyA9IDEwOyAgICAvLyBUT0RPIC0gTWFrZSBkeW5hbWljXG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzID0gbmV3IFBsYXllck1hbmFnZXIodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudXNlcklkLCB0aGlzLmdhbWUuY29uZmlnLnNlYXRzW251bVNlYXRzXSwgdGhpcy5nYW1lLmNvbmZpZy5jaGlwc1tudW1TZWF0c10pO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVycy5pbml0aWFsaXplKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5wbGF5ZXJzLCB0aGlzLmdhbWUuY29uZmlnLnNlYXRzW251bVNlYXRzXSk7XG5cbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkID0gbmV3IENhcmRNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5pbml0aWFsaXplKDUpO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmNlbnRlclggPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWDtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5jZW50ZXJZID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclk7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBvdCA9IG5ldyBQb3QodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgICAgICB0aGlzLmdhbWUucG90LmNoaXBzLmRpc3BsYXlHcm91cC5jZW50ZXJYID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclg7ICAgICAvLyBUT0RPIC0gUG9zaXRpb25zIGluIGNvbmZpZ1xuICAgICAgICB0aGlzLmdhbWUucG90LmNoaXBzLmRpc3BsYXlHcm91cC5jZW50ZXJZID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclkgLSAxNDA7XG5cbiAgICAgICAgLy8gVE9ETyAtIFRoZXNlIHNob3VsZCBnbyBzb21ld2hlcmUgZWxzZS4gTWF5YmUgaW4gUG90P1xuICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsID0gbmV3IFBhbmVsKHRoaXMuZ2FtZSwgXCJwYW5lbFwiKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmRpc3BsYXlHcm91cC54ID0gdGhpcy5nYW1lLmNvbmZpZy5wYW5lbC5wb3MueDtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmRpc3BsYXlHcm91cC55ID0gdGhpcy5nYW1lLmNvbmZpZy5wYW5lbC5wb3MueTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmFsd2F5c1Zpc2libGUgPSB0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbiA9IG5ldyBCdXlJbk1hbmFnZXIodGhpcy5nYW1lLCBcImJ1eUluXCIpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uaW5pdGlhbGl6ZSh0aGlzLmdhbWUuY29uZmlnLnNlYXRzW251bVNlYXRzXSwgdGhpcy5nYW1lLnBsYXllcnMuZ2V0T2NjdXBpZWRTZWF0cygpLCB0aGlzLmdhbWUuY29uZmlnLmJ1eUluTW9kYWwpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uc2V0QnV0dG9uc1Zpc2libGUodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllciA9PT0gbnVsbCk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVycygpO1xuXG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwibmV3SGFuZFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld0hhbmQ6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gMDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY2FyZHMucmVzZXQoKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNEZWFsZXI6IHBsYXllci5pZCA9PT0gZGF0YS5kZWFsZXIsXG4gICAgICAgICAgICAgICAgICAgIGlzTmV4dDogcGxheWVyLmlkID09PSBkYXRhLm5leHQsXG4gICAgICAgICAgICAgICAgICAgIHJvdW5kQmV0OiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImRlYWxcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWFsOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldChQb2tlci5nZXRNaW5CZXQodGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5lbXVsYXRvckVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiZW11bGF0ZURlYWxcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVtdWxhdGVEZWFsOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXJEYXRhID0gZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChwbGF5ZXJEYXRhLnBsYXllcklkKS5jYXJkcy5zZXRDYXJkTmFtZXMocGxheWVyRGF0YS5ob2xkaW5ncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdSb3VuZFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1JvdW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucG90LmdhdGhlckNoaXBzKHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnBsYXllcnMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV0udXBkYXRlKHtyb3VuZEJldDogMH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldCgwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiYWN0aW9uXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWN0aW9uOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQuc2V0Q2FyZE5hbWVzKGRhdGEuYm9hcmQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5wbGF5ZXJJZCkudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBiYWxhbmNlOiBkYXRhLnBsYXllckJhbGFuY2UsXG4gICAgICAgICAgICAgICAgaXNOZXh0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICByb3VuZEJldDogZGF0YS5wbGF5ZXJSb3VuZEJldFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEucGxheWVySWQpLm5hbWVwbGF0ZS5mbGFzaCh0aGlzLnBhcnNlQWN0aW9uVGV4dChkYXRhKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCkudXBkYXRlKHtpc05leHQ6IHRydWV9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IGRhdGEucm91bmRCZXQ7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IGRhdGEucm91bmRSYWlzZTtcblxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldChQb2tlci5nZXRNaW5CZXQodGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJoYW5kQ29tcGxldGVcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoYW5kQ29tcGxldGU6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS53aW5uZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHdpbm5lciA9IGRhdGEud2lubmVyc1tpXTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKHdpbm5lci5pZCkudXBkYXRlKHtiYWxhbmNlOiB3aW5uZXIuYmFsYW5jZX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnBvdC5jaGlwcy5jbGVhcigpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXS5jaGlwcy5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdQbGF5ZXJcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1BsYXllcjogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV3UGxheWVyKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLm5ld1BsYXllcihkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5idXlJbi5zZXRCdXR0b25zVmlzaWJsZSh0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyID09PSBudWxsKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwicGxheWVyTGVmdFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGxheWVyTGVmdDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMucGxheWVyTGVmdChkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5idXlJbi5wbGF5ZXJMZWZ0KGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnNldEJ1dHRvbnNWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIgPT09IG51bGwpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy51c2VyX3NzZS5hZGRMaXN0ZW5lcihcImRlYWxcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlYWw6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIuY2FyZHMuc2V0Q2FyZE5hbWVzKGRhdGEuaG9sZGluZ3MpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlckxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnByaW1hcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZWNvbmRhcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC50ZXJ0aWFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLmJ1eUluUmVxdWVzdGVkLmFkZCh0aGlzLmdhbWUuY29udHJvbGxlci5qb2luLCB0aGlzLmdhbWUuY29udHJvbGxlcik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSb3V0ZSBhY3Rpb25zIHRvIGNvbnRyb2xsZXIgcmVxdWVzdHNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWN0aW9uIC0gVGhlIGFjdGlvbiB0byBiZSByZXF1ZXN0ZWQsIGRlZmluZWQgaW4gQWN0aW9uLmpzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJldCAtIFRoZSBiZXQgKGlmIGFueSkgdG8gYmUgc2VudCB0byB0aGUgY29udHJvbGxlclxuICAgICAqL1xuICAgIGhhbmRsZUFjdGlvbihhY3Rpb24sIGJldCkge1xuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uRk9MRDpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5mb2xkKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5DSEVDSzpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5jaGVjaygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uQkVUOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmJldChiZXQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJJbnZhbGlkIEFjdGlvbiBUeXBlOiBcIiArIGFjdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBUcmFuc2Zvcm0gYWN0aW9uIGRhdGEgaW50byBtb3JlIGRlc2NyaXB0aXZlIGJldCBzdHJpbmdcbiAgICAgKlxuICAgICAqIEFsbCBiZXRzIGFyZSBiZXRzLCBidXQgc29tZSByZXF1aXJlIG1vcmUgZGVzY3JpcHRpb24gdG8gZm9sbG93IHBva2VyXG4gICAgICogY29udmVudGlvbi4gU3BlY2lmaWNhbGx5LCBhIGJldCB3aGljaCBqdXN0IGVxdWFscyBhbiBleGlzdGluZyBiZXQgaXMgYVxuICAgICAqIGNhbGwsIGFuZCBvbmUgd2hpY2ggaW5jcmVhc2VzIGFuIGV4aXN0aW5nIGJldCBpcyBhIHJhaXNlLlxuICAgICAqXG4gICAgICogTk9URTogVGhpcyBmdW5jdGlvbiBtdXN0IGJlIGNhbGxlZCBCRUZPUkUgdGhlIHN0YXRlJ3MgYHJvdW5kQmV0YCBhbmRcbiAgICAgKiBgcm91bmRSYWlzZWAgdmFyaWFibGVzIGFyZSB1cGRhdGVkLCBhcyB0aGlzIGZ1bmN0aW9uIG11c3QgY29tcGFyZVxuICAgICAqIG5ldyBiZXQgZGF0YSBhZ2FpbnN0IHRoZSBwcmV2aW91cyBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhY3Rpb25EYXRhXG4gICAgICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgdGV4dCB0byBiZSBmbGFzaGVkXG4gICAgICovXG4gICAgcGFyc2VBY3Rpb25UZXh0KGFjdGlvbkRhdGEpIHtcbiAgICAgICAgbGV0IGFjdGlvblRleHQgPSBBY3Rpb25UZXh0W2FjdGlvbkRhdGEuYWN0aW9uVHlwZV07XG4gICAgICAgIGlmIChhY3Rpb25EYXRhLmFjdGlvblR5cGUgPT09IEFjdGlvbi5CRVQpIHtcbiAgICAgICAgICAgIGlmIChhY3Rpb25EYXRhLnBsYXllclJvdW5kQmV0ID09PSB0aGlzLmdhbWUucm91bmRCZXQpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25UZXh0ID0gXCJDQUxMXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbkRhdGEucGxheWVyUm91bmRCZXQgPiB0aGlzLmdhbWUucm91bmRCZXQgJiYgdGhpcy5nYW1lLnJvdW5kQmV0ID4gMCkge1xuICAgICAgICAgICAgICAgIGFjdGlvblRleHQgPSBcIlJBSVNFXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhY3Rpb25EYXRhLnBsYXllckJhbGFuY2UgPT09IDApIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25UZXh0ID0gXCJBTEwgSU5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWN0aW9uVGV4dDtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbi51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBtYWtlQnRuKHgsIHksIHRleHQsIHRleHR1cmUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBidG4gPSB0aGlzLmdhbWUuYWRkLmJ1dHRvbih4LCB5LCB0ZXh0dXJlLCBjYWxsYmFjaywgdGhpcyk7XG4gICAgICAgIGJ0bi5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICBsZXQgYnRuVGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAwLCB0ZXh0KTtcbiAgICAgICAgYnRuVGV4dC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgYnRuLmFkZENoaWxkKGJ0blRleHQpO1xuICAgICAgICBidG4udGV4dCA9IGJ0blRleHQ7XG5cbiAgICAgICAgcmV0dXJuIGJ0bjtcbiAgICB9XG5cbiAgICBkZWFsKCkge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy90YWJsZXMvJyArIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZU5hbWUgKyAnL2RlYWwvJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0YWJsZU5hbWU6IGluaXRpYWxEYXRhLnRhYmxlTmFtZSxcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIG5ld0hhbmQoKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL3RhYmxlcy8nICsgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlTmFtZSArICcvbmV3LWhhbmQvJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0YWJsZU5hbWU6IGluaXRpYWxEYXRhLnRhYmxlTmFtZSxcbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBsZWF2ZVRhYmxlKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5sZWF2ZSgpO1xuICAgIH1cblxuICAgIGJiKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5iYigpO1xuICAgIH07XG5cbiAgICBzYigpIHtcbiAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuc2IoKTtcbiAgICB9O1xuXG4gICAgZ2VuZXJhdGVCZXRzKHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIHJldHVybiBQb2tlci5nZW5lcmF0ZUJldHMoMjUsIDUwLCB0aGlzLmdhbWUucm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgcGxheWVyQmFsYW5jZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYWluOyJdfQ==
