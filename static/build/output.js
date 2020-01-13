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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NoaXAuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQ29udHJvbGxlci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9EZWFsZXJCdXR0b24uanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvTGFiZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvTmFtZXBsYXRlLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BhbmVsLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BsYXllci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9Qb3QuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvU2xpZGVyLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1R3ZWVuUXVldWUuanMiLCJzdGF0aWMvc3JjL2NvbmZpZy5qc29uIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9CdXlJbk1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL0NhcmRNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9DaGlwTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvUGxheWVyTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvcG9seWZpbGxzL3NlbmRiZWFjb24uanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Cb290LmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTG9hZC5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL01haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7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WTtBQUNULGlCQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLEtBQXJCO0FBQ0g7Ozs2QkFFSTtBQUNELGlCQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLEVBQXJCO0FBQ0g7Ozs2QkFFSTtBQUNELGlCQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLEVBQXJCO0FBQ0g7OztxQ0FFWSxjLEVBQWdCLGEsRUFBZTtBQUN4QyxtQkFBTyxnQkFBTSxZQUFOLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCLEtBQUssSUFBTCxDQUFVLFFBQXJDLEVBQStDLGNBQS9DLEVBQStELEtBQUssSUFBTCxDQUFVLFVBQXpFLEVBQXFGLGFBQXJGLENBQVA7QUFDSDs7OztFQTlTYyxPQUFPLEs7O2tCQWlUWCxJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEJvb3QgZnJvbSBcIi4vc3RhdGVzL0Jvb3RcIjtcbmltcG9ydCBMb2FkIGZyb20gXCIuL3N0YXRlcy9Mb2FkXCI7XG5pbXBvcnQgTWFpbiBmcm9tIFwiLi9zdGF0ZXMvTWFpblwiO1xuXG5jbGFzcyBHYW1lIGV4dGVuZHMgUGhhc2VyLkdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICB3aWR0aDogMTkyMCxcbiAgICAgICAgICAgIGhlaWdodDogMTA4MFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImJvb3RcIiwgQm9vdCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImxvYWRcIiwgTG9hZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcIm1haW5cIiwgTWFpbiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJib290XCIpO1xuICAgIH1cbn1cblxubmV3IEdhbWUoKTtcbiIsIi8qKlxuICogQHN1bW1hcnkgQSB1dGlsaXR5IGNsYXNzIG9mIFBva2VyLXNwZWNpZmljIGZ1bmN0aW9uYWxpdHlcbiAqL1xuY2xhc3MgUG9rZXIge1xuICAgIC8vIFRPRE8gLSBUaGlzIHV0aWxpdHkgaXMgaGlnaGx5LXNwZWNpZmljIHRvIE5MIGdhbWVzLCBtYXliZSBldmVuIHRvIE5MSEUuXG4gICAgLy8gIE5lZWQgdG8gbWFrZSBpdCBtb3JlIGdlbmVyaWMgZXZlbnR1YWxseSB0byBhbGxvdyBmb3Igb3RoZXIgZ2FtZVxuICAgIC8vICB0eXBlcy4gTGltaXQgYW5kIHBvdC1saW1pdCBnYW1lcyB3aWxsIHdvcmsgY29tcGxldGVseSBkaWZmZXJlbnRseS5cbiAgICAvLyAgQW50ZXMgYXJlIGFsc28gbm90IHN1cHBvcnRlZC5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdlbmVyYXRlIGFsbCBsZWdhbCByYWlzZXMgZm9yIHBsYXllclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzbWFsbEJsaW5kIC0gVGhlIHNtYWxsIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119IC0gVGhlIHZhbGlkIHJhaXNlc1xuICAgICAqL1xuICAgIHN0YXRpYyBnZW5lcmF0ZVJhaXNlcyhzbWFsbEJsaW5kLCBiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IHJhaXNlID0gUG9rZXIuZ2V0TWluUmFpc2UoYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICAgICAgbGV0IHJhaXNlcyA9IFtyYWlzZV07XG5cbiAgICAgICAgd2hpbGUgKHJhaXNlICsgc21hbGxCbGluZCA8PSBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgICAgICByYWlzZSArPSBzbWFsbEJsaW5kO1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocmFpc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJhaXNlIDwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocGxheWVyQmFsYW5jZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmFpc2VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgYmV0IGZvciBwbGF5ZXJcbiAgICAgKlxuICAgICAqIElmIG5vIGJldHMgaGF2ZSBvY2N1cnJlZCBpbiBjdXJyZW50IHJvdW5kLCB0aGUgbWluIGJldCBpcyBhXG4gICAgICogY2hlY2sgKGJldCBvZiAwKSwgb3RoZXJ3aXNlIGl0J3MgYSBjYWxsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5CZXQocm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCBtaW5CZXQgPSByb3VuZEJldCA9PT0gMCA/IDAgOiByb3VuZEJldCAtIHBsYXllclJvdW5kQmV0O1xuICAgICAgICBpZiAocGxheWVyQmFsYW5jZSA8IG1pbkJldCkge1xuICAgICAgICAgICAgbWluQmV0ID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluQmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgcmFpc2UgZm9yIHBsYXllclxuICAgICAqXG4gICAgICogTk9URTogQSByYWlzZSBoZXJlIG1heSBhY3R1YWxseSBtZWFuIGEgYmV0IGluIHBva2VyIHRlcm1zLiBJbiB0aGVcbiAgICAgKiBwYXJsYW5jZSBvZiB0aGlzIHV0aWxpdHksIGEgcmFpc2UgaXMgYW4gYWdncmVzc2l2ZSBhY3Rpb24sIG9yIHNvbWV0aGluZ1xuICAgICAqIHdoaWNoIHdvdWxkIGZvcmNlIG90aGVyIHBsYXllcnMgdG8gY29udHJpYnV0ZSBtb3JlIHRvIHRoZSBwb3QgdGhhblxuICAgICAqIHRoZSBvdGhlcndpc2Ugd291bGQgaGF2ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5SYWlzZShiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IG1pblJhaXNlID0gcm91bmRCZXQgPT09IDAgPyBiaWdCbGluZCA6IHJvdW5kQmV0IC0gcGxheWVyUm91bmRCZXQgKyBwcmV2UmFpc2U7XG4gICAgICAgIGlmIChwbGF5ZXJCYWxhbmNlIDwgbWluUmFpc2UpIHtcbiAgICAgICAgICAgIG1pblJhaXNlID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluUmFpc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb2tlcjsiLCJjbGFzcyBTU0Uge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVybCkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodGhpcy51cmwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJlIGFkZHMgYWxsIGxpc3RlbmVycyB0byB0aGlzLnNvdXJjZVxuICAgICAqXG4gICAgICogSSBvcmlnaW5hbGx5IHdyb3RlIHRoaXMgdG8gc3VwcG9ydCBjbGllbnQgcmVjb25uZWN0cywgYnV0IEkgZG9uJ3QgbmVlZFxuICAgICAqIHRoYXQgYW55bW9yZS4gS2VlcGluZyB0aGUgbGlzdGVuZXIgY29kZSBqdXN0IGluIGNhc2UuXG4gICAgICovXG4gICAgcmVBZGRBbGxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycztcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobGlzdGVuZXIudHlwZSwgbGlzdGVuZXIuY2FsbGJhY2ssIGxpc3RlbmVyLmNhbGxiYWNrQ29udGV4dCwgLi4ubGlzdGVuZXIuYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIFN0b3JlIGxpc3RlbmVycyBmb3IgZXZlbnR1YWwgcmVjb25uZWN0XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgICAgXCJ0eXBlXCI6IHR5cGUsXG4gICAgICAgICAgICBcImNhbGxiYWNrXCI6IGNhbGxiYWNrLFxuICAgICAgICAgICAgXCJjYWxsYmFja0NvbnRleHRcIjogY2FsbGJhY2tDb250ZXh0LFxuICAgICAgICAgICAgXCJhcmdzXCI6IGFyZ3NcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU1NFOyIsImNsYXNzIFV0aWwge1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJldHVybiBhIGZvcm1hdHRlZCBjdXJyZW5jeSBzdHJpbmcgZnJvbSBhbiBpbnRlZ2VyXG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlQ3VycmVuY3koaW50KSB7XG4gICAgICAgIGxldCB2YWwgPSBpbnQgLyAxMDA7XG4gICAgICAgIHJldHVybiBcIiRcIiArIHZhbC50b0ZpeGVkKDIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXRpbDsiLCJjb25zdCBBY3Rpb24gPSB7XG4gICAgQkxJTkQ6IDAsXG4gICAgRk9MRDogMSxcbiAgICBDSEVDSzogMixcbiAgICBCRVQ6IDNcbn07XG5cbmNvbnN0IEFjdGlvblRleHQgPSB7XG4gICAgMDogXCJCTElORFwiLFxuICAgIDE6IFwiRk9MRFwiLFxuICAgIDI6IFwiQ0hFQ0tcIixcbiAgICAzOiBcIkJFVFwiXG59O1xuXG5leHBvcnQge0FjdGlvbiwgQWN0aW9uVGV4dH07IiwiLyoqXG4gKiBBIFBoYXNlci5CdXR0b24gd2l0aCBhIFBoYXNlci5UZXh0IGNlbnRlcmVkIG9uIHRoZSBidXR0b25cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIG1lcmVseSBhIHRoaW4gd3JhcHBlciBhcm91bmQgUGhhc2VyLkJ1dHRvbiB0byBhbGxvdyBmb3JcbiAqIGVhc3kgdXNlIG9mIGEgdGV4dCBsYWJlbCBvbiB0aGUgYnV0dG9uLiBUaGUgdGV4dCBpcyBhIGNoaWxkIG9mIHRoZSBidXR0b24sXG4gKiBzbyBpdCBtb3ZlcyB3aGVuIHRoZSBidXR0b24gbW92ZXMuIEl0J3MgY2VudGVyZWQgb24gdGhlIGJ1dHRvbiBhbmQgc2NhbGVzXG4gKiBhdXRvbWF0aWNhbGx5IHRvIGZpeCB3aXRoaW4gdGhlIGJ1dHRvbidzIGJvdW5kcy5cbiAqXG4gKiBJZiBub25lIG9mIHRoZSBsYWJlbCBmdW5jdGlvbmFsaXR5IGlzIHVzZWQsIHRoaXMgY2xhc3MgaXMgaWRlbnRpY2FsIHRvXG4gKiBQaGFzZXIuQnV0dG9uLlxuICovXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBQaGFzZXIuQnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSkge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSk7XG5cbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSAxMDtcbiAgICAgICAgdGhpcy5sYWJlbFRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSB7fTtcbiAgICAgICAgdGhpcy5sYWJlbCA9IG5ldyBQaGFzZXIuVGV4dCh0aGlzLmdhbWUsIDAsIDAsIHRoaXMubGFiZWxUZXh0KTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmxhYmVsKTtcblxuICAgICAgICAvLyBNdXN0IGFkZCB0byBnYW1lIHdvcmxkIG1hbnVhbGx5IGlmIG5vdCB1c2luZyBnYW1lLmFkZC5idXR0b25cbiAgICAgICAgdGhpcy5nYW1lLndvcmxkLmFkZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHRleHQgZGlzcGxheWVkIG9uIHRoZSBidXR0b25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGRpc3BsYXlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0VGV4dCh0ZXh0LCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxUZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBzdHlsZSBmb3IgdGhlIGJ1dHRvbiB0ZXh0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gVGhlIHRleHQgc3R5bGUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFRleHRTdHlsZShzdHlsZSwgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSBzdHlsZTtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBwYWRkaW5nIGJldHdlZW4gdGhlIHRleHQgYW5kIHRoZSBidXR0b24gcGVyaW1ldGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmcgLSBUaGUgcGFkZGluZyBpbiBwaXhlbHNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0UGFkZGluZyhwYWRkaW5nLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxQYWRkaW5nID0gcGFkZGluZztcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIGJ1dHRvblxuICAgICAqIE9uIGRpc2FibGUsIGRpc2FibGVzIGFsbCBpbnB1dCB0byB0aGUgYnV0dG9uIGFuZCByZW5kZXJzIGl0IGdyYXllZFxuICAgICAqIG91dC4gQWxsIHVwZGF0ZXMgYXJlIGRlbGF5ZWQgdW50aWwgcmUtZW5hYmxlLCB1bmxlc3MgZm9yY2VkLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIEVuYWJsZSBvciBkaXNhYmxlIGJ1dHRvbj9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmxhYmVsLnRpbnQgPSB0aW50O1xuXG4gICAgICAgIC8vIFVwZGF0ZSBvbiByZS1lbmFibGVcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFVwZGF0ZSBhbGwgYnV0dG9uIGF0dHJpYnV0ZXMgdG8gY3VycmVudCBwcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBJZiB0aGUgYnV0dG9uIGlzIGRpc2FibGVkLCB0aGlzIHdpbGwgaGF2ZSBubyBlZmZlY3QuIFRoZVxuICAgICAqIGRldmVsb3BlciBtYXkgb3B0aW9uYWxseSBjaG9vc2UgdG8gZm9yY2UgdGhlIHVwZGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSB0aGUgdXBkYXRlP1xuICAgICAqL1xuICAgIHVwZGF0ZUxhYmVsKGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCB8fCBmb3JjZSkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbC50ZXh0ID0gdGhpcy5sYWJlbFRleHQ7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnNldFN0eWxlKHRoaXMubGFiZWxTdHlsZSk7XG4gICAgICAgICAgICB0aGlzLnJlUG9zTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNjYWxlIGxhYmVsIHRleHQgdG8gZml0IG9uIGJ1dHRvbiBhbmQgY2VudGVyXG4gICAgICovXG4gICAgcmVQb3NMYWJlbCgpIHtcbiAgICAgICAgdGhpcy5sYWJlbC5zY2FsZS5zZXRUbygxKTtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFIID0gdGhpcy53aWR0aCAtIHRoaXMubGFiZWxQYWRkaW5nICogMjtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFWID0gdGhpcy5oZWlnaHQgLSB0aGlzLmxhYmVsUGFkZGluZyAqIDI7XG4gICAgICAgIGlmICh0aGlzLmxhYmVsLndpZHRoID4gdGV4dEFyZWFIIHx8IHRoaXMubGFiZWwuaGVpZ2h0ID4gdGV4dEFyZWFWKSB7XG4gICAgICAgICAgICBjb25zdCByZWR1Y2VkU2NhbGVIID0gdGV4dEFyZWFIIC8gdGhpcy5sYWJlbC53aWR0aDtcbiAgICAgICAgICAgIGNvbnN0IHJlZHVjZWRTY2FsZVYgPSB0ZXh0QXJlYVYgLyB0aGlzLmxhYmVsLmhlaWdodDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2NhbGUuc2V0VG8oTWF0aC5taW4ocmVkdWNlZFNjYWxlSCwgcmVkdWNlZFNjYWxlVikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFiZWwuY2VudGVyWCA9IHRoaXMud2lkdGggLyAyO1xuICAgICAgICB0aGlzLmxhYmVsLmNlbnRlclkgPSB0aGlzLmhlaWdodCAvIDI7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjsiLCJjbGFzcyBDYXJkIGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwga2V5LCBtYW5hZ2VyLCBhdXRvSGlkZSA9IGZhbHNlKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSk7XG4gICAgICAgIGdhbWUud29ybGQuYWRkKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuXG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7ICAvLyBTdHJpbmcgSUQgb2YgY2FyZCwgZS5nLiAnS2gnIG9yICc3cydcbiAgICAgICAgdGhpcy5hdXRvSGlkZSA9IGF1dG9IaWRlO1xuXG4gICAgICAgIHRoaXMuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5mcmFtZU5hbWUgPSB0aGlzLm5hbWUgPyB0aGlzLm5hbWUgOiBcImJhY2tcIjtcblxuICAgICAgICAvLyBBdXRvLWhpZGUgZmFjZSBkb3duIGNhcmRzLCBpZiBmbGFnIHNldFxuICAgICAgICAvLyBUaGlzIHdpbGwgY2F1c2UgcHJvYmxlbXMgaWYgbWFudWFsbHkgaGlkaW5nIGFuZCBzaG93aW5nXG4gICAgICAgIC8vIGNhcmRzLiBFLmcuIG1hbnVhbGx5IHNldCBjYXJkIHRvIGhpZGRlbiBldmVuIHRob3VnaCBpdCBoYXNcbiAgICAgICAgLy8gYSB0cnV0aHkgYG5hbWVgIHByb3BlcnR5LCB0aGVuIGNhbGwgaXQgd2lsbCBiZWNvbWUgdmlzaWJsZVxuICAgICAgICAvLyBhZ2FpbiB3aGVuIHVwZGF0ZURpc3BsYXkgaXMgY2FsbGVkIGlmIGBhdXRvSGlkZWAgaXMgdHJ1ZS5cbiAgICAgICAgdGhpcy52aXNpYmxlID0gIXRoaXMuYXV0b0hpZGUgfHwgdGhpcy5uYW1lO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZDtcbiIsImNsYXNzIENoaXAgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIG1hbmFnZXIpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwga2V5KTtcbiAgICAgICAgZ2FtZS53b3JsZC5hZGQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG5cbiAgICAgICAgdGhpcy5pZCA9ICsrQ2hpcC5jb3VudGVyO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IDA7XG4gICAgICAgIHRoaXMuYW5nbGUgPSAwO1xuXG4gICAgICAgIHRoaXMuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yb3RhdGVSYW5kb20oKTtcbiAgICB9XG5cbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5mcmFtZU5hbWUgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cblxuICAgIGNsb25lKGNoaXApIHtcbiAgICAgICAgdGhpcy54ID0gY2hpcC53b3JsZFBvc2l0aW9uLnggLSB0aGlzLnBhcmVudC53b3JsZFBvc2l0aW9uLng7XG4gICAgICAgIHRoaXMueSA9IGNoaXAud29ybGRQb3NpdGlvbi55IC0gdGhpcy5wYXJlbnQud29ybGRQb3NpdGlvbi55O1xuICAgICAgICB0aGlzLmtleSA9IGNoaXAua2V5O1xuICAgICAgICB0aGlzLmFuZ2xlID0gY2hpcC5hbmdsZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNoaXAudmFsdWU7XG4gICAgfVxuXG4gICAgcm90YXRlUmFuZG9tKCkge1xuICAgICAgICB0aGlzLmFuZ2xlID0gdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSgtMTgwLCAxODApO1xuICAgIH1cbn1cblxuQ2hpcC5jb3VudGVyID0gMDtcblxuZXhwb3J0IGRlZmF1bHQgQ2hpcDsiLCJjbGFzcyBDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBwbGF5ZXJJZCwgdG9rZW4pIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBhY2Nlc3MgdG9rZW4gdXNlZCB0byBhdXRoZW50aWNhdGUgb24gQVBJIGNhbGxzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gVGhlIEZsYXNrLUpXVC1FeHRlbmRlZCBhY2Nlc3MgdG9rZW5cbiAgICAgKi9cbiAgICBzZXRUb2tlbih0b2tlbikge1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgICAqXG4gICAgICogT25seSBlcnJvcnMgYXJlIHJlcG9ydGVkLiBTdWNjZXNzIGlzIHNpbGVudC4gR2FtZSBjaGFuZ2VzIHJlc3VsdGluZ1xuICAgICAqIGZyb20gcmVxdWVzdHMgYXJlIGhhbmRsZWQgdmlhIFNlcnZlciBTZW50IEV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmRwb2ludCAtIFRoZSBlbmRwb2ludCBvbiB0aGUgc2VydmVyIHRvIHNlbmQgcmVxdWVzdCB0b1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gVGhlIHBheWxvYWQgdG8gc2VuZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWV0aG9kPVwiUE9TVF0gLSBUaGUgSFRUUCBtZXRob2QgdG8gdXNlXG4gICAgICovXG4gICAgc2VuZFJlcXVlc3QoZW5kcG9pbnQsIGRhdGEsIG1ldGhvZCA9IFwiUE9TVFwiKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4obWV0aG9kLCBlbmRwb2ludCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3AgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIC8vIEludmFsaWQgcmVxdWVzdCBlcnJvclxuICAgICAgICAgICAgICAgIGlmIChyZXNwLnN1Y2Nlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihyZXNwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgIC8vIEZhaWxlZCByZXF1ZXN0IGVycm9yXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgdGhpcy50b2tlbik7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGFuIGFjdGlvbiByZXF1ZXN0XG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHRoZSBtb3N0IGhlYXZpbHktdXNlZCByZXF1ZXN0IHR5cGUgaW4gdGhlIGdhbWUuIEFsbCBpbi1nYW1lXG4gICAgICogYWN0aW9ucyAoYmV0LCBjaGVjaywgZm9sZCkgaGFwcGVuIGhlcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIFRoZSBwYXlsb2FkIHRvIHNlbmRcbiAgICAgKi9cbiAgICBhY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiYWN0aW9uXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgY2hlY2soKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkNIRUNLXCIpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBiZXQoYW10KSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJFVFwiLCBhbXQpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBmb2xkKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBiYigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkxJTkRcIiwgNTApO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBzYigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkxJTkRcIiwgMjUpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBqb2luKHNlYXROdW0sIGJ1eUluKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XCJwb3NpdGlvblwiOiBzZWF0TnVtLCBcImFtb3VudFwiOiBidXlJbn07XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJqb2luXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgbGVhdmUoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImxlYXZlXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhIGJlYWNvbiB0byB0aGUgc2VydmVyIG9uIGRpc2Nvbm5lY3RcbiAgICAgKlxuICAgICAqIFRoaXMgYWxsb3dzIGZvciBzZXJ2ZXIgdG8ga25vdyB3aGVuIGEgY2xpZW50IGRpc2Nvbm5lY3RzIHNvXG4gICAgICogaXQgY2FuIGNsZWFuIHVwIGFzIG5lY2Vzc2FyeS4gTm8gZ3VhcmFudGVlIHRoYXQgdGhpcyBtZXNzYWdlXG4gICAgICogd2lsbCBnbyB0aHJvdWdoLCBzbyBtdXN0IGhhdmUgcmVkdW5kYW50IG1lYXN1cmVzIGluIHBsYWNlLlxuICAgICAqL1xuICAgIGRpc2Nvbm5lY3RCZWFjb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgY29uc3QgdXJsID0gXCIvZGlzY29ubmVjdC9cIjtcbiAgICAgICAgbmF2aWdhdG9yLnNlbmRCZWFjb24odXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBidWlsZFBheWxvYWQoYWN0aW9uVHlwZSwgYmV0QW10ID0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJwbGF5ZXJJZFwiOiB0aGlzLnBsYXllcklkLFxuICAgICAgICAgICAgXCJhY3Rpb25UeXBlXCI6IGFjdGlvblR5cGUsXG4gICAgICAgICAgICBcImJldEFtdFwiOiBiZXRBbXRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJ1aWxkVXJsKGVuZHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVVcmwgKyBlbmRwb2ludCArIFwiL1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlcjtcbiIsImNvbnN0IEJVVFRPTl9TVFlMRVMgPSB7XG4gICAgUExBSU46IDAsXG4gICAgTEVUVEVSOiAxLFxuICAgIFRFWFQ6IDJcbn07XG5cbmNsYXNzIERlYWxlckJ1dHRvbiBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGtleSwgY29uZmlnKSB7XG4gICAgICAgIGtleSA9IGtleSB8fCBcImRlYWxlckJ1dHRvblwiO1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXkpO1xuICAgICAgICBnYW1lLndvcmxkLmFkZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcgfHwgdGhpcy5nYW1lLmNvbmZpZy5kZWFsZXJCdXR0b247XG5cbiAgICAgICAgdGhpcy5fc2VhdCA9IDA7XG4gICAgICAgIHRoaXMuZnJhbWUgPSBCVVRUT05fU1RZTEVTLlRFWFQ7XG5cbiAgICAgICAgdGhpcy5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5zZWF0ID0gMDtcbiAgICB9XG5cbiAgICBzZXQgc2VhdChzZWF0TnVtKSB7XG4gICAgICAgIHRoaXMuX3NlYXQgPSBzZWF0TnVtO1xuICAgICAgICB0aGlzLnggPSB0aGlzLmNvbmZpZ1tzZWF0TnVtXS54O1xuICAgICAgICB0aGlzLnkgPSB0aGlzLmNvbmZpZ1tzZWF0TnVtXS55O1xuICAgIH1cblxuICAgIG1vdmVUb1NlYXQoc2VhdE51bSkge1xuICAgICAgICBjb25zdCB4ID0gdGhpcy5jb25maWdbc2VhdE51bV0ueDtcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuY29uZmlnW3NlYXROdW1dLnk7XG5cbiAgICAgICAgdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzKS50byh7eDogeCwgeTogeX0sIDUwMCwgUGhhc2VyLkVhc2luZy5RdWFkcmF0aWMuSW5PdXQsIHRydWUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVhbGVyQnV0dG9uO1xuIiwiLyoqXG4gKiBAc3VtbWFyeSBTaW1wbGUgUGhhc2VyLlRleHQgZXh0ZW5zdGlvbiB0byBzdXBwb3J0IGF1dG9tYXRpYyByZXNpemluZ1xuICpcbiAqIElmIHRleHQgYm91bmRzIGFyZSBzZXQgb24gaW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MsIHRoZW4gZWFjaCB0aW1lIHRoZSB0ZXh0XG4gKiBvciBzdHlsZSBpcyBjaGFuZ2VkLCB0aGUgdGV4dCB3aWxsIGF1dG9tYXRpY2FsbHkgc2NhbGUgaXRzZWxmIGRvd24gdG8gZml0XG4gKiB3aXRoaW4gdGhvc2UgYm91bmRzIGhvcml6b250YWxseS4gVmVydGljYWwgYm91bmRzIGFyZSBpZ25vcmVkLlxuICpcbiAqIFBvc3NpYmxlIHVwZ3JhZGVzOlxuICogICAtIFNldCBtaW5pbXVtIHNjYWxlXG4gKiAgIC0gSWYgdGV4dCBzdGlsbCBvdmVyZmxvd3MgbWluIHNjYWxlLCB0aGVuIHRydW5jYXRlXG4gKi9cbmNsYXNzIExhYmVsIGV4dGVuZHMgUGhhc2VyLlRleHQge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIHRleHQsIHN0eWxlKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIHRleHQsIHN0eWxlKTtcbiAgICAgICAgdGhpcy5hbmNob3Iuc2V0VG8oMCwgMC41KTsgIC8vIENlbnRlciB2ZXJ0aWNhbGx5IHRvIGF2b2lkIGp1bXBzIG9uIHJlc2l6ZVxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIHNldFRleHQodGV4dCwgaW1tZWRpYXRlKSB7XG4gICAgICAgIHN1cGVyLnNldFRleHQodGV4dCwgaW1tZWRpYXRlKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9XG5cbiAgICBzZXRTdHlsZShzdHlsZSwgdXBkYXRlKSB7XG4gICAgICAgIHN1cGVyLnNldFN0eWxlKHN0eWxlLCB1cGRhdGUpO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJlc2l6ZSB0aGUgdGV4dCBob3Jpem9udGFsbHlcbiAgICAgKlxuICAgICAqIElmIHRleHQgZG9lcyBub3QgZml0IGhvcml6b250YWxseSBhdCBmdWxsIHNjYWxlLCB0aGVuIHNjYWxlIGRvd25cbiAgICAgKiB1bnRpbCBpdCBmaXRzLiBWZXJ0aWNhbCBvdmVyZmxvdyBpcyBpZ25vcmVkLlxuICAgICAqL1xuICAgIHJlc2l6ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRleHRCb3VuZHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjYWxlLnNldFRvKDEpO1xuICAgICAgICBpZiAodGhpcy53aWR0aCA+IHRoaXMudGV4dEJvdW5kcy53aWR0aCkge1xuICAgICAgICAgICAgdGhpcy5zY2FsZS5zZXRUbyh0aGlzLnRleHRCb3VuZHMud2lkdGggLyB0aGlzLndpZHRoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGFiZWw7IiwiaW1wb3J0IExhYmVsIGZyb20gXCIuL0xhYmVsXCI7XG5pbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuXG5jbGFzcyBOYW1lcGxhdGUgZXh0ZW5kcyBQaGFzZXIuSW1hZ2Uge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGtleSwgY29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSk7XG4gICAgICAgIGdhbWUud29ybGQuYWRkKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZyB8fCB0aGlzLmdhbWUuY29uZmlnLm5hbWVwbGF0ZTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7XG4gICAgICAgICAgICBuYW1lcGxhdGU6IG51bGwsXG4gICAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgICAgYmFsYW5jZTogbnVsbCxcbiAgICAgICAgICAgIGZsYXNoOiBudWxsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc2V0IG5hbWUobmFtZSkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS5zZXRUZXh0KG5hbWUpO1xuICAgIH1cblxuICAgIHNldCBiYWxhbmNlKGJhbGFuY2UpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2Uuc2V0VGV4dChVdGlsLnBhcnNlQ3VycmVuY3koYmFsYW5jZSkpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlID0gdGhpcztcblxuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZSA9IG5ldyBMYWJlbCh0aGlzLmdhbWUsIHRoaXMuY29uZmlnLm5hbWUueCwgdGhpcy5jb25maWcubmFtZS55LCBcIlwiLCB0aGlzLmNvbmZpZy5uYW1lLnN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUuc2V0VGV4dEJvdW5kcygwLCAwLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLndpZHRoIC0gMjAsIDApO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuZGlzcGxheS5uYW1lKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZSA9IG5ldyBMYWJlbCh0aGlzLmdhbWUsIHRoaXMuY29uZmlnLmJhbGFuY2UueCwgdGhpcy5jb25maWcuYmFsYW5jZS55LCBcIlwiLCB0aGlzLmNvbmZpZy5iYWxhbmNlLnN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2Uuc2V0VGV4dEJvdW5kcygwLCAwLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLndpZHRoIC0gMjAsIDApO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuZGlzcGxheS5iYWxhbmNlKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2ggPSBuZXcgTGFiZWwodGhpcy5nYW1lLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmNlbnRlclgsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuY2VudGVyWSwgXCJcIiwgdGhpcy5jb25maWcuZmxhc2guc3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2guc2V0VGV4dEJvdW5kcygwLCAwLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLndpZHRoIC0gMjAsIDApO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2guYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmZsYXNoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBGbGFzaCB0ZXh0IGZvciBkdXJhdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gZGlzcGxheXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2R1cmF0aW9uPTIwMDBdIC0gTWlsbGlzZWNvbmRzIHRvIGRpc3BsYXkgdGV4dFxuICAgICAqL1xuICAgIGZsYXNoKHRleHQsIGR1cmF0aW9uID0gMjAwMCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoLnZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2guc2V0VGV4dCh0ZXh0KTtcblxuICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKGR1cmF0aW9uLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBOYW1lcGxhdGU7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4vQnV0dG9uXCI7XG5pbXBvcnQgU2xpZGVyIGZyb20gXCIuL1NsaWRlclwiO1xuaW1wb3J0IHtBY3Rpb259IGZyb20gXCIuL0FjdGlvblwiO1xuXG5jbGFzcyBQYW5lbCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJldHMgPSBbMF07XG4gICAgICAgIHRoaXMucHJpbWFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnByaW1hcnlBY3Rpb24gPSBBY3Rpb24uQkVUO1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IEFjdGlvbi5DSEVDSztcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnRlcnRpYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMudGVydGlhcnlBY3Rpb24gPSBBY3Rpb24uRk9MRDtcbiAgICAgICAgdGhpcy5zbGlkZXIgPSBuZXcgU2xpZGVyKHRoaXMuZ2FtZSwgXCJwYW5lbFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbHdheXNWaXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkgPSB0aGlzLm1ha2VCdXR0b24oMCwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5wcmltYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnByaW1hcnlBY3Rpb24sIHRoaXMucHJpbWFyeUJldCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDEzNSwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5zZWNvbmRhcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMuc2Vjb25kYXJ5QWN0aW9uLCB0aGlzLnNlY29uZGFyeUJldCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkudGVydGlhcnkgPSB0aGlzLm1ha2VCdXR0b24oMjcwLCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnRlcnRpYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnRlcnRpYXJ5QWN0aW9uLCAwKSk7XG5cbiAgICAgICAgdGhpcy5zbGlkZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuaW5kZXhDaGFuZ2VkLmFkZCgoaW5kZXgpID0+IHRoaXMuc2V0UHJpbWFyeUJldCh0aGlzLmJldHNbaW5kZXhdKSwgdGhpcyk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNsaWRlcldoZWVsLmFkZCh0aGlzLnNpbmdsZVN0ZXBCZXQsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2xpZGVyID0gdGhpcy5zbGlkZXIuYmFyO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2xpZGVyLnkgPSA2MDtcblxuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeS5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHRoaXMuc2xpZGVyLmVuYWJsZVNsaWRlcldoZWVsKHRydWUpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHRoaXMuc2xpZGVyLmVuYWJsZVNsaWRlcldoZWVsKGZhbHNlKSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5wcmltYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zZWNvbmRhcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnRlcnRpYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zbGlkZXIpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG1ha2VCdXR0b24oeCwgeSwgc2l6ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ1dHRvbiA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCB4LCB5LCB0aGlzLmtleSk7XG4gICAgICAgIGJ1dHRvbi5vbklucHV0VXAuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgYnV0dG9uLnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX292ZXJcIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX291dFwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfdXBcIlxuICAgICAgICApO1xuICAgICAgICBidXR0b24uc2V0VGV4dFN0eWxlKHRoaXMuZ2FtZS5jb25maWcucGFuZWwudGV4dFN0eWxlKTtcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICAvLyBQYW5lbCB1cGRhdGVzIHJlcXVpcmUgcGxheWVycycgY3VycmVudCBiZXRzLCBzbyBpZlxuICAgICAgICAvLyB0aGVyZSBpcyBubyBuZXh0IHBsYXllciB3ZSBzaG91bGRuJ3QgdXBkYXRlIHRoZSBkaXNwbGF5XG4gICAgICAgIGlmICghdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFjdGlvblRleHQgPSB0aGlzLmdhbWUucm91bmRCZXQgPT09IDAgPyBcIkJFVCBcIiA6IFwiUkFJU0UgVE9cXG5cIjtcbiAgICAgICAgbGV0IHByaW1hcnlUZXh0ID0gYWN0aW9uVGV4dCArIFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLnByaW1hcnlCZXQgKyB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuc2V0VGV4dChwcmltYXJ5VGV4dCk7XG5cbiAgICAgICAgbGV0IHNlY29uZGFyeVRleHQgPSBcIkNIRUNLXCI7XG4gICAgICAgIGlmICh0aGlzLnNlY29uZGFyeUFjdGlvbiAhPT0gQWN0aW9uLkNIRUNLKSB7XG4gICAgICAgICAgICBzZWNvbmRhcnlUZXh0ID0gXCJDQUxMIFwiICsgVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuc2Vjb25kYXJ5QmV0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5LnNldFRleHQoc2Vjb25kYXJ5VGV4dCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnRlcnRpYXJ5LnNldFRleHQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xuICAgIH1cblxuICAgIHNldEJldHMoYmV0cykge1xuICAgICAgICBpZiAoYmV0cy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBiZXRzLiBQYW5lbCBtdXN0IGFsd2F5cyBoYXZlIGF0IGxlYXN0IG9uZSB2YWxpZCBiZXQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iZXRzID0gYmV0cztcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0c1swXTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0TGVuZ3RoKGJldHMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoMCk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNldEVuYWJsZWQoYmV0cy5sZW5ndGggPiAxKTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc2V0UHJpbWFyeUJldChiZXQpIHtcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRTZWNvbmRhcnlCZXQoYmV0KSB7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QmV0ID0gYmV0O1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IGJldCA9PT0gMCA/IEFjdGlvbi5DSEVDSyA6IEFjdGlvbi5CRVQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEhpZGUgb3Igc2hvdyB0aGUgZW50aXJlIHBhbmVsXG4gICAgICogQHBhcmFtIHtib29sZWFufSB2aXNpYmxlXG4gICAgICovXG4gICAgc2V0VmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGUgfHwgdGhpcy5hbHdheXNWaXNpYmxlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBJbmNyZW1lbnQgb3IgZGVjcmVtZW50IHRoaXMucHJpbWFyeUJldFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLk1vdXNlLndoZWVsRGVsdGF9IG1vZGlmaWVyIC0gKzEgb3IgLTFcbiAgICAgKi9cbiAgICBzaW5nbGVTdGVwQmV0KG1vZGlmaWVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuc2xpZGVyLmluZGV4ICsgbW9kaWZpZXI7XG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDwgdGhpcy5zbGlkZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNsaWRlci5zZXRJbmRleChpbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsO1xuIiwiaW1wb3J0IHtBY3Rpb25UZXh0fSBmcm9tIFwiLi4vY2xhc3Nlcy9BY3Rpb25cIjtcbmltcG9ydCBDYXJkTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2FyZE1hbmFnZXJcIjtcbmltcG9ydCBDaGlwTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2hpcE1hbmFnZXJcIjtcbmltcG9ydCBOYW1lcGxhdGUgZnJvbSBcIi4uL2NsYXNzZXMvTmFtZXBsYXRlXCI7XG5cbmNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgY2hpcENvbmZpZykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmNoaXBDb25maWcgPSBjaGlwQ29uZmlnO1xuXG4gICAgICAgIHRoaXMuaWQgPSBudWxsO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IG51bGw7XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2l0dGluZ091dCA9IG51bGw7XG4gICAgICAgIHRoaXMuc2VhdCA9IG51bGw7XG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMucm91bmRCZXQgPSAwOyAgLy8gU3VtIGJldHMgYnkgcGxheWVyIGluIGN1cnJlbnQgYmV0dGluZyByb3VuZFxuXG4gICAgICAgIHRoaXMuaXNEZWFsZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc05leHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc1VzZXIgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge1xuICAgICAgICAgICAgbmFtZXBsYXRlOiBudWxsLFxuICAgICAgICAgICAgY2FyZHM6IG51bGwsXG4gICAgICAgICAgICBjYXJkc01hc2s6IG51bGwsXG4gICAgICAgICAgICBjaGlwczogbnVsbFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuY2FyZHMgPSBuZXcgQ2FyZE1hbmFnZXIodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5jaGlwcyA9IG5ldyBDaGlwTWFuYWdlcih0aGlzLmdhbWUsIFwiY2hpcHNcIiwgdGhpcy5nYW1lLmNvbmZpZy5kZW5vbXMpO1xuICAgICAgICB0aGlzLm5hbWVwbGF0ZSA9IG5ldyBOYW1lcGxhdGUodGhpcy5nYW1lLCAwLCAwLCBcIm5hbWVwbGF0ZVwiKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKGRhdGEpIHtcbiAgICAgICAgdGhpcy5pZCA9IGRhdGEuaWQ7XG4gICAgICAgIHRoaXMudXNlcklkID0gZGF0YS51c2VySWQ7XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGRhdGEuYmFsYW5jZTtcbiAgICAgICAgdGhpcy5zaXR0aW5nT3V0ID0gZGF0YS5zaXR0aW5nT3V0O1xuICAgICAgICB0aGlzLnNlYXQgPSBkYXRhLnNlYXQ7XG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcbiAgICAgICAgdGhpcy5pc1VzZXIgPSBkYXRhLmlzVXNlcjtcblxuICAgICAgICB0aGlzLmNhcmRzLmluaXRpYWxpemUoMik7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUgPSB0aGlzLm5hbWVwbGF0ZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcyA9IHRoaXMuY2FyZHMuZGlzcGxheUdyb3VwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMueCA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuY2VudGVyWDtcbiAgICAgICAgdGhpcy5oaWRlQ2FyZHMoKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHNNYXNrID0gdGhpcy5jcmVhdGVDYXJkc01hc2soKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzTWFzay5ib3R0b20gPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLnRvcDtcbiAgICAgICAgdGhpcy5jYXJkcy5tYXNrID0gdGhpcy5kaXNwbGF5LmNhcmRzTWFzaztcblxuICAgICAgICAvLyBOT1RFOiBUaGlzIGxpbmUgaXMgcmVxdWlyZWQgZm9yIHRoaXMgbWFzayB0byB3b3JrIHVuZGVyIFdlYkdMXG4gICAgICAgIC8vIFNvbWUgY2hhbmdlcyB0byBtYXNrcyBpbiBXZWJHTCBtb2RlIHdpbGwgcmVuZGVyIHRoZSBtYXNrXG4gICAgICAgIC8vIGNvbXBsZXRlbHkgaW5lZmZlY3RpdmUuIFRoZSBidWcgaXMgbm90IHdlbGwgdW5kZXJzdG9vZC4gSXQgbWF5XG4gICAgICAgIC8vIGhhdmUgYmVlbiBmaXhlZCBpbiBsYXRlciB2ZXJzaW9ucyBvZiBQaGFzZXIuXG4gICAgICAgIC8vIE1vcmUgZGV0YWlsIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9waG90b25zdG9ybS9waGFzZXItY2UvaXNzdWVzLzMzNFxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHNNYXNrLmRpcnR5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmNoaXBzLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jaGlwcyA9IHRoaXMuY2hpcHMuZGlzcGxheUdyb3VwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMueCA9IHRoaXMuY2hpcENvbmZpZ1t0aGlzLnNlYXRdLng7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jaGlwcy55ID0gdGhpcy5jaGlwQ29uZmlnW3RoaXMuc2VhdF0ueTtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5jaGlwcy5kaXNwbGF5R3JvdXApO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmNhcmRzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5jYXJkc01hc2spO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5uYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmJhbGFuY2UgPSB0aGlzLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuZnJhbWVOYW1lID0gdGhpcy5pc05leHQgPyBcInJlZFwiIDogXCJiYXNlXCI7XG4gICAgfVxuXG4gICAgdXBkYXRlKGRhdGEsIHVwZGF0ZUNoaXBzID0gdHJ1ZSkge1xuICAgICAgICAvLyBUT0RPIC0gRmxlc2ggb3V0IHRoZSByZXN0IG9mIHRoZSBkYXRhIC0tIGRvIEkgbGlrZSB0aGlzIG1ldGhvZD9cbiAgICAgICAgdGhpcy5iYWxhbmNlID0gZGF0YS5iYWxhbmNlID09PSB1bmRlZmluZWQgPyB0aGlzLmJhbGFuY2UgOiBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuaXNEZWFsZXIgPSBkYXRhLmlzRGVhbGVyID09PSB1bmRlZmluZWQgPyB0aGlzLmlzRGVhbGVyIDogZGF0YS5pc0RlYWxlcjtcbiAgICAgICAgdGhpcy5pc05leHQgPSBkYXRhLmlzTmV4dCA9PT0gdW5kZWZpbmVkID8gdGhpcy5pc05leHQgOiBkYXRhLmlzTmV4dDtcbiAgICAgICAgdGhpcy5yb3VuZEJldCA9IGRhdGEucm91bmRCZXQgPT09IHVuZGVmaW5lZCA/IHRoaXMucm91bmRCZXQgOiBkYXRhLnJvdW5kQmV0O1xuICAgICAgICBpZiAodXBkYXRlQ2hpcHMpIHtcbiAgICAgICAgICAgIHRoaXMuY2hpcHMuc2V0VmFsdWUodGhpcy5yb3VuZEJldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNoaXBzLnZhbHVlID0gdGhpcy5yb3VuZEJldDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBhY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLnVwZGF0ZSh7XG4gICAgICAgICAgICBiYWxhbmNlOiBkYXRhLnBsYXllckJhbGFuY2UsXG4gICAgICAgICAgICByb3VuZEJldDogZGF0YS5wbGF5ZXJSb3VuZEJldFxuICAgICAgICB9KTtcblxuICAgICAgICBsZXQgYWN0aW9uVGV4dCA9IEFjdGlvblRleHRbZGF0YS5hY3Rpb25UeXBlXTtcblxuICAgIH1cblxuICAgIGNyZWF0ZUNhcmRzTWFzaygpIHtcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuY2FyZHMuY2FyZHNbMF0uaGVpZ2h0O1xuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLm5hbWVwbGF0ZS53aWR0aDtcbiAgICAgICAgbGV0IG1hc2sgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKDAsIDApO1xuICAgICAgICBtYXNrLmJlZ2luRmlsbCgweGZmZmZmZik7XG4gICAgICAgIG1hc2suZHJhd1JlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHJldHVybiBtYXNrO1xuICAgIH1cblxuICAgIGFuaW1hdGVEZWFsKCkge1xuICAgICAgICB0aGlzLmhpZGVDYXJkcygpO1xuXG4gICAgICAgIGNvbnN0IHNob3dUd2VlbiA9IHRoaXMuZ2FtZS5hZGQudHdlZW4odGhpcy5kaXNwbGF5LmNhcmRzKS50byh7eTogLXRoaXMubmFtZXBsYXRlLmhlaWdodCAvIDJ9LCA1MDAsIFBoYXNlci5FYXNpbmcuUXVhcnRpYy5PdXQsIHRydWUpO1xuXG4gICAgICAgIHNob3dUd2Vlbi5vbkNvbXBsZXRlLmFkZCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYXJkUG9zaXRpb25zID0gdGhpcy5jYWxjQ2FyZFBvc2l0aW9ucygpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmNhcmRzLmNhcmRzW2ldKS50byh7eDogY2FyZFBvc2l0aW9uc1tpXX0sIDUwMCwgUGhhc2VyLkVhc2luZy5RdWFydGljLk91dCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIGFuaW1hdGVGb2xkKCkge1xuICAgICAgICB0aGlzLnNob3dDYXJkcygpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmNhcmRzLmNhcmRzW2ldKS50byh7eDogMH0sIDUwMCwgUGhhc2VyLkVhc2luZy5RdWFydGljLk91dCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKDUwMCwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmRpc3BsYXkuY2FyZHMpLnRvKHt0b3A6IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUudG9wfSwgNTAwLCBQaGFzZXIuRWFzaW5nLlF1YXJ0aWMuT3V0LCB0cnVlKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgaGlkZUNhcmRzKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHMuY2FyZHNbaV0ueCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLnRvcCA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUudG9wO1xuICAgIH1cblxuICAgIHNob3dDYXJkcygpIHtcbiAgICAgICAgY29uc3QgY2FyZFBvc2l0aW9ucyA9IHRoaXMuY2FsY0NhcmRQb3NpdGlvbnMoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRzLmNhcmRzW2ldLnggPSBjYXJkUG9zaXRpb25zW2ldO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcy55ID0gLXRoaXMubmFtZXBsYXRlLmhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgQ2FsY3VsYXRlIHRoZSBmaW5hbCBwb3NpdGlvbnMgb2YgYWxsIGNhcmRzIGluIGhhbmRcbiAgICAgKlxuICAgICAqIE5PVEUgVE8gTUU6IERvbid0IGZ1Y2sgd2l0aCB0aGlzLiBJdCB0b29rIGEgbG9uZyB0aW1lIHRvIGdldCByaWdodC5cbiAgICAgKlxuICAgICAqIFRoZSBjYXJkcyBuZWVkIHRvIGJlIHBvc2l0aW9uZWQgY29ycmVjdGx5IGJvdGggaW4gcmVsYXRpb24gdG9cbiAgICAgKiB0aGVtc2VsdmVzIChzdGFnZ2VyZWQgZXZlbmx5KSBhbmQgYWxzbyBpbiByZWxhdGlvbiB0byB0aGUgbmFtZXBsYXRlLlxuICAgICAqIERvaW5nIHRoZSBsYXR0ZXIgYnkgY2VudGVyaW5nIHRoZSBjYXJkcycgZGlzcGxheSBncm91cCBvbiB0aGUgbmFtZXBsYXRlXG4gICAgICogd291bGQgaGF2ZSBiZWVuIG11Y2ggZWFzaWVyLCBidXQgdGhhdCB3YXkgbWFkZSBhbmltYXRpbmcgdGhlIGNhcmRcbiAgICAgKiBzcHJlYWQgbmVhcmx5IGltcG9zc2libGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119XG4gICAgICovXG4gICAgY2FsY0NhcmRQb3NpdGlvbnMoKSB7XG4gICAgICAgIGlmICghdGhpcy5jYXJkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwb3NpdGlvbnMgPSBbXTtcbiAgICAgICAgY29uc3QgY2FyZFdpZHRoID0gdGhpcy5jYXJkcy5jYXJkc1swXS53aWR0aDtcbiAgICAgICAgY29uc3QgY2FyZEFyZWEgPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLndpZHRoICogMC45O1xuICAgICAgICBjb25zdCB0b3RhbFdpZHRoID0gY2FyZFdpZHRoICogdGhpcy5jYXJkcy5sZW5ndGg7XG4gICAgICAgIGNvbnN0IHRvdGFsT3ZlcmZsb3cgPSB0b3RhbFdpZHRoIC0gY2FyZEFyZWE7XG4gICAgICAgIGNvbnN0IGNhcmRPZmZzZXQgPSB0b3RhbE92ZXJmbG93IC8gKHRoaXMuY2FyZHMubGVuZ3RoIC0gMSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gU3BhY2UgY2FyZHMgZXZlbmx5XG4gICAgICAgICAgICBsZXQgcG9zID0gY2FyZFdpZHRoICogaSAtIGNhcmRPZmZzZXQgKiBpO1xuXG4gICAgICAgICAgICAvLyBDZW50ZXIgY2FyZHMgb24gbmFtZXBsYXRlXG4gICAgICAgICAgICBwb3MgLT0gY2FyZEFyZWEgLyAyIC0gY2FyZFdpZHRoIC8gMjtcblxuICAgICAgICAgICAgcG9zaXRpb25zLnB1c2gocG9zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zaXRpb25zO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiaW1wb3J0IENoaXBNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DaGlwTWFuYWdlclwiO1xuXG5jbGFzcyBQb3Qge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5hbW91bnQgPSAwO1xuICAgICAgICB0aGlzLnNwcml0ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuY2hpcHMgPSBuZXcgQ2hpcE1hbmFnZXIodGhpcy5nYW1lLCBcImNoaXBzXCIsIHRoaXMuZ2FtZS5jb25maWcuZGVub21zKTtcbiAgICAgICAgdGhpcy5jaGlwcy5zdGFja0NoaXBzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2hpcHMuY29sb3JVcCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmNoaXBzLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5jaGlwcy5zZXRWYWx1ZSh0aGlzLmFtb3VudCk7XG4gICAgfVxuXG4gICAgc2V0QW1vdW50KGFtb3VudCkge1xuICAgICAgICB0aGlzLmFtb3VudCA9IGFtb3VudDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgZ2F0aGVyQ2hpcHMocGxheWVycykge1xuICAgICAgICBsZXQgZGVsYXkgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBwbGF5ZXJzW2ldO1xuICAgICAgICAgICAgaWYgKHBsYXllci5jaGlwcy5jaGlwcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKGRlbGF5LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW1vdW50ICs9IHBsYXllci5jaGlwcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlwcy50YWtlQ2hpcHMocGxheWVyLmNoaXBzLmNoaXBzKTtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgICAgICBkZWxheSArPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBvdDtcbiIsIi8qKlxuICogQSBzbGlkZXIgVUkgZWxlbWVudFxuICpcbiAqIFJlcHJlc2VudGVkIGJ5IGEgYmFyIHNwcml0ZSBhbmQgYSBtYXJrZXIgc3ByaXRlLiBEZXNwaXRlIGhvdyBpdCBtYXlcbiAqIGxvb2ssIGFsbCBpbnB1dCBvY2N1cnMgb24gdGhlIGJhciBhbmQgdXBkYXRlcyBhcmUgbWFkZSB0byB0aGVcbiAqIG1hcmtlcidzIHBvc2l0aW9uIGJhc2VkIG9uIHRob3NlIGlucHV0cy5cbiAqL1xuY2xhc3MgU2xpZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXkpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuYmFyID0gbnVsbDsgIC8vIFRoZSBzbGlkZXIgYmFyIHNwcml0ZVxuICAgICAgICB0aGlzLm1hcmtlciA9IG51bGw7ICAvLyBUaGUgZHJhZ2dhYmxlIG1hcmtlciBzcHJpdGVcbiAgICAgICAgdGhpcy5pbmRleCA9IDA7ICAvLyBDdXJyZW50IGluZGV4IG9mIG1hcmtlclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDE7ICAvLyBUb3RhbCBudW1iZXIgb2YgaW5kaWNlc1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7fTtcbiAgICAgICAgdGhpcy5pbmRleENoYW5nZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNsaWRlcldoZWVsID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5iYXIgPSB0aGlzLmdhbWUuYWRkLmltYWdlKDAsIDAsIHRoaXMua2V5LCBcInNsaWRlcl9iYXJcIik7XG4gICAgICAgIHRoaXMuYmFyLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0RG93bi5hZGQodGhpcy5zdGFydERyYWcsIHRoaXMpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dFVwLmFkZCh0aGlzLnN0b3BEcmFnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCgoKSA9PiB0aGlzLmVuYWJsZVNsaWRlcldoZWVsKHRydWUpKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHRoaXMuZW5hYmxlU2xpZGVyV2hlZWwoZmFsc2UpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhciA9IHRoaXMuYmFyO1xuXG4gICAgICAgIHRoaXMubWFya2VyID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgdGhpcy5rZXksIFwic2xpZGVyX21hcmtlclwiKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuYW5jaG9yLnNldFRvKDAuNSwgMCk7XG4gICAgICAgIHRoaXMubWFya2VyLmJvdHRvbSA9IHRoaXMuYmFyLmJvdHRvbTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1hcmtlciA9IHRoaXMubWFya2VyO1xuICAgICAgICB0aGlzLmJhci5hZGRDaGlsZCh0aGlzLm1hcmtlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIHNsaWRlciBkcmFnZ2luZyBhbmQgaW5pdGlhdGUgZmlyc3QgZHJhZyBldmVudFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlNwcml0ZX0gYmFyIC0gVGhlIGJhciBzcHJpdGUgdGhhdCB3YXMgY2xpY2tlZFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlBvaW50ZXJ9IHBvaW50ZXIgLSBUaGUgcG9pbnRlciB3aGljaCBpbml0aWF0ZWQgdGhlIGNsaWNrXG4gICAgICovXG4gICAgc3RhcnREcmFnKGJhciwgcG9pbnRlcikge1xuICAgICAgICAvLyBJbml0aWFsIGNhbGwgdG8gdXBkYXRlRHJhZyBhbGxvd3MgY2hhbmdpbmcgYmV0IHdpdGggY2xpY2sgb24gYmFyXG4gICAgICAgIHRoaXMudXBkYXRlRHJhZyhwb2ludGVyLCBwb2ludGVyLngsIHBvaW50ZXIueSk7XG4gICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5hZGRNb3ZlQ2FsbGJhY2sodGhpcy51cGRhdGVEcmFnLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBEaXNhYmxlIHNsaWRlciBkcmFnZ2luZ1xuICAgICAqL1xuICAgIHN0b3BEcmFnKCkge1xuICAgICAgICB0aGlzLmdhbWUuaW5wdXQuZGVsZXRlTW92ZUNhbGxiYWNrKHRoaXMudXBkYXRlRHJhZywgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgQ2FsY3VsYXRlIHNsaWRlciBpbmRleCBiYXNlZCBvbiBkcmFnIGlucHV0XG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBzbGlkaW5nIHBvaW50ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgb2YgcG9pbnRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZSBvZiBwb2ludGVyXG4gICAgICovXG4gICAgdXBkYXRlRHJhZyhwb2ludGVyLCB4LCB5KSB7XG4gICAgICAgIGxldCBsb2NhbFggPSB4IC0gdGhpcy5iYXIud29ybGQueDsgIC8vIENsaWNrIHBvcyBpbiByZWxhdGlvbiB0byBiYXJcblxuICAgICAgICAvLyBQcmV2ZW50IGRyYWdnaW5nIHBhc3QgYmFyIGJvdW5kc1xuICAgICAgICBpZiAobG9jYWxYIDwgMCkge1xuICAgICAgICAgICAgbG9jYWxYID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbFggPiB0aGlzLmJhci53aWR0aCkge1xuICAgICAgICAgICAgbG9jYWxYID0gdGhpcy5iYXIud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdWJ0cmFjdCAxIGZyb20gbGVuZ3RoIGJlY2F1c2UgbGVuZ3RoIGlzIDEtaW5kZXhlZCwgaW5kaWNlcyBhcmUgMC1pbmRleGVkXG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5yb3VuZChsb2NhbFggLyB0aGlzLmJhci53aWR0aCAqICh0aGlzLmxlbmd0aCAtIDEpKTtcbiAgICAgICAgdGhpcy5zZXRJbmRleChpbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBpbmRleCBvZiB0aGUgc2xpZGVyIGFuZCByZXBvcnQgdGhlIG5ldyB2YWx1ZVxuICAgICAqXG4gICAgICogT3B0aW9uYWxseSB1cGRhdGUgdGhlIHZpc3VhbCBwb3NpdGlvbiBvZiB0aGUgbWFya2VyIG9uIHRoZSBzbGlkZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBOZXcgaW5kZXggdG8gc2V0IG9uIHNsaWRlclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VwZGF0ZVBvcz10cnVlXSAtIFVwZGF0ZSB0aGUgcG9zaXRpb24gb2YgbWFya2VyP1xuICAgICAqL1xuICAgIHNldEluZGV4KGluZGV4LCB1cGRhdGVQb3MgPSB0cnVlKSB7XG4gICAgICAgIGlmIChpbmRleCAhPT0gdGhpcy5pbmRleCkge1xuICAgICAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgdGhpcy5pbmRleENoYW5nZWQuZGlzcGF0Y2goaW5kZXgpO1xuXG4gICAgICAgICAgICBpZiAodXBkYXRlUG9zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gb25seSBvbmUgYmV0IGF2YWlsYWJsZSwgaXQncyBhIG1heCBiZXRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrZXIueCA9IHRoaXMuYmFyLndpZHRoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IDEgZnJvbSBsZW5ndGggYmVjYXVzZSBsZW5ndGggaXMgMS1pbmRleGVkLCBpbmRpY2VzIGFyZSAwLWluZGV4ZWRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrZXIueCA9IHRoaXMuYmFyLndpZHRoIC8gKHRoaXMubGVuZ3RoIC0gMSkgKiB0aGlzLmluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFVwZGF0ZSB0aGUgbGVuZ3RoIHByb3BlcnR5XG4gICAgICpcbiAgICAgKiBUaGUgbGVuZ3RoIHByb3BlcnR5IGRlc2NyaWJlcyBob3cgbWFueSBkaXNjcmV0ZSBiZXRzIHRoZSBzbGlkZXIgYmFyXG4gICAgICogbXVzdCByZXByZXNlbnQuIFRoZSBzbGlkZXIgZG9lcyBub3QgY2FyZSBhYm91dCB3aGF0IHRoZSBzcGVjaWZpYyBiZXRcbiAgICAgKiBpdCByZXByZXNlbnRzIGlzLCBvbmx5IHRoYXQgaXQgaGFzIHNvbWUgbnVtYmVyIG9mIGluZGljZXMgYWxvbmcgaXRzXG4gICAgICogbGVuZ3RoIGFuZCB0aGF0IGl0IG11c3QgcmVwb3J0IGl0cyBpbmRleCB0byBsaXN0ZW5lcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIG5ldyBsZW5ndGggdG8gc2V0XG4gICAgICovXG4gICAgc2V0TGVuZ3RoKGxlbmd0aCkge1xuICAgICAgICBpZiAobGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3Qgc2V0IHNsaWRlciBsZW5ndGggbGVzcyB0aGFuIDFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAobGVuZ3RoID4gdGhpcy5iYXIud2lkdGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IFNldHRpbmcgc2xpZGVyIHN0b3BzIGdyZWF0ZXIgdGhhbiBsZW5ndGggbWF5IHJlc3VsdCBpbiB1bmV4cGVjdGVkIGJlaGF2aW9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIHRoZSBzbGlkZXJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBJcyB0aGUgc2xpZGVyIGVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0RW5hYmxlZChlbmFibGVkKSB7XG4gICAgICAgIHRoaXMuYmFyLmlucHV0RW5hYmxlZCA9IGVuYWJsZWQ7XG5cbiAgICAgICAgbGV0IHRpbnQgPSBlbmFibGVkID8gMHhGRkZGRkYgOiAweDgwODA4MDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhci50aW50ID0gdGludDtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1hcmtlci50aW50ID0gdGludDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSBkaXNwYXRjaCBvZiBzaWduYWwgb24gd2hlZWwgc2Nyb2xsXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gSXMgdGhlIGNhbGxiYWNrIGVuYWJsZWQgb3IgZGlzYWJsZWQ/XG4gICAgICovXG4gICAgZW5hYmxlU2xpZGVyV2hlZWwoZW5hYmxlZCkge1xuICAgICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmlucHV0Lm1vdXNlLm1vdXNlV2hlZWxDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlcldoZWVsLmRpc3BhdGNoKHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS53aGVlbERlbHRhKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQubW91c2UubW91c2VXaGVlbENhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyOyIsIi8qKlxuICogQHN1bW1hcnkgVHJhY2sgYW5kIHF1ZXVlIHR3ZWVucyBnYW1lIHdpZGVcbiAqXG4gKiBJdCdzIGVhc3kgdG8gY2hhaW4gdHdlZW5zIHdoZW4gdGhleSdyZSBjcmVhdGVkIGF0IHRoZSBzYW1lIHBvaW50XG4gKiBpbiB0aW1lLCBidXQgd2hhdCBpZiB0d28gdHdlZW5zIGFyZSBjcmVhdGVkIGF0IGNvbXBsZXRlbHkgZGlmZmVyZW50XG4gKiBwb2ludHM/IFdoYXQgaWYgdGhvc2UgdHdlZW5zIG5lZWQgdG8gcnVuIGNvbnNlY3V0aXZlbHksIHRoZSBzZWNvbmRcbiAqIHdhaXRpbmcgZm9yIHRoZSBmaXJzdCB0byBjb21wbGV0ZSBiZWZvcmUgc3RhcnRpbmc/XG4gKi9cblxuY2xhc3MgVHdlZW5RdWV1ZSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuXG4gICAgICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgcnVubmluZygpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5jdXJyZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEFkZCBhIHR3ZWVuIHRvIHRoZSBxdWV1ZVxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlR3ZWVufSB0d2VlbiAtIFRoZSB0d2VlbiB0byBhZGQgdG8gdGhlIHF1ZXVlXG4gICAgICovXG4gICAgYWRkKHR3ZWVuKSB7XG4gICAgICAgIC8vIFR3ZWVucyBhZGRlZCB0byB0aGUgcXVldWUgbWF5IGhhdmUgb3RoZXIgb25Db21wbGV0ZSBjYWxsYmFja3MsXG4gICAgICAgIC8vIGJ1dCB0aGV5IG11c3QgYXQgbGVhc3QgaGF2ZSB0aGlzIG9uZSwgd2hpY2ggdHJpZ2dlcnMgdGhlXG4gICAgICAgIC8vIG5leHQgdHdlZW4gaW4gdGhlIHF1ZXVlIHRvIGJlZ2luXG4gICAgICAgIHR3ZWVuLm9uQ29tcGxldGUuYWRkKHRoaXMubmV4dCwgdGhpcyk7XG5cbiAgICAgICAgLy8gQWRkIHRvIHRoZSBmcm9udCwgcmVtb3ZlIGZyb20gdGhlIGJhY2tcbiAgICAgICAgdGhpcy5xdWV1ZS51bnNoaWZ0KHR3ZWVuKTtcblxuICAgICAgICAvLyBBdXRvIHN0YXJ0IHRoZSBjaGFpbiBpZiBpdCdzIG5vdCBhbHJlYWR5IHJ1bm5pbmdcbiAgICAgICAgaWYgKCF0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU3RhcnQgdGhlIG5leHQgdHdlZW4gaW4gdGhlIHF1ZXVlXG4gICAgICovXG4gICAgbmV4dCgpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5xdWV1ZS5wb3AoKTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50LnN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFR3ZWVuUXVldWU7IiwibW9kdWxlLmV4cG9ydHM9e1xuICBcInBhbmVsXCI6IHtcbiAgICBcInBhZGRpbmdcIjogMTAsXG4gICAgXCJ0ZXh0U3R5bGVcIjoge1xuICAgICAgXCJmb250XCI6IFwiYm9sZCAyMnB0IEFyaWFsXCIsXG4gICAgICBcImZpbGxcIjogXCJ3aGl0ZVwiLFxuICAgICAgXCJhbGlnblwiOiBcImNlbnRlclwiXG4gICAgfSxcbiAgICBcInBvc1wiOiB7XG4gICAgICBcInhcIjogMTQ4MCxcbiAgICAgIFwieVwiOiA3OTBcbiAgICB9XG4gIH0sXG4gIFwic2VhdHNcIjogW1xuICAgIHtcInhcIjogODYwLCBcInlcIjogMjAwfSxcbiAgICB7XCJ4XCI6IDExNzgsIFwieVwiOiAyMDB9LFxuICAgIHtcInhcIjogMTUyMiwgXCJ5XCI6IDM0Mn0sXG4gICAge1wieFwiOiAxNTIyLCBcInlcIjogNjI2fSxcbiAgICB7XCJ4XCI6IDExNzgsIFwieVwiOiA4OTR9LFxuICAgIHtcInhcIjogODYwLCBcInlcIjogODk0fSxcbiAgICB7XCJ4XCI6IDU0MiwgXCJ5XCI6IDg5NH0sXG4gICAge1wieFwiOiAxOTgsIFwieVwiOiA2MjZ9LFxuICAgIHtcInhcIjogMTk4LCBcInlcIjogMzQyfSxcbiAgICB7XCJ4XCI6IDU0MiwgXCJ5XCI6IDIwMH1cbiAgXSxcbiAgXCJidXlJbk1vZGFsXCI6IHtcbiAgICBcInhcIjogODEwLFxuICAgIFwieVwiOiA0MzAsXG4gICAgXCJpbnB1dEJveFwiOiB7XG4gICAgICBcInhcIjogMTUsXG4gICAgICBcInlcIjogODZcbiAgICB9LFxuICAgIFwiaW5wdXRGaWVsZFwiOiB7XG4gICAgICBcInhcIjogMzAsXG4gICAgICBcInlcIjogLTJcbiAgICB9LFxuICAgIFwiY2FuY2VsQnV0dG9uXCI6IHtcbiAgICAgIFwieFwiOiAxNSxcbiAgICAgIFwieVwiOiAxNDVcbiAgICB9LFxuICAgIFwic3VibWl0QnV0dG9uXCI6IHtcbiAgICAgIFwieFwiOiAxNTUsXG4gICAgICBcInlcIjogMTQ1XG4gICAgfVxuICB9LFxuICBcImRlYWxlckJ1dHRvblwiOiBbXG4gICAge1wieFwiOiA4NDYsIFwieVwiOiAzMDB9LFxuICAgIHtcInhcIjogMTE2NCwgXCJ5XCI6IDMwMH0sXG4gICAge1wieFwiOiAxNTE2LCBcInlcIjogNDQyfSxcbiAgICB7XCJ4XCI6IDE1MTYsIFwieVwiOiA1OTJ9LFxuICAgIHtcInhcIjogMTE1MCwgXCJ5XCI6IDc5MH0sXG4gICAge1wieFwiOiA3ODQsIFwieVwiOiA3OTB9LFxuICAgIHtcInhcIjogNTI2LCBcInlcIjogNzkwfSxcbiAgICB7XCJ4XCI6IDQ0MCwgXCJ5XCI6IDU5Mn0sXG4gICAge1wieFwiOiA0NDAsIFwieVwiOiA0NDJ9LFxuICAgIHtcInhcIjogNTMyLCBcInlcIjogMzAwfVxuICBdLFxuICBcImRlbm9tc1wiOiBbNSwgMjUsIDEwMCwgNTAwLCAyMDAwXSxcbiAgXCJjaGlwc1wiOiBbXG4gICAge1wieFwiOiAxMDAsIFwieVwiOiAxMjB9LFxuICAgIHtcInhcIjogMTAwLCBcInlcIjogMTIwfSxcbiAgICB7XCJ4XCI6IC02MCwgXCJ5XCI6IDQwfSxcbiAgICB7XCJ4XCI6IC02MCwgXCJ5XCI6IDQwfSxcbiAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IC0xNDB9LFxuICAgIHtcInhcIjogMTAwLCBcInlcIjogLTE0MH0sXG4gICAge1wieFwiOiAxMDAsIFwieVwiOiAtMTQwfSxcbiAgICB7XCJ4XCI6IDI0MCwgXCJ5XCI6IDQwfSxcbiAgICB7XCJ4XCI6IDI0MCwgXCJ5XCI6IDQwfSxcbiAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IDEyMH1cbiAgXSxcbiAgXCJuYW1lcGxhdGVcIjoge1xuICAgIFwibmFtZVwiOiB7XG4gICAgICBcInhcIjogMTAsXG4gICAgICBcInlcIjogMzAsXG4gICAgICBcInN0eWxlXCI6IHtcbiAgICAgICAgXCJmb250XCI6IFwiYm9sZCAyMnB0IEFyaWFsXCIsXG4gICAgICAgIFwiZmlsbFwiOiBcIiMzMzMzMzNcIlxuICAgICAgfVxuICAgIH0sXG4gICAgXCJiYWxhbmNlXCI6IHtcbiAgICAgIFwieFwiOiAxMCxcbiAgICAgIFwieVwiOiA2MCxcbiAgICAgIFwic3R5bGVcIjoge1xuICAgICAgICBcImZvbnRcIjogXCIxNnB0IEFyaWFsXCIsXG4gICAgICAgIFwiYm91bmRzQWxpZ25IXCI6IFwicmlnaHRcIixcbiAgICAgICAgXCJmaWxsXCI6IFwiIzU1NTU1NVwiXG4gICAgICB9XG4gICAgfSxcbiAgICBcImZsYXNoXCI6IHtcbiAgICAgIFwic3R5bGVcIjoge1xuICAgICAgICBcImZvbnRcIjogXCJib2xkIDMwcHQgQXJpYWxcIixcbiAgICAgICAgXCJmaWxsXCI6IFwiIzMzMzMzM1wiXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBcInBvcHVwXCI6IHtcbiAgICBcInhcIjogMCxcbiAgICBcInlcIjogMTAsXG4gICAgXCJ3aWR0aFwiOiA2MCxcbiAgICBcImhlaWdodFwiOiAyMCxcbiAgICBcInRleHRcIjoge1xuICAgICAgXCJ4XCI6IDYsXG4gICAgICBcInlcIjogMTgsXG4gICAgICBcInN0eWxlXCI6IHtcbiAgICAgICAgXCJmb250XCI6IFwiMTJwdCBBcmlhbFwiLFxuICAgICAgICBcImJvdW5kc0FsaWduSFwiOiBcImNlbnRlclwiLFxuICAgICAgICBcImJvdW5kc0FsaWduVlwiOiBcImNlbnRlclwiLFxuICAgICAgICBcImZpbGxcIjogXCIjRkZGRkZGXCJcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCBCdXR0b24gZnJvbSBcIi4uL2NsYXNzZXMvQnV0dG9uXCI7XG5cbmNsYXNzIEJ1eUluTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJ1eUluUmVxdWVzdGVkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5zZWF0cyA9IHt9O1xuXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcImJ1dHRvbnNcIjogW10sIFwibW9kYWxcIjogbnVsbCwgXCJpbnB1dEJveFwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmJ1dHRvbnNHcm91cCk7XG5cbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkICYmIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkLnZpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShzZWF0Q29uZmlnLCBvY2N1cGllZFNlYXRzLCBtb2RhbENvbmZpZykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXRDb25maWcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgc2VhdENvbmZpZ1tpXS54LCBzZWF0Q29uZmlnW2ldLnksIHRoaXMua2V5LCB0aGlzLmJ1dHRvbkNsaWNrZWQsIHRoaXMpO1xuICAgICAgICAgICAgYnV0dG9uLnNlYXROdW0gPSBpOyAvLyBTdG9yZSBmb3IgdXNlIG9uIGNsaWNrXG4gICAgICAgICAgICBidXR0b24uc2V0RnJhbWVzKFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX292ZXJcIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9vdXRcIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9kb3duXCIsXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fdXBcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRUZXh0KFwiQnV5IEluXCIpO1xuICAgICAgICAgICAgdGhpcy5zZWF0c1tpXSA9IHtcbiAgICAgICAgICAgICAgICBcImJ1dHRvblwiOiBidXR0b24sXG4gICAgICAgICAgICAgICAgXCJvY2N1cGllZFwiOiBvY2N1cGllZFNlYXRzLmluZGV4T2YoaSkgIT09IC0xXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmJ1dHRvbnMucHVzaChidXR0b24pO1xuICAgICAgICAgICAgdGhpcy5idXR0b25zR3JvdXAuYWRkKGJ1dHRvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAudmlzaWJsZSA9IHRoaXMuYnV0dG9uc1Zpc2libGU7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsQmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgdGhpcy5nYW1lLnRleHR1cmVzLm1vZGFsQmFja2dyb3VuZCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkubW9kYWxCYWNrZ3JvdW5kKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwgPSB0aGlzLmdhbWUuYWRkLmltYWdlKG1vZGFsQ29uZmlnLngsIG1vZGFsQ29uZmlnLnksIHRoaXMua2V5LCBcIm1vZGFsXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkubW9kYWwpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEJveCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UobW9kYWxDb25maWcuaW5wdXRCb3gueCwgbW9kYWxDb25maWcuaW5wdXRCb3gueSwgdGhpcy5rZXksIFwiaW5wdXRfYm94XCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmlucHV0Qm94KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZCA9IHRoaXMuZ2FtZS5hZGQuaW5wdXRGaWVsZChtb2RhbENvbmZpZy5pbnB1dEZpZWxkLngsIG1vZGFsQ29uZmlnLmlucHV0RmllbGQueSwge1xuICAgICAgICAgICAgZm9udDogJzMycHggQXJpYWwnLFxuICAgICAgICAgICAgZmlsbDogJyMzMzMzMzMnLFxuICAgICAgICAgICAgd2lkdGg6IDIyMCxcbiAgICAgICAgICAgIHBhZGRpbmc6IDgsXG4gICAgICAgICAgICBib3JkZXJXaWR0aDogMCxcbiAgICAgICAgICAgIHBsYWNlSG9sZGVyOiAnMjAuMDAnLFxuICAgICAgICAgICAgdHlwZTogUGhhc2VySW5wdXQuSW5wdXRUeXBlLm51bWJlcixcbiAgICAgICAgICAgIGZpbGxBbHBoYTogMFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0Qm94LmFkZENoaWxkKHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkKTtcblxuICAgICAgICBjb25zdCBidG5UZXh0U3R5bGUgPSB7XG4gICAgICAgICAgICBcImZvbnRcIjogXCJib2xkIDIycHQgQXJpYWxcIixcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICAgICAgICBcImFsaWduXCI6IFwiY2VudGVyXCJcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FuY2VsID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIG1vZGFsQ29uZmlnLmNhbmNlbEJ1dHRvbi54LCBtb2RhbENvbmZpZy5jYW5jZWxCdXR0b24ueSwgdGhpcy5rZXksIHRoaXMuY2FuY2VsLCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbC5zZXRGcmFtZXMoXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X291dFwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X2Rvd25cIixcbiAgICAgICAgICAgIFwiYnRuX3NlY29uZGFyeV91cFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0VGV4dFN0eWxlKGJ0blRleHRTdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0VGV4dChcIkNBTkNFTFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLmFkZENoaWxkKHRoaXMuZGlzcGxheS5jYW5jZWwpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQgPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgbW9kYWxDb25maWcuc3VibWl0QnV0dG9uLngsIG1vZGFsQ29uZmlnLnN1Ym1pdEJ1dHRvbi55LCB0aGlzLmtleSwgdGhpcy5zdWJtaXQsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc3VibWl0LnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX3ByaW1hcnlfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9vdXRcIixcbiAgICAgICAgICAgIFwiYnRuX3ByaW1hcnlfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV91cFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0VGV4dFN0eWxlKGJ0blRleHRTdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0VGV4dChcIkJVWSBJTlwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLmFkZENoaWxkKHRoaXMuZGlzcGxheS5zdWJtaXQpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuc2VhdHNbcGxheWVyRGF0YS5zZWF0XS5vY2N1cGllZCA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHBsYXllckxlZnQocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLnNlYXRzW3BsYXllckRhdGEuc2VhdF0ub2NjdXBpZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgZm9yIChsZXQgc2VhdE51bSBpbiB0aGlzLnNlYXRzKSB7XG4gICAgICAgICAgICBsZXQgc2VhdCA9IHRoaXMuc2VhdHNbc2VhdE51bV07XG4gICAgICAgICAgICBzZWF0LmJ1dHRvbi52aXNpYmxlID0gIXNlYXQub2NjdXBpZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAudmlzaWJsZSA9IHRoaXMuYnV0dG9uc1Zpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgIH1cblxuICAgIGJ1dHRvbkNsaWNrZWQoYnV0dG9uKSB7XG4gICAgICAgIHRoaXMuZGF0YS5zZWF0TnVtID0gYnV0dG9uLnNlYXROdW07XG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBjYW5jZWwoKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHtcInNlYXROdW1cIjogbnVsbCwgXCJidXlJblwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHN1Ym1pdCgpIHtcbiAgICAgICAgdGhpcy5kYXRhLmJ1eUluID0gdGhpcy5kaXNwbGF5LmlucHV0RmllbGQudmFsdWU7XG4gICAgICAgIHRoaXMuYnV5SW5SZXF1ZXN0ZWQuZGlzcGF0Y2godGhpcy5kYXRhLnNlYXROdW0sIHRoaXMuZGF0YS5idXlJbik7XG4gICAgICAgIHRoaXMuZGF0YSA9IHtcInNlYXROdW1cIjogbnVsbCwgXCJidXlJblwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRCdXR0b25zVmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1eUluTWFuYWdlcjsiLCJpbXBvcnQgQ2FyZCBmcm9tIFwiLi4vY2xhc3Nlcy9DYXJkXCI7XG5cbmNsYXNzIENhcmRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBhdXRvSGlkZSA9IGZhbHNlLCBrZXkgPSBcImNhcmRzXCIpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5hdXRvSGlkZSA9IGF1dG9IaWRlOyAvLyBBdXRvLWhpZGUgYWxsIGZhY2UgZG93biBjYXJkcz9cbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuY2FyZHMgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuX21hc2sgPSBudWxsOyAgLy8gQSBtYXNrIGFwcGxpZWQgdG8gYWxsIGNhcmRzIGluIGRpc3BsYXlHcm91cFxuICAgIH1cblxuICAgIGluaXRpYWxpemUobnVtX2NhcmRzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtX2NhcmRzOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjYXJkID0gbmV3IENhcmQodGhpcy5nYW1lLCAwLCAwLCB0aGlzLmtleSwgdGhpcywgdGhpcy5hdXRvSGlkZSk7XG4gICAgICAgICAgICBjYXJkLmluaXRpYWxpemUoe30pO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNhcmRzLnB1c2goY2FyZCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQoY2FyZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRDYXJkTmFtZXMobmFtZXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS5uYW1lID0gbmFtZXNbaV07XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhcmRzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBzZXQgbWFzayhtYXNrKSB7XG4gICAgICAgIHRoaXMuX21hc2sgPSBtYXNrO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5tYXNrID0gbWFzaztcbiAgICB9XG5cbiAgICBnZXQgbWFzaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hc2s7XG4gICAgfVxuXG4gICAgZ2V0IGNhcmRXaWR0aCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHNbMF0ud2lkdGg7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXJkTWFuYWdlcjtcbiIsImltcG9ydCBDaGlwIGZyb20gXCIuLi9jbGFzc2VzL0NoaXBcIjtcbmltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5cbmNsYXNzIFRvb2x0aXAge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSwgcGFkZGluZyA9IDEwKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnBhZGRpbmcgPSBwYWRkaW5nO1xuXG4gICAgICAgIHRoaXMuX3RleHQgPSBcIlwiO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBudWxsLFxuICAgICAgICAgICAgdGV4dDogbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0IHRleHQodGV4dCkge1xuICAgICAgICB0aGlzLl90ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQudGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMucmVQb3MoKTtcbiAgICB9XG5cbiAgICBnZXQgdGV4dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XG4gICAgfVxuXG4gICAgc2V0IHZpc2libGUodmlzaWJsZSkge1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC52aXNpYmxlID0gdmlzaWJsZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhY2tncm91bmQgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCB0aGlzLmtleSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDIsIFwiXCIpOyAgIC8vIFRPRE8gLSBObyBtYWdpYyBudW1iZXJzIChsZWF2aW5nIGZvciBub3cgYmVjYXVzZSBmdWNrIHRyeWluZyB0byBwb3NpdGlvbiB0ZXh0IHZlcnRpY2FsbHkpXG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXh0LnNldFN0eWxlKHtcbiAgICAgICAgICAgIFwiZm9udFwiOiBcIjE2cHQgQXJpYWxcIixcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcIiNGRkZGRkZcIlxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQuYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS50ZXh0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJlUG9zKCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dC5zY2FsZS5zZXRUbygxKTtcbiAgICAgICAgY29uc3QgdGV4dEFyZWEgPSB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC53aWR0aCAtICh0aGlzLnBhZGRpbmcgKiAyKTtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheS50ZXh0LndpZHRoID4gdGV4dEFyZWEpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS50ZXh0LnNjYWxlLnNldFRvKHRleHRBcmVhIC8gdGhpcy5kaXNwbGF5LnRleHQud2lkdGgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBDaGlwTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5LCB2YWx1ZXMpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudmFsdWVzID0gdmFsdWVzO1xuXG4gICAgICAgIHRoaXMuc3RhY2tDaGlwcyA9IHRydWU7XG4gICAgICAgIHRoaXMuY29sb3JVcCA9IHRydWU7XG4gICAgICAgIHRoaXMuY2hpcHMgPSBbXTtcbiAgICAgICAgdGhpcy5wb29sID0gW107XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gbnVsbDtcbiAgICAgICAgdGhpcy50b29sdGlwID0gbmV3IFRvb2x0aXAodGhpcy5nYW1lLCB0aGlzLmdhbWUudGV4dHVyZXMudGV4dFVuZGVybGF5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcbiAgICAgICAgICAgIGNoaXBzOiB0aGlzLmdhbWUuYWRkLmdyb3VwKCksXG4gICAgICAgICAgICB0b29sdGlwOiB0aGlzLnRvb2x0aXAuZGlzcGxheUdyb3VwXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMudHJhbnNmZXJBbmltYXRpb24gPSB0aGlzLmFuaW1hdGVDaGlwQ2FzY2FkZTtcbiAgICAgICAgdGhpcy50cmFuc2ZlckNvbXBsZXRlID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5waWxlUmFkaXVzID0gMzA7XG4gICAgfVxuXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMudG9vbHRpcC50ZXh0ID0gVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuX3ZhbHVlKTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy50b29sdGlwLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS50b29sdGlwLnkgPSB0aGlzLmRpc3BsYXkudG9vbHRpcC5oZWlnaHQ7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuY2hpcHMpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnRvb2x0aXApO1xuICAgICAgICB0aGlzLnNldFZhbHVlKDApO1xuICAgIH1cblxuICAgIGdldENoaXAoKSB7XG4gICAgICAgIGxldCBjaGlwID0gdGhpcy5wb29sLnBvcCgpO1xuICAgICAgICBpZiAoIWNoaXApIHtcbiAgICAgICAgICAgIGNoaXAgPSBuZXcgQ2hpcCh0aGlzLmdhbWUsIDAsIDAsIHRoaXMua2V5LCB0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc2V0Q2hpcElucHV0cyhjaGlwKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5jaGlwcy5hZGRDaGlsZChjaGlwKTtcbiAgICAgICAgfVxuICAgICAgICBjaGlwLnJldml2ZSgpO1xuICAgICAgICBjaGlwLnBhcmVudC5icmluZ1RvVG9wKGNoaXApO1xuICAgICAgICB0aGlzLmNoaXBzLnB1c2goY2hpcCk7XG4gICAgICAgIHJldHVybiBjaGlwO1xuICAgIH1cblxuICAgIHNldENoaXBJbnB1dHMoY2hpcCkge1xuICAgICAgICBjaGlwLmV2ZW50cy5vbklucHV0T3Zlci5yZW1vdmVBbGwoKTtcbiAgICAgICAgY2hpcC5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHt0aGlzLnRvb2x0aXAudmlzaWJsZSA9IHRydWV9KTtcblxuICAgICAgICBjaGlwLmV2ZW50cy5vbklucHV0T3V0LnJlbW92ZUFsbCgpO1xuICAgICAgICBjaGlwLmV2ZW50cy5vbklucHV0T3V0LmFkZCgoKSA9PiB7dGhpcy50b29sdGlwLnZpc2libGUgPSBmYWxzZX0pO1xuICAgIH1cblxuICAgIHNldFZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5fdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbG9yVXApIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlIC09IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB0aGlzLnZhbHVlICs9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHlQb3MgPSAwO1xuICAgICAgICBsZXQgdmFsdWVzUHRyID0gdGhpcy52YWx1ZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgd2hpbGUgKHZhbHVlID49IDI1KSB7XG4gICAgICAgICAgICB3aGlsZSAodmFsdWUgPCB0aGlzLnZhbHVlc1t2YWx1ZXNQdHJdKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzUHRyLS07XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlc1B0ciA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgY2hpcCA9IHRoaXMuZ2V0Q2hpcCgpO1xuICAgICAgICAgICAgY2hpcC52YWx1ZSA9IHRoaXMudmFsdWVzW3ZhbHVlc1B0cl07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnN0YWNrQ2hpcHMpIHtcbiAgICAgICAgICAgICAgICBjaGlwLnkgPSB5UG9zO1xuICAgICAgICAgICAgICAgIHlQb3MgLT0gNTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hpcHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaXAueCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGNoaXAueSA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJhbmRQb3MgPSB0aGlzLnJhbmRDaGlwUG9zKCk7XG4gICAgICAgICAgICAgICAgICAgIGNoaXAueCA9IHJhbmRQb3MueDtcbiAgICAgICAgICAgICAgICAgICAgY2hpcC55ID0gcmFuZFBvcy55O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlIC09IHRoaXMudmFsdWVzW3ZhbHVlc1B0cl07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgbGV0IGNoaXA7XG4gICAgICAgIHdoaWxlIChjaGlwID0gdGhpcy5jaGlwcy5wb3AoKSkge1xuICAgICAgICAgICAgdGhpcy5wb29sLnB1c2goY2hpcCk7XG4gICAgICAgICAgICBjaGlwLmtpbGwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyQ2hpcChjaGlwKSB7XG4gICAgICAgIC8vIFJlbW92ZSBjaGlwIGZyb20gdGhpcy5jaGlwcyBpZiBmb3VuZFxuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGlwc1tpXS5pZCA9PT0gY2hpcC5pZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hpcHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgdGhpcy5wb29sLnB1c2goY2hpcCk7XG4gICAgICAgICAgICBjaGlwLmtpbGwoKTtcbiAgICAgICAgICAgIHJldHVybiBjaGlwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdGFrZUNoaXBzKGNoaXBzKSB7XG4gICAgICAgIGNoaXBzID0gY2hpcHMuc2xpY2UoKTtcbiAgICAgICAgbGV0IG5ld0NoaXBzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBuZXdDaGlwID0gdGhpcy50YWtlQ2hpcChjaGlwc1tpXSk7XG4gICAgICAgICAgICBuZXdDaGlwcy5wdXNoKG5ld0NoaXApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmFuc2ZlckFuaW1hdGlvbihuZXdDaGlwcyk7XG4gICAgfVxuXG4gICAgdGFrZUNoaXAoc3JjQ2hpcCkge1xuICAgICAgICBsZXQgbmV3Q2hpcCA9IHRoaXMuZ2V0Q2hpcCgpO1xuICAgICAgICBuZXdDaGlwLmNsb25lKHNyY0NoaXApO1xuICAgICAgICB0aGlzLnNldENoaXBJbnB1dHMobmV3Q2hpcCk7XG5cbiAgICAgICAgc3JjQ2hpcC5tYW5hZ2VyLmNsZWFyQ2hpcChzcmNDaGlwKTtcblxuICAgICAgICB0aGlzLnZhbHVlICs9IHNyY0NoaXAudmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIG5ld0NoaXA7XG4gICAgfVxuXG4gICAgYW5pbWF0ZVN0YWNrVHJhbnNmZXIoKSB7XG5cbiAgICB9XG5cbiAgICBhbmltYXRlQ2hpcENhc2NhZGUoY2hpcHMpIHtcbiAgICAgICAgbGV0IGRlbGF5ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNoaXAgPSBjaGlwc1tpXTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoZGVsYXksICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmFuZFBvcyA9IHRoaXMucmFuZENoaXBQb3MoKTtcbiAgICAgICAgICAgICAgICBsZXQgdHdlZW4gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKGNoaXApLnRvKHt4OiByYW5kUG9zLngsIHk6IHJhbmRQb3MueX0sIDIwMCwgUGhhc2VyLkVhc2luZy5RdWFkcmF0aWMuSW5PdXQsIHRydWUpO1xuICAgICAgICAgICAgICAgIGlmIChpID09PSBjaGlwcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHR3ZWVuLm9uQ29tcGxldGUuYWRkKCgpID0+IHRoaXMudHJhbnNmZXJDb21wbGV0ZS5kaXNwYXRjaCgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgIGRlbGF5ICs9IDEwMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJhbmRDaGlwUG9zKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSgtdGhpcy5waWxlUmFkaXVzLCB0aGlzLnBpbGVSYWRpdXMpLFxuICAgICAgICAgICAgeTogdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSgtdGhpcy5waWxlUmFkaXVzLCB0aGlzLnBpbGVSYWRpdXMpXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGlwTWFuYWdlcjsiLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi9jbGFzc2VzL1BsYXllclwiO1xuXG5jbGFzcyBQbGF5ZXJNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB1c2VySWQsIHNlYXRDb25maWcsIGNoaXBDb25maWcpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy51c2VySWQgPSB1c2VySWQ7XG4gICAgICAgIHRoaXMuc2VhdENvbmZpZyA9IHNlYXRDb25maWc7XG4gICAgICAgIHRoaXMuY2hpcENvbmZpZyA9IGNoaXBDb25maWc7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107ICAvLyBEaXJlY3QgYWNjZXNzIHRvIHRoZSBQbGF5ZXIgb2JqZWN0c1xuICAgICAgICB0aGlzLnVzZXJQbGF5ZXIgPSBudWxsOyAgLy8gVGhlIHVzZXIncyBwbGF5ZXIgb2JqZWN0LCBpZiBhdmFpbGFibGVcbiAgICAgICAgdGhpcy5uZXh0UGxheWVyID0gbnVsbDsgIC8vIFRoZSBwbGF5ZXIgdGhhdCB0aGUgZ2FtZSBleHBlY3RzIHRvIGFjdCBuZXh0XG4gICAgICAgIHRoaXMuZGVhbGVyUGxheWVyID0gbnVsbDsgICAvLyBDdXJyZW50IGhhbmQncyBkZWFsZXJcblxuICAgICAgICAvLyBDb250YWlucyBhbGwgZGlzcGxheSBlbGVtZW50cyBmb3IgYWxsIHBsYXllcnMgaW4gdGhlIGdhbWVcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgfVxuXG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGxheWVycy5sZW5ndGg7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5uZXdQbGF5ZXIocGxheWVyRGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXdQbGF5ZXIocGxheWVyRGF0YSkge1xuICAgICAgICBsZXQgcGxheWVyID0gbmV3IFBsYXllcih0aGlzLmdhbWUsIHRoaXMuY2hpcENvbmZpZyk7XG4gICAgICAgIHBsYXllci5pbml0aWFsaXplKHBsYXllckRhdGEpO1xuICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnggPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS54O1xuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnkgPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS55O1xuXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChwbGF5ZXIuZGlzcGxheUdyb3VwKTtcblxuICAgICAgICBpZiAocGxheWVyLnVzZXJJZCA9PT0gdGhpcy51c2VySWQpIHtcbiAgICAgICAgICAgIHRoaXMudXNlclBsYXllciA9IHBsYXllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgcGxheWVyTGVmdChwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLmdldEJ5SWQocGxheWVyRGF0YS5pZCk7XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCBmaW5kIHBsYXllciBhdCB0YWJsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAuZGVzdHJveSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1tpXSA9PT0gcGxheWVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbGF5ZXIgPT09IHRoaXMudXNlclBsYXllcikge1xuICAgICAgICAgICAgdGhpcy51c2VyUGxheWVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgZ2V0QnlJZChpZCkge1xuICAgICAgICAvLyBUT0RPIC0gRG8gdGhpcyB3aXRob3V0IGl0ZXJhdGluZyAtLSBidWlsZCBtYXAgb24gaW5pdD9cbiAgICAgICAgLy8gVE9ETyAtIFNob3VsZCB0aGlzIGV2ZXIgcmV0dXJuIG51bGw/XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0QnlTZWF0KHNlYXQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldLnNlYXQgPT09IHNlYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCBhIGxpc3Qgb2YgYWxsIG9jY3VwaWVkIHNlYXRzIGF0IHRoZSB0YWJsZVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gLSBUaGUgSURzIG9mIG9jY3VwaWVkIHNlYXRzXG4gICAgICovXG4gICAgZ2V0T2NjdXBpZWRTZWF0cygpIHtcbiAgICAgICAgbGV0IG9jY3VwaWVkU2VhdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG9jY3VwaWVkU2VhdHMucHVzaCh0aGlzLnBsYXllcnNbaV0uc2VhdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9jY3VwaWVkU2VhdHM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXJNYW5hZ2VyO1xuIiwiY29uc3QgaXNTdHJpbmcgPSB2YWwgPT4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG5jb25zdCBpc0Jsb2IgPSB2YWwgPT4gdmFsIGluc3RhbmNlb2YgQmxvYjtcblxucG9seWZpbGwuY2FsbCh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6IHRoaXMgfHwge30pO1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgaWYgKGlzU3VwcG9ydGVkLmNhbGwodGhpcykpIHJldHVybjtcblxuICBpZiAoISgnbmF2aWdhdG9yJyBpbiB0aGlzKSkgdGhpcy5uYXZpZ2F0b3IgPSB7fTtcbiAgdGhpcy5uYXZpZ2F0b3Iuc2VuZEJlYWNvbiA9IHNlbmRCZWFjb24uYmluZCh0aGlzKTtcbn07XG5cbmZ1bmN0aW9uIHNlbmRCZWFjb24odXJsLCBkYXRhKSB7XG4gIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudCAmJiB0aGlzLmV2ZW50LnR5cGU7XG4gIGNvbnN0IHN5bmMgPSBldmVudCA9PT0gJ3VubG9hZCcgfHwgZXZlbnQgPT09ICdiZWZvcmV1bmxvYWQnO1xuXG4gIGNvbnN0IHhociA9ICgnWE1MSHR0cFJlcXVlc3QnIGluIHRoaXMpID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcbiAgeGhyLm9wZW4oJ1BPU1QnLCB1cmwsICFzeW5jKTtcbiAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnKi8qJyk7XG5cblxuICBpZiAoaXNTdHJpbmcoZGF0YSkpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSAndGV4dC9wbGFpbic7XG4gIH0gZWxzZSBpZiAoaXNCbG9iKGRhdGEpICYmIGRhdGEudHlwZSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCBkYXRhLnR5cGUpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICB4aHIuc2VuZChkYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gIHJldHVybiAoJ25hdmlnYXRvcicgaW4gdGhpcykgJiYgKCdzZW5kQmVhY29uJyBpbiB0aGlzLm5hdmlnYXRvcik7XG59IiwiaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgQ29udHJvbGxlciBmcm9tIFwiLi4vY2xhc3Nlcy9Db250cm9sbGVyXCI7XG5cbmNsYXNzIEJvb3QgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbml0aWFsRGF0YSA9IHRoaXMuYXVnbWVudEluaXRpYWxEYXRhKGluaXRpYWxEYXRhKTtcbiAgICAgICAgdGhpcy5nYW1lLmNvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICAvLyBUT0RPIC0gVGhpcyBzaG91bGQgY29tZSBmcm9tIHNvbWV3aGVyZSBkeW5hbWljXG4gICAgICAgIHRoaXMuZ2FtZS5ydWxlcyA9IHtcbiAgICAgICAgICAgIGFudGU6IDAsXG4gICAgICAgICAgICBibGluZHM6IHtcbiAgICAgICAgICAgICAgICBzbWFsbDogMjUsXG4gICAgICAgICAgICAgICAgYmlnOiA1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcklkLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudG9rZW4pO1xuXG4gICAgICAgIGlmICh0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkKSB7XG4gICAgICAgICAgICB3aW5kb3cuZ2FtZSA9IHRoaXMuZ2FtZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibG9hZFwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAU3VtbWFyeSBDYWxjdWxhdGUgYWRkaXRpb25hbCB2YWx1ZXMgdG8gc3RvcmUgb24gZ2FtZS5pbml0aWFsRGF0YVxuICAgICAqXG4gICAgICogVG8gc2F2ZSBvbiBzZXJ2ZXItc2lkZSBwcm9jZXNzaW5nIGFuZCBkYXRhLXRyYW5zZmVyIGxvYWQsIHRoaXNcbiAgICAgKiBtZXRob2QgaXMgYSBwbGFjZSB0byBnZW5lcmF0ZSBhZGRpdGlvbmFsIGRhdGEgbmVlZGVkIGJ5IHRoZSBnYW1lXG4gICAgICogd2hpY2ggbWF5IGJlIGRlcml2ZWQgZnJvbSB0aGUgZGF0YSBzZW50IGZyb20gdGhlIGJhY2sgZW5kLlxuICAgICAqL1xuICAgIGF1Z21lbnRJbml0aWFsRGF0YShpbml0aWFsRGF0YSkge1xuICAgICAgICBpbml0aWFsRGF0YS5vY2N1cGllZFNlYXRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5pdGlhbERhdGEucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaW5pdGlhbERhdGEub2NjdXBpZWRTZWF0cy5wdXNoKGluaXRpYWxEYXRhLnBsYXllcnNbaV0uc2VhdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5pdGlhbERhdGE7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb290OyIsImNsYXNzIExvYWQgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIHByZWxvYWQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwiYmFja2dyb3VuZFwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2JhY2tncm91bmQucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcInJlZENpcmNsZVwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3JlZGNpcmNsZS5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJjYXJkc1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NhcmRzLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NhcmRzLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJwYW5lbFwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3BhbmVsLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3BhbmVsLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJkZWFsZXJCdXR0b25cIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9idXR0b24ucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV0dG9uLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJidXlJblwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2J1eWluLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2J1eWluLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJjaGlwc1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NoaXBzLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NoaXBzLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJuYW1lcGxhdGVcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9uYW1lcGxhdGUucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvbmFtZXBsYXRlLmpzb25cIik7XG5cbiAgICAgICAgdGhpcy5nYW1lLnRleHR1cmVzID0gdGhpcy5jcmVhdGVDdXN0b21UZXh0dXJlcygpO1xuXG4gICAgICAgIHRoaXMubG9hZFBsdWdpbnMoKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydChcIm1haW5cIik7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3VzdG9tVGV4dHVyZXMoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IHt9O1xuXG4gICAgICAgIGxldCBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMTAwLCAxMDAsIDEwMCwgMTAwKTtcbiAgICAgICAgdGV4dHVyZXNbXCJ3aGl0ZVNxdWFyZVwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmxpbmVTdHlsZSg0LCAweDAwMDAwMCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIDMwMCwgMTAwKTtcbiAgICAgICAgdGV4dHVyZXNbXCJ3aGl0ZVJlY3RcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHgwMDAwMDAsIDAuNSk7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIHRoaXMuZ2FtZS53aWR0aCwgdGhpcy5nYW1lLmhlaWdodCk7XG4gICAgICAgIHRleHR1cmVzW1wibW9kYWxCYWNrZ3JvdW5kXCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuXG4gICAgICAgIGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHgwMDAwMDAsIDAuNSk7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIHRoaXMuZ2FtZS5jb25maWcucG9wdXAud2lkdGgsIHRoaXMuZ2FtZS5jb25maWcucG9wdXAuaGVpZ2h0KTtcbiAgICAgICAgdGV4dHVyZXNbXCJ0ZXh0VW5kZXJsYXlcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0dXJlcztcbiAgICB9XG5cbiAgICBsb2FkUGx1Z2lucygpIHtcbiAgICAgICAgdGhpcy5nYW1lLmFkZC5wbHVnaW4oUGhhc2VySW5wdXQuUGx1Z2luKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYWQ7XG4iLCJpbXBvcnQge0FjdGlvbiwgQWN0aW9uVGV4dH0gZnJvbSBcIi4uL2NsYXNzZXMvQWN0aW9uXCI7XG5pbXBvcnQgQnV5SW5NYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9CdXlJbk1hbmFnZXJcIjtcbmltcG9ydCBDYXJkTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2FyZE1hbmFnZXJcIjtcbmltcG9ydCBEZWFsZXJCdXR0b24gZnJvbSBcIi4uL2NsYXNzZXMvRGVhbGVyQnV0dG9uXCI7XG5pbXBvcnQgUGFuZWwgZnJvbSBcIi4uL2NsYXNzZXMvUGFuZWxcIjtcbmltcG9ydCBQbGF5ZXJNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9QbGF5ZXJNYW5hZ2VyXCI7XG5pbXBvcnQgUG90IGZyb20gXCIuLi9jbGFzc2VzL1BvdFwiO1xuaW1wb3J0IFBva2VyIGZyb20gXCIuLi9Qb2tlclwiO1xuaW1wb3J0IFNTRSBmcm9tIFwiLi4vU1NFXCI7XG5pbXBvcnQgVHdlZW5RdWV1ZSBmcm9tIFwiLi4vY2xhc3Nlcy9Ud2VlblF1ZXVlXCI7XG5cbmNsYXNzIE1haW4gZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMudGFibGVfc3NlID0gbmV3IFNTRSh0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZVNTRVVybCk7XG4gICAgICAgIHRoaXMudXNlcl9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnVzZXJTU0VVcmwpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5sb2FkXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmRpc2Nvbm5lY3RCZWFjb24oKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCBcImJhY2tncm91bmRcIik7XG4gICAgICAgIHRoaXMubmV3SGFuZEJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDEwMCwgXCJuZXdcXG5oYW5kXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5uZXdIYW5kKTtcbiAgICAgICAgdGhpcy5kZWFsQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMjIwLCBcImRlYWxcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmRlYWwpO1xuICAgICAgICB0aGlzLmxlYXZlQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMzQwLCBcImxlYXZlXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5sZWF2ZVRhYmxlKTtcbiAgICAgICAgdGhpcy5iYkJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDQ2MCwgXCJCQlwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuYmIpO1xuICAgICAgICB0aGlzLnNiQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgNTgwLCBcIlNCXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5zYik7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMgPSBuZXcgUGxheWVyTWFuYWdlcih0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VySWQsIHRoaXMuZ2FtZS5jb25maWcuc2VhdHMsIHRoaXMuZ2FtZS5jb25maWcuY2hpcHMpO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVycy5pbml0aWFsaXplKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5wbGF5ZXJzLCB0aGlzLmdhbWUuY29uZmlnLnNlYXRzKTtcblxuICAgICAgICB0aGlzLmdhbWUuZGVhbGVyQnV0dG9uID0gbmV3IERlYWxlckJ1dHRvbih0aGlzLmdhbWUpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZCA9IG5ldyBDYXJkTWFuYWdlcih0aGlzLmdhbWUsIHRydWUpO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuaW5pdGlhbGl6ZSg1KTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5zZXRBbGwoXCJ2aXNpYmxlXCIsIHRydWUpO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmFsaWduKC0xLCAxLCB0aGlzLmdhbWUuYm9hcmQuY2FyZFdpZHRoICogMS4yLCAxKTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5jZW50ZXJYID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclg7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLnNldEFsbChcInZpc2libGVcIiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wb3QgPSBuZXcgUG90KHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wb3QuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5jaGlwcy5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYOyAgICAgLy8gVE9ETyAtIFBvc2l0aW9ucyBpbiBjb25maWdcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5jaGlwcy5kaXNwbGF5R3JvdXAuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZIC0gMTQwO1xuXG4gICAgICAgIC8vIFRPRE8gLSBUaGVzZSBzaG91bGQgZ28gc29tZXdoZXJlIGVsc2UuIE1heWJlIGluIFBvdD9cbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbCA9IG5ldyBQYW5lbCh0aGlzLmdhbWUsIFwicGFuZWxcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueCA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLng7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueSA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLnk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5hbHdheXNWaXNpYmxlID0gdGhpcy5nYW1lLmluaXRpYWxEYXRhLmVtdWxhdG9yRW5hYmxlZDtcblxuICAgICAgICB0aGlzLmdhbWUuYnV5SW4gPSBuZXcgQnV5SW5NYW5hZ2VyKHRoaXMuZ2FtZSwgXCJidXlJblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLmluaXRpYWxpemUodGhpcy5nYW1lLmNvbmZpZy5zZWF0cywgdGhpcy5nYW1lLnBsYXllcnMuZ2V0T2NjdXBpZWRTZWF0cygpLCB0aGlzLmdhbWUuY29uZmlnLmJ1eUluTW9kYWwpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uc2V0QnV0dG9uc1Zpc2libGUodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllciA9PT0gbnVsbCk7XG5cbiAgICAgICAgdGhpcy5nYW1lLnF1ZXVlID0gbmV3IFR3ZWVuUXVldWUodGhpcy5nYW1lKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdIYW5kXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3SGFuZDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJvYXJkLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZGVhbGVyUGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLmRlYWxlcik7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV07XG4gICAgICAgICAgICAgICAgcGxheWVyLmNhcmRzLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGlzRGVhbGVyOiBwbGF5ZXIuaWQgPT09IGRhdGEuZGVhbGVyLFxuICAgICAgICAgICAgICAgICAgICBpc05leHQ6IHBsYXllci5pZCA9PT0gZGF0YS5uZXh0LFxuICAgICAgICAgICAgICAgICAgICByb3VuZEJldDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldCgwKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmRlYWxlckJ1dHRvbi5tb3ZlVG9TZWF0KHRoaXMuZ2FtZS5wbGF5ZXJzLmRlYWxlclBsYXllci5zZWF0KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiZGVhbFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlYWw6IFwiLCBkYXRhKTtcblxuICAgICAgICAgICAgbGV0IGRlbGF5ID0gMDtcbiAgICAgICAgICAgIGxldCBzZWF0cyA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldE9jY3VwaWVkU2VhdHMoKTtcbiAgICAgICAgICAgIGxldCBzZWF0SW5kZXggPSBzZWF0cy5pbmRleE9mKHRoaXMuZ2FtZS5wbGF5ZXJzLmRlYWxlclBsYXllci5zZWF0KTtcbiAgICAgICAgICAgIHNlYXRJbmRleCA9IChzZWF0SW5kZXggKyAxKSAlIHNlYXRzLmxlbmd0aDsgIC8vIFN0YXJ0IHdpdGggcGxheWVyIHRvIGxlZnQgb2YgZGVhbGVyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnRpbWUuZXZlbnRzLmFkZChkZWxheSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeVNlYXQoc2VhdHNbc2VhdEluZGV4XSkuYW5pbWF0ZURlYWwoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VhdEluZGV4ID0gKHNlYXRJbmRleCArIDEpICUgc2VhdHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgICAgIGRlbGF5ICs9IDIwMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRCZXRzKFBva2VyLmdlbmVyYXRlUmFpc2VzKHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuc21hbGwsIHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuYmlnLCB0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlCZXQoUG9rZXIuZ2V0TWluQmV0KHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0VmlzaWJsZSh0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID09PSB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImVtdWxhdGVEZWFsXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlbXVsYXRlRGVhbDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGxheWVyRGF0YSA9IGRhdGFbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQocGxheWVyRGF0YS5wbGF5ZXJJZCkuY2FyZHMuc2V0Q2FyZE5hbWVzKHBsYXllckRhdGEuaG9sZGluZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwibmV3Um91bmRcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdSb3VuZDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBvdC5nYXRoZXJDaGlwcyh0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzW2ldLnVwZGF0ZSh7cm91bmRCZXQ6IDB9LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJhY3Rpb25cIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhY3Rpb246IFwiLCBkYXRhKTtcblxuICAgICAgICAgICAgaWYgKGRhdGEuYWN0aW9uVHlwZSA9PT0gQWN0aW9uLkZPTEQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEucGxheWVySWQpLmFuaW1hdGVGb2xkKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5zZXRDYXJkTmFtZXMoZGF0YS5ib2FyZCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLnBsYXllcklkKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgIGJhbGFuY2U6IGRhdGEucGxheWVyQmFsYW5jZSxcbiAgICAgICAgICAgICAgICBpc05leHQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJvdW5kQmV0OiBkYXRhLnBsYXllclJvdW5kQmV0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5wbGF5ZXJJZCkubmFtZXBsYXRlLmZsYXNoKHRoaXMucGFyc2VBY3Rpb25UZXh0KGRhdGEpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KS51cGRhdGUoe2lzTmV4dDogdHJ1ZX0pO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gZGF0YS5yb3VuZEJldDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gZGF0YS5yb3VuZFJhaXNlO1xuXG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KFBva2VyLmdldE1pbkJldCh0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImhhbmRDb21wbGV0ZVwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhhbmRDb21wbGV0ZTogXCIsIGRhdGEpO1xuXG4gICAgICAgICAgICAvLyBUT0RPIC0gSGFuZGxlIHNwbGl0IHBvdHNcbiAgICAgICAgICAgIC8vIGlmIChkYXRhLndpbm5lcnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgLy8gTk9URSAtIFRoaXMgaXMgYSB0ZW1wb3Jhcnkgc3RvcGdhcFxuICAgICAgICAgICAgaWYgKGRhdGEud2lubmVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIHNob3VsZCBiZSBob3cgdGhlIGNvZGUgZnVuY3Rpb25zIC0tIGFsbCB3aW5uZXJzIGNhbGxcbiAgICAgICAgICAgICAgICAvLyBjaGlwcy50YWtlQ2hpcHMgb24gYSBzcGVjaWZpYyBwb3QuIElmIHRoZXJlIGFyZSBtdWx0aXBsZVxuICAgICAgICAgICAgICAgIC8vIHdpbm5lcnMsIHRoZSBwb3QgbXVzdCBoYXZlIGFscmVhZHkgYmVlbiBzcGxpdCBpbnRvIHRoZVxuICAgICAgICAgICAgICAgIC8vIGFwcHJvcHJpYXRlIHNpemUgcGlsZXNcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEud2lubmVyc1swXS5pZCkuY2hpcHMudGFrZUNoaXBzKHRoaXMuZ2FtZS5wb3QuY2hpcHMuY2hpcHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGp1c3QgYSB0ZW1wb3Jhcnkgb3ZlcmZsb3cgbWVhc3VyZS4gSWYgdGhlIHBvdCB3YXNcbiAgICAgICAgICAgICAgICAvLyBzcGxpdCBvbiB0aGUgYmFjayBlbmQsIGRvbid0IGFuaW1hdGUgYW55dGhpbmcsIGFzIHdlIGFyZW4ndFxuICAgICAgICAgICAgICAgIC8vIHNwbGl0dGluZyBvbiB0aGUgZnJvbnQgZW5kIHlldC5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEud2lubmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgd2lubmVyID0gZGF0YS53aW5uZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKHdpbm5lci5pZCkudXBkYXRlKHtiYWxhbmNlOiB3aW5uZXIuYmFsYW5jZX0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucG90LmNoaXBzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV0uY2hpcHMuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwibmV3UGxheWVyXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdQbGF5ZXI6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5ld1BsYXllcihkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5idXlJbi5uZXdQbGF5ZXIoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4uc2V0QnV0dG9uc1Zpc2libGUodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllciA9PT0gbnVsbCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcInBsYXllckxlZnRcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInBsYXllckxlZnQ6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllckxlZnQoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4ucGxheWVyTGVmdChkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5idXlJbi5zZXRCdXR0b25zVmlzaWJsZSh0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyID09PSBudWxsKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMudXNlcl9zc2UuYWRkTGlzdGVuZXIoXCJkZWFsXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWFsOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyLmNhcmRzLnNldENhcmROYW1lcyhkYXRhLmhvbGRpbmdzKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5wcmltYXJ5Q2xpY2tlZC5hZGQodGhpcy5oYW5kbGVBY3Rpb24sIHRoaXMpO1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2Vjb25kYXJ5Q2xpY2tlZC5hZGQodGhpcy5oYW5kbGVBY3Rpb24sIHRoaXMpO1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwudGVydGlhcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbi5idXlJblJlcXVlc3RlZC5hZGQodGhpcy5nYW1lLmNvbnRyb2xsZXIuam9pbiwgdGhpcy5nYW1lLmNvbnRyb2xsZXIpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgUm91dGUgYWN0aW9ucyB0byBjb250cm9sbGVyIHJlcXVlc3RzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFjdGlvbiAtIFRoZSBhY3Rpb24gdG8gYmUgcmVxdWVzdGVkLCBkZWZpbmVkIGluIEFjdGlvbi5qc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiZXQgLSBUaGUgYmV0IChpZiBhbnkpIHRvIGJlIHNlbnQgdG8gdGhlIGNvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBoYW5kbGVBY3Rpb24oYWN0aW9uLCBiZXQpIHtcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uLkZPTEQ6XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuZm9sZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uQ0hFQ0s6XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuY2hlY2soKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uLkJFVDpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5iZXQoYmV0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiSW52YWxpZCBBY3Rpb24gVHlwZTogXCIgKyBhY3Rpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVHJhbnNmb3JtIGFjdGlvbiBkYXRhIGludG8gbW9yZSBkZXNjcmlwdGl2ZSBiZXQgc3RyaW5nXG4gICAgICpcbiAgICAgKiBBbGwgYmV0cyBhcmUgYmV0cywgYnV0IHNvbWUgcmVxdWlyZSBtb3JlIGRlc2NyaXB0aW9uIHRvIGZvbGxvdyBwb2tlclxuICAgICAqIGNvbnZlbnRpb24uIFNwZWNpZmljYWxseSwgYSBiZXQgd2hpY2gganVzdCBlcXVhbHMgYW4gZXhpc3RpbmcgYmV0IGlzIGFcbiAgICAgKiBjYWxsLCBhbmQgb25lIHdoaWNoIGluY3JlYXNlcyBhbiBleGlzdGluZyBiZXQgaXMgYSByYWlzZS5cbiAgICAgKlxuICAgICAqIE5PVEU6IFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBjYWxsZWQgQkVGT1JFIHRoZSBzdGF0ZSdzIGByb3VuZEJldGAgYW5kXG4gICAgICogYHJvdW5kUmFpc2VgIHZhcmlhYmxlcyBhcmUgdXBkYXRlZCwgYXMgdGhpcyBmdW5jdGlvbiBtdXN0IGNvbXBhcmVcbiAgICAgKiBuZXcgYmV0IGRhdGEgYWdhaW5zdCB0aGUgcHJldmlvdXMgc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYWN0aW9uRGF0YVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gVGhlIHRleHQgdG8gYmUgZmxhc2hlZFxuICAgICAqL1xuICAgIHBhcnNlQWN0aW9uVGV4dChhY3Rpb25EYXRhKSB7XG4gICAgICAgIGxldCBhY3Rpb25UZXh0ID0gQWN0aW9uVGV4dFthY3Rpb25EYXRhLmFjdGlvblR5cGVdO1xuICAgICAgICBpZiAoYWN0aW9uRGF0YS5hY3Rpb25UeXBlID09PSBBY3Rpb24uQkVUKSB7XG4gICAgICAgICAgICBpZiAoYWN0aW9uRGF0YS5wbGF5ZXJSb3VuZEJldCA9PT0gdGhpcy5nYW1lLnJvdW5kQmV0KSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uVGV4dCA9IFwiQ0FMTFwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb25EYXRhLnBsYXllclJvdW5kQmV0ID4gdGhpcy5nYW1lLnJvdW5kQmV0ICYmIHRoaXMuZ2FtZS5yb3VuZEJldCA+IDApIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25UZXh0ID0gXCJSQUlTRVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWN0aW9uRGF0YS5wbGF5ZXJCYWxhbmNlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uVGV4dCA9IFwiQUxMIElOXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjdGlvblRleHQ7XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4udXBkYXRlKCk7XG4gICAgfVxuXG4gICAgbWFrZUJ0bih4LCB5LCB0ZXh0LCB0ZXh0dXJlLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYnRuID0gdGhpcy5nYW1lLmFkZC5idXR0b24oeCwgeSwgdGV4dHVyZSwgY2FsbGJhY2ssIHRoaXMpO1xuICAgICAgICBidG4uYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgbGV0IGJ0blRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMCwgdGV4dCk7XG4gICAgICAgIGJ0blRleHQuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIGJ0bi5hZGRDaGlsZChidG5UZXh0KTtcbiAgICAgICAgYnRuLnRleHQgPSBidG5UZXh0O1xuXG4gICAgICAgIHJldHVybiBidG47XG4gICAgfVxuXG4gICAgZGVhbCgpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignUE9TVCcsICcvdGFibGVzLycgKyB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVOYW1lICsgJy9kZWFsLycpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdGFibGVOYW1lOiBpbml0aWFsRGF0YS50YWJsZU5hbWUsXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBuZXdIYW5kKCkge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy90YWJsZXMvJyArIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZU5hbWUgKyAnL25ldy1oYW5kLycpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdGFibGVOYW1lOiBpbml0aWFsRGF0YS50YWJsZU5hbWUsXG4gICAgICAgIH0pKTtcbiAgICB9O1xuXG4gICAgbGVhdmVUYWJsZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIubGVhdmUoKTtcbiAgICB9XG5cbiAgICBiYigpIHtcbiAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuYmIoKTtcbiAgICB9O1xuXG4gICAgc2IoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLnNiKCk7XG4gICAgfTtcblxuICAgIGdlbmVyYXRlQmV0cyhwbGF5ZXJSb3VuZEJldCwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICByZXR1cm4gUG9rZXIuZ2VuZXJhdGVCZXRzKDI1LCA1MCwgdGhpcy5nYW1lLnJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHBsYXllckJhbGFuY2UpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFpbjtcbiJdfQ==
