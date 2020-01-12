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

},{"./states/Boot":24,"./states/Load":25,"./states/Main":26}],2:[function(require,module,exports){
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
            if (index >= 0 && index <= this.slider.length) {
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

            this.display.dealerButton = this.game.add.sprite(0, 0, "dealerButton");
            this.display.dealerButton.left = this.display.nameplate.left + 5;
            this.display.dealerButton.bottom = this.display.nameplate.bottom - 5;

            this.chips.initializeDisplay();
            this.display.chips = this.chips.displayGroup;
            this.display.chips.x = this.chipConfig[this.seat].x;
            this.display.chips.y = this.chipConfig[this.seat].y;

            this.displayGroup.add(this.chips.displayGroup);
            this.displayGroup.add(this.display.cards);
            this.displayGroup.add(this.display.cardsMask);
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

            this.hideCards();

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
            var _this2 = this;

            this.showCards();

            for (var i = 0; i < this.cards.length; i++) {
                this.game.add.tween(this.cards.cards[i]).to({ x: 0 }, 500, Phaser.Easing.Quartic.Out, true);
            }

            this.game.time.events.add(500, function () {
                _this2.game.add.tween(_this2.display.cards).to({ top: _this2.display.nameplate.top }, 500, Phaser.Easing.Quartic.Out, true);
            }, this);
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

            var delay = 0;

            var _loop = function _loop(i) {
                var player = players[i];
                if (player.chips.chips.length) {
                    _this.game.time.events.add(delay, function () {
                        _this.amount += player.chips.value;
                        _this.chips.takeChips(player.chips.chips);
                    }, _this);
                    delay += 100;
                }
            };

            for (var i = 0; i < players.length; i++) {
                _loop(i);
            }
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

},{"../Util":4,"../classes/Chip":8}],22:[function(require,module,exports){
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

},{"../classes/Player":14}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"../classes/Controller":9,"../config":18}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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
            window.button = this.game.dealerButton;
            console.log(this.game.initialData);
            this.game.dealerButton.inputEnabled = true;
            this.game.dealerButton.input.enableDrag(true);
            this.game.dealerButton.events.onDragStop.add(function (sprite) {
                return console.log({ x: sprite.x, y: sprite.y });
            });

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

            this.registerListeners();

            this.table_sse.addListener("newHand", function (event) {
                var data = JSON.parse(event.data);
                console.log("newHand: ", data);
                _this3.game.board.reset();
                _this3.game.roundBet = 0;
                _this3.game.roundRaise = 0;
                _this3.game.players.dealerPlayer = _this3.game.players.getById(data.dealer);
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
                    _this3.game.players.players[i].update({ roundBet: 0 }, false);
                }
                _this3.game.panel.setBets(_Poker2.default.generateRaises(_this3.game.rules.blinds.small, _this3.game.rules.blinds.big, _this3.game.roundBet, _this3.game.players.nextPlayer.roundBet, _this3.game.roundRaise, _this3.game.players.nextPlayer.balance));
                _this3.game.panel.setSecondaryBet(0);
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

                // NOTE - This is a temporary stopgap
                if (data.winners.length === 1) {
                    // This should be how the code functions -- all winners call
                    // chips.takeChips on a specific pot. If there are multiple
                    // winners, the pot must have already been split into the
                    // appropriate size piles
                    _this3.game.players.getById(data.winners[0].id).chips.takeChips(_this3.game.pot.chips.chips);
                } else {
                    // This is just a temporary overflow measure. If the pot was
                    // split on the back end, don't animate anything, as we aren't
                    // splitting on the front end yet.
                    for (var i = 0; i < data.winners.length; i++) {
                        var winner = data.winners[i];
                        _this3.game.players.getById(winner.id).update({ balance: winner.balance });
                    }
                    _this3.game.pot.chips.clear();
                    for (var _i = 0; _i < _this3.game.players.players.length; _i++) {
                        _this3.game.players.players[_i].chips.clear();
                    }
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

},{"../Poker":2,"../SSE":3,"../classes/Action":5,"../classes/DealerButton":10,"../classes/Panel":13,"../classes/Pot":15,"../classes/TweenQueue":17,"../managers/BuyInManager":19,"../managers/CardManager":20,"../managers/PlayerManager":22}]},{},[1,23])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NoaXAuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQ29udHJvbGxlci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9EZWFsZXJCdXR0b24uanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvTGFiZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvTmFtZXBsYXRlLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BhbmVsLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BsYXllci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9Qb3QuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvU2xpZGVyLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1R3ZWVuUXVldWUuanMiLCJzdGF0aWMvc3JjL2NvbmZpZy5qc29uIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9CdXlJbk1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL0NhcmRNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9DaGlwTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvUGxheWVyTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvcG9seWZpbGxzL3NlbmRiZWFjb24uanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Cb290LmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTG9hZC5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL01haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7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RUFBMkIsS0FBSyxJQUFMLENBQVUsUUFBckMsRUFBK0MsY0FBL0MsRUFBK0QsS0FBSyxJQUFMLENBQVUsVUFBekUsRUFBcUYsYUFBckYsQ0FBUDtBQUNIOzs7O0VBbFRjLE9BQU8sSzs7a0JBcVRYLEkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgQm9vdCBmcm9tIFwiLi9zdGF0ZXMvQm9vdFwiO1xuaW1wb3J0IExvYWQgZnJvbSBcIi4vc3RhdGVzL0xvYWRcIjtcbmltcG9ydCBNYWluIGZyb20gXCIuL3N0YXRlcy9NYWluXCI7XG5cbmNsYXNzIEdhbWUgZXh0ZW5kcyBQaGFzZXIuR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKHtcbiAgICAgICAgICAgIHdpZHRoOiAxOTIwLFxuICAgICAgICAgICAgaGVpZ2h0OiAxMDgwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkKFwiYm9vdFwiLCBCb290LCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc3RhdGUuYWRkKFwibG9hZFwiLCBMb2FkLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc3RhdGUuYWRkKFwibWFpblwiLCBNYWluLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5zdGFydChcImJvb3RcIik7XG4gICAgfVxufVxuXG5uZXcgR2FtZSgpO1xuIiwiLyoqXG4gKiBAc3VtbWFyeSBBIHV0aWxpdHkgY2xhc3Mgb2YgUG9rZXItc3BlY2lmaWMgZnVuY3Rpb25hbGl0eVxuICovXG5jbGFzcyBQb2tlciB7XG4gICAgLy8gVE9ETyAtIFRoaXMgdXRpbGl0eSBpcyBoaWdobHktc3BlY2lmaWMgdG8gTkwgZ2FtZXMsIG1heWJlIGV2ZW4gdG8gTkxIRS5cbiAgICAvLyAgTmVlZCB0byBtYWtlIGl0IG1vcmUgZ2VuZXJpYyBldmVudHVhbGx5IHRvIGFsbG93IGZvciBvdGhlciBnYW1lXG4gICAgLy8gIHR5cGVzLiBMaW1pdCBhbmQgcG90LWxpbWl0IGdhbWVzIHdpbGwgd29yayBjb21wbGV0ZWx5IGRpZmZlcmVudGx5LlxuICAgIC8vICBBbnRlcyBhcmUgYWxzbyBub3Qgc3VwcG9ydGVkLlxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2VuZXJhdGUgYWxsIGxlZ2FsIHJhaXNlcyBmb3IgcGxheWVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNtYWxsQmxpbmQgLSBUaGUgc21hbGwgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJpZ0JsaW5kIC0gVGhlIGJpZyBibGluZCBmb3IgdGhlIGdhbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm91bmRCZXQgLSBUaGUgbGVhZGluZyBiZXQgZm9yIHRoaXMgYmV0dGluZyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJSb3VuZEJldCAtIFRoZSBhbW91bnQgdGhpcyBwbGF5ZXIgaGFzIGNvbnRyaWJ1dGVkIHRvIHRoZSBwb3Qgc28gZmFyIHRoaXMgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJldlJhaXNlIC0gVGhlIGFtb3VudCB0aGUgcHJldmlvdXMgcmFpc2UgaW5jcmVhc2VkIHRoZSBiZXRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyQmFsYW5jZSAtIFRoZSBhbW91bnQgdGhlIHBsYXllciBoYXMgYXZhaWxhYmxlIHRvIGJldFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gLSBUaGUgdmFsaWQgcmFpc2VzXG4gICAgICovXG4gICAgc3RhdGljIGdlbmVyYXRlUmFpc2VzKHNtYWxsQmxpbmQsIGJpZ0JsaW5kLCByb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHByZXZSYWlzZSwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICBsZXQgcmFpc2UgPSBQb2tlci5nZXRNaW5SYWlzZShiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpO1xuICAgICAgICBsZXQgcmFpc2VzID0gW3JhaXNlXTtcblxuICAgICAgICB3aGlsZSAocmFpc2UgKyBzbWFsbEJsaW5kIDw9IHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgICAgIHJhaXNlICs9IHNtYWxsQmxpbmQ7XG4gICAgICAgICAgICByYWlzZXMucHVzaChyYWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmFpc2UgPCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgICAgICByYWlzZXMucHVzaChwbGF5ZXJCYWxhbmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByYWlzZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IHRoZSBtaW5pbXVtIGFsbG93YWJsZSBiZXQgZm9yIHBsYXllclxuICAgICAqXG4gICAgICogSWYgbm8gYmV0cyBoYXZlIG9jY3VycmVkIGluIGN1cnJlbnQgcm91bmQsIHRoZSBtaW4gYmV0IGlzIGFcbiAgICAgKiBjaGVjayAoYmV0IG9mIDApLCBvdGhlcndpc2UgaXQncyBhIGNhbGwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm91bmRCZXQgLSBUaGUgbGVhZGluZyBiZXQgZm9yIHRoaXMgYmV0dGluZyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJSb3VuZEJldCAtIFRoZSBhbW91bnQgdGhpcyBwbGF5ZXIgaGFzIGNvbnRyaWJ1dGVkIHRvIHRoZSBwb3Qgc28gZmFyIHRoaXMgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyQmFsYW5jZSAtIFRoZSBhbW91bnQgdGhlIHBsYXllciBoYXMgYXZhaWxhYmxlIHRvIGJldFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldE1pbkJldChyb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IG1pbkJldCA9IHJvdW5kQmV0ID09PSAwID8gMCA6IHJvdW5kQmV0IC0gcGxheWVyUm91bmRCZXQ7XG4gICAgICAgIGlmIChwbGF5ZXJCYWxhbmNlIDwgbWluQmV0KSB7XG4gICAgICAgICAgICBtaW5CZXQgPSBwbGF5ZXJCYWxhbmNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW5CZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IHRoZSBtaW5pbXVtIGFsbG93YWJsZSByYWlzZSBmb3IgcGxheWVyXG4gICAgICpcbiAgICAgKiBOT1RFOiBBIHJhaXNlIGhlcmUgbWF5IGFjdHVhbGx5IG1lYW4gYSBiZXQgaW4gcG9rZXIgdGVybXMuIEluIHRoZVxuICAgICAqIHBhcmxhbmNlIG9mIHRoaXMgdXRpbGl0eSwgYSByYWlzZSBpcyBhbiBhZ2dyZXNzaXZlIGFjdGlvbiwgb3Igc29tZXRoaW5nXG4gICAgICogd2hpY2ggd291bGQgZm9yY2Ugb3RoZXIgcGxheWVycyB0byBjb250cmlidXRlIG1vcmUgdG8gdGhlIHBvdCB0aGFuXG4gICAgICogdGhlIG90aGVyd2lzZSB3b3VsZCBoYXZlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJpZ0JsaW5kIC0gVGhlIGJpZyBibGluZCBmb3IgdGhlIGdhbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm91bmRCZXQgLSBUaGUgbGVhZGluZyBiZXQgZm9yIHRoaXMgYmV0dGluZyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJSb3VuZEJldCAtIFRoZSBhbW91bnQgdGhpcyBwbGF5ZXIgaGFzIGNvbnRyaWJ1dGVkIHRvIHRoZSBwb3Qgc28gZmFyIHRoaXMgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJldlJhaXNlIC0gVGhlIGFtb3VudCB0aGUgcHJldmlvdXMgcmFpc2UgaW5jcmVhc2VkIHRoZSBiZXRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyQmFsYW5jZSAtIFRoZSBhbW91bnQgdGhlIHBsYXllciBoYXMgYXZhaWxhYmxlIHRvIGJldFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldE1pblJhaXNlKGJpZ0JsaW5kLCByb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHByZXZSYWlzZSwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICBsZXQgbWluUmFpc2UgPSByb3VuZEJldCA9PT0gMCA/IGJpZ0JsaW5kIDogcm91bmRCZXQgLSBwbGF5ZXJSb3VuZEJldCArIHByZXZSYWlzZTtcbiAgICAgICAgaWYgKHBsYXllckJhbGFuY2UgPCBtaW5SYWlzZSkge1xuICAgICAgICAgICAgbWluUmFpc2UgPSBwbGF5ZXJCYWxhbmNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW5SYWlzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBva2VyOyIsImNsYXNzIFNTRSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgdXJsKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSh0aGlzLnVybCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgUmUgYWRkcyBhbGwgbGlzdGVuZXJzIHRvIHRoaXMuc291cmNlXG4gICAgICpcbiAgICAgKiBJIG9yaWdpbmFsbHkgd3JvdGUgdGhpcyB0byBzdXBwb3J0IGNsaWVudCByZWNvbm5lY3RzLCBidXQgSSBkb24ndCBuZWVkXG4gICAgICogdGhhdCBhbnltb3JlLiBLZWVwaW5nIHRoZSBsaXN0ZW5lciBjb2RlIGp1c3QgaW4gY2FzZS5cbiAgICAgKi9cbiAgICByZUFkZEFsbExpc3RlbmVycygpIHtcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzO1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihsaXN0ZW5lci50eXBlLCBsaXN0ZW5lci5jYWxsYmFjaywgbGlzdGVuZXIuY2FsbGJhY2tDb250ZXh0LCAuLi5saXN0ZW5lci5hcmdzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gU3RvcmUgbGlzdGVuZXJzIGZvciBldmVudHVhbCByZWNvbm5lY3RcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMucHVzaCh7XG4gICAgICAgICAgICBcInR5cGVcIjogdHlwZSxcbiAgICAgICAgICAgIFwiY2FsbGJhY2tcIjogY2FsbGJhY2ssXG4gICAgICAgICAgICBcImNhbGxiYWNrQ29udGV4dFwiOiBjYWxsYmFja0NvbnRleHQsXG4gICAgICAgICAgICBcImFyZ3NcIjogYXJnc1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNvdXJjZS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjYWxsYmFja0NvbnRleHQsIC4uLmFyZ3MsIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTU0U7IiwiY2xhc3MgVXRpbCB7XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgUmV0dXJuIGEgZm9ybWF0dGVkIGN1cnJlbmN5IHN0cmluZyBmcm9tIGFuIGludGVnZXJcbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2VDdXJyZW5jeShpbnQpIHtcbiAgICAgICAgbGV0IHZhbCA9IGludCAvIDEwMDtcbiAgICAgICAgcmV0dXJuIFwiJFwiICsgdmFsLnRvRml4ZWQoMik7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVdGlsOyIsImNvbnN0IEFjdGlvbiA9IHtcbiAgICBCTElORDogMCxcbiAgICBGT0xEOiAxLFxuICAgIENIRUNLOiAyLFxuICAgIEJFVDogM1xufTtcblxuY29uc3QgQWN0aW9uVGV4dCA9IHtcbiAgICAwOiBcIkJMSU5EXCIsXG4gICAgMTogXCJGT0xEXCIsXG4gICAgMjogXCJDSEVDS1wiLFxuICAgIDM6IFwiQkVUXCJcbn07XG5cbmV4cG9ydCB7QWN0aW9uLCBBY3Rpb25UZXh0fTsiLCIvKipcbiAqIEEgUGhhc2VyLkJ1dHRvbiB3aXRoIGEgUGhhc2VyLlRleHQgY2VudGVyZWQgb24gdGhlIGJ1dHRvblxuICpcbiAqIFRoaXMgY2xhc3MgaXMgbWVyZWx5IGEgdGhpbiB3cmFwcGVyIGFyb3VuZCBQaGFzZXIuQnV0dG9uIHRvIGFsbG93IGZvclxuICogZWFzeSB1c2Ugb2YgYSB0ZXh0IGxhYmVsIG9uIHRoZSBidXR0b24uIFRoZSB0ZXh0IGlzIGEgY2hpbGQgb2YgdGhlIGJ1dHRvbixcbiAqIHNvIGl0IG1vdmVzIHdoZW4gdGhlIGJ1dHRvbiBtb3Zlcy4gSXQncyBjZW50ZXJlZCBvbiB0aGUgYnV0dG9uIGFuZCBzY2FsZXNcbiAqIGF1dG9tYXRpY2FsbHkgdG8gZml4IHdpdGhpbiB0aGUgYnV0dG9uJ3MgYm91bmRzLlxuICpcbiAqIElmIG5vbmUgb2YgdGhlIGxhYmVsIGZ1bmN0aW9uYWxpdHkgaXMgdXNlZCwgdGhpcyBjbGFzcyBpcyBpZGVudGljYWwgdG9cbiAqIFBoYXNlci5CdXR0b24uXG4gKi9cbmNsYXNzIEJ1dHRvbiBleHRlbmRzIFBoYXNlci5CdXR0b24ge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGtleSwgY2FsbGJhY2ssIGNhbGxiYWNrY29udGV4dCwgb3ZlckZyYW1lLCBvdXRGcmFtZSwgZG93bkZyYW1lLCB1cEZyYW1lKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSwgY2FsbGJhY2ssIGNhbGxiYWNrY29udGV4dCwgb3ZlckZyYW1lLCBvdXRGcmFtZSwgZG93bkZyYW1lLCB1cEZyYW1lKTtcblxuICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhYmVsUGFkZGluZyA9IDEwO1xuICAgICAgICB0aGlzLmxhYmVsVGV4dCA9IFwiXCI7XG4gICAgICAgIHRoaXMubGFiZWxTdHlsZSA9IHt9O1xuICAgICAgICB0aGlzLmxhYmVsID0gbmV3IFBoYXNlci5UZXh0KHRoaXMuZ2FtZSwgMCwgMCwgdGhpcy5sYWJlbFRleHQpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMubGFiZWwpO1xuXG4gICAgICAgIC8vIE11c3QgYWRkIHRvIGdhbWUgd29ybGQgbWFudWFsbHkgaWYgbm90IHVzaW5nIGdhbWUuYWRkLmJ1dHRvblxuICAgICAgICB0aGlzLmdhbWUud29ybGQuYWRkKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgdGV4dCBkaXNwbGF5ZWQgb24gdGhlIGJ1dHRvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gZGlzcGxheVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSBkaXNwbGF5IHVwZGF0ZSBkZXNwaXRlIG9mIHRoaXMuZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRUZXh0KHRleHQsIGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5sYWJlbFRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHN0eWxlIGZvciB0aGUgYnV0dG9uIHRleHRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgLSBUaGUgdGV4dCBzdHlsZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0VGV4dFN0eWxlKHN0eWxlLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxTdHlsZSA9IHN0eWxlO1xuICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHBhZGRpbmcgYmV0d2VlbiB0aGUgdGV4dCBhbmQgdGhlIGJ1dHRvbiBwZXJpbWV0ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFkZGluZyAtIFRoZSBwYWRkaW5nIGluIHBpeGVsc1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSBkaXNwbGF5IHVwZGF0ZSBkZXNwaXRlIG9mIHRoaXMuZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRQYWRkaW5nKHBhZGRpbmcsIGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSBwYWRkaW5nO1xuICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSB0aGUgYnV0dG9uXG4gICAgICogT24gZGlzYWJsZSwgZGlzYWJsZXMgYWxsIGlucHV0IHRvIHRoZSBidXR0b24gYW5kIHJlbmRlcnMgaXQgZ3JheWVkXG4gICAgICogb3V0LiBBbGwgdXBkYXRlcyBhcmUgZGVsYXllZCB1bnRpbCByZS1lbmFibGUsIHVubGVzcyBmb3JjZWQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gRW5hYmxlIG9yIGRpc2FibGUgYnV0dG9uP1xuICAgICAqL1xuICAgIHNldEVuYWJsZWQoZW5hYmxlZCkge1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgIGxldCB0aW50ID0gZW5hYmxlZCA/IDB4RkZGRkZGIDogMHg4MDgwODA7XG4gICAgICAgIHRoaXMudGludCA9IHRpbnQ7XG4gICAgICAgIHRoaXMubGFiZWwudGludCA9IHRpbnQ7XG5cbiAgICAgICAgLy8gVXBkYXRlIG9uIHJlLWVuYWJsZVxuICAgICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVMYWJlbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVXBkYXRlIGFsbCBidXR0b24gYXR0cmlidXRlcyB0byBjdXJyZW50IHByb3BlcnRpZXNcbiAgICAgKlxuICAgICAqIElmIHRoZSBidXR0b24gaXMgZGlzYWJsZWQsIHRoaXMgd2lsbCBoYXZlIG5vIGVmZmVjdC4gVGhlXG4gICAgICogZGV2ZWxvcGVyIG1heSBvcHRpb25hbGx5IGNob29zZSB0byBmb3JjZSB0aGUgdXBkYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIHRoZSB1cGRhdGU/XG4gICAgICovXG4gICAgdXBkYXRlTGFiZWwoZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICBpZiAodGhpcy5lbmFibGVkIHx8IGZvcmNlKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnRleHQgPSB0aGlzLmxhYmVsVGV4dDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2V0U3R5bGUodGhpcy5sYWJlbFN0eWxlKTtcbiAgICAgICAgICAgIHRoaXMucmVQb3NMYWJlbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2NhbGUgbGFiZWwgdGV4dCB0byBmaXQgb24gYnV0dG9uIGFuZCBjZW50ZXJcbiAgICAgKi9cbiAgICByZVBvc0xhYmVsKCkge1xuICAgICAgICB0aGlzLmxhYmVsLnNjYWxlLnNldFRvKDEpO1xuICAgICAgICBjb25zdCB0ZXh0QXJlYUggPSB0aGlzLndpZHRoIC0gdGhpcy5sYWJlbFBhZGRpbmcgKiAyO1xuICAgICAgICBjb25zdCB0ZXh0QXJlYVYgPSB0aGlzLmhlaWdodCAtIHRoaXMubGFiZWxQYWRkaW5nICogMjtcbiAgICAgICAgaWYgKHRoaXMubGFiZWwud2lkdGggPiB0ZXh0QXJlYUggfHwgdGhpcy5sYWJlbC5oZWlnaHQgPiB0ZXh0QXJlYVYpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlZHVjZWRTY2FsZUggPSB0ZXh0QXJlYUggLyB0aGlzLmxhYmVsLndpZHRoO1xuICAgICAgICAgICAgY29uc3QgcmVkdWNlZFNjYWxlViA9IHRleHRBcmVhViAvIHRoaXMubGFiZWwuaGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5zY2FsZS5zZXRUbyhNYXRoLm1pbihyZWR1Y2VkU2NhbGVILCByZWR1Y2VkU2NhbGVWKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYWJlbC5jZW50ZXJYID0gdGhpcy53aWR0aCAvIDI7XG4gICAgICAgIHRoaXMubGFiZWwuY2VudGVyWSA9IHRoaXMuaGVpZ2h0IC8gMjtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnV0dG9uOyIsImNsYXNzIENhcmQgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIG1hbmFnZXIsIGF1dG9IaWRlID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwga2V5KTtcbiAgICAgICAgZ2FtZS53b3JsZC5hZGQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG5cbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDsgIC8vIFN0cmluZyBJRCBvZiBjYXJkLCBlLmcuICdLaCcgb3IgJzdzJ1xuICAgICAgICB0aGlzLmF1dG9IaWRlID0gYXV0b0hpZGU7XG5cbiAgICAgICAgdGhpcy5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKGRhdGEpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmZyYW1lTmFtZSA9IHRoaXMubmFtZSA/IHRoaXMubmFtZSA6IFwiYmFja1wiO1xuXG4gICAgICAgIC8vIEF1dG8taGlkZSBmYWNlIGRvd24gY2FyZHMsIGlmIGZsYWcgc2V0XG4gICAgICAgIC8vIFRoaXMgd2lsbCBjYXVzZSBwcm9ibGVtcyBpZiBtYW51YWxseSBoaWRpbmcgYW5kIHNob3dpbmdcbiAgICAgICAgLy8gY2FyZHMuIEUuZy4gbWFudWFsbHkgc2V0IGNhcmQgdG8gaGlkZGVuIGV2ZW4gdGhvdWdoIGl0IGhhc1xuICAgICAgICAvLyBhIHRydXRoeSBgbmFtZWAgcHJvcGVydHksIHRoZW4gY2FsbCBpdCB3aWxsIGJlY29tZSB2aXNpYmxlXG4gICAgICAgIC8vIGFnYWluIHdoZW4gdXBkYXRlRGlzcGxheSBpcyBjYWxsZWQgaWYgYGF1dG9IaWRlYCBpcyB0cnVlLlxuICAgICAgICB0aGlzLnZpc2libGUgPSAhdGhpcy5hdXRvSGlkZSB8fCB0aGlzLm5hbWU7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXJkO1xuIiwiY2xhc3MgQ2hpcCBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGtleSwgbWFuYWdlcikge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXkpO1xuICAgICAgICBnYW1lLndvcmxkLmFkZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcblxuICAgICAgICB0aGlzLmlkID0gKytDaGlwLmNvdW50ZXI7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gMDtcbiAgICAgICAgdGhpcy5hbmdsZSA9IDA7XG5cbiAgICAgICAgdGhpcy5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnJvdGF0ZVJhbmRvbSgpO1xuICAgIH1cblxuICAgIHNldCB2YWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmZyYW1lTmFtZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG4gICAgfVxuXG4gICAgY2xvbmUoY2hpcCkge1xuICAgICAgICB0aGlzLnggPSBjaGlwLndvcmxkUG9zaXRpb24ueCAtIHRoaXMucGFyZW50LndvcmxkUG9zaXRpb24ueDtcbiAgICAgICAgdGhpcy55ID0gY2hpcC53b3JsZFBvc2l0aW9uLnkgLSB0aGlzLnBhcmVudC53b3JsZFBvc2l0aW9uLnk7XG4gICAgICAgIHRoaXMua2V5ID0gY2hpcC5rZXk7XG4gICAgICAgIHRoaXMuYW5nbGUgPSBjaGlwLmFuZ2xlO1xuICAgICAgICB0aGlzLnZhbHVlID0gY2hpcC52YWx1ZTtcbiAgICB9XG5cbiAgICByb3RhdGVSYW5kb20oKSB7XG4gICAgICAgIHRoaXMuYW5nbGUgPSB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKC0xODAsIDE4MCk7XG4gICAgfVxufVxuXG5DaGlwLmNvdW50ZXIgPSAwO1xuXG5leHBvcnQgZGVmYXVsdCBDaGlwOyIsImNsYXNzIENvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHBsYXllcklkLCB0b2tlbikge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnBsYXllcklkID0gcGxheWVySWQ7XG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIGFjY2VzcyB0b2tlbiB1c2VkIHRvIGF1dGhlbnRpY2F0ZSBvbiBBUEkgY2FsbHNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUaGUgRmxhc2stSldULUV4dGVuZGVkIGFjY2VzcyB0b2tlblxuICAgICAqL1xuICAgIHNldFRva2VuKHRva2VuKSB7XG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgICpcbiAgICAgKiBPbmx5IGVycm9ycyBhcmUgcmVwb3J0ZWQuIFN1Y2Nlc3MgaXMgc2lsZW50LiBHYW1lIGNoYW5nZXMgcmVzdWx0aW5nXG4gICAgICogZnJvbSByZXF1ZXN0cyBhcmUgaGFuZGxlZCB2aWEgU2VydmVyIFNlbnQgRXZlbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVuZHBvaW50IC0gVGhlIGVuZHBvaW50IG9uIHRoZSBzZXJ2ZXIgdG8gc2VuZCByZXF1ZXN0IHRvXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgLSBUaGUgcGF5bG9hZCB0byBzZW5kXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFttZXRob2Q9XCJQT1NUXSAtIFRoZSBIVFRQIG1ldGhvZCB0byB1c2VcbiAgICAgKi9cbiAgICBzZW5kUmVxdWVzdChlbmRwb2ludCwgZGF0YSwgbWV0aG9kID0gXCJQT1NUXCIpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbihtZXRob2QsIGVuZHBvaW50KTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCAmJiB4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzcCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgLy8gSW52YWxpZCByZXF1ZXN0IGVycm9yXG4gICAgICAgICAgICAgICAgaWYgKHJlc3Auc3VjY2VzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKHJlc3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRmFpbGVkIHJlcXVlc3QgZXJyb3JcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyB0aGlzLnRva2VuKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYW4gYWN0aW9uIHJlcXVlc3RcbiAgICAgKlxuICAgICAqIFRoaXMgaXMgdGhlIG1vc3QgaGVhdmlseS11c2VkIHJlcXVlc3QgdHlwZSBpbiB0aGUgZ2FtZS4gQWxsIGluLWdhbWVcbiAgICAgKiBhY3Rpb25zIChiZXQsIGNoZWNrLCBmb2xkKSBoYXBwZW4gaGVyZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gVGhlIHBheWxvYWQgdG8gc2VuZFxuICAgICAqL1xuICAgIGFjdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJhY3Rpb25cIik7XG4gICAgICAgIHRoaXMuc2VuZFJlcXVlc3QodXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBjaGVjaygpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQ0hFQ0tcIik7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGJldChhbXQpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkVUXCIsIGFtdCk7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGZvbGQoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkZPTERcIik7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGJiKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJCTElORFwiLCA1MCk7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIHNiKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJCTElORFwiLCAyNSk7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGpvaW4oc2VhdE51bSwgYnV5SW4pIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcInBvc2l0aW9uXCI6IHNlYXROdW0sIFwiYW1vdW50XCI6IGJ1eUlufTtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImpvaW5cIik7XG4gICAgICAgIHRoaXMuc2VuZFJlcXVlc3QodXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBsZWF2ZSgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwibGVhdmVcIik7XG4gICAgICAgIHRoaXMuc2VuZFJlcXVlc3QodXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGEgYmVhY29uIHRvIHRoZSBzZXJ2ZXIgb24gZGlzY29ubmVjdFxuICAgICAqXG4gICAgICogVGhpcyBhbGxvd3MgZm9yIHNlcnZlciB0byBrbm93IHdoZW4gYSBjbGllbnQgZGlzY29ubmVjdHMgc29cbiAgICAgKiBpdCBjYW4gY2xlYW4gdXAgYXMgbmVjZXNzYXJ5LiBObyBndWFyYW50ZWUgdGhhdCB0aGlzIG1lc3NhZ2VcbiAgICAgKiB3aWxsIGdvIHRocm91Z2gsIHNvIG11c3QgaGF2ZSByZWR1bmRhbnQgbWVhc3VyZXMgaW4gcGxhY2UuXG4gICAgICovXG4gICAgZGlzY29ubmVjdEJlYWNvbigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICBjb25zdCB1cmwgPSBcIi9kaXNjb25uZWN0L1wiO1xuICAgICAgICBuYXZpZ2F0b3Iuc2VuZEJlYWNvbih1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGJ1aWxkUGF5bG9hZChhY3Rpb25UeXBlLCBiZXRBbXQgPSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcInBsYXllcklkXCI6IHRoaXMucGxheWVySWQsXG4gICAgICAgICAgICBcImFjdGlvblR5cGVcIjogYWN0aW9uVHlwZSxcbiAgICAgICAgICAgIFwiYmV0QW10XCI6IGJldEFtdFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYnVpbGRVcmwoZW5kcG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZVVybCArIGVuZHBvaW50ICsgXCIvXCI7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyO1xuIiwiY29uc3QgQlVUVE9OX1NUWUxFUyA9IHtcbiAgICBQTEFJTjogMCxcbiAgICBMRVRURVI6IDEsXG4gICAgVEVYVDogMlxufTtcblxuY2xhc3MgRGVhbGVyQnV0dG9uIGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwga2V5LCBjb25maWcpIHtcbiAgICAgICAga2V5ID0ga2V5IHx8IFwiZGVhbGVyQnV0dG9uXCI7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSk7XG4gICAgICAgIGdhbWUud29ybGQuYWRkKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZyB8fCB0aGlzLmdhbWUuY29uZmlnLmRlYWxlckJ1dHRvbjtcblxuICAgICAgICB0aGlzLl9zZWF0ID0gMDtcbiAgICAgICAgdGhpcy5mcmFtZSA9IEJVVFRPTl9TVFlMRVMuVEVYVDtcblxuICAgICAgICB0aGlzLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLnNlYXQgPSAwO1xuICAgIH1cblxuICAgIHNldCBzZWF0KHNlYXROdW0pIHtcbiAgICAgICAgdGhpcy5fc2VhdCA9IHNlYXROdW07XG4gICAgICAgIHRoaXMueCA9IHRoaXMuY29uZmlnW3NlYXROdW1dLng7XG4gICAgICAgIHRoaXMueSA9IHRoaXMuY29uZmlnW3NlYXROdW1dLnk7XG4gICAgfVxuXG4gICAgbW92ZVRvU2VhdChzZWF0TnVtKSB7XG4gICAgICAgIGNvbnN0IHggPSB0aGlzLmNvbmZpZ1tzZWF0TnVtXS54O1xuICAgICAgICBjb25zdCB5ID0gdGhpcy5jb25maWdbc2VhdE51bV0ueTtcblxuICAgICAgICB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMpLnRvKHt4OiB4LCB5OiB5fSwgNTAwLCBQaGFzZXIuRWFzaW5nLlF1YWRyYXRpYy5Jbk91dCwgdHJ1ZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBEZWFsZXJCdXR0b247XG4iLCIvKipcbiAqIEBzdW1tYXJ5IFNpbXBsZSBQaGFzZXIuVGV4dCBleHRlbnN0aW9uIHRvIHN1cHBvcnQgYXV0b21hdGljIHJlc2l6aW5nXG4gKlxuICogSWYgdGV4dCBib3VuZHMgYXJlIHNldCBvbiBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzcywgdGhlbiBlYWNoIHRpbWUgdGhlIHRleHRcbiAqIG9yIHN0eWxlIGlzIGNoYW5nZWQsIHRoZSB0ZXh0IHdpbGwgYXV0b21hdGljYWxseSBzY2FsZSBpdHNlbGYgZG93biB0byBmaXRcbiAqIHdpdGhpbiB0aG9zZSBib3VuZHMgaG9yaXpvbnRhbGx5LiBWZXJ0aWNhbCBib3VuZHMgYXJlIGlnbm9yZWQuXG4gKlxuICogUG9zc2libGUgdXBncmFkZXM6XG4gKiAgIC0gU2V0IG1pbmltdW0gc2NhbGVcbiAqICAgLSBJZiB0ZXh0IHN0aWxsIG92ZXJmbG93cyBtaW4gc2NhbGUsIHRoZW4gdHJ1bmNhdGVcbiAqL1xuY2xhc3MgTGFiZWwgZXh0ZW5kcyBQaGFzZXIuVGV4dCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwgdGV4dCwgc3R5bGUpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwgdGV4dCwgc3R5bGUpO1xuICAgICAgICB0aGlzLmFuY2hvci5zZXRUbygwLCAwLjUpOyAgLy8gQ2VudGVyIHZlcnRpY2FsbHkgdG8gYXZvaWQganVtcHMgb24gcmVzaXplXG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuXG4gICAgc2V0VGV4dCh0ZXh0LCBpbW1lZGlhdGUpIHtcbiAgICAgICAgc3VwZXIuc2V0VGV4dCh0ZXh0LCBpbW1lZGlhdGUpO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIHNldFN0eWxlKHN0eWxlLCB1cGRhdGUpIHtcbiAgICAgICAgc3VwZXIuc2V0U3R5bGUoc3R5bGUsIHVwZGF0ZSk7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgUmVzaXplIHRoZSB0ZXh0IGhvcml6b250YWxseVxuICAgICAqXG4gICAgICogSWYgdGV4dCBkb2VzIG5vdCBmaXQgaG9yaXpvbnRhbGx5IGF0IGZ1bGwgc2NhbGUsIHRoZW4gc2NhbGUgZG93blxuICAgICAqIHVudGlsIGl0IGZpdHMuIFZlcnRpY2FsIG92ZXJmbG93IGlzIGlnbm9yZWQuXG4gICAgICovXG4gICAgcmVzaXplKCkge1xuICAgICAgICBpZiAoIXRoaXMudGV4dEJvdW5kcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NhbGUuc2V0VG8oMSk7XG4gICAgICAgIGlmICh0aGlzLndpZHRoID4gdGhpcy50ZXh0Qm91bmRzLndpZHRoKSB7XG4gICAgICAgICAgICB0aGlzLnNjYWxlLnNldFRvKHRoaXMudGV4dEJvdW5kcy53aWR0aCAvIHRoaXMud2lkdGgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMYWJlbDsiLCJpbXBvcnQgTGFiZWwgZnJvbSBcIi4vTGFiZWxcIjtcbmltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5cbmNsYXNzIE5hbWVwbGF0ZSBleHRlbmRzIFBoYXNlci5JbWFnZSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwga2V5LCBjb25maWcpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwga2V5KTtcbiAgICAgICAgZ2FtZS53b3JsZC5hZGQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnIHx8IHRoaXMuZ2FtZS5jb25maWcubmFtZXBsYXRlO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcbiAgICAgICAgICAgIG5hbWVwbGF0ZTogbnVsbCxcbiAgICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgICBiYWxhbmNlOiBudWxsLFxuICAgICAgICAgICAgZmxhc2g6IG51bGxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzZXQgbmFtZShuYW1lKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnNldFRleHQobmFtZSk7XG4gICAgfVxuXG4gICAgc2V0IGJhbGFuY2UoYmFsYW5jZSkge1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS5zZXRUZXh0KFV0aWwucGFyc2VDdXJyZW5jeShiYWxhbmNlKSk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lID0gbmV3IExhYmVsKHRoaXMuZ2FtZSwgdGhpcy5jb25maWcubmFtZS54LCB0aGlzLmNvbmZpZy5uYW1lLnksIFwiXCIsIHRoaXMuY29uZmlnLm5hbWUuc3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS5zZXRUZXh0Qm91bmRzKDAsIDAsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggLSAyMCwgMCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5kaXNwbGF5Lm5hbWUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlID0gbmV3IExhYmVsKHRoaXMuZ2FtZSwgdGhpcy5jb25maWcuYmFsYW5jZS54LCB0aGlzLmNvbmZpZy5iYWxhbmNlLnksIFwiXCIsIHRoaXMuY29uZmlnLmJhbGFuY2Uuc3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS5zZXRUZXh0Qm91bmRzKDAsIDAsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggLSAyMCwgMCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmJhbGFuY2UpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaCA9IG5ldyBMYWJlbCh0aGlzLmdhbWUsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuY2VudGVyWCwgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5jZW50ZXJZLCBcIlwiLCB0aGlzLmNvbmZpZy5mbGFzaC5zdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC5zZXRUZXh0Qm91bmRzKDAsIDAsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggLSAyMCwgMCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmRpc3BsYXkuZmxhc2gpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEZsYXNoIHRleHQgZm9yIGR1cmF0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBkaXNwbGF5c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb249MjAwMF0gLSBNaWxsaXNlY29uZHMgdG8gZGlzcGxheSB0ZXh0XG4gICAgICovXG4gICAgZmxhc2godGV4dCwgZHVyYXRpb24gPSAyMDAwKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2gudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC5zZXRUZXh0KHRleHQpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoZHVyYXRpb24sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2gudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5hbWVwbGF0ZTsiLCJpbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi9CdXR0b25cIjtcbmltcG9ydCBTbGlkZXIgZnJvbSBcIi4vU2xpZGVyXCI7XG5pbXBvcnQge0FjdGlvbn0gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmNsYXNzIFBhbmVsIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXkpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuYmV0cyA9IFswXTtcbiAgICAgICAgdGhpcy5wcmltYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMucHJpbWFyeUFjdGlvbiA9IEFjdGlvbi5CRVQ7XG4gICAgICAgIHRoaXMucHJpbWFyeUJldCA9IDA7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QWN0aW9uID0gQWN0aW9uLkNIRUNLO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUJldCA9IDA7XG4gICAgICAgIHRoaXMudGVydGlhcnlDbGlja2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy50ZXJ0aWFyeUFjdGlvbiA9IEFjdGlvbi5GT0xEO1xuICAgICAgICB0aGlzLnNsaWRlciA9IG5ldyBTbGlkZXIodGhpcy5nYW1lLCBcInBhbmVsXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7fTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFsd2F5c1Zpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeSA9IHRoaXMubWFrZUJ1dHRvbigwLCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnByaW1hcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMucHJpbWFyeUFjdGlvbiwgdGhpcy5wcmltYXJ5QmV0KSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zZWNvbmRhcnkgPSB0aGlzLm1ha2VCdXR0b24oMTM1LCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnNlY29uZGFyeUNsaWNrZWQuZGlzcGF0Y2godGhpcy5zZWNvbmRhcnlBY3Rpb24sIHRoaXMuc2Vjb25kYXJ5QmV0KSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXJ0aWFyeSA9IHRoaXMubWFrZUJ1dHRvbigyNzAsIDAsIFwibWVkXCIsICgpID0+IHRoaXMudGVydGlhcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMudGVydGlhcnlBY3Rpb24sIDApKTtcblxuICAgICAgICB0aGlzLnNsaWRlci5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgICAgICB0aGlzLnNsaWRlci5pbmRleENoYW5nZWQuYWRkKChpbmRleCkgPT4gdGhpcy5zZXRQcmltYXJ5QmV0KHRoaXMuYmV0c1tpbmRleF0pLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2xpZGVyV2hlZWwuYWRkKHRoaXMuc2luZ2xlU3RlcEJldCwgdGhpcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zbGlkZXIgPSB0aGlzLnNsaWRlci5iYXI7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zbGlkZXIueSA9IDYwO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5wcmltYXJ5LmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4gdGhpcy5zbGlkZXIuZW5hYmxlU2xpZGVyV2hlZWwodHJ1ZSkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeS5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4gdGhpcy5zbGlkZXIuZW5hYmxlU2xpZGVyV2hlZWwoZmFsc2UpKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnByaW1hcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnNlY29uZGFyeSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkudGVydGlhcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnNsaWRlcik7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgbWFrZUJ1dHRvbih4LCB5LCBzaXplLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYnV0dG9uID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIHgsIHksIHRoaXMua2V5KTtcbiAgICAgICAgYnV0dG9uLm9uSW5wdXRVcC5hZGQoY2FsbGJhY2spO1xuICAgICAgICBidXR0b24uc2V0RnJhbWVzKFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfb3V0XCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9kb3duXCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl91cFwiXG4gICAgICAgICk7XG4gICAgICAgIGJ1dHRvbi5zZXRUZXh0U3R5bGUodGhpcy5nYW1lLmNvbmZpZy5wYW5lbC50ZXh0U3R5bGUpO1xuICAgICAgICByZXR1cm4gYnV0dG9uO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIC8vIFBhbmVsIHVwZGF0ZXMgcmVxdWlyZSBwbGF5ZXJzJyBjdXJyZW50IGJldHMsIHNvIGlmXG4gICAgICAgIC8vIHRoZXJlIGlzIG5vIG5leHQgcGxheWVyIHdlIHNob3VsZG4ndCB1cGRhdGUgdGhlIGRpc3BsYXlcbiAgICAgICAgaWYgKCF0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYWN0aW9uVGV4dCA9IHRoaXMuZ2FtZS5yb3VuZEJldCA9PT0gMCA/IFwiQkVUIFwiIDogXCJSQUlTRSBUT1xcblwiO1xuICAgICAgICBsZXQgcHJpbWFyeVRleHQgPSBhY3Rpb25UZXh0ICsgVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMucHJpbWFyeUJldCArIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQpO1xuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeS5zZXRUZXh0KHByaW1hcnlUZXh0KTtcblxuICAgICAgICBsZXQgc2Vjb25kYXJ5VGV4dCA9IFwiQ0hFQ0tcIjtcbiAgICAgICAgaWYgKHRoaXMuc2Vjb25kYXJ5QWN0aW9uICE9PSBBY3Rpb24uQ0hFQ0spIHtcbiAgICAgICAgICAgIHNlY29uZGFyeVRleHQgPSBcIkNBTEwgXCIgKyBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5zZWNvbmRhcnlCZXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheS5zZWNvbmRhcnkuc2V0VGV4dChzZWNvbmRhcnlUZXh0KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkudGVydGlhcnkuc2V0VGV4dChcIkZPTERcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLnZpc2libGUgPSB0aGlzLnZpc2libGU7XG4gICAgfVxuXG4gICAgc2V0QmV0cyhiZXRzKSB7XG4gICAgICAgIGlmIChiZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIGJldHMuIFBhbmVsIG11c3QgYWx3YXlzIGhhdmUgYXQgbGVhc3Qgb25lIHZhbGlkIGJldC5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJldHMgPSBiZXRzO1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSBiZXRzWzBdO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRMZW5ndGgoYmV0cy5sZW5ndGgpO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRJbmRleCgwKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0RW5hYmxlZChiZXRzLmxlbmd0aCA+IDEpO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRQcmltYXJ5QmV0KGJldCkge1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSBiZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldFNlY29uZGFyeUJldChiZXQpIHtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlCZXQgPSBiZXQ7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QWN0aW9uID0gYmV0ID09PSAwID8gQWN0aW9uLkNIRUNLIDogQWN0aW9uLkJFVDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSGlkZSBvciBzaG93IHRoZSBlbnRpcmUgcGFuZWxcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGVcbiAgICAgKi9cbiAgICBzZXRWaXNpYmxlKHZpc2libGUpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZSB8fCB0aGlzLmFsd2F5c1Zpc2libGU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEluY3JlbWVudCBvciBkZWNyZW1lbnQgdGhpcy5wcmltYXJ5QmV0XG4gICAgICogQHBhcmFtIHtQaGFzZXIuTW91c2Uud2hlZWxEZWx0YX0gbW9kaWZpZXIgLSArMSBvciAtMVxuICAgICAqL1xuICAgIHNpbmdsZVN0ZXBCZXQobW9kaWZpZXIpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5zbGlkZXIuaW5kZXggKyBtb2RpZmllcjtcbiAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPD0gdGhpcy5zbGlkZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNsaWRlci5zZXRJbmRleChpbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsOyIsImltcG9ydCB7QWN0aW9uVGV4dH0gZnJvbSBcIi4uL2NsYXNzZXMvQWN0aW9uXCI7XG5pbXBvcnQgQ2FyZE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NhcmRNYW5hZ2VyXCI7XG5pbXBvcnQgQ2hpcE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NoaXBNYW5hZ2VyXCI7XG5pbXBvcnQgTmFtZXBsYXRlIGZyb20gXCIuLi9jbGFzc2VzL05hbWVwbGF0ZVwiO1xuXG5jbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGNoaXBDb25maWcpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5jaGlwQ29uZmlnID0gY2hpcENvbmZpZztcblxuICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBudWxsO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBudWxsO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBudWxsO1xuICAgICAgICB0aGlzLnNlYXQgPSBudWxsO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gMDsgIC8vIFN1bSBiZXRzIGJ5IHBsYXllciBpbiBjdXJyZW50IGJldHRpbmcgcm91bmRcblxuICAgICAgICB0aGlzLmlzRGVhbGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNOZXh0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcbiAgICAgICAgICAgIG5hbWVwbGF0ZTogbnVsbCxcbiAgICAgICAgICAgIGNhcmRzOiBudWxsLFxuICAgICAgICAgICAgY2FyZHNNYXNrOiBudWxsLFxuICAgICAgICAgICAgZGVhbGVyQnV0dG9uOiBudWxsLFxuICAgICAgICAgICAgY2hpcHM6IG51bGxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmNhcmRzID0gbmV3IENhcmRNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuY2hpcHMgPSBuZXcgQ2hpcE1hbmFnZXIodGhpcy5nYW1lLCBcImNoaXBzXCIsIHRoaXMuZ2FtZS5jb25maWcuZGVub21zKTtcbiAgICAgICAgdGhpcy5uYW1lcGxhdGUgPSBuZXcgTmFtZXBsYXRlKHRoaXMuZ2FtZSwgMCwgMCwgXCJuYW1lcGxhdGVcIik7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkYXRhLmlkO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IGRhdGEudXNlcklkO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuc2l0dGluZ091dCA9IGRhdGEuc2l0dGluZ091dDtcbiAgICAgICAgdGhpcy5zZWF0ID0gZGF0YS5zZWF0O1xuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZGF0YS5pc1VzZXI7XG5cbiAgICAgICAgdGhpcy5jYXJkcy5pbml0aWFsaXplKDIpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlID0gdGhpcy5uYW1lcGxhdGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMgPSB0aGlzLmNhcmRzLmRpc3BsYXlHcm91cDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLnggPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmNlbnRlclg7XG4gICAgICAgIHRoaXMuaGlkZUNhcmRzKCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzTWFzayA9IHRoaXMuY3JlYXRlQ2FyZHNNYXNrKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkc01hc2suYm90dG9tID0gdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS50b3A7XG4gICAgICAgIHRoaXMuY2FyZHMubWFzayA9IHRoaXMuZGlzcGxheS5jYXJkc01hc2s7XG5cbiAgICAgICAgLy8gTk9URTogVGhpcyBsaW5lIGlzIHJlcXVpcmVkIGZvciB0aGlzIG1hc2sgdG8gd29yayB1bmRlciBXZWJHTFxuICAgICAgICAvLyBTb21lIGNoYW5nZXMgdG8gbWFza3MgaW4gV2ViR0wgbW9kZSB3aWxsIHJlbmRlciB0aGUgbWFza1xuICAgICAgICAvLyBjb21wbGV0ZWx5IGluZWZmZWN0aXZlLiBUaGUgYnVnIGlzIG5vdCB3ZWxsIHVuZGVyc3Rvb2QuIEl0IG1heVxuICAgICAgICAvLyBoYXZlIGJlZW4gZml4ZWQgaW4gbGF0ZXIgdmVyc2lvbnMgb2YgUGhhc2VyLlxuICAgICAgICAvLyBNb3JlIGRldGFpbCBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vcGhvdG9uc3Rvcm0vcGhhc2VyLWNlL2lzc3Vlcy8zMzRcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzTWFzay5kaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbiA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwiZGVhbGVyQnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmxlZnQgPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmxlZnQgKyA1O1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmJvdHRvbSA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuYm90dG9tIC0gNTtcblxuICAgICAgICB0aGlzLmNoaXBzLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jaGlwcyA9IHRoaXMuY2hpcHMuZGlzcGxheUdyb3VwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMueCA9IHRoaXMuY2hpcENvbmZpZ1t0aGlzLnNlYXRdLng7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jaGlwcy55ID0gdGhpcy5jaGlwQ29uZmlnW3RoaXMuc2VhdF0ueTtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5jaGlwcy5kaXNwbGF5R3JvdXApO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmNhcmRzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5jYXJkc01hc2spO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLm5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuYmFsYW5jZSA9IHRoaXMuYmFsYW5jZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5mcmFtZU5hbWUgPSB0aGlzLmlzTmV4dCA/IFwicmVkXCIgOiBcImJhc2VcIjtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbi52aXNpYmxlID0gdGhpcy5pc0RlYWxlciA9PT0gdHJ1ZTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZGF0YSwgdXBkYXRlQ2hpcHMgPSB0cnVlKSB7XG4gICAgICAgIC8vIFRPRE8gLSBGbGVzaCBvdXQgdGhlIHJlc3Qgb2YgdGhlIGRhdGEgLS0gZG8gSSBsaWtlIHRoaXMgbWV0aG9kP1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2UgPT09IHVuZGVmaW5lZCA/IHRoaXMuYmFsYW5jZSA6IGRhdGEuYmFsYW5jZTtcbiAgICAgICAgdGhpcy5pc0RlYWxlciA9IGRhdGEuaXNEZWFsZXIgPT09IHVuZGVmaW5lZCA/IHRoaXMuaXNEZWFsZXIgOiBkYXRhLmlzRGVhbGVyO1xuICAgICAgICB0aGlzLmlzTmV4dCA9IGRhdGEuaXNOZXh0ID09PSB1bmRlZmluZWQgPyB0aGlzLmlzTmV4dCA6IGRhdGEuaXNOZXh0O1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gZGF0YS5yb3VuZEJldCA9PT0gdW5kZWZpbmVkID8gdGhpcy5yb3VuZEJldCA6IGRhdGEucm91bmRCZXQ7XG4gICAgICAgIGlmICh1cGRhdGVDaGlwcykge1xuICAgICAgICAgICAgdGhpcy5jaGlwcy5zZXRWYWx1ZSh0aGlzLnJvdW5kQmV0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hpcHMudmFsdWUgPSB0aGlzLnJvdW5kQmV0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIGFjdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKHtcbiAgICAgICAgICAgIGJhbGFuY2U6IGRhdGEucGxheWVyQmFsYW5jZSxcbiAgICAgICAgICAgIHJvdW5kQmV0OiBkYXRhLnBsYXllclJvdW5kQmV0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBhY3Rpb25UZXh0ID0gQWN0aW9uVGV4dFtkYXRhLmFjdGlvblR5cGVdO1xuXG4gICAgfVxuXG4gICAgY3JlYXRlQ2FyZHNNYXNrKCkge1xuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5jYXJkcy5jYXJkc1swXS5oZWlnaHQ7XG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubmFtZXBsYXRlLndpZHRoO1xuICAgICAgICBsZXQgbWFzayA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoMCwgMCk7XG4gICAgICAgIG1hc2suYmVnaW5GaWxsKDB4ZmZmZmZmKTtcbiAgICAgICAgbWFzay5kcmF3UmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmV0dXJuIG1hc2s7XG4gICAgfVxuXG4gICAgYW5pbWF0ZURlYWwoKSB7XG4gICAgICAgIHRoaXMuaGlkZUNhcmRzKCk7XG5cbiAgICAgICAgY29uc3Qgc2hvd1R3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmRpc3BsYXkuY2FyZHMpLnRvKHt5OiAtdGhpcy5uYW1lcGxhdGUuaGVpZ2h0IC8gMn0sIDUwMCwgUGhhc2VyLkVhc2luZy5RdWFydGljLk91dCwgdHJ1ZSk7XG5cbiAgICAgICAgc2hvd1R3ZWVuLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhcmRQb3NpdGlvbnMgPSB0aGlzLmNhbGNDYXJkUG9zaXRpb25zKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuY2FyZHMuY2FyZHNbaV0pLnRvKHt4OiBjYXJkUG9zaXRpb25zW2ldfSwgNTAwLCBQaGFzZXIuRWFzaW5nLlF1YXJ0aWMuT3V0LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgYW5pbWF0ZUZvbGQoKSB7XG4gICAgICAgIHRoaXMuc2hvd0NhcmRzKCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuY2FyZHMuY2FyZHNbaV0pLnRvKHt4OiAwfSwgNTAwLCBQaGFzZXIuRWFzaW5nLlF1YXJ0aWMuT3V0LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoNTAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuZGlzcGxheS5jYXJkcykudG8oe3RvcDogdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS50b3B9LCA1MDAsIFBoYXNlci5FYXNpbmcuUXVhcnRpYy5PdXQsIHRydWUpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICBoaWRlQ2FyZHMoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkcy5jYXJkc1tpXS54ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMudG9wID0gdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS50b3A7XG4gICAgfVxuXG4gICAgc2hvd0NhcmRzKCkge1xuICAgICAgICBjb25zdCBjYXJkUG9zaXRpb25zID0gdGhpcy5jYWxjQ2FyZFBvc2l0aW9ucygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHMuY2FyZHNbaV0ueCA9IGNhcmRQb3NpdGlvbnNbaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLnkgPSAtdGhpcy5uYW1lcGxhdGUuaGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBDYWxjdWxhdGUgdGhlIGZpbmFsIHBvc2l0aW9ucyBvZiBhbGwgY2FyZHMgaW4gaGFuZFxuICAgICAqXG4gICAgICogTk9URSBUTyBNRTogRG9uJ3QgZnVjayB3aXRoIHRoaXMuIEl0IHRvb2sgYSBsb25nIHRpbWUgdG8gZ2V0IHJpZ2h0LlxuICAgICAqXG4gICAgICogVGhlIGNhcmRzIG5lZWQgdG8gYmUgcG9zaXRpb25lZCBjb3JyZWN0bHkgYm90aCBpbiByZWxhdGlvbiB0b1xuICAgICAqIHRoZW1zZWx2ZXMgKHN0YWdnZXJlZCBldmVubHkpIGFuZCBhbHNvIGluIHJlbGF0aW9uIHRvIHRoZSBuYW1lcGxhdGUuXG4gICAgICogRG9pbmcgdGhlIGxhdHRlciBieSBjZW50ZXJpbmcgdGhlIGNhcmRzJyBkaXNwbGF5IGdyb3VwIG9uIHRoZSBuYW1lcGxhdGVcbiAgICAgKiB3b3VsZCBoYXZlIGJlZW4gbXVjaCBlYXNpZXIsIGJ1dCB0aGF0IHdheSBtYWRlIGFuaW1hdGluZyB0aGUgY2FyZFxuICAgICAqIHNwcmVhZCBuZWFybHkgaW1wb3NzaWJsZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBjYWxjQ2FyZFBvc2l0aW9ucygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBvc2l0aW9ucyA9IFtdO1xuICAgICAgICBjb25zdCBjYXJkV2lkdGggPSB0aGlzLmNhcmRzLmNhcmRzWzBdLndpZHRoO1xuICAgICAgICBjb25zdCBjYXJkQXJlYSA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggKiAwLjk7XG4gICAgICAgIGNvbnN0IHRvdGFsV2lkdGggPSBjYXJkV2lkdGggKiB0aGlzLmNhcmRzLmxlbmd0aDtcbiAgICAgICAgY29uc3QgdG90YWxPdmVyZmxvdyA9IHRvdGFsV2lkdGggLSBjYXJkQXJlYTtcbiAgICAgICAgY29uc3QgY2FyZE9mZnNldCA9IHRvdGFsT3ZlcmZsb3cgLyAodGhpcy5jYXJkcy5sZW5ndGggLSAxKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBTcGFjZSBjYXJkcyBldmVubHlcbiAgICAgICAgICAgIGxldCBwb3MgPSBjYXJkV2lkdGggKiBpIC0gY2FyZE9mZnNldCAqIGk7XG5cbiAgICAgICAgICAgIC8vIENlbnRlciBjYXJkcyBvbiBuYW1lcGxhdGVcbiAgICAgICAgICAgIHBvcyAtPSBjYXJkQXJlYSAvIDIgLSBjYXJkV2lkdGggLyAyO1xuXG4gICAgICAgICAgICBwb3NpdGlvbnMucHVzaChwb3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3NpdGlvbnM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJpbXBvcnQgQ2hpcE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NoaXBNYW5hZ2VyXCI7XG5cbmNsYXNzIFBvdCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmFtb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICAgICAgdGhpcy5jaGlwcyA9IG5ldyBDaGlwTWFuYWdlcih0aGlzLmdhbWUsIFwiY2hpcHNcIiwgdGhpcy5nYW1lLmNvbmZpZy5kZW5vbXMpO1xuICAgICAgICB0aGlzLmNoaXBzLnN0YWNrQ2hpcHMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jaGlwcy5jb2xvclVwID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuY2hpcHMuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmNoaXBzLnNldFZhbHVlKHRoaXMuYW1vdW50KTtcbiAgICB9XG5cbiAgICBzZXRBbW91bnQoYW1vdW50KSB7XG4gICAgICAgIHRoaXMuYW1vdW50ID0gYW1vdW50O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBnYXRoZXJDaGlwcyhwbGF5ZXJzKSB7XG4gICAgICAgIGxldCBkZWxheSA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBsYXllciA9IHBsYXllcnNbaV07XG4gICAgICAgICAgICBpZiAocGxheWVyLmNoaXBzLmNoaXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoZGVsYXksICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbW91bnQgKz0gcGxheWVyLmNoaXBzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaXBzLnRha2VDaGlwcyhwbGF5ZXIuY2hpcHMuY2hpcHMpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgICAgIGRlbGF5ICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG90O1xuIiwiLyoqXG4gKiBBIHNsaWRlciBVSSBlbGVtZW50XG4gKlxuICogUmVwcmVzZW50ZWQgYnkgYSBiYXIgc3ByaXRlIGFuZCBhIG1hcmtlciBzcHJpdGUuIERlc3BpdGUgaG93IGl0IG1heVxuICogbG9vaywgYWxsIGlucHV0IG9jY3VycyBvbiB0aGUgYmFyIGFuZCB1cGRhdGVzIGFyZSBtYWRlIHRvIHRoZVxuICogbWFya2VyJ3MgcG9zaXRpb24gYmFzZWQgb24gdGhvc2UgaW5wdXRzLlxuICovXG5jbGFzcyBTbGlkZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5iYXIgPSBudWxsOyAgLy8gVGhlIHNsaWRlciBiYXIgc3ByaXRlXG4gICAgICAgIHRoaXMubWFya2VyID0gbnVsbDsgIC8vIFRoZSBkcmFnZ2FibGUgbWFya2VyIHNwcml0ZVxuICAgICAgICB0aGlzLmluZGV4ID0gMDsgIC8vIEN1cnJlbnQgaW5kZXggb2YgbWFya2VyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMTsgIC8vIFRvdGFsIG51bWJlciBvZiBpbmRpY2VzXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2xpZGVyV2hlZWwgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmJhciA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgdGhpcy5rZXksIFwic2xpZGVyX2JhclwiKTtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXREb3duLmFkZCh0aGlzLnN0YXJ0RHJhZywgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0VXAuYWRkKHRoaXMuc3RvcERyYWcsIHRoaXMpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHRoaXMuZW5hYmxlU2xpZGVyV2hlZWwodHJ1ZSkpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4gdGhpcy5lbmFibGVTbGlkZXJXaGVlbChmYWxzZSkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyID0gdGhpcy5iYXI7XG5cbiAgICAgICAgdGhpcy5tYXJrZXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCB0aGlzLmtleSwgXCJzbGlkZXJfbWFya2VyXCIpO1xuICAgICAgICB0aGlzLm1hcmtlci5hbmNob3Iuc2V0VG8oMC41LCAwKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuYm90dG9tID0gdGhpcy5iYXIuYm90dG9tO1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyID0gdGhpcy5tYXJrZXI7XG4gICAgICAgIHRoaXMuYmFyLmFkZENoaWxkKHRoaXMubWFya2VyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgc2xpZGVyIGRyYWdnaW5nIGFuZCBpbml0aWF0ZSBmaXJzdCBkcmFnIGV2ZW50XG4gICAgICogQHBhcmFtIHtQaGFzZXIuU3ByaXRlfSBiYXIgLSBUaGUgYmFyIHNwcml0ZSB0aGF0IHdhcyBjbGlja2VkXG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBwb2ludGVyIHdoaWNoIGluaXRpYXRlZCB0aGUgY2xpY2tcbiAgICAgKi9cbiAgICBzdGFydERyYWcoYmFyLCBwb2ludGVyKSB7XG4gICAgICAgIC8vIEluaXRpYWwgY2FsbCB0byB1cGRhdGVEcmFnIGFsbG93cyBjaGFuZ2luZyBiZXQgd2l0aCBjbGljayBvbiBiYXJcbiAgICAgICAgdGhpcy51cGRhdGVEcmFnKHBvaW50ZXIsIHBvaW50ZXIueCwgcG9pbnRlci55KTtcbiAgICAgICAgdGhpcy5nYW1lLmlucHV0LmFkZE1vdmVDYWxsYmFjayh0aGlzLnVwZGF0ZURyYWcsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IERpc2FibGUgc2xpZGVyIGRyYWdnaW5nXG4gICAgICovXG4gICAgc3RvcERyYWcoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5kZWxldGVNb3ZlQ2FsbGJhY2sodGhpcy51cGRhdGVEcmFnLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBDYWxjdWxhdGUgc2xpZGVyIGluZGV4IGJhc2VkIG9uIGRyYWcgaW5wdXRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Qb2ludGVyfSBwb2ludGVyIC0gVGhlIHNsaWRpbmcgcG9pbnRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSBvZiBwb2ludGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIG9mIHBvaW50ZXJcbiAgICAgKi9cbiAgICB1cGRhdGVEcmFnKHBvaW50ZXIsIHgsIHkpIHtcbiAgICAgICAgbGV0IGxvY2FsWCA9IHggLSB0aGlzLmJhci53b3JsZC54OyAgLy8gQ2xpY2sgcG9zIGluIHJlbGF0aW9uIHRvIGJhclxuXG4gICAgICAgIC8vIFByZXZlbnQgZHJhZ2dpbmcgcGFzdCBiYXIgYm91bmRzXG4gICAgICAgIGlmIChsb2NhbFggPCAwKSB7XG4gICAgICAgICAgICBsb2NhbFggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsWCA+IHRoaXMuYmFyLndpZHRoKSB7XG4gICAgICAgICAgICBsb2NhbFggPSB0aGlzLmJhci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN1YnRyYWN0IDEgZnJvbSBsZW5ndGggYmVjYXVzZSBsZW5ndGggaXMgMS1pbmRleGVkLCBpbmRpY2VzIGFyZSAwLWluZGV4ZWRcbiAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLnJvdW5kKGxvY2FsWCAvIHRoaXMuYmFyLndpZHRoICogKHRoaXMubGVuZ3RoIC0gMSkpO1xuICAgICAgICB0aGlzLnNldEluZGV4KGluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIGluZGV4IG9mIHRoZSBzbGlkZXIgYW5kIHJlcG9ydCB0aGUgbmV3IHZhbHVlXG4gICAgICpcbiAgICAgKiBPcHRpb25hbGx5IHVwZGF0ZSB0aGUgdmlzdWFsIHBvc2l0aW9uIG9mIHRoZSBtYXJrZXIgb24gdGhlIHNsaWRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIE5ldyBpbmRleCB0byBzZXQgb24gc2xpZGVyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXBkYXRlUG9zPXRydWVdIC0gVXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBtYXJrZXI/XG4gICAgICovXG4gICAgc2V0SW5kZXgoaW5kZXgsIHVwZGF0ZVBvcyA9IHRydWUpIHtcbiAgICAgICAgaWYgKGluZGV4ICE9PSB0aGlzLmluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZC5kaXNwYXRjaChpbmRleCk7XG5cbiAgICAgICAgICAgIGlmICh1cGRhdGVQb3MpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiBvbmx5IG9uZSBiZXQgYXZhaWxhYmxlLCBpdCdzIGEgbWF4IGJldFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgMSBmcm9tIGxlbmd0aCBiZWNhdXNlIGxlbmd0aCBpcyAxLWluZGV4ZWQsIGluZGljZXMgYXJlIDAtaW5kZXhlZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGggLyAodGhpcy5sZW5ndGggLSAxKSAqIHRoaXMuaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVXBkYXRlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgKlxuICAgICAqIFRoZSBsZW5ndGggcHJvcGVydHkgZGVzY3JpYmVzIGhvdyBtYW55IGRpc2NyZXRlIGJldHMgdGhlIHNsaWRlciBiYXJcbiAgICAgKiBtdXN0IHJlcHJlc2VudC4gVGhlIHNsaWRlciBkb2VzIG5vdCBjYXJlIGFib3V0IHdoYXQgdGhlIHNwZWNpZmljIGJldFxuICAgICAqIGl0IHJlcHJlc2VudHMgaXMsIG9ubHkgdGhhdCBpdCBoYXMgc29tZSBudW1iZXIgb2YgaW5kaWNlcyBhbG9uZyBpdHNcbiAgICAgKiBsZW5ndGggYW5kIHRoYXQgaXQgbXVzdCByZXBvcnQgaXRzIGluZGV4IHRvIGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbmV3IGxlbmd0aCB0byBzZXRcbiAgICAgKi9cbiAgICBzZXRMZW5ndGgobGVuZ3RoKSB7XG4gICAgICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCBzZXQgc2xpZGVyIGxlbmd0aCBsZXNzIHRoYW4gMVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChsZW5ndGggPiB0aGlzLmJhci53aWR0aCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogU2V0dGluZyBzbGlkZXIgc3RvcHMgZ3JlYXRlciB0aGFuIGxlbmd0aCBtYXkgcmVzdWx0IGluIHVuZXhwZWN0ZWQgYmVoYXZpb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIHNsaWRlclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIElzIHRoZSBzbGlkZXIgZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gZW5hYmxlZDtcblxuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyLnRpbnQgPSB0aW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIGRpc3BhdGNoIG9mIHNpZ25hbCBvbiB3aGVlbCBzY3JvbGxcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBJcyB0aGUgY2FsbGJhY2sgZW5hYmxlZCBvciBkaXNhYmxlZD9cbiAgICAgKi9cbiAgICBlbmFibGVTbGlkZXJXaGVlbChlbmFibGVkKSB7XG4gICAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQubW91c2UubW91c2VXaGVlbENhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyV2hlZWwuZGlzcGF0Y2godGhpcy5nYW1lLmlucHV0Lm1vdXNlLndoZWVsRGVsdGEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS5tb3VzZVdoZWVsQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbGlkZXI7IiwiLyoqXG4gKiBAc3VtbWFyeSBUcmFjayBhbmQgcXVldWUgdHdlZW5zIGdhbWUgd2lkZVxuICpcbiAqIEl0J3MgZWFzeSB0byBjaGFpbiB0d2VlbnMgd2hlbiB0aGV5J3JlIGNyZWF0ZWQgYXQgdGhlIHNhbWUgcG9pbnRcbiAqIGluIHRpbWUsIGJ1dCB3aGF0IGlmIHR3byB0d2VlbnMgYXJlIGNyZWF0ZWQgYXQgY29tcGxldGVseSBkaWZmZXJlbnRcbiAqIHBvaW50cz8gV2hhdCBpZiB0aG9zZSB0d2VlbnMgbmVlZCB0byBydW4gY29uc2VjdXRpdmVseSwgdGhlIHNlY29uZFxuICogd2FpdGluZyBmb3IgdGhlIGZpcnN0IHRvIGNvbXBsZXRlIGJlZm9yZSBzdGFydGluZz9cbiAqL1xuXG5jbGFzcyBUd2VlblF1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG5cbiAgICAgICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuICAgIH1cblxuICAgIGdldCBydW5uaW5nKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmN1cnJlbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgQWRkIGEgdHdlZW4gdG8gdGhlIHF1ZXVlXG4gICAgICogQHBhcmFtIHtQaGFzZXIuVHdlZW59IHR3ZWVuIC0gVGhlIHR3ZWVuIHRvIGFkZCB0byB0aGUgcXVldWVcbiAgICAgKi9cbiAgICBhZGQodHdlZW4pIHtcbiAgICAgICAgLy8gVHdlZW5zIGFkZGVkIHRvIHRoZSBxdWV1ZSBtYXkgaGF2ZSBvdGhlciBvbkNvbXBsZXRlIGNhbGxiYWNrcyxcbiAgICAgICAgLy8gYnV0IHRoZXkgbXVzdCBhdCBsZWFzdCBoYXZlIHRoaXMgb25lLCB3aGljaCB0cmlnZ2VycyB0aGVcbiAgICAgICAgLy8gbmV4dCB0d2VlbiBpbiB0aGUgcXVldWUgdG8gYmVnaW5cbiAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQodGhpcy5uZXh0LCB0aGlzKTtcblxuICAgICAgICAvLyBBZGQgdG8gdGhlIGZyb250LCByZW1vdmUgZnJvbSB0aGUgYmFja1xuICAgICAgICB0aGlzLnF1ZXVlLnVuc2hpZnQodHdlZW4pO1xuXG4gICAgICAgIC8vIEF1dG8gc3RhcnQgdGhlIGNoYWluIGlmIGl0J3Mgbm90IGFscmVhZHkgcnVubmluZ1xuICAgICAgICBpZiAoIXRoaXMucnVubmluZykge1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTdGFydCB0aGUgbmV4dCB0d2VlbiBpbiB0aGUgcXVldWVcbiAgICAgKi9cbiAgICBuZXh0KCkge1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnF1ZXVlLnBvcCgpO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQuc3RhcnQoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHdlZW5RdWV1ZTsiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwicGFuZWxcIjoge1xuICAgIFwicGFkZGluZ1wiOiAxMCxcbiAgICBcInRleHRTdHlsZVwiOiB7XG4gICAgICBcImZvbnRcIjogXCJib2xkIDIycHQgQXJpYWxcIixcbiAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICBcImFsaWduXCI6IFwiY2VudGVyXCJcbiAgICB9LFxuICAgIFwicG9zXCI6IHtcbiAgICAgIFwieFwiOiAxNDgwLFxuICAgICAgXCJ5XCI6IDc5MFxuICAgIH1cbiAgfSxcbiAgXCJzZWF0c1wiOiBbXG4gICAge1wieFwiOiA4NjAsIFwieVwiOiAyMDB9LFxuICAgIHtcInhcIjogMTE3OCwgXCJ5XCI6IDIwMH0sXG4gICAge1wieFwiOiAxNTIyLCBcInlcIjogMzQyfSxcbiAgICB7XCJ4XCI6IDE1MjIsIFwieVwiOiA2MjZ9LFxuICAgIHtcInhcIjogMTE3OCwgXCJ5XCI6IDg5NH0sXG4gICAge1wieFwiOiA4NjAsIFwieVwiOiA4OTR9LFxuICAgIHtcInhcIjogNTQyLCBcInlcIjogODk0fSxcbiAgICB7XCJ4XCI6IDE5OCwgXCJ5XCI6IDYyNn0sXG4gICAge1wieFwiOiAxOTgsIFwieVwiOiAzNDJ9LFxuICAgIHtcInhcIjogNTQyLCBcInlcIjogMjAwfVxuICBdLFxuICBcImJ1eUluTW9kYWxcIjoge1xuICAgIFwieFwiOiA4MTAsXG4gICAgXCJ5XCI6IDQzMCxcbiAgICBcImlucHV0Qm94XCI6IHtcbiAgICAgIFwieFwiOiAxNSxcbiAgICAgIFwieVwiOiA4NlxuICAgIH0sXG4gICAgXCJpbnB1dEZpZWxkXCI6IHtcbiAgICAgIFwieFwiOiAzMCxcbiAgICAgIFwieVwiOiAtMlxuICAgIH0sXG4gICAgXCJjYW5jZWxCdXR0b25cIjoge1xuICAgICAgXCJ4XCI6IDE1LFxuICAgICAgXCJ5XCI6IDE0NVxuICAgIH0sXG4gICAgXCJzdWJtaXRCdXR0b25cIjoge1xuICAgICAgXCJ4XCI6IDE1NSxcbiAgICAgIFwieVwiOiAxNDVcbiAgICB9XG4gIH0sXG4gIFwiZGVhbGVyQnV0dG9uXCI6IFtcbiAgICB7XCJ4XCI6IDg0NiwgXCJ5XCI6IDMwMH0sXG4gICAge1wieFwiOiAxMTY0LCBcInlcIjogMzAwfSxcbiAgICB7XCJ4XCI6IDE1MTYsIFwieVwiOiA0NDJ9LFxuICAgIHtcInhcIjogMTUxNiwgXCJ5XCI6IDU5Mn0sXG4gICAge1wieFwiOiAxMTUwLCBcInlcIjogNzkwfSxcbiAgICB7XCJ4XCI6IDc4NCwgXCJ5XCI6IDc5MH0sXG4gICAge1wieFwiOiA1MjYsIFwieVwiOiA3OTB9LFxuICAgIHtcInhcIjogNDQwLCBcInlcIjogNTkyfSxcbiAgICB7XCJ4XCI6IDQ0MCwgXCJ5XCI6IDQ0Mn0sXG4gICAge1wieFwiOiA1MzIsIFwieVwiOiAzMDB9XG4gIF0sXG4gIFwiZGVub21zXCI6IFs1LCAyNSwgMTAwLCA1MDAsIDIwMDBdLFxuICBcImNoaXBzXCI6IFtcbiAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IDEyMH0sXG4gICAge1wieFwiOiAxMDAsIFwieVwiOiAxMjB9LFxuICAgIHtcInhcIjogLTYwLCBcInlcIjogNDB9LFxuICAgIHtcInhcIjogLTYwLCBcInlcIjogNDB9LFxuICAgIHtcInhcIjogMTAwLCBcInlcIjogLTE0MH0sXG4gICAge1wieFwiOiAxMDAsIFwieVwiOiAtMTQwfSxcbiAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IC0xNDB9LFxuICAgIHtcInhcIjogMjQwLCBcInlcIjogNDB9LFxuICAgIHtcInhcIjogMjQwLCBcInlcIjogNDB9LFxuICAgIHtcInhcIjogMTAwLCBcInlcIjogMTIwfVxuICBdLFxuICBcIm5hbWVwbGF0ZVwiOiB7XG4gICAgXCJuYW1lXCI6IHtcbiAgICAgIFwieFwiOiAxMCxcbiAgICAgIFwieVwiOiAzMCxcbiAgICAgIFwic3R5bGVcIjoge1xuICAgICAgICBcImZvbnRcIjogXCJib2xkIDIycHQgQXJpYWxcIixcbiAgICAgICAgXCJmaWxsXCI6IFwiIzMzMzMzM1wiXG4gICAgICB9XG4gICAgfSxcbiAgICBcImJhbGFuY2VcIjoge1xuICAgICAgXCJ4XCI6IDEwLFxuICAgICAgXCJ5XCI6IDYwLFxuICAgICAgXCJzdHlsZVwiOiB7XG4gICAgICAgIFwiZm9udFwiOiBcIjE2cHQgQXJpYWxcIixcbiAgICAgICAgXCJib3VuZHNBbGlnbkhcIjogXCJyaWdodFwiLFxuICAgICAgICBcImZpbGxcIjogXCIjNTU1NTU1XCJcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiZmxhc2hcIjoge1xuICAgICAgXCJzdHlsZVwiOiB7XG4gICAgICAgIFwiZm9udFwiOiBcImJvbGQgMzBwdCBBcmlhbFwiLFxuICAgICAgICBcImZpbGxcIjogXCIjMzMzMzMzXCJcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFwicG9wdXBcIjoge1xuICAgIFwieFwiOiAwLFxuICAgIFwieVwiOiAxMCxcbiAgICBcIndpZHRoXCI6IDYwLFxuICAgIFwiaGVpZ2h0XCI6IDIwLFxuICAgIFwidGV4dFwiOiB7XG4gICAgICBcInhcIjogNixcbiAgICAgIFwieVwiOiAxOCxcbiAgICAgIFwic3R5bGVcIjoge1xuICAgICAgICBcImZvbnRcIjogXCIxMnB0IEFyaWFsXCIsXG4gICAgICAgIFwiYm91bmRzQWxpZ25IXCI6IFwiY2VudGVyXCIsXG4gICAgICAgIFwiYm91bmRzQWxpZ25WXCI6IFwiY2VudGVyXCIsXG4gICAgICAgIFwiZmlsbFwiOiBcIiNGRkZGRkZcIlxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi4vY2xhc3Nlcy9CdXR0b25cIjtcblxuY2xhc3MgQnV5SW5NYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXkpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuYnV5SW5SZXF1ZXN0ZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNlYXRzID0ge307XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge1wiYnV0dG9uc1wiOiBbXSwgXCJtb2RhbFwiOiBudWxsLCBcImlucHV0Qm94XCI6IG51bGx9O1xuICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKHRoaXMuYnV0dG9uc0dyb3VwKTtcblxuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmRhdGEgPSB7XCJzZWF0TnVtXCI6IG51bGwsIFwiYnV5SW5cIjogbnVsbH07XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICBpZiAodGhpcy5kaXNwbGF5LmlucHV0RmllbGQgJiYgdGhpcy5kaXNwbGF5LmlucHV0RmllbGQudmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0RmllbGQudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0aWFsaXplKHNlYXRDb25maWcsIG9jY3VwaWVkU2VhdHMsIG1vZGFsQ29uZmlnKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VhdENvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCBzZWF0Q29uZmlnW2ldLngsIHNlYXRDb25maWdbaV0ueSwgdGhpcy5rZXksIHRoaXMuYnV0dG9uQ2xpY2tlZCwgdGhpcyk7XG4gICAgICAgICAgICBidXR0b24uc2VhdE51bSA9IGk7IC8vIFN0b3JlIGZvciB1c2Ugb24gY2xpY2tcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRGcmFtZXMoXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fb3ZlclwiLFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX291dFwiLFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX2Rvd25cIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl91cFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYnV0dG9uLnNldFRleHQoXCJCdXkgSW5cIik7XG4gICAgICAgICAgICB0aGlzLnNlYXRzW2ldID0ge1xuICAgICAgICAgICAgICAgIFwiYnV0dG9uXCI6IGJ1dHRvbixcbiAgICAgICAgICAgICAgICBcIm9jY3VwaWVkXCI6IG9jY3VwaWVkU2VhdHMuaW5kZXhPZihpKSAhPT0gLTFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuYnV0dG9ucy5wdXNoKGJ1dHRvbik7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cC5hZGQoYnV0dG9uKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cC52aXNpYmxlID0gdGhpcy5idXR0b25zVmlzaWJsZTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWxCYWNrZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCB0aGlzLmdhbWUudGV4dHVyZXMubW9kYWxCYWNrZ3JvdW5kKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsQmFja2dyb3VuZC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UobW9kYWxDb25maWcueCwgbW9kYWxDb25maWcueSwgdGhpcy5rZXksIFwibW9kYWxcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKHRoaXMuZGlzcGxheS5tb2RhbCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0Qm94ID0gdGhpcy5nYW1lLmFkZC5pbWFnZShtb2RhbENvbmZpZy5pbnB1dEJveC54LCBtb2RhbENvbmZpZy5pbnB1dEJveC55LCB0aGlzLmtleSwgXCJpbnB1dF9ib3hcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkuaW5wdXRCb3gpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkID0gdGhpcy5nYW1lLmFkZC5pbnB1dEZpZWxkKG1vZGFsQ29uZmlnLmlucHV0RmllbGQueCwgbW9kYWxDb25maWcuaW5wdXRGaWVsZC55LCB7XG4gICAgICAgICAgICBmb250OiAnMzJweCBBcmlhbCcsXG4gICAgICAgICAgICBmaWxsOiAnIzMzMzMzMycsXG4gICAgICAgICAgICB3aWR0aDogMjIwLFxuICAgICAgICAgICAgcGFkZGluZzogOCxcbiAgICAgICAgICAgIGJvcmRlcldpZHRoOiAwLFxuICAgICAgICAgICAgcGxhY2VIb2xkZXI6ICcyMC4wMCcsXG4gICAgICAgICAgICB0eXBlOiBQaGFzZXJJbnB1dC5JbnB1dFR5cGUubnVtYmVyLFxuICAgICAgICAgICAgZmlsbEFscGhhOiAwXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRCb3guYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmlucHV0RmllbGQpO1xuXG4gICAgICAgIGNvbnN0IGJ0blRleHRTdHlsZSA9IHtcbiAgICAgICAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgICAgICAgIFwiYWxpZ25cIjogXCJjZW50ZXJcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwgPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgbW9kYWxDb25maWcuY2FuY2VsQnV0dG9uLngsIG1vZGFsQ29uZmlnLmNhbmNlbEJ1dHRvbi55LCB0aGlzLmtleSwgdGhpcy5jYW5jZWwsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FuY2VsLnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX3NlY29uZGFyeV9vdmVyXCIsXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfb3V0XCIsXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X3VwXCJcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbC5zZXRUZXh0U3R5bGUoYnRuVGV4dFN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbC5zZXRUZXh0KFwiQ0FOQ0VMXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmNhbmNlbCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnN1Ym1pdCA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCBtb2RhbENvbmZpZy5zdWJtaXRCdXR0b24ueCwgbW9kYWxDb25maWcuc3VibWl0QnV0dG9uLnksIHRoaXMua2V5LCB0aGlzLnN1Ym1pdCwgdGhpcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0RnJhbWVzKFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9vdmVyXCIsXG4gICAgICAgICAgICBcImJ0bl9wcmltYXJ5X291dFwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9kb3duXCIsXG4gICAgICAgICAgICBcImJ0bl9wcmltYXJ5X3VwXCJcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnN1Ym1pdC5zZXRUZXh0U3R5bGUoYnRuVGV4dFN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnN1Ym1pdC5zZXRUZXh0KFwiQlVZIElOXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LnN1Ym1pdCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgbmV3UGxheWVyKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5zZWF0c1twbGF5ZXJEYXRhLnNlYXRdLm9jY3VwaWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgcGxheWVyTGVmdChwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuc2VhdHNbcGxheWVyRGF0YS5zZWF0XS5vY2N1cGllZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICBmb3IgKGxldCBzZWF0TnVtIGluIHRoaXMuc2VhdHMpIHtcbiAgICAgICAgICAgIGxldCBzZWF0ID0gdGhpcy5zZWF0c1tzZWF0TnVtXTtcbiAgICAgICAgICAgIHNlYXQuYnV0dG9uLnZpc2libGUgPSAhc2VhdC5vY2N1cGllZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cC52aXNpYmxlID0gdGhpcy5idXR0b25zVmlzaWJsZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLnZpc2libGUgPSB0aGlzLm1vZGFsVmlzaWJsZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsQmFja2dyb3VuZC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgfVxuXG4gICAgYnV0dG9uQ2xpY2tlZChidXR0b24pIHtcbiAgICAgICAgdGhpcy5kYXRhLnNlYXROdW0gPSBidXR0b24uc2VhdE51bTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIGNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc3VibWl0KCkge1xuICAgICAgICB0aGlzLmRhdGEuYnV5SW4gPSB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZC52YWx1ZTtcbiAgICAgICAgdGhpcy5idXlJblJlcXVlc3RlZC5kaXNwYXRjaCh0aGlzLmRhdGEuc2VhdE51bSwgdGhpcy5kYXRhLmJ1eUluKTtcbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldEJ1dHRvbnNWaXNpYmxlKHZpc2libGUpIHtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnV5SW5NYW5hZ2VyOyIsImltcG9ydCBDYXJkIGZyb20gXCIuLi9jbGFzc2VzL0NhcmRcIjtcblxuY2xhc3MgQ2FyZE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGF1dG9IaWRlID0gZmFsc2UsIGtleSA9IFwiY2FyZHNcIikge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmF1dG9IaWRlID0gYXV0b0hpZGU7IC8vIEF1dG8taGlkZSBhbGwgZmFjZSBkb3duIGNhcmRzP1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5jYXJkcyA9IFtdO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5fbWFzayA9IG51bGw7ICAvLyBBIG1hc2sgYXBwbGllZCB0byBhbGwgY2FyZHMgaW4gZGlzcGxheUdyb3VwXG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShudW1fY2FyZHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fY2FyZHM7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNhcmQgPSBuZXcgQ2FyZCh0aGlzLmdhbWUsIDAsIDAsIHRoaXMua2V5LCB0aGlzLCB0aGlzLmF1dG9IaWRlKTtcbiAgICAgICAgICAgIGNhcmQuaW5pdGlhbGl6ZSh7fSk7XG4gICAgICAgICAgICBjYXJkLmluaXRpYWxpemVEaXNwbGF5KCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FyZHMucHVzaChjYXJkKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChjYXJkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldENhcmROYW1lcyhuYW1lcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLm5hbWUgPSBuYW1lc1tpXTtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0udXBkYXRlRGlzcGxheSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS5uYW1lID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0udXBkYXRlRGlzcGxheSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHMubGVuZ3RoO1xuICAgIH1cblxuICAgIHNldCBtYXNrKG1hc2spIHtcbiAgICAgICAgdGhpcy5fbWFzayA9IG1hc2s7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLm1hc2sgPSBtYXNrO1xuICAgIH1cblxuICAgIGdldCBtYXNrKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFzaztcbiAgICB9XG5cbiAgICBnZXQgY2FyZFdpZHRoKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2FyZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYXJkc1swXS53aWR0aDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmRNYW5hZ2VyO1xuIiwiaW1wb3J0IENoaXAgZnJvbSBcIi4uL2NsYXNzZXMvQ2hpcFwiO1xuaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcblxuY2xhc3MgVG9vbHRpcCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5LCBwYWRkaW5nID0gMTApIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMucGFkZGluZyA9IHBhZGRpbmc7XG5cbiAgICAgICAgdGhpcy5fdGV4dCA9IFwiXCI7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IG51bGwsXG4gICAgICAgICAgICB0ZXh0OiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgdGV4dCh0ZXh0KSB7XG4gICAgICAgIHRoaXMuX3RleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dC50ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy5yZVBvcygpO1xuICAgIH1cblxuICAgIGdldCB0ZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dDtcbiAgICB9XG5cbiAgICBzZXQgdmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLnZpc2libGUgPSB2aXNpYmxlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIHRoaXMua2V5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhY2tncm91bmQuYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMiwgXCJcIik7ICAgLy8gVE9ETyAtIE5vIG1hZ2ljIG51bWJlcnMgKGxlYXZpbmcgZm9yIG5vdyBiZWNhdXNlIGZ1Y2sgdHJ5aW5nIHRvIHBvc2l0aW9uIHRleHQgdmVydGljYWxseSlcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQuc2V0U3R5bGUoe1xuICAgICAgICAgICAgXCJmb250XCI6IFwiMTZwdCBBcmlhbFwiLFxuICAgICAgICAgICAgXCJmaWxsXCI6IFwiI0ZGRkZGRlwiXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dC5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmJhY2tncm91bmQpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnRleHQpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVQb3MoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXh0LnNjYWxlLnNldFRvKDEpO1xuICAgICAgICBjb25zdCB0ZXh0QXJlYSA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLndpZHRoIC0gKHRoaXMucGFkZGluZyAqIDIpO1xuICAgICAgICBpZiAodGhpcy5kaXNwbGF5LnRleHQud2lkdGggPiB0ZXh0QXJlYSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQuc2NhbGUuc2V0VG8odGV4dEFyZWEgLyB0aGlzLmRpc3BsYXkudGV4dC53aWR0aCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIENoaXBNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXksIHZhbHVlcykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgICAgICAgdGhpcy5zdGFja0NoaXBzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb2xvclVwID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jaGlwcyA9IFtdO1xuICAgICAgICB0aGlzLnBvb2wgPSBbXTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBudWxsO1xuICAgICAgICB0aGlzLnRvb2x0aXAgPSBuZXcgVG9vbHRpcCh0aGlzLmdhbWUsIHRoaXMuZ2FtZS50ZXh0dXJlcy50ZXh0VW5kZXJsYXkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge1xuICAgICAgICAgICAgY2hpcHM6IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKSxcbiAgICAgICAgICAgIHRvb2x0aXA6IHRoaXMudG9vbHRpcC5kaXNwbGF5R3JvdXBcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50cmFuc2ZlckFuaW1hdGlvbiA9IHRoaXMuYW5pbWF0ZUNoaXBDYXNjYWRlO1xuICAgICAgICB0aGlzLnRyYW5zZmVyQ29tcGxldGUgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnBpbGVSYWRpdXMgPSAzMDtcbiAgICB9XG5cbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy50b29sdGlwLnRleHQgPSBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5fdmFsdWUpO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnRvb2x0aXAuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRvb2x0aXAueSA9IHRoaXMuZGlzcGxheS50b29sdGlwLmhlaWdodDtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5jaGlwcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkudG9vbHRpcCk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoMCk7XG4gICAgfVxuXG4gICAgZ2V0Q2hpcCgpIHtcbiAgICAgICAgbGV0IGNoaXAgPSB0aGlzLnBvb2wucG9wKCk7XG4gICAgICAgIGlmICghY2hpcCkge1xuICAgICAgICAgICAgY2hpcCA9IG5ldyBDaGlwKHRoaXMuZ2FtZSwgMCwgMCwgdGhpcy5rZXksIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRDaGlwSW5wdXRzKGNoaXApO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmNoaXBzLmFkZENoaWxkKGNoaXApO1xuICAgICAgICB9XG4gICAgICAgIGNoaXAucmV2aXZlKCk7XG4gICAgICAgIGNoaXAucGFyZW50LmJyaW5nVG9Ub3AoY2hpcCk7XG4gICAgICAgIHRoaXMuY2hpcHMucHVzaChjaGlwKTtcbiAgICAgICAgcmV0dXJuIGNoaXA7XG4gICAgfVxuXG4gICAgc2V0Q2hpcElucHV0cyhjaGlwKSB7XG4gICAgICAgIGNoaXAuZXZlbnRzLm9uSW5wdXRPdmVyLnJlbW92ZUFsbCgpO1xuICAgICAgICBjaGlwLmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4ge3RoaXMudG9vbHRpcC52aXNpYmxlID0gdHJ1ZX0pO1xuXG4gICAgICAgIGNoaXAuZXZlbnRzLm9uSW5wdXRPdXQucmVtb3ZlQWxsKCk7XG4gICAgICAgIGNoaXAuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHt0aGlzLnRvb2x0aXAudmlzaWJsZSA9IGZhbHNlfSk7XG4gICAgfVxuXG4gICAgc2V0VmFsdWUodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl92YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29sb3JVcCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgLT0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgKz0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgeVBvcyA9IDA7XG4gICAgICAgIGxldCB2YWx1ZXNQdHIgPSB0aGlzLnZhbHVlcy5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAodmFsdWUgPj0gMjUpIHtcbiAgICAgICAgICAgIHdoaWxlICh2YWx1ZSA8IHRoaXMudmFsdWVzW3ZhbHVlc1B0cl0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXNQdHItLTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVzUHRyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjaGlwID0gdGhpcy5nZXRDaGlwKCk7XG4gICAgICAgICAgICBjaGlwLnZhbHVlID0gdGhpcy52YWx1ZXNbdmFsdWVzUHRyXTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhY2tDaGlwcykge1xuICAgICAgICAgICAgICAgIGNoaXAueSA9IHlQb3M7XG4gICAgICAgICAgICAgICAgeVBvcyAtPSA1O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGlwcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpcC54ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgY2hpcC55ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmFuZFBvcyA9IHRoaXMucmFuZENoaXBQb3MoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hpcC54ID0gcmFuZFBvcy54O1xuICAgICAgICAgICAgICAgICAgICBjaGlwLnkgPSByYW5kUG9zLnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgLT0gdGhpcy52YWx1ZXNbdmFsdWVzUHRyXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICBsZXQgY2hpcDtcbiAgICAgICAgd2hpbGUgKGNoaXAgPSB0aGlzLmNoaXBzLnBvcCgpKSB7XG4gICAgICAgICAgICB0aGlzLnBvb2wucHVzaChjaGlwKTtcbiAgICAgICAgICAgIGNoaXAua2lsbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJDaGlwKGNoaXApIHtcbiAgICAgICAgLy8gUmVtb3ZlIGNoaXAgZnJvbSB0aGlzLmNoaXBzIGlmIGZvdW5kXG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaXBzW2ldLmlkID09PSBjaGlwLmlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGlwcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICB0aGlzLnBvb2wucHVzaChjaGlwKTtcbiAgICAgICAgICAgIGNoaXAua2lsbCgpO1xuICAgICAgICAgICAgcmV0dXJuIGNoaXA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0YWtlQ2hpcHMoY2hpcHMpIHtcbiAgICAgICAgY2hpcHMgPSBjaGlwcy5zbGljZSgpO1xuICAgICAgICBsZXQgbmV3Q2hpcHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IG5ld0NoaXAgPSB0aGlzLnRha2VDaGlwKGNoaXBzW2ldKTtcbiAgICAgICAgICAgIG5ld0NoaXBzLnB1c2gobmV3Q2hpcCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyYW5zZmVyQW5pbWF0aW9uKG5ld0NoaXBzKTtcbiAgICB9XG5cbiAgICB0YWtlQ2hpcChzcmNDaGlwKSB7XG4gICAgICAgIGxldCBuZXdDaGlwID0gdGhpcy5nZXRDaGlwKCk7XG4gICAgICAgIG5ld0NoaXAuY2xvbmUoc3JjQ2hpcCk7XG4gICAgICAgIHRoaXMuc2V0Q2hpcElucHV0cyhuZXdDaGlwKTtcblxuICAgICAgICBzcmNDaGlwLm1hbmFnZXIuY2xlYXJDaGlwKHNyY0NoaXApO1xuXG4gICAgICAgIHRoaXMudmFsdWUgKz0gc3JjQ2hpcC52YWx1ZTtcblxuICAgICAgICByZXR1cm4gbmV3Q2hpcDtcbiAgICB9XG5cbiAgICBhbmltYXRlU3RhY2tUcmFuc2ZlcigpIHtcblxuICAgIH1cblxuICAgIGFuaW1hdGVDaGlwQ2FzY2FkZShjaGlwcykge1xuICAgICAgICBsZXQgZGVsYXkgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpcCA9IGNoaXBzW2ldO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnRpbWUuZXZlbnRzLmFkZChkZWxheSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByYW5kUG9zID0gdGhpcy5yYW5kQ2hpcFBvcygpO1xuICAgICAgICAgICAgICAgIGxldCB0d2VlbiA9IHRoaXMuZ2FtZS5hZGQudHdlZW4oY2hpcCkudG8oe3g6IHJhbmRQb3MueCwgeTogcmFuZFBvcy55fSwgMjAwLCBQaGFzZXIuRWFzaW5nLlF1YWRyYXRpYy5Jbk91dCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IGNoaXBzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4gdGhpcy50cmFuc2ZlckNvbXBsZXRlLmRpc3BhdGNoKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgZGVsYXkgKz0gMTAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmFuZENoaXBQb3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKC10aGlzLnBpbGVSYWRpdXMsIHRoaXMucGlsZVJhZGl1cyksXG4gICAgICAgICAgICB5OiB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKC10aGlzLnBpbGVSYWRpdXMsIHRoaXMucGlsZVJhZGl1cylcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoaXBNYW5hZ2VyOyIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL2NsYXNzZXMvUGxheWVyXCI7XG5cbmNsYXNzIFBsYXllck1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVzZXJJZCwgc2VhdENvbmZpZywgY2hpcENvbmZpZykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgdGhpcy5zZWF0Q29uZmlnID0gc2VhdENvbmZpZztcbiAgICAgICAgdGhpcy5jaGlwQ29uZmlnID0gY2hpcENvbmZpZztcblxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTsgIC8vIERpcmVjdCBhY2Nlc3MgdG8gdGhlIFBsYXllciBvYmplY3RzXG4gICAgICAgIHRoaXMudXNlclBsYXllciA9IG51bGw7ICAvLyBUaGUgdXNlcidzIHBsYXllciBvYmplY3QsIGlmIGF2YWlsYWJsZVxuICAgICAgICB0aGlzLm5leHRQbGF5ZXIgPSBudWxsOyAgLy8gVGhlIHBsYXllciB0aGF0IHRoZSBnYW1lIGV4cGVjdHMgdG8gYWN0IG5leHRcbiAgICAgICAgdGhpcy5kZWFsZXJQbGF5ZXIgPSBudWxsOyAgIC8vIEN1cnJlbnQgaGFuZCdzIGRlYWxlclxuXG4gICAgICAgIC8vIENvbnRhaW5zIGFsbCBkaXNwbGF5IGVsZW1lbnRzIGZvciBhbGwgcGxheWVycyBpbiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBnZXQgbGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKHBsYXllckRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1BsYXllcihwbGF5ZXJEYXRhW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMuZ2FtZSwgdGhpcy5jaGlwQ29uZmlnKTtcbiAgICAgICAgcGxheWVyLmluaXRpYWxpemUocGxheWVyRGF0YSk7XG4gICAgICAgIHBsYXllci5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAueCA9IHRoaXMuc2VhdENvbmZpZ1twbGF5ZXJEYXRhLnNlYXRdLng7XG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAueSA9IHRoaXMuc2VhdENvbmZpZ1twbGF5ZXJEYXRhLnNlYXRdLnk7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHBsYXllci5kaXNwbGF5R3JvdXApO1xuXG4gICAgICAgIGlmIChwbGF5ZXIudXNlcklkID09PSB0aGlzLnVzZXJJZCkge1xuICAgICAgICAgICAgdGhpcy51c2VyUGxheWVyID0gcGxheWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICB9XG5cbiAgICBwbGF5ZXJMZWZ0KHBsYXllckRhdGEpIHtcbiAgICAgICAgbGV0IHBsYXllciA9IHRoaXMuZ2V0QnlJZChwbGF5ZXJEYXRhLmlkKTtcblxuICAgICAgICBpZiAoIXBsYXllcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ291bGQgbm90IGZpbmQgcGxheWVyIGF0IHRhYmxlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheWVyLmRpc3BsYXlHcm91cC5kZXN0cm95KCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldID09PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBsYXllciA9PT0gdGhpcy51c2VyUGxheWVyKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXJQbGF5ZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICB9XG5cbiAgICBnZXRCeUlkKGlkKSB7XG4gICAgICAgIC8vIFRPRE8gLSBEbyB0aGlzIHdpdGhvdXQgaXRlcmF0aW5nIC0tIGJ1aWxkIG1hcCBvbiBpbml0P1xuICAgICAgICAvLyBUT0RPIC0gU2hvdWxkIHRoaXMgZXZlciByZXR1cm4gbnVsbD9cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcnNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxheWVyc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRCeVNlYXQoc2VhdCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcnNbaV0uc2VhdCA9PT0gc2VhdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IGEgbGlzdCBvZiBhbGwgb2NjdXBpZWQgc2VhdHMgYXQgdGhlIHRhYmxlXG4gICAgICogQHJldHVybnMge251bWJlcltdfSAtIFRoZSBJRHMgb2Ygb2NjdXBpZWQgc2VhdHNcbiAgICAgKi9cbiAgICBnZXRPY2N1cGllZFNlYXRzKCkge1xuICAgICAgICBsZXQgb2NjdXBpZWRTZWF0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb2NjdXBpZWRTZWF0cy5wdXNoKHRoaXMucGxheWVyc1tpXS5zZWF0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2NjdXBpZWRTZWF0cztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllck1hbmFnZXI7XG4iLCJjb25zdCBpc1N0cmluZyA9IHZhbCA9PiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbmNvbnN0IGlzQmxvYiA9IHZhbCA9PiB2YWwgaW5zdGFuY2VvZiBCbG9iO1xuXG5wb2x5ZmlsbC5jYWxsKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnID8gd2luZG93IDogdGhpcyB8fCB7fSk7XG5cbmZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICBpZiAoaXNTdXBwb3J0ZWQuY2FsbCh0aGlzKSkgcmV0dXJuO1xuXG4gIGlmICghKCduYXZpZ2F0b3InIGluIHRoaXMpKSB0aGlzLm5hdmlnYXRvciA9IHt9O1xuICB0aGlzLm5hdmlnYXRvci5zZW5kQmVhY29uID0gc2VuZEJlYWNvbi5iaW5kKHRoaXMpO1xufTtcblxuZnVuY3Rpb24gc2VuZEJlYWNvbih1cmwsIGRhdGEpIHtcbiAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50ICYmIHRoaXMuZXZlbnQudHlwZTtcbiAgY29uc3Qgc3luYyA9IGV2ZW50ID09PSAndW5sb2FkJyB8fCBldmVudCA9PT0gJ2JlZm9yZXVubG9hZCc7XG5cbiAgY29uc3QgeGhyID0gKCdYTUxIdHRwUmVxdWVzdCcgaW4gdGhpcykgPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICB4aHIub3BlbignUE9TVCcsIHVybCwgIXN5bmMpO1xuICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICcqLyonKTtcblxuXG4gIGlmIChpc1N0cmluZyhkYXRhKSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jyk7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9ICd0ZXh0L3BsYWluJztcbiAgfSBlbHNlIGlmIChpc0Jsb2IoZGF0YSkgJiYgZGF0YS50eXBlKSB7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsIGRhdGEudHlwZSk7XG4gIH1cblxuICB0cnkge1xuICAgIHhoci5zZW5kKGRhdGEpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc1N1cHBvcnRlZCgpIHtcbiAgcmV0dXJuICgnbmF2aWdhdG9yJyBpbiB0aGlzKSAmJiAoJ3NlbmRCZWFjb24nIGluIHRoaXMubmF2aWdhdG9yKTtcbn0iLCJpbXBvcnQgY29uZmlnIGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCBDb250cm9sbGVyIGZyb20gXCIuLi9jbGFzc2VzL0NvbnRyb2xsZXJcIjtcblxuY2xhc3MgQm9vdCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmluaXRpYWxEYXRhID0gdGhpcy5hdWdtZW50SW5pdGlhbERhdGEoaW5pdGlhbERhdGEpO1xuICAgICAgICB0aGlzLmdhbWUuY29uZmlnID0gY29uZmlnO1xuXG4gICAgICAgIC8vIFRPRE8gLSBUaGlzIHNob3VsZCBjb21lIGZyb20gc29tZXdoZXJlIGR5bmFtaWNcbiAgICAgICAgdGhpcy5nYW1lLnJ1bGVzID0ge1xuICAgICAgICAgICAgYW50ZTogMCxcbiAgICAgICAgICAgIGJsaW5kczoge1xuICAgICAgICAgICAgICAgIHNtYWxsOiAyNSxcbiAgICAgICAgICAgICAgICBiaWc6IDUwXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEucGxheWVySWQsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50b2tlbik7XG5cbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5lbXVsYXRvckVuYWJsZWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5nYW1lID0gdGhpcy5nYW1lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoXCJsb2FkXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBTdW1tYXJ5IENhbGN1bGF0ZSBhZGRpdGlvbmFsIHZhbHVlcyB0byBzdG9yZSBvbiBnYW1lLmluaXRpYWxEYXRhXG4gICAgICpcbiAgICAgKiBUbyBzYXZlIG9uIHNlcnZlci1zaWRlIHByb2Nlc3NpbmcgYW5kIGRhdGEtdHJhbnNmZXIgbG9hZCwgdGhpc1xuICAgICAqIG1ldGhvZCBpcyBhIHBsYWNlIHRvIGdlbmVyYXRlIGFkZGl0aW9uYWwgZGF0YSBuZWVkZWQgYnkgdGhlIGdhbWVcbiAgICAgKiB3aGljaCBtYXkgYmUgZGVyaXZlZCBmcm9tIHRoZSBkYXRhIHNlbnQgZnJvbSB0aGUgYmFjayBlbmQuXG4gICAgICovXG4gICAgYXVnbWVudEluaXRpYWxEYXRhKGluaXRpYWxEYXRhKSB7XG4gICAgICAgIGluaXRpYWxEYXRhLm9jY3VwaWVkU2VhdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbml0aWFsRGF0YS5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpbml0aWFsRGF0YS5vY2N1cGllZFNlYXRzLnB1c2goaW5pdGlhbERhdGEucGxheWVyc1tpXS5zZWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbml0aWFsRGF0YTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvb3Q7IiwiY2xhc3MgTG9hZCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgcHJlbG9hZCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJiYWNrZ3JvdW5kXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYmFja2dyb3VuZC5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwicmVkQ2lyY2xlXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcmVkY2lyY2xlLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImNhcmRzXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcInBhbmVsXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcGFuZWwucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcGFuZWwuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImRlYWxlckJ1dHRvblwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2J1dHRvbi5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9idXR0b24uanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImJ1eUluXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV5aW4ucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV5aW4uanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImNoaXBzXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2hpcHMucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2hpcHMuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcIm5hbWVwbGF0ZVwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL25hbWVwbGF0ZS5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9uYW1lcGxhdGUuanNvblwiKTtcblxuICAgICAgICB0aGlzLmdhbWUudGV4dHVyZXMgPSB0aGlzLmNyZWF0ZUN1c3RvbVRleHR1cmVzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkUGx1Z2lucygpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibWFpblwiKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDdXN0b21UZXh0dXJlcygpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0ge307XG5cbiAgICAgICAgbGV0IGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoNCwgMHgwMDAwMDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgxMDAsIDEwMCwgMTAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlU3F1YXJlXCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgMzAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlUmVjdFwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweDAwMDAwMCwgMC41KTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgdGhpcy5nYW1lLndpZHRoLCB0aGlzLmdhbWUuaGVpZ2h0KTtcbiAgICAgICAgdGV4dHVyZXNbXCJtb2RhbEJhY2tncm91bmRcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweDAwMDAwMCwgMC41KTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgdGhpcy5nYW1lLmNvbmZpZy5wb3B1cC53aWR0aCwgdGhpcy5nYW1lLmNvbmZpZy5wb3B1cC5oZWlnaHQpO1xuICAgICAgICB0ZXh0dXJlc1tcInRleHRVbmRlcmxheVwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgcmV0dXJuIHRleHR1cmVzO1xuICAgIH1cblxuICAgIGxvYWRQbHVnaW5zKCkge1xuICAgICAgICB0aGlzLmdhbWUuYWRkLnBsdWdpbihQaGFzZXJJbnB1dC5QbHVnaW4pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9hZDtcbiIsImltcG9ydCB7QWN0aW9uLCBBY3Rpb25UZXh0fSBmcm9tIFwiLi4vY2xhc3Nlcy9BY3Rpb25cIjtcbmltcG9ydCBCdXlJbk1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0J1eUluTWFuYWdlclwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuaW1wb3J0IERlYWxlckJ1dHRvbiBmcm9tIFwiLi4vY2xhc3Nlcy9EZWFsZXJCdXR0b25cIjtcbmltcG9ydCBQYW5lbCBmcm9tIFwiLi4vY2xhc3Nlcy9QYW5lbFwiO1xuaW1wb3J0IFBsYXllck1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL1BsYXllck1hbmFnZXJcIjtcbmltcG9ydCBQb3QgZnJvbSBcIi4uL2NsYXNzZXMvUG90XCI7XG5pbXBvcnQgUG9rZXIgZnJvbSBcIi4uL1Bva2VyXCI7XG5pbXBvcnQgU1NFIGZyb20gXCIuLi9TU0VcIjtcbmltcG9ydCBUd2VlblF1ZXVlIGZyb20gXCIuLi9jbGFzc2VzL1R3ZWVuUXVldWVcIjtcblxuY2xhc3MgTWFpbiBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlU1NFVXJsKTtcbiAgICAgICAgdGhpcy51c2VyX3NzZSA9IG5ldyBTU0UodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudXNlclNTRVVybCk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmxvYWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuZGlzY29ubmVjdEJlYWNvbigpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSB0aGlzLmdhbWUuYWRkLmltYWdlKDAsIDAsIFwiYmFja2dyb3VuZFwiKTtcbiAgICAgICAgdGhpcy5uZXdIYW5kQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMTAwLCBcIm5ld1xcbmhhbmRcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLm5ld0hhbmQpO1xuICAgICAgICB0aGlzLmRlYWxCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAyMjAsIFwiZGVhbFwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuZGVhbCk7XG4gICAgICAgIHRoaXMubGVhdmVCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAzNDAsIFwibGVhdmVcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmxlYXZlVGFibGUpO1xuICAgICAgICB0aGlzLmJiQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgNDYwLCBcIkJCXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5iYik7XG4gICAgICAgIHRoaXMuc2JCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCA1ODAsIFwiU0JcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLnNiKTtcblxuICAgICAgICB0aGlzLmdhbWUucGxheWVycyA9IG5ldyBQbGF5ZXJNYW5hZ2VyKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnVzZXJJZCwgdGhpcy5nYW1lLmNvbmZpZy5zZWF0cywgdGhpcy5nYW1lLmNvbmZpZy5jaGlwcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmluaXRpYWxpemUodGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcnMsIHRoaXMuZ2FtZS5jb25maWcuc2VhdHMpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5kZWFsZXJCdXR0b24gPSBuZXcgRGVhbGVyQnV0dG9uKHRoaXMuZ2FtZSk7XG4gICAgICAgIHdpbmRvdy5idXR0b24gPSB0aGlzLmdhbWUuZGVhbGVyQnV0dG9uO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmdhbWUuaW5pdGlhbERhdGEpO1xuICAgICAgICB0aGlzLmdhbWUuZGVhbGVyQnV0dG9uLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZS5kZWFsZXJCdXR0b24uaW5wdXQuZW5hYmxlRHJhZyh0cnVlKTtcbiAgICAgICAgdGhpcy5nYW1lLmRlYWxlckJ1dHRvbi5ldmVudHMub25EcmFnU3RvcC5hZGQoc3ByaXRlID0+IGNvbnNvbGUubG9nKHt4OiBzcHJpdGUueCwgeTogc3ByaXRlLnl9KSk7XG5cbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkID0gbmV3IENhcmRNYW5hZ2VyKHRoaXMuZ2FtZSwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5pbml0aWFsaXplKDUpO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLnNldEFsbChcInZpc2libGVcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuYWxpZ24oLTEsIDEsIHRoaXMuZ2FtZS5ib2FyZC5jYXJkV2lkdGggKiAxLjIsIDEpO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmNlbnRlclggPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWDtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5jZW50ZXJZID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuc2V0QWxsKFwidmlzaWJsZVwiLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBvdCA9IG5ldyBQb3QodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgICAgICB0aGlzLmdhbWUucG90LmNoaXBzLmRpc3BsYXlHcm91cC5jZW50ZXJYID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclg7ICAgICAvLyBUT0RPIC0gUG9zaXRpb25zIGluIGNvbmZpZ1xuICAgICAgICB0aGlzLmdhbWUucG90LmNoaXBzLmRpc3BsYXlHcm91cC5jZW50ZXJZID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclkgLSAxNDA7XG5cbiAgICAgICAgLy8gVE9ETyAtIFRoZXNlIHNob3VsZCBnbyBzb21ld2hlcmUgZWxzZS4gTWF5YmUgaW4gUG90P1xuICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsID0gbmV3IFBhbmVsKHRoaXMuZ2FtZSwgXCJwYW5lbFwiKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmRpc3BsYXlHcm91cC54ID0gdGhpcy5nYW1lLmNvbmZpZy5wYW5lbC5wb3MueDtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmRpc3BsYXlHcm91cC55ID0gdGhpcy5nYW1lLmNvbmZpZy5wYW5lbC5wb3MueTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmFsd2F5c1Zpc2libGUgPSB0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbiA9IG5ldyBCdXlJbk1hbmFnZXIodGhpcy5nYW1lLCBcImJ1eUluXCIpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uaW5pdGlhbGl6ZSh0aGlzLmdhbWUuY29uZmlnLnNlYXRzLCB0aGlzLmdhbWUucGxheWVycy5nZXRPY2N1cGllZFNlYXRzKCksIHRoaXMuZ2FtZS5jb25maWcuYnV5SW5Nb2RhbCk7XG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbi5zZXRCdXR0b25zVmlzaWJsZSh0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyID09PSBudWxsKTtcblxuICAgICAgICB0aGlzLmdhbWUucXVldWUgPSBuZXcgVHdlZW5RdWV1ZSh0aGlzLmdhbWUpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcnMoKTtcblxuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld0hhbmRcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdIYW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5kZWFsZXJQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEuZGVhbGVyKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY2FyZHMucmVzZXQoKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNEZWFsZXI6IHBsYXllci5pZCA9PT0gZGF0YS5kZWFsZXIsXG4gICAgICAgICAgICAgICAgICAgIGlzTmV4dDogcGxheWVyLmlkID09PSBkYXRhLm5leHQsXG4gICAgICAgICAgICAgICAgICAgIHJvdW5kQmV0OiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImRlYWxcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWFsOiBcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgIGxldCBkZWxheSA9IDA7XG4gICAgICAgICAgICBsZXQgc2VhdHMgPSB0aGlzLmdhbWUucGxheWVycy5nZXRPY2N1cGllZFNlYXRzKCk7XG4gICAgICAgICAgICBsZXQgc2VhdEluZGV4ID0gc2VhdHMuaW5kZXhPZih0aGlzLmdhbWUucGxheWVycy5kZWFsZXJQbGF5ZXIuc2VhdCk7XG4gICAgICAgICAgICBzZWF0SW5kZXggPSAoc2VhdEluZGV4ICsgMSkgJSBzZWF0cy5sZW5ndGg7ICAvLyBTdGFydCB3aXRoIHBsYXllciB0byBsZWZ0IG9mIGRlYWxlclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWF0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoZGVsYXksICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlTZWF0KHNlYXRzW3NlYXRJbmRleF0pLmFuaW1hdGVEZWFsKCk7XG4gICAgICAgICAgICAgICAgICAgIHNlYXRJbmRleCA9IChzZWF0SW5kZXggKyAxKSAlIHNlYXRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgICAgICBkZWxheSArPSAyMDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KFBva2VyLmdldE1pbkJldCh0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5nYW1lLmluaXRpYWxEYXRhLmVtdWxhdG9yRW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJlbXVsYXRlRGVhbFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZW11bGF0ZURlYWw6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBsYXllckRhdGEgPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKHBsYXllckRhdGEucGxheWVySWQpLmNhcmRzLnNldENhcmROYW1lcyhwbGF5ZXJEYXRhLmhvbGRpbmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1JvdW5kXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3Um91bmQ6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wb3QuZ2F0aGVyQ2hpcHModGhpcy5nYW1lLnBsYXllcnMucGxheWVycyk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXS51cGRhdGUoe3JvdW5kQmV0OiAwfSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldCgwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiYWN0aW9uXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWN0aW9uOiBcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgIGlmIChkYXRhLmFjdGlvblR5cGUgPT09IEFjdGlvbi5GT0xEKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLnBsYXllcklkKS5hbmltYXRlRm9sZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQuc2V0Q2FyZE5hbWVzKGRhdGEuYm9hcmQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5wbGF5ZXJJZCkudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBiYWxhbmNlOiBkYXRhLnBsYXllckJhbGFuY2UsXG4gICAgICAgICAgICAgICAgaXNOZXh0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICByb3VuZEJldDogZGF0YS5wbGF5ZXJSb3VuZEJldFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEucGxheWVySWQpLm5hbWVwbGF0ZS5mbGFzaCh0aGlzLnBhcnNlQWN0aW9uVGV4dChkYXRhKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCkudXBkYXRlKHtpc05leHQ6IHRydWV9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IGRhdGEucm91bmRCZXQ7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IGRhdGEucm91bmRSYWlzZTtcblxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldChQb2tlci5nZXRNaW5CZXQodGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJoYW5kQ29tcGxldGVcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoYW5kQ29tcGxldGU6IFwiLCBkYXRhKTtcblxuICAgICAgICAgICAgLy8gVE9ETyAtIEhhbmRsZSBzcGxpdCBwb3RzXG4gICAgICAgICAgICAvLyBpZiAoZGF0YS53aW5uZXJzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIC8vIE5PVEUgLSBUaGlzIGlzIGEgdGVtcG9yYXJ5IHN0b3BnYXBcbiAgICAgICAgICAgIGlmIChkYXRhLndpbm5lcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBzaG91bGQgYmUgaG93IHRoZSBjb2RlIGZ1bmN0aW9ucyAtLSBhbGwgd2lubmVycyBjYWxsXG4gICAgICAgICAgICAgICAgLy8gY2hpcHMudGFrZUNoaXBzIG9uIGEgc3BlY2lmaWMgcG90LiBJZiB0aGVyZSBhcmUgbXVsdGlwbGVcbiAgICAgICAgICAgICAgICAvLyB3aW5uZXJzLCB0aGUgcG90IG11c3QgaGF2ZSBhbHJlYWR5IGJlZW4gc3BsaXQgaW50byB0aGVcbiAgICAgICAgICAgICAgICAvLyBhcHByb3ByaWF0ZSBzaXplIHBpbGVzXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLndpbm5lcnNbMF0uaWQpLmNoaXBzLnRha2VDaGlwcyh0aGlzLmdhbWUucG90LmNoaXBzLmNoaXBzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBqdXN0IGEgdGVtcG9yYXJ5IG92ZXJmbG93IG1lYXN1cmUuIElmIHRoZSBwb3Qgd2FzXG4gICAgICAgICAgICAgICAgLy8gc3BsaXQgb24gdGhlIGJhY2sgZW5kLCBkb24ndCBhbmltYXRlIGFueXRoaW5nLCBhcyB3ZSBhcmVuJ3RcbiAgICAgICAgICAgICAgICAvLyBzcGxpdHRpbmcgb24gdGhlIGZyb250IGVuZCB5ZXQuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLndpbm5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHdpbm5lciA9IGRhdGEud2lubmVyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZCh3aW5uZXIuaWQpLnVwZGF0ZSh7YmFsYW5jZTogd2lubmVyLmJhbGFuY2V9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBvdC5jaGlwcy5jbGVhcigpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnBsYXllcnMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzW2ldLmNoaXBzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1BsYXllclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3UGxheWVyOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXdQbGF5ZXIoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4ubmV3UGxheWVyKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnNldEJ1dHRvbnNWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIgPT09IG51bGwpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJwbGF5ZXJMZWZ0XCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwbGF5ZXJMZWZ0OiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJMZWZ0KGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnBsYXllckxlZnQoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4uc2V0QnV0dG9uc1Zpc2libGUodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllciA9PT0gbnVsbCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlLmFkZExpc3RlbmVyKFwiZGVhbFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVhbDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5jYXJkcy5zZXRDYXJkTmFtZXMoZGF0YS5ob2xkaW5ncyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwucHJpbWFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNlY29uZGFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnRlcnRpYXJ5Q2xpY2tlZC5hZGQodGhpcy5oYW5kbGVBY3Rpb24sIHRoaXMpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uYnV5SW5SZXF1ZXN0ZWQuYWRkKHRoaXMuZ2FtZS5jb250cm9sbGVyLmpvaW4sIHRoaXMuZ2FtZS5jb250cm9sbGVyKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJvdXRlIGFjdGlvbnMgdG8gY29udHJvbGxlciByZXF1ZXN0c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY3Rpb24gLSBUaGUgYWN0aW9uIHRvIGJlIHJlcXVlc3RlZCwgZGVmaW5lZCBpbiBBY3Rpb24uanNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmV0IC0gVGhlIGJldCAoaWYgYW55KSB0byBiZSBzZW50IHRvIHRoZSBjb250cm9sbGVyXG4gICAgICovXG4gICAgaGFuZGxlQWN0aW9uKGFjdGlvbiwgYmV0KSB7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5GT0xEOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmZvbGQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uLkNIRUNLOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5CRVQ6XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuYmV0KGJldCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkludmFsaWQgQWN0aW9uIFR5cGU6IFwiICsgYWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFRyYW5zZm9ybSBhY3Rpb24gZGF0YSBpbnRvIG1vcmUgZGVzY3JpcHRpdmUgYmV0IHN0cmluZ1xuICAgICAqXG4gICAgICogQWxsIGJldHMgYXJlIGJldHMsIGJ1dCBzb21lIHJlcXVpcmUgbW9yZSBkZXNjcmlwdGlvbiB0byBmb2xsb3cgcG9rZXJcbiAgICAgKiBjb252ZW50aW9uLiBTcGVjaWZpY2FsbHksIGEgYmV0IHdoaWNoIGp1c3QgZXF1YWxzIGFuIGV4aXN0aW5nIGJldCBpcyBhXG4gICAgICogY2FsbCwgYW5kIG9uZSB3aGljaCBpbmNyZWFzZXMgYW4gZXhpc3RpbmcgYmV0IGlzIGEgcmFpc2UuXG4gICAgICpcbiAgICAgKiBOT1RFOiBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgY2FsbGVkIEJFRk9SRSB0aGUgc3RhdGUncyBgcm91bmRCZXRgIGFuZFxuICAgICAqIGByb3VuZFJhaXNlYCB2YXJpYWJsZXMgYXJlIHVwZGF0ZWQsIGFzIHRoaXMgZnVuY3Rpb24gbXVzdCBjb21wYXJlXG4gICAgICogbmV3IGJldCBkYXRhIGFnYWluc3QgdGhlIHByZXZpb3VzIHN0YXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFjdGlvbkRhdGFcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIFRoZSB0ZXh0IHRvIGJlIGZsYXNoZWRcbiAgICAgKi9cbiAgICBwYXJzZUFjdGlvblRleHQoYWN0aW9uRGF0YSkge1xuICAgICAgICBsZXQgYWN0aW9uVGV4dCA9IEFjdGlvblRleHRbYWN0aW9uRGF0YS5hY3Rpb25UeXBlXTtcbiAgICAgICAgaWYgKGFjdGlvbkRhdGEuYWN0aW9uVHlwZSA9PT0gQWN0aW9uLkJFVCkge1xuICAgICAgICAgICAgaWYgKGFjdGlvbkRhdGEucGxheWVyUm91bmRCZXQgPT09IHRoaXMuZ2FtZS5yb3VuZEJldCkge1xuICAgICAgICAgICAgICAgIGFjdGlvblRleHQgPSBcIkNBTExcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uRGF0YS5wbGF5ZXJSb3VuZEJldCA+IHRoaXMuZ2FtZS5yb3VuZEJldCAmJiB0aGlzLmdhbWUucm91bmRCZXQgPiAwKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uVGV4dCA9IFwiUkFJU0VcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFjdGlvbkRhdGEucGxheWVyQmFsYW5jZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGFjdGlvblRleHQgPSBcIkFMTCBJTlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY3Rpb25UZXh0O1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIG1ha2VCdG4oeCwgeSwgdGV4dCwgdGV4dHVyZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ0biA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKHgsIHksIHRleHR1cmUsIGNhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgYnRuLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIGxldCBidG5UZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDAsIHRleHQpO1xuICAgICAgICBidG5UZXh0LmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICBidG4uYWRkQ2hpbGQoYnRuVGV4dCk7XG4gICAgICAgIGJ0bi50ZXh0ID0gYnRuVGV4dDtcblxuICAgICAgICByZXR1cm4gYnRuO1xuICAgIH1cblxuICAgIGRlYWwoKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL3RhYmxlcy8nICsgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlTmFtZSArICcvZGVhbC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgbmV3SGFuZCgpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignUE9TVCcsICcvdGFibGVzLycgKyB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVOYW1lICsgJy9uZXctaGFuZC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfTtcblxuICAgIGxlYXZlVGFibGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmxlYXZlKCk7XG4gICAgfVxuXG4gICAgYmIoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmJiKCk7XG4gICAgfTtcblxuICAgIHNiKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5zYigpO1xuICAgIH07XG5cbiAgICBnZW5lcmF0ZUJldHMocGxheWVyUm91bmRCZXQsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIFBva2VyLmdlbmVyYXRlQmV0cygyNSwgNTAsIHRoaXMuZ2FtZS5yb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1haW47XG4iXX0=
