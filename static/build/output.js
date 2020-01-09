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

},{"./states/Boot":23,"./states/Load":24,"./states/Main":25}],2:[function(require,module,exports){
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

},{"../classes/Action":5,"../classes/Nameplate":11,"../managers/CardManager":19,"../managers/ChipManager":20}],14:[function(require,module,exports){
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

},{"../managers/ChipManager":20}],15:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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
},{}],18:[function(require,module,exports){
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

},{"../classes/Button":6}],19:[function(require,module,exports){
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

},{"../classes/Card":7}],20:[function(require,module,exports){
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

},{"../Util":4,"../classes/Chip":8}],21:[function(require,module,exports){
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

},{"../classes/Player":13}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{"../classes/Controller":9,"../config":17}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

            var numSeats = 10; // TODO - Make dynamic
            this.game.players = new _PlayerManager2.default(this.game, this.game.initialData.userId, this.game.config.seats[numSeats], this.game.config.chips[numSeats]);
            this.game.players.initialize(this.game.initialData.players, this.game.config.seats[numSeats]);

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
            this.game.buyIn.initialize(this.game.config.seats[numSeats], this.game.players.getOccupiedSeats(), this.game.config.buyInModal);
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

},{"../Poker":2,"../SSE":3,"../classes/Action":5,"../classes/Panel":12,"../classes/Pot":14,"../classes/TweenQueue":16,"../managers/BuyInManager":18,"../managers/CardManager":19,"../managers/PlayerManager":21}]},{},[1,22])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NoaXAuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQ29udHJvbGxlci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9MYWJlbC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9OYW1lcGxhdGUuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGFuZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGxheWVyLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BvdC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9TbGlkZXIuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvVHdlZW5RdWV1ZS5qcyIsInN0YXRpYy9zcmMvY29uZmlnLmpzb24iLCJzdGF0aWMvc3JjL21hbmFnZXJzL0J1eUluTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvQ2FyZE1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL0NoaXBNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9QbGF5ZXJNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9wb2x5ZmlsbHMvc2VuZGJlYWNvbi5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL0Jvb3QuanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Mb2FkLmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTSxJOzs7QUFDRixvQkFB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RUFBVjtBQUNBLGdCQUFJLElBQUosQ0FBUyxNQUFULEVBQWlCLGFBQWEsS0FBSyxJQUFMLENBQVUsV0FBVixDQUFzQixTQUFuQyxHQUErQyxZQUFoRTtBQUNBLGdCQUFJLGdCQUFKLENBQXFCLGNBQXJCLEVBQXFDLGtCQUFyQztBQUNBLGdCQUFJLElBQUosQ0FBUyxLQUFLLFNBQUwsQ0FBZTtBQUNwQiwyQkFBVyxZQUFZO0FBREgsYUFBZixDQUFUO0FBR0g7OztxQ0FFWTtBQUNULGlCQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLEtBQXJCO0FBQ0g7Ozs2QkFFSTtBQUNELGlCQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLEVBQXJCO0FBQ0g7Ozs2QkFFSTtBQUNELGlCQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLEVBQXJCO0FBQ0g7OztxQ0FFWSxjLEVBQWdCLGEsRUFBZTtBQUN4QyxtQkFBTyxnQkFBTSxZQUFOLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCLEtBQUssSUFBTCxDQUFVLFFBQXJDLEVBQStDLGNBQS9DLEVBQStELEtBQUssSUFBTCxDQUFVLFVBQXpFLEVBQXFGLGFBQXJGLENBQVA7QUFDSDs7OztFQTVTYyxPQUFPLEs7O2tCQStTWCxJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEJvb3QgZnJvbSBcIi4vc3RhdGVzL0Jvb3RcIjtcbmltcG9ydCBMb2FkIGZyb20gXCIuL3N0YXRlcy9Mb2FkXCI7XG5pbXBvcnQgTWFpbiBmcm9tIFwiLi9zdGF0ZXMvTWFpblwiO1xuXG5jbGFzcyBHYW1lIGV4dGVuZHMgUGhhc2VyLkdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICB3aWR0aDogMTkyMCxcbiAgICAgICAgICAgIGhlaWdodDogMTA4MFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImJvb3RcIiwgQm9vdCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImxvYWRcIiwgTG9hZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcIm1haW5cIiwgTWFpbiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJib290XCIpO1xuICAgIH1cbn1cblxubmV3IEdhbWUoKTtcbiIsIi8qKlxuICogQHN1bW1hcnkgQSB1dGlsaXR5IGNsYXNzIG9mIFBva2VyLXNwZWNpZmljIGZ1bmN0aW9uYWxpdHlcbiAqL1xuY2xhc3MgUG9rZXIge1xuICAgIC8vIFRPRE8gLSBUaGlzIHV0aWxpdHkgaXMgaGlnaGx5LXNwZWNpZmljIHRvIE5MIGdhbWVzLCBtYXliZSBldmVuIHRvIE5MSEUuXG4gICAgLy8gIE5lZWQgdG8gbWFrZSBpdCBtb3JlIGdlbmVyaWMgZXZlbnR1YWxseSB0byBhbGxvdyBmb3Igb3RoZXIgZ2FtZVxuICAgIC8vICB0eXBlcy4gTGltaXQgYW5kIHBvdC1saW1pdCBnYW1lcyB3aWxsIHdvcmsgY29tcGxldGVseSBkaWZmZXJlbnRseS5cbiAgICAvLyAgQW50ZXMgYXJlIGFsc28gbm90IHN1cHBvcnRlZC5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdlbmVyYXRlIGFsbCBsZWdhbCByYWlzZXMgZm9yIHBsYXllclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzbWFsbEJsaW5kIC0gVGhlIHNtYWxsIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119IC0gVGhlIHZhbGlkIHJhaXNlc1xuICAgICAqL1xuICAgIHN0YXRpYyBnZW5lcmF0ZVJhaXNlcyhzbWFsbEJsaW5kLCBiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IHJhaXNlID0gUG9rZXIuZ2V0TWluUmFpc2UoYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICAgICAgbGV0IHJhaXNlcyA9IFtyYWlzZV07XG5cbiAgICAgICAgd2hpbGUgKHJhaXNlICsgc21hbGxCbGluZCA8PSBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgICAgICByYWlzZSArPSBzbWFsbEJsaW5kO1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocmFpc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJhaXNlIDwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocGxheWVyQmFsYW5jZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmFpc2VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgYmV0IGZvciBwbGF5ZXJcbiAgICAgKlxuICAgICAqIElmIG5vIGJldHMgaGF2ZSBvY2N1cnJlZCBpbiBjdXJyZW50IHJvdW5kLCB0aGUgbWluIGJldCBpcyBhXG4gICAgICogY2hlY2sgKGJldCBvZiAwKSwgb3RoZXJ3aXNlIGl0J3MgYSBjYWxsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5CZXQocm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCBtaW5CZXQgPSByb3VuZEJldCA9PT0gMCA/IDAgOiByb3VuZEJldCAtIHBsYXllclJvdW5kQmV0O1xuICAgICAgICBpZiAocGxheWVyQmFsYW5jZSA8IG1pbkJldCkge1xuICAgICAgICAgICAgbWluQmV0ID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluQmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgcmFpc2UgZm9yIHBsYXllclxuICAgICAqXG4gICAgICogTk9URTogQSByYWlzZSBoZXJlIG1heSBhY3R1YWxseSBtZWFuIGEgYmV0IGluIHBva2VyIHRlcm1zLiBJbiB0aGVcbiAgICAgKiBwYXJsYW5jZSBvZiB0aGlzIHV0aWxpdHksIGEgcmFpc2UgaXMgYW4gYWdncmVzc2l2ZSBhY3Rpb24sIG9yIHNvbWV0aGluZ1xuICAgICAqIHdoaWNoIHdvdWxkIGZvcmNlIG90aGVyIHBsYXllcnMgdG8gY29udHJpYnV0ZSBtb3JlIHRvIHRoZSBwb3QgdGhhblxuICAgICAqIHRoZSBvdGhlcndpc2Ugd291bGQgaGF2ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5SYWlzZShiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IG1pblJhaXNlID0gcm91bmRCZXQgPT09IDAgPyBiaWdCbGluZCA6IHJvdW5kQmV0IC0gcGxheWVyUm91bmRCZXQgKyBwcmV2UmFpc2U7XG4gICAgICAgIGlmIChwbGF5ZXJCYWxhbmNlIDwgbWluUmFpc2UpIHtcbiAgICAgICAgICAgIG1pblJhaXNlID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluUmFpc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb2tlcjsiLCJjbGFzcyBTU0Uge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVybCkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodGhpcy51cmwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJlIGFkZHMgYWxsIGxpc3RlbmVycyB0byB0aGlzLnNvdXJjZVxuICAgICAqXG4gICAgICogSSBvcmlnaW5hbGx5IHdyb3RlIHRoaXMgdG8gc3VwcG9ydCBjbGllbnQgcmVjb25uZWN0cywgYnV0IEkgZG9uJ3QgbmVlZFxuICAgICAqIHRoYXQgYW55bW9yZS4gS2VlcGluZyB0aGUgbGlzdGVuZXIgY29kZSBqdXN0IGluIGNhc2UuXG4gICAgICovXG4gICAgcmVBZGRBbGxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycztcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobGlzdGVuZXIudHlwZSwgbGlzdGVuZXIuY2FsbGJhY2ssIGxpc3RlbmVyLmNhbGxiYWNrQ29udGV4dCwgLi4ubGlzdGVuZXIuYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIFN0b3JlIGxpc3RlbmVycyBmb3IgZXZlbnR1YWwgcmVjb25uZWN0XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgICAgXCJ0eXBlXCI6IHR5cGUsXG4gICAgICAgICAgICBcImNhbGxiYWNrXCI6IGNhbGxiYWNrLFxuICAgICAgICAgICAgXCJjYWxsYmFja0NvbnRleHRcIjogY2FsbGJhY2tDb250ZXh0LFxuICAgICAgICAgICAgXCJhcmdzXCI6IGFyZ3NcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU1NFOyIsImNsYXNzIFV0aWwge1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJldHVybiBhIGZvcm1hdHRlZCBjdXJyZW5jeSBzdHJpbmcgZnJvbSBhbiBpbnRlZ2VyXG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlQ3VycmVuY3koaW50KSB7XG4gICAgICAgIGxldCB2YWwgPSBpbnQgLyAxMDA7XG4gICAgICAgIHJldHVybiBcIiRcIiArIHZhbC50b0ZpeGVkKDIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXRpbDsiLCJjb25zdCBBY3Rpb24gPSB7XG4gICAgQkxJTkQ6IDAsXG4gICAgRk9MRDogMSxcbiAgICBDSEVDSzogMixcbiAgICBCRVQ6IDNcbn07XG5cbmNvbnN0IEFjdGlvblRleHQgPSB7XG4gICAgMDogXCJCTElORFwiLFxuICAgIDE6IFwiRk9MRFwiLFxuICAgIDI6IFwiQ0hFQ0tcIixcbiAgICAzOiBcIkJFVFwiXG59O1xuXG5leHBvcnQge0FjdGlvbiwgQWN0aW9uVGV4dH07IiwiLyoqXG4gKiBBIFBoYXNlci5CdXR0b24gd2l0aCBhIFBoYXNlci5UZXh0IGNlbnRlcmVkIG9uIHRoZSBidXR0b25cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIG1lcmVseSBhIHRoaW4gd3JhcHBlciBhcm91bmQgUGhhc2VyLkJ1dHRvbiB0byBhbGxvdyBmb3JcbiAqIGVhc3kgdXNlIG9mIGEgdGV4dCBsYWJlbCBvbiB0aGUgYnV0dG9uLiBUaGUgdGV4dCBpcyBhIGNoaWxkIG9mIHRoZSBidXR0b24sXG4gKiBzbyBpdCBtb3ZlcyB3aGVuIHRoZSBidXR0b24gbW92ZXMuIEl0J3MgY2VudGVyZWQgb24gdGhlIGJ1dHRvbiBhbmQgc2NhbGVzXG4gKiBhdXRvbWF0aWNhbGx5IHRvIGZpeCB3aXRoaW4gdGhlIGJ1dHRvbidzIGJvdW5kcy5cbiAqXG4gKiBJZiBub25lIG9mIHRoZSBsYWJlbCBmdW5jdGlvbmFsaXR5IGlzIHVzZWQsIHRoaXMgY2xhc3MgaXMgaWRlbnRpY2FsIHRvXG4gKiBQaGFzZXIuQnV0dG9uLlxuICovXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBQaGFzZXIuQnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSkge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSk7XG5cbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSAxMDtcbiAgICAgICAgdGhpcy5sYWJlbFRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSB7fTtcbiAgICAgICAgdGhpcy5sYWJlbCA9IG5ldyBQaGFzZXIuVGV4dCh0aGlzLmdhbWUsIDAsIDAsIHRoaXMubGFiZWxUZXh0KTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmxhYmVsKTtcblxuICAgICAgICAvLyBNdXN0IGFkZCB0byBnYW1lIHdvcmxkIG1hbnVhbGx5IGlmIG5vdCB1c2luZyBnYW1lLmFkZC5idXR0b25cbiAgICAgICAgdGhpcy5nYW1lLndvcmxkLmFkZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHRleHQgZGlzcGxheWVkIG9uIHRoZSBidXR0b25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGRpc3BsYXlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0VGV4dCh0ZXh0LCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxUZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBzdHlsZSBmb3IgdGhlIGJ1dHRvbiB0ZXh0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gVGhlIHRleHQgc3R5bGUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFRleHRTdHlsZShzdHlsZSwgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSBzdHlsZTtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBwYWRkaW5nIGJldHdlZW4gdGhlIHRleHQgYW5kIHRoZSBidXR0b24gcGVyaW1ldGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmcgLSBUaGUgcGFkZGluZyBpbiBwaXhlbHNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0UGFkZGluZyhwYWRkaW5nLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxQYWRkaW5nID0gcGFkZGluZztcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIGJ1dHRvblxuICAgICAqIE9uIGRpc2FibGUsIGRpc2FibGVzIGFsbCBpbnB1dCB0byB0aGUgYnV0dG9uIGFuZCByZW5kZXJzIGl0IGdyYXllZFxuICAgICAqIG91dC4gQWxsIHVwZGF0ZXMgYXJlIGRlbGF5ZWQgdW50aWwgcmUtZW5hYmxlLCB1bmxlc3MgZm9yY2VkLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIEVuYWJsZSBvciBkaXNhYmxlIGJ1dHRvbj9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmxhYmVsLnRpbnQgPSB0aW50O1xuXG4gICAgICAgIC8vIFVwZGF0ZSBvbiByZS1lbmFibGVcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFVwZGF0ZSBhbGwgYnV0dG9uIGF0dHJpYnV0ZXMgdG8gY3VycmVudCBwcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBJZiB0aGUgYnV0dG9uIGlzIGRpc2FibGVkLCB0aGlzIHdpbGwgaGF2ZSBubyBlZmZlY3QuIFRoZVxuICAgICAqIGRldmVsb3BlciBtYXkgb3B0aW9uYWxseSBjaG9vc2UgdG8gZm9yY2UgdGhlIHVwZGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSB0aGUgdXBkYXRlP1xuICAgICAqL1xuICAgIHVwZGF0ZUxhYmVsKGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCB8fCBmb3JjZSkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbC50ZXh0ID0gdGhpcy5sYWJlbFRleHQ7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnNldFN0eWxlKHRoaXMubGFiZWxTdHlsZSk7XG4gICAgICAgICAgICB0aGlzLnJlUG9zTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNjYWxlIGxhYmVsIHRleHQgdG8gZml0IG9uIGJ1dHRvbiBhbmQgY2VudGVyXG4gICAgICovXG4gICAgcmVQb3NMYWJlbCgpIHtcbiAgICAgICAgdGhpcy5sYWJlbC5zY2FsZS5zZXRUbygxKTtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFIID0gdGhpcy53aWR0aCAtIHRoaXMubGFiZWxQYWRkaW5nICogMjtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFWID0gdGhpcy5oZWlnaHQgLSB0aGlzLmxhYmVsUGFkZGluZyAqIDI7XG4gICAgICAgIGlmICh0aGlzLmxhYmVsLndpZHRoID4gdGV4dEFyZWFIIHx8IHRoaXMubGFiZWwuaGVpZ2h0ID4gdGV4dEFyZWFWKSB7XG4gICAgICAgICAgICBjb25zdCByZWR1Y2VkU2NhbGVIID0gdGV4dEFyZWFIIC8gdGhpcy5sYWJlbC53aWR0aDtcbiAgICAgICAgICAgIGNvbnN0IHJlZHVjZWRTY2FsZVYgPSB0ZXh0QXJlYVYgLyB0aGlzLmxhYmVsLmhlaWdodDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2NhbGUuc2V0VG8oTWF0aC5taW4ocmVkdWNlZFNjYWxlSCwgcmVkdWNlZFNjYWxlVikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFiZWwuY2VudGVyWCA9IHRoaXMud2lkdGggLyAyO1xuICAgICAgICB0aGlzLmxhYmVsLmNlbnRlclkgPSB0aGlzLmhlaWdodCAvIDI7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjsiLCJjbGFzcyBDYXJkIGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwga2V5LCBtYW5hZ2VyLCBhdXRvSGlkZSA9IGZhbHNlKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSk7XG4gICAgICAgIGdhbWUud29ybGQuYWRkKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuXG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7ICAvLyBTdHJpbmcgSUQgb2YgY2FyZCwgZS5nLiAnS2gnIG9yICc3cydcbiAgICAgICAgdGhpcy5hdXRvSGlkZSA9IGF1dG9IaWRlO1xuXG4gICAgICAgIHRoaXMuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5mcmFtZU5hbWUgPSB0aGlzLm5hbWUgPyB0aGlzLm5hbWUgOiBcImJhY2tcIjtcblxuICAgICAgICAvLyBBdXRvLWhpZGUgZmFjZSBkb3duIGNhcmRzLCBpZiBmbGFnIHNldFxuICAgICAgICAvLyBUaGlzIHdpbGwgY2F1c2UgcHJvYmxlbXMgaWYgbWFudWFsbHkgaGlkaW5nIGFuZCBzaG93aW5nXG4gICAgICAgIC8vIGNhcmRzLiBFLmcuIG1hbnVhbGx5IHNldCBjYXJkIHRvIGhpZGRlbiBldmVuIHRob3VnaCBpdCBoYXNcbiAgICAgICAgLy8gYSB0cnV0aHkgYG5hbWVgIHByb3BlcnR5LCB0aGVuIGNhbGwgaXQgd2lsbCBiZWNvbWUgdmlzaWJsZVxuICAgICAgICAvLyBhZ2FpbiB3aGVuIHVwZGF0ZURpc3BsYXkgaXMgY2FsbGVkIGlmIGBhdXRvSGlkZWAgaXMgdHJ1ZS5cbiAgICAgICAgdGhpcy52aXNpYmxlID0gIXRoaXMuYXV0b0hpZGUgfHwgdGhpcy5uYW1lO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZDtcbiIsImNsYXNzIENoaXAgZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIG1hbmFnZXIpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwga2V5KTtcbiAgICAgICAgZ2FtZS53b3JsZC5hZGQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG5cbiAgICAgICAgdGhpcy5pZCA9ICsrQ2hpcC5jb3VudGVyO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IDA7XG4gICAgICAgIHRoaXMuYW5nbGUgPSAwO1xuXG4gICAgICAgIHRoaXMuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yb3RhdGVSYW5kb20oKTtcbiAgICB9XG5cbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5mcmFtZU5hbWUgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cblxuICAgIGNsb25lKGNoaXApIHtcbiAgICAgICAgdGhpcy54ID0gY2hpcC53b3JsZFBvc2l0aW9uLnggLSB0aGlzLnBhcmVudC53b3JsZFBvc2l0aW9uLng7XG4gICAgICAgIHRoaXMueSA9IGNoaXAud29ybGRQb3NpdGlvbi55IC0gdGhpcy5wYXJlbnQud29ybGRQb3NpdGlvbi55O1xuICAgICAgICB0aGlzLmtleSA9IGNoaXAua2V5O1xuICAgICAgICB0aGlzLmFuZ2xlID0gY2hpcC5hbmdsZTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IGNoaXAudmFsdWU7XG4gICAgfVxuXG4gICAgcm90YXRlUmFuZG9tKCkge1xuICAgICAgICB0aGlzLmFuZ2xlID0gdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSgtMTgwLCAxODApO1xuICAgIH1cbn1cblxuQ2hpcC5jb3VudGVyID0gMDtcblxuZXhwb3J0IGRlZmF1bHQgQ2hpcDsiLCJjbGFzcyBDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBwbGF5ZXJJZCwgdG9rZW4pIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBhY2Nlc3MgdG9rZW4gdXNlZCB0byBhdXRoZW50aWNhdGUgb24gQVBJIGNhbGxzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gVGhlIEZsYXNrLUpXVC1FeHRlbmRlZCBhY2Nlc3MgdG9rZW5cbiAgICAgKi9cbiAgICBzZXRUb2tlbih0b2tlbikge1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgICAqXG4gICAgICogT25seSBlcnJvcnMgYXJlIHJlcG9ydGVkLiBTdWNjZXNzIGlzIHNpbGVudC4gR2FtZSBjaGFuZ2VzIHJlc3VsdGluZ1xuICAgICAqIGZyb20gcmVxdWVzdHMgYXJlIGhhbmRsZWQgdmlhIFNlcnZlciBTZW50IEV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmRwb2ludCAtIFRoZSBlbmRwb2ludCBvbiB0aGUgc2VydmVyIHRvIHNlbmQgcmVxdWVzdCB0b1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gVGhlIHBheWxvYWQgdG8gc2VuZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWV0aG9kPVwiUE9TVF0gLSBUaGUgSFRUUCBtZXRob2QgdG8gdXNlXG4gICAgICovXG4gICAgc2VuZFJlcXVlc3QoZW5kcG9pbnQsIGRhdGEsIG1ldGhvZCA9IFwiUE9TVFwiKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4obWV0aG9kLCBlbmRwb2ludCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3AgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIC8vIEludmFsaWQgcmVxdWVzdCBlcnJvclxuICAgICAgICAgICAgICAgIGlmIChyZXNwLnN1Y2Nlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihyZXNwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgIC8vIEZhaWxlZCByZXF1ZXN0IGVycm9yXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgdGhpcy50b2tlbik7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGFuIGFjdGlvbiByZXF1ZXN0XG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHRoZSBtb3N0IGhlYXZpbHktdXNlZCByZXF1ZXN0IHR5cGUgaW4gdGhlIGdhbWUuIEFsbCBpbi1nYW1lXG4gICAgICogYWN0aW9ucyAoYmV0LCBjaGVjaywgZm9sZCkgaGFwcGVuIGhlcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIFRoZSBwYXlsb2FkIHRvIHNlbmRcbiAgICAgKi9cbiAgICBhY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiYWN0aW9uXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgY2hlY2soKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkNIRUNLXCIpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBiZXQoYW10KSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJFVFwiLCBhbXQpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBmb2xkKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBiYigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkxJTkRcIiwgNTApO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBzYigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkxJTkRcIiwgMjUpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBqb2luKHNlYXROdW0sIGJ1eUluKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XCJwb3NpdGlvblwiOiBzZWF0TnVtLCBcImFtb3VudFwiOiBidXlJbn07XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJqb2luXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgbGVhdmUoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImxlYXZlXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhIGJlYWNvbiB0byB0aGUgc2VydmVyIG9uIGRpc2Nvbm5lY3RcbiAgICAgKlxuICAgICAqIFRoaXMgYWxsb3dzIGZvciBzZXJ2ZXIgdG8ga25vdyB3aGVuIGEgY2xpZW50IGRpc2Nvbm5lY3RzIHNvXG4gICAgICogaXQgY2FuIGNsZWFuIHVwIGFzIG5lY2Vzc2FyeS4gTm8gZ3VhcmFudGVlIHRoYXQgdGhpcyBtZXNzYWdlXG4gICAgICogd2lsbCBnbyB0aHJvdWdoLCBzbyBtdXN0IGhhdmUgcmVkdW5kYW50IG1lYXN1cmVzIGluIHBsYWNlLlxuICAgICAqL1xuICAgIGRpc2Nvbm5lY3RCZWFjb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgY29uc3QgdXJsID0gXCIvZGlzY29ubmVjdC9cIjtcbiAgICAgICAgbmF2aWdhdG9yLnNlbmRCZWFjb24odXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBidWlsZFBheWxvYWQoYWN0aW9uVHlwZSwgYmV0QW10ID0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJwbGF5ZXJJZFwiOiB0aGlzLnBsYXllcklkLFxuICAgICAgICAgICAgXCJhY3Rpb25UeXBlXCI6IGFjdGlvblR5cGUsXG4gICAgICAgICAgICBcImJldEFtdFwiOiBiZXRBbXRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJ1aWxkVXJsKGVuZHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVVcmwgKyBlbmRwb2ludCArIFwiL1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlcjsiLCIvKipcbiAqIEBzdW1tYXJ5IFNpbXBsZSBQaGFzZXIuVGV4dCBleHRlbnN0aW9uIHRvIHN1cHBvcnQgYXV0b21hdGljIHJlc2l6aW5nXG4gKlxuICogSWYgdGV4dCBib3VuZHMgYXJlIHNldCBvbiBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzcywgdGhlbiBlYWNoIHRpbWUgdGhlIHRleHRcbiAqIG9yIHN0eWxlIGlzIGNoYW5nZWQsIHRoZSB0ZXh0IHdpbGwgYXV0b21hdGljYWxseSBzY2FsZSBpdHNlbGYgZG93biB0byBmaXRcbiAqIHdpdGhpbiB0aG9zZSBib3VuZHMgaG9yaXpvbnRhbGx5LiBWZXJ0aWNhbCBib3VuZHMgYXJlIGlnbm9yZWQuXG4gKlxuICogUG9zc2libGUgdXBncmFkZXM6XG4gKiAgIC0gU2V0IG1pbmltdW0gc2NhbGVcbiAqICAgLSBJZiB0ZXh0IHN0aWxsIG92ZXJmbG93cyBtaW4gc2NhbGUsIHRoZW4gdHJ1bmNhdGVcbiAqL1xuY2xhc3MgTGFiZWwgZXh0ZW5kcyBQaGFzZXIuVGV4dCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwgdGV4dCwgc3R5bGUpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwgdGV4dCwgc3R5bGUpO1xuICAgICAgICB0aGlzLmFuY2hvci5zZXRUbygwLCAwLjUpOyAgLy8gQ2VudGVyIHZlcnRpY2FsbHkgdG8gYXZvaWQganVtcHMgb24gcmVzaXplXG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuXG4gICAgc2V0VGV4dCh0ZXh0LCBpbW1lZGlhdGUpIHtcbiAgICAgICAgc3VwZXIuc2V0VGV4dCh0ZXh0LCBpbW1lZGlhdGUpO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIHNldFN0eWxlKHN0eWxlLCB1cGRhdGUpIHtcbiAgICAgICAgc3VwZXIuc2V0U3R5bGUoc3R5bGUsIHVwZGF0ZSk7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgUmVzaXplIHRoZSB0ZXh0IGhvcml6b250YWxseVxuICAgICAqXG4gICAgICogSWYgdGV4dCBkb2VzIG5vdCBmaXQgaG9yaXpvbnRhbGx5IGF0IGZ1bGwgc2NhbGUsIHRoZW4gc2NhbGUgZG93blxuICAgICAqIHVudGlsIGl0IGZpdHMuIFZlcnRpY2FsIG92ZXJmbG93IGlzIGlnbm9yZWQuXG4gICAgICovXG4gICAgcmVzaXplKCkge1xuICAgICAgICBpZiAoIXRoaXMudGV4dEJvdW5kcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NhbGUuc2V0VG8oMSk7XG4gICAgICAgIGlmICh0aGlzLndpZHRoID4gdGhpcy50ZXh0Qm91bmRzLndpZHRoKSB7XG4gICAgICAgICAgICB0aGlzLnNjYWxlLnNldFRvKHRoaXMudGV4dEJvdW5kcy53aWR0aCAvIHRoaXMud2lkdGgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMYWJlbDsiLCJpbXBvcnQgTGFiZWwgZnJvbSBcIi4vTGFiZWxcIjtcbmltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5cbmNsYXNzIE5hbWVwbGF0ZSBleHRlbmRzIFBoYXNlci5JbWFnZSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwga2V5LCBjb25maWcpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwga2V5KTtcbiAgICAgICAgZ2FtZS53b3JsZC5hZGQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnIHx8IHRoaXMuZ2FtZS5jb25maWcubmFtZXBsYXRlO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcbiAgICAgICAgICAgIG5hbWVwbGF0ZTogbnVsbCxcbiAgICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgICBiYWxhbmNlOiBudWxsLFxuICAgICAgICAgICAgZmxhc2g6IG51bGxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBzZXQgbmFtZShuYW1lKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnNldFRleHQobmFtZSk7XG4gICAgfVxuXG4gICAgc2V0IGJhbGFuY2UoYmFsYW5jZSkge1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS5zZXRUZXh0KFV0aWwucGFyc2VDdXJyZW5jeShiYWxhbmNlKSk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lID0gbmV3IExhYmVsKHRoaXMuZ2FtZSwgdGhpcy5jb25maWcubmFtZS54LCB0aGlzLmNvbmZpZy5uYW1lLnksIFwiXCIsIHRoaXMuY29uZmlnLm5hbWUuc3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS5zZXRUZXh0Qm91bmRzKDAsIDAsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggLSAyMCwgMCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5kaXNwbGF5Lm5hbWUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlID0gbmV3IExhYmVsKHRoaXMuZ2FtZSwgdGhpcy5jb25maWcuYmFsYW5jZS54LCB0aGlzLmNvbmZpZy5iYWxhbmNlLnksIFwiXCIsIHRoaXMuY29uZmlnLmJhbGFuY2Uuc3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS5zZXRUZXh0Qm91bmRzKDAsIDAsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggLSAyMCwgMCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmJhbGFuY2UpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaCA9IG5ldyBMYWJlbCh0aGlzLmdhbWUsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuY2VudGVyWCwgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5jZW50ZXJZLCBcIlwiLCB0aGlzLmNvbmZpZy5mbGFzaC5zdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC5zZXRUZXh0Qm91bmRzKDAsIDAsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggLSAyMCwgMCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmRpc3BsYXkuZmxhc2gpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEZsYXNoIHRleHQgZm9yIGR1cmF0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBkaXNwbGF5c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb249MjAwMF0gLSBNaWxsaXNlY29uZHMgdG8gZGlzcGxheSB0ZXh0XG4gICAgICovXG4gICAgZmxhc2godGV4dCwgZHVyYXRpb24gPSAyMDAwKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2gudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC5zZXRUZXh0KHRleHQpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoZHVyYXRpb24sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2gudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5hbWVwbGF0ZTsiLCJpbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi9CdXR0b25cIjtcbmltcG9ydCBTbGlkZXIgZnJvbSBcIi4vU2xpZGVyXCI7XG5pbXBvcnQge0FjdGlvbn0gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmNsYXNzIFBhbmVsIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXkpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuYmV0cyA9IFswXTtcbiAgICAgICAgdGhpcy5wcmltYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMucHJpbWFyeUFjdGlvbiA9IEFjdGlvbi5CRVQ7XG4gICAgICAgIHRoaXMucHJpbWFyeUJldCA9IDA7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QWN0aW9uID0gQWN0aW9uLkNIRUNLO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUJldCA9IDA7XG4gICAgICAgIHRoaXMudGVydGlhcnlDbGlja2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy50ZXJ0aWFyeUFjdGlvbiA9IEFjdGlvbi5GT0xEO1xuICAgICAgICB0aGlzLnNsaWRlciA9IG5ldyBTbGlkZXIodGhpcy5nYW1lLCBcInBhbmVsXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7fTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFsd2F5c1Zpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeSA9IHRoaXMubWFrZUJ1dHRvbigwLCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnByaW1hcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMucHJpbWFyeUFjdGlvbiwgdGhpcy5wcmltYXJ5QmV0KSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zZWNvbmRhcnkgPSB0aGlzLm1ha2VCdXR0b24oMTM1LCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnNlY29uZGFyeUNsaWNrZWQuZGlzcGF0Y2godGhpcy5zZWNvbmRhcnlBY3Rpb24sIHRoaXMuc2Vjb25kYXJ5QmV0KSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXJ0aWFyeSA9IHRoaXMubWFrZUJ1dHRvbigyNzAsIDAsIFwibWVkXCIsICgpID0+IHRoaXMudGVydGlhcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMudGVydGlhcnlBY3Rpb24sIDApKTtcblxuICAgICAgICB0aGlzLnNsaWRlci5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgICAgICB0aGlzLnNsaWRlci5pbmRleENoYW5nZWQuYWRkKChpbmRleCkgPT4gdGhpcy5zZXRQcmltYXJ5QmV0KHRoaXMuYmV0c1tpbmRleF0pLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2xpZGVyV2hlZWwuYWRkKHRoaXMuc2luZ2xlU3RlcEJldCwgdGhpcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zbGlkZXIgPSB0aGlzLnNsaWRlci5iYXI7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zbGlkZXIueSA9IDYwO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5wcmltYXJ5LmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4gdGhpcy5zbGlkZXIuZW5hYmxlU2xpZGVyV2hlZWwodHJ1ZSkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeS5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4gdGhpcy5zbGlkZXIuZW5hYmxlU2xpZGVyV2hlZWwoZmFsc2UpKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnByaW1hcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnNlY29uZGFyeSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkudGVydGlhcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnNsaWRlcik7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgbWFrZUJ1dHRvbih4LCB5LCBzaXplLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYnV0dG9uID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIHgsIHksIHRoaXMua2V5KTtcbiAgICAgICAgYnV0dG9uLm9uSW5wdXRVcC5hZGQoY2FsbGJhY2spO1xuICAgICAgICBidXR0b24uc2V0RnJhbWVzKFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfb3V0XCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9kb3duXCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl91cFwiXG4gICAgICAgICk7XG4gICAgICAgIGJ1dHRvbi5zZXRUZXh0U3R5bGUodGhpcy5nYW1lLmNvbmZpZy5wYW5lbC50ZXh0U3R5bGUpO1xuICAgICAgICByZXR1cm4gYnV0dG9uO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIC8vIFBhbmVsIHVwZGF0ZXMgcmVxdWlyZSBwbGF5ZXJzJyBjdXJyZW50IGJldHMsIHNvIGlmXG4gICAgICAgIC8vIHRoZXJlIGlzIG5vIG5leHQgcGxheWVyIHdlIHNob3VsZG4ndCB1cGRhdGUgdGhlIGRpc3BsYXlcbiAgICAgICAgaWYgKCF0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYWN0aW9uVGV4dCA9IHRoaXMuZ2FtZS5yb3VuZEJldCA9PT0gMCA/IFwiQkVUIFwiIDogXCJSQUlTRSBUT1xcblwiO1xuICAgICAgICBsZXQgcHJpbWFyeVRleHQgPSBhY3Rpb25UZXh0ICsgVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMucHJpbWFyeUJldCArIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQpO1xuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeS5zZXRUZXh0KHByaW1hcnlUZXh0KTtcblxuICAgICAgICBsZXQgc2Vjb25kYXJ5VGV4dCA9IFwiQ0hFQ0tcIjtcbiAgICAgICAgaWYgKHRoaXMuc2Vjb25kYXJ5QWN0aW9uICE9PSBBY3Rpb24uQ0hFQ0spIHtcbiAgICAgICAgICAgIHNlY29uZGFyeVRleHQgPSBcIkNBTEwgXCIgKyBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5zZWNvbmRhcnlCZXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheS5zZWNvbmRhcnkuc2V0VGV4dChzZWNvbmRhcnlUZXh0KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkudGVydGlhcnkuc2V0VGV4dChcIkZPTERcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLnZpc2libGUgPSB0aGlzLnZpc2libGU7XG4gICAgfVxuXG4gICAgc2V0QmV0cyhiZXRzKSB7XG4gICAgICAgIGlmIChiZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIGJldHMuIFBhbmVsIG11c3QgYWx3YXlzIGhhdmUgYXQgbGVhc3Qgb25lIHZhbGlkIGJldC5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJldHMgPSBiZXRzO1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSBiZXRzWzBdO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRMZW5ndGgoYmV0cy5sZW5ndGgpO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRJbmRleCgwKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0RW5hYmxlZChiZXRzLmxlbmd0aCA+IDEpO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRQcmltYXJ5QmV0KGJldCkge1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSBiZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldFNlY29uZGFyeUJldChiZXQpIHtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlCZXQgPSBiZXQ7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QWN0aW9uID0gYmV0ID09PSAwID8gQWN0aW9uLkNIRUNLIDogQWN0aW9uLkJFVDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSGlkZSBvciBzaG93IHRoZSBlbnRpcmUgcGFuZWxcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGVcbiAgICAgKi9cbiAgICBzZXRWaXNpYmxlKHZpc2libGUpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZSB8fCB0aGlzLmFsd2F5c1Zpc2libGU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEluY3JlbWVudCBvciBkZWNyZW1lbnQgdGhpcy5wcmltYXJ5QmV0XG4gICAgICogQHBhcmFtIHtQaGFzZXIuTW91c2Uud2hlZWxEZWx0YX0gbW9kaWZpZXIgLSArMSBvciAtMVxuICAgICAqL1xuICAgIHNpbmdsZVN0ZXBCZXQobW9kaWZpZXIpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5zbGlkZXIuaW5kZXggKyBtb2RpZmllcjtcbiAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPD0gdGhpcy5zbGlkZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNsaWRlci5zZXRJbmRleChpbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsOyIsImltcG9ydCB7QWN0aW9uVGV4dH0gZnJvbSBcIi4uL2NsYXNzZXMvQWN0aW9uXCI7XG5pbXBvcnQgQ2FyZE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NhcmRNYW5hZ2VyXCI7XG5pbXBvcnQgQ2hpcE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NoaXBNYW5hZ2VyXCI7XG5pbXBvcnQgTmFtZXBsYXRlIGZyb20gXCIuLi9jbGFzc2VzL05hbWVwbGF0ZVwiO1xuXG5jbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGNoaXBDb25maWcpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5jaGlwQ29uZmlnID0gY2hpcENvbmZpZztcblxuICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBudWxsO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBudWxsO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBudWxsO1xuICAgICAgICB0aGlzLnNlYXQgPSBudWxsO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gMDsgIC8vIFN1bSBiZXRzIGJ5IHBsYXllciBpbiBjdXJyZW50IGJldHRpbmcgcm91bmRcblxuICAgICAgICB0aGlzLmlzRGVhbGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNOZXh0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcbiAgICAgICAgICAgIG5hbWVwbGF0ZTogbnVsbCxcbiAgICAgICAgICAgIGNhcmRzOiBudWxsLFxuICAgICAgICAgICAgY2FyZHNNYXNrOiBudWxsLFxuICAgICAgICAgICAgZGVhbGVyQnV0dG9uOiBudWxsLFxuICAgICAgICAgICAgY2hpcHM6IG51bGxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmNhcmRzID0gbmV3IENhcmRNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuY2hpcHMgPSBuZXcgQ2hpcE1hbmFnZXIodGhpcy5nYW1lLCBcImNoaXBzXCIsIHRoaXMuZ2FtZS5jb25maWcuZGVub21zKTtcbiAgICAgICAgdGhpcy5uYW1lcGxhdGUgPSBuZXcgTmFtZXBsYXRlKHRoaXMuZ2FtZSwgMCwgMCwgXCJuYW1lcGxhdGVcIik7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkYXRhLmlkO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IGRhdGEudXNlcklkO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuc2l0dGluZ091dCA9IGRhdGEuc2l0dGluZ091dDtcbiAgICAgICAgdGhpcy5zZWF0ID0gZGF0YS5zZWF0O1xuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZGF0YS5pc1VzZXI7XG5cbiAgICAgICAgdGhpcy5jYXJkcy5pbml0aWFsaXplKDIpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlID0gdGhpcy5uYW1lcGxhdGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMgPSB0aGlzLmNhcmRzLmRpc3BsYXlHcm91cDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLnggPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmNlbnRlclg7XG4gICAgICAgIHRoaXMuaGlkZUNhcmRzKCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzTWFzayA9IHRoaXMuY3JlYXRlQ2FyZHNNYXNrKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkc01hc2suYm90dG9tID0gdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS50b3A7XG4gICAgICAgIHRoaXMuY2FyZHMubWFzayA9IHRoaXMuZGlzcGxheS5jYXJkc01hc2s7XG5cbiAgICAgICAgLy8gTk9URTogVGhpcyBsaW5lIGlzIHJlcXVpcmVkIGZvciB0aGlzIG1hc2sgdG8gd29yayB1bmRlciBXZWJHTFxuICAgICAgICAvLyBTb21lIGNoYW5nZXMgdG8gbWFza3MgaW4gV2ViR0wgbW9kZSB3aWxsIHJlbmRlciB0aGUgbWFza1xuICAgICAgICAvLyBjb21wbGV0ZWx5IGluZWZmZWN0aXZlLiBUaGUgYnVnIGlzIG5vdCB3ZWxsIHVuZGVyc3Rvb2QuIEl0IG1heVxuICAgICAgICAvLyBoYXZlIGJlZW4gZml4ZWQgaW4gbGF0ZXIgdmVyc2lvbnMgb2YgUGhhc2VyLlxuICAgICAgICAvLyBNb3JlIGRldGFpbCBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vcGhvdG9uc3Rvcm0vcGhhc2VyLWNlL2lzc3Vlcy8zMzRcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzTWFzay5kaXJ0eSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbiA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwiZGVhbGVyQnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmxlZnQgPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmxlZnQgKyA1O1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmJvdHRvbSA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuYm90dG9tIC0gNTtcblxuICAgICAgICB0aGlzLmNoaXBzLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jaGlwcyA9IHRoaXMuY2hpcHMuZGlzcGxheUdyb3VwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMueCA9IHRoaXMuY2hpcENvbmZpZ1t0aGlzLnNlYXRdLng7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jaGlwcy55ID0gdGhpcy5jaGlwQ29uZmlnW3RoaXMuc2VhdF0ueTtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5jaGlwcy5kaXNwbGF5R3JvdXApO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmNhcmRzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5jYXJkc01hc2spO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLm5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuYmFsYW5jZSA9IHRoaXMuYmFsYW5jZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5mcmFtZU5hbWUgPSB0aGlzLmlzTmV4dCA/IFwicmVkXCIgOiBcImJhc2VcIjtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbi52aXNpYmxlID0gdGhpcy5pc0RlYWxlciA9PT0gdHJ1ZTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZGF0YSwgdXBkYXRlQ2hpcHMgPSB0cnVlKSB7XG4gICAgICAgIC8vIFRPRE8gLSBGbGVzaCBvdXQgdGhlIHJlc3Qgb2YgdGhlIGRhdGEgLS0gZG8gSSBsaWtlIHRoaXMgbWV0aG9kP1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2UgPT09IHVuZGVmaW5lZCA/IHRoaXMuYmFsYW5jZSA6IGRhdGEuYmFsYW5jZTtcbiAgICAgICAgdGhpcy5pc0RlYWxlciA9IGRhdGEuaXNEZWFsZXIgPT09IHVuZGVmaW5lZCA/IHRoaXMuaXNEZWFsZXIgOiBkYXRhLmlzRGVhbGVyO1xuICAgICAgICB0aGlzLmlzTmV4dCA9IGRhdGEuaXNOZXh0ID09PSB1bmRlZmluZWQgPyB0aGlzLmlzTmV4dCA6IGRhdGEuaXNOZXh0O1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gZGF0YS5yb3VuZEJldCA9PT0gdW5kZWZpbmVkID8gdGhpcy5yb3VuZEJldCA6IGRhdGEucm91bmRCZXQ7XG4gICAgICAgIGlmICh1cGRhdGVDaGlwcykge1xuICAgICAgICAgICAgdGhpcy5jaGlwcy5zZXRWYWx1ZSh0aGlzLnJvdW5kQmV0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hpcHMudmFsdWUgPSB0aGlzLnJvdW5kQmV0O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIGFjdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKHtcbiAgICAgICAgICAgIGJhbGFuY2U6IGRhdGEucGxheWVyQmFsYW5jZSxcbiAgICAgICAgICAgIHJvdW5kQmV0OiBkYXRhLnBsYXllclJvdW5kQmV0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBhY3Rpb25UZXh0ID0gQWN0aW9uVGV4dFtkYXRhLmFjdGlvblR5cGVdO1xuXG4gICAgfVxuXG4gICAgY3JlYXRlQ2FyZHNNYXNrKCkge1xuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5jYXJkcy5jYXJkc1swXS5oZWlnaHQ7XG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubmFtZXBsYXRlLndpZHRoO1xuICAgICAgICBsZXQgbWFzayA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoMCwgMCk7XG4gICAgICAgIG1hc2suYmVnaW5GaWxsKDB4ZmZmZmZmKTtcbiAgICAgICAgbWFzay5kcmF3UmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmV0dXJuIG1hc2s7XG4gICAgfVxuXG4gICAgYW5pbWF0ZURlYWwoKSB7XG4gICAgICAgIHRoaXMuaGlkZUNhcmRzKCk7XG5cbiAgICAgICAgY29uc3Qgc2hvd1R3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmRpc3BsYXkuY2FyZHMpLnRvKHt5OiAtdGhpcy5uYW1lcGxhdGUuaGVpZ2h0IC8gMn0sIDUwMCwgUGhhc2VyLkVhc2luZy5RdWFydGljLk91dCwgdHJ1ZSk7XG5cbiAgICAgICAgc2hvd1R3ZWVuLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhcmRQb3NpdGlvbnMgPSB0aGlzLmNhbGNDYXJkUG9zaXRpb25zKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuY2FyZHMuY2FyZHNbaV0pLnRvKHt4OiBjYXJkUG9zaXRpb25zW2ldfSwgNTAwLCBQaGFzZXIuRWFzaW5nLlF1YXJ0aWMuT3V0LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgYW5pbWF0ZUZvbGQoKSB7XG4gICAgICAgIHRoaXMuc2hvd0NhcmRzKCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuY2FyZHMuY2FyZHNbaV0pLnRvKHt4OiAwfSwgNTAwLCBQaGFzZXIuRWFzaW5nLlF1YXJ0aWMuT3V0LCB0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoNTAwLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuZGlzcGxheS5jYXJkcykudG8oe3RvcDogdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS50b3B9LCA1MDAsIFBoYXNlci5FYXNpbmcuUXVhcnRpYy5PdXQsIHRydWUpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICBoaWRlQ2FyZHMoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkcy5jYXJkc1tpXS54ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMudG9wID0gdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS50b3A7XG4gICAgfVxuXG4gICAgc2hvd0NhcmRzKCkge1xuICAgICAgICBjb25zdCBjYXJkUG9zaXRpb25zID0gdGhpcy5jYWxjQ2FyZFBvc2l0aW9ucygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHMuY2FyZHNbaV0ueCA9IGNhcmRQb3NpdGlvbnNbaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLnkgPSAtdGhpcy5uYW1lcGxhdGUuaGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBDYWxjdWxhdGUgdGhlIGZpbmFsIHBvc2l0aW9ucyBvZiBhbGwgY2FyZHMgaW4gaGFuZFxuICAgICAqXG4gICAgICogTk9URSBUTyBNRTogRG9uJ3QgZnVjayB3aXRoIHRoaXMuIEl0IHRvb2sgYSBsb25nIHRpbWUgdG8gZ2V0IHJpZ2h0LlxuICAgICAqXG4gICAgICogVGhlIGNhcmRzIG5lZWQgdG8gYmUgcG9zaXRpb25lZCBjb3JyZWN0bHkgYm90aCBpbiByZWxhdGlvbiB0b1xuICAgICAqIHRoZW1zZWx2ZXMgKHN0YWdnZXJlZCBldmVubHkpIGFuZCBhbHNvIGluIHJlbGF0aW9uIHRvIHRoZSBuYW1lcGxhdGUuXG4gICAgICogRG9pbmcgdGhlIGxhdHRlciBieSBjZW50ZXJpbmcgdGhlIGNhcmRzJyBkaXNwbGF5IGdyb3VwIG9uIHRoZSBuYW1lcGxhdGVcbiAgICAgKiB3b3VsZCBoYXZlIGJlZW4gbXVjaCBlYXNpZXIsIGJ1dCB0aGF0IHdheSBtYWRlIGFuaW1hdGluZyB0aGUgY2FyZFxuICAgICAqIHNwcmVhZCBuZWFybHkgaW1wb3NzaWJsZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBjYWxjQ2FyZFBvc2l0aW9ucygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBvc2l0aW9ucyA9IFtdO1xuICAgICAgICBjb25zdCBjYXJkV2lkdGggPSB0aGlzLmNhcmRzLmNhcmRzWzBdLndpZHRoO1xuICAgICAgICBjb25zdCBjYXJkQXJlYSA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggKiAwLjk7XG4gICAgICAgIGNvbnN0IHRvdGFsV2lkdGggPSBjYXJkV2lkdGggKiB0aGlzLmNhcmRzLmxlbmd0aDtcbiAgICAgICAgY29uc3QgdG90YWxPdmVyZmxvdyA9IHRvdGFsV2lkdGggLSBjYXJkQXJlYTtcbiAgICAgICAgY29uc3QgY2FyZE9mZnNldCA9IHRvdGFsT3ZlcmZsb3cgLyAodGhpcy5jYXJkcy5sZW5ndGggLSAxKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBTcGFjZSBjYXJkcyBldmVubHlcbiAgICAgICAgICAgIGxldCBwb3MgPSBjYXJkV2lkdGggKiBpIC0gY2FyZE9mZnNldCAqIGk7XG5cbiAgICAgICAgICAgIC8vIENlbnRlciBjYXJkcyBvbiBuYW1lcGxhdGVcbiAgICAgICAgICAgIHBvcyAtPSBjYXJkQXJlYSAvIDIgLSBjYXJkV2lkdGggLyAyO1xuXG4gICAgICAgICAgICBwb3NpdGlvbnMucHVzaChwb3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3NpdGlvbnM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJpbXBvcnQgQ2hpcE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NoaXBNYW5hZ2VyXCI7XG5cbmNsYXNzIFBvdCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmFtb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICAgICAgdGhpcy5jaGlwcyA9IG5ldyBDaGlwTWFuYWdlcih0aGlzLmdhbWUsIFwiY2hpcHNcIiwgdGhpcy5nYW1lLmNvbmZpZy5kZW5vbXMpO1xuICAgICAgICB0aGlzLmNoaXBzLnN0YWNrQ2hpcHMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jaGlwcy5jb2xvclVwID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuY2hpcHMuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmNoaXBzLnNldFZhbHVlKHRoaXMuYW1vdW50KTtcbiAgICB9XG5cbiAgICBzZXRBbW91bnQoYW1vdW50KSB7XG4gICAgICAgIHRoaXMuYW1vdW50ID0gYW1vdW50O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBnYXRoZXJDaGlwcyhwbGF5ZXJzKSB7XG4gICAgICAgIGxldCBkZWxheSA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBsYXllciA9IHBsYXllcnNbaV07XG4gICAgICAgICAgICBpZiAocGxheWVyLmNoaXBzLmNoaXBzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoZGVsYXksICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbW91bnQgKz0gcGxheWVyLmNoaXBzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoaXBzLnRha2VDaGlwcyhwbGF5ZXIuY2hpcHMuY2hpcHMpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgICAgIGRlbGF5ICs9IDEwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG90O1xuIiwiLyoqXG4gKiBBIHNsaWRlciBVSSBlbGVtZW50XG4gKlxuICogUmVwcmVzZW50ZWQgYnkgYSBiYXIgc3ByaXRlIGFuZCBhIG1hcmtlciBzcHJpdGUuIERlc3BpdGUgaG93IGl0IG1heVxuICogbG9vaywgYWxsIGlucHV0IG9jY3VycyBvbiB0aGUgYmFyIGFuZCB1cGRhdGVzIGFyZSBtYWRlIHRvIHRoZVxuICogbWFya2VyJ3MgcG9zaXRpb24gYmFzZWQgb24gdGhvc2UgaW5wdXRzLlxuICovXG5jbGFzcyBTbGlkZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5iYXIgPSBudWxsOyAgLy8gVGhlIHNsaWRlciBiYXIgc3ByaXRlXG4gICAgICAgIHRoaXMubWFya2VyID0gbnVsbDsgIC8vIFRoZSBkcmFnZ2FibGUgbWFya2VyIHNwcml0ZVxuICAgICAgICB0aGlzLmluZGV4ID0gMDsgIC8vIEN1cnJlbnQgaW5kZXggb2YgbWFya2VyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMTsgIC8vIFRvdGFsIG51bWJlciBvZiBpbmRpY2VzXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2xpZGVyV2hlZWwgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmJhciA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgdGhpcy5rZXksIFwic2xpZGVyX2JhclwiKTtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXREb3duLmFkZCh0aGlzLnN0YXJ0RHJhZywgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0VXAuYWRkKHRoaXMuc3RvcERyYWcsIHRoaXMpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHRoaXMuZW5hYmxlU2xpZGVyV2hlZWwodHJ1ZSkpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4gdGhpcy5lbmFibGVTbGlkZXJXaGVlbChmYWxzZSkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyID0gdGhpcy5iYXI7XG5cbiAgICAgICAgdGhpcy5tYXJrZXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCB0aGlzLmtleSwgXCJzbGlkZXJfbWFya2VyXCIpO1xuICAgICAgICB0aGlzLm1hcmtlci5hbmNob3Iuc2V0VG8oMC41LCAwKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuYm90dG9tID0gdGhpcy5iYXIuYm90dG9tO1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyID0gdGhpcy5tYXJrZXI7XG4gICAgICAgIHRoaXMuYmFyLmFkZENoaWxkKHRoaXMubWFya2VyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgc2xpZGVyIGRyYWdnaW5nIGFuZCBpbml0aWF0ZSBmaXJzdCBkcmFnIGV2ZW50XG4gICAgICogQHBhcmFtIHtQaGFzZXIuU3ByaXRlfSBiYXIgLSBUaGUgYmFyIHNwcml0ZSB0aGF0IHdhcyBjbGlja2VkXG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBwb2ludGVyIHdoaWNoIGluaXRpYXRlZCB0aGUgY2xpY2tcbiAgICAgKi9cbiAgICBzdGFydERyYWcoYmFyLCBwb2ludGVyKSB7XG4gICAgICAgIC8vIEluaXRpYWwgY2FsbCB0byB1cGRhdGVEcmFnIGFsbG93cyBjaGFuZ2luZyBiZXQgd2l0aCBjbGljayBvbiBiYXJcbiAgICAgICAgdGhpcy51cGRhdGVEcmFnKHBvaW50ZXIsIHBvaW50ZXIueCwgcG9pbnRlci55KTtcbiAgICAgICAgdGhpcy5nYW1lLmlucHV0LmFkZE1vdmVDYWxsYmFjayh0aGlzLnVwZGF0ZURyYWcsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IERpc2FibGUgc2xpZGVyIGRyYWdnaW5nXG4gICAgICovXG4gICAgc3RvcERyYWcoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5kZWxldGVNb3ZlQ2FsbGJhY2sodGhpcy51cGRhdGVEcmFnLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBDYWxjdWxhdGUgc2xpZGVyIGluZGV4IGJhc2VkIG9uIGRyYWcgaW5wdXRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Qb2ludGVyfSBwb2ludGVyIC0gVGhlIHNsaWRpbmcgcG9pbnRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSBvZiBwb2ludGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIG9mIHBvaW50ZXJcbiAgICAgKi9cbiAgICB1cGRhdGVEcmFnKHBvaW50ZXIsIHgsIHkpIHtcbiAgICAgICAgbGV0IGxvY2FsWCA9IHggLSB0aGlzLmJhci53b3JsZC54OyAgLy8gQ2xpY2sgcG9zIGluIHJlbGF0aW9uIHRvIGJhclxuXG4gICAgICAgIC8vIFByZXZlbnQgZHJhZ2dpbmcgcGFzdCBiYXIgYm91bmRzXG4gICAgICAgIGlmIChsb2NhbFggPCAwKSB7XG4gICAgICAgICAgICBsb2NhbFggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsWCA+IHRoaXMuYmFyLndpZHRoKSB7XG4gICAgICAgICAgICBsb2NhbFggPSB0aGlzLmJhci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN1YnRyYWN0IDEgZnJvbSBsZW5ndGggYmVjYXVzZSBsZW5ndGggaXMgMS1pbmRleGVkLCBpbmRpY2VzIGFyZSAwLWluZGV4ZWRcbiAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLnJvdW5kKGxvY2FsWCAvIHRoaXMuYmFyLndpZHRoICogKHRoaXMubGVuZ3RoIC0gMSkpO1xuICAgICAgICB0aGlzLnNldEluZGV4KGluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIGluZGV4IG9mIHRoZSBzbGlkZXIgYW5kIHJlcG9ydCB0aGUgbmV3IHZhbHVlXG4gICAgICpcbiAgICAgKiBPcHRpb25hbGx5IHVwZGF0ZSB0aGUgdmlzdWFsIHBvc2l0aW9uIG9mIHRoZSBtYXJrZXIgb24gdGhlIHNsaWRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIE5ldyBpbmRleCB0byBzZXQgb24gc2xpZGVyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXBkYXRlUG9zPXRydWVdIC0gVXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBtYXJrZXI/XG4gICAgICovXG4gICAgc2V0SW5kZXgoaW5kZXgsIHVwZGF0ZVBvcyA9IHRydWUpIHtcbiAgICAgICAgaWYgKGluZGV4ICE9PSB0aGlzLmluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZC5kaXNwYXRjaChpbmRleCk7XG5cbiAgICAgICAgICAgIGlmICh1cGRhdGVQb3MpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiBvbmx5IG9uZSBiZXQgYXZhaWxhYmxlLCBpdCdzIGEgbWF4IGJldFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgMSBmcm9tIGxlbmd0aCBiZWNhdXNlIGxlbmd0aCBpcyAxLWluZGV4ZWQsIGluZGljZXMgYXJlIDAtaW5kZXhlZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGggLyAodGhpcy5sZW5ndGggLSAxKSAqIHRoaXMuaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVXBkYXRlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgKlxuICAgICAqIFRoZSBsZW5ndGggcHJvcGVydHkgZGVzY3JpYmVzIGhvdyBtYW55IGRpc2NyZXRlIGJldHMgdGhlIHNsaWRlciBiYXJcbiAgICAgKiBtdXN0IHJlcHJlc2VudC4gVGhlIHNsaWRlciBkb2VzIG5vdCBjYXJlIGFib3V0IHdoYXQgdGhlIHNwZWNpZmljIGJldFxuICAgICAqIGl0IHJlcHJlc2VudHMgaXMsIG9ubHkgdGhhdCBpdCBoYXMgc29tZSBudW1iZXIgb2YgaW5kaWNlcyBhbG9uZyBpdHNcbiAgICAgKiBsZW5ndGggYW5kIHRoYXQgaXQgbXVzdCByZXBvcnQgaXRzIGluZGV4IHRvIGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbmV3IGxlbmd0aCB0byBzZXRcbiAgICAgKi9cbiAgICBzZXRMZW5ndGgobGVuZ3RoKSB7XG4gICAgICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCBzZXQgc2xpZGVyIGxlbmd0aCBsZXNzIHRoYW4gMVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChsZW5ndGggPiB0aGlzLmJhci53aWR0aCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogU2V0dGluZyBzbGlkZXIgc3RvcHMgZ3JlYXRlciB0aGFuIGxlbmd0aCBtYXkgcmVzdWx0IGluIHVuZXhwZWN0ZWQgYmVoYXZpb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIHNsaWRlclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIElzIHRoZSBzbGlkZXIgZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gZW5hYmxlZDtcblxuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyLnRpbnQgPSB0aW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIGRpc3BhdGNoIG9mIHNpZ25hbCBvbiB3aGVlbCBzY3JvbGxcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBJcyB0aGUgY2FsbGJhY2sgZW5hYmxlZCBvciBkaXNhYmxlZD9cbiAgICAgKi9cbiAgICBlbmFibGVTbGlkZXJXaGVlbChlbmFibGVkKSB7XG4gICAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQubW91c2UubW91c2VXaGVlbENhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyV2hlZWwuZGlzcGF0Y2godGhpcy5nYW1lLmlucHV0Lm1vdXNlLndoZWVsRGVsdGEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS5tb3VzZVdoZWVsQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbGlkZXI7IiwiLyoqXG4gKiBAc3VtbWFyeSBUcmFjayBhbmQgcXVldWUgdHdlZW5zIGdhbWUgd2lkZVxuICpcbiAqIEl0J3MgZWFzeSB0byBjaGFpbiB0d2VlbnMgd2hlbiB0aGV5J3JlIGNyZWF0ZWQgYXQgdGhlIHNhbWUgcG9pbnRcbiAqIGluIHRpbWUsIGJ1dCB3aGF0IGlmIHR3byB0d2VlbnMgYXJlIGNyZWF0ZWQgYXQgY29tcGxldGVseSBkaWZmZXJlbnRcbiAqIHBvaW50cz8gV2hhdCBpZiB0aG9zZSB0d2VlbnMgbmVlZCB0byBydW4gY29uc2VjdXRpdmVseSwgdGhlIHNlY29uZFxuICogd2FpdGluZyBmb3IgdGhlIGZpcnN0IHRvIGNvbXBsZXRlIGJlZm9yZSBzdGFydGluZz9cbiAqL1xuXG5jbGFzcyBUd2VlblF1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG5cbiAgICAgICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuICAgIH1cblxuICAgIGdldCBydW5uaW5nKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmN1cnJlbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgQWRkIGEgdHdlZW4gdG8gdGhlIHF1ZXVlXG4gICAgICogQHBhcmFtIHtQaGFzZXIuVHdlZW59IHR3ZWVuIC0gVGhlIHR3ZWVuIHRvIGFkZCB0byB0aGUgcXVldWVcbiAgICAgKi9cbiAgICBhZGQodHdlZW4pIHtcbiAgICAgICAgLy8gVHdlZW5zIGFkZGVkIHRvIHRoZSBxdWV1ZSBtYXkgaGF2ZSBvdGhlciBvbkNvbXBsZXRlIGNhbGxiYWNrcyxcbiAgICAgICAgLy8gYnV0IHRoZXkgbXVzdCBhdCBsZWFzdCBoYXZlIHRoaXMgb25lLCB3aGljaCB0cmlnZ2VycyB0aGVcbiAgICAgICAgLy8gbmV4dCB0d2VlbiBpbiB0aGUgcXVldWUgdG8gYmVnaW5cbiAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQodGhpcy5uZXh0LCB0aGlzKTtcblxuICAgICAgICAvLyBBZGQgdG8gdGhlIGZyb250LCByZW1vdmUgZnJvbSB0aGUgYmFja1xuICAgICAgICB0aGlzLnF1ZXVlLnVuc2hpZnQodHdlZW4pO1xuXG4gICAgICAgIC8vIEF1dG8gc3RhcnQgdGhlIGNoYWluIGlmIGl0J3Mgbm90IGFscmVhZHkgcnVubmluZ1xuICAgICAgICBpZiAoIXRoaXMucnVubmluZykge1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTdGFydCB0aGUgbmV4dCB0d2VlbiBpbiB0aGUgcXVldWVcbiAgICAgKi9cbiAgICBuZXh0KCkge1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnF1ZXVlLnBvcCgpO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQuc3RhcnQoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVHdlZW5RdWV1ZTsiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwicGFuZWxcIjoge1xuICAgIFwicGFkZGluZ1wiOiAxMCxcbiAgICBcInRleHRTdHlsZVwiOiB7XG4gICAgICBcImZvbnRcIjogXCJib2xkIDIycHQgQXJpYWxcIixcbiAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICBcImFsaWduXCI6IFwiY2VudGVyXCJcbiAgICB9LFxuICAgIFwicG9zXCI6IHtcbiAgICAgIFwieFwiOiAxNDgwLFxuICAgICAgXCJ5XCI6IDc5MFxuICAgIH1cbiAgfSxcbiAgXCJzZWF0c1wiOiB7XG4gICAgXCIxMFwiOiBbXG4gICAgICB7XCJ4XCI6IDg2MCwgXCJ5XCI6IDIwMH0sXG4gICAgICB7XCJ4XCI6IDExNzgsIFwieVwiOiAyMDB9LFxuICAgICAge1wieFwiOiAxNTIyLCBcInlcIjogMzQyfSxcbiAgICAgIHtcInhcIjogMTUyMiwgXCJ5XCI6IDYyNn0sXG4gICAgICB7XCJ4XCI6IDExNzgsIFwieVwiOiA4OTR9LFxuICAgICAge1wieFwiOiA4NjAsIFwieVwiOiA4OTR9LFxuICAgICAge1wieFwiOiA1NDIsIFwieVwiOiA4OTR9LFxuICAgICAge1wieFwiOiAxOTgsIFwieVwiOiA2MjZ9LFxuICAgICAge1wieFwiOiAxOTgsIFwieVwiOiAzNDJ9LFxuICAgICAge1wieFwiOiA1NDIsIFwieVwiOiAyMDB9XG4gICAgXSxcblxuICAgIC8vIFRPRE9cbiAgICBcIjhcIjogW10sXG4gICAgXCI5XCI6IFtdXG4gIH0sXG4gIFwiYnV5SW5Nb2RhbFwiOiB7XG4gICAgXCJ4XCI6IDgxMCxcbiAgICBcInlcIjogNDMwLFxuICAgIFwiaW5wdXRCb3hcIjoge1xuICAgICAgXCJ4XCI6IDE1LFxuICAgICAgXCJ5XCI6IDg2XG4gICAgfSxcbiAgICBcImlucHV0RmllbGRcIjoge1xuICAgICAgXCJ4XCI6IDMwLFxuICAgICAgXCJ5XCI6IC0yXG4gICAgfSxcbiAgICBcImNhbmNlbEJ1dHRvblwiOiB7XG4gICAgICBcInhcIjogMTUsXG4gICAgICBcInlcIjogMTQ1XG4gICAgfSxcbiAgICBcInN1Ym1pdEJ1dHRvblwiOiB7XG4gICAgICBcInhcIjogMTU1LFxuICAgICAgXCJ5XCI6IDE0NVxuICAgIH1cbiAgfSxcbiAgXCJkZW5vbXNcIjogWzUsIDI1LCAxMDAsIDUwMCwgMjAwMF0sXG4gIFwiY2hpcHNcIjoge1xuICAgIFwiMTBcIjogW1xuICAgICAge1wieFwiOiAxMDAsIFwieVwiOiAxMjB9LFxuICAgICAge1wieFwiOiAxMDAsIFwieVwiOiAxMjB9LFxuICAgICAge1wieFwiOiAtNjAsIFwieVwiOiA0MH0sXG4gICAgICB7XCJ4XCI6IC02MCwgXCJ5XCI6IDQwfSxcbiAgICAgIHtcInhcIjogMTAwLCBcInlcIjogLTE0MH0sXG4gICAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IC0xNDB9LFxuICAgICAge1wieFwiOiAxMDAsIFwieVwiOiAtMTQwfSxcbiAgICAgIHtcInhcIjogMjQwLCBcInlcIjogNDB9LFxuICAgICAge1wieFwiOiAyNDAsIFwieVwiOiA0MH0sXG4gICAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IDEyMH1cbiAgICBdXG4gIH0sXG4gIFwibmFtZXBsYXRlXCI6IHtcbiAgICBcIm5hbWVcIjoge1xuICAgICAgXCJ4XCI6IDEwLFxuICAgICAgXCJ5XCI6IDMwLFxuICAgICAgXCJzdHlsZVwiOiB7XG4gICAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgICBcImZpbGxcIjogXCIjMzMzMzMzXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmFsYW5jZVwiOiB7XG4gICAgICBcInhcIjogMTAsXG4gICAgICBcInlcIjogNjAsXG4gICAgICBcInN0eWxlXCI6IHtcbiAgICAgICAgXCJmb250XCI6IFwiMTZwdCBBcmlhbFwiLFxuICAgICAgICBcImJvdW5kc0FsaWduSFwiOiBcInJpZ2h0XCIsXG4gICAgICAgIFwiZmlsbFwiOiBcIiM1NTU1NTVcIlxuICAgICAgfVxuICAgIH0sXG4gICAgXCJmbGFzaFwiOiB7XG4gICAgICBcInN0eWxlXCI6IHtcbiAgICAgICAgXCJmb250XCI6IFwiYm9sZCAzMHB0IEFyaWFsXCIsXG4gICAgICAgIFwiZmlsbFwiOiBcIiMzMzMzMzNcIlxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgXCJwb3B1cFwiOiB7XG4gICAgXCJ4XCI6IDAsXG4gICAgXCJ5XCI6IDEwLFxuICAgIFwid2lkdGhcIjogNjAsXG4gICAgXCJoZWlnaHRcIjogMjAsXG4gICAgXCJ0ZXh0XCI6IHtcbiAgICAgIFwieFwiOiA2LFxuICAgICAgXCJ5XCI6IDE4LFxuICAgICAgXCJzdHlsZVwiOiB7XG4gICAgICAgIFwiZm9udFwiOiBcIjEycHQgQXJpYWxcIixcbiAgICAgICAgXCJib3VuZHNBbGlnbkhcIjogXCJjZW50ZXJcIixcbiAgICAgICAgXCJib3VuZHNBbGlnblZcIjogXCJjZW50ZXJcIixcbiAgICAgICAgXCJmaWxsXCI6IFwiI0ZGRkZGRlwiXG4gICAgICB9XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi4vY2xhc3Nlcy9CdXR0b25cIjtcblxuY2xhc3MgQnV5SW5NYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXkpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuYnV5SW5SZXF1ZXN0ZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNlYXRzID0ge307XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge1wiYnV0dG9uc1wiOiBbXSwgXCJtb2RhbFwiOiBudWxsLCBcImlucHV0Qm94XCI6IG51bGx9O1xuICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKHRoaXMuYnV0dG9uc0dyb3VwKTtcblxuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmRhdGEgPSB7XCJzZWF0TnVtXCI6IG51bGwsIFwiYnV5SW5cIjogbnVsbH07XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICBpZiAodGhpcy5kaXNwbGF5LmlucHV0RmllbGQgJiYgdGhpcy5kaXNwbGF5LmlucHV0RmllbGQudmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0RmllbGQudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0aWFsaXplKHNlYXRDb25maWcsIG9jY3VwaWVkU2VhdHMsIG1vZGFsQ29uZmlnKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VhdENvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCBzZWF0Q29uZmlnW2ldLngsIHNlYXRDb25maWdbaV0ueSwgdGhpcy5rZXksIHRoaXMuYnV0dG9uQ2xpY2tlZCwgdGhpcyk7XG4gICAgICAgICAgICBidXR0b24uc2VhdE51bSA9IGk7IC8vIFN0b3JlIGZvciB1c2Ugb24gY2xpY2tcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRGcmFtZXMoXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fb3ZlclwiLFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX291dFwiLFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX2Rvd25cIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl91cFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYnV0dG9uLnNldFRleHQoXCJCdXkgSW5cIik7XG4gICAgICAgICAgICB0aGlzLnNlYXRzW2ldID0ge1xuICAgICAgICAgICAgICAgIFwiYnV0dG9uXCI6IGJ1dHRvbixcbiAgICAgICAgICAgICAgICBcIm9jY3VwaWVkXCI6IG9jY3VwaWVkU2VhdHMuaW5kZXhPZihpKSAhPT0gLTFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuYnV0dG9ucy5wdXNoKGJ1dHRvbik7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cC5hZGQoYnV0dG9uKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cC52aXNpYmxlID0gdGhpcy5idXR0b25zVmlzaWJsZTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWxCYWNrZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCB0aGlzLmdhbWUudGV4dHVyZXMubW9kYWxCYWNrZ3JvdW5kKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsQmFja2dyb3VuZC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UobW9kYWxDb25maWcueCwgbW9kYWxDb25maWcueSwgdGhpcy5rZXksIFwibW9kYWxcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKHRoaXMuZGlzcGxheS5tb2RhbCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0Qm94ID0gdGhpcy5nYW1lLmFkZC5pbWFnZShtb2RhbENvbmZpZy5pbnB1dEJveC54LCBtb2RhbENvbmZpZy5pbnB1dEJveC55LCB0aGlzLmtleSwgXCJpbnB1dF9ib3hcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkuaW5wdXRCb3gpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkID0gdGhpcy5nYW1lLmFkZC5pbnB1dEZpZWxkKG1vZGFsQ29uZmlnLmlucHV0RmllbGQueCwgbW9kYWxDb25maWcuaW5wdXRGaWVsZC55LCB7XG4gICAgICAgICAgICBmb250OiAnMzJweCBBcmlhbCcsXG4gICAgICAgICAgICBmaWxsOiAnIzMzMzMzMycsXG4gICAgICAgICAgICB3aWR0aDogMjIwLFxuICAgICAgICAgICAgcGFkZGluZzogOCxcbiAgICAgICAgICAgIGJvcmRlcldpZHRoOiAwLFxuICAgICAgICAgICAgcGxhY2VIb2xkZXI6ICcyMC4wMCcsXG4gICAgICAgICAgICB0eXBlOiBQaGFzZXJJbnB1dC5JbnB1dFR5cGUubnVtYmVyLFxuICAgICAgICAgICAgZmlsbEFscGhhOiAwXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRCb3guYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmlucHV0RmllbGQpO1xuXG4gICAgICAgIGNvbnN0IGJ0blRleHRTdHlsZSA9IHtcbiAgICAgICAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgICAgICAgIFwiYWxpZ25cIjogXCJjZW50ZXJcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwgPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgbW9kYWxDb25maWcuY2FuY2VsQnV0dG9uLngsIG1vZGFsQ29uZmlnLmNhbmNlbEJ1dHRvbi55LCB0aGlzLmtleSwgdGhpcy5jYW5jZWwsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FuY2VsLnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX3NlY29uZGFyeV9vdmVyXCIsXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfb3V0XCIsXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X3VwXCJcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbC5zZXRUZXh0U3R5bGUoYnRuVGV4dFN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbC5zZXRUZXh0KFwiQ0FOQ0VMXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmNhbmNlbCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnN1Ym1pdCA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCBtb2RhbENvbmZpZy5zdWJtaXRCdXR0b24ueCwgbW9kYWxDb25maWcuc3VibWl0QnV0dG9uLnksIHRoaXMua2V5LCB0aGlzLnN1Ym1pdCwgdGhpcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0RnJhbWVzKFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9vdmVyXCIsXG4gICAgICAgICAgICBcImJ0bl9wcmltYXJ5X291dFwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9kb3duXCIsXG4gICAgICAgICAgICBcImJ0bl9wcmltYXJ5X3VwXCJcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnN1Ym1pdC5zZXRUZXh0U3R5bGUoYnRuVGV4dFN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnN1Ym1pdC5zZXRUZXh0KFwiQlVZIElOXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LnN1Ym1pdCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgbmV3UGxheWVyKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5zZWF0c1twbGF5ZXJEYXRhLnNlYXRdLm9jY3VwaWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgcGxheWVyTGVmdChwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuc2VhdHNbcGxheWVyRGF0YS5zZWF0XS5vY2N1cGllZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICBmb3IgKGxldCBzZWF0TnVtIGluIHRoaXMuc2VhdHMpIHtcbiAgICAgICAgICAgIGxldCBzZWF0ID0gdGhpcy5zZWF0c1tzZWF0TnVtXTtcbiAgICAgICAgICAgIHNlYXQuYnV0dG9uLnZpc2libGUgPSAhc2VhdC5vY2N1cGllZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cC52aXNpYmxlID0gdGhpcy5idXR0b25zVmlzaWJsZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLnZpc2libGUgPSB0aGlzLm1vZGFsVmlzaWJsZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsQmFja2dyb3VuZC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgfVxuXG4gICAgYnV0dG9uQ2xpY2tlZChidXR0b24pIHtcbiAgICAgICAgdGhpcy5kYXRhLnNlYXROdW0gPSBidXR0b24uc2VhdE51bTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIGNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc3VibWl0KCkge1xuICAgICAgICB0aGlzLmRhdGEuYnV5SW4gPSB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZC52YWx1ZTtcbiAgICAgICAgdGhpcy5idXlJblJlcXVlc3RlZC5kaXNwYXRjaCh0aGlzLmRhdGEuc2VhdE51bSwgdGhpcy5kYXRhLmJ1eUluKTtcbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldEJ1dHRvbnNWaXNpYmxlKHZpc2libGUpIHtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnV5SW5NYW5hZ2VyOyIsImltcG9ydCBDYXJkIGZyb20gXCIuLi9jbGFzc2VzL0NhcmRcIjtcblxuY2xhc3MgQ2FyZE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGF1dG9IaWRlID0gZmFsc2UsIGtleSA9IFwiY2FyZHNcIikge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmF1dG9IaWRlID0gYXV0b0hpZGU7IC8vIEF1dG8taGlkZSBhbGwgZmFjZSBkb3duIGNhcmRzP1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5jYXJkcyA9IFtdO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5fbWFzayA9IG51bGw7ICAvLyBBIG1hc2sgYXBwbGllZCB0byBhbGwgY2FyZHMgaW4gZGlzcGxheUdyb3VwXG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShudW1fY2FyZHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fY2FyZHM7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNhcmQgPSBuZXcgQ2FyZCh0aGlzLmdhbWUsIDAsIDAsIHRoaXMua2V5LCB0aGlzLCB0aGlzLmF1dG9IaWRlKTtcbiAgICAgICAgICAgIGNhcmQuaW5pdGlhbGl6ZSh7fSk7XG4gICAgICAgICAgICBjYXJkLmluaXRpYWxpemVEaXNwbGF5KCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FyZHMucHVzaChjYXJkKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChjYXJkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldENhcmROYW1lcyhuYW1lcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLm5hbWUgPSBuYW1lc1tpXTtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0udXBkYXRlRGlzcGxheSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS5uYW1lID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0udXBkYXRlRGlzcGxheSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHMubGVuZ3RoO1xuICAgIH1cblxuICAgIHNldCBtYXNrKG1hc2spIHtcbiAgICAgICAgdGhpcy5fbWFzayA9IG1hc2s7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLm1hc2sgPSBtYXNrO1xuICAgIH1cblxuICAgIGdldCBtYXNrKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFzaztcbiAgICB9XG5cbiAgICBnZXQgY2FyZFdpZHRoKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2FyZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYXJkc1swXS53aWR0aDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmRNYW5hZ2VyO1xuIiwiaW1wb3J0IENoaXAgZnJvbSBcIi4uL2NsYXNzZXMvQ2hpcFwiO1xuaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcblxuY2xhc3MgVG9vbHRpcCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5LCBwYWRkaW5nID0gMTApIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMucGFkZGluZyA9IHBhZGRpbmc7XG5cbiAgICAgICAgdGhpcy5fdGV4dCA9IFwiXCI7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IG51bGwsXG4gICAgICAgICAgICB0ZXh0OiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgdGV4dCh0ZXh0KSB7XG4gICAgICAgIHRoaXMuX3RleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dC50ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy5yZVBvcygpO1xuICAgIH1cblxuICAgIGdldCB0ZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dDtcbiAgICB9XG5cbiAgICBzZXQgdmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLnZpc2libGUgPSB2aXNpYmxlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIHRoaXMua2V5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhY2tncm91bmQuYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMiwgXCJcIik7ICAgLy8gVE9ETyAtIE5vIG1hZ2ljIG51bWJlcnMgKGxlYXZpbmcgZm9yIG5vdyBiZWNhdXNlIGZ1Y2sgdHJ5aW5nIHRvIHBvc2l0aW9uIHRleHQgdmVydGljYWxseSlcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQuc2V0U3R5bGUoe1xuICAgICAgICAgICAgXCJmb250XCI6IFwiMTZwdCBBcmlhbFwiLFxuICAgICAgICAgICAgXCJmaWxsXCI6IFwiI0ZGRkZGRlwiXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dC5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmJhY2tncm91bmQpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnRleHQpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVQb3MoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXh0LnNjYWxlLnNldFRvKDEpO1xuICAgICAgICBjb25zdCB0ZXh0QXJlYSA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLndpZHRoIC0gKHRoaXMucGFkZGluZyAqIDIpO1xuICAgICAgICBpZiAodGhpcy5kaXNwbGF5LnRleHQud2lkdGggPiB0ZXh0QXJlYSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQuc2NhbGUuc2V0VG8odGV4dEFyZWEgLyB0aGlzLmRpc3BsYXkudGV4dC53aWR0aCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIENoaXBNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXksIHZhbHVlcykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgICAgICAgdGhpcy5zdGFja0NoaXBzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb2xvclVwID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jaGlwcyA9IFtdO1xuICAgICAgICB0aGlzLnBvb2wgPSBbXTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBudWxsO1xuICAgICAgICB0aGlzLnRvb2x0aXAgPSBuZXcgVG9vbHRpcCh0aGlzLmdhbWUsIHRoaXMuZ2FtZS50ZXh0dXJlcy50ZXh0VW5kZXJsYXkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge1xuICAgICAgICAgICAgY2hpcHM6IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKSxcbiAgICAgICAgICAgIHRvb2x0aXA6IHRoaXMudG9vbHRpcC5kaXNwbGF5R3JvdXBcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50cmFuc2ZlckFuaW1hdGlvbiA9IHRoaXMuYW5pbWF0ZUNoaXBDYXNjYWRlO1xuICAgICAgICB0aGlzLnRyYW5zZmVyQ29tcGxldGUgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnBpbGVSYWRpdXMgPSAzMDtcbiAgICB9XG5cbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy50b29sdGlwLnRleHQgPSBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5fdmFsdWUpO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnRvb2x0aXAuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRvb2x0aXAueSA9IHRoaXMuZGlzcGxheS50b29sdGlwLmhlaWdodDtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5jaGlwcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkudG9vbHRpcCk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoMCk7XG4gICAgfVxuXG4gICAgZ2V0Q2hpcCgpIHtcbiAgICAgICAgbGV0IGNoaXAgPSB0aGlzLnBvb2wucG9wKCk7XG4gICAgICAgIGlmICghY2hpcCkge1xuICAgICAgICAgICAgY2hpcCA9IG5ldyBDaGlwKHRoaXMuZ2FtZSwgMCwgMCwgdGhpcy5rZXksIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRDaGlwSW5wdXRzKGNoaXApO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmNoaXBzLmFkZENoaWxkKGNoaXApO1xuICAgICAgICB9XG4gICAgICAgIGNoaXAucmV2aXZlKCk7XG4gICAgICAgIGNoaXAucGFyZW50LmJyaW5nVG9Ub3AoY2hpcCk7XG4gICAgICAgIHRoaXMuY2hpcHMucHVzaChjaGlwKTtcbiAgICAgICAgcmV0dXJuIGNoaXA7XG4gICAgfVxuXG4gICAgc2V0Q2hpcElucHV0cyhjaGlwKSB7XG4gICAgICAgIGNoaXAuZXZlbnRzLm9uSW5wdXRPdmVyLnJlbW92ZUFsbCgpO1xuICAgICAgICBjaGlwLmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4ge3RoaXMudG9vbHRpcC52aXNpYmxlID0gdHJ1ZX0pO1xuXG4gICAgICAgIGNoaXAuZXZlbnRzLm9uSW5wdXRPdXQucmVtb3ZlQWxsKCk7XG4gICAgICAgIGNoaXAuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHt0aGlzLnRvb2x0aXAudmlzaWJsZSA9IGZhbHNlfSk7XG4gICAgfVxuXG4gICAgc2V0VmFsdWUodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl92YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29sb3JVcCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgLT0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgKz0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgeVBvcyA9IDA7XG4gICAgICAgIGxldCB2YWx1ZXNQdHIgPSB0aGlzLnZhbHVlcy5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAodmFsdWUgPj0gMjUpIHtcbiAgICAgICAgICAgIHdoaWxlICh2YWx1ZSA8IHRoaXMudmFsdWVzW3ZhbHVlc1B0cl0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXNQdHItLTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVzUHRyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjaGlwID0gdGhpcy5nZXRDaGlwKCk7XG4gICAgICAgICAgICBjaGlwLnZhbHVlID0gdGhpcy52YWx1ZXNbdmFsdWVzUHRyXTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhY2tDaGlwcykge1xuICAgICAgICAgICAgICAgIGNoaXAueSA9IHlQb3M7XG4gICAgICAgICAgICAgICAgeVBvcyAtPSA1O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGlwcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpcC54ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgY2hpcC55ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmFuZFBvcyA9IHRoaXMucmFuZENoaXBQb3MoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hpcC54ID0gcmFuZFBvcy54O1xuICAgICAgICAgICAgICAgICAgICBjaGlwLnkgPSByYW5kUG9zLnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgLT0gdGhpcy52YWx1ZXNbdmFsdWVzUHRyXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICBsZXQgY2hpcDtcbiAgICAgICAgd2hpbGUgKGNoaXAgPSB0aGlzLmNoaXBzLnBvcCgpKSB7XG4gICAgICAgICAgICB0aGlzLnBvb2wucHVzaChjaGlwKTtcbiAgICAgICAgICAgIGNoaXAua2lsbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJDaGlwKGNoaXApIHtcbiAgICAgICAgLy8gUmVtb3ZlIGNoaXAgZnJvbSB0aGlzLmNoaXBzIGlmIGZvdW5kXG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaXBzW2ldLmlkID09PSBjaGlwLmlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGlwcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICB0aGlzLnBvb2wucHVzaChjaGlwKTtcbiAgICAgICAgICAgIGNoaXAua2lsbCgpO1xuICAgICAgICAgICAgcmV0dXJuIGNoaXA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0YWtlQ2hpcHMoY2hpcHMpIHtcbiAgICAgICAgY2hpcHMgPSBjaGlwcy5zbGljZSgpO1xuICAgICAgICBsZXQgbmV3Q2hpcHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IG5ld0NoaXAgPSB0aGlzLnRha2VDaGlwKGNoaXBzW2ldKTtcbiAgICAgICAgICAgIG5ld0NoaXBzLnB1c2gobmV3Q2hpcCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyYW5zZmVyQW5pbWF0aW9uKG5ld0NoaXBzKTtcbiAgICB9XG5cbiAgICB0YWtlQ2hpcChzcmNDaGlwKSB7XG4gICAgICAgIGxldCBuZXdDaGlwID0gdGhpcy5nZXRDaGlwKCk7XG4gICAgICAgIG5ld0NoaXAuY2xvbmUoc3JjQ2hpcCk7XG4gICAgICAgIHRoaXMuc2V0Q2hpcElucHV0cyhuZXdDaGlwKTtcblxuICAgICAgICBzcmNDaGlwLm1hbmFnZXIuY2xlYXJDaGlwKHNyY0NoaXApO1xuXG4gICAgICAgIHRoaXMudmFsdWUgKz0gc3JjQ2hpcC52YWx1ZTtcblxuICAgICAgICByZXR1cm4gbmV3Q2hpcDtcbiAgICB9XG5cbiAgICBhbmltYXRlU3RhY2tUcmFuc2ZlcigpIHtcblxuICAgIH1cblxuICAgIGFuaW1hdGVDaGlwQ2FzY2FkZShjaGlwcykge1xuICAgICAgICBsZXQgZGVsYXkgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2hpcCA9IGNoaXBzW2ldO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnRpbWUuZXZlbnRzLmFkZChkZWxheSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByYW5kUG9zID0gdGhpcy5yYW5kQ2hpcFBvcygpO1xuICAgICAgICAgICAgICAgIGxldCB0d2VlbiA9IHRoaXMuZ2FtZS5hZGQudHdlZW4oY2hpcCkudG8oe3g6IHJhbmRQb3MueCwgeTogcmFuZFBvcy55fSwgMjAwLCBQaGFzZXIuRWFzaW5nLlF1YWRyYXRpYy5Jbk91dCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IGNoaXBzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4gdGhpcy50cmFuc2ZlckNvbXBsZXRlLmRpc3BhdGNoKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICAgICAgZGVsYXkgKz0gMTAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmFuZENoaXBQb3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKC10aGlzLnBpbGVSYWRpdXMsIHRoaXMucGlsZVJhZGl1cyksXG4gICAgICAgICAgICB5OiB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKC10aGlzLnBpbGVSYWRpdXMsIHRoaXMucGlsZVJhZGl1cylcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoaXBNYW5hZ2VyOyIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL2NsYXNzZXMvUGxheWVyXCI7XG5cbmNsYXNzIFBsYXllck1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVzZXJJZCwgc2VhdENvbmZpZywgY2hpcENvbmZpZykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgdGhpcy5zZWF0Q29uZmlnID0gc2VhdENvbmZpZztcbiAgICAgICAgdGhpcy5jaGlwQ29uZmlnID0gY2hpcENvbmZpZztcblxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTsgIC8vIERpcmVjdCBhY2Nlc3MgdG8gdGhlIFBsYXllciBvYmplY3RzXG4gICAgICAgIHRoaXMudXNlclBsYXllciA9IG51bGw7ICAvLyBUaGUgdXNlcidzIHBsYXllciBvYmplY3QsIGlmIGF2YWlsYWJsZVxuICAgICAgICB0aGlzLm5leHRQbGF5ZXIgPSBudWxsOyAgLy8gVGhlIHBsYXllciB0aGF0IHRoZSBnYW1lIGV4cGVjdHMgdG8gYWN0IG5leHRcbiAgICAgICAgdGhpcy5kZWFsZXJQbGF5ZXIgPSBudWxsOyAgIC8vIEN1cnJlbnQgaGFuZCdzIGRlYWxlclxuXG4gICAgICAgIC8vIENvbnRhaW5zIGFsbCBkaXNwbGF5IGVsZW1lbnRzIGZvciBhbGwgcGxheWVycyBpbiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBnZXQgbGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKHBsYXllckRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1BsYXllcihwbGF5ZXJEYXRhW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMuZ2FtZSwgdGhpcy5jaGlwQ29uZmlnKTtcbiAgICAgICAgcGxheWVyLmluaXRpYWxpemUocGxheWVyRGF0YSk7XG4gICAgICAgIHBsYXllci5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAueCA9IHRoaXMuc2VhdENvbmZpZ1twbGF5ZXJEYXRhLnNlYXRdLng7XG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAueSA9IHRoaXMuc2VhdENvbmZpZ1twbGF5ZXJEYXRhLnNlYXRdLnk7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHBsYXllci5kaXNwbGF5R3JvdXApO1xuXG4gICAgICAgIGlmIChwbGF5ZXIudXNlcklkID09PSB0aGlzLnVzZXJJZCkge1xuICAgICAgICAgICAgdGhpcy51c2VyUGxheWVyID0gcGxheWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICB9XG5cbiAgICBwbGF5ZXJMZWZ0KHBsYXllckRhdGEpIHtcbiAgICAgICAgbGV0IHBsYXllciA9IHRoaXMuZ2V0QnlJZChwbGF5ZXJEYXRhLmlkKTtcblxuICAgICAgICBpZiAoIXBsYXllcikge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ291bGQgbm90IGZpbmQgcGxheWVyIGF0IHRhYmxlXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheWVyLmRpc3BsYXlHcm91cC5kZXN0cm95KCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldID09PSBwbGF5ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBsYXllciA9PT0gdGhpcy51c2VyUGxheWVyKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXJQbGF5ZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBsYXllcjtcbiAgICB9XG5cbiAgICBnZXRCeUlkKGlkKSB7XG4gICAgICAgIC8vIFRPRE8gLSBEbyB0aGlzIHdpdGhvdXQgaXRlcmF0aW5nIC0tIGJ1aWxkIG1hcCBvbiBpbml0P1xuICAgICAgICAvLyBUT0RPIC0gU2hvdWxkIHRoaXMgZXZlciByZXR1cm4gbnVsbD9cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcnNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGxheWVyc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBnZXRCeVNlYXQoc2VhdCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcnNbaV0uc2VhdCA9PT0gc2VhdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IGEgbGlzdCBvZiBhbGwgb2NjdXBpZWQgc2VhdHMgYXQgdGhlIHRhYmxlXG4gICAgICogQHJldHVybnMge251bWJlcltdfSAtIFRoZSBJRHMgb2Ygb2NjdXBpZWQgc2VhdHNcbiAgICAgKi9cbiAgICBnZXRPY2N1cGllZFNlYXRzKCkge1xuICAgICAgICBsZXQgb2NjdXBpZWRTZWF0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb2NjdXBpZWRTZWF0cy5wdXNoKHRoaXMucGxheWVyc1tpXS5zZWF0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2NjdXBpZWRTZWF0cztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllck1hbmFnZXI7XG4iLCJjb25zdCBpc1N0cmluZyA9IHZhbCA9PiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbmNvbnN0IGlzQmxvYiA9IHZhbCA9PiB2YWwgaW5zdGFuY2VvZiBCbG9iO1xuXG5wb2x5ZmlsbC5jYWxsKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnID8gd2luZG93IDogdGhpcyB8fCB7fSk7XG5cbmZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICBpZiAoaXNTdXBwb3J0ZWQuY2FsbCh0aGlzKSkgcmV0dXJuO1xuXG4gIGlmICghKCduYXZpZ2F0b3InIGluIHRoaXMpKSB0aGlzLm5hdmlnYXRvciA9IHt9O1xuICB0aGlzLm5hdmlnYXRvci5zZW5kQmVhY29uID0gc2VuZEJlYWNvbi5iaW5kKHRoaXMpO1xufTtcblxuZnVuY3Rpb24gc2VuZEJlYWNvbih1cmwsIGRhdGEpIHtcbiAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50ICYmIHRoaXMuZXZlbnQudHlwZTtcbiAgY29uc3Qgc3luYyA9IGV2ZW50ID09PSAndW5sb2FkJyB8fCBldmVudCA9PT0gJ2JlZm9yZXVubG9hZCc7XG5cbiAgY29uc3QgeGhyID0gKCdYTUxIdHRwUmVxdWVzdCcgaW4gdGhpcykgPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICB4aHIub3BlbignUE9TVCcsIHVybCwgIXN5bmMpO1xuICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICcqLyonKTtcblxuXG4gIGlmIChpc1N0cmluZyhkYXRhKSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jyk7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9ICd0ZXh0L3BsYWluJztcbiAgfSBlbHNlIGlmIChpc0Jsb2IoZGF0YSkgJiYgZGF0YS50eXBlKSB7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsIGRhdGEudHlwZSk7XG4gIH1cblxuICB0cnkge1xuICAgIHhoci5zZW5kKGRhdGEpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc1N1cHBvcnRlZCgpIHtcbiAgcmV0dXJuICgnbmF2aWdhdG9yJyBpbiB0aGlzKSAmJiAoJ3NlbmRCZWFjb24nIGluIHRoaXMubmF2aWdhdG9yKTtcbn0iLCJpbXBvcnQgY29uZmlnIGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCBDb250cm9sbGVyIGZyb20gXCIuLi9jbGFzc2VzL0NvbnRyb2xsZXJcIjtcblxuY2xhc3MgQm9vdCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmluaXRpYWxEYXRhID0gdGhpcy5hdWdtZW50SW5pdGlhbERhdGEoaW5pdGlhbERhdGEpO1xuICAgICAgICB0aGlzLmdhbWUuY29uZmlnID0gY29uZmlnO1xuXG4gICAgICAgIC8vIFRPRE8gLSBUaGlzIHNob3VsZCBjb21lIGZyb20gc29tZXdoZXJlIGR5bmFtaWNcbiAgICAgICAgdGhpcy5nYW1lLnJ1bGVzID0ge1xuICAgICAgICAgICAgYW50ZTogMCxcbiAgICAgICAgICAgIGJsaW5kczoge1xuICAgICAgICAgICAgICAgIHNtYWxsOiAyNSxcbiAgICAgICAgICAgICAgICBiaWc6IDUwXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEucGxheWVySWQsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50b2tlbik7XG5cbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5lbXVsYXRvckVuYWJsZWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5nYW1lID0gdGhpcy5nYW1lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoXCJsb2FkXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBTdW1tYXJ5IENhbGN1bGF0ZSBhZGRpdGlvbmFsIHZhbHVlcyB0byBzdG9yZSBvbiBnYW1lLmluaXRpYWxEYXRhXG4gICAgICpcbiAgICAgKiBUbyBzYXZlIG9uIHNlcnZlci1zaWRlIHByb2Nlc3NpbmcgYW5kIGRhdGEtdHJhbnNmZXIgbG9hZCwgdGhpc1xuICAgICAqIG1ldGhvZCBpcyBhIHBsYWNlIHRvIGdlbmVyYXRlIGFkZGl0aW9uYWwgZGF0YSBuZWVkZWQgYnkgdGhlIGdhbWVcbiAgICAgKiB3aGljaCBtYXkgYmUgZGVyaXZlZCBmcm9tIHRoZSBkYXRhIHNlbnQgZnJvbSB0aGUgYmFjayBlbmQuXG4gICAgICovXG4gICAgYXVnbWVudEluaXRpYWxEYXRhKGluaXRpYWxEYXRhKSB7XG4gICAgICAgIGluaXRpYWxEYXRhLm9jY3VwaWVkU2VhdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbml0aWFsRGF0YS5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpbml0aWFsRGF0YS5vY2N1cGllZFNlYXRzLnB1c2goaW5pdGlhbERhdGEucGxheWVyc1tpXS5zZWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbml0aWFsRGF0YTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvb3Q7IiwiY2xhc3MgTG9hZCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgcHJlbG9hZCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJiYWNrZ3JvdW5kXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYmFja2dyb3VuZC5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwiZGVhbGVyQnV0dG9uXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvZGVhbGVyYnV0dG9uLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJyZWRDaXJjbGVcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9yZWRjaXJjbGUucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwiY2FyZHNcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9jYXJkcy5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9jYXJkcy5qc29uXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwicGFuZWxcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9wYW5lbC5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9wYW5lbC5qc29uXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwiYnV5SW5cIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9idXlpbi5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9idXlpbi5qc29uXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwiY2hpcHNcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9jaGlwcy5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9jaGlwcy5qc29uXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwibmFtZXBsYXRlXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvbmFtZXBsYXRlLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL25hbWVwbGF0ZS5qc29uXCIpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS50ZXh0dXJlcyA9IHRoaXMuY3JlYXRlQ3VzdG9tVGV4dHVyZXMoKTtcblxuICAgICAgICB0aGlzLmxvYWRQbHVnaW5zKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoXCJtYWluXCIpO1xuICAgIH1cblxuICAgIGNyZWF0ZUN1c3RvbVRleHR1cmVzKCkge1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSB7fTtcblxuICAgICAgICBsZXQgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmxpbmVTdHlsZSg0LCAweDAwMDAwMCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDEwMCwgMTAwLCAxMDAsIDEwMCk7XG4gICAgICAgIHRleHR1cmVzW1wid2hpdGVTcXVhcmVcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoNCwgMHgwMDAwMDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgwLCAwLCAzMDAsIDEwMCk7XG4gICAgICAgIHRleHR1cmVzW1wid2hpdGVSZWN0XCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4MDAwMDAwLCAwLjUpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgwLCAwLCB0aGlzLmdhbWUud2lkdGgsIHRoaXMuZ2FtZS5oZWlnaHQpO1xuICAgICAgICB0ZXh0dXJlc1tcIm1vZGFsQmFja2dyb3VuZFwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cblxuICAgICAgICBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4MDAwMDAwLCAwLjUpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgwLCAwLCB0aGlzLmdhbWUuY29uZmlnLnBvcHVwLndpZHRoLCB0aGlzLmdhbWUuY29uZmlnLnBvcHVwLmhlaWdodCk7XG4gICAgICAgIHRleHR1cmVzW1widGV4dFVuZGVybGF5XCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICByZXR1cm4gdGV4dHVyZXM7XG4gICAgfVxuXG4gICAgbG9hZFBsdWdpbnMoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5hZGQucGx1Z2luKFBoYXNlcklucHV0LlBsdWdpbik7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkOyIsImltcG9ydCB7QWN0aW9uLCBBY3Rpb25UZXh0fSBmcm9tIFwiLi4vY2xhc3Nlcy9BY3Rpb25cIjtcbmltcG9ydCBCdXlJbk1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0J1eUluTWFuYWdlclwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuaW1wb3J0IFBhbmVsIGZyb20gXCIuLi9jbGFzc2VzL1BhbmVsXCI7XG5pbXBvcnQgUGxheWVyTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvUGxheWVyTWFuYWdlclwiO1xuaW1wb3J0IFBvdCBmcm9tIFwiLi4vY2xhc3Nlcy9Qb3RcIjtcbmltcG9ydCBQb2tlciBmcm9tIFwiLi4vUG9rZXJcIjtcbmltcG9ydCBTU0UgZnJvbSBcIi4uL1NTRVwiO1xuaW1wb3J0IFR3ZWVuUXVldWUgZnJvbSBcIi4uL2NsYXNzZXMvVHdlZW5RdWV1ZVwiO1xuXG5jbGFzcyBNYWluIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLnRhYmxlX3NzZSA9IG5ldyBTU0UodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVTU0VVcmwpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlID0gbmV3IFNTRSh0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VyU1NFVXJsKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInVubG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5kaXNjb25uZWN0QmVhY29uKCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgXCJiYWNrZ3JvdW5kXCIpO1xuICAgICAgICB0aGlzLm5ld0hhbmRCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAxMDAsIFwibmV3XFxuaGFuZFwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMubmV3SGFuZCk7XG4gICAgICAgIHRoaXMuZGVhbEJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDIyMCwgXCJkZWFsXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5kZWFsKTtcbiAgICAgICAgdGhpcy5sZWF2ZUJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDM0MCwgXCJsZWF2ZVwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMubGVhdmVUYWJsZSk7XG4gICAgICAgIHRoaXMuYmJCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCA0NjAsIFwiQkJcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmJiKTtcbiAgICAgICAgdGhpcy5zYkJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDU4MCwgXCJTQlwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuc2IpO1xuXG4gICAgICAgIGNvbnN0IG51bVNlYXRzID0gMTA7ICAgIC8vIFRPRE8gLSBNYWtlIGR5bmFtaWNcbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMgPSBuZXcgUGxheWVyTWFuYWdlcih0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VySWQsIHRoaXMuZ2FtZS5jb25maWcuc2VhdHNbbnVtU2VhdHNdLCB0aGlzLmdhbWUuY29uZmlnLmNoaXBzW251bVNlYXRzXSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmluaXRpYWxpemUodGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcnMsIHRoaXMuZ2FtZS5jb25maWcuc2VhdHNbbnVtU2VhdHNdKTtcblxuICAgICAgICB0aGlzLmdhbWUuYm9hcmQgPSBuZXcgQ2FyZE1hbmFnZXIodGhpcy5nYW1lLCB0cnVlKTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmluaXRpYWxpemUoNSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuc2V0QWxsKFwidmlzaWJsZVwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5hbGlnbigtMSwgMSwgdGhpcy5nYW1lLmJvYXJkLmNhcmRXaWR0aCAqIDEuMiwgMSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmNlbnRlclkgPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5zZXRBbGwoXCJ2aXNpYmxlXCIsIGZhbHNlKTtcblxuICAgICAgICB0aGlzLmdhbWUucG90ID0gbmV3IFBvdCh0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmdhbWUucG90LmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wb3QuY2hpcHMuZGlzcGxheUdyb3VwLmNlbnRlclggPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWDsgICAgIC8vIFRPRE8gLSBQb3NpdGlvbnMgaW4gY29uZmlnXG4gICAgICAgIHRoaXMuZ2FtZS5wb3QuY2hpcHMuZGlzcGxheUdyb3VwLmNlbnRlclkgPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWSAtIDE0MDtcblxuICAgICAgICAvLyBUT0RPIC0gVGhlc2Ugc2hvdWxkIGdvIHNvbWV3aGVyZSBlbHNlLiBNYXliZSBpbiBQb3Q/XG4gICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gMDtcblxuICAgICAgICB0aGlzLmdhbWUucGFuZWwgPSBuZXcgUGFuZWwodGhpcy5nYW1lLCBcInBhbmVsXCIpO1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuaW5pdGlhbGl6ZSgpO1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuZGlzcGxheUdyb3VwLnggPSB0aGlzLmdhbWUuY29uZmlnLnBhbmVsLnBvcy54O1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuZGlzcGxheUdyb3VwLnkgPSB0aGlzLmdhbWUuY29uZmlnLnBhbmVsLnBvcy55O1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuYWx3YXlzVmlzaWJsZSA9IHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5lbXVsYXRvckVuYWJsZWQ7XG5cbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluID0gbmV3IEJ1eUluTWFuYWdlcih0aGlzLmdhbWUsIFwiYnV5SW5cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbi5pbml0aWFsaXplKHRoaXMuZ2FtZS5jb25maWcuc2VhdHNbbnVtU2VhdHNdLCB0aGlzLmdhbWUucGxheWVycy5nZXRPY2N1cGllZFNlYXRzKCksIHRoaXMuZ2FtZS5jb25maWcuYnV5SW5Nb2RhbCk7XG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbi5zZXRCdXR0b25zVmlzaWJsZSh0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyID09PSBudWxsKTtcblxuICAgICAgICB0aGlzLmdhbWUucXVldWUgPSBuZXcgVHdlZW5RdWV1ZSh0aGlzLmdhbWUpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcnMoKTtcblxuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld0hhbmRcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdIYW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5kZWFsZXJQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEuZGVhbGVyKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY2FyZHMucmVzZXQoKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNEZWFsZXI6IHBsYXllci5pZCA9PT0gZGF0YS5kZWFsZXIsXG4gICAgICAgICAgICAgICAgICAgIGlzTmV4dDogcGxheWVyLmlkID09PSBkYXRhLm5leHQsXG4gICAgICAgICAgICAgICAgICAgIHJvdW5kQmV0OiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImRlYWxcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWFsOiBcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgIGxldCBkZWxheSA9IDA7XG4gICAgICAgICAgICBsZXQgc2VhdHMgPSB0aGlzLmdhbWUucGxheWVycy5nZXRPY2N1cGllZFNlYXRzKCk7XG4gICAgICAgICAgICBsZXQgc2VhdEluZGV4ID0gc2VhdHMuaW5kZXhPZih0aGlzLmdhbWUucGxheWVycy5kZWFsZXJQbGF5ZXIuc2VhdCk7XG4gICAgICAgICAgICBzZWF0SW5kZXggPSAoc2VhdEluZGV4ICsgMSkgJSBzZWF0cy5sZW5ndGg7ICAvLyBTdGFydCB3aXRoIHBsYXllciB0byBsZWZ0IG9mIGRlYWxlclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWF0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoZGVsYXksICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlTZWF0KHNlYXRzW3NlYXRJbmRleF0pLmFuaW1hdGVEZWFsKCk7XG4gICAgICAgICAgICAgICAgICAgIHNlYXRJbmRleCA9IChzZWF0SW5kZXggKyAxKSAlIHNlYXRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgICAgICAgICBkZWxheSArPSAyMDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KFBva2VyLmdldE1pbkJldCh0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5nYW1lLmluaXRpYWxEYXRhLmVtdWxhdG9yRW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJlbXVsYXRlRGVhbFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZW11bGF0ZURlYWw6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBsYXllckRhdGEgPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKHBsYXllckRhdGEucGxheWVySWQpLmNhcmRzLnNldENhcmROYW1lcyhwbGF5ZXJEYXRhLmhvbGRpbmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1JvdW5kXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3Um91bmQ6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wb3QuZ2F0aGVyQ2hpcHModGhpcy5nYW1lLnBsYXllcnMucGxheWVycyk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXS51cGRhdGUoe3JvdW5kQmV0OiAwfSwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldCgwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiYWN0aW9uXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWN0aW9uOiBcIiwgZGF0YSk7XG5cbiAgICAgICAgICAgIGlmIChkYXRhLmFjdGlvblR5cGUgPT09IEFjdGlvbi5GT0xEKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLnBsYXllcklkKS5hbmltYXRlRm9sZCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQuc2V0Q2FyZE5hbWVzKGRhdGEuYm9hcmQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5wbGF5ZXJJZCkudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBiYWxhbmNlOiBkYXRhLnBsYXllckJhbGFuY2UsXG4gICAgICAgICAgICAgICAgaXNOZXh0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICByb3VuZEJldDogZGF0YS5wbGF5ZXJSb3VuZEJldFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEucGxheWVySWQpLm5hbWVwbGF0ZS5mbGFzaCh0aGlzLnBhcnNlQWN0aW9uVGV4dChkYXRhKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCkudXBkYXRlKHtpc05leHQ6IHRydWV9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IGRhdGEucm91bmRCZXQ7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IGRhdGEucm91bmRSYWlzZTtcblxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldChQb2tlci5nZXRNaW5CZXQodGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJoYW5kQ29tcGxldGVcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoYW5kQ29tcGxldGU6IFwiLCBkYXRhKTtcblxuICAgICAgICAgICAgLy8gVE9ETyAtIEhhbmRsZSBzcGxpdCBwb3RzXG4gICAgICAgICAgICAvLyBpZiAoZGF0YS53aW5uZXJzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIC8vIE5PVEUgLSBUaGlzIGlzIGEgdGVtcG9yYXJ5IHN0b3BnYXBcbiAgICAgICAgICAgIGlmIChkYXRhLndpbm5lcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBzaG91bGQgYmUgaG93IHRoZSBjb2RlIGZ1bmN0aW9ucyAtLSBhbGwgd2lubmVycyBjYWxsXG4gICAgICAgICAgICAgICAgLy8gY2hpcHMudGFrZUNoaXBzIG9uIGEgc3BlY2lmaWMgcG90LiBJZiB0aGVyZSBhcmUgbXVsdGlwbGVcbiAgICAgICAgICAgICAgICAvLyB3aW5uZXJzLCB0aGUgcG90IG11c3QgaGF2ZSBhbHJlYWR5IGJlZW4gc3BsaXQgaW50byB0aGVcbiAgICAgICAgICAgICAgICAvLyBhcHByb3ByaWF0ZSBzaXplIHBpbGVzXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLndpbm5lcnNbMF0uaWQpLmNoaXBzLnRha2VDaGlwcyh0aGlzLmdhbWUucG90LmNoaXBzLmNoaXBzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBqdXN0IGEgdGVtcG9yYXJ5IG92ZXJmbG93IG1lYXN1cmUuIElmIHRoZSBwb3Qgd2FzXG4gICAgICAgICAgICAgICAgLy8gc3BsaXQgb24gdGhlIGJhY2sgZW5kLCBkb24ndCBhbmltYXRlIGFueXRoaW5nLCBhcyB3ZSBhcmVuJ3RcbiAgICAgICAgICAgICAgICAvLyBzcGxpdHRpbmcgb24gdGhlIGZyb250IGVuZCB5ZXQuXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLndpbm5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHdpbm5lciA9IGRhdGEud2lubmVyc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZCh3aW5uZXIuaWQpLnVwZGF0ZSh7YmFsYW5jZTogd2lubmVyLmJhbGFuY2V9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBvdC5jaGlwcy5jbGVhcigpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnBsYXllcnMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzW2ldLmNoaXBzLmNsZWFyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1BsYXllclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3UGxheWVyOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXdQbGF5ZXIoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4ubmV3UGxheWVyKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnNldEJ1dHRvbnNWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIgPT09IG51bGwpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJwbGF5ZXJMZWZ0XCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwbGF5ZXJMZWZ0OiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJMZWZ0KGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnBsYXllckxlZnQoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4uc2V0QnV0dG9uc1Zpc2libGUodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllciA9PT0gbnVsbCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlLmFkZExpc3RlbmVyKFwiZGVhbFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVhbDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5jYXJkcy5zZXRDYXJkTmFtZXMoZGF0YS5ob2xkaW5ncyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwucHJpbWFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNlY29uZGFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnRlcnRpYXJ5Q2xpY2tlZC5hZGQodGhpcy5oYW5kbGVBY3Rpb24sIHRoaXMpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uYnV5SW5SZXF1ZXN0ZWQuYWRkKHRoaXMuZ2FtZS5jb250cm9sbGVyLmpvaW4sIHRoaXMuZ2FtZS5jb250cm9sbGVyKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJvdXRlIGFjdGlvbnMgdG8gY29udHJvbGxlciByZXF1ZXN0c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY3Rpb24gLSBUaGUgYWN0aW9uIHRvIGJlIHJlcXVlc3RlZCwgZGVmaW5lZCBpbiBBY3Rpb24uanNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmV0IC0gVGhlIGJldCAoaWYgYW55KSB0byBiZSBzZW50IHRvIHRoZSBjb250cm9sbGVyXG4gICAgICovXG4gICAgaGFuZGxlQWN0aW9uKGFjdGlvbiwgYmV0KSB7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5GT0xEOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmZvbGQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uLkNIRUNLOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5CRVQ6XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuYmV0KGJldCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkludmFsaWQgQWN0aW9uIFR5cGU6IFwiICsgYWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFRyYW5zZm9ybSBhY3Rpb24gZGF0YSBpbnRvIG1vcmUgZGVzY3JpcHRpdmUgYmV0IHN0cmluZ1xuICAgICAqXG4gICAgICogQWxsIGJldHMgYXJlIGJldHMsIGJ1dCBzb21lIHJlcXVpcmUgbW9yZSBkZXNjcmlwdGlvbiB0byBmb2xsb3cgcG9rZXJcbiAgICAgKiBjb252ZW50aW9uLiBTcGVjaWZpY2FsbHksIGEgYmV0IHdoaWNoIGp1c3QgZXF1YWxzIGFuIGV4aXN0aW5nIGJldCBpcyBhXG4gICAgICogY2FsbCwgYW5kIG9uZSB3aGljaCBpbmNyZWFzZXMgYW4gZXhpc3RpbmcgYmV0IGlzIGEgcmFpc2UuXG4gICAgICpcbiAgICAgKiBOT1RFOiBUaGlzIGZ1bmN0aW9uIG11c3QgYmUgY2FsbGVkIEJFRk9SRSB0aGUgc3RhdGUncyBgcm91bmRCZXRgIGFuZFxuICAgICAqIGByb3VuZFJhaXNlYCB2YXJpYWJsZXMgYXJlIHVwZGF0ZWQsIGFzIHRoaXMgZnVuY3Rpb24gbXVzdCBjb21wYXJlXG4gICAgICogbmV3IGJldCBkYXRhIGFnYWluc3QgdGhlIHByZXZpb3VzIHN0YXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFjdGlvbkRhdGFcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSAtIFRoZSB0ZXh0IHRvIGJlIGZsYXNoZWRcbiAgICAgKi9cbiAgICBwYXJzZUFjdGlvblRleHQoYWN0aW9uRGF0YSkge1xuICAgICAgICBsZXQgYWN0aW9uVGV4dCA9IEFjdGlvblRleHRbYWN0aW9uRGF0YS5hY3Rpb25UeXBlXTtcbiAgICAgICAgaWYgKGFjdGlvbkRhdGEuYWN0aW9uVHlwZSA9PT0gQWN0aW9uLkJFVCkge1xuICAgICAgICAgICAgaWYgKGFjdGlvbkRhdGEucGxheWVyUm91bmRCZXQgPT09IHRoaXMuZ2FtZS5yb3VuZEJldCkge1xuICAgICAgICAgICAgICAgIGFjdGlvblRleHQgPSBcIkNBTExcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uRGF0YS5wbGF5ZXJSb3VuZEJldCA+IHRoaXMuZ2FtZS5yb3VuZEJldCAmJiB0aGlzLmdhbWUucm91bmRCZXQgPiAwKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uVGV4dCA9IFwiUkFJU0VcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFjdGlvbkRhdGEucGxheWVyQmFsYW5jZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGFjdGlvblRleHQgPSBcIkFMTCBJTlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY3Rpb25UZXh0O1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIG1ha2VCdG4oeCwgeSwgdGV4dCwgdGV4dHVyZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ0biA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKHgsIHksIHRleHR1cmUsIGNhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgYnRuLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIGxldCBidG5UZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDAsIHRleHQpO1xuICAgICAgICBidG5UZXh0LmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICBidG4uYWRkQ2hpbGQoYnRuVGV4dCk7XG4gICAgICAgIGJ0bi50ZXh0ID0gYnRuVGV4dDtcblxuICAgICAgICByZXR1cm4gYnRuO1xuICAgIH1cblxuICAgIGRlYWwoKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL3RhYmxlcy8nICsgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlTmFtZSArICcvZGVhbC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgbmV3SGFuZCgpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignUE9TVCcsICcvdGFibGVzLycgKyB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVOYW1lICsgJy9uZXctaGFuZC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfTtcblxuICAgIGxlYXZlVGFibGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmxlYXZlKCk7XG4gICAgfVxuXG4gICAgYmIoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmJiKCk7XG4gICAgfTtcblxuICAgIHNiKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5zYigpO1xuICAgIH07XG5cbiAgICBnZW5lcmF0ZUJldHMocGxheWVyUm91bmRCZXQsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIFBva2VyLmdlbmVyYXRlQmV0cygyNSwgNTAsIHRoaXMuZ2FtZS5yb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1haW47XG4iXX0=
