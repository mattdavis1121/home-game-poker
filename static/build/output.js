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

},{"./states/Boot":25,"./states/Load":26,"./states/Main":27}],2:[function(require,module,exports){
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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Card = function (_Phaser$Sprite) {
    _inherits(Card, _Phaser$Sprite);

    function Card(game, x, y, key, manager) {
        var autoHide = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        _classCallCheck(this, Card);

        var _this = _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this, game, x, y, key));

        game.world.add(_this);

        _this.game = game;
        _this.key = key;
        _this.manager = manager;

        _this.name = null; // String ID of card, e.g. 'Kh' or '7s'
        _this.autoHide = autoHide;

        _this.anchor.setTo(0.5);
        _this.inputEnabled = true;
        _this.updateDisplay();
        return _this;
    }

    _createClass(Card, [{
        key: "initialize",
        value: function initialize(data) {
            this.name = data.name;
        }
    }, {
        key: "initializeDisplay",
        value: function initializeDisplay() {
            this.updateDisplay();
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            this.frameName = this.name ? this.name : "back";

            // Auto-hide face down cards, if flag set
            // This will cause problems if manually hiding and showing
            // cards. E.g. manually set card to hidden even though it has
            // a truthy `name` property, then call it will become visible
            // again when updateDisplay is called if `autoHide` is true.
            this.visible = !this.autoHide || this.name;
        }
    }]);

    return Card;
}(Phaser.Sprite);

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BUTTON_STYLES = {
    PLAIN: 0,
    LETTER: 1,
    TEXT: 2
};

var DealerButton = function (_Phaser$Sprite) {
    _inherits(DealerButton, _Phaser$Sprite);

    function DealerButton(game, x, y, key, config) {
        _classCallCheck(this, DealerButton);

        key = key || "dealerButton";

        var _this = _possibleConstructorReturn(this, (DealerButton.__proto__ || Object.getPrototypeOf(DealerButton)).call(this, game, x, y, key));

        game.world.add(_this);

        _this.game = game;
        _this.key = key;
        _this.config = config || _this.game.config.dealerButton;

        _this._seat = 0;
        _this.frame = BUTTON_STYLES.TEXT;

        _this.anchor.setTo(0.5);
        _this.seat = 0;
        return _this;
    }

    _createClass(DealerButton, [{
        key: "moveToSeat",
        value: function moveToSeat(seatNum) {
            var x = this.config[seatNum].x;
            var y = this.config[seatNum].y;

            this.game.add.tween(this).to({ x: x, y: y }, 500, Phaser.Easing.Quadratic.InOut, true);
        }
    }, {
        key: "seat",
        set: function set(seatNum) {
            this._seat = seatNum;
            this.x = this.config[seatNum].x;
            this.y = this.config[seatNum].y;
        }
    }]);

    return DealerButton;
}(Phaser.Sprite);

exports.default = DealerButton;

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"../Util":4,"./Label":11}],13:[function(require,module,exports){
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
            if (index >= 0 && index < this.slider.length) {
                this.slider.setIndex(index);
            }
        }
    }]);

    return Panel;
}();

exports.default = Panel;

},{"../Util":4,"./Action":5,"./Button":6,"./Slider":16}],14:[function(require,module,exports){
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
            cardsMask: null,
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
            this.display.cards.x = this.display.nameplate.centerX;
            this.hideCards();

            this.display.cardsMask = this.createCardsMask();
            this.display.cardsMask.bottom = this.display.nameplate.top;
            this.cards.mask = this.display.cardsMask;

            // NOTE: This line is required for this mask to work under WebGL
            // Some changes to masks in WebGL mode will render the mask
            // completely ineffective. The bug is not well understood. It may
            // have been fixed in later versions of Phaser.
            // More detail here: https://github.com/photonstorm/phaser-ce/issues/334
            this.display.cardsMask.dirty = true;

            this.chips.initializeDisplay();
            this.display.chips = this.chips.displayGroup;
            this.display.chips.x = this.chipConfig[this.seat].x;
            this.display.chips.y = this.chipConfig[this.seat].y;

            this.displayGroup.add(this.chips.displayGroup);
            this.displayGroup.add(this.display.cards);
            this.displayGroup.add(this.display.cardsMask);
            this.displayGroup.add(this.display.nameplate);

            this.updateDisplay();
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            this.display.nameplate.name = this.name;
            this.display.nameplate.balance = this.balance;
            this.display.nameplate.frameName = this.isNext ? "red" : "base";
        }
    }, {
        key: "update",
        value: function update(data) {
            var updateChips = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            // TODO - Flesh out the rest of the data -- do I like this method?
            this.balance = data.balance === undefined ? this.balance : data.balance;
            this.isDealer = data.isDealer === undefined ? this.isDealer : data.isDealer;
            this.isNext = data.isNext === undefined ? this.isNext : data.isNext;
            this.roundBet = data.roundBet === undefined ? this.roundBet : data.roundBet;
            if (updateChips) {
                this.chips.setValue(this.roundBet);
            } else {
                this.chips.value = this.roundBet;
            }
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
    }, {
        key: "createCardsMask",
        value: function createCardsMask() {
            var height = this.cards.cards[0].height;
            var width = this.nameplate.width;
            var mask = this.game.add.graphics(0, 0);
            mask.beginFill(0xffffff);
            mask.drawRect(0, 0, width, height);
            return mask;
        }
    }, {
        key: "animateDeal",
        value: function animateDeal() {
            var _this = this;

            var showTween = this.game.add.tween(this.display.cards).to({ y: -this.nameplate.height / 2 }, 500, Phaser.Easing.Quartic.Out, true);

            showTween.onComplete.add(function () {
                var cardPositions = _this.calcCardPositions();
                for (var i = 0; i < _this.cards.length; i++) {
                    _this.game.add.tween(_this.cards.cards[i]).to({ x: cardPositions[i] }, 500, Phaser.Easing.Quartic.Out, true);
                }
            }, this);
        }
    }, {
        key: "animateFold",
        value: function animateFold() {
            for (var i = 0; i < this.cards.length; i++) {
                this.game.add.tween(this.cards.cards[i]).to({ x: 0 }, 500, Phaser.Easing.Quartic.Out, true);
            }

            var hideTween = this.game.add.tween(this.display.cards).to({ top: this.display.nameplate.top }, 500, Phaser.Easing.Quartic.Out);
            this.game.time.events.add(500, function () {
                hideTween.start();
            }, this);

            return hideTween.onComplete;
        }
    }, {
        key: "hideCards",
        value: function hideCards() {
            for (var i = 0; i < this.cards.length; i++) {
                this.cards.cards[i].x = 0;
            }
            this.display.cards.top = this.display.nameplate.top;
        }
    }, {
        key: "showCards",
        value: function showCards() {
            var cardPositions = this.calcCardPositions();
            for (var i = 0; i < this.cards.length; i++) {
                this.cards.cards[i].x = cardPositions[i];
            }
            this.display.cards.y = -this.nameplate.height / 2;
        }

        /**
         * @summary Calculate the final positions of all cards in hand
         *
         * NOTE TO ME: Don't fuck with this. It took a long time to get right.
         *
         * The cards need to be positioned correctly both in relation to
         * themselves (staggered evenly) and also in relation to the nameplate.
         * Doing the latter by centering the cards' display group on the nameplate
         * would have been much easier, but that way made animating the card
         * spread nearly impossible.
         *
         * @returns {number[]}
         */

    }, {
        key: "calcCardPositions",
        value: function calcCardPositions() {
            if (!this.cards.length) {
                return [];
            }

            var positions = [];
            var cardWidth = this.cards.cards[0].width;
            var cardArea = this.display.nameplate.width * 0.9;
            var totalWidth = cardWidth * this.cards.length;
            var totalOverflow = totalWidth - cardArea;
            var cardOffset = totalOverflow / (this.cards.length - 1);
            for (var i = 0; i < this.cards.length; i++) {
                // Space cards evenly
                var pos = cardWidth * i - cardOffset * i;

                // Center cards on nameplate
                pos -= cardArea / 2 - cardWidth / 2;

                positions.push(pos);
            }
            return positions;
        }
    }]);

    return Player;
}();

exports.default = Player;

},{"../classes/Action":5,"../classes/Nameplate":12,"../managers/CardManager":20,"../managers/ChipManager":21}],15:[function(require,module,exports){
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

            var finished = new Phaser.Signal();
            var playersWithChips = players.filter(function (player) {
                return player.chips.chips.length;
            });

            var delay = 0;

            var _loop = function _loop(i) {
                var player = playersWithChips[i];
                _this.game.time.events.add(delay, function () {
                    _this.amount += player.chips.value;
                    var takeChipsFinished = _this.chips.takeChips(player.chips.chips);

                    if (i === playersWithChips.length - 1) {
                        takeChipsFinished.add(function () {
                            return finished.dispatch();
                        });
                    }
                }, _this);
                delay += 100;
            };

            for (var i = 0; i < playersWithChips.length; i++) {
                _loop(i);
            }

            return finished;
        }
    }]);

    return Pot;
}();

exports.default = Pot;

},{"../managers/ChipManager":21}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @summary Track and queue tweens game wide
 *
 * It's easy to chain tweens when they're created at the same point
 * in time, but what if two tweens are created at completely different
 * points? What if those tweens need to run consecutively, the second
 * waiting for the first to complete before starting?
 */

var TweenQueue = function () {
    function TweenQueue(game) {
        _classCallCheck(this, TweenQueue);

        this.game = game;

        this.queue = [];
        this.current = null;
    }

    _createClass(TweenQueue, [{
        key: "add",


        /**
         * @summary Add a tween to the queue
         * @param {Phaser.Tween} tween - The tween to add to the queue
         */
        value: function add(tween) {
            // Tweens added to the queue may have other onComplete callbacks,
            // but they must at least have this one, which triggers the
            // next tween in the queue to begin
            tween.onComplete.add(this.next, this);

            // Add to the front, remove from the back
            this.queue.unshift(tween);

            // Auto start the chain if it's not already running
            if (!this.running) {
                this.next();
            }
        }

        /**
         * @summary Start the next tween in the queue
         */

    }, {
        key: "next",
        value: function next() {
            this.current = this.queue.pop();
            if (this.current) {
                this.current.start();
            }
        }
    }, {
        key: "running",
        get: function get() {
            return !!this.current;
        }
    }]);

    return TweenQueue;
}();

exports.default = TweenQueue;

},{}],18:[function(require,module,exports){
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
  "seats": [
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
  "dealerButton": [
    {"x": 846, "y": 300},
    {"x": 1164, "y": 300},
    {"x": 1516, "y": 442},
    {"x": 1516, "y": 592},
    {"x": 1150, "y": 790},
    {"x": 784, "y": 790},
    {"x": 526, "y": 790},
    {"x": 440, "y": 592},
    {"x": 440, "y": 442},
    {"x": 532, "y": 300}
  ],
  "denoms": [5, 25, 100, 500, 2000],
  "chips": [
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
  ],
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

},{}],19:[function(require,module,exports){
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

},{"../classes/Button":6}],20:[function(require,module,exports){
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
        var autoHide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "cards";

        _classCallCheck(this, CardManager);

        this.game = game;
        this.autoHide = autoHide; // Auto-hide all face down cards?
        this.key = key;
        this.cards = [];
        this.displayGroup = this.game.add.group();
        this._mask = null; // A mask applied to all cards in displayGroup
    }

    _createClass(CardManager, [{
        key: "initialize",
        value: function initialize(num_cards) {
            for (var i = 0; i < num_cards; i++) {
                var card = new _Card2.default(this.game, 0, 0, this.key, this, this.autoHide);
                card.initialize({});
                card.initializeDisplay();

                this.cards.push(card);
                this.displayGroup.add(card);
            }
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
    }, {
        key: "mask",
        set: function set(mask) {
            this._mask = mask;
            this.displayGroup.mask = mask;
        },
        get: function get() {
            return this._mask;
        }
    }, {
        key: "cardWidth",
        get: function get() {
            if (!this.cards.length) {
                return 0;
            }
            return this.cards[0].width;
        }
    }]);

    return CardManager;
}();

exports.default = CardManager;

},{"../classes/Card":7}],21:[function(require,module,exports){
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

            return this.transferAnimation(newChips);
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

            var finished = new Phaser.Signal();

            var delay = 0;

            var _loop = function _loop(i) {
                var chip = chips[i];
                _this2.game.time.events.add(delay, function () {
                    var randPos = _this2.randChipPos();
                    var tween = _this2.game.add.tween(chip).to({ x: randPos.x, y: randPos.y }, 200, Phaser.Easing.Quadratic.InOut, true);

                    if (i === chips.length - 1) {
                        tween.onComplete.add(finished.dispatch, finished);
                    }
                }, _this2);
                delay += 100;
            };

            for (var i = 0; i < chips.length; i++) {
                _loop(i);
            }

            return finished;
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

},{"../Util":4,"../classes/Chip":8}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventRegister = function () {
    function EventRegister(game) {
        _classCallCheck(this, EventRegister);

        this.game = game;
        this.events = {};
    }

    _createClass(EventRegister, [{
        key: "add",
        value: function add(key, signal) {
            var _this = this;

            if (this.events[key]) {
                console.warn("TimingManager already has an event for key " + key);
                return;
            }
            this.events[key] = signal;
            signal.add(function () {
                console.log("DELETING EVENT");
                delete _this.events[key];
            });
        }
    }, {
        key: "get",
        value: function get(key) {
            return this.events[key];
        }
    }]);

    return EventRegister;
}();

exports.default = EventRegister;

},{}],23:[function(require,module,exports){
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
        this.dealerPlayer = null; // Current hand's dealer

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
    }, {
        key: "getBySeat",
        value: function getBySeat(seat) {
            for (var i = 0; i < this.length; i++) {
                if (this.players[i].seat === seat) {
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
    }, {
        key: "length",
        get: function get() {
            return this.players.length;
        }
    }]);

    return PlayerManager;
}();

exports.default = PlayerManager;

},{"../classes/Player":14}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{"../classes/Controller":9,"../config":18}],26:[function(require,module,exports){
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
            this.game.load.image("redCircle", "/static/assets/hd/redcircle.png");
            this.game.load.atlasJSONHash("cards", "/static/assets/hd/cards.png", "/static/assets/hd/cards.json");
            this.game.load.atlasJSONHash("panel", "/static/assets/hd/panel.png", "/static/assets/hd/panel.json");
            this.game.load.atlasJSONHash("dealerButton", "/static/assets/hd/button.png", "/static/assets/hd/button.json");
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

},{}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Action = require("../classes/Action");

var _BuyInManager = require("../managers/BuyInManager");

var _BuyInManager2 = _interopRequireDefault(_BuyInManager);

var _CardManager = require("../managers/CardManager");

var _CardManager2 = _interopRequireDefault(_CardManager);

var _DealerButton = require("../classes/DealerButton");

var _DealerButton2 = _interopRequireDefault(_DealerButton);

var _EventRegister = require("../managers/EventRegister");

var _EventRegister2 = _interopRequireDefault(_EventRegister);

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

var _TweenQueue = require("../classes/TweenQueue");

var _TweenQueue2 = _interopRequireDefault(_TweenQueue);

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

            this.game.players = new _PlayerManager2.default(this.game, this.game.initialData.userId, this.game.config.seats, this.game.config.chips);
            this.game.players.initialize(this.game.initialData.players, this.game.config.seats);

            this.game.dealerButton = new _DealerButton2.default(this.game);

            this.game.board = new _CardManager2.default(this.game, true);
            this.game.board.initialize(5);
            this.game.board.displayGroup.setAll("visible", true);
            this.game.board.displayGroup.align(-1, 1, this.game.board.cardWidth * 1.2, 1);
            this.game.board.displayGroup.centerX = this.game.world.centerX;
            this.game.board.displayGroup.centerY = this.game.world.centerY;
            this.game.board.displayGroup.setAll("visible", false);

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
            this.game.buyIn.initialize(this.game.config.seats, this.game.players.getOccupiedSeats(), this.game.config.buyInModal);
            this.game.buyIn.setButtonsVisible(this.game.players.userPlayer === null);

            this.game.queue = new _TweenQueue2.default(this.game);
            this.game.register = new _EventRegister2.default(this.game);

            this.registerListeners();

            this.table_sse.addListener("newHand", function (event) {
                var data = JSON.parse(event.data);
                console.log("newHand: ", data);
                for (var i = 0; i < _this3.game.players.length; i++) {
                    var player = _this3.game.players.players[i];
                    var complete = player.animateFold();
                    complete.add(player.cards.reset, player.cards);
                    player.chips.clear();
                }
                _this3.game.board.reset();
                _this3.game.roundBet = 0;
                _this3.game.roundRaise = 0;
                _this3.game.players.dealerPlayer = _this3.game.players.getById(data.dealer);
                _this3.game.players.nextPlayer = _this3.game.players.getById(data.next);
                for (var _i = 0; _i < _this3.game.players.players.length; _i++) {
                    var _player = _this3.game.players.players[_i];
                    _player.update({
                        isDealer: _player.id === data.dealer,
                        isNext: _player.id === data.next,
                        roundBet: 0
                    });
                }
                _this3.game.panel.setBets(_Poker2.default.generateRaises(_this3.game.rules.blinds.small, _this3.game.rules.blinds.big, _this3.game.roundBet, _this3.game.players.nextPlayer.roundBet, _this3.game.roundRaise, _this3.game.players.nextPlayer.balance));
                _this3.game.panel.setSecondaryBet(0);
                _this3.game.panel.setVisible(_this3.game.players.nextPlayer === _this3.game.players.userPlayer);
                _this3.game.dealerButton.moveToSeat(_this3.game.players.dealerPlayer.seat);
            });
            this.table_sse.addListener("deal", function (event) {
                var data = JSON.parse(event.data);
                console.log("deal: ", data);

                var delay = 0;
                var seats = _this3.game.players.getOccupiedSeats();
                var seatIndex = seats.indexOf(_this3.game.players.dealerPlayer.seat);
                seatIndex = (seatIndex + 1) % seats.length; // Start with player to left of dealer
                for (var i = 0; i < seats.length; i++) {
                    _this3.game.time.events.add(delay, function () {
                        _this3.game.players.getBySeat(seats[seatIndex]).animateDeal();
                        seatIndex = (seatIndex + 1) % seats.length;
                    }, _this3);
                    delay += 200;
                }

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
                        // this.game.players.getById(playerData.playerId).cards.setCardNames(playerData.holdings);
                    }
                });
            }
            this.table_sse.addListener("newRound", function (event) {
                var data = JSON.parse(event.data);
                console.log("newRound: ", data);
                _this3.game.roundBet = 0;
                _this3.game.roundRaise = 0;
                for (var i = 0; i < _this3.game.players.players.length; i++) {
                    _this3.game.players.players[i].update({ roundBet: 0 }, false);
                }
                _this3.game.panel.setBets(_Poker2.default.generateRaises(_this3.game.rules.blinds.small, _this3.game.rules.blinds.big, _this3.game.roundBet, _this3.game.players.nextPlayer.roundBet, _this3.game.roundRaise, _this3.game.players.nextPlayer.balance));
                _this3.game.panel.setSecondaryBet(0);
            });
            this.table_sse.addListener("roundComplete", function (event) {
                var data = JSON.parse(event.data);
                console.log("roundComplete: ", data);
                if (!data.handComplete) {
                    _this3.game.pot.gatherChips(_this3.game.players.players);
                }
            });
            this.table_sse.addListener("action", function (event) {
                var data = JSON.parse(event.data);
                console.log("action: ", data);

                if (data.actionType === _Action.Action.FOLD) {
                    _this3.game.players.getById(data.playerId).animateFold();
                }

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

                // TODO - Handle split pots
                // if (data.winners.length > 1) {
                //
                // }

                // TODO - Split pots before getting here, otherwise pays
                //   will be correct, but it will look like all money goes
                //   to one player
                _this3.game.pot.gatherChips(_this3.game.players.players).add(function () {
                    _this3.game.time.events.add(1000, function () {
                        if (data.showdown) {
                            for (var i = 0; i < data.showdown.length; i++) {
                                var playerData = data.showdown[i];
                                _this3.game.players.getById(playerData.playerId).cards.setCardNames(playerData.holdings);
                            }
                        }

                        // Delay one second for each player going to showdown
                        var delay = data.showdown ? 1000 * data.showdown.length : 0;
                        _this3.game.time.events.add(delay, function () {
                            _this3.game.players.getById(data.winners[0].id).chips.takeChips(_this3.game.pot.chips.chips);
                        });
                    });
                });
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

},{"../Poker":2,"../SSE":3,"../classes/Action":5,"../classes/DealerButton":10,"../classes/Panel":13,"../classes/Pot":15,"../classes/TweenQueue":17,"../managers/BuyInManager":19,"../managers/CardManager":20,"../managers/EventRegister":22,"../managers/PlayerManager":23}]},{},[1,24])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NoaXAuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQ29udHJvbGxlci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9EZWFsZXJCdXR0b24uanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvTGFiZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvTmFtZXBsYXRlLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BhbmVsLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BsYXllci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9Qb3QuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvU2xpZGVyLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1R3ZWVuUXVldWUuanMiLCJzdGF0aWMvc3JjL2NvbmZpZy5qc29uIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9CdXlJbk1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL0NhcmRNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9DaGlwTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvRXZlbnRSZWdpc3Rlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvUGxheWVyTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvcG9seWZpbGxzL3NlbmRiZWFjb24uanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Cb290LmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTG9hZC5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL01haW4uanMiXSwibmFt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LDJCQUFXLFlBQVk7QUFESCxhQUFmLENBQVQ7QUFHSDs7O2tDQUVTO0FBQ04sZ0JBQUksTUFBTSxJQUFJLGNBQUosRUFBVjtBQUNBLGdCQUFJLElBQUosQ0FBUyxNQUFULEVBQWlCLGFBQWEsS0FBSyxJQUFMLENBQVUsV0FBVixDQUFzQixTQUFuQyxHQUErQyxZQUFoRTtBQUNBLGdCQUFJLGdCQUFKLENBQXFCLGNBQXJCLEVBQXFDLGtCQUFyQztBQUNBLGdCQUFJLElBQUosQ0FBUyxLQUFLLFNBQUwsQ0FBZTtBQUNwQiwyQkFBVyxZQUFZO0FBREgsYUFBZixDQUFUO0FBR0g7OztxQ0FFWTtBQUNULGlCQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLEtBQXJCO0FBQ0g7Ozs2QkFFSTtBQUNELGlCQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLEVBQXJCO0FBQ0g7Ozs2QkFFSTtBQUNELGlCQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLEVBQXJCO0FBQ0g7OztxQ0FFWSxjLEVBQWdCLGEsRUFBZTtBQUN4QyxtQkFBTyxnQkFBTSxZQUFOLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCLEtBQUssSUFBTCxDQUFVLFFBQXJDLEVBQStDLGNBQS9DLEVBQStELEtBQUssSUFBTCxDQUFVLFVBQXpFLEVBQXFGLGFBQXJGLENBQVA7QUFDSDs7OztFQXhUYyxPQUFPLEs7O2tCQTJUWCxJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEJvb3QgZnJvbSBcIi4vc3RhdGVzL0Jvb3RcIjtcbmltcG9ydCBMb2FkIGZyb20gXCIuL3N0YXRlcy9Mb2FkXCI7XG5pbXBvcnQgTWFpbiBmcm9tIFwiLi9zdGF0ZXMvTWFpblwiO1xuXG5jbGFzcyBHYW1lIGV4dGVuZHMgUGhhc2VyLkdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICB3aWR0aDogMTkyMCxcbiAgICAgICAgICAgIGhlaWdodDogMTA4MFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImJvb3RcIiwgQm9vdCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImxvYWRcIiwgTG9hZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcIm1haW5cIiwgTWFpbiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJib290XCIpO1xuICAgIH1cbn1cblxubmV3IEdhbWUoKTtcbiIsIi8qKlxuICogQHN1bW1hcnkgQSB1dGlsaXR5IGNsYXNzIG9mIFBva2VyLXNwZWNpZmljIGZ1bmN0aW9uYWxpdHlcbiAqL1xuY2xhc3MgUG9rZXIge1xuICAgIC8vIFRPRE8gLSBUaGlzIHV0aWxpdHkgaXMgaGlnaGx5LXNwZWNpZmljIHRvIE5MIGdhbWVzLCBtYXliZSBldmVuIHRvIE5MSEUuXG4gICAgLy8gIE5lZWQgdG8gbWFrZSBpdCBtb3JlIGdlbmVyaWMgZXZlbnR1YWxseSB0byBhbGxvdyBmb3Igb3RoZXIgZ2FtZVxuICAgIC8vICB0eXBlcy4gTGltaXQgYW5kIHBvdC1saW1pdCBnYW1lcyB3aWxsIHdvcmsgY29tcGxldGVseSBkaWZmZXJlbnRseS5cbiAgICAvLyAgQW50ZXMgYXJlIGFsc28gbm90IHN1cHBvcnRlZC5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdlbmVyYXRlIGFsbCBsZWdhbCByYWlzZXMgZm9yIHBsYXllclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzbWFsbEJsaW5kIC0gVGhlIHNtYWxsIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119IC0gVGhlIHZhbGlkIHJhaXNlc1xuICAgICAqL1xuICAgIHN0YXRpYyBnZW5lcmF0ZVJhaXNlcyhzbWFsbEJsaW5kLCBiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IHJhaXNlID0gUG9rZXIuZ2V0TWluUmFpc2UoYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICAgICAgbGV0IHJhaXNlcyA9IFtyYWlzZV07XG5cbiAgICAgICAgd2hpbGUgKHJhaXNlICsgc21hbGxCbGluZCA8PSBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgICAgICByYWlzZSArPSBzbWFsbEJsaW5kO1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocmFpc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJhaXNlIDwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocGxheWVyQmFsYW5jZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmFpc2VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgYmV0IGZvciBwbGF5ZXJcbiAgICAgKlxuICAgICAqIElmIG5vIGJldHMgaGF2ZSBvY2N1cnJlZCBpbiBjdXJyZW50IHJvdW5kLCB0aGUgbWluIGJldCBpcyBhXG4gICAgICogY2hlY2sgKGJldCBvZiAwKSwgb3RoZXJ3aXNlIGl0J3MgYSBjYWxsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5CZXQocm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCBtaW5CZXQgPSByb3VuZEJldCA9PT0gMCA/IDAgOiByb3VuZEJldCAtIHBsYXllclJvdW5kQmV0O1xuICAgICAgICBpZiAocGxheWVyQmFsYW5jZSA8IG1pbkJldCkge1xuICAgICAgICAgICAgbWluQmV0ID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluQmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgcmFpc2UgZm9yIHBsYXllclxuICAgICAqXG4gICAgICogTk9URTogQSByYWlzZSBoZXJlIG1heSBhY3R1YWxseSBtZWFuIGEgYmV0IGluIHBva2VyIHRlcm1zLiBJbiB0aGVcbiAgICAgKiBwYXJsYW5jZSBvZiB0aGlzIHV0aWxpdHksIGEgcmFpc2UgaXMgYW4gYWdncmVzc2l2ZSBhY3Rpb24sIG9yIHNvbWV0aGluZ1xuICAgICAqIHdoaWNoIHdvdWxkIGZvcmNlIG90aGVyIHBsYXllcnMgdG8gY29udHJpYnV0ZSBtb3JlIHRvIHRoZSBwb3QgdGhhblxuICAgICAqIHRoZSBvdGhlcndpc2Ugd291bGQgaGF2ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5SYWlzZShiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IG1pblJhaXNlID0gcm91bmRCZXQgPT09IDAgPyBiaWdCbGluZCA6IHJvdW5kQmV0IC0gcGxheWVyUm91bmRCZXQgKyBwcmV2UmFpc2U7XG4gICAgICAgIGlmIChwbGF5ZXJCYWxhbmNlIDwgbWluUmFpc2UpIHtcbiAgICAgICAgICAgIG1pblJhaXNlID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluUmFpc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb2tlcjsiLCJjbGFzcyBTU0Uge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVybCkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodGhpcy51cmwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJlIGFkZHMgYWxsIGxpc3RlbmVycyB0byB0aGlzLnNvdXJjZVxuICAgICAqXG4gICAgICogSSBvcmlnaW5hbGx5IHdyb3RlIHRoaXMgdG8gc3VwcG9ydCBjbGllbnQgcmVjb25uZWN0cywgYnV0IEkgZG9uJ3QgbmVlZFxuICAgICAqIHRoYXQgYW55bW9yZS4gS2VlcGluZyB0aGUgbGlzdGVuZXIgY29kZSBqdXN0IGluIGNhc2UuXG4gICAgICovXG4gICAgcmVBZGRBbGxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycztcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobGlzdGVuZXIudHlwZSwgbGlzdGVuZXIuY2FsbGJhY2ssIGxpc3RlbmVyLmNhbGxiYWNrQ29udGV4dCwgLi4ubGlzdGVuZXIuYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIFN0b3JlIGxpc3RlbmVycyBmb3IgZXZlbnR1YWwgcmVjb25uZWN0XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgICAgXCJ0eXBlXCI6IHR5cGUsXG4gICAgICAgICAgICBcImNhbGxiYWNrXCI6IGNhbGxiYWNrLFxuICAgICAgICAgICAgXCJjYWxsYmFja0NvbnRleHRcIjogY2FsbGJhY2tDb250ZXh0LFxuICAgICAgICAgICAgXCJhcmdzXCI6IGFyZ3NcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU1NFOyIsImNsYXNzIFV0aWwge1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJldHVybiBhIGZvcm1hdHRlZCBjdXJyZW5jeSBzdHJpbmcgZnJvbSBhbiBpbnRlZ2VyXG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlQ3VycmVuY3koaW50KSB7XG4gICAgICAgIGxldCB2YWwgPSBpbnQgLyAxMDA7XG4gICAgICAgIHJldHVybiBcIiRcIiArIHZhbC50b0ZpeGVkKDIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXRpbDsiLCJjb25zdCBBY3Rpb24gPSB7XG4gICAgQkxJTkQ6IDAsXG4gICAgRk9MRDogMSxcbiAgICBDSEVDSzogMixcbiAgICBCRVQ6IDNcbn07XG5cbmNvbnN0IEFjdGlvblRleHQgPSB7XG4gICAgMDogXCJCTElORFwiLFxuICAgIDE6IFwiRk9MRFwiLFxuICAgIDI6IFwiQ0hFQ0tcIixcbiAgICAzOiBcIkJFVFwiXG59O1xuXG5leHBvcnQge0FjdGlvbiwgQWN0aW9uVGV4dH07IiwiLyoqXG4gKiBBIFBoYXNlci5CdXR0b24gd2l0aCBhIFBoYXNlci5UZXh0IGNlbnRlcmVkIG9uIHRoZSBidXR0b25cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIG1lcmVseSBhIHRoaW4gd3JhcHBlciBhcm91bmQgUGhhc2VyLkJ1dHRvbiB0byBhbGxvdyBmb3JcbiAqIGVhc3kgdXNlIG9mIGEgdGV4dCBsYWJlbCBvbiB0aGUgYnV0dG9uLiBUaGUgdGV4dCBpcyBhIGNoaWxkIG9mIHRoZSBidXR0b24sXG4gKiBzbyBpdCBtb3ZlcyB3aGVuIHRoZSBidXR0b24gbW92ZXMuIEl0J3MgY2VudGVyZWQgb24gdGhlIGJ1dHRvbiBhbmQgc2NhbGVzXG4gKiBhdXRvbWF0aWNhbGx5IHRvIGZpeCB3aXRoaW4gdGhlIGJ1dHRvbidzIGJvdW5kcy5cbiAqXG4gKiBJZiBub25lIG9mIHRoZSBsYWJlbCBmdW5jdGlvbmFsaXR5IGlzIHVzZWQsIHRoaXMgY2xhc3MgaXMgaWRlbnRpY2FsIHRvXG4gKiBQaGFzZXIuQnV0dG9uLlxuICovXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBQaGFzZXIuQnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSkge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSk7XG5cbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSAxMDtcbiAgICAgICAgdGhpcy5sYWJlbFRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSB7fTtcbiAgICAgICAgdGhpcy5sYWJlbCA9IG5ldyBQaGFzZXIuVGV4dCh0aGlzLmdhbWUsIDAsIDAsIHRoaXMubGFiZWxUZXh0KTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmxhYmVsKTtcblxuICAgICAgICAvLyBNdXN0IGFkZCB0byBnYW1lIHdvcmxkIG1hbnVhbGx5IGlmIG5vdCB1c2luZyBnYW1lLmFkZC5idXR0b25cbiAgICAgICAgdGhpcy5nYW1lLndvcmxkLmFkZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHRleHQgZGlzcGxheWVkIG9uIHRoZSBidXR0b25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGRpc3BsYXlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0VGV4dCh0ZXh0LCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxUZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBzdHlsZSBmb3IgdGhlIGJ1dHRvbiB0ZXh0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gVGhlIHRleHQgc3R5bGUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFRleHRTdHlsZShzdHlsZSwgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSBzdHlsZTtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBwYWRkaW5nIGJldHdlZW4gdGhlIHRleHQgYW5kIHRoZSBidXR0b24gcGVyaW1ldGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmcgLSBUaGUgcGFkZGluZyBpbiBwaXhlbHNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0UGFkZGluZyhwYWRkaW5nLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxQYWRkaW5nID0gcGFkZGluZztcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIGJ1dHRvblxuICAgICAqIE9uIGRpc2FibGUsIGRpc2FibGVzIGFsbCBpbnB1dCB0byB0aGUgYnV0dG9uIGFuZCByZW5kZXJzIGl0IGdyYXllZFxuICAgICAqIG91dC4gQWxsIHVwZGF0ZXMgYXJlIGRlbGF5ZWQgdW50aWwgcmUtZW5hYmxlLCB1bmxlc3MgZm9yY2VkLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIEVuYWJsZSBvciBkaXNhYmxlIGJ1dHRvbj9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmxhYmVsLnRpbnQgPSB0aW50O1xuXG4gICAgICAgIC8vIFVwZGF0ZSBvbiByZS1lbmFibGVcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFVwZGF0ZSBhbGwgYnV0dG9uIGF0dHJpYnV0ZXMgdG8gY3VycmVudCBwcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBJZiB0aGUgYnV0dG9uIGlzIGRpc2FibGVkLCB0aGlzIHdpbGwgaGF2ZSBubyBlZmZlY3QuIFRoZVxuICAgICAqIGRldmVsb3BlciBtYXkgb3B0aW9uYWxseSBjaG9vc2UgdG8gZm9yY2UgdGhlIHVwZGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSB0aGUgdXBkYXRlP1xuICAgICAqL1xuICAgIHVwZGF0ZUxhYmVsKGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCB8fCBmb3JjZSkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbC50ZXh0ID0gdGhpcy5sYWJlbFRleHQ7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnNldFN0eWxlKHRoaXMubGFiZWxTdHlsZSk7XG4gICAgICAgICAgICB0aGlzLnJlUG9zTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNjYWxlIGxhYmVsIHRleHQgdG8gZml0IG9uIGJ1dHRvbiBhbmQgY2VudGVyXG4gICAgICovXG4gICAgcmVQb3NMYWJlbCgpIHtcbiAgICAgICAgdGhpcy5sYWJlbC5zY2FsZS5zZXRUbygxKTtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFIID0gdGhpcy53aWR0aCAtIHRoaXMubGFiZWxQYWRkaW5nICogMjtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFWID0gdGhpcy5oZWlnaHQgLSB0aGlzLmxhYmVsUGFkZGluZyAqIDI7XG4gICAgICAgIGlmICh0aGlzLmxhYmVsLndpZHRoID4gdGV4dEFyZWFIIHx8IHRoaXMubGFiZWwuaGVpZ2h0ID4gdGV4dEFyZWFWKSB7XG4gICAgICAgICAgICBjb25zdCByZWR1Y2VkU2NhbGVIID0gdGV4dEFyZWFIIC8gdGhpcy5sYWJlbC53aWR0aDtcbiAgICAgICAgICAgIGNvbnN0IHJlZHVjZWRTY2FsZVYgPSB0ZXh0QXJlYVYgLyB0aGlzLmxhYmVsLmhlaWdodDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2NhbGUuc2V0VG8oTWF0aC5taW4ocmVkdWNlZFNjYWxlSCwgcmVkdWNlZFNjYWxlVikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFiZWwuY2VudGVyWCA9IHRoaXMud2lkdGggLyAyO1xuICAgICAgICB0aGlzLmxhYmVsLmNlbnRlclkgPSB0aGlzLmhlaWdodCAvIDI7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjsiLCJjbGFzcyBDYXJkIGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwga2V5LCBtYW5hZ2VyLCBhdXRvSGlkZSA9IGZhbHNlKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSk7XG4gICAgICAgIGdhbWUud29ybGQuYWRkKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuXG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7ICAvLyBTdHJpbmcgSUQgb2YgY2FyZCwgZS5nLiAnS2gnIG9yICc3cydcbiAgICAgICAgdGhpcy5hdXRvSGlkZSA9IGF1dG9IaWRlO1xuXG4gICAgICAgIHRoaXMuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5mcmFtZU5hbWUgPSB0aGlzLm5hbWUgPyB0aGlzLm5hbWUgOiBcImJhY2tcIjtcblxuICAgICAgICAvLyBBdXRvLWhpZGUgZmFjZSBkb3duIGNhcmRzLCBpZiBmbGFnIHNldFxuICAgICAgICAvLyBUaGlzIHdpbGwgY2F1c2UgcHJvYmxlbXMgaWYgbWFudWFsbHkgaGlkaW5nIGFuZCBzaG93aW5nXG4gICAgICAgIC8vIGNhcmRzLiBFLmcuIG1hbnVhbGx5IHNldCBjYXJkIHRvIGhpZGRlbiBldmVuIHRob3VnaCBpdCBoYXNcbiAgICAgICAgLy8gYSB0cnV0aHkgYG5hbWVgIHByb3BlcnR5LCB0aGVuIGNhbGwgaXQgd2lsbCBiZWNvbWUgdmlzaWJsZVxuICAgICAgICAvLyBhZ2FpbiB3aGVuIHVwZGF0ZURpc3BsYXkgaXMgY2FsbGVkIGlmIGBhdXRvSGlkZWAgaXMgdHJ1ZS5cbiAgICAgICAgdGhpcy52aXNpYmxlID0gIXRoaXMuYXV0b0hpZGUgfHwgdGhpcy5uYW1lO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZDtcbiIsImNsYXNzIENoaXAgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIG1hbmFnZXIpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwga2V5KTtcbiAgICAgICAgZ2FtZS53b3JsZC5hZGQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG5cbiAgICAgICAgdGhpcy5pZCA9ICsrQ2hpcC5jb3VudGVyO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IDA7XG4gICAgICAgIHRoaXMuYW5nbGUgPSAwO1xuXG4gICAgICAgIHRoaXMuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yb3RhdGVSYW5kb20oKTtcbiAgICB9XG5cbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5mcmFtZU5hbWUgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cblxuICAgIGNsb25lKGNoaXApIHtcbiAgICAgICAgdGhpcy54ID0gY2hpcC53b3JsZFBvc2l0aW9uLnggLSB0aGlzLnBhcmVudC53b3JsZFBvc2l0aW9uLng7XG4gICAgICAgIHRoaXMueSA9IGNoaXAud29ybGRQb3NpdGlvbi55IC0gdGhpcy5wYXJlbnQud29ybGRQb3NpdGlvbi55O1xuICAgICAgICB0aGlzLmtleSA9IGNoaXAua2V5O1xuICAgICAgICB0aGlzLmFuZ2xlID0gY2hpcC5hbmdsZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNoaXAudmFsdWU7XG4gICAgfVxuXG4gICAgcm90YXRlUmFuZG9tKCkge1xuICAgICAgICB0aGlzLmFuZ2xlID0gdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSgtMTgwLCAxODApO1xuICAgIH1cbn1cblxuQ2hpcC5jb3VudGVyID0gMDtcblxuZXhwb3J0IGRlZmF1bHQgQ2hpcDsiLCJjbGFzcyBDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBwbGF5ZXJJZCwgdG9rZW4pIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBhY2Nlc3MgdG9rZW4gdXNlZCB0byBhdXRoZW50aWNhdGUgb24gQVBJIGNhbGxzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gVGhlIEZsYXNrLUpXVC1FeHRlbmRlZCBhY2Nlc3MgdG9rZW5cbiAgICAgKi9cbiAgICBzZXRUb2tlbih0b2tlbikge1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgICAqXG4gICAgICogT25seSBlcnJvcnMgYXJlIHJlcG9ydGVkLiBTdWNjZXNzIGlzIHNpbGVudC4gR2FtZSBjaGFuZ2VzIHJlc3VsdGluZ1xuICAgICAqIGZyb20gcmVxdWVzdHMgYXJlIGhhbmRsZWQgdmlhIFNlcnZlciBTZW50IEV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmRwb2ludCAtIFRoZSBlbmRwb2ludCBvbiB0aGUgc2VydmVyIHRvIHNlbmQgcmVxdWVzdCB0b1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gVGhlIHBheWxvYWQgdG8gc2VuZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWV0aG9kPVwiUE9TVF0gLSBUaGUgSFRUUCBtZXRob2QgdG8gdXNlXG4gICAgICovXG4gICAgc2VuZFJlcXVlc3QoZW5kcG9pbnQsIGRhdGEsIG1ldGhvZCA9IFwiUE9TVFwiKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4obWV0aG9kLCBlbmRwb2ludCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3AgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIC8vIEludmFsaWQgcmVxdWVzdCBlcnJvclxuICAgICAgICAgICAgICAgIGlmIChyZXNwLnN1Y2Nlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihyZXNwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgIC8vIEZhaWxlZCByZXF1ZXN0IGVycm9yXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgdGhpcy50b2tlbik7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGFuIGFjdGlvbiByZXF1ZXN0XG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHRoZSBtb3N0IGhlYXZpbHktdXNlZCByZXF1ZXN0IHR5cGUgaW4gdGhlIGdhbWUuIEFsbCBpbi1nYW1lXG4gICAgICogYWN0aW9ucyAoYmV0LCBjaGVjaywgZm9sZCkgaGFwcGVuIGhlcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIFRoZSBwYXlsb2FkIHRvIHNlbmRcbiAgICAgKi9cbiAgICBhY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiYWN0aW9uXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgY2hlY2soKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkNIRUNLXCIpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBiZXQoYW10KSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJFVFwiLCBhbXQpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBmb2xkKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBiYigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkxJTkRcIiwgNTApO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBzYigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkxJTkRcIiwgMjUpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBqb2luKHNlYXROdW0sIGJ1eUluKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XCJwb3NpdGlvblwiOiBzZWF0TnVtLCBcImFtb3VudFwiOiBidXlJbn07XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJqb2luXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgbGVhdmUoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImxlYXZlXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhIGJlYWNvbiB0byB0aGUgc2VydmVyIG9uIGRpc2Nvbm5lY3RcbiAgICAgKlxuICAgICAqIFRoaXMgYWxsb3dzIGZvciBzZXJ2ZXIgdG8ga25vdyB3aGVuIGEgY2xpZW50IGRpc2Nvbm5lY3RzIHNvXG4gICAgICogaXQgY2FuIGNsZWFuIHVwIGFzIG5lY2Vzc2FyeS4gTm8gZ3VhcmFudGVlIHRoYXQgdGhpcyBtZXNzYWdlXG4gICAgICogd2lsbCBnbyB0aHJvdWdoLCBzbyBtdXN0IGhhdmUgcmVkdW5kYW50IG1lYXN1cmVzIGluIHBsYWNlLlxuICAgICAqL1xuICAgIGRpc2Nvbm5lY3RCZWFjb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgY29uc3QgdXJsID0gXCIvZGlzY29ubmVjdC9cIjtcbiAgICAgICAgbmF2aWdhdG9yLnNlbmRCZWFjb24odXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBidWlsZFBheWxvYWQoYWN0aW9uVHlwZSwgYmV0QW10ID0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJwbGF5ZXJJZFwiOiB0aGlzLnBsYXllcklkLFxuICAgICAgICAgICAgXCJhY3Rpb25UeXBlXCI6IGFjdGlvblR5cGUsXG4gICAgICAgICAgICBcImJldEFtdFwiOiBiZXRBbXRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJ1aWxkVXJsKGVuZHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVVcmwgKyBlbmRwb2ludCArIFwiL1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlcjtcbiIsImNvbnN0IEJVVFRPTl9TVFlMRVMgPSB7XG4gICAgUExBSU46IDAsXG4gICAgTEVUVEVSOiAxLFxuICAgIFRFWFQ6IDJcbn07XG5cbmNsYXNzIERlYWxlckJ1dHRvbiBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGtleSwgY29uZmlnKSB7XG4gICAgICAgIGtleSA9IGtleSB8fCBcImRlYWxlckJ1dHRvblwiO1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXkpO1xuICAgICAgICBnYW1lLndvcmxkLmFkZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcgfHwgdGhpcy5nYW1lLmNvbmZpZy5kZWFsZXJCdXR0b247XG5cbiAgICAgICAgdGhpcy5fc2VhdCA9IDA7XG4gICAgICAgIHRoaXMuZnJhbWUgPSBCVVRUT05fU1RZTEVTLlRFWFQ7XG5cbiAgICAgICAgdGhpcy5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5zZWF0ID0gMDtcbiAgICB9XG5cbiAgICBzZXQgc2VhdChzZWF0TnVtKSB7XG4gICAgICAgIHRoaXMuX3NlYXQgPSBzZWF0TnVtO1xuICAgICAgICB0aGlzLnggPSB0aGlzLmNvbmZpZ1tzZWF0TnVtXS54O1xuICAgICAgICB0aGlzLnkgPSB0aGlzLmNvbmZpZ1tzZWF0TnVtXS55O1xuICAgIH1cblxuICAgIG1vdmVUb1NlYXQoc2VhdE51bSkge1xuICAgICAgICBjb25zdCB4ID0gdGhpcy5jb25maWdbc2VhdE51bV0ueDtcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuY29uZmlnW3NlYXROdW1dLnk7XG5cbiAgICAgICAgdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzKS50byh7eDogeCwgeTogeX0sIDUwMCwgUGhhc2VyLkVhc2luZy5RdWFkcmF0aWMuSW5PdXQsIHRydWUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVhbGVyQnV0dG9uO1xuIiwiLyoqXG4gKiBAc3VtbWFyeSBTaW1wbGUgUGhhc2VyLlRleHQgZXh0ZW5zdGlvbiB0byBzdXBwb3J0IGF1dG9tYXRpYyByZXNpemluZ1xuICpcbiAqIElmIHRleHQgYm91bmRzIGFyZSBzZXQgb24gaW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MsIHRoZW4gZWFjaCB0aW1lIHRoZSB0ZXh0XG4gKiBvciBzdHlsZSBpcyBjaGFuZ2VkLCB0aGUgdGV4dCB3aWxsIGF1dG9tYXRpY2FsbHkgc2NhbGUgaXRzZWxmIGRvd24gdG8gZml0XG4gKiB3aXRoaW4gdGhvc2UgYm91bmRzIGhvcml6b250YWxseS4gVmVydGljYWwgYm91bmRzIGFyZSBpZ25vcmVkLlxuICpcbiAqIFBvc3NpYmxlIHVwZ3JhZGVzOlxuICogICAtIFNldCBtaW5pbXVtIHNjYWxlXG4gKiAgIC0gSWYgdGV4dCBzdGlsbCBvdmVyZmxvd3MgbWluIHNjYWxlLCB0aGVuIHRydW5jYXRlXG4gKi9cbmNsYXNzIExhYmVsIGV4dGVuZHMgUGhhc2VyLlRleHQge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIHRleHQsIHN0eWxlKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIHRleHQsIHN0eWxlKTtcbiAgICAgICAgdGhpcy5hbmNob3Iuc2V0VG8oMCwgMC41KTsgIC8vIENlbnRlciB2ZXJ0aWNhbGx5IHRvIGF2b2lkIGp1bXBzIG9uIHJlc2l6ZVxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIHNldFRleHQodGV4dCwgaW1tZWRpYXRlKSB7XG4gICAgICAgIHN1cGVyLnNldFRleHQodGV4dCwgaW1tZWRpYXRlKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9XG5cbiAgICBzZXRTdHlsZShzdHlsZSwgdXBkYXRlKSB7XG4gICAgICAgIHN1cGVyLnNldFN0eWxlKHN0eWxlLCB1cGRhdGUpO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJlc2l6ZSB0aGUgdGV4dCBob3Jpem9udGFsbHlcbiAgICAgKlxuICAgICAqIElmIHRleHQgZG9lcyBub3QgZml0IGhvcml6b250YWxseSBhdCBmdWxsIHNjYWxlLCB0aGVuIHNjYWxlIGRvd25cbiAgICAgKiB1bnRpbCBpdCBmaXRzLiBWZXJ0aWNhbCBvdmVyZmxvdyBpcyBpZ25vcmVkLlxuICAgICAqL1xuICAgIHJlc2l6ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRleHRCb3VuZHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjYWxlLnNldFRvKDEpO1xuICAgICAgICBpZiAodGhpcy53aWR0aCA+IHRoaXMudGV4dEJvdW5kcy53aWR0aCkge1xuICAgICAgICAgICAgdGhpcy5zY2FsZS5zZXRUbyh0aGlzLnRleHRCb3VuZHMud2lkdGggLyB0aGlzLndpZHRoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGFiZWw7IiwiaW1wb3J0IExhYmVsIGZyb20gXCIuL0xhYmVsXCI7XG5pbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuXG5jbGFzcyBOYW1lcGxhdGUgZXh0ZW5kcyBQaGFzZXIuSW1hZ2Uge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGtleSwgY29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSk7XG4gICAgICAgIGdhbWUud29ybGQuYWRkKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZyB8fCB0aGlzLmdhbWUuY29uZmlnLm5hbWVwbGF0ZTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7XG4gICAgICAgICAgICBuYW1lcGxhdGU6IG51bGwsXG4gICAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgICAgYmFsYW5jZTogbnVsbCxcbiAgICAgICAgICAgIGZsYXNoOiBudWxsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc2V0IG5hbWUobmFtZSkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS5zZXRUZXh0KG5hbWUpO1xuICAgIH1cblxuICAgIHNldCBiYWxhbmNlKGJhbGFuY2UpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2Uuc2V0VGV4dChVdGlsLnBhcnNlQ3VycmVuY3koYmFsYW5jZSkpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlID0gdGhpcztcblxuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZSA9IG5ldyBMYWJlbCh0aGlzLmdhbWUsIHRoaXMuY29uZmlnLm5hbWUueCwgdGhpcy5jb25maWcubmFtZS55LCBcIlwiLCB0aGlzLmNvbmZpZy5uYW1lLnN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUuc2V0VGV4dEJvdW5kcygwLCAwLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLndpZHRoIC0gMjAsIDApO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuZGlzcGxheS5uYW1lKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZSA9IG5ldyBMYWJlbCh0aGlzLmdhbWUsIHRoaXMuY29uZmlnLmJhbGFuY2UueCwgdGhpcy5jb25maWcuYmFsYW5jZS55LCBcIlwiLCB0aGlzLmNvbmZpZy5iYWxhbmNlLnN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2Uuc2V0VGV4dEJvdW5kcygwLCAwLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLndpZHRoIC0gMjAsIDApO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuZGlzcGxheS5iYWxhbmNlKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2ggPSBuZXcgTGFiZWwodGhpcy5nYW1lLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmNlbnRlclgsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuY2VudGVyWSwgXCJcIiwgdGhpcy5jb25maWcuZmxhc2guc3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2guc2V0VGV4dEJvdW5kcygwLCAwLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLndpZHRoIC0gMjAsIDApO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2guYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmZsYXNoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBGbGFzaCB0ZXh0IGZvciBkdXJhdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gZGlzcGxheXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2R1cmF0aW9uPTIwMDBdIC0gTWlsbGlzZWNvbmRzIHRvIGRpc3BsYXkgdGV4dFxuICAgICAqL1xuICAgIGZsYXNoKHRleHQsIGR1cmF0aW9uID0gMjAwMCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2guc2V0VGV4dCh0ZXh0KTtcblxuICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKGR1cmF0aW9uLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBOYW1lcGxhdGU7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4vQnV0dG9uXCI7XG5pbXBvcnQgU2xpZGVyIGZyb20gXCIuL1NsaWRlclwiO1xuaW1wb3J0IHtBY3Rpb259IGZyb20gXCIuL0FjdGlvblwiO1xuXG5jbGFzcyBQYW5lbCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJldHMgPSBbMF07XG4gICAgICAgIHRoaXMucHJpbWFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnByaW1hcnlBY3Rpb24gPSBBY3Rpb24uQkVUO1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IEFjdGlvbi5DSEVDSztcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnRlcnRpYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMudGVydGlhcnlBY3Rpb24gPSBBY3Rpb24uRk9MRDtcbiAgICAgICAgdGhpcy5zbGlkZXIgPSBuZXcgU2xpZGVyKHRoaXMuZ2FtZSwgXCJwYW5lbFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbHdheXNWaXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkgPSB0aGlzLm1ha2VCdXR0b24oMCwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5wcmltYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnByaW1hcnlBY3Rpb24sIHRoaXMucHJpbWFyeUJldCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDEzNSwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5zZWNvbmRhcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMuc2Vjb25kYXJ5QWN0aW9uLCB0aGlzLnNlY29uZGFyeUJldCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkudGVydGlhcnkgPSB0aGlzLm1ha2VCdXR0b24oMjcwLCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnRlcnRpYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnRlcnRpYXJ5QWN0aW9uLCAwKSk7XG5cbiAgICAgICAgdGhpcy5zbGlkZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuaW5kZXhDaGFuZ2VkLmFkZCgoaW5kZXgpID0+IHRoaXMuc2V0UHJpbWFyeUJldCh0aGlzLmJldHNbaW5kZXhdKSwgdGhpcyk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNsaWRlcldoZWVsLmFkZCh0aGlzLnNpbmdsZVN0ZXBCZXQsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2xpZGVyID0gdGhpcy5zbGlkZXIuYmFyO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2xpZGVyLnkgPSA2MDtcblxuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeS5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHRoaXMuc2xpZGVyLmVuYWJsZVNsaWRlcldoZWVsKHRydWUpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHRoaXMuc2xpZGVyLmVuYWJsZVNsaWRlcldoZWVsKGZhbHNlKSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5wcmltYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zZWNvbmRhcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnRlcnRpYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zbGlkZXIpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG1ha2VCdXR0b24oeCwgeSwgc2l6ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ1dHRvbiA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCB4LCB5LCB0aGlzLmtleSk7XG4gICAgICAgIGJ1dHRvbi5vbklucHV0VXAuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgYnV0dG9uLnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX292ZXJcIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX291dFwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfdXBcIlxuICAgICAgICApO1xuICAgICAgICBidXR0b24uc2V0VGV4dFN0eWxlKHRoaXMuZ2FtZS5jb25maWcucGFuZWwudGV4dFN0eWxlKTtcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICAvLyBQYW5lbCB1cGRhdGVzIHJlcXVpcmUgcGxheWVycycgY3VycmVudCBiZXRzLCBzbyBpZlxuICAgICAgICAvLyB0aGVyZSBpcyBubyBuZXh0IHBsYXllciB3ZSBzaG91bGRuJ3QgdXBkYXRlIHRoZSBkaXNwbGF5XG4gICAgICAgIGlmICghdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFjdGlvblRleHQgPSB0aGlzLmdhbWUucm91bmRCZXQgPT09IDAgPyBcIkJFVCBcIiA6IFwiUkFJU0UgVE9cXG5cIjtcbiAgICAgICAgbGV0IHByaW1hcnlUZXh0ID0gYWN0aW9uVGV4dCArIFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLnByaW1hcnlCZXQgKyB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuc2V0VGV4dChwcmltYXJ5VGV4dCk7XG5cbiAgICAgICAgbGV0IHNlY29uZGFyeVRleHQgPSBcIkNIRUNLXCI7XG4gICAgICAgIGlmICh0aGlzLnNlY29uZGFyeUFjdGlvbiAhPT0gQWN0aW9uLkNIRUNLKSB7XG4gICAgICAgICAgICBzZWNvbmRhcnlUZXh0ID0gXCJDQUxMIFwiICsgVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuc2Vjb25kYXJ5QmV0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5LnNldFRleHQoc2Vjb25kYXJ5VGV4dCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnRlcnRpYXJ5LnNldFRleHQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xuICAgIH1cblxuICAgIHNldEJldHMoYmV0cykge1xuICAgICAgICBpZiAoYmV0cy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBiZXRzLiBQYW5lbCBtdXN0IGFsd2F5cyBoYXZlIGF0IGxlYXN0IG9uZSB2YWxpZCBiZXQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iZXRzID0gYmV0cztcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0c1swXTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0TGVuZ3RoKGJldHMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoMCk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNldEVuYWJsZWQoYmV0cy5sZW5ndGggPiAxKTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc2V0UHJpbWFyeUJldChiZXQpIHtcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRTZWNvbmRhcnlCZXQoYmV0KSB7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QmV0ID0gYmV0O1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IGJldCA9PT0gMCA/IEFjdGlvbi5DSEVDSyA6IEFjdGlvbi5CRVQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEhpZGUgb3Igc2hvdyB0aGUgZW50aXJlIHBhbmVsXG4gICAgICogQHBhcmFtIHtib29sZWFufSB2aXNpYmxlXG4gICAgICovXG4gICAgc2V0VmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGUgfHwgdGhpcy5hbHdheXNWaXNpYmxlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBJbmNyZW1lbnQgb3IgZGVjcmVtZW50IHRoaXMucHJpbWFyeUJldFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLk1vdXNlLndoZWVsRGVsdGF9IG1vZGlmaWVyIC0gKzEgb3IgLTFcbiAgICAgKi9cbiAgICBzaW5nbGVTdGVwQmV0KG1vZGlmaWVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuc2xpZGVyLmluZGV4ICsgbW9kaWZpZXI7XG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5zbGlkZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNsaWRlci5zZXRJbmRleChpbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsO1xuIiwiaW1wb3J0IHtBY3Rpb25UZXh0fSBmcm9tIFwiLi4vY2xhc3Nlcy9BY3Rpb25cIjtcbmltcG9ydCBDYXJkTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2FyZE1hbmFnZXJcIjtcbmltcG9ydCBDaGlwTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2hpcE1hbmFnZXJcIjtcbmltcG9ydCBOYW1lcGxhdGUgZnJvbSBcIi4uL2NsYXNzZXMvTmFtZXBsYXRlXCI7XG5cbmNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgY2hpcENvbmZpZykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmNoaXBDb25maWcgPSBjaGlwQ29uZmlnO1xuXG4gICAgICAgIHRoaXMuaWQgPSBudWxsO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IG51bGw7XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2l0dGluZ091dCA9IG51bGw7XG4gICAgICAgIHRoaXMuc2VhdCA9IG51bGw7XG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMucm91bmRCZXQgPSAwOyAgLy8gU3VtIGJldHMgYnkgcGxheWVyIGluIGN1cnJlbnQgYmV0dGluZyByb3VuZFxuXG4gICAgICAgIHRoaXMuaXNEZWFsZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc05leHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc1VzZXIgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge1xuICAgICAgICAgICAgbmFtZXBsYXRlOiBudWxsLFxuICAgICAgICAgICAgY2FyZHM6IG51bGwsXG4gICAgICAgICAgICBjYXJkc01hc2s6IG51bGwsXG4gICAgICAgICAgICBjaGlwczogbnVsbFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuY2FyZHMgPSBuZXcgQ2FyZE1hbmFnZXIodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5jaGlwcyA9IG5ldyBDaGlwTWFuYWdlcih0aGlzLmdhbWUsIFwiY2hpcHNcIiwgdGhpcy5nYW1lLmNvbmZpZy5kZW5vbXMpO1xuICAgICAgICB0aGlzLm5hbWVwbGF0ZSA9IG5ldyBOYW1lcGxhdGUodGhpcy5nYW1lLCAwLCAwLCBcIm5hbWVwbGF0ZVwiKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKGRhdGEpIHtcbiAgICAgICAgdGhpcy5pZCA9IGRhdGEuaWQ7XG4gICAgICAgIHRoaXMudXNlcklkID0gZGF0YS51c2VySWQ7XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGRhdGEuYmFsYW5jZTtcbiAgICAgICAgdGhpcy5zaXR0aW5nT3V0ID0gZGF0YS5zaXR0aW5nT3V0O1xuICAgICAgICB0aGlzLnNlYXQgPSBkYXRhLnNlYXQ7XG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcbiAgICAgICAgdGhpcy5pc1VzZXIgPSBkYXRhLmlzVXNlcjtcblxuICAgICAgICB0aGlzLmNhcmRzLmluaXRpYWxpemUoMik7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUgPSB0aGlzLm5hbWVwbGF0ZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcyA9IHRoaXMuY2FyZHMuZGlzcGxheUdyb3VwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMueCA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuY2VudGVyWDtcbiAgICAgICAgdGhpcy5oaWRlQ2FyZHMoKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHNNYXNrID0gdGhpcy5jcmVhdGVDYXJkc01hc2soKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzTWFzay5ib3R0b20gPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLnRvcDtcbiAgICAgICAgdGhpcy5jYXJkcy5tYXNrID0gdGhpcy5kaXNwbGF5LmNhcmRzTWFzaztcblxuICAgICAgICAvLyBOT1RFOiBUaGlzIGxpbmUgaXMgcmVxdWlyZWQgZm9yIHRoaXMgbWFzayB0byB3b3JrIHVuZGVyIFdlYkdMXG4gICAgICAgIC8vIFNvbWUgY2hhbmdlcyB0byBtYXNrcyBpbiBXZWJHTCBtb2RlIHdpbGwgcmVuZGVyIHRoZSBtYXNrXG4gICAgICAgIC8vIGNvbXBsZXRlbHkgaW5lZmZlY3RpdmUuIFRoZSBidWcgaXMgbm90IHdlbGwgdW5kZXJzdG9vZC4gSXQgbWF5XG4gICAgICAgIC8vIGhhdmUgYmVlbiBmaXhlZCBpbiBsYXRlciB2ZXJzaW9ucyBvZiBQaGFzZXIuXG4gICAgICAgIC8vIE1vcmUgZGV0YWlsIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9waG90b25zdG9ybS9waGFzZXItY2UvaXNzdWVzLzMzNFxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHNNYXNrLmRpcnR5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmNoaXBzLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jaGlwcyA9IHRoaXMuY2hpcHMuZGlzcGxheUdyb3VwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMueCA9IHRoaXMuY2hpcENvbmZpZ1t0aGlzLnNlYXRdLng7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jaGlwcy55ID0gdGhpcy5jaGlwQ29uZmlnW3RoaXMuc2VhdF0ueTtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5jaGlwcy5kaXNwbGF5R3JvdXApO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmNhcmRzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5jYXJkc01hc2spO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5uYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmJhbGFuY2UgPSB0aGlzLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuZnJhbWVOYW1lID0gdGhpcy5pc05leHQgPyBcInJlZFwiIDogXCJiYXNlXCI7XG4gICAgfVxuXG4gICAgdXBkYXRlKGRhdGEsIHVwZGF0ZUNoaXBzID0gdHJ1ZSkge1xuICAgICAgICAvLyBUT0RPIC0gRmxlc2ggb3V0IHRoZSByZXN0IG9mIHRoZSBkYXRhIC0tIGRvIEkgbGlrZSB0aGlzIG1ldGhvZD9cbiAgICAgICAgdGhpcy5iYWxhbmNlID0gZGF0YS5iYWxhbmNlID09PSB1bmRlZmluZWQgPyB0aGlzLmJhbGFuY2UgOiBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuaXNEZWFsZXIgPSBkYXRhLmlzRGVhbGVyID09PSB1bmRlZmluZWQgPyB0aGlzLmlzRGVhbGVyIDogZGF0YS5pc0RlYWxlcjtcbiAgICAgICAgdGhpcy5pc05leHQgPSBkYXRhLmlzTmV4dCA9PT0gdW5kZWZpbmVkID8gdGhpcy5pc05leHQgOiBkYXRhLmlzTmV4dDtcbiAgICAgICAgdGhpcy5yb3VuZEJldCA9IGRhdGEucm91bmRCZXQgPT09IHVuZGVmaW5lZCA/IHRoaXMucm91bmRCZXQgOiBkYXRhLnJvdW5kQmV0O1xuICAgICAgICBpZiAodXBkYXRlQ2hpcHMpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpcHMuc2V0VmFsdWUodGhpcy5yb3VuZEJldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoaXBzLnZhbHVlID0gdGhpcy5yb3VuZEJldDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBhY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnVwZGF0ZSh7XG4gICAgICAgICAgICBiYWxhbmNlOiBkYXRhLnBsYXllckJhbGFuY2UsXG4gICAgICAgICAgICByb3VuZEJldDogZGF0YS5wbGF5ZXJSb3VuZEJldFxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgYWN0aW9uVGV4dCA9IEFjdGlvblRleHRbZGF0YS5hY3Rpb25UeXBlXTtcblxuICAgIH1cblxuICAgIGNyZWF0ZUNhcmRzTWFzaygpIHtcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuY2FyZHMuY2FyZHNbMF0uaGVpZ2h0O1xuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLm5hbWVwbGF0ZS53aWR0aDtcbiAgICAgICAgbGV0IG1hc2sgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKDAsIDApO1xuICAgICAgICBtYXNrLmJlZ2luRmlsbCgweGZmZmZmZik7XG4gICAgICAgIG1hc2suZHJhd1JlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHJldHVybiBtYXNrO1xuICAgIH1cblxuICAgIGFuaW1hdGVEZWFsKCkge1xuICAgICAgICBjb25zdCBzaG93VHdlZW4gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuZGlzcGxheS5jYXJkcykudG8oe3k6IC10aGlzLm5hbWVwbGF0ZS5oZWlnaHQgLyAyfSwgNTAwLCBQaGFzZXIuRWFzaW5nLlF1YXJ0aWMuT3V0LCB0cnVlKTtcblxuICAgICAgICBzaG93VHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2FyZFBvc2l0aW9ucyA9IHRoaXMuY2FsY0NhcmRQb3NpdGlvbnMoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5hZGQudHdlZW4odGhpcy5jYXJkcy5jYXJkc1tpXSkudG8oe3g6IGNhcmRQb3NpdGlvbnNbaV19LCA1MDAsIFBoYXNlci5FYXNpbmcuUXVhcnRpYy5PdXQsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICBhbmltYXRlRm9sZCgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuY2FyZHMuY2FyZHNbaV0pLnRvKHt4OiAwfSwgNTAwLCBQaGFzZXIuRWFzaW5nLlF1YXJ0aWMuT3V0LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGhpZGVUd2VlbiA9IHRoaXMuZ2FtZS5hZGQudHdlZW4odGhpcy5kaXNwbGF5LmNhcmRzKS50byh7dG9wOiB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLnRvcH0sIDUwMCwgUGhhc2VyLkVhc2luZy5RdWFydGljLk91dCk7XG4gICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoNTAwLCAoKSA9PiB7XG4gICAgICAgICAgICBoaWRlVHdlZW4uc3RhcnQoKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgcmV0dXJuIGhpZGVUd2Vlbi5vbkNvbXBsZXRlO1xuICAgIH1cblxuICAgIGhpZGVDYXJkcygpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRzLmNhcmRzW2ldLnggPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcy50b3AgPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLnRvcDtcbiAgICB9XG5cbiAgICBzaG93Q2FyZHMoKSB7XG4gICAgICAgIGNvbnN0IGNhcmRQb3NpdGlvbnMgPSB0aGlzLmNhbGNDYXJkUG9zaXRpb25zKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkcy5jYXJkc1tpXS54ID0gY2FyZFBvc2l0aW9uc1tpXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMueSA9IC10aGlzLm5hbWVwbGF0ZS5oZWlnaHQgLyAyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IENhbGN1bGF0ZSB0aGUgZmluYWwgcG9zaXRpb25zIG9mIGFsbCBjYXJkcyBpbiBoYW5kXG4gICAgICpcbiAgICAgKiBOT1RFIFRPIE1FOiBEb24ndCBmdWNrIHdpdGggdGhpcy4gSXQgdG9vayBhIGxvbmcgdGltZSB0byBnZXQgcmlnaHQuXG4gICAgICpcbiAgICAgKiBUaGUgY2FyZHMgbmVlZCB0byBiZSBwb3NpdGlvbmVkIGNvcnJlY3RseSBib3RoIGluIHJlbGF0aW9uIHRvXG4gICAgICogdGhlbXNlbHZlcyAoc3RhZ2dlcmVkIGV2ZW5seSkgYW5kIGFsc28gaW4gcmVsYXRpb24gdG8gdGhlIG5hbWVwbGF0ZS5cbiAgICAgKiBEb2luZyB0aGUgbGF0dGVyIGJ5IGNlbnRlcmluZyB0aGUgY2FyZHMnIGRpc3BsYXkgZ3JvdXAgb24gdGhlIG5hbWVwbGF0ZVxuICAgICAqIHdvdWxkIGhhdmUgYmVlbiBtdWNoIGVhc2llciwgYnV0IHRoYXQgd2F5IG1hZGUgYW5pbWF0aW5nIHRoZSBjYXJkXG4gICAgICogc3ByZWFkIG5lYXJseSBpbXBvc3NpYmxlLlxuICAgICAqXG4gICAgICogQHJldHVybnMge251bWJlcltdfVxuICAgICAqL1xuICAgIGNhbGNDYXJkUG9zaXRpb25zKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2FyZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcG9zaXRpb25zID0gW107XG4gICAgICAgIGNvbnN0IGNhcmRXaWR0aCA9IHRoaXMuY2FyZHMuY2FyZHNbMF0ud2lkdGg7XG4gICAgICAgIGNvbnN0IGNhcmRBcmVhID0gdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS53aWR0aCAqIDAuOTtcbiAgICAgICAgY29uc3QgdG90YWxXaWR0aCA9IGNhcmRXaWR0aCAqIHRoaXMuY2FyZHMubGVuZ3RoO1xuICAgICAgICBjb25zdCB0b3RhbE92ZXJmbG93ID0gdG90YWxXaWR0aCAtIGNhcmRBcmVhO1xuICAgICAgICBjb25zdCBjYXJkT2Zmc2V0ID0gdG90YWxPdmVyZmxvdyAvICh0aGlzLmNhcmRzLmxlbmd0aCAtIDEpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIC8vIFNwYWNlIGNhcmRzIGV2ZW5seVxuICAgICAgICAgICAgbGV0IHBvcyA9IGNhcmRXaWR0aCAqIGkgLSBjYXJkT2Zmc2V0ICogaTtcblxuICAgICAgICAgICAgLy8gQ2VudGVyIGNhcmRzIG9uIG5hbWVwbGF0ZVxuICAgICAgICAgICAgcG9zIC09IGNhcmRBcmVhIC8gMiAtIGNhcmRXaWR0aCAvIDI7XG5cbiAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKHBvcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc2l0aW9ucztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImltcG9ydCBDaGlwTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2hpcE1hbmFnZXJcIjtcblxuY2xhc3MgUG90IHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuYW1vdW50ID0gMDtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBudWxsO1xuICAgICAgICB0aGlzLmNoaXBzID0gbmV3IENoaXBNYW5hZ2VyKHRoaXMuZ2FtZSwgXCJjaGlwc1wiLCB0aGlzLmdhbWUuY29uZmlnLmRlbm9tcyk7XG4gICAgICAgIHRoaXMuY2hpcHMuc3RhY2tDaGlwcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNoaXBzLmNvbG9yVXAgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5jaGlwcy5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuY2hpcHMuc2V0VmFsdWUodGhpcy5hbW91bnQpO1xuICAgIH1cblxuICAgIHNldEFtb3VudChhbW91bnQpIHtcbiAgICAgICAgdGhpcy5hbW91bnQgPSBhbW91bnQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIGdhdGhlckNoaXBzKHBsYXllcnMpIHtcbiAgICAgICAgY29uc3QgZmluaXNoZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICBjb25zdCBwbGF5ZXJzV2l0aENoaXBzID0gcGxheWVycy5maWx0ZXIocGxheWVyID0+IHBsYXllci5jaGlwcy5jaGlwcy5sZW5ndGgpO1xuXG4gICAgICAgIGxldCBkZWxheSA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyc1dpdGhDaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcGxheWVyID0gcGxheWVyc1dpdGhDaGlwc1tpXTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoZGVsYXksICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFtb3VudCArPSBwbGF5ZXIuY2hpcHMudmFsdWU7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFrZUNoaXBzRmluaXNoZWQgPSB0aGlzLmNoaXBzLnRha2VDaGlwcyhwbGF5ZXIuY2hpcHMuY2hpcHMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHBsYXllcnNXaXRoQ2hpcHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0YWtlQ2hpcHNGaW5pc2hlZC5hZGQoKCkgPT4gZmluaXNoZWQuZGlzcGF0Y2goKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICBkZWxheSArPSAxMDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmluaXNoZWQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb3Q7XG4iLCIvKipcbiAqIEEgc2xpZGVyIFVJIGVsZW1lbnRcbiAqXG4gKiBSZXByZXNlbnRlZCBieSBhIGJhciBzcHJpdGUgYW5kIGEgbWFya2VyIHNwcml0ZS4gRGVzcGl0ZSBob3cgaXQgbWF5XG4gKiBsb29rLCBhbGwgaW5wdXQgb2NjdXJzIG9uIHRoZSBiYXIgYW5kIHVwZGF0ZXMgYXJlIG1hZGUgdG8gdGhlXG4gKiBtYXJrZXIncyBwb3NpdGlvbiBiYXNlZCBvbiB0aG9zZSBpbnB1dHMuXG4gKi9cbmNsYXNzIFNsaWRlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJhciA9IG51bGw7ICAvLyBUaGUgc2xpZGVyIGJhciBzcHJpdGVcbiAgICAgICAgdGhpcy5tYXJrZXIgPSBudWxsOyAgLy8gVGhlIGRyYWdnYWJsZSBtYXJrZXIgc3ByaXRlXG4gICAgICAgIHRoaXMuaW5kZXggPSAwOyAgLy8gQ3VycmVudCBpbmRleCBvZiBtYXJrZXJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAxOyAgLy8gVG90YWwgbnVtYmVyIG9mIGluZGljZXNcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuaW5kZXhDaGFuZ2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5zbGlkZXJXaGVlbCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuYmFyID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCB0aGlzLmtleSwgXCJzbGlkZXJfYmFyXCIpO1xuICAgICAgICB0aGlzLmJhci5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dERvd24uYWRkKHRoaXMuc3RhcnREcmFnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRVcC5hZGQodGhpcy5zdG9wRHJhZywgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4gdGhpcy5lbmFibGVTbGlkZXJXaGVlbCh0cnVlKSk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0T3V0LmFkZCgoKSA9PiB0aGlzLmVuYWJsZVNsaWRlcldoZWVsKGZhbHNlKSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYXIgPSB0aGlzLmJhcjtcblxuICAgICAgICB0aGlzLm1hcmtlciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIHRoaXMua2V5LCBcInNsaWRlcl9tYXJrZXJcIik7XG4gICAgICAgIHRoaXMubWFya2VyLmFuY2hvci5zZXRUbygwLjUsIDApO1xuICAgICAgICB0aGlzLm1hcmtlci5ib3R0b20gPSB0aGlzLmJhci5ib3R0b207XG4gICAgICAgIHRoaXMuZGlzcGxheS5tYXJrZXIgPSB0aGlzLm1hcmtlcjtcbiAgICAgICAgdGhpcy5iYXIuYWRkQ2hpbGQodGhpcy5tYXJrZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBzbGlkZXIgZHJhZ2dpbmcgYW5kIGluaXRpYXRlIGZpcnN0IGRyYWcgZXZlbnRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5TcHJpdGV9IGJhciAtIFRoZSBiYXIgc3ByaXRlIHRoYXQgd2FzIGNsaWNrZWRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Qb2ludGVyfSBwb2ludGVyIC0gVGhlIHBvaW50ZXIgd2hpY2ggaW5pdGlhdGVkIHRoZSBjbGlja1xuICAgICAqL1xuICAgIHN0YXJ0RHJhZyhiYXIsIHBvaW50ZXIpIHtcbiAgICAgICAgLy8gSW5pdGlhbCBjYWxsIHRvIHVwZGF0ZURyYWcgYWxsb3dzIGNoYW5naW5nIGJldCB3aXRoIGNsaWNrIG9uIGJhclxuICAgICAgICB0aGlzLnVwZGF0ZURyYWcocG9pbnRlciwgcG9pbnRlci54LCBwb2ludGVyLnkpO1xuICAgICAgICB0aGlzLmdhbWUuaW5wdXQuYWRkTW92ZUNhbGxiYWNrKHRoaXMudXBkYXRlRHJhZywgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRGlzYWJsZSBzbGlkZXIgZHJhZ2dpbmdcbiAgICAgKi9cbiAgICBzdG9wRHJhZygpIHtcbiAgICAgICAgdGhpcy5nYW1lLmlucHV0LmRlbGV0ZU1vdmVDYWxsYmFjayh0aGlzLnVwZGF0ZURyYWcsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IENhbGN1bGF0ZSBzbGlkZXIgaW5kZXggYmFzZWQgb24gZHJhZyBpbnB1dFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlBvaW50ZXJ9IHBvaW50ZXIgLSBUaGUgc2xpZGluZyBwb2ludGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlIG9mIHBvaW50ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGUgb2YgcG9pbnRlclxuICAgICAqL1xuICAgIHVwZGF0ZURyYWcocG9pbnRlciwgeCwgeSkge1xuICAgICAgICBsZXQgbG9jYWxYID0geCAtIHRoaXMuYmFyLndvcmxkLng7ICAvLyBDbGljayBwb3MgaW4gcmVsYXRpb24gdG8gYmFyXG5cbiAgICAgICAgLy8gUHJldmVudCBkcmFnZ2luZyBwYXN0IGJhciBib3VuZHNcbiAgICAgICAgaWYgKGxvY2FsWCA8IDApIHtcbiAgICAgICAgICAgIGxvY2FsWCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAobG9jYWxYID4gdGhpcy5iYXIud2lkdGgpIHtcbiAgICAgICAgICAgIGxvY2FsWCA9IHRoaXMuYmFyLndpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3VidHJhY3QgMSBmcm9tIGxlbmd0aCBiZWNhdXNlIGxlbmd0aCBpcyAxLWluZGV4ZWQsIGluZGljZXMgYXJlIDAtaW5kZXhlZFxuICAgICAgICBjb25zdCBpbmRleCA9IE1hdGgucm91bmQobG9jYWxYIC8gdGhpcy5iYXIud2lkdGggKiAodGhpcy5sZW5ndGggLSAxKSk7XG4gICAgICAgIHRoaXMuc2V0SW5kZXgoaW5kZXgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgaW5kZXggb2YgdGhlIHNsaWRlciBhbmQgcmVwb3J0IHRoZSBuZXcgdmFsdWVcbiAgICAgKlxuICAgICAqIE9wdGlvbmFsbHkgdXBkYXRlIHRoZSB2aXN1YWwgcG9zaXRpb24gb2YgdGhlIG1hcmtlciBvbiB0aGUgc2xpZGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gTmV3IGluZGV4IHRvIHNldCBvbiBzbGlkZXJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1cGRhdGVQb3M9dHJ1ZV0gLSBVcGRhdGUgdGhlIHBvc2l0aW9uIG9mIG1hcmtlcj9cbiAgICAgKi9cbiAgICBzZXRJbmRleChpbmRleCwgdXBkYXRlUG9zID0gdHJ1ZSkge1xuICAgICAgICBpZiAoaW5kZXggIT09IHRoaXMuaW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhDaGFuZ2VkLmRpc3BhdGNoKGluZGV4KTtcblxuICAgICAgICAgICAgaWYgKHVwZGF0ZVBvcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIG9ubHkgb25lIGJldCBhdmFpbGFibGUsIGl0J3MgYSBtYXggYmV0XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFya2VyLnggPSB0aGlzLmJhci53aWR0aDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCAxIGZyb20gbGVuZ3RoIGJlY2F1c2UgbGVuZ3RoIGlzIDEtaW5kZXhlZCwgaW5kaWNlcyBhcmUgMC1pbmRleGVkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFya2VyLnggPSB0aGlzLmJhci53aWR0aCAvICh0aGlzLmxlbmd0aCAtIDEpICogdGhpcy5pbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBVcGRhdGUgdGhlIGxlbmd0aCBwcm9wZXJ0eVxuICAgICAqXG4gICAgICogVGhlIGxlbmd0aCBwcm9wZXJ0eSBkZXNjcmliZXMgaG93IG1hbnkgZGlzY3JldGUgYmV0cyB0aGUgc2xpZGVyIGJhclxuICAgICAqIG11c3QgcmVwcmVzZW50LiBUaGUgc2xpZGVyIGRvZXMgbm90IGNhcmUgYWJvdXQgd2hhdCB0aGUgc3BlY2lmaWMgYmV0XG4gICAgICogaXQgcmVwcmVzZW50cyBpcywgb25seSB0aGF0IGl0IGhhcyBzb21lIG51bWJlciBvZiBpbmRpY2VzIGFsb25nIGl0c1xuICAgICAqIGxlbmd0aCBhbmQgdGhhdCBpdCBtdXN0IHJlcG9ydCBpdHMgaW5kZXggdG8gbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBuZXcgbGVuZ3RoIHRvIHNldFxuICAgICAqL1xuICAgIHNldExlbmd0aChsZW5ndGgpIHtcbiAgICAgICAgaWYgKGxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IHNldCBzbGlkZXIgbGVuZ3RoIGxlc3MgdGhhbiAxXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGxlbmd0aCA+IHRoaXMuYmFyLndpZHRoKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBTZXR0aW5nIHNsaWRlciBzdG9wcyBncmVhdGVyIHRoYW4gbGVuZ3RoIG1heSByZXN1bHQgaW4gdW5leHBlY3RlZCBiZWhhdmlvclwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSB0aGUgc2xpZGVyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gSXMgdGhlIHNsaWRlciBlbmFibGVkP1xuICAgICAqL1xuICAgIHNldEVuYWJsZWQoZW5hYmxlZCkge1xuICAgICAgICB0aGlzLmJhci5pbnB1dEVuYWJsZWQgPSBlbmFibGVkO1xuXG4gICAgICAgIGxldCB0aW50ID0gZW5hYmxlZCA/IDB4RkZGRkZGIDogMHg4MDgwODA7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYXIudGludCA9IHRpbnQ7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tYXJrZXIudGludCA9IHRpbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgZGlzcGF0Y2ggb2Ygc2lnbmFsIG9uIHdoZWVsIHNjcm9sbFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIElzIHRoZSBjYWxsYmFjayBlbmFibGVkIG9yIGRpc2FibGVkP1xuICAgICAqL1xuICAgIGVuYWJsZVNsaWRlcldoZWVsKGVuYWJsZWQpIHtcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS5tb3VzZVdoZWVsQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJXaGVlbC5kaXNwYXRjaCh0aGlzLmdhbWUuaW5wdXQubW91c2Uud2hlZWxEZWx0YSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmlucHV0Lm1vdXNlLm1vdXNlV2hlZWxDYWxsYmFjayA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNsaWRlcjsiLCIvKipcbiAqIEBzdW1tYXJ5IFRyYWNrIGFuZCBxdWV1ZSB0d2VlbnMgZ2FtZSB3aWRlXG4gKlxuICogSXQncyBlYXN5IHRvIGNoYWluIHR3ZWVucyB3aGVuIHRoZXkncmUgY3JlYXRlZCBhdCB0aGUgc2FtZSBwb2ludFxuICogaW4gdGltZSwgYnV0IHdoYXQgaWYgdHdvIHR3ZWVucyBhcmUgY3JlYXRlZCBhdCBjb21wbGV0ZWx5IGRpZmZlcmVudFxuICogcG9pbnRzPyBXaGF0IGlmIHRob3NlIHR3ZWVucyBuZWVkIHRvIHJ1biBjb25zZWN1dGl2ZWx5LCB0aGUgc2Vjb25kXG4gKiB3YWl0aW5nIGZvciB0aGUgZmlyc3QgdG8gY29tcGxldGUgYmVmb3JlIHN0YXJ0aW5nP1xuICovXG5cbmNsYXNzIFR3ZWVuUXVldWUge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcblxuICAgICAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudCA9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IHJ1bm5pbmcoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuY3VycmVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBBZGQgYSB0d2VlbiB0byB0aGUgcXVldWVcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Ud2Vlbn0gdHdlZW4gLSBUaGUgdHdlZW4gdG8gYWRkIHRvIHRoZSBxdWV1ZVxuICAgICAqL1xuICAgIGFkZCh0d2Vlbikge1xuICAgICAgICAvLyBUd2VlbnMgYWRkZWQgdG8gdGhlIHF1ZXVlIG1heSBoYXZlIG90aGVyIG9uQ29tcGxldGUgY2FsbGJhY2tzLFxuICAgICAgICAvLyBidXQgdGhleSBtdXN0IGF0IGxlYXN0IGhhdmUgdGhpcyBvbmUsIHdoaWNoIHRyaWdnZXJzIHRoZVxuICAgICAgICAvLyBuZXh0IHR3ZWVuIGluIHRoZSBxdWV1ZSB0byBiZWdpblxuICAgICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCh0aGlzLm5leHQsIHRoaXMpO1xuXG4gICAgICAgIC8vIEFkZCB0byB0aGUgZnJvbnQsIHJlbW92ZSBmcm9tIHRoZSBiYWNrXG4gICAgICAgIHRoaXMucXVldWUudW5zaGlmdCh0d2Vlbik7XG5cbiAgICAgICAgLy8gQXV0byBzdGFydCB0aGUgY2hhaW4gaWYgaXQncyBub3QgYWxyZWFkeSBydW5uaW5nXG4gICAgICAgIGlmICghdGhpcy5ydW5uaW5nKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFN0YXJ0IHRoZSBuZXh0IHR3ZWVuIGluIHRoZSBxdWV1ZVxuICAgICAqL1xuICAgIG5leHQoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMucXVldWUucG9wKCk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5zdGFydCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUd2VlblF1ZXVlOyIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJwYW5lbFwiOiB7XG4gICAgXCJwYWRkaW5nXCI6IDEwLFxuICAgIFwidGV4dFN0eWxlXCI6IHtcbiAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgIFwiYWxpZ25cIjogXCJjZW50ZXJcIlxuICAgIH0sXG4gICAgXCJwb3NcIjoge1xuICAgICAgXCJ4XCI6IDE0ODAsXG4gICAgICBcInlcIjogNzkwXG4gICAgfVxuICB9LFxuICBcInNlYXRzXCI6IFtcbiAgICB7XCJ4XCI6IDg2MCwgXCJ5XCI6IDIwMH0sXG4gICAge1wieFwiOiAxMTc4LCBcInlcIjogMjAwfSxcbiAgICB7XCJ4XCI6IDE1MjIsIFwieVwiOiAzNDJ9LFxuICAgIHtcInhcIjogMTUyMiwgXCJ5XCI6IDYyNn0sXG4gICAge1wieFwiOiAxMTc4LCBcInlcIjogODk0fSxcbiAgICB7XCJ4XCI6IDg2MCwgXCJ5XCI6IDg5NH0sXG4gICAge1wieFwiOiA1NDIsIFwieVwiOiA4OTR9LFxuICAgIHtcInhcIjogMTk4LCBcInlcIjogNjI2fSxcbiAgICB7XCJ4XCI6IDE5OCwgXCJ5XCI6IDM0Mn0sXG4gICAge1wieFwiOiA1NDIsIFwieVwiOiAyMDB9XG4gIF0sXG4gIFwiYnV5SW5Nb2RhbFwiOiB7XG4gICAgXCJ4XCI6IDgxMCxcbiAgICBcInlcIjogNDMwLFxuICAgIFwiaW5wdXRCb3hcIjoge1xuICAgICAgXCJ4XCI6IDE1LFxuICAgICAgXCJ5XCI6IDg2XG4gICAgfSxcbiAgICBcImlucHV0RmllbGRcIjoge1xuICAgICAgXCJ4XCI6IDMwLFxuICAgICAgXCJ5XCI6IC0yXG4gICAgfSxcbiAgICBcImNhbmNlbEJ1dHRvblwiOiB7XG4gICAgICBcInhcIjogMTUsXG4gICAgICBcInlcIjogMTQ1XG4gICAgfSxcbiAgICBcInN1Ym1pdEJ1dHRvblwiOiB7XG4gICAgICBcInhcIjogMTU1LFxuICAgICAgXCJ5XCI6IDE0NVxuICAgIH1cbiAgfSxcbiAgXCJkZWFsZXJCdXR0b25cIjogW1xuICAgIHtcInhcIjogODQ2LCBcInlcIjogMzAwfSxcbiAgICB7XCJ4XCI6IDExNjQsIFwieVwiOiAzMDB9LFxuICAgIHtcInhcIjogMTUxNiwgXCJ5XCI6IDQ0Mn0sXG4gICAge1wieFwiOiAxNTE2LCBcInlcIjogNTkyfSxcbiAgICB7XCJ4XCI6IDExNTAsIFwieVwiOiA3OTB9LFxuICAgIHtcInhcIjogNzg0LCBcInlcIjogNzkwfSxcbiAgICB7XCJ4XCI6IDUyNiwgXCJ5XCI6IDc5MH0sXG4gICAge1wieFwiOiA0NDAsIFwieVwiOiA1OTJ9LFxuICAgIHtcInhcIjogNDQwLCBcInlcIjogNDQyfSxcbiAgICB7XCJ4XCI6IDUzMiwgXCJ5XCI6IDMwMH1cbiAgXSxcbiAgXCJkZW5vbXNcIjogWzUsIDI1LCAxMDAsIDUwMCwgMjAwMF0sXG4gIFwiY2hpcHNcIjogW1xuICAgIHtcInhcIjogMTAwLCBcInlcIjogMTIwfSxcbiAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IDEyMH0sXG4gICAge1wieFwiOiAtNjAsIFwieVwiOiA0MH0sXG4gICAge1wieFwiOiAtNjAsIFwieVwiOiA0MH0sXG4gICAge1wieFwiOiAxMDAsIFwieVwiOiAtMTQwfSxcbiAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IC0xNDB9LFxuICAgIHtcInhcIjogMTAwLCBcInlcIjogLTE0MH0sXG4gICAge1wieFwiOiAyNDAsIFwieVwiOiA0MH0sXG4gICAge1wieFwiOiAyNDAsIFwieVwiOiA0MH0sXG4gICAge1wieFwiOiAxMDAsIFwieVwiOiAxMjB9XG4gIF0sXG4gIFwibmFtZXBsYXRlXCI6IHtcbiAgICBcIm5hbWVcIjoge1xuICAgICAgXCJ4XCI6IDEwLFxuICAgICAgXCJ5XCI6IDMwLFxuICAgICAgXCJzdHlsZVwiOiB7XG4gICAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgICBcImZpbGxcIjogXCIjMzMzMzMzXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmFsYW5jZVwiOiB7XG4gICAgICBcInhcIjogMTAsXG4gICAgICBcInlcIjogNjAsXG4gICAgICBcInN0eWxlXCI6IHtcbiAgICAgICAgXCJmb250XCI6IFwiMTZwdCBBcmlhbFwiLFxuICAgICAgICBcImJvdW5kc0FsaWduSFwiOiBcInJpZ2h0XCIsXG4gICAgICAgIFwiZmlsbFwiOiBcIiM1NTU1NTVcIlxuICAgICAgfVxuICAgIH0sXG4gICAgXCJmbGFzaFwiOiB7XG4gICAgICBcInN0eWxlXCI6IHtcbiAgICAgICAgXCJmb250XCI6IFwiYm9sZCAzMHB0IEFyaWFsXCIsXG4gICAgICAgIFwiZmlsbFwiOiBcIiMzMzMzMzNcIlxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgXCJwb3B1cFwiOiB7XG4gICAgXCJ4XCI6IDAsXG4gICAgXCJ5XCI6IDEwLFxuICAgIFwid2lkdGhcIjogNjAsXG4gICAgXCJoZWlnaHRcIjogMjAsXG4gICAgXCJ0ZXh0XCI6IHtcbiAgICAgIFwieFwiOiA2LFxuICAgICAgXCJ5XCI6IDE4LFxuICAgICAgXCJzdHlsZVwiOiB7XG4gICAgICAgIFwiZm9udFwiOiBcIjEycHQgQXJpYWxcIixcbiAgICAgICAgXCJib3VuZHNBbGlnbkhcIjogXCJjZW50ZXJcIixcbiAgICAgICAgXCJib3VuZHNBbGlnblZcIjogXCJjZW50ZXJcIixcbiAgICAgICAgXCJmaWxsXCI6IFwiI0ZGRkZGRlwiXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQnV0dG9uIGZyb20gXCIuLi9jbGFzc2VzL0J1dHRvblwiO1xuXG5jbGFzcyBCdXlJbk1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5idXlJblJlcXVlc3RlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2VhdHMgPSB7fTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7XCJidXR0b25zXCI6IFtdLCBcIm1vZGFsXCI6IG51bGwsIFwiaW5wdXRCb3hcIjogbnVsbH07XG4gICAgICAgIHRoaXMuYnV0dG9uc0dyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkQ2hpbGQodGhpcy5idXR0b25zR3JvdXApO1xuXG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcInNlYXROdW1cIjogbnVsbCwgXCJidXlJblwiOiBudWxsfTtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZCAmJiB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZC52aXNpYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZC51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXRpYWxpemUoc2VhdENvbmZpZywgb2NjdXBpZWRTZWF0cywgbW9kYWxDb25maWcpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWF0Q29uZmlnLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIHNlYXRDb25maWdbaV0ueCwgc2VhdENvbmZpZ1tpXS55LCB0aGlzLmtleSwgdGhpcy5idXR0b25DbGlja2VkLCB0aGlzKTtcbiAgICAgICAgICAgIGJ1dHRvbi5zZWF0TnVtID0gaTsgLy8gU3RvcmUgZm9yIHVzZSBvbiBjbGlja1xuICAgICAgICAgICAgYnV0dG9uLnNldEZyYW1lcyhcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9vdmVyXCIsXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fb3V0XCIsXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fZG93blwiLFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX3VwXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBidXR0b24uc2V0VGV4dChcIkJ1eSBJblwiKTtcbiAgICAgICAgICAgIHRoaXMuc2VhdHNbaV0gPSB7XG4gICAgICAgICAgICAgICAgXCJidXR0b25cIjogYnV0dG9uLFxuICAgICAgICAgICAgICAgIFwib2NjdXBpZWRcIjogb2NjdXBpZWRTZWF0cy5pbmRleE9mKGkpICE9PSAtMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5idXR0b25zLnB1c2goYnV0dG9uKTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc0dyb3VwLmFkZChidXR0b24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnV0dG9uc0dyb3VwLnZpc2libGUgPSB0aGlzLmJ1dHRvbnNWaXNpYmxlO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQgPSB0aGlzLmdhbWUuYWRkLmltYWdlKDAsIDAsIHRoaXMuZ2FtZS50ZXh0dXJlcy5tb2RhbEJhY2tncm91bmQpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWxCYWNrZ3JvdW5kLnZpc2libGUgPSB0aGlzLm1vZGFsVmlzaWJsZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkQ2hpbGQodGhpcy5kaXNwbGF5Lm1vZGFsQmFja2dyb3VuZCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsID0gdGhpcy5nYW1lLmFkZC5pbWFnZShtb2RhbENvbmZpZy54LCBtb2RhbENvbmZpZy55LCB0aGlzLmtleSwgXCJtb2RhbFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLnZpc2libGUgPSB0aGlzLm1vZGFsVmlzaWJsZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkQ2hpbGQodGhpcy5kaXNwbGF5Lm1vZGFsKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRCb3ggPSB0aGlzLmdhbWUuYWRkLmltYWdlKG1vZGFsQ29uZmlnLmlucHV0Qm94LngsIG1vZGFsQ29uZmlnLmlucHV0Qm94LnksIHRoaXMua2V5LCBcImlucHV0X2JveFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLmFkZENoaWxkKHRoaXMuZGlzcGxheS5pbnB1dEJveCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0RmllbGQgPSB0aGlzLmdhbWUuYWRkLmlucHV0RmllbGQobW9kYWxDb25maWcuaW5wdXRGaWVsZC54LCBtb2RhbENvbmZpZy5pbnB1dEZpZWxkLnksIHtcbiAgICAgICAgICAgIGZvbnQ6ICczMnB4IEFyaWFsJyxcbiAgICAgICAgICAgIGZpbGw6ICcjMzMzMzMzJyxcbiAgICAgICAgICAgIHdpZHRoOiAyMjAsXG4gICAgICAgICAgICBwYWRkaW5nOiA4LFxuICAgICAgICAgICAgYm9yZGVyV2lkdGg6IDAsXG4gICAgICAgICAgICBwbGFjZUhvbGRlcjogJzIwLjAwJyxcbiAgICAgICAgICAgIHR5cGU6IFBoYXNlcklucHV0LklucHV0VHlwZS5udW1iZXIsXG4gICAgICAgICAgICBmaWxsQWxwaGE6IDBcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEJveC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZCk7XG5cbiAgICAgICAgY29uc3QgYnRuVGV4dFN0eWxlID0ge1xuICAgICAgICAgICAgXCJmb250XCI6IFwiYm9sZCAyMnB0IEFyaWFsXCIsXG4gICAgICAgICAgICBcImZpbGxcIjogXCJ3aGl0ZVwiLFxuICAgICAgICAgICAgXCJhbGlnblwiOiBcImNlbnRlclwiXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbCA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCBtb2RhbENvbmZpZy5jYW5jZWxCdXR0b24ueCwgbW9kYWxDb25maWcuY2FuY2VsQnV0dG9uLnksIHRoaXMua2V5LCB0aGlzLmNhbmNlbCwgdGhpcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0RnJhbWVzKFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X292ZXJcIixcbiAgICAgICAgICAgIFwiYnRuX3NlY29uZGFyeV9vdXRcIixcbiAgICAgICAgICAgIFwiYnRuX3NlY29uZGFyeV9kb3duXCIsXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfdXBcIlxuICAgICAgICApO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FuY2VsLnNldFRleHRTdHlsZShidG5UZXh0U3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FuY2VsLnNldFRleHQoXCJDQU5DRUxcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkuY2FuY2VsKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuc3VibWl0ID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIG1vZGFsQ29uZmlnLnN1Ym1pdEJ1dHRvbi54LCBtb2RhbENvbmZpZy5zdWJtaXRCdXR0b24ueSwgdGhpcy5rZXksIHRoaXMuc3VibWl0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnN1Ym1pdC5zZXRGcmFtZXMoXG4gICAgICAgICAgICBcImJ0bl9wcmltYXJ5X292ZXJcIixcbiAgICAgICAgICAgIFwiYnRuX3ByaW1hcnlfb3V0XCIsXG4gICAgICAgICAgICBcImJ0bl9wcmltYXJ5X2Rvd25cIixcbiAgICAgICAgICAgIFwiYnRuX3ByaW1hcnlfdXBcIlxuICAgICAgICApO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc3VibWl0LnNldFRleHRTdHlsZShidG5UZXh0U3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc3VibWl0LnNldFRleHQoXCJCVVkgSU5cIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkuc3VibWl0KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBuZXdQbGF5ZXIocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLnNlYXRzW3BsYXllckRhdGEuc2VhdF0ub2NjdXBpZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBwbGF5ZXJMZWZ0KHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5zZWF0c1twbGF5ZXJEYXRhLnNlYXRdLm9jY3VwaWVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIGZvciAobGV0IHNlYXROdW0gaW4gdGhpcy5zZWF0cykge1xuICAgICAgICAgICAgbGV0IHNlYXQgPSB0aGlzLnNlYXRzW3NlYXROdW1dO1xuICAgICAgICAgICAgc2VhdC5idXR0b24udmlzaWJsZSA9ICFzZWF0Lm9jY3VwaWVkO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnV0dG9uc0dyb3VwLnZpc2libGUgPSB0aGlzLmJ1dHRvbnNWaXNpYmxlO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWxCYWNrZ3JvdW5kLnZpc2libGUgPSB0aGlzLm1vZGFsVmlzaWJsZTtcbiAgICB9XG5cbiAgICBidXR0b25DbGlja2VkKGJ1dHRvbikge1xuICAgICAgICB0aGlzLmRhdGEuc2VhdE51bSA9IGJ1dHRvbi5zZWF0TnVtO1xuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgY2FuY2VsKCkge1xuICAgICAgICB0aGlzLmRhdGEgPSB7XCJzZWF0TnVtXCI6IG51bGwsIFwiYnV5SW5cIjogbnVsbH07XG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzdWJtaXQoKSB7XG4gICAgICAgIHRoaXMuZGF0YS5idXlJbiA9IHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkLnZhbHVlO1xuICAgICAgICB0aGlzLmJ1eUluUmVxdWVzdGVkLmRpc3BhdGNoKHRoaXMuZGF0YS5zZWF0TnVtLCB0aGlzLmRhdGEuYnV5SW4pO1xuICAgICAgICB0aGlzLmRhdGEgPSB7XCJzZWF0TnVtXCI6IG51bGwsIFwiYnV5SW5cIjogbnVsbH07XG4gICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc2V0QnV0dG9uc1Zpc2libGUodmlzaWJsZSkge1xuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gdmlzaWJsZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCdXlJbk1hbmFnZXI7IiwiaW1wb3J0IENhcmQgZnJvbSBcIi4uL2NsYXNzZXMvQ2FyZFwiO1xuXG5jbGFzcyBDYXJkTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgYXV0b0hpZGUgPSBmYWxzZSwga2V5ID0gXCJjYXJkc1wiKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuYXV0b0hpZGUgPSBhdXRvSGlkZTsgLy8gQXV0by1oaWRlIGFsbCBmYWNlIGRvd24gY2FyZHM/XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmNhcmRzID0gW107XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLl9tYXNrID0gbnVsbDsgIC8vIEEgbWFzayBhcHBsaWVkIHRvIGFsbCBjYXJkcyBpbiBkaXNwbGF5R3JvdXBcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKG51bV9jYXJkcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9jYXJkczsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2FyZCA9IG5ldyBDYXJkKHRoaXMuZ2FtZSwgMCwgMCwgdGhpcy5rZXksIHRoaXMsIHRoaXMuYXV0b0hpZGUpO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplKHt9KTtcbiAgICAgICAgICAgIGNhcmQuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICAgICAgdGhpcy5jYXJkcy5wdXNoKGNhcmQpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKGNhcmQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q2FyZE5hbWVzKG5hbWVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG5hbWVzW2ldO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLm5hbWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQgbGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYXJkcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgc2V0IG1hc2sobWFzaykge1xuICAgICAgICB0aGlzLl9tYXNrID0gbWFzaztcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAubWFzayA9IG1hc2s7XG4gICAgfVxuXG4gICAgZ2V0IG1hc2soKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXNrO1xuICAgIH1cblxuICAgIGdldCBjYXJkV2lkdGgoKSB7XG4gICAgICAgIGlmICghdGhpcy5jYXJkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNhcmRzWzBdLndpZHRoO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZE1hbmFnZXI7XG4iLCJpbXBvcnQgQ2hpcCBmcm9tIFwiLi4vY2xhc3Nlcy9DaGlwXCI7XG5pbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuXG5jbGFzcyBUb29sdGlwIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXksIHBhZGRpbmcgPSAxMCkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5wYWRkaW5nID0gcGFkZGluZztcblxuICAgICAgICB0aGlzLl90ZXh0ID0gXCJcIjtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogbnVsbCxcbiAgICAgICAgICAgIHRleHQ6IG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldCB0ZXh0KHRleHQpIHtcbiAgICAgICAgdGhpcy5fdGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXh0LnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnJlUG9zKCk7XG4gICAgfVxuXG4gICAgZ2V0IHRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0O1xuICAgIH1cblxuICAgIHNldCB2aXNpYmxlKHZpc2libGUpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAudmlzaWJsZSA9IHZpc2libGU7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgdGhpcy5rZXkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAyLCBcIlwiKTsgICAvLyBUT0RPIC0gTm8gbWFnaWMgbnVtYmVycyAobGVhdmluZyBmb3Igbm93IGJlY2F1c2UgZnVjayB0cnlpbmcgdG8gcG9zaXRpb24gdGV4dCB2ZXJ0aWNhbGx5KVxuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dC5zZXRTdHlsZSh7XG4gICAgICAgICAgICBcImZvbnRcIjogXCIxNnB0IEFyaWFsXCIsXG4gICAgICAgICAgICBcImZpbGxcIjogXCIjRkZGRkZGXCJcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXh0LmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuYmFja2dyb3VuZCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkudGV4dCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZVBvcygpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQuc2NhbGUuc2V0VG8oMSk7XG4gICAgICAgIGNvbnN0IHRleHRBcmVhID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQud2lkdGggLSAodGhpcy5wYWRkaW5nICogMik7XG4gICAgICAgIGlmICh0aGlzLmRpc3BsYXkudGV4dC53aWR0aCA+IHRleHRBcmVhKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkudGV4dC5zY2FsZS5zZXRUbyh0ZXh0QXJlYSAvIHRoaXMuZGlzcGxheS50ZXh0LndpZHRoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgQ2hpcE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSwgdmFsdWVzKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcblxuICAgICAgICB0aGlzLnN0YWNrQ2hpcHMgPSB0cnVlO1xuICAgICAgICB0aGlzLmNvbG9yVXAgPSB0cnVlO1xuICAgICAgICB0aGlzLmNoaXBzID0gW107XG4gICAgICAgIHRoaXMucG9vbCA9IFtdO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IG51bGw7XG4gICAgICAgIHRoaXMudG9vbHRpcCA9IG5ldyBUb29sdGlwKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLnRleHR1cmVzLnRleHRVbmRlcmxheSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7XG4gICAgICAgICAgICBjaGlwczogdGhpcy5nYW1lLmFkZC5ncm91cCgpLFxuICAgICAgICAgICAgdG9vbHRpcDogdGhpcy50b29sdGlwLmRpc3BsYXlHcm91cFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnRyYW5zZmVyQW5pbWF0aW9uID0gdGhpcy5hbmltYXRlQ2hpcENhc2NhZGU7XG4gICAgICAgIHRoaXMucGlsZVJhZGl1cyA9IDMwO1xuICAgIH1cblxuICAgIHNldCB2YWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnRvb2x0aXAudGV4dCA9IFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLl92YWx1ZSk7XG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMudG9vbHRpcC5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgICAgICB0aGlzLmRpc3BsYXkudG9vbHRpcC55ID0gdGhpcy5kaXNwbGF5LnRvb2x0aXAuaGVpZ2h0O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmNoaXBzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS50b29sdGlwKTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSgwKTtcbiAgICB9XG5cbiAgICBnZXRDaGlwKCkge1xuICAgICAgICBsZXQgY2hpcCA9IHRoaXMucG9vbC5wb3AoKTtcbiAgICAgICAgaWYgKCFjaGlwKSB7XG4gICAgICAgICAgICBjaGlwID0gbmV3IENoaXAodGhpcy5nYW1lLCAwLCAwLCB0aGlzLmtleSwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLnNldENoaXBJbnB1dHMoY2hpcCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMuYWRkQ2hpbGQoY2hpcCk7XG4gICAgICAgIH1cbiAgICAgICAgY2hpcC5yZXZpdmUoKTtcbiAgICAgICAgY2hpcC5wYXJlbnQuYnJpbmdUb1RvcChjaGlwKTtcbiAgICAgICAgdGhpcy5jaGlwcy5wdXNoKGNoaXApO1xuICAgICAgICByZXR1cm4gY2hpcDtcbiAgICB9XG5cbiAgICBzZXRDaGlwSW5wdXRzKGNoaXApIHtcbiAgICAgICAgY2hpcC5ldmVudHMub25JbnB1dE92ZXIucmVtb3ZlQWxsKCk7XG4gICAgICAgIGNoaXAuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCgoKSA9PiB7dGhpcy50b29sdGlwLnZpc2libGUgPSB0cnVlfSk7XG5cbiAgICAgICAgY2hpcC5ldmVudHMub25JbnB1dE91dC5yZW1vdmVBbGwoKTtcbiAgICAgICAgY2hpcC5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4ge3RoaXMudG9vbHRpcC52aXNpYmxlID0gZmFsc2V9KTtcbiAgICB9XG5cbiAgICBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuX3ZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb2xvclVwKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSAtPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSArPSB2YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB5UG9zID0gMDtcbiAgICAgICAgbGV0IHZhbHVlc1B0ciA9IHRoaXMudmFsdWVzLmxlbmd0aCAtIDE7XG4gICAgICAgIHdoaWxlICh2YWx1ZSA+PSAyNSkge1xuICAgICAgICAgICAgd2hpbGUgKHZhbHVlIDwgdGhpcy52YWx1ZXNbdmFsdWVzUHRyXSkge1xuICAgICAgICAgICAgICAgIHZhbHVlc1B0ci0tO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZXNQdHIgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGNoaXAgPSB0aGlzLmdldENoaXAoKTtcbiAgICAgICAgICAgIGNoaXAudmFsdWUgPSB0aGlzLnZhbHVlc1t2YWx1ZXNQdHJdO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5zdGFja0NoaXBzKSB7XG4gICAgICAgICAgICAgICAgY2hpcC55ID0geVBvcztcbiAgICAgICAgICAgICAgICB5UG9zIC09IDU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoaXBzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBjaGlwLnggPSAwO1xuICAgICAgICAgICAgICAgICAgICBjaGlwLnkgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByYW5kUG9zID0gdGhpcy5yYW5kQ2hpcFBvcygpO1xuICAgICAgICAgICAgICAgICAgICBjaGlwLnggPSByYW5kUG9zLng7XG4gICAgICAgICAgICAgICAgICAgIGNoaXAueSA9IHJhbmRQb3MueTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSAtPSB0aGlzLnZhbHVlc1t2YWx1ZXNQdHJdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGxldCBjaGlwO1xuICAgICAgICB3aGlsZSAoY2hpcCA9IHRoaXMuY2hpcHMucG9wKCkpIHtcbiAgICAgICAgICAgIHRoaXMucG9vbC5wdXNoKGNoaXApO1xuICAgICAgICAgICAgY2hpcC5raWxsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhckNoaXAoY2hpcCkge1xuICAgICAgICAvLyBSZW1vdmUgY2hpcCBmcm9tIHRoaXMuY2hpcHMgaWYgZm91bmRcbiAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY2hpcHNbaV0uaWQgPT09IGNoaXAuaWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoaXBzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZm91bmQpIHtcbiAgICAgICAgICAgIHRoaXMucG9vbC5wdXNoKGNoaXApO1xuICAgICAgICAgICAgY2hpcC5raWxsKCk7XG4gICAgICAgICAgICByZXR1cm4gY2hpcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRha2VDaGlwcyhjaGlwcykge1xuICAgICAgICBjaGlwcyA9IGNoaXBzLnNsaWNlKCk7XG4gICAgICAgIGxldCBuZXdDaGlwcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbmV3Q2hpcCA9IHRoaXMudGFrZUNoaXAoY2hpcHNbaV0pO1xuICAgICAgICAgICAgbmV3Q2hpcHMucHVzaChuZXdDaGlwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zZmVyQW5pbWF0aW9uKG5ld0NoaXBzKTtcbiAgICB9XG5cbiAgICB0YWtlQ2hpcChzcmNDaGlwKSB7XG4gICAgICAgIGxldCBuZXdDaGlwID0gdGhpcy5nZXRDaGlwKCk7XG4gICAgICAgIG5ld0NoaXAuY2xvbmUoc3JjQ2hpcCk7XG4gICAgICAgIHRoaXMuc2V0Q2hpcElucHV0cyhuZXdDaGlwKTtcblxuICAgICAgICBzcmNDaGlwLm1hbmFnZXIuY2xlYXJDaGlwKHNyY0NoaXApO1xuXG4gICAgICAgIHRoaXMudmFsdWUgKz0gc3JjQ2hpcC52YWx1ZTtcblxuICAgICAgICByZXR1cm4gbmV3Q2hpcDtcbiAgICB9XG5cbiAgICBhbmltYXRlU3RhY2tUcmFuc2ZlcigpIHtcblxuICAgIH1cblxuICAgIGFuaW1hdGVDaGlwQ2FzY2FkZShjaGlwcykge1xuICAgICAgICBjb25zdCBmaW5pc2hlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG5cbiAgICAgICAgbGV0IGRlbGF5ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNoaXAgPSBjaGlwc1tpXTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoZGVsYXksICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmFuZFBvcyA9IHRoaXMucmFuZENoaXBQb3MoKTtcbiAgICAgICAgICAgICAgICBsZXQgdHdlZW4gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKGNoaXApLnRvKHt4OiByYW5kUG9zLngsIHk6IHJhbmRQb3MueX0sIDIwMCwgUGhhc2VyLkVhc2luZy5RdWFkcmF0aWMuSW5PdXQsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IGNoaXBzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoZmluaXNoZWQuZGlzcGF0Y2gsIGZpbmlzaGVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIGRlbGF5ICs9IDEwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaW5pc2hlZDtcbiAgICB9XG5cbiAgICByYW5kQ2hpcFBvcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMuZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoLXRoaXMucGlsZVJhZGl1cywgdGhpcy5waWxlUmFkaXVzKSxcbiAgICAgICAgICAgIHk6IHRoaXMuZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoLXRoaXMucGlsZVJhZGl1cywgdGhpcy5waWxlUmFkaXVzKVxuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hpcE1hbmFnZXI7XG4iLCJjbGFzcyBFdmVudFJlZ2lzdGVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuZXZlbnRzID0ge307XG4gICAgfVxuXG4gICAgYWRkKGtleSwgc2lnbmFsKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1trZXldKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJUaW1pbmdNYW5hZ2VyIGFscmVhZHkgaGFzIGFuIGV2ZW50IGZvciBrZXkgXCIgKyBrZXkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXZlbnRzW2tleV0gPSBzaWduYWw7XG4gICAgICAgIHNpZ25hbC5hZGQoKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJERUxFVElORyBFVkVOVFwiKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1trZXldO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZXQoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50c1trZXldO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRSZWdpc3RlcjtcbiIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL2NsYXNzZXMvUGxheWVyXCI7XG5cbmNsYXNzIFBsYXllck1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVzZXJJZCwgc2VhdENvbmZpZywgY2hpcENvbmZpZykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgdGhpcy5zZWF0Q29uZmlnID0gc2VhdENvbmZpZztcbiAgICAgICAgdGhpcy5jaGlwQ29uZmlnID0gY2hpcENvbmZpZztcblxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTsgIC8vIERpcmVjdCBhY2Nlc3MgdG8gdGhlIFBsYXllciBvYmplY3RzXG4gICAgICAgIHRoaXMudXNlclBsYXllciA9IG51bGw7ICAvLyBUaGUgdXNlcidzIHBsYXllciBvYmplY3QsIGlmIGF2YWlsYWJsZVxuICAgICAgICB0aGlzLm5leHRQbGF5ZXIgPSBudWxsOyAgLy8gVGhlIHBsYXllciB0aGF0IHRoZSBnYW1lIGV4cGVjdHMgdG8gYWN0IG5leHRcbiAgICAgICAgdGhpcy5kZWFsZXJQbGF5ZXIgPSBudWxsOyAgIC8vIEN1cnJlbnQgaGFuZCdzIGRlYWxlclxuXG4gICAgICAgIC8vIENvbnRhaW5zIGFsbCBkaXNwbGF5IGVsZW1lbnRzIGZvciBhbGwgcGxheWVycyBpbiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBnZXQgbGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKHBsYXllckRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1BsYXllcihwbGF5ZXJEYXRhW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMuZ2FtZSwgdGhpcy5jaGlwQ29uZmlnKTtcbiAgICAgICAgcGxheWVyLmluaXRpYWxpemUocGxheWVyRGF0YSk7XG4gICAgICAgIHBsYXllci5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAueCA9IHRoaXMuc2VhdENvbmZpZ1twbGF5ZXJEYXRhLnNlYXRdLng7XG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAueSA9IHRoaXMuc2VhdENvbmZpZ1twbGF5ZXJEYXRhLnNlYXRdLnk7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHBsYXllci5kaXNwbGF5R3JvdXApO1xuXG4gICAgICAgIGlmIChwbGF5ZXIudXNlcklkID09PSB0aGlzLnVzZXJJZCkge1xuICAgICAgICAgICAgdGhpcy51c2VyUGxheWVyID0gcGxheWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICB9XG5cbiAgICBwbGF5ZXJMZWZ0KHBsYXllckRhdGEpIHtcbiAgICAgICAgbGV0IHBsYXllciA9IHRoaXMuZ2V0QnlJZChwbGF5ZXJEYXRhLmlkKTtcblxuICAgICAgICBpZiAoIXBsYXllcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ291bGQgbm90IGZpbmQgcGxheWVyIGF0IHRhYmxlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheWVyLmRpc3BsYXlHcm91cC5kZXN0cm95KCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldID09PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBsYXllciA9PT0gdGhpcy51c2VyUGxheWVyKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXJQbGF5ZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICB9XG5cbiAgICBnZXRCeUlkKGlkKSB7XG4gICAgICAgIC8vIFRPRE8gLSBEbyB0aGlzIHdpdGhvdXQgaXRlcmF0aW5nIC0tIGJ1aWxkIG1hcCBvbiBpbml0P1xuICAgICAgICAvLyBUT0RPIC0gU2hvdWxkIHRoaXMgZXZlciByZXR1cm4gbnVsbD9cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcnNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxheWVyc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRCeVNlYXQoc2VhdCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcnNbaV0uc2VhdCA9PT0gc2VhdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IGEgbGlzdCBvZiBhbGwgb2NjdXBpZWQgc2VhdHMgYXQgdGhlIHRhYmxlXG4gICAgICogQHJldHVybnMge251bWJlcltdfSAtIFRoZSBJRHMgb2Ygb2NjdXBpZWQgc2VhdHNcbiAgICAgKi9cbiAgICBnZXRPY2N1cGllZFNlYXRzKCkge1xuICAgICAgICBsZXQgb2NjdXBpZWRTZWF0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb2NjdXBpZWRTZWF0cy5wdXNoKHRoaXMucGxheWVyc1tpXS5zZWF0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2NjdXBpZWRTZWF0cztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllck1hbmFnZXI7XG4iLCJjb25zdCBpc1N0cmluZyA9IHZhbCA9PiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbmNvbnN0IGlzQmxvYiA9IHZhbCA9PiB2YWwgaW5zdGFuY2VvZiBCbG9iO1xuXG5wb2x5ZmlsbC5jYWxsKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnID8gd2luZG93IDogdGhpcyB8fCB7fSk7XG5cbmZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICBpZiAoaXNTdXBwb3J0ZWQuY2FsbCh0aGlzKSkgcmV0dXJuO1xuXG4gIGlmICghKCduYXZpZ2F0b3InIGluIHRoaXMpKSB0aGlzLm5hdmlnYXRvciA9IHt9O1xuICB0aGlzLm5hdmlnYXRvci5zZW5kQmVhY29uID0gc2VuZEJlYWNvbi5iaW5kKHRoaXMpO1xufTtcblxuZnVuY3Rpb24gc2VuZEJlYWNvbih1cmwsIGRhdGEpIHtcbiAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50ICYmIHRoaXMuZXZlbnQudHlwZTtcbiAgY29uc3Qgc3luYyA9IGV2ZW50ID09PSAndW5sb2FkJyB8fCBldmVudCA9PT0gJ2JlZm9yZXVubG9hZCc7XG5cbiAgY29uc3QgeGhyID0gKCdYTUxIdHRwUmVxdWVzdCcgaW4gdGhpcykgPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICB4aHIub3BlbignUE9TVCcsIHVybCwgIXN5bmMpO1xuICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICcqLyonKTtcblxuXG4gIGlmIChpc1N0cmluZyhkYXRhKSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jyk7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9ICd0ZXh0L3BsYWluJztcbiAgfSBlbHNlIGlmIChpc0Jsb2IoZGF0YSkgJiYgZGF0YS50eXBlKSB7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsIGRhdGEudHlwZSk7XG4gIH1cblxuICB0cnkge1xuICAgIHhoci5zZW5kKGRhdGEpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc1N1cHBvcnRlZCgpIHtcbiAgcmV0dXJuICgnbmF2aWdhdG9yJyBpbiB0aGlzKSAmJiAoJ3NlbmRCZWFjb24nIGluIHRoaXMubmF2aWdhdG9yKTtcbn0iLCJpbXBvcnQgY29uZmlnIGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCBDb250cm9sbGVyIGZyb20gXCIuLi9jbGFzc2VzL0NvbnRyb2xsZXJcIjtcblxuY2xhc3MgQm9vdCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmluaXRpYWxEYXRhID0gdGhpcy5hdWdtZW50SW5pdGlhbERhdGEoaW5pdGlhbERhdGEpO1xuICAgICAgICB0aGlzLmdhbWUuY29uZmlnID0gY29uZmlnO1xuXG4gICAgICAgIC8vIFRPRE8gLSBUaGlzIHNob3VsZCBjb21lIGZyb20gc29tZXdoZXJlIGR5bmFtaWNcbiAgICAgICAgdGhpcy5nYW1lLnJ1bGVzID0ge1xuICAgICAgICAgICAgYW50ZTogMCxcbiAgICAgICAgICAgIGJsaW5kczoge1xuICAgICAgICAgICAgICAgIHNtYWxsOiAyNSxcbiAgICAgICAgICAgICAgICBiaWc6IDUwXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEucGxheWVySWQsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50b2tlbik7XG5cbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5lbXVsYXRvckVuYWJsZWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5nYW1lID0gdGhpcy5nYW1lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoXCJsb2FkXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBTdW1tYXJ5IENhbGN1bGF0ZSBhZGRpdGlvbmFsIHZhbHVlcyB0byBzdG9yZSBvbiBnYW1lLmluaXRpYWxEYXRhXG4gICAgICpcbiAgICAgKiBUbyBzYXZlIG9uIHNlcnZlci1zaWRlIHByb2Nlc3NpbmcgYW5kIGRhdGEtdHJhbnNmZXIgbG9hZCwgdGhpc1xuICAgICAqIG1ldGhvZCBpcyBhIHBsYWNlIHRvIGdlbmVyYXRlIGFkZGl0aW9uYWwgZGF0YSBuZWVkZWQgYnkgdGhlIGdhbWVcbiAgICAgKiB3aGljaCBtYXkgYmUgZGVyaXZlZCBmcm9tIHRoZSBkYXRhIHNlbnQgZnJvbSB0aGUgYmFjayBlbmQuXG4gICAgICovXG4gICAgYXVnbWVudEluaXRpYWxEYXRhKGluaXRpYWxEYXRhKSB7XG4gICAgICAgIGluaXRpYWxEYXRhLm9jY3VwaWVkU2VhdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbml0aWFsRGF0YS5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpbml0aWFsRGF0YS5vY2N1cGllZFNlYXRzLnB1c2goaW5pdGlhbERhdGEucGxheWVyc1tpXS5zZWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbml0aWFsRGF0YTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvb3Q7IiwiY2xhc3MgTG9hZCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgcHJlbG9hZCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJiYWNrZ3JvdW5kXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYmFja2dyb3VuZC5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwicmVkQ2lyY2xlXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcmVkY2lyY2xlLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImNhcmRzXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcInBhbmVsXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcGFuZWwucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcGFuZWwuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImRlYWxlckJ1dHRvblwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2J1dHRvbi5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9idXR0b24uanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImJ1eUluXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV5aW4ucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV5aW4uanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImNoaXBzXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2hpcHMucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2hpcHMuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcIm5hbWVwbGF0ZVwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL25hbWVwbGF0ZS5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9uYW1lcGxhdGUuanNvblwiKTtcblxuICAgICAgICB0aGlzLmdhbWUudGV4dHVyZXMgPSB0aGlzLmNyZWF0ZUN1c3RvbVRleHR1cmVzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkUGx1Z2lucygpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibWFpblwiKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDdXN0b21UZXh0dXJlcygpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0ge307XG5cbiAgICAgICAgbGV0IGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoNCwgMHgwMDAwMDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgxMDAsIDEwMCwgMTAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlU3F1YXJlXCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgMzAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlUmVjdFwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweDAwMDAwMCwgMC41KTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgdGhpcy5nYW1lLndpZHRoLCB0aGlzLmdhbWUuaGVpZ2h0KTtcbiAgICAgICAgdGV4dHVyZXNbXCJtb2RhbEJhY2tncm91bmRcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweDAwMDAwMCwgMC41KTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgdGhpcy5nYW1lLmNvbmZpZy5wb3B1cC53aWR0aCwgdGhpcy5nYW1lLmNvbmZpZy5wb3B1cC5oZWlnaHQpO1xuICAgICAgICB0ZXh0dXJlc1tcInRleHRVbmRlcmxheVwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgcmV0dXJuIHRleHR1cmVzO1xuICAgIH1cblxuICAgIGxvYWRQbHVnaW5zKCkge1xuICAgICAgICB0aGlzLmdhbWUuYWRkLnBsdWdpbihQaGFzZXJJbnB1dC5QbHVnaW4pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9hZDtcbiIsImltcG9ydCB7QWN0aW9uLCBBY3Rpb25UZXh0fSBmcm9tIFwiLi4vY2xhc3Nlcy9BY3Rpb25cIjtcbmltcG9ydCBCdXlJbk1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0J1eUluTWFuYWdlclwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuaW1wb3J0IERlYWxlckJ1dHRvbiBmcm9tIFwiLi4vY2xhc3Nlcy9EZWFsZXJCdXR0b25cIjtcbmltcG9ydCBFdmVudFJlZ2lzdGVyIGZyb20gXCIuLi9tYW5hZ2Vycy9FdmVudFJlZ2lzdGVyXCI7XG5pbXBvcnQgUGFuZWwgZnJvbSBcIi4uL2NsYXNzZXMvUGFuZWxcIjtcbmltcG9ydCBQbGF5ZXJNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9QbGF5ZXJNYW5hZ2VyXCI7XG5pbXBvcnQgUG90IGZyb20gXCIuLi9jbGFzc2VzL1BvdFwiO1xuaW1wb3J0IFBva2VyIGZyb20gXCIuLi9Qb2tlclwiO1xuaW1wb3J0IFNTRSBmcm9tIFwiLi4vU1NFXCI7XG5pbXBvcnQgVHdlZW5RdWV1ZSBmcm9tIFwiLi4vY2xhc3Nlcy9Ud2VlblF1ZXVlXCI7XG5cbmNsYXNzIE1haW4gZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMudGFibGVfc3NlID0gbmV3IFNTRSh0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZVNTRVVybCk7XG4gICAgICAgIHRoaXMudXNlcl9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnVzZXJTU0VVcmwpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5sb2FkXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmRpc2Nvbm5lY3RCZWFjb24oKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCBcImJhY2tncm91bmRcIik7XG4gICAgICAgIHRoaXMubmV3SGFuZEJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDEwMCwgXCJuZXdcXG5oYW5kXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5uZXdIYW5kKTtcbiAgICAgICAgdGhpcy5kZWFsQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMjIwLCBcImRlYWxcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmRlYWwpO1xuICAgICAgICB0aGlzLmxlYXZlQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMzQwLCBcImxlYXZlXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5sZWF2ZVRhYmxlKTtcbiAgICAgICAgdGhpcy5iYkJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDQ2MCwgXCJCQlwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuYmIpO1xuICAgICAgICB0aGlzLnNiQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgNTgwLCBcIlNCXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5zYik7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMgPSBuZXcgUGxheWVyTWFuYWdlcih0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VySWQsIHRoaXMuZ2FtZS5jb25maWcuc2VhdHMsIHRoaXMuZ2FtZS5jb25maWcuY2hpcHMpO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVycy5pbml0aWFsaXplKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5wbGF5ZXJzLCB0aGlzLmdhbWUuY29uZmlnLnNlYXRzKTtcblxuICAgICAgICB0aGlzLmdhbWUuZGVhbGVyQnV0dG9uID0gbmV3IERlYWxlckJ1dHRvbih0aGlzLmdhbWUpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZCA9IG5ldyBDYXJkTWFuYWdlcih0aGlzLmdhbWUsIHRydWUpO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuaW5pdGlhbGl6ZSg1KTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5zZXRBbGwoXCJ2aXNpYmxlXCIsIHRydWUpO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmFsaWduKC0xLCAxLCB0aGlzLmdhbWUuYm9hcmQuY2FyZFdpZHRoICogMS4yLCAxKTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5jZW50ZXJYID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclg7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLnNldEFsbChcInZpc2libGVcIiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wb3QgPSBuZXcgUG90KHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wb3QuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5jaGlwcy5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYOyAgICAgLy8gVE9ETyAtIFBvc2l0aW9ucyBpbiBjb25maWdcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5jaGlwcy5kaXNwbGF5R3JvdXAuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZIC0gMTQwO1xuXG4gICAgICAgIC8vIFRPRE8gLSBUaGVzZSBzaG91bGQgZ28gc29tZXdoZXJlIGVsc2UuIE1heWJlIGluIFBvdD9cbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbCA9IG5ldyBQYW5lbCh0aGlzLmdhbWUsIFwicGFuZWxcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueCA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLng7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueSA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLnk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5hbHdheXNWaXNpYmxlID0gdGhpcy5nYW1lLmluaXRpYWxEYXRhLmVtdWxhdG9yRW5hYmxlZDtcblxuICAgICAgICB0aGlzLmdhbWUuYnV5SW4gPSBuZXcgQnV5SW5NYW5hZ2VyKHRoaXMuZ2FtZSwgXCJidXlJblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLmluaXRpYWxpemUodGhpcy5nYW1lLmNvbmZpZy5zZWF0cywgdGhpcy5nYW1lLnBsYXllcnMuZ2V0T2NjdXBpZWRTZWF0cygpLCB0aGlzLmdhbWUuY29uZmlnLmJ1eUluTW9kYWwpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uc2V0QnV0dG9uc1Zpc2libGUodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllciA9PT0gbnVsbCk7XG5cbiAgICAgICAgdGhpcy5nYW1lLnF1ZXVlID0gbmV3IFR3ZWVuUXVldWUodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLnJlZ2lzdGVyID0gbmV3IEV2ZW50UmVnaXN0ZXIodGhpcy5nYW1lKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdIYW5kXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3SGFuZDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcGxldGUgPSBwbGF5ZXIuYW5pbWF0ZUZvbGQoKTtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZS5hZGQocGxheWVyLmNhcmRzLnJlc2V0LCBwbGF5ZXIuY2FyZHMpO1xuICAgICAgICAgICAgICAgIHBsYXllci5jaGlwcy5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLmJvYXJkLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZGVhbGVyUGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLmRlYWxlcik7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV07XG4gICAgICAgICAgICAgICAgcGxheWVyLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGlzRGVhbGVyOiBwbGF5ZXIuaWQgPT09IGRhdGEuZGVhbGVyLFxuICAgICAgICAgICAgICAgICAgICBpc05leHQ6IHBsYXllci5pZCA9PT0gZGF0YS5uZXh0LFxuICAgICAgICAgICAgICAgICAgICByb3VuZEJldDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldCgwKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmRlYWxlckJ1dHRvbi5tb3ZlVG9TZWF0KHRoaXMuZ2FtZS5wbGF5ZXJzLmRlYWxlclBsYXllci5zZWF0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiZGVhbFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlYWw6IFwiLCBkYXRhKTtcblxuICAgICAgICAgICAgbGV0IGRlbGF5ID0gMDtcbiAgICAgICAgICAgIGxldCBzZWF0cyA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldE9jY3VwaWVkU2VhdHMoKTtcbiAgICAgICAgICAgIGxldCBzZWF0SW5kZXggPSBzZWF0cy5pbmRleE9mKHRoaXMuZ2FtZS5wbGF5ZXJzLmRlYWxlclBsYXllci5zZWF0KTtcbiAgICAgICAgICAgIHNlYXRJbmRleCA9IChzZWF0SW5kZXggKyAxKSAlIHNlYXRzLmxlbmd0aDsgIC8vIFN0YXJ0IHdpdGggcGxheWVyIHRvIGxlZnQgb2YgZGVhbGVyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnRpbWUuZXZlbnRzLmFkZChkZWxheSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeVNlYXQoc2VhdHNbc2VhdEluZGV4XSkuYW5pbWF0ZURlYWwoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VhdEluZGV4ID0gKHNlYXRJbmRleCArIDEpICUgc2VhdHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgICAgIGRlbGF5ICs9IDIwMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRCZXRzKFBva2VyLmdlbmVyYXRlUmFpc2VzKHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuc21hbGwsIHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuYmlnLCB0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlCZXQoUG9rZXIuZ2V0TWluQmV0KHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0VmlzaWJsZSh0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID09PSB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImVtdWxhdGVEZWFsXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlbXVsYXRlRGVhbDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGxheWVyRGF0YSA9IGRhdGFbaV07XG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQocGxheWVyRGF0YS5wbGF5ZXJJZCkuY2FyZHMuc2V0Q2FyZE5hbWVzKHBsYXllckRhdGEuaG9sZGluZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwibmV3Um91bmRcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdSb3VuZDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnBsYXllcnMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV0udXBkYXRlKHtyb3VuZEJldDogMH0sIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRCZXRzKFBva2VyLmdlbmVyYXRlUmFpc2VzKHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuc21hbGwsIHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuYmlnLCB0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlCZXQoMCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcInJvdW5kQ29tcGxldGVcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJvdW5kQ29tcGxldGU6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIGlmICghZGF0YS5oYW5kQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucG90LmdhdGhlckNoaXBzKHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJhY3Rpb25cIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhY3Rpb246IFwiLCBkYXRhKTtcblxuICAgICAgICAgICAgaWYgKGRhdGEuYWN0aW9uVHlwZSA9PT0gQWN0aW9uLkZPTEQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEucGxheWVySWQpLmFuaW1hdGVGb2xkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5zZXRDYXJkTmFtZXMoZGF0YS5ib2FyZCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLnBsYXllcklkKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgIGJhbGFuY2U6IGRhdGEucGxheWVyQmFsYW5jZSxcbiAgICAgICAgICAgICAgICBpc05leHQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJvdW5kQmV0OiBkYXRhLnBsYXllclJvdW5kQmV0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5wbGF5ZXJJZCkubmFtZXBsYXRlLmZsYXNoKHRoaXMucGFyc2VBY3Rpb25UZXh0KGRhdGEpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KS51cGRhdGUoe2lzTmV4dDogdHJ1ZX0pO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gZGF0YS5yb3VuZEJldDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gZGF0YS5yb3VuZFJhaXNlO1xuXG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KFBva2VyLmdldE1pbkJldCh0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImhhbmRDb21wbGV0ZVwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhhbmRDb21wbGV0ZTogXCIsIGRhdGEpO1xuXG4gICAgICAgICAgICAvLyBUT0RPIC0gSGFuZGxlIHNwbGl0IHBvdHNcbiAgICAgICAgICAgIC8vIGlmIChkYXRhLndpbm5lcnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgLy8gVE9ETyAtIFNwbGl0IHBvdHMgYmVmb3JlIGdldHRpbmcgaGVyZSwgb3RoZXJ3aXNlIHBheXNcbiAgICAgICAgICAgIC8vICAgd2lsbCBiZSBjb3JyZWN0LCBidXQgaXQgd2lsbCBsb29rIGxpa2UgYWxsIG1vbmV5IGdvZXNcbiAgICAgICAgICAgIC8vICAgdG8gb25lIHBsYXllclxuICAgICAgICAgICAgdGhpcy5nYW1lLnBvdC5nYXRoZXJDaGlwcyh0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzKS5hZGQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zaG93ZG93bikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLnNob3dkb3duLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGxheWVyRGF0YSA9IGRhdGEuc2hvd2Rvd25baV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChwbGF5ZXJEYXRhLnBsYXllcklkKS5jYXJkcy5zZXRDYXJkTmFtZXMocGxheWVyRGF0YS5ob2xkaW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBEZWxheSBvbmUgc2Vjb25kIGZvciBlYWNoIHBsYXllciBnb2luZyB0byBzaG93ZG93blxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxheSA9IGRhdGEuc2hvd2Rvd24gPyAxMDAwICogZGF0YS5zaG93ZG93bi5sZW5ndGggOiAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKGRlbGF5LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEud2lubmVyc1swXS5pZCkuY2hpcHMudGFrZUNoaXBzKHRoaXMuZ2FtZS5wb3QuY2hpcHMuY2hpcHMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdQbGF5ZXJcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1BsYXllcjogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV3UGxheWVyKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLm5ld1BsYXllcihkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5idXlJbi5zZXRCdXR0b25zVmlzaWJsZSh0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyID09PSBudWxsKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwicGxheWVyTGVmdFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGxheWVyTGVmdDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMucGxheWVyTGVmdChkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5idXlJbi5wbGF5ZXJMZWZ0KGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnNldEJ1dHRvbnNWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIgPT09IG51bGwpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy51c2VyX3NzZS5hZGRMaXN0ZW5lcihcImRlYWxcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlYWw6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIuY2FyZHMuc2V0Q2FyZE5hbWVzKGRhdGEuaG9sZGluZ3MpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlckxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnByaW1hcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZWNvbmRhcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC50ZXJ0aWFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLmJ1eUluUmVxdWVzdGVkLmFkZCh0aGlzLmdhbWUuY29udHJvbGxlci5qb2luLCB0aGlzLmdhbWUuY29udHJvbGxlcik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSb3V0ZSBhY3Rpb25zIHRvIGNvbnRyb2xsZXIgcmVxdWVzdHNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWN0aW9uIC0gVGhlIGFjdGlvbiB0byBiZSByZXF1ZXN0ZWQsIGRlZmluZWQgaW4gQWN0aW9uLmpzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJldCAtIFRoZSBiZXQgKGlmIGFueSkgdG8gYmUgc2VudCB0byB0aGUgY29udHJvbGxlclxuICAgICAqL1xuICAgIGhhbmRsZUFjdGlvbihhY3Rpb24sIGJldCkge1xuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uRk9MRDpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5mb2xkKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5DSEVDSzpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5jaGVjaygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uQkVUOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmJldChiZXQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJJbnZhbGlkIEFjdGlvbiBUeXBlOiBcIiArIGFjdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBUcmFuc2Zvcm0gYWN0aW9uIGRhdGEgaW50byBtb3JlIGRlc2NyaXB0aXZlIGJldCBzdHJpbmdcbiAgICAgKlxuICAgICAqIEFsbCBiZXRzIGFyZSBiZXRzLCBidXQgc29tZSByZXF1aXJlIG1vcmUgZGVzY3JpcHRpb24gdG8gZm9sbG93IHBva2VyXG4gICAgICogY29udmVudGlvbi4gU3BlY2lmaWNhbGx5LCBhIGJldCB3aGljaCBqdXN0IGVxdWFscyBhbiBleGlzdGluZyBiZXQgaXMgYVxuICAgICAqIGNhbGwsIGFuZCBvbmUgd2hpY2ggaW5jcmVhc2VzIGFuIGV4aXN0aW5nIGJldCBpcyBhIHJhaXNlLlxuICAgICAqXG4gICAgICogTk9URTogVGhpcyBmdW5jdGlvbiBtdXN0IGJlIGNhbGxlZCBCRUZPUkUgdGhlIHN0YXRlJ3MgYHJvdW5kQmV0YCBhbmRcbiAgICAgKiBgcm91bmRSYWlzZWAgdmFyaWFibGVzIGFyZSB1cGRhdGVkLCBhcyB0aGlzIGZ1bmN0aW9uIG11c3QgY29tcGFyZVxuICAgICAqIG5ldyBiZXQgZGF0YSBhZ2FpbnN0IHRoZSBwcmV2aW91cyBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhY3Rpb25EYXRhXG4gICAgICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgdGV4dCB0byBiZSBmbGFzaGVkXG4gICAgICovXG4gICAgcGFyc2VBY3Rpb25UZXh0KGFjdGlvbkRhdGEpIHtcbiAgICAgICAgbGV0IGFjdGlvblRleHQgPSBBY3Rpb25UZXh0W2FjdGlvbkRhdGEuYWN0aW9uVHlwZV07XG4gICAgICAgIGlmIChhY3Rpb25EYXRhLmFjdGlvblR5cGUgPT09IEFjdGlvbi5CRVQpIHtcbiAgICAgICAgICAgIGlmIChhY3Rpb25EYXRhLnBsYXllclJvdW5kQmV0ID09PSB0aGlzLmdhbWUucm91bmRCZXQpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25UZXh0ID0gXCJDQUxMXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbkRhdGEucGxheWVyUm91bmRCZXQgPiB0aGlzLmdhbWUucm91bmRCZXQgJiYgdGhpcy5nYW1lLnJvdW5kQmV0ID4gMCkge1xuICAgICAgICAgICAgICAgIGFjdGlvblRleHQgPSBcIlJBSVNFXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhY3Rpb25EYXRhLnBsYXllckJhbGFuY2UgPT09IDApIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25UZXh0ID0gXCJBTEwgSU5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWN0aW9uVGV4dDtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbi51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBtYWtlQnRuKHgsIHksIHRleHQsIHRleHR1cmUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBidG4gPSB0aGlzLmdhbWUuYWRkLmJ1dHRvbih4LCB5LCB0ZXh0dXJlLCBjYWxsYmFjaywgdGhpcyk7XG4gICAgICAgIGJ0bi5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICBsZXQgYnRuVGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAwLCB0ZXh0KTtcbiAgICAgICAgYnRuVGV4dC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgYnRuLmFkZENoaWxkKGJ0blRleHQpO1xuICAgICAgICBidG4udGV4dCA9IGJ0blRleHQ7XG5cbiAgICAgICAgcmV0dXJuIGJ0bjtcbiAgICB9XG5cbiAgICBkZWFsKCkge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy90YWJsZXMvJyArIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZU5hbWUgKyAnL2RlYWwvJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0YWJsZU5hbWU6IGluaXRpYWxEYXRhLnRhYmxlTmFtZSxcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIG5ld0hhbmQoKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL3RhYmxlcy8nICsgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlTmFtZSArICcvbmV3LWhhbmQvJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0YWJsZU5hbWU6IGluaXRpYWxEYXRhLnRhYmxlTmFtZSxcbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBsZWF2ZVRhYmxlKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5sZWF2ZSgpO1xuICAgIH1cblxuICAgIGJiKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5iYigpO1xuICAgIH07XG5cbiAgICBzYigpIHtcbiAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuc2IoKTtcbiAgICB9O1xuXG4gICAgZ2VuZXJhdGVCZXRzKHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIHJldHVybiBQb2tlci5nZW5lcmF0ZUJldHMoMjUsIDUwLCB0aGlzLmdhbWUucm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgcGxheWVyQmFsYW5jZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYWluO1xuIl19
