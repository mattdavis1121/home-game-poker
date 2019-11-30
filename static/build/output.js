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

},{"./states/Boot":21,"./states/Load":22,"./states/Main":23}],2:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"../Util":4,"./Label":9}],11:[function(require,module,exports){
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

},{"../Util":4,"./Action":5,"./Button":6,"./Slider":14}],12:[function(require,module,exports){
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

},{"../classes/Action":5,"../classes/Nameplate":10,"../managers/CardManager":17,"../managers/ChipManager":18}],13:[function(require,module,exports){
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
    }]);

    return Pot;
}();

exports.default = Pot;

},{"../managers/ChipManager":18}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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
  }
}
},{}],16:[function(require,module,exports){
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

},{"../classes/Button":6}],17:[function(require,module,exports){
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

},{"../classes/Card":7}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        this.value = 0;
        this.displayGroup = this.game.add.group();
    }

    _createClass(ChipManager, [{
        key: "initialize",
        value: function initialize() {}
    }, {
        key: "getChip",
        value: function getChip() {
            var chip = this.pool.pop();
            if (!chip) {
                chip = this.game.add.sprite(0, 0, this.key);
                chip.angle = this.game.rnd.integerInRange(-180, 180); // Random rotation
                chip.anchor.setTo(0.5);
            }
            chip.revive();
            this.chips.push(chip);
            return chip;
        }
    }, {
        key: "setValue",
        value: function setValue(value) {
            if (value === this.value) {
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
                chip.frameName = this.values[valuesPtr].toString();

                if (this.stackChips) {
                    chip.y = yPos;
                    yPos -= 5;
                } else {
                    if (this.chips.length === 1) {
                        chip.x = 0;
                        chip.y = 0;
                    } else {
                        var variation = this.displayGroup.width / 2;
                        chip.x = this.game.rnd.integerInRange(-variation, variation);
                        chip.y = this.game.rnd.integerInRange(-variation, variation);
                    }
                }
                value -= this.values[valuesPtr];
                this.displayGroup.addChild(chip);
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
    }]);

    return ChipManager;
}();

exports.default = ChipManager;

},{}],19:[function(require,module,exports){
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

},{"../classes/Player":12}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{"../classes/Controller":8,"../config":15}],22:[function(require,module,exports){
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
            graphics.drawRect(0, 0, 50, 30);
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

},{}],23:[function(require,module,exports){
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
                _this3.game.pot.setAmount(0);
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
                _this3.game.pot.setAmount(data.pot);
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

},{"../Poker":2,"../SSE":3,"../classes/Action.js":5,"../classes/Panel":11,"../classes/Pot":13,"../managers/BuyInManager":16,"../managers/CardManager":17,"../managers/PlayerManager":19}]},{},[1,20])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NvbnRyb2xsZXIuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvTGFiZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvTmFtZXBsYXRlLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BhbmVsLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BsYXllci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9Qb3QuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvU2xpZGVyLmpzIiwic3RhdGljL3NyYy9jb25maWcuanNvbiIsInN0YXRpYy9zcmMvbWFuYWdlcnMvQnV5SW5NYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9DYXJkTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvQ2hpcE1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL1BsYXllck1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL3BvbHlmaWxscy9zZW5kYmVhY29uLmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvQm9vdC5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL0xvYWQuanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9NYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNLEk7OztBQUNGLG9CQUFjO0FBQUE7O0FBQUEsZ0hBQ0o7QUFDRixtQkFBTyxJQURMO0FBRUYsb0JBQVE7QUFGTixTQURJOztBQU1WLGNB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QXZCLEVBQTJCLEtBQUssSUFBTCxDQUFVLFFBQXJDLEVBQStDLGNBQS9DLEVBQStELEtBQUssSUFBTCxDQUFVLFVBQXpFLEVBQXFGLGFBQXJGLENBQVA7QUFDSDs7OztFQWpRYyxPQUFPLEs7O2tCQW9RWCxJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEJvb3QgZnJvbSBcIi4vc3RhdGVzL0Jvb3RcIjtcbmltcG9ydCBMb2FkIGZyb20gXCIuL3N0YXRlcy9Mb2FkXCI7XG5pbXBvcnQgTWFpbiBmcm9tIFwiLi9zdGF0ZXMvTWFpblwiO1xuXG5jbGFzcyBHYW1lIGV4dGVuZHMgUGhhc2VyLkdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICB3aWR0aDogMTkyMCxcbiAgICAgICAgICAgIGhlaWdodDogMTA4MFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImJvb3RcIiwgQm9vdCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImxvYWRcIiwgTG9hZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcIm1haW5cIiwgTWFpbiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJib290XCIpO1xuICAgIH1cbn1cblxubmV3IEdhbWUoKTsiLCIvKipcbiAqIEBzdW1tYXJ5IEEgdXRpbGl0eSBjbGFzcyBvZiBQb2tlci1zcGVjaWZpYyBmdW5jdGlvbmFsaXR5XG4gKi9cbmNsYXNzIFBva2VyIHtcbiAgICAvLyBUT0RPIC0gVGhpcyB1dGlsaXR5IGlzIGhpZ2hseS1zcGVjaWZpYyB0byBOTCBnYW1lcywgbWF5YmUgZXZlbiB0byBOTEhFLlxuICAgIC8vICBOZWVkIHRvIG1ha2UgaXQgbW9yZSBnZW5lcmljIGV2ZW50dWFsbHkgdG8gYWxsb3cgZm9yIG90aGVyIGdhbWVcbiAgICAvLyAgdHlwZXMuIExpbWl0IGFuZCBwb3QtbGltaXQgZ2FtZXMgd2lsbCB3b3JrIGNvbXBsZXRlbHkgZGlmZmVyZW50bHkuXG4gICAgLy8gIEFudGVzIGFyZSBhbHNvIG5vdCBzdXBwb3J0ZWQuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBHZW5lcmF0ZSBhbGwgbGVnYWwgcmFpc2VzIGZvciBwbGF5ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc21hbGxCbGluZCAtIFRoZSBzbWFsbCBibGluZCBmb3IgdGhlIGdhbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmlnQmxpbmQgLSBUaGUgYmlnIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3VuZEJldCAtIFRoZSBsZWFkaW5nIGJldCBmb3IgdGhpcyBiZXR0aW5nIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllclJvdW5kQmV0IC0gVGhlIGFtb3VudCB0aGlzIHBsYXllciBoYXMgY29udHJpYnV0ZWQgdG8gdGhlIHBvdCBzbyBmYXIgdGhpcyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmV2UmFpc2UgLSBUaGUgYW1vdW50IHRoZSBwcmV2aW91cyByYWlzZSBpbmNyZWFzZWQgdGhlIGJldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJCYWxhbmNlIC0gVGhlIGFtb3VudCB0aGUgcGxheWVyIGhhcyBhdmFpbGFibGUgdG8gYmV0XG4gICAgICogQHJldHVybnMge251bWJlcltdfSAtIFRoZSB2YWxpZCByYWlzZXNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2VuZXJhdGVSYWlzZXMoc21hbGxCbGluZCwgYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCByYWlzZSA9IFBva2VyLmdldE1pblJhaXNlKGJpZ0JsaW5kLCByb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHByZXZSYWlzZSwgcGxheWVyQmFsYW5jZSk7XG4gICAgICAgIGxldCByYWlzZXMgPSBbcmFpc2VdO1xuXG4gICAgICAgIHdoaWxlIChyYWlzZSArIHNtYWxsQmxpbmQgPD0gcGxheWVyQmFsYW5jZSkge1xuICAgICAgICAgICAgcmFpc2UgKz0gc21hbGxCbGluZDtcbiAgICAgICAgICAgIHJhaXNlcy5wdXNoKHJhaXNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyYWlzZSA8IHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgICAgIHJhaXNlcy5wdXNoKHBsYXllckJhbGFuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJhaXNlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBHZXQgdGhlIG1pbmltdW0gYWxsb3dhYmxlIGJldCBmb3IgcGxheWVyXG4gICAgICpcbiAgICAgKiBJZiBubyBiZXRzIGhhdmUgb2NjdXJyZWQgaW4gY3VycmVudCByb3VuZCwgdGhlIG1pbiBiZXQgaXMgYVxuICAgICAqIGNoZWNrIChiZXQgb2YgMCksIG90aGVyd2lzZSBpdCdzIGEgY2FsbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3VuZEJldCAtIFRoZSBsZWFkaW5nIGJldCBmb3IgdGhpcyBiZXR0aW5nIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllclJvdW5kQmV0IC0gVGhlIGFtb3VudCB0aGlzIHBsYXllciBoYXMgY29udHJpYnV0ZWQgdG8gdGhlIHBvdCBzbyBmYXIgdGhpcyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJCYWxhbmNlIC0gVGhlIGFtb3VudCB0aGUgcGxheWVyIGhhcyBhdmFpbGFibGUgdG8gYmV0XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0TWluQmV0KHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICBsZXQgbWluQmV0ID0gcm91bmRCZXQgPT09IDAgPyAwIDogcm91bmRCZXQgLSBwbGF5ZXJSb3VuZEJldDtcbiAgICAgICAgaWYgKHBsYXllckJhbGFuY2UgPCBtaW5CZXQpIHtcbiAgICAgICAgICAgIG1pbkJldCA9IHBsYXllckJhbGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pbkJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBHZXQgdGhlIG1pbmltdW0gYWxsb3dhYmxlIHJhaXNlIGZvciBwbGF5ZXJcbiAgICAgKlxuICAgICAqIE5PVEU6IEEgcmFpc2UgaGVyZSBtYXkgYWN0dWFsbHkgbWVhbiBhIGJldCBpbiBwb2tlciB0ZXJtcy4gSW4gdGhlXG4gICAgICogcGFybGFuY2Ugb2YgdGhpcyB1dGlsaXR5LCBhIHJhaXNlIGlzIGFuIGFnZ3Jlc3NpdmUgYWN0aW9uLCBvciBzb21ldGhpbmdcbiAgICAgKiB3aGljaCB3b3VsZCBmb3JjZSBvdGhlciBwbGF5ZXJzIHRvIGNvbnRyaWJ1dGUgbW9yZSB0byB0aGUgcG90IHRoYW5cbiAgICAgKiB0aGUgb3RoZXJ3aXNlIHdvdWxkIGhhdmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmlnQmxpbmQgLSBUaGUgYmlnIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3VuZEJldCAtIFRoZSBsZWFkaW5nIGJldCBmb3IgdGhpcyBiZXR0aW5nIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllclJvdW5kQmV0IC0gVGhlIGFtb3VudCB0aGlzIHBsYXllciBoYXMgY29udHJpYnV0ZWQgdG8gdGhlIHBvdCBzbyBmYXIgdGhpcyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmV2UmFpc2UgLSBUaGUgYW1vdW50IHRoZSBwcmV2aW91cyByYWlzZSBpbmNyZWFzZWQgdGhlIGJldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJCYWxhbmNlIC0gVGhlIGFtb3VudCB0aGUgcGxheWVyIGhhcyBhdmFpbGFibGUgdG8gYmV0XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0TWluUmFpc2UoYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCBtaW5SYWlzZSA9IHJvdW5kQmV0ID09PSAwID8gYmlnQmxpbmQgOiByb3VuZEJldCAtIHBsYXllclJvdW5kQmV0ICsgcHJldlJhaXNlO1xuICAgICAgICBpZiAocGxheWVyQmFsYW5jZSA8IG1pblJhaXNlKSB7XG4gICAgICAgICAgICBtaW5SYWlzZSA9IHBsYXllckJhbGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pblJhaXNlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9rZXI7IiwiY2xhc3MgU1NFIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB1cmwpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIHRoaXMuc291cmNlID0gbmV3IEV2ZW50U291cmNlKHRoaXMudXJsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZSBhZGRzIGFsbCBsaXN0ZW5lcnMgdG8gdGhpcy5zb3VyY2VcbiAgICAgKlxuICAgICAqIEkgb3JpZ2luYWxseSB3cm90ZSB0aGlzIHRvIHN1cHBvcnQgY2xpZW50IHJlY29ubmVjdHMsIGJ1dCBJIGRvbid0IG5lZWRcbiAgICAgKiB0aGF0IGFueW1vcmUuIEtlZXBpbmcgdGhlIGxpc3RlbmVyIGNvZGUganVzdCBpbiBjYXNlLlxuICAgICAqL1xuICAgIHJlQWRkQWxsTGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnM7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICB0aGlzLmFkZExpc3RlbmVyKGxpc3RlbmVyLnR5cGUsIGxpc3RlbmVyLmNhbGxiYWNrLCBsaXN0ZW5lci5jYWxsYmFja0NvbnRleHQsIC4uLmxpc3RlbmVyLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncykge1xuICAgICAgICAvLyBTdG9yZSBsaXN0ZW5lcnMgZm9yIGV2ZW50dWFsIHJlY29ubmVjdFxuICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKHtcbiAgICAgICAgICAgIFwidHlwZVwiOiB0eXBlLFxuICAgICAgICAgICAgXCJjYWxsYmFja1wiOiBjYWxsYmFjayxcbiAgICAgICAgICAgIFwiY2FsbGJhY2tDb250ZXh0XCI6IGNhbGxiYWNrQ29udGV4dCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBhcmdzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc291cmNlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncywgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNTRTsiLCJjbGFzcyBVdGlsIHtcbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZXR1cm4gYSBmb3JtYXR0ZWQgY3VycmVuY3kgc3RyaW5nIGZyb20gYW4gaW50ZWdlclxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZUN1cnJlbmN5KGludCkge1xuICAgICAgICBsZXQgdmFsID0gaW50IC8gMTAwO1xuICAgICAgICByZXR1cm4gXCIkXCIgKyB2YWwudG9GaXhlZCgyKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWw7IiwiY29uc3QgQWN0aW9uID0ge1xuICAgIEJMSU5EOiAwLFxuICAgIEZPTEQ6IDEsXG4gICAgQ0hFQ0s6IDIsXG4gICAgQkVUOiAzXG59O1xuXG5jb25zdCBBY3Rpb25UZXh0ID0ge1xuICAgIDA6IFwiQkxJTkRcIixcbiAgICAxOiBcIkZPTERcIixcbiAgICAyOiBcIkNIRUNLXCIsXG4gICAgMzogXCJCRVRcIlxufTtcblxuZXhwb3J0IHtBY3Rpb24sIEFjdGlvblRleHR9OyIsIi8qKlxuICogQSBQaGFzZXIuQnV0dG9uIHdpdGggYSBQaGFzZXIuVGV4dCBjZW50ZXJlZCBvbiB0aGUgYnV0dG9uXG4gKlxuICogVGhpcyBjbGFzcyBpcyBtZXJlbHkgYSB0aGluIHdyYXBwZXIgYXJvdW5kIFBoYXNlci5CdXR0b24gdG8gYWxsb3cgZm9yXG4gKiBlYXN5IHVzZSBvZiBhIHRleHQgbGFiZWwgb24gdGhlIGJ1dHRvbi4gVGhlIHRleHQgaXMgYSBjaGlsZCBvZiB0aGUgYnV0dG9uLFxuICogc28gaXQgbW92ZXMgd2hlbiB0aGUgYnV0dG9uIG1vdmVzLiBJdCdzIGNlbnRlcmVkIG9uIHRoZSBidXR0b24gYW5kIHNjYWxlc1xuICogYXV0b21hdGljYWxseSB0byBmaXggd2l0aGluIHRoZSBidXR0b24ncyBib3VuZHMuXG4gKlxuICogSWYgbm9uZSBvZiB0aGUgbGFiZWwgZnVuY3Rpb25hbGl0eSBpcyB1c2VkLCB0aGlzIGNsYXNzIGlzIGlkZW50aWNhbCB0b1xuICogUGhhc2VyLkJ1dHRvbi5cbiAqL1xuY2xhc3MgQnV0dG9uIGV4dGVuZHMgUGhhc2VyLkJ1dHRvbiB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwga2V5LCBjYWxsYmFjaywgY2FsbGJhY2tjb250ZXh0LCBvdmVyRnJhbWUsIG91dEZyYW1lLCBkb3duRnJhbWUsIHVwRnJhbWUpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwga2V5LCBjYWxsYmFjaywgY2FsbGJhY2tjb250ZXh0LCBvdmVyRnJhbWUsIG91dEZyYW1lLCBkb3duRnJhbWUsIHVwRnJhbWUpO1xuXG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubGFiZWxQYWRkaW5nID0gMTA7XG4gICAgICAgIHRoaXMubGFiZWxUZXh0ID0gXCJcIjtcbiAgICAgICAgdGhpcy5sYWJlbFN0eWxlID0ge307XG4gICAgICAgIHRoaXMubGFiZWwgPSBuZXcgUGhhc2VyLlRleHQodGhpcy5nYW1lLCAwLCAwLCB0aGlzLmxhYmVsVGV4dCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5sYWJlbCk7XG5cbiAgICAgICAgLy8gTXVzdCBhZGQgdG8gZ2FtZSB3b3JsZCBtYW51YWxseSBpZiBub3QgdXNpbmcgZ2FtZS5hZGQuYnV0dG9uXG4gICAgICAgIHRoaXMuZ2FtZS53b3JsZC5hZGQodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSB0ZXh0IGRpc3BsYXllZCBvbiB0aGUgYnV0dG9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBkaXNwbGF5XG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFRleHQodGV4dCwgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsVGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMudXBkYXRlTGFiZWwoZm9yY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgc3R5bGUgZm9yIHRoZSBidXR0b24gdGV4dFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZSAtIFRoZSB0ZXh0IHN0eWxlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSBkaXNwbGF5IHVwZGF0ZSBkZXNwaXRlIG9mIHRoaXMuZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRUZXh0U3R5bGUoc3R5bGUsIGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5sYWJlbFN0eWxlID0gc3R5bGU7XG4gICAgICAgIHRoaXMudXBkYXRlTGFiZWwoZm9yY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgcGFkZGluZyBiZXR3ZWVuIHRoZSB0ZXh0IGFuZCB0aGUgYnV0dG9uIHBlcmltZXRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYWRkaW5nIC0gVGhlIHBhZGRpbmcgaW4gcGl4ZWxzXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFBhZGRpbmcocGFkZGluZywgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsUGFkZGluZyA9IHBhZGRpbmc7XG4gICAgICAgIHRoaXMudXBkYXRlTGFiZWwoZm9yY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIHRoZSBidXR0b25cbiAgICAgKiBPbiBkaXNhYmxlLCBkaXNhYmxlcyBhbGwgaW5wdXQgdG8gdGhlIGJ1dHRvbiBhbmQgcmVuZGVycyBpdCBncmF5ZWRcbiAgICAgKiBvdXQuIEFsbCB1cGRhdGVzIGFyZSBkZWxheWVkIHVudGlsIHJlLWVuYWJsZSwgdW5sZXNzIGZvcmNlZC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBFbmFibGUgb3IgZGlzYWJsZSBidXR0b24/XG4gICAgICovXG4gICAgc2V0RW5hYmxlZChlbmFibGVkKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgIHRoaXMuaW5wdXRFbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgbGV0IHRpbnQgPSBlbmFibGVkID8gMHhGRkZGRkYgOiAweDgwODA4MDtcbiAgICAgICAgdGhpcy50aW50ID0gdGludDtcbiAgICAgICAgdGhpcy5sYWJlbC50aW50ID0gdGludDtcblxuICAgICAgICAvLyBVcGRhdGUgb24gcmUtZW5hYmxlXG4gICAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBVcGRhdGUgYWxsIGJ1dHRvbiBhdHRyaWJ1dGVzIHRvIGN1cnJlbnQgcHJvcGVydGllc1xuICAgICAqXG4gICAgICogSWYgdGhlIGJ1dHRvbiBpcyBkaXNhYmxlZCwgdGhpcyB3aWxsIGhhdmUgbm8gZWZmZWN0LiBUaGVcbiAgICAgKiBkZXZlbG9wZXIgbWF5IG9wdGlvbmFsbHkgY2hvb3NlIHRvIGZvcmNlIHRoZSB1cGRhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgdGhlIHVwZGF0ZT9cbiAgICAgKi9cbiAgICB1cGRhdGVMYWJlbChmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWQgfHwgZm9yY2UpIHtcbiAgICAgICAgICAgIHRoaXMubGFiZWwudGV4dCA9IHRoaXMubGFiZWxUZXh0O1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5zZXRTdHlsZSh0aGlzLmxhYmVsU3R5bGUpO1xuICAgICAgICAgICAgdGhpcy5yZVBvc0xhYmVsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTY2FsZSBsYWJlbCB0ZXh0IHRvIGZpdCBvbiBidXR0b24gYW5kIGNlbnRlclxuICAgICAqL1xuICAgIHJlUG9zTGFiZWwoKSB7XG4gICAgICAgIHRoaXMubGFiZWwuc2NhbGUuc2V0VG8oMSk7XG4gICAgICAgIGNvbnN0IHRleHRBcmVhSCA9IHRoaXMud2lkdGggLSB0aGlzLmxhYmVsUGFkZGluZyAqIDI7XG4gICAgICAgIGNvbnN0IHRleHRBcmVhViA9IHRoaXMuaGVpZ2h0IC0gdGhpcy5sYWJlbFBhZGRpbmcgKiAyO1xuICAgICAgICBpZiAodGhpcy5sYWJlbC53aWR0aCA+IHRleHRBcmVhSCB8fCB0aGlzLmxhYmVsLmhlaWdodCA+IHRleHRBcmVhVikge1xuICAgICAgICAgICAgY29uc3QgcmVkdWNlZFNjYWxlSCA9IHRleHRBcmVhSCAvIHRoaXMubGFiZWwud2lkdGg7XG4gICAgICAgICAgICBjb25zdCByZWR1Y2VkU2NhbGVWID0gdGV4dEFyZWFWIC8gdGhpcy5sYWJlbC5oZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnNjYWxlLnNldFRvKE1hdGgubWluKHJlZHVjZWRTY2FsZUgsIHJlZHVjZWRTY2FsZVYpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhYmVsLmNlbnRlclggPSB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgdGhpcy5sYWJlbC5jZW50ZXJZID0gdGhpcy5oZWlnaHQgLyAyO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBCdXR0b247IiwiY2xhc3MgQ2FyZCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgbWFuYWdlcikge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsOyAgIC8vIFN0cmluZyBJRCBvZiBjYXJkLCBlLmcuICdLaCcgb3IgJzdzJ1xuICAgICAgICB0aGlzLnNwcml0ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCBcImNhcmRzXCIpO1xuICAgICAgICB0aGlzLnNwcml0ZS5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZU5hbWUgPSB0aGlzLm5hbWUgPyB0aGlzLm5hbWUgOiBcImJhY2tcIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmQ7IiwiY2xhc3MgQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgcGxheWVySWQsIHRva2VuKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgYWNjZXNzIHRva2VuIHVzZWQgdG8gYXV0aGVudGljYXRlIG9uIEFQSSBjYWxsc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIFRoZSBGbGFzay1KV1QtRXh0ZW5kZWQgYWNjZXNzIHRva2VuXG4gICAgICovXG4gICAgc2V0VG9rZW4odG9rZW4pIHtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICAgKlxuICAgICAqIE9ubHkgZXJyb3JzIGFyZSByZXBvcnRlZC4gU3VjY2VzcyBpcyBzaWxlbnQuIEdhbWUgY2hhbmdlcyByZXN1bHRpbmdcbiAgICAgKiBmcm9tIHJlcXVlc3RzIGFyZSBoYW5kbGVkIHZpYSBTZXJ2ZXIgU2VudCBFdmVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW5kcG9pbnQgLSBUaGUgZW5kcG9pbnQgb24gdGhlIHNlcnZlciB0byBzZW5kIHJlcXVlc3QgdG9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIFRoZSBwYXlsb2FkIHRvIHNlbmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZD1cIlBPU1RdIC0gVGhlIEhUVFAgbWV0aG9kIHRvIHVzZVxuICAgICAqL1xuICAgIHNlbmRSZXF1ZXN0KGVuZHBvaW50LCBkYXRhLCBtZXRob2QgPSBcIlBPU1RcIikge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKG1ldGhvZCwgZW5kcG9pbnQpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIGxldCByZXNwID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAvLyBJbnZhbGlkIHJlcXVlc3QgZXJyb3JcbiAgICAgICAgICAgICAgICBpZiAocmVzcC5zdWNjZXNzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4ocmVzcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCAmJiB4aHIuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAvLyBGYWlsZWQgcmVxdWVzdCBlcnJvclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIHRoaXMudG9rZW4pO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhbiBhY3Rpb24gcmVxdWVzdFxuICAgICAqXG4gICAgICogVGhpcyBpcyB0aGUgbW9zdCBoZWF2aWx5LXVzZWQgcmVxdWVzdCB0eXBlIGluIHRoZSBnYW1lLiBBbGwgaW4tZ2FtZVxuICAgICAqIGFjdGlvbnMgKGJldCwgY2hlY2ssIGZvbGQpIGhhcHBlbiBoZXJlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgLSBUaGUgcGF5bG9hZCB0byBzZW5kXG4gICAgICovXG4gICAgYWN0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImFjdGlvblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGNoZWNrKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJDSEVDS1wiKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgYmV0KGFtdCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJCRVRcIiwgYW10KTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgZm9sZCgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiRk9MRFwiKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgYmIoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJMSU5EXCIsIDUwKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgc2IoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJMSU5EXCIsIDI1KTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgam9pbihzZWF0TnVtLCBidXlJbikge1xuICAgICAgICBjb25zdCBkYXRhID0ge1wicG9zaXRpb25cIjogc2VhdE51bSwgXCJhbW91bnRcIjogYnV5SW59O1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiam9pblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGxlYXZlKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJsZWF2ZVwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSBiZWFjb24gdG8gdGhlIHNlcnZlciBvbiBkaXNjb25uZWN0XG4gICAgICpcbiAgICAgKiBUaGlzIGFsbG93cyBmb3Igc2VydmVyIHRvIGtub3cgd2hlbiBhIGNsaWVudCBkaXNjb25uZWN0cyBzb1xuICAgICAqIGl0IGNhbiBjbGVhbiB1cCBhcyBuZWNlc3NhcnkuIE5vIGd1YXJhbnRlZSB0aGF0IHRoaXMgbWVzc2FnZVxuICAgICAqIHdpbGwgZ28gdGhyb3VnaCwgc28gbXVzdCBoYXZlIHJlZHVuZGFudCBtZWFzdXJlcyBpbiBwbGFjZS5cbiAgICAgKi9cbiAgICBkaXNjb25uZWN0QmVhY29uKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0IHVybCA9IFwiL2Rpc2Nvbm5lY3QvXCI7XG4gICAgICAgIG5hdmlnYXRvci5zZW5kQmVhY29uKHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgYnVpbGRQYXlsb2FkKGFjdGlvblR5cGUsIGJldEFtdCA9IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwicGxheWVySWRcIjogdGhpcy5wbGF5ZXJJZCxcbiAgICAgICAgICAgIFwiYWN0aW9uVHlwZVwiOiBhY3Rpb25UeXBlLFxuICAgICAgICAgICAgXCJiZXRBbXRcIjogYmV0QW10XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBidWlsZFVybChlbmRwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlVXJsICsgZW5kcG9pbnQgKyBcIi9cIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXI7IiwiLyoqXG4gKiBAc3VtbWFyeSBTaW1wbGUgUGhhc2VyLlRleHQgZXh0ZW5zdGlvbiB0byBzdXBwb3J0IGF1dG9tYXRpYyByZXNpemluZ1xuICpcbiAqIElmIHRleHQgYm91bmRzIGFyZSBzZXQgb24gaW5zdGFuY2VzIG9mIHRoaXMgY2xhc3MsIHRoZW4gZWFjaCB0aW1lIHRoZSB0ZXh0XG4gKiBvciBzdHlsZSBpcyBjaGFuZ2VkLCB0aGUgdGV4dCB3aWxsIGF1dG9tYXRpY2FsbHkgc2NhbGUgaXRzZWxmIGRvd24gdG8gZml0XG4gKiB3aXRoaW4gdGhvc2UgYm91bmRzIGhvcml6b250YWxseS4gVmVydGljYWwgYm91bmRzIGFyZSBpZ25vcmVkLlxuICpcbiAqIFBvc3NpYmxlIHVwZ3JhZGVzOlxuICogICAtIFNldCBtaW5pbXVtIHNjYWxlXG4gKiAgIC0gSWYgdGV4dCBzdGlsbCBvdmVyZmxvd3MgbWluIHNjYWxlLCB0aGVuIHRydW5jYXRlXG4gKi9cbmNsYXNzIExhYmVsIGV4dGVuZHMgUGhhc2VyLlRleHQge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIHRleHQsIHN0eWxlKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIHRleHQsIHN0eWxlKTtcbiAgICAgICAgdGhpcy5hbmNob3Iuc2V0VG8oMCwgMC41KTsgIC8vIENlbnRlciB2ZXJ0aWNhbGx5IHRvIGF2b2lkIGp1bXBzIG9uIHJlc2l6ZVxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIHNldFRleHQodGV4dCwgaW1tZWRpYXRlKSB7XG4gICAgICAgIHN1cGVyLnNldFRleHQodGV4dCwgaW1tZWRpYXRlKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9XG5cbiAgICBzZXRTdHlsZShzdHlsZSwgdXBkYXRlKSB7XG4gICAgICAgIHN1cGVyLnNldFN0eWxlKHN0eWxlLCB1cGRhdGUpO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJlc2l6ZSB0aGUgdGV4dCBob3Jpem9udGFsbHlcbiAgICAgKlxuICAgICAqIElmIHRleHQgZG9lcyBub3QgZml0IGhvcml6b250YWxseSBhdCBmdWxsIHNjYWxlLCB0aGVuIHNjYWxlIGRvd25cbiAgICAgKiB1bnRpbCBpdCBmaXRzLiBWZXJ0aWNhbCBvdmVyZmxvdyBpcyBpZ25vcmVkLlxuICAgICAqL1xuICAgIHJlc2l6ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRleHRCb3VuZHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjYWxlLnNldFRvKDEpO1xuICAgICAgICBpZiAodGhpcy53aWR0aCA+IHRoaXMudGV4dEJvdW5kcy53aWR0aCkge1xuICAgICAgICAgICAgdGhpcy5zY2FsZS5zZXRUbyh0aGlzLnRleHRCb3VuZHMud2lkdGggLyB0aGlzLndpZHRoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGFiZWw7IiwiaW1wb3J0IExhYmVsIGZyb20gXCIuL0xhYmVsXCI7XG5pbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuXG5jbGFzcyBOYW1lcGxhdGUgZXh0ZW5kcyBQaGFzZXIuSW1hZ2Uge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGtleSwgY29uZmlnKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSk7XG4gICAgICAgIGdhbWUud29ybGQuYWRkKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZyB8fCB0aGlzLmdhbWUuY29uZmlnLm5hbWVwbGF0ZTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7XG4gICAgICAgICAgICBuYW1lcGxhdGU6IG51bGwsXG4gICAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgICAgYmFsYW5jZTogbnVsbCxcbiAgICAgICAgICAgIGZsYXNoOiBudWxsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lID0gbmV3IExhYmVsKHRoaXMuZ2FtZSwgdGhpcy5jb25maWcubmFtZS54LCB0aGlzLmNvbmZpZy5uYW1lLnksIFwiXCIsIHRoaXMuY29uZmlnLm5hbWUuc3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS5zZXRUZXh0Qm91bmRzKDAsIDAsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggLSAyMCwgMCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5kaXNwbGF5Lm5hbWUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlID0gbmV3IExhYmVsKHRoaXMuZ2FtZSwgdGhpcy5jb25maWcuYmFsYW5jZS54LCB0aGlzLmNvbmZpZy5iYWxhbmNlLnksIFwiXCIsIHRoaXMuY29uZmlnLmJhbGFuY2Uuc3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS5zZXRUZXh0Qm91bmRzKDAsIDAsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggLSAyMCwgMCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmJhbGFuY2UpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaCA9IG5ldyBMYWJlbCh0aGlzLmdhbWUsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuY2VudGVyWCwgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5jZW50ZXJZLCBcIlwiLCB0aGlzLmNvbmZpZy5mbGFzaC5zdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC5zZXRUZXh0Qm91bmRzKDAsIDAsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggLSAyMCwgMCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmRpc3BsYXkuZmxhc2gpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEZsYXNoIHRleHQgZm9yIGR1cmF0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBkaXNwbGF5c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbZHVyYXRpb249MjAwMF0gLSBNaWxsaXNlY29uZHMgdG8gZGlzcGxheSB0ZXh0XG4gICAgICovXG4gICAgZmxhc2godGV4dCwgZHVyYXRpb24gPSAyMDAwKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2gudmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC5zZXRUZXh0KHRleHQpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoZHVyYXRpb24sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2gudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICBzZXQgbmFtZShuYW1lKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnNldFRleHQobmFtZSk7XG4gICAgfVxuXG4gICAgc2V0IGJhbGFuY2UoYmFsYW5jZSkge1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS5zZXRUZXh0KFV0aWwucGFyc2VDdXJyZW5jeShiYWxhbmNlKSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBOYW1lcGxhdGU7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4vQnV0dG9uXCI7XG5pbXBvcnQgU2xpZGVyIGZyb20gXCIuL1NsaWRlclwiO1xuaW1wb3J0IHtBY3Rpb259IGZyb20gXCIuL0FjdGlvblwiO1xuXG5jbGFzcyBQYW5lbCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJldHMgPSBbMF07XG4gICAgICAgIHRoaXMucHJpbWFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnByaW1hcnlBY3Rpb24gPSBBY3Rpb24uQkVUO1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IEFjdGlvbi5DSEVDSztcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnRlcnRpYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMudGVydGlhcnlBY3Rpb24gPSBBY3Rpb24uRk9MRDtcbiAgICAgICAgdGhpcy5zbGlkZXIgPSBuZXcgU2xpZGVyKHRoaXMuZ2FtZSwgXCJwYW5lbFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbHdheXNWaXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkgPSB0aGlzLm1ha2VCdXR0b24oMCwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5wcmltYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnByaW1hcnlBY3Rpb24sIHRoaXMucHJpbWFyeUJldCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDEzNSwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5zZWNvbmRhcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMuc2Vjb25kYXJ5QWN0aW9uLCB0aGlzLnNlY29uZGFyeUJldCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkudGVydGlhcnkgPSB0aGlzLm1ha2VCdXR0b24oMjcwLCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnRlcnRpYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnRlcnRpYXJ5QWN0aW9uLCAwKSk7XG5cbiAgICAgICAgdGhpcy5zbGlkZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuaW5kZXhDaGFuZ2VkLmFkZCgoaW5kZXgpID0+IHRoaXMuc2V0UHJpbWFyeUJldCh0aGlzLmJldHNbaW5kZXhdKSwgdGhpcyk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNsaWRlcldoZWVsLmFkZCh0aGlzLnNpbmdsZVN0ZXBCZXQsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2xpZGVyID0gdGhpcy5zbGlkZXIuYmFyO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2xpZGVyLnkgPSA2MDtcblxuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeS5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHRoaXMuc2xpZGVyLmVuYWJsZVNsaWRlcldoZWVsKHRydWUpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHRoaXMuc2xpZGVyLmVuYWJsZVNsaWRlcldoZWVsKGZhbHNlKSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5wcmltYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zZWNvbmRhcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnRlcnRpYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zbGlkZXIpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG1ha2VCdXR0b24oeCwgeSwgc2l6ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ1dHRvbiA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCB4LCB5LCB0aGlzLmtleSk7XG4gICAgICAgIGJ1dHRvbi5vbklucHV0VXAuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgYnV0dG9uLnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX292ZXJcIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX291dFwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfdXBcIlxuICAgICAgICApO1xuICAgICAgICBidXR0b24uc2V0VGV4dFN0eWxlKHRoaXMuZ2FtZS5jb25maWcucGFuZWwudGV4dFN0eWxlKTtcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICAvLyBQYW5lbCB1cGRhdGVzIHJlcXVpcmUgcGxheWVycycgY3VycmVudCBiZXRzLCBzbyBpZlxuICAgICAgICAvLyB0aGVyZSBpcyBubyBuZXh0IHBsYXllciB3ZSBzaG91bGRuJ3QgdXBkYXRlIHRoZSBkaXNwbGF5XG4gICAgICAgIGlmICghdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFjdGlvblRleHQgPSB0aGlzLmdhbWUucm91bmRCZXQgPT09IDAgPyBcIkJFVCBcIiA6IFwiUkFJU0UgVE9cXG5cIjtcbiAgICAgICAgbGV0IHByaW1hcnlUZXh0ID0gYWN0aW9uVGV4dCArIFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLnByaW1hcnlCZXQgKyB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuc2V0VGV4dChwcmltYXJ5VGV4dCk7XG5cbiAgICAgICAgbGV0IHNlY29uZGFyeVRleHQgPSBcIkNIRUNLXCI7XG4gICAgICAgIGlmICh0aGlzLnNlY29uZGFyeUFjdGlvbiAhPT0gQWN0aW9uLkNIRUNLKSB7XG4gICAgICAgICAgICBzZWNvbmRhcnlUZXh0ID0gXCJDQUxMIFwiICsgVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuc2Vjb25kYXJ5QmV0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5LnNldFRleHQoc2Vjb25kYXJ5VGV4dCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnRlcnRpYXJ5LnNldFRleHQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xuICAgIH1cblxuICAgIHNldEJldHMoYmV0cykge1xuICAgICAgICBpZiAoYmV0cy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBiZXRzLiBQYW5lbCBtdXN0IGFsd2F5cyBoYXZlIGF0IGxlYXN0IG9uZSB2YWxpZCBiZXQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iZXRzID0gYmV0cztcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0c1swXTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0TGVuZ3RoKGJldHMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoMCk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNldEVuYWJsZWQoYmV0cy5sZW5ndGggPiAxKTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc2V0UHJpbWFyeUJldChiZXQpIHtcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRTZWNvbmRhcnlCZXQoYmV0KSB7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QmV0ID0gYmV0O1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IGJldCA9PT0gMCA/IEFjdGlvbi5DSEVDSyA6IEFjdGlvbi5CRVQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEhpZGUgb3Igc2hvdyB0aGUgZW50aXJlIHBhbmVsXG4gICAgICogQHBhcmFtIHtib29sZWFufSB2aXNpYmxlXG4gICAgICovXG4gICAgc2V0VmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGUgfHwgdGhpcy5hbHdheXNWaXNpYmxlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBJbmNyZW1lbnQgb3IgZGVjcmVtZW50IHRoaXMucHJpbWFyeUJldFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLk1vdXNlLndoZWVsRGVsdGF9IG1vZGlmaWVyIC0gKzEgb3IgLTFcbiAgICAgKi9cbiAgICBzaW5nbGVTdGVwQmV0KG1vZGlmaWVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuc2xpZGVyLmluZGV4ICsgbW9kaWZpZXI7XG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDw9IHRoaXMuc2xpZGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYW5lbDsiLCJpbXBvcnQge0FjdGlvblRleHR9IGZyb20gXCIuLi9jbGFzc2VzL0FjdGlvblwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuaW1wb3J0IENoaXBNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DaGlwTWFuYWdlclwiO1xuaW1wb3J0IE5hbWVwbGF0ZSBmcm9tIFwiLi4vY2xhc3Nlcy9OYW1lcGxhdGVcIjtcblxuY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBjaGlwQ29uZmlnKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuY2hpcENvbmZpZyA9IGNoaXBDb25maWc7XG5cbiAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlcklkID0gbnVsbDtcbiAgICAgICAgdGhpcy5iYWxhbmNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5zaXR0aW5nT3V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWF0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5yb3VuZEJldCA9IDA7ICAvLyBTdW0gYmV0cyBieSBwbGF5ZXIgaW4gY3VycmVudCBiZXR0aW5nIHJvdW5kXG5cbiAgICAgICAgdGhpcy5pc0RlYWxlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzTmV4dCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzVXNlciA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7XG4gICAgICAgICAgICBuYW1lcGxhdGU6IG51bGwsXG4gICAgICAgICAgICBjYXJkczogbnVsbCxcbiAgICAgICAgICAgIGRlYWxlckJ1dHRvbjogbnVsbCxcbiAgICAgICAgICAgIGNoaXBzOiBudWxsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5jYXJkcyA9IG5ldyBDYXJkTWFuYWdlcih0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmNoaXBzID0gbmV3IENoaXBNYW5hZ2VyKHRoaXMuZ2FtZSwgXCJjaGlwc1wiLCB0aGlzLmdhbWUuY29uZmlnLmRlbm9tcyk7XG4gICAgICAgIHRoaXMubmFtZXBsYXRlID0gbmV3IE5hbWVwbGF0ZSh0aGlzLmdhbWUsIDAsIDAsIFwibmFtZXBsYXRlXCIpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoZGF0YSkge1xuICAgICAgICB0aGlzLmlkID0gZGF0YS5pZDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBkYXRhLnVzZXJJZDtcbiAgICAgICAgdGhpcy5iYWxhbmNlID0gZGF0YS5iYWxhbmNlO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBkYXRhLnNpdHRpbmdPdXQ7XG4gICAgICAgIHRoaXMuc2VhdCA9IGRhdGEuc2VhdDtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICB0aGlzLmlzVXNlciA9IGRhdGEuaXNVc2VyO1xuXG4gICAgICAgIHRoaXMuY2FyZHMuaW5pdGlhbGl6ZSgyKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZSA9IHRoaXMubmFtZXBsYXRlO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmluaXRpYWxpemVEaXNwbGF5KCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzID0gdGhpcy5jYXJkcy5kaXNwbGF5R3JvdXA7XG4gICAgICAgIHRoaXMuY2FyZHMuZGlzcGxheUdyb3VwLmFsaWduKC0xLCAxLCAodGhpcy5uYW1lcGxhdGUud2lkdGggLyB0aGlzLmNhcmRzLmxlbmd0aCkgKiAwLjUsIDApO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMuY2VudGVyWCA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuY2VudGVyWDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLmJvdHRvbSA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuYm90dG9tIC0gdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5oZWlnaHQgKiAwLjI7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbiA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwiZGVhbGVyQnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmxlZnQgPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmxlZnQgKyA1O1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmJvdHRvbSA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuYm90dG9tIC0gNTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMgPSB0aGlzLmNoaXBzLmRpc3BsYXlHcm91cDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNoaXBzLnggPSB0aGlzLmNoaXBDb25maWdbdGhpcy5zZWF0XS54O1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMueSA9IHRoaXMuY2hpcENvbmZpZ1t0aGlzLnNlYXRdLnk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuY2hpcHMuZGlzcGxheUdyb3VwKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5jYXJkcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkubmFtZXBsYXRlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24pO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUubmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5iYWxhbmNlID0gdGhpcy5iYWxhbmNlO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmZyYW1lTmFtZSA9IHRoaXMuaXNOZXh0ID8gXCJyZWRcIiA6IFwiYmFzZVwiO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLnZpc2libGUgPSB0aGlzLmlzRGVhbGVyID09PSB0cnVlO1xuICAgIH1cblxuICAgIHVwZGF0ZShkYXRhKSB7XG4gICAgICAgIC8vIFRPRE8gLSBGbGVzaCBvdXQgdGhlIHJlc3Qgb2YgdGhlIGRhdGEgLS0gZG8gSSBsaWtlIHRoaXMgbWV0aG9kP1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2UgPT09IHVuZGVmaW5lZCA/IHRoaXMuYmFsYW5jZSA6IGRhdGEuYmFsYW5jZTtcbiAgICAgICAgdGhpcy5pc0RlYWxlciA9IGRhdGEuaXNEZWFsZXIgPT09IHVuZGVmaW5lZCA/IHRoaXMuaXNEZWFsZXIgOiBkYXRhLmlzRGVhbGVyO1xuICAgICAgICB0aGlzLmlzTmV4dCA9IGRhdGEuaXNOZXh0ID09PSB1bmRlZmluZWQgPyB0aGlzLmlzTmV4dCA6IGRhdGEuaXNOZXh0O1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gZGF0YS5yb3VuZEJldCA9PT0gdW5kZWZpbmVkID8gdGhpcy5yb3VuZEJldCA6IGRhdGEucm91bmRCZXQ7XG4gICAgICAgIHRoaXMuY2hpcHMuc2V0VmFsdWUodGhpcy5yb3VuZEJldCk7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIGFjdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKHtcbiAgICAgICAgICAgIGJhbGFuY2U6IGRhdGEucGxheWVyQmFsYW5jZSxcbiAgICAgICAgICAgIHJvdW5kQmV0OiBkYXRhLnBsYXllclJvdW5kQmV0XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBhY3Rpb25UZXh0ID0gQWN0aW9uVGV4dFtkYXRhLmFjdGlvblR5cGVdO1xuXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7IiwiaW1wb3J0IENoaXBNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DaGlwTWFuYWdlclwiO1xuXG5jbGFzcyBQb3Qge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5hbW91bnQgPSAwO1xuICAgICAgICB0aGlzLnNwcml0ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuY2hpcHMgPSBuZXcgQ2hpcE1hbmFnZXIodGhpcy5nYW1lLCBcImNoaXBzXCIsIHRoaXMuZ2FtZS5jb25maWcuZGVub21zKTtcbiAgICAgICAgdGhpcy5jaGlwcy5zdGFja0NoaXBzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2hpcHMuY29sb3JVcCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuY2hpcHMuc2V0VmFsdWUodGhpcy5hbW91bnQpO1xuICAgIH1cblxuICAgIHNldEFtb3VudChhbW91bnQpIHtcbiAgICAgICAgdGhpcy5hbW91bnQgPSBhbW91bnQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG90OyIsIi8qKlxuICogQSBzbGlkZXIgVUkgZWxlbWVudFxuICpcbiAqIFJlcHJlc2VudGVkIGJ5IGEgYmFyIHNwcml0ZSBhbmQgYSBtYXJrZXIgc3ByaXRlLiBEZXNwaXRlIGhvdyBpdCBtYXlcbiAqIGxvb2ssIGFsbCBpbnB1dCBvY2N1cnMgb24gdGhlIGJhciBhbmQgdXBkYXRlcyBhcmUgbWFkZSB0byB0aGVcbiAqIG1hcmtlcidzIHBvc2l0aW9uIGJhc2VkIG9uIHRob3NlIGlucHV0cy5cbiAqL1xuY2xhc3MgU2xpZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXkpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuYmFyID0gbnVsbDsgIC8vIFRoZSBzbGlkZXIgYmFyIHNwcml0ZVxuICAgICAgICB0aGlzLm1hcmtlciA9IG51bGw7ICAvLyBUaGUgZHJhZ2dhYmxlIG1hcmtlciBzcHJpdGVcbiAgICAgICAgdGhpcy5pbmRleCA9IDA7ICAvLyBDdXJyZW50IGluZGV4IG9mIG1hcmtlclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDE7ICAvLyBUb3RhbCBudW1iZXIgb2YgaW5kaWNlc1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7fTtcbiAgICAgICAgdGhpcy5pbmRleENoYW5nZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNsaWRlcldoZWVsID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5iYXIgPSB0aGlzLmdhbWUuYWRkLmltYWdlKDAsIDAsIHRoaXMua2V5LCBcInNsaWRlcl9iYXJcIik7XG4gICAgICAgIHRoaXMuYmFyLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0RG93bi5hZGQodGhpcy5zdGFydERyYWcsIHRoaXMpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dFVwLmFkZCh0aGlzLnN0b3BEcmFnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCgoKSA9PiB0aGlzLmVuYWJsZVNsaWRlcldoZWVsKHRydWUpKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHRoaXMuZW5hYmxlU2xpZGVyV2hlZWwoZmFsc2UpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhciA9IHRoaXMuYmFyO1xuXG4gICAgICAgIHRoaXMubWFya2VyID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgdGhpcy5rZXksIFwic2xpZGVyX21hcmtlclwiKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuYW5jaG9yLnNldFRvKDAuNSwgMCk7XG4gICAgICAgIHRoaXMubWFya2VyLmJvdHRvbSA9IHRoaXMuYmFyLmJvdHRvbTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1hcmtlciA9IHRoaXMubWFya2VyO1xuICAgICAgICB0aGlzLmJhci5hZGRDaGlsZCh0aGlzLm1hcmtlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIHNsaWRlciBkcmFnZ2luZyBhbmQgaW5pdGlhdGUgZmlyc3QgZHJhZyBldmVudFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlNwcml0ZX0gYmFyIC0gVGhlIGJhciBzcHJpdGUgdGhhdCB3YXMgY2xpY2tlZFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlBvaW50ZXJ9IHBvaW50ZXIgLSBUaGUgcG9pbnRlciB3aGljaCBpbml0aWF0ZWQgdGhlIGNsaWNrXG4gICAgICovXG4gICAgc3RhcnREcmFnKGJhciwgcG9pbnRlcikge1xuICAgICAgICAvLyBJbml0aWFsIGNhbGwgdG8gdXBkYXRlRHJhZyBhbGxvd3MgY2hhbmdpbmcgYmV0IHdpdGggY2xpY2sgb24gYmFyXG4gICAgICAgIHRoaXMudXBkYXRlRHJhZyhwb2ludGVyLCBwb2ludGVyLngsIHBvaW50ZXIueSk7XG4gICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5hZGRNb3ZlQ2FsbGJhY2sodGhpcy51cGRhdGVEcmFnLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBEaXNhYmxlIHNsaWRlciBkcmFnZ2luZ1xuICAgICAqL1xuICAgIHN0b3BEcmFnKCkge1xuICAgICAgICB0aGlzLmdhbWUuaW5wdXQuZGVsZXRlTW92ZUNhbGxiYWNrKHRoaXMudXBkYXRlRHJhZywgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgQ2FsY3VsYXRlIHNsaWRlciBpbmRleCBiYXNlZCBvbiBkcmFnIGlucHV0XG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBzbGlkaW5nIHBvaW50ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgb2YgcG9pbnRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZSBvZiBwb2ludGVyXG4gICAgICovXG4gICAgdXBkYXRlRHJhZyhwb2ludGVyLCB4LCB5KSB7XG4gICAgICAgIGxldCBsb2NhbFggPSB4IC0gdGhpcy5iYXIud29ybGQueDsgIC8vIENsaWNrIHBvcyBpbiByZWxhdGlvbiB0byBiYXJcblxuICAgICAgICAvLyBQcmV2ZW50IGRyYWdnaW5nIHBhc3QgYmFyIGJvdW5kc1xuICAgICAgICBpZiAobG9jYWxYIDwgMCkge1xuICAgICAgICAgICAgbG9jYWxYID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbFggPiB0aGlzLmJhci53aWR0aCkge1xuICAgICAgICAgICAgbG9jYWxYID0gdGhpcy5iYXIud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdWJ0cmFjdCAxIGZyb20gbGVuZ3RoIGJlY2F1c2UgbGVuZ3RoIGlzIDEtaW5kZXhlZCwgaW5kaWNlcyBhcmUgMC1pbmRleGVkXG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5yb3VuZChsb2NhbFggLyB0aGlzLmJhci53aWR0aCAqICh0aGlzLmxlbmd0aCAtIDEpKTtcbiAgICAgICAgdGhpcy5zZXRJbmRleChpbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBpbmRleCBvZiB0aGUgc2xpZGVyIGFuZCByZXBvcnQgdGhlIG5ldyB2YWx1ZVxuICAgICAqXG4gICAgICogT3B0aW9uYWxseSB1cGRhdGUgdGhlIHZpc3VhbCBwb3NpdGlvbiBvZiB0aGUgbWFya2VyIG9uIHRoZSBzbGlkZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBOZXcgaW5kZXggdG8gc2V0IG9uIHNsaWRlclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VwZGF0ZVBvcz10cnVlXSAtIFVwZGF0ZSB0aGUgcG9zaXRpb24gb2YgbWFya2VyP1xuICAgICAqL1xuICAgIHNldEluZGV4KGluZGV4LCB1cGRhdGVQb3MgPSB0cnVlKSB7XG4gICAgICAgIGlmIChpbmRleCAhPT0gdGhpcy5pbmRleCkge1xuICAgICAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgdGhpcy5pbmRleENoYW5nZWQuZGlzcGF0Y2goaW5kZXgpO1xuXG4gICAgICAgICAgICBpZiAodXBkYXRlUG9zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gb25seSBvbmUgYmV0IGF2YWlsYWJsZSwgaXQncyBhIG1heCBiZXRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrZXIueCA9IHRoaXMuYmFyLndpZHRoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IDEgZnJvbSBsZW5ndGggYmVjYXVzZSBsZW5ndGggaXMgMS1pbmRleGVkLCBpbmRpY2VzIGFyZSAwLWluZGV4ZWRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrZXIueCA9IHRoaXMuYmFyLndpZHRoIC8gKHRoaXMubGVuZ3RoIC0gMSkgKiB0aGlzLmluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFVwZGF0ZSB0aGUgbGVuZ3RoIHByb3BlcnR5XG4gICAgICpcbiAgICAgKiBUaGUgbGVuZ3RoIHByb3BlcnR5IGRlc2NyaWJlcyBob3cgbWFueSBkaXNjcmV0ZSBiZXRzIHRoZSBzbGlkZXIgYmFyXG4gICAgICogbXVzdCByZXByZXNlbnQuIFRoZSBzbGlkZXIgZG9lcyBub3QgY2FyZSBhYm91dCB3aGF0IHRoZSBzcGVjaWZpYyBiZXRcbiAgICAgKiBpdCByZXByZXNlbnRzIGlzLCBvbmx5IHRoYXQgaXQgaGFzIHNvbWUgbnVtYmVyIG9mIGluZGljZXMgYWxvbmcgaXRzXG4gICAgICogbGVuZ3RoIGFuZCB0aGF0IGl0IG11c3QgcmVwb3J0IGl0cyBpbmRleCB0byBsaXN0ZW5lcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIG5ldyBsZW5ndGggdG8gc2V0XG4gICAgICovXG4gICAgc2V0TGVuZ3RoKGxlbmd0aCkge1xuICAgICAgICBpZiAobGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3Qgc2V0IHNsaWRlciBsZW5ndGggbGVzcyB0aGFuIDFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAobGVuZ3RoID4gdGhpcy5iYXIud2lkdGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IFNldHRpbmcgc2xpZGVyIHN0b3BzIGdyZWF0ZXIgdGhhbiBsZW5ndGggbWF5IHJlc3VsdCBpbiB1bmV4cGVjdGVkIGJlaGF2aW9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIHRoZSBzbGlkZXJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBJcyB0aGUgc2xpZGVyIGVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0RW5hYmxlZChlbmFibGVkKSB7XG4gICAgICAgIHRoaXMuYmFyLmlucHV0RW5hYmxlZCA9IGVuYWJsZWQ7XG5cbiAgICAgICAgbGV0IHRpbnQgPSBlbmFibGVkID8gMHhGRkZGRkYgOiAweDgwODA4MDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhci50aW50ID0gdGludDtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1hcmtlci50aW50ID0gdGludDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSBkaXNwYXRjaCBvZiBzaWduYWwgb24gd2hlZWwgc2Nyb2xsXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gSXMgdGhlIGNhbGxiYWNrIGVuYWJsZWQgb3IgZGlzYWJsZWQ/XG4gICAgICovXG4gICAgZW5hYmxlU2xpZGVyV2hlZWwoZW5hYmxlZCkge1xuICAgICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmlucHV0Lm1vdXNlLm1vdXNlV2hlZWxDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlcldoZWVsLmRpc3BhdGNoKHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS53aGVlbERlbHRhKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQubW91c2UubW91c2VXaGVlbENhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyOyIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJwYW5lbFwiOiB7XG4gICAgXCJwYWRkaW5nXCI6IDEwLFxuICAgIFwidGV4dFN0eWxlXCI6IHtcbiAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgIFwiYWxpZ25cIjogXCJjZW50ZXJcIlxuICAgIH0sXG4gICAgXCJwb3NcIjoge1xuICAgICAgXCJ4XCI6IDE0ODAsXG4gICAgICBcInlcIjogNzkwXG4gICAgfVxuICB9LFxuICBcInNlYXRzXCI6IHtcbiAgICBcIjEwXCI6IFtcbiAgICAgIHtcInhcIjogODYwLCBcInlcIjogMjAwfSxcbiAgICAgIHtcInhcIjogMTE3OCwgXCJ5XCI6IDIwMH0sXG4gICAgICB7XCJ4XCI6IDE1MjIsIFwieVwiOiAzNDJ9LFxuICAgICAge1wieFwiOiAxNTIyLCBcInlcIjogNjI2fSxcbiAgICAgIHtcInhcIjogMTE3OCwgXCJ5XCI6IDg5NH0sXG4gICAgICB7XCJ4XCI6IDg2MCwgXCJ5XCI6IDg5NH0sXG4gICAgICB7XCJ4XCI6IDU0MiwgXCJ5XCI6IDg5NH0sXG4gICAgICB7XCJ4XCI6IDE5OCwgXCJ5XCI6IDYyNn0sXG4gICAgICB7XCJ4XCI6IDE5OCwgXCJ5XCI6IDM0Mn0sXG4gICAgICB7XCJ4XCI6IDU0MiwgXCJ5XCI6IDIwMH1cbiAgICBdLFxuXG4gICAgLy8gVE9ET1xuICAgIFwiOFwiOiBbXSxcbiAgICBcIjlcIjogW11cbiAgfSxcbiAgXCJidXlJbk1vZGFsXCI6IHtcbiAgICBcInhcIjogODEwLFxuICAgIFwieVwiOiA0MzAsXG4gICAgXCJpbnB1dEJveFwiOiB7XG4gICAgICBcInhcIjogMTUsXG4gICAgICBcInlcIjogODZcbiAgICB9LFxuICAgIFwiaW5wdXRGaWVsZFwiOiB7XG4gICAgICBcInhcIjogMzAsXG4gICAgICBcInlcIjogLTJcbiAgICB9LFxuICAgIFwiY2FuY2VsQnV0dG9uXCI6IHtcbiAgICAgIFwieFwiOiAxNSxcbiAgICAgIFwieVwiOiAxNDVcbiAgICB9LFxuICAgIFwic3VibWl0QnV0dG9uXCI6IHtcbiAgICAgIFwieFwiOiAxNTUsXG4gICAgICBcInlcIjogMTQ1XG4gICAgfVxuICB9LFxuICBcImRlbm9tc1wiOiBbNSwgMjUsIDEwMCwgNTAwLCAyMDAwXSxcbiAgXCJjaGlwc1wiOiB7XG4gICAgXCIxMFwiOiBbXG4gICAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IDEyMH0sXG4gICAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IDEyMH0sXG4gICAgICB7XCJ4XCI6IC02MCwgXCJ5XCI6IDQwfSxcbiAgICAgIHtcInhcIjogLTYwLCBcInlcIjogNDB9LFxuICAgICAge1wieFwiOiAxMDAsIFwieVwiOiAtMTQwfSxcbiAgICAgIHtcInhcIjogMTAwLCBcInlcIjogLTE0MH0sXG4gICAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IC0xNDB9LFxuICAgICAge1wieFwiOiAyNDAsIFwieVwiOiA0MH0sXG4gICAgICB7XCJ4XCI6IDI0MCwgXCJ5XCI6IDQwfSxcbiAgICAgIHtcInhcIjogMTAwLCBcInlcIjogMTIwfVxuICAgIF1cbiAgfSxcbiAgXCJuYW1lcGxhdGVcIjoge1xuICAgIFwibmFtZVwiOiB7XG4gICAgICBcInhcIjogMTAsXG4gICAgICBcInlcIjogMzAsXG4gICAgICBcInN0eWxlXCI6IHtcbiAgICAgICAgXCJmb250XCI6IFwiYm9sZCAyMnB0IEFyaWFsXCIsXG4gICAgICAgIFwiZmlsbFwiOiBcIiMzMzMzMzNcIlxuICAgICAgfVxuICAgIH0sXG4gICAgXCJiYWxhbmNlXCI6IHtcbiAgICAgIFwieFwiOiAxMCxcbiAgICAgIFwieVwiOiA2MCxcbiAgICAgIFwic3R5bGVcIjoge1xuICAgICAgICBcImZvbnRcIjogXCIxNnB0IEFyaWFsXCIsXG4gICAgICAgIFwiYm91bmRzQWxpZ25IXCI6IFwicmlnaHRcIixcbiAgICAgICAgXCJmaWxsXCI6IFwiIzU1NTU1NVwiXG4gICAgICB9XG4gICAgfSxcbiAgICBcImZsYXNoXCI6IHtcbiAgICAgIFwic3R5bGVcIjoge1xuICAgICAgICBcImZvbnRcIjogXCJib2xkIDMwcHQgQXJpYWxcIixcbiAgICAgICAgXCJmaWxsXCI6IFwiIzMzMzMzM1wiXG4gICAgICB9XG4gICAgfVxuICB9XG59IiwiaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi4vY2xhc3Nlcy9CdXR0b25cIjtcblxuY2xhc3MgQnV5SW5NYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXkpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuYnV5SW5SZXF1ZXN0ZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNlYXRzID0ge307XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge1wiYnV0dG9uc1wiOiBbXSwgXCJtb2RhbFwiOiBudWxsLCBcImlucHV0Qm94XCI6IG51bGx9O1xuICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKHRoaXMuYnV0dG9uc0dyb3VwKTtcblxuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmRhdGEgPSB7XCJzZWF0TnVtXCI6IG51bGwsIFwiYnV5SW5cIjogbnVsbH07XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICBpZiAodGhpcy5kaXNwbGF5LmlucHV0RmllbGQgJiYgdGhpcy5kaXNwbGF5LmlucHV0RmllbGQudmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0RmllbGQudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbml0aWFsaXplKHNlYXRDb25maWcsIG9jY3VwaWVkU2VhdHMsIG1vZGFsQ29uZmlnKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VhdENvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGJ1dHRvbiA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCBzZWF0Q29uZmlnW2ldLngsIHNlYXRDb25maWdbaV0ueSwgdGhpcy5rZXksIHRoaXMuYnV0dG9uQ2xpY2tlZCwgdGhpcyk7XG4gICAgICAgICAgICBidXR0b24uc2VhdE51bSA9IGk7IC8vIFN0b3JlIGZvciB1c2Ugb24gY2xpY2tcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRGcmFtZXMoXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fb3ZlclwiLFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX291dFwiLFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX2Rvd25cIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl91cFwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgYnV0dG9uLnNldFRleHQoXCJCdXkgSW5cIik7XG4gICAgICAgICAgICB0aGlzLnNlYXRzW2ldID0ge1xuICAgICAgICAgICAgICAgIFwiYnV0dG9uXCI6IGJ1dHRvbixcbiAgICAgICAgICAgICAgICBcIm9jY3VwaWVkXCI6IG9jY3VwaWVkU2VhdHMuaW5kZXhPZihpKSAhPT0gLTFcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuYnV0dG9ucy5wdXNoKGJ1dHRvbik7XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cC5hZGQoYnV0dG9uKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cC52aXNpYmxlID0gdGhpcy5idXR0b25zVmlzaWJsZTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWxCYWNrZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCB0aGlzLmdhbWUudGV4dHVyZXMubW9kYWxCYWNrZ3JvdW5kKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsQmFja2dyb3VuZC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UobW9kYWxDb25maWcueCwgbW9kYWxDb25maWcueSwgdGhpcy5rZXksIFwibW9kYWxcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKHRoaXMuZGlzcGxheS5tb2RhbCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0Qm94ID0gdGhpcy5nYW1lLmFkZC5pbWFnZShtb2RhbENvbmZpZy5pbnB1dEJveC54LCBtb2RhbENvbmZpZy5pbnB1dEJveC55LCB0aGlzLmtleSwgXCJpbnB1dF9ib3hcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkuaW5wdXRCb3gpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkID0gdGhpcy5nYW1lLmFkZC5pbnB1dEZpZWxkKG1vZGFsQ29uZmlnLmlucHV0RmllbGQueCwgbW9kYWxDb25maWcuaW5wdXRGaWVsZC55LCB7XG4gICAgICAgICAgICBmb250OiAnMzJweCBBcmlhbCcsXG4gICAgICAgICAgICBmaWxsOiAnIzMzMzMzMycsXG4gICAgICAgICAgICB3aWR0aDogMjIwLFxuICAgICAgICAgICAgcGFkZGluZzogOCxcbiAgICAgICAgICAgIGJvcmRlcldpZHRoOiAwLFxuICAgICAgICAgICAgcGxhY2VIb2xkZXI6ICcyMC4wMCcsXG4gICAgICAgICAgICB0eXBlOiBQaGFzZXJJbnB1dC5JbnB1dFR5cGUubnVtYmVyLFxuICAgICAgICAgICAgZmlsbEFscGhhOiAwXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRCb3guYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmlucHV0RmllbGQpO1xuXG4gICAgICAgIGNvbnN0IGJ0blRleHRTdHlsZSA9IHtcbiAgICAgICAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgICAgICAgIFwiYWxpZ25cIjogXCJjZW50ZXJcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwgPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgbW9kYWxDb25maWcuY2FuY2VsQnV0dG9uLngsIG1vZGFsQ29uZmlnLmNhbmNlbEJ1dHRvbi55LCB0aGlzLmtleSwgdGhpcy5jYW5jZWwsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FuY2VsLnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX3NlY29uZGFyeV9vdmVyXCIsXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfb3V0XCIsXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X3VwXCJcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbC5zZXRUZXh0U3R5bGUoYnRuVGV4dFN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbC5zZXRUZXh0KFwiQ0FOQ0VMXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmNhbmNlbCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnN1Ym1pdCA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCBtb2RhbENvbmZpZy5zdWJtaXRCdXR0b24ueCwgbW9kYWxDb25maWcuc3VibWl0QnV0dG9uLnksIHRoaXMua2V5LCB0aGlzLnN1Ym1pdCwgdGhpcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0RnJhbWVzKFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9vdmVyXCIsXG4gICAgICAgICAgICBcImJ0bl9wcmltYXJ5X291dFwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9kb3duXCIsXG4gICAgICAgICAgICBcImJ0bl9wcmltYXJ5X3VwXCJcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnN1Ym1pdC5zZXRUZXh0U3R5bGUoYnRuVGV4dFN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnN1Ym1pdC5zZXRUZXh0KFwiQlVZIElOXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LnN1Ym1pdCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgbmV3UGxheWVyKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5zZWF0c1twbGF5ZXJEYXRhLnNlYXRdLm9jY3VwaWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgcGxheWVyTGVmdChwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuc2VhdHNbcGxheWVyRGF0YS5zZWF0XS5vY2N1cGllZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICBmb3IgKGxldCBzZWF0TnVtIGluIHRoaXMuc2VhdHMpIHtcbiAgICAgICAgICAgIGxldCBzZWF0ID0gdGhpcy5zZWF0c1tzZWF0TnVtXTtcbiAgICAgICAgICAgIHNlYXQuYnV0dG9uLnZpc2libGUgPSAhc2VhdC5vY2N1cGllZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJ1dHRvbnNHcm91cC52aXNpYmxlID0gdGhpcy5idXR0b25zVmlzaWJsZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLnZpc2libGUgPSB0aGlzLm1vZGFsVmlzaWJsZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsQmFja2dyb3VuZC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgfVxuXG4gICAgYnV0dG9uQ2xpY2tlZChidXR0b24pIHtcbiAgICAgICAgdGhpcy5kYXRhLnNlYXROdW0gPSBidXR0b24uc2VhdE51bTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIGNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc3VibWl0KCkge1xuICAgICAgICB0aGlzLmRhdGEuYnV5SW4gPSB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZC52YWx1ZTtcbiAgICAgICAgdGhpcy5idXlJblJlcXVlc3RlZC5kaXNwYXRjaCh0aGlzLmRhdGEuc2VhdE51bSwgdGhpcy5kYXRhLmJ1eUluKTtcbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldEJ1dHRvbnNWaXNpYmxlKHZpc2libGUpIHtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHZpc2libGU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnV5SW5NYW5hZ2VyOyIsImltcG9ydCBDYXJkIGZyb20gXCIuLi9jbGFzc2VzL0NhcmRcIjtcblxuY2xhc3MgQ2FyZE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5jYXJkcyA9IFtdO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKG51bV9jYXJkcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9jYXJkczsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2FyZCA9IG5ldyBDYXJkKHRoaXMuZ2FtZSwgdGhpcyk7XG4gICAgICAgICAgICBjYXJkLmluaXRpYWxpemUoe30pO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNhcmRzLnB1c2goY2FyZCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQoY2FyZC5zcHJpdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWxpZ24oLTEsIDEsIHRoaXMuY2FyZHNbMF0uc3ByaXRlLndpZHRoICogMS4yLCAwKTtcbiAgICB9XG5cbiAgICBzZXRDYXJkTmFtZXMobmFtZXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS5uYW1lID0gbmFtZXNbaV07XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhcmRzLmxlbmd0aDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmRNYW5hZ2VyOyIsImNsYXNzIENoaXBNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXksIHZhbHVlcykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgICAgICAgdGhpcy5zdGFja0NoaXBzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb2xvclVwID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jaGlwcyA9IFtdO1xuICAgICAgICB0aGlzLnBvb2wgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IDA7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG5cbiAgICB9XG5cbiAgICBnZXRDaGlwKCkge1xuICAgICAgICBsZXQgY2hpcCA9IHRoaXMucG9vbC5wb3AoKTtcbiAgICAgICAgaWYgKCFjaGlwKSB7XG4gICAgICAgICAgICBjaGlwID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgdGhpcy5rZXkpO1xuICAgICAgICAgICAgY2hpcC5hbmdsZSA9IHRoaXMuZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoLTE4MCwgMTgwKTsgICAvLyBSYW5kb20gcm90YXRpb25cbiAgICAgICAgICAgIGNoaXAuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIH1cbiAgICAgICAgY2hpcC5yZXZpdmUoKTtcbiAgICAgICAgdGhpcy5jaGlwcy5wdXNoKGNoaXApO1xuICAgICAgICByZXR1cm4gY2hpcDtcbiAgICB9XG5cbiAgICBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbG9yVXApIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlIC09IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB0aGlzLnZhbHVlICs9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHlQb3MgPSAwO1xuICAgICAgICBsZXQgdmFsdWVzUHRyID0gdGhpcy52YWx1ZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgd2hpbGUgKHZhbHVlID49IDI1KSB7XG4gICAgICAgICAgICB3aGlsZSAodmFsdWUgPCB0aGlzLnZhbHVlc1t2YWx1ZXNQdHJdKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzUHRyLS07XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlc1B0ciA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgY2hpcCA9IHRoaXMuZ2V0Q2hpcCgpO1xuICAgICAgICAgICAgY2hpcC5mcmFtZU5hbWUgPSB0aGlzLnZhbHVlc1t2YWx1ZXNQdHJdLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnN0YWNrQ2hpcHMpIHtcbiAgICAgICAgICAgICAgICBjaGlwLnkgPSB5UG9zO1xuICAgICAgICAgICAgICAgIHlQb3MgLT0gNTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hpcHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaXAueCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGNoaXAueSA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhcmlhdGlvbiA9IHRoaXMuZGlzcGxheUdyb3VwLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY2hpcC54ID0gdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSgtdmFyaWF0aW9uLCB2YXJpYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBjaGlwLnkgPSB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKC12YXJpYXRpb24sIHZhcmlhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgLT0gdGhpcy52YWx1ZXNbdmFsdWVzUHRyXTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKGNoaXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGxldCBjaGlwO1xuICAgICAgICB3aGlsZSAoY2hpcCA9IHRoaXMuY2hpcHMucG9wKCkpIHtcbiAgICAgICAgICAgIHRoaXMucG9vbC5wdXNoKGNoaXApO1xuICAgICAgICAgICAgY2hpcC5raWxsKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoaXBNYW5hZ2VyOyIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL2NsYXNzZXMvUGxheWVyXCI7XG5cbmNsYXNzIFBsYXllck1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVzZXJJZCwgc2VhdENvbmZpZywgY2hpcENvbmZpZykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgdGhpcy5zZWF0Q29uZmlnID0gc2VhdENvbmZpZztcbiAgICAgICAgdGhpcy5jaGlwQ29uZmlnID0gY2hpcENvbmZpZztcblxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTsgIC8vIERpcmVjdCBhY2Nlc3MgdG8gdGhlIFBsYXllciBvYmplY3RzXG4gICAgICAgIHRoaXMudXNlclBsYXllciA9IG51bGw7ICAvLyBUaGUgdXNlcidzIHBsYXllciBvYmplY3QsIGlmIGF2YWlsYWJsZVxuICAgICAgICB0aGlzLm5leHRQbGF5ZXIgPSBudWxsOyAgLy8gVGhlIHBsYXllciB0aGF0IHRoZSBnYW1lIGV4cGVjdHMgdG8gYWN0IG5leHRcblxuICAgICAgICAvLyBDb250YWlucyBhbGwgZGlzcGxheSBlbGVtZW50cyBmb3IgYWxsIHBsYXllcnMgaW4gdGhlIGdhbWVcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5uZXdQbGF5ZXIocGxheWVyRGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXdQbGF5ZXIocGxheWVyRGF0YSkge1xuICAgICAgICBsZXQgcGxheWVyID0gbmV3IFBsYXllcih0aGlzLmdhbWUsIHRoaXMuY2hpcENvbmZpZyk7XG4gICAgICAgIHBsYXllci5pbml0aWFsaXplKHBsYXllckRhdGEpO1xuICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnggPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS54O1xuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnkgPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS55O1xuXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChwbGF5ZXIuZGlzcGxheUdyb3VwKTtcblxuICAgICAgICBpZiAocGxheWVyLnVzZXJJZCA9PT0gdGhpcy51c2VySWQpIHtcbiAgICAgICAgICAgIHRoaXMudXNlclBsYXllciA9IHBsYXllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgcGxheWVyTGVmdChwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLmdldEJ5SWQocGxheWVyRGF0YS5pZCk7XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCBmaW5kIHBsYXllciBhdCB0YWJsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAuZGVzdHJveSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1tpXSA9PT0gcGxheWVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbGF5ZXIgPT09IHRoaXMudXNlclBsYXllcikge1xuICAgICAgICAgICAgdGhpcy51c2VyUGxheWVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgZ2V0QnlJZChpZCkge1xuICAgICAgICAvLyBUT0RPIC0gRG8gdGhpcyB3aXRob3V0IGl0ZXJhdGluZyAtLSBidWlsZCBtYXAgb24gaW5pdD9cbiAgICAgICAgLy8gVE9ETyAtIFNob3VsZCB0aGlzIGV2ZXIgcmV0dXJuIG51bGw/XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IGEgbGlzdCBvZiBhbGwgb2NjdXBpZWQgc2VhdHMgYXQgdGhlIHRhYmxlXG4gICAgICogQHJldHVybnMge251bWJlcltdfSAtIFRoZSBJRHMgb2Ygb2NjdXBpZWQgc2VhdHNcbiAgICAgKi9cbiAgICBnZXRPY2N1cGllZFNlYXRzKCkge1xuICAgICAgICBsZXQgb2NjdXBpZWRTZWF0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb2NjdXBpZWRTZWF0cy5wdXNoKHRoaXMucGxheWVyc1tpXS5zZWF0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2NjdXBpZWRTZWF0cztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllck1hbmFnZXI7IiwiY29uc3QgaXNTdHJpbmcgPSB2YWwgPT4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG5jb25zdCBpc0Jsb2IgPSB2YWwgPT4gdmFsIGluc3RhbmNlb2YgQmxvYjtcblxucG9seWZpbGwuY2FsbCh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6IHRoaXMgfHwge30pO1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgaWYgKGlzU3VwcG9ydGVkLmNhbGwodGhpcykpIHJldHVybjtcblxuICBpZiAoISgnbmF2aWdhdG9yJyBpbiB0aGlzKSkgdGhpcy5uYXZpZ2F0b3IgPSB7fTtcbiAgdGhpcy5uYXZpZ2F0b3Iuc2VuZEJlYWNvbiA9IHNlbmRCZWFjb24uYmluZCh0aGlzKTtcbn07XG5cbmZ1bmN0aW9uIHNlbmRCZWFjb24odXJsLCBkYXRhKSB7XG4gIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudCAmJiB0aGlzLmV2ZW50LnR5cGU7XG4gIGNvbnN0IHN5bmMgPSBldmVudCA9PT0gJ3VubG9hZCcgfHwgZXZlbnQgPT09ICdiZWZvcmV1bmxvYWQnO1xuXG4gIGNvbnN0IHhociA9ICgnWE1MSHR0cFJlcXVlc3QnIGluIHRoaXMpID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcbiAgeGhyLm9wZW4oJ1BPU1QnLCB1cmwsICFzeW5jKTtcbiAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnKi8qJyk7XG5cblxuICBpZiAoaXNTdHJpbmcoZGF0YSkpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSAndGV4dC9wbGFpbic7XG4gIH0gZWxzZSBpZiAoaXNCbG9iKGRhdGEpICYmIGRhdGEudHlwZSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCBkYXRhLnR5cGUpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICB4aHIuc2VuZChkYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gIHJldHVybiAoJ25hdmlnYXRvcicgaW4gdGhpcykgJiYgKCdzZW5kQmVhY29uJyBpbiB0aGlzLm5hdmlnYXRvcik7XG59IiwiaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgQ29udHJvbGxlciBmcm9tIFwiLi4vY2xhc3Nlcy9Db250cm9sbGVyXCI7XG5cbmNsYXNzIEJvb3QgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbml0aWFsRGF0YSA9IHRoaXMuYXVnbWVudEluaXRpYWxEYXRhKGluaXRpYWxEYXRhKTtcbiAgICAgICAgdGhpcy5nYW1lLmNvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICAvLyBUT0RPIC0gVGhpcyBzaG91bGQgY29tZSBmcm9tIHNvbWV3aGVyZSBkeW5hbWljXG4gICAgICAgIHRoaXMuZ2FtZS5ydWxlcyA9IHtcbiAgICAgICAgICAgIGFudGU6IDAsXG4gICAgICAgICAgICBibGluZHM6IHtcbiAgICAgICAgICAgICAgICBzbWFsbDogMjUsXG4gICAgICAgICAgICAgICAgYmlnOiA1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcklkLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudG9rZW4pO1xuXG4gICAgICAgIGlmICh0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkKSB7XG4gICAgICAgICAgICB3aW5kb3cuZ2FtZSA9IHRoaXMuZ2FtZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibG9hZFwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAU3VtbWFyeSBDYWxjdWxhdGUgYWRkaXRpb25hbCB2YWx1ZXMgdG8gc3RvcmUgb24gZ2FtZS5pbml0aWFsRGF0YVxuICAgICAqXG4gICAgICogVG8gc2F2ZSBvbiBzZXJ2ZXItc2lkZSBwcm9jZXNzaW5nIGFuZCBkYXRhLXRyYW5zZmVyIGxvYWQsIHRoaXNcbiAgICAgKiBtZXRob2QgaXMgYSBwbGFjZSB0byBnZW5lcmF0ZSBhZGRpdGlvbmFsIGRhdGEgbmVlZGVkIGJ5IHRoZSBnYW1lXG4gICAgICogd2hpY2ggbWF5IGJlIGRlcml2ZWQgZnJvbSB0aGUgZGF0YSBzZW50IGZyb20gdGhlIGJhY2sgZW5kLlxuICAgICAqL1xuICAgIGF1Z21lbnRJbml0aWFsRGF0YShpbml0aWFsRGF0YSkge1xuICAgICAgICBpbml0aWFsRGF0YS5vY2N1cGllZFNlYXRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5pdGlhbERhdGEucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaW5pdGlhbERhdGEub2NjdXBpZWRTZWF0cy5wdXNoKGluaXRpYWxEYXRhLnBsYXllcnNbaV0uc2VhdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5pdGlhbERhdGE7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb290OyIsImNsYXNzIExvYWQgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIHByZWxvYWQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwiYmFja2dyb3VuZFwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2JhY2tncm91bmQucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcImRlYWxlckJ1dHRvblwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2RlYWxlcmJ1dHRvbi5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwicmVkQ2lyY2xlXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcmVkY2lyY2xlLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImNhcmRzXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcInBhbmVsXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcGFuZWwucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcGFuZWwuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImJ1eUluXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV5aW4ucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV5aW4uanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImNoaXBzXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2hpcHMucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2hpcHMuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcIm5hbWVwbGF0ZVwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL25hbWVwbGF0ZS5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9uYW1lcGxhdGUuanNvblwiKTtcblxuICAgICAgICB0aGlzLmdhbWUudGV4dHVyZXMgPSB0aGlzLmNyZWF0ZUN1c3RvbVRleHR1cmVzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkUGx1Z2lucygpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibWFpblwiKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDdXN0b21UZXh0dXJlcygpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0ge307XG5cbiAgICAgICAgbGV0IGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoNCwgMHgwMDAwMDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgxMDAsIDEwMCwgMTAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlU3F1YXJlXCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgMzAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlUmVjdFwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweDAwMDAwMCwgMC41KTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgdGhpcy5nYW1lLndpZHRoLCB0aGlzLmdhbWUuaGVpZ2h0KTtcbiAgICAgICAgdGV4dHVyZXNbXCJtb2RhbEJhY2tncm91bmRcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHgwMDAwMDAsIDAuNSk7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIDUwLCAzMCk7XG4gICAgICAgIHRleHR1cmVzW1widGV4dFVuZGVybGF5XCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICByZXR1cm4gdGV4dHVyZXM7XG4gICAgfVxuXG4gICAgbG9hZFBsdWdpbnMoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5hZGQucGx1Z2luKFBoYXNlcklucHV0LlBsdWdpbik7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkOyIsImltcG9ydCB7QWN0aW9uLCBBY3Rpb25UZXh0fSBmcm9tIFwiLi4vY2xhc3Nlcy9BY3Rpb24uanNcIjtcbmltcG9ydCBCdXlJbk1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0J1eUluTWFuYWdlclwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuaW1wb3J0IFBhbmVsIGZyb20gXCIuLi9jbGFzc2VzL1BhbmVsXCI7XG5pbXBvcnQgUGxheWVyTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvUGxheWVyTWFuYWdlclwiO1xuaW1wb3J0IFBvdCBmcm9tIFwiLi4vY2xhc3Nlcy9Qb3RcIjtcbmltcG9ydCBQb2tlciBmcm9tIFwiLi4vUG9rZXJcIjtcbmltcG9ydCBTU0UgZnJvbSBcIi4uL1NTRVwiO1xuXG5jbGFzcyBNYWluIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLnRhYmxlX3NzZSA9IG5ldyBTU0UodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVTU0VVcmwpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlID0gbmV3IFNTRSh0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VyU1NFVXJsKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInVubG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5kaXNjb25uZWN0QmVhY29uKCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgXCJiYWNrZ3JvdW5kXCIpO1xuICAgICAgICB0aGlzLm5ld0hhbmRCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAxMDAsIFwibmV3XFxuaGFuZFwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMubmV3SGFuZCk7XG4gICAgICAgIHRoaXMuZGVhbEJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDIyMCwgXCJkZWFsXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5kZWFsKTtcbiAgICAgICAgdGhpcy5sZWF2ZUJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDM0MCwgXCJsZWF2ZVwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMubGVhdmVUYWJsZSk7XG4gICAgICAgIHRoaXMuYmJCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCA0NjAsIFwiQkJcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmJiKTtcbiAgICAgICAgdGhpcy5zYkJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDU4MCwgXCJTQlwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuc2IpO1xuXG4gICAgICAgIGNvbnN0IG51bVNlYXRzID0gMTA7ICAgIC8vIFRPRE8gLSBNYWtlIGR5bmFtaWNcbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMgPSBuZXcgUGxheWVyTWFuYWdlcih0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VySWQsIHRoaXMuZ2FtZS5jb25maWcuc2VhdHNbbnVtU2VhdHNdLCB0aGlzLmdhbWUuY29uZmlnLmNoaXBzW251bVNlYXRzXSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmluaXRpYWxpemUodGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcnMsIHRoaXMuZ2FtZS5jb25maWcuc2VhdHNbbnVtU2VhdHNdKTtcblxuICAgICAgICB0aGlzLmdhbWUuYm9hcmQgPSBuZXcgQ2FyZE1hbmFnZXIodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmluaXRpYWxpemUoNSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmNlbnRlclkgPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWTtcblxuICAgICAgICB0aGlzLmdhbWUucG90ID0gbmV3IFBvdCh0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmdhbWUucG90LmNoaXBzLmRpc3BsYXlHcm91cC5jZW50ZXJYID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclg7ICAgICAvLyBUT0RPIC0gUG9zaXRpb25zIGluIGNvbmZpZ1xuICAgICAgICB0aGlzLmdhbWUucG90LmNoaXBzLmRpc3BsYXlHcm91cC5jZW50ZXJZID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclkgLSAxNDA7XG5cbiAgICAgICAgLy8gVE9ETyAtIFRoZXNlIHNob3VsZCBnbyBzb21ld2hlcmUgZWxzZS4gTWF5YmUgaW4gUG90P1xuICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsID0gbmV3IFBhbmVsKHRoaXMuZ2FtZSwgXCJwYW5lbFwiKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmRpc3BsYXlHcm91cC54ID0gdGhpcy5nYW1lLmNvbmZpZy5wYW5lbC5wb3MueDtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmRpc3BsYXlHcm91cC55ID0gdGhpcy5nYW1lLmNvbmZpZy5wYW5lbC5wb3MueTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmFsd2F5c1Zpc2libGUgPSB0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbiA9IG5ldyBCdXlJbk1hbmFnZXIodGhpcy5nYW1lLCBcImJ1eUluXCIpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uaW5pdGlhbGl6ZSh0aGlzLmdhbWUuY29uZmlnLnNlYXRzW251bVNlYXRzXSwgdGhpcy5nYW1lLnBsYXllcnMuZ2V0T2NjdXBpZWRTZWF0cygpLCB0aGlzLmdhbWUuY29uZmlnLmJ1eUluTW9kYWwpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uc2V0QnV0dG9uc1Zpc2libGUodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllciA9PT0gbnVsbCk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVycygpO1xuXG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwibmV3SGFuZFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld0hhbmQ6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gMDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wb3Quc2V0QW1vdW50KDApO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnBsYXllcnMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzW2ldO1xuICAgICAgICAgICAgICAgIHBsYXllci5jYXJkcy5yZXNldCgpO1xuICAgICAgICAgICAgICAgIHBsYXllci51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBpc0RlYWxlcjogcGxheWVyLmlkID09PSBkYXRhLmRlYWxlcixcbiAgICAgICAgICAgICAgICAgICAgaXNOZXh0OiBwbGF5ZXIuaWQgPT09IGRhdGEubmV4dCxcbiAgICAgICAgICAgICAgICAgICAgcm91bmRCZXQ6IDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRCZXRzKFBva2VyLmdlbmVyYXRlUmFpc2VzKHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuc21hbGwsIHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuYmlnLCB0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlCZXQoMCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0VmlzaWJsZSh0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID09PSB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiZGVhbFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlYWw6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KFBva2VyLmdldE1pbkJldCh0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5nYW1lLmluaXRpYWxEYXRhLmVtdWxhdG9yRW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJlbXVsYXRlRGVhbFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZW11bGF0ZURlYWw6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBsYXllckRhdGEgPSBkYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKHBsYXllckRhdGEucGxheWVySWQpLmNhcmRzLnNldENhcmROYW1lcyhwbGF5ZXJEYXRhLmhvbGRpbmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1JvdW5kXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3Um91bmQ6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzW2ldLnVwZGF0ZSh7cm91bmRCZXQ6IDB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRCZXRzKFBva2VyLmdlbmVyYXRlUmFpc2VzKHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuc21hbGwsIHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuYmlnLCB0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlCZXQoMCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImFjdGlvblwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImFjdGlvbjogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJvYXJkLnNldENhcmROYW1lcyhkYXRhLmJvYXJkKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEucGxheWVySWQpLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgYmFsYW5jZTogZGF0YS5wbGF5ZXJCYWxhbmNlLFxuICAgICAgICAgICAgICAgIGlzTmV4dDogZmFsc2UsXG4gICAgICAgICAgICAgICAgcm91bmRCZXQ6IGRhdGEucGxheWVyUm91bmRCZXRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLnBsYXllcklkKS5uYW1lcGxhdGUuZmxhc2godGhpcy5wYXJzZUFjdGlvblRleHQoZGF0YSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpLnVwZGF0ZSh7aXNOZXh0OiB0cnVlfSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucG90LnNldEFtb3VudChkYXRhLnBvdCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSBkYXRhLnJvdW5kQmV0O1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSBkYXRhLnJvdW5kUmFpc2U7XG5cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRCZXRzKFBva2VyLmdlbmVyYXRlUmFpc2VzKHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuc21hbGwsIHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuYmlnLCB0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlCZXQoUG9rZXIuZ2V0TWluQmV0KHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0VmlzaWJsZSh0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID09PSB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiaGFuZENvbXBsZXRlXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGFuZENvbXBsZXRlOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEud2lubmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCB3aW5uZXIgPSBkYXRhLndpbm5lcnNbaV07XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZCh3aW5uZXIuaWQpLnVwZGF0ZSh7YmFsYW5jZTogd2lubmVyLmJhbGFuY2V9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wb3QuY2hpcHMuY2xlYXIoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnBsYXllcnMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV0uY2hpcHMuY2xlYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwibmV3UGxheWVyXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdQbGF5ZXI6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5ld1BsYXllcihkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5idXlJbi5uZXdQbGF5ZXIoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4uc2V0QnV0dG9uc1Zpc2libGUodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllciA9PT0gbnVsbCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcInBsYXllckxlZnRcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInBsYXllckxlZnQ6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllckxlZnQoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4ucGxheWVyTGVmdChkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5idXlJbi5zZXRCdXR0b25zVmlzaWJsZSh0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyID09PSBudWxsKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMudXNlcl9zc2UuYWRkTGlzdGVuZXIoXCJkZWFsXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWFsOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyLmNhcmRzLnNldENhcmROYW1lcyhkYXRhLmhvbGRpbmdzKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5wcmltYXJ5Q2xpY2tlZC5hZGQodGhpcy5oYW5kbGVBY3Rpb24sIHRoaXMpO1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2Vjb25kYXJ5Q2xpY2tlZC5hZGQodGhpcy5oYW5kbGVBY3Rpb24sIHRoaXMpO1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwudGVydGlhcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbi5idXlJblJlcXVlc3RlZC5hZGQodGhpcy5nYW1lLmNvbnRyb2xsZXIuam9pbiwgdGhpcy5nYW1lLmNvbnRyb2xsZXIpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgUm91dGUgYWN0aW9ucyB0byBjb250cm9sbGVyIHJlcXVlc3RzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFjdGlvbiAtIFRoZSBhY3Rpb24gdG8gYmUgcmVxdWVzdGVkLCBkZWZpbmVkIGluIEFjdGlvbi5qc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiZXQgLSBUaGUgYmV0IChpZiBhbnkpIHRvIGJlIHNlbnQgdG8gdGhlIGNvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBoYW5kbGVBY3Rpb24oYWN0aW9uLCBiZXQpIHtcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uLkZPTEQ6XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuZm9sZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uQ0hFQ0s6XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuY2hlY2soKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uLkJFVDpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5iZXQoYmV0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiSW52YWxpZCBBY3Rpb24gVHlwZTogXCIgKyBhY3Rpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVHJhbnNmb3JtIGFjdGlvbiBkYXRhIGludG8gbW9yZSBkZXNjcmlwdGl2ZSBiZXQgc3RyaW5nXG4gICAgICpcbiAgICAgKiBBbGwgYmV0cyBhcmUgYmV0cywgYnV0IHNvbWUgcmVxdWlyZSBtb3JlIGRlc2NyaXB0aW9uIHRvIGZvbGxvdyBwb2tlclxuICAgICAqIGNvbnZlbnRpb24uIFNwZWNpZmljYWxseSwgYSBiZXQgd2hpY2gganVzdCBlcXVhbHMgYW4gZXhpc3RpbmcgYmV0IGlzIGFcbiAgICAgKiBjYWxsLCBhbmQgb25lIHdoaWNoIGluY3JlYXNlcyBhbiBleGlzdGluZyBiZXQgaXMgYSByYWlzZS5cbiAgICAgKlxuICAgICAqIE5PVEU6IFRoaXMgZnVuY3Rpb24gbXVzdCBiZSBjYWxsZWQgQkVGT1JFIHRoZSBzdGF0ZSdzIGByb3VuZEJldGAgYW5kXG4gICAgICogYHJvdW5kUmFpc2VgIHZhcmlhYmxlcyBhcmUgdXBkYXRlZCwgYXMgdGhpcyBmdW5jdGlvbiBtdXN0IGNvbXBhcmVcbiAgICAgKiBuZXcgYmV0IGRhdGEgYWdhaW5zdCB0aGUgcHJldmlvdXMgc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYWN0aW9uRGF0YVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IC0gVGhlIHRleHQgdG8gYmUgZmxhc2hlZFxuICAgICAqL1xuICAgIHBhcnNlQWN0aW9uVGV4dChhY3Rpb25EYXRhKSB7XG4gICAgICAgIGxldCBhY3Rpb25UZXh0ID0gQWN0aW9uVGV4dFthY3Rpb25EYXRhLmFjdGlvblR5cGVdO1xuICAgICAgICBpZiAoYWN0aW9uRGF0YS5hY3Rpb25UeXBlID09PSBBY3Rpb24uQkVUKSB7XG4gICAgICAgICAgICBpZiAoYWN0aW9uRGF0YS5wbGF5ZXJSb3VuZEJldCA9PT0gdGhpcy5nYW1lLnJvdW5kQmV0KSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uVGV4dCA9IFwiQ0FMTFwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb25EYXRhLnBsYXllclJvdW5kQmV0ID4gdGhpcy5nYW1lLnJvdW5kQmV0ICYmIHRoaXMuZ2FtZS5yb3VuZEJldCA+IDApIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25UZXh0ID0gXCJSQUlTRVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWN0aW9uRGF0YS5wbGF5ZXJCYWxhbmNlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uVGV4dCA9IFwiQUxMIElOXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjdGlvblRleHQ7XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4udXBkYXRlKCk7XG4gICAgfVxuXG4gICAgbWFrZUJ0bih4LCB5LCB0ZXh0LCB0ZXh0dXJlLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYnRuID0gdGhpcy5nYW1lLmFkZC5idXR0b24oeCwgeSwgdGV4dHVyZSwgY2FsbGJhY2ssIHRoaXMpO1xuICAgICAgICBidG4uYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgbGV0IGJ0blRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMCwgdGV4dCk7XG4gICAgICAgIGJ0blRleHQuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIGJ0bi5hZGRDaGlsZChidG5UZXh0KTtcbiAgICAgICAgYnRuLnRleHQgPSBidG5UZXh0O1xuXG4gICAgICAgIHJldHVybiBidG47XG4gICAgfVxuXG4gICAgZGVhbCgpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignUE9TVCcsICcvdGFibGVzLycgKyB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVOYW1lICsgJy9kZWFsLycpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdGFibGVOYW1lOiBpbml0aWFsRGF0YS50YWJsZU5hbWUsXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBuZXdIYW5kKCkge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy90YWJsZXMvJyArIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZU5hbWUgKyAnL25ldy1oYW5kLycpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdGFibGVOYW1lOiBpbml0aWFsRGF0YS50YWJsZU5hbWUsXG4gICAgICAgIH0pKTtcbiAgICB9O1xuXG4gICAgbGVhdmVUYWJsZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIubGVhdmUoKTtcbiAgICB9XG5cbiAgICBiYigpIHtcbiAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuYmIoKTtcbiAgICB9O1xuXG4gICAgc2IoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLnNiKCk7XG4gICAgfTtcblxuICAgIGdlbmVyYXRlQmV0cyhwbGF5ZXJSb3VuZEJldCwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICByZXR1cm4gUG9rZXIuZ2VuZXJhdGVCZXRzKDI1LCA1MCwgdGhpcy5nYW1lLnJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHBsYXllckJhbGFuY2UpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWFpbjsiXX0=
