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

exports.default = Action;

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
            "nameplate": null,
            "name": null,
            "balance": null
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
        }

        /**
         * @summary Flash text
         */

    }, {
        key: "flash",
        value: function flash() {}
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

var _Action2 = _interopRequireDefault(_Action);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Panel = function () {
    function Panel(game, key) {
        _classCallCheck(this, Panel);

        this.game = game;
        this.key = key;
        this.bets = [0];
        this.primaryClicked = new Phaser.Signal();
        this.primaryAction = _Action2.default.BET;
        this.primaryBet = 0;
        this.secondaryClicked = new Phaser.Signal();
        this.secondaryAction = _Action2.default.CHECK;
        this.secondaryBet = 0;
        this.tertiaryClicked = new Phaser.Signal();
        this.tertiaryAction = _Action2.default.FOLD;
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
            if (this.secondaryAction !== _Action2.default.CHECK) {
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
            this.secondaryAction = bet === 0 ? _Action2.default.CHECK : _Action2.default.BET;
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

var _Util = require("../Util");

var _Util2 = _interopRequireDefault(_Util);

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
            nextIndicator: null,
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
            this.displayGroup.add(this.display.nameplate);

            this.display.cards = this.cards.displayGroup;
            this.display.cards.centerX = 0;
            this.display.cards.centerY = -120;
            this.displayGroup.add(this.display.cards);

            this.display.dealerButton = this.game.add.sprite(0, 0, "dealerButton");
            this.display.dealerButton.left = this.display.nameplate.left + 5;
            this.display.dealerButton.bottom = this.display.nameplate.bottom - 5;
            this.displayGroup.add(this.display.dealerButton);

            this.display.nextIndicator = this.game.add.sprite(0, 0, "redCircle");
            this.display.nextIndicator.right = this.display.nameplate.right - 5;
            this.display.nextIndicator.bottom = this.display.nameplate.bottom - 5;
            this.displayGroup.add(this.display.nextIndicator);

            this.display.chips = this.chips.displayGroup;
            this.display.chips.x = this.chipConfig[this.seat].x;
            this.display.chips.y = this.chipConfig[this.seat].y;
            this.displayGroup.addChild(this.chips.displayGroup);

            this.updateDisplay();
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            this.display.nameplate.name = this.name;
            this.display.nameplate.balance = this.balance;
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
            this.roundBet = data.roundBet === undefined ? this.roundBet : data.roundBet;
            this.chips.setValue(this.roundBet);
            this.updateDisplay();
        }
    }]);

    return Player;
}();

exports.default = Player;

},{"../Util":4,"../classes/Nameplate":10,"../managers/CardManager":17,"../managers/ChipManager":18}],13:[function(require,module,exports){
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
      {"x": 910, "y": 230},
      {"x": 1244, "y": 230},
      {"x": 1484, "y": 346},
      {"x": 1484, "y": 642},
      {"x": 1244, "y": 758},
      {"x": 910, "y": 758},
      {"x": 576, "y": 758},
      {"x": 342, "y": 642},
      {"x": 342, "y": 346},
      {"x": 576, "y": 230}
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
      {"x": 0, "y": 94},
      {"x": -34, "y": 100},
      {"x": -126, "y": 90},
      {"x": -126, "y": 38},
      {"x": 124, "y": 78},
      {"x": 132, "y": 76},
      {"x": 128, "y": 72},
      {"x": 131, "y": 76},
      {"x": 174, "y": 74},
      {"x": 14, "y": 98}
    ]
  },
  "nameplate": {
    "name": {
      "x": 10,
      "y": 30,
      "style": {
        "font": "bold 22pt Arial"
      }
    },
    "balance": {
      "x": 10,
      "y": 60,
      "style": {
        "font": "16pt Arial",
        "boundsAlignH": "right"
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

var _Action2 = _interopRequireDefault(_Action);

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
                case _Action2.default.FOLD:
                    this.game.controller.fold();
                    break;
                case _Action2.default.CHECK:
                    this.game.controller.check();
                    break;
                case _Action2.default.BET:
                    this.game.controller.bet(bet);
                    break;
                default:
                    console.warn("Invalid Action Type: " + action);
            }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NvbnRyb2xsZXIuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvTGFiZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvTmFtZXBsYXRlLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BhbmVsLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BsYXllci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9Qb3QuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvU2xpZGVyLmpzIiwic3RhdGljL3NyYy9jb25maWcuanNvbiIsInN0YXRpYy9zcmMvbWFuYWdlcnMvQnV5SW5NYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9DYXJkTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvQ2hpcE1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL1BsYXllck1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL3BvbHlmaWxscy9zZW5kYmVhY29uLmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvQm9vdC5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL0xvYWQuanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9NYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNLEk7OztBQUNGLG9CQUFjO0FBQUE7O0FBQUEsZ0hBQ0o7QUFDRixtQkFBTyxJQURMO0FBRUYsb0JBQVE7QUFGTixTQURJOztBQU1WLGNB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YyxPQUFPLEs7O2tCQXFPWCxJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEJvb3QgZnJvbSBcIi4vc3RhdGVzL0Jvb3RcIjtcbmltcG9ydCBMb2FkIGZyb20gXCIuL3N0YXRlcy9Mb2FkXCI7XG5pbXBvcnQgTWFpbiBmcm9tIFwiLi9zdGF0ZXMvTWFpblwiO1xuXG5jbGFzcyBHYW1lIGV4dGVuZHMgUGhhc2VyLkdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICB3aWR0aDogMTkyMCxcbiAgICAgICAgICAgIGhlaWdodDogMTA4MFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImJvb3RcIiwgQm9vdCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImxvYWRcIiwgTG9hZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcIm1haW5cIiwgTWFpbiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJib290XCIpO1xuICAgIH1cbn1cblxubmV3IEdhbWUoKTsiLCIvKipcbiAqIEBzdW1tYXJ5IEEgdXRpbGl0eSBjbGFzcyBvZiBQb2tlci1zcGVjaWZpYyBmdW5jdGlvbmFsaXR5XG4gKi9cbmNsYXNzIFBva2VyIHtcbiAgICAvLyBUT0RPIC0gVGhpcyB1dGlsaXR5IGlzIGhpZ2hseS1zcGVjaWZpYyB0byBOTCBnYW1lcywgbWF5YmUgZXZlbiB0byBOTEhFLlxuICAgIC8vICBOZWVkIHRvIG1ha2UgaXQgbW9yZSBnZW5lcmljIGV2ZW50dWFsbHkgdG8gYWxsb3cgZm9yIG90aGVyIGdhbWVcbiAgICAvLyAgdHlwZXMuIExpbWl0IGFuZCBwb3QtbGltaXQgZ2FtZXMgd2lsbCB3b3JrIGNvbXBsZXRlbHkgZGlmZmVyZW50bHkuXG4gICAgLy8gIEFudGVzIGFyZSBhbHNvIG5vdCBzdXBwb3J0ZWQuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBHZW5lcmF0ZSBhbGwgbGVnYWwgcmFpc2VzIGZvciBwbGF5ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc21hbGxCbGluZCAtIFRoZSBzbWFsbCBibGluZCBmb3IgdGhlIGdhbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmlnQmxpbmQgLSBUaGUgYmlnIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3VuZEJldCAtIFRoZSBsZWFkaW5nIGJldCBmb3IgdGhpcyBiZXR0aW5nIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllclJvdW5kQmV0IC0gVGhlIGFtb3VudCB0aGlzIHBsYXllciBoYXMgY29udHJpYnV0ZWQgdG8gdGhlIHBvdCBzbyBmYXIgdGhpcyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmV2UmFpc2UgLSBUaGUgYW1vdW50IHRoZSBwcmV2aW91cyByYWlzZSBpbmNyZWFzZWQgdGhlIGJldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJCYWxhbmNlIC0gVGhlIGFtb3VudCB0aGUgcGxheWVyIGhhcyBhdmFpbGFibGUgdG8gYmV0XG4gICAgICogQHJldHVybnMge251bWJlcltdfSAtIFRoZSB2YWxpZCByYWlzZXNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2VuZXJhdGVSYWlzZXMoc21hbGxCbGluZCwgYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCByYWlzZSA9IFBva2VyLmdldE1pblJhaXNlKGJpZ0JsaW5kLCByb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHByZXZSYWlzZSwgcGxheWVyQmFsYW5jZSk7XG4gICAgICAgIGxldCByYWlzZXMgPSBbcmFpc2VdO1xuXG4gICAgICAgIHdoaWxlIChyYWlzZSArIHNtYWxsQmxpbmQgPD0gcGxheWVyQmFsYW5jZSkge1xuICAgICAgICAgICAgcmFpc2UgKz0gc21hbGxCbGluZDtcbiAgICAgICAgICAgIHJhaXNlcy5wdXNoKHJhaXNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyYWlzZSA8IHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgICAgIHJhaXNlcy5wdXNoKHBsYXllckJhbGFuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJhaXNlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBHZXQgdGhlIG1pbmltdW0gYWxsb3dhYmxlIGJldCBmb3IgcGxheWVyXG4gICAgICpcbiAgICAgKiBJZiBubyBiZXRzIGhhdmUgb2NjdXJyZWQgaW4gY3VycmVudCByb3VuZCwgdGhlIG1pbiBiZXQgaXMgYVxuICAgICAqIGNoZWNrIChiZXQgb2YgMCksIG90aGVyd2lzZSBpdCdzIGEgY2FsbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3VuZEJldCAtIFRoZSBsZWFkaW5nIGJldCBmb3IgdGhpcyBiZXR0aW5nIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllclJvdW5kQmV0IC0gVGhlIGFtb3VudCB0aGlzIHBsYXllciBoYXMgY29udHJpYnV0ZWQgdG8gdGhlIHBvdCBzbyBmYXIgdGhpcyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJCYWxhbmNlIC0gVGhlIGFtb3VudCB0aGUgcGxheWVyIGhhcyBhdmFpbGFibGUgdG8gYmV0XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0TWluQmV0KHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICBsZXQgbWluQmV0ID0gcm91bmRCZXQgPT09IDAgPyAwIDogcm91bmRCZXQgLSBwbGF5ZXJSb3VuZEJldDtcbiAgICAgICAgaWYgKHBsYXllckJhbGFuY2UgPCBtaW5CZXQpIHtcbiAgICAgICAgICAgIG1pbkJldCA9IHBsYXllckJhbGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pbkJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBHZXQgdGhlIG1pbmltdW0gYWxsb3dhYmxlIHJhaXNlIGZvciBwbGF5ZXJcbiAgICAgKlxuICAgICAqIE5PVEU6IEEgcmFpc2UgaGVyZSBtYXkgYWN0dWFsbHkgbWVhbiBhIGJldCBpbiBwb2tlciB0ZXJtcy4gSW4gdGhlXG4gICAgICogcGFybGFuY2Ugb2YgdGhpcyB1dGlsaXR5LCBhIHJhaXNlIGlzIGFuIGFnZ3Jlc3NpdmUgYWN0aW9uLCBvciBzb21ldGhpbmdcbiAgICAgKiB3aGljaCB3b3VsZCBmb3JjZSBvdGhlciBwbGF5ZXJzIHRvIGNvbnRyaWJ1dGUgbW9yZSB0byB0aGUgcG90IHRoYW5cbiAgICAgKiB0aGUgb3RoZXJ3aXNlIHdvdWxkIGhhdmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmlnQmxpbmQgLSBUaGUgYmlnIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3VuZEJldCAtIFRoZSBsZWFkaW5nIGJldCBmb3IgdGhpcyBiZXR0aW5nIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllclJvdW5kQmV0IC0gVGhlIGFtb3VudCB0aGlzIHBsYXllciBoYXMgY29udHJpYnV0ZWQgdG8gdGhlIHBvdCBzbyBmYXIgdGhpcyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmV2UmFpc2UgLSBUaGUgYW1vdW50IHRoZSBwcmV2aW91cyByYWlzZSBpbmNyZWFzZWQgdGhlIGJldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJCYWxhbmNlIC0gVGhlIGFtb3VudCB0aGUgcGxheWVyIGhhcyBhdmFpbGFibGUgdG8gYmV0XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0TWluUmFpc2UoYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCBtaW5SYWlzZSA9IHJvdW5kQmV0ID09PSAwID8gYmlnQmxpbmQgOiByb3VuZEJldCAtIHBsYXllclJvdW5kQmV0ICsgcHJldlJhaXNlO1xuICAgICAgICBpZiAocGxheWVyQmFsYW5jZSA8IG1pblJhaXNlKSB7XG4gICAgICAgICAgICBtaW5SYWlzZSA9IHBsYXllckJhbGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pblJhaXNlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9rZXI7IiwiY2xhc3MgU1NFIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB1cmwpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIHRoaXMuc291cmNlID0gbmV3IEV2ZW50U291cmNlKHRoaXMudXJsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZSBhZGRzIGFsbCBsaXN0ZW5lcnMgdG8gdGhpcy5zb3VyY2VcbiAgICAgKlxuICAgICAqIEkgb3JpZ2luYWxseSB3cm90ZSB0aGlzIHRvIHN1cHBvcnQgY2xpZW50IHJlY29ubmVjdHMsIGJ1dCBJIGRvbid0IG5lZWRcbiAgICAgKiB0aGF0IGFueW1vcmUuIEtlZXBpbmcgdGhlIGxpc3RlbmVyIGNvZGUganVzdCBpbiBjYXNlLlxuICAgICAqL1xuICAgIHJlQWRkQWxsTGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnM7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICB0aGlzLmFkZExpc3RlbmVyKGxpc3RlbmVyLnR5cGUsIGxpc3RlbmVyLmNhbGxiYWNrLCBsaXN0ZW5lci5jYWxsYmFja0NvbnRleHQsIC4uLmxpc3RlbmVyLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncykge1xuICAgICAgICAvLyBTdG9yZSBsaXN0ZW5lcnMgZm9yIGV2ZW50dWFsIHJlY29ubmVjdFxuICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKHtcbiAgICAgICAgICAgIFwidHlwZVwiOiB0eXBlLFxuICAgICAgICAgICAgXCJjYWxsYmFja1wiOiBjYWxsYmFjayxcbiAgICAgICAgICAgIFwiY2FsbGJhY2tDb250ZXh0XCI6IGNhbGxiYWNrQ29udGV4dCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBhcmdzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc291cmNlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncywgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNTRTsiLCJjbGFzcyBVdGlsIHtcbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZXR1cm4gYSBmb3JtYXR0ZWQgY3VycmVuY3kgc3RyaW5nIGZyb20gYW4gaW50ZWdlclxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZUN1cnJlbmN5KGludCkge1xuICAgICAgICBsZXQgdmFsID0gaW50IC8gMTAwO1xuICAgICAgICByZXR1cm4gXCIkXCIgKyB2YWwudG9GaXhlZCgyKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWw7IiwiY29uc3QgQWN0aW9uID0ge1xuICAgIEJMSU5EOiAwLFxuICAgIEZPTEQ6IDEsXG4gICAgQ0hFQ0s6IDIsXG4gICAgQkVUOiAzXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBY3Rpb247IiwiLyoqXG4gKiBBIFBoYXNlci5CdXR0b24gd2l0aCBhIFBoYXNlci5UZXh0IGNlbnRlcmVkIG9uIHRoZSBidXR0b25cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIG1lcmVseSBhIHRoaW4gd3JhcHBlciBhcm91bmQgUGhhc2VyLkJ1dHRvbiB0byBhbGxvdyBmb3JcbiAqIGVhc3kgdXNlIG9mIGEgdGV4dCBsYWJlbCBvbiB0aGUgYnV0dG9uLiBUaGUgdGV4dCBpcyBhIGNoaWxkIG9mIHRoZSBidXR0b24sXG4gKiBzbyBpdCBtb3ZlcyB3aGVuIHRoZSBidXR0b24gbW92ZXMuIEl0J3MgY2VudGVyZWQgb24gdGhlIGJ1dHRvbiBhbmQgc2NhbGVzXG4gKiBhdXRvbWF0aWNhbGx5IHRvIGZpeCB3aXRoaW4gdGhlIGJ1dHRvbidzIGJvdW5kcy5cbiAqXG4gKiBJZiBub25lIG9mIHRoZSBsYWJlbCBmdW5jdGlvbmFsaXR5IGlzIHVzZWQsIHRoaXMgY2xhc3MgaXMgaWRlbnRpY2FsIHRvXG4gKiBQaGFzZXIuQnV0dG9uLlxuICovXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBQaGFzZXIuQnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSkge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSk7XG5cbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSAxMDtcbiAgICAgICAgdGhpcy5sYWJlbFRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSB7fTtcbiAgICAgICAgdGhpcy5sYWJlbCA9IG5ldyBQaGFzZXIuVGV4dCh0aGlzLmdhbWUsIDAsIDAsIHRoaXMubGFiZWxUZXh0KTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmxhYmVsKTtcblxuICAgICAgICAvLyBNdXN0IGFkZCB0byBnYW1lIHdvcmxkIG1hbnVhbGx5IGlmIG5vdCB1c2luZyBnYW1lLmFkZC5idXR0b25cbiAgICAgICAgdGhpcy5nYW1lLndvcmxkLmFkZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHRleHQgZGlzcGxheWVkIG9uIHRoZSBidXR0b25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGRpc3BsYXlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0VGV4dCh0ZXh0LCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxUZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBzdHlsZSBmb3IgdGhlIGJ1dHRvbiB0ZXh0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gVGhlIHRleHQgc3R5bGUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFRleHRTdHlsZShzdHlsZSwgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSBzdHlsZTtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBwYWRkaW5nIGJldHdlZW4gdGhlIHRleHQgYW5kIHRoZSBidXR0b24gcGVyaW1ldGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmcgLSBUaGUgcGFkZGluZyBpbiBwaXhlbHNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0UGFkZGluZyhwYWRkaW5nLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxQYWRkaW5nID0gcGFkZGluZztcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIGJ1dHRvblxuICAgICAqIE9uIGRpc2FibGUsIGRpc2FibGVzIGFsbCBpbnB1dCB0byB0aGUgYnV0dG9uIGFuZCByZW5kZXJzIGl0IGdyYXllZFxuICAgICAqIG91dC4gQWxsIHVwZGF0ZXMgYXJlIGRlbGF5ZWQgdW50aWwgcmUtZW5hYmxlLCB1bmxlc3MgZm9yY2VkLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIEVuYWJsZSBvciBkaXNhYmxlIGJ1dHRvbj9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmxhYmVsLnRpbnQgPSB0aW50O1xuXG4gICAgICAgIC8vIFVwZGF0ZSBvbiByZS1lbmFibGVcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFVwZGF0ZSBhbGwgYnV0dG9uIGF0dHJpYnV0ZXMgdG8gY3VycmVudCBwcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBJZiB0aGUgYnV0dG9uIGlzIGRpc2FibGVkLCB0aGlzIHdpbGwgaGF2ZSBubyBlZmZlY3QuIFRoZVxuICAgICAqIGRldmVsb3BlciBtYXkgb3B0aW9uYWxseSBjaG9vc2UgdG8gZm9yY2UgdGhlIHVwZGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSB0aGUgdXBkYXRlP1xuICAgICAqL1xuICAgIHVwZGF0ZUxhYmVsKGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCB8fCBmb3JjZSkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbC50ZXh0ID0gdGhpcy5sYWJlbFRleHQ7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnNldFN0eWxlKHRoaXMubGFiZWxTdHlsZSk7XG4gICAgICAgICAgICB0aGlzLnJlUG9zTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNjYWxlIGxhYmVsIHRleHQgdG8gZml0IG9uIGJ1dHRvbiBhbmQgY2VudGVyXG4gICAgICovXG4gICAgcmVQb3NMYWJlbCgpIHtcbiAgICAgICAgdGhpcy5sYWJlbC5zY2FsZS5zZXRUbygxKTtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFIID0gdGhpcy53aWR0aCAtIHRoaXMubGFiZWxQYWRkaW5nICogMjtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFWID0gdGhpcy5oZWlnaHQgLSB0aGlzLmxhYmVsUGFkZGluZyAqIDI7XG4gICAgICAgIGlmICh0aGlzLmxhYmVsLndpZHRoID4gdGV4dEFyZWFIIHx8IHRoaXMubGFiZWwuaGVpZ2h0ID4gdGV4dEFyZWFWKSB7XG4gICAgICAgICAgICBjb25zdCByZWR1Y2VkU2NhbGVIID0gdGV4dEFyZWFIIC8gdGhpcy5sYWJlbC53aWR0aDtcbiAgICAgICAgICAgIGNvbnN0IHJlZHVjZWRTY2FsZVYgPSB0ZXh0QXJlYVYgLyB0aGlzLmxhYmVsLmhlaWdodDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2NhbGUuc2V0VG8oTWF0aC5taW4ocmVkdWNlZFNjYWxlSCwgcmVkdWNlZFNjYWxlVikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFiZWwuY2VudGVyWCA9IHRoaXMud2lkdGggLyAyO1xuICAgICAgICB0aGlzLmxhYmVsLmNlbnRlclkgPSB0aGlzLmhlaWdodCAvIDI7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjsiLCJjbGFzcyBDYXJkIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBtYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7ICAgLy8gU3RyaW5nIElEIG9mIGNhcmQsIGUuZy4gJ0toJyBvciAnN3MnXG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKGRhdGEpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwiY2FyZHNcIik7XG4gICAgICAgIHRoaXMuc3ByaXRlLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLnNwcml0ZS5zY2FsZS5zZXRUbygxLjUpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lTmFtZSA9IHRoaXMubmFtZSA/IHRoaXMubmFtZSA6IFwiYmFja1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZDsiLCJjbGFzcyBDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBwbGF5ZXJJZCwgdG9rZW4pIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBhY2Nlc3MgdG9rZW4gdXNlZCB0byBhdXRoZW50aWNhdGUgb24gQVBJIGNhbGxzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gVGhlIEZsYXNrLUpXVC1FeHRlbmRlZCBhY2Nlc3MgdG9rZW5cbiAgICAgKi9cbiAgICBzZXRUb2tlbih0b2tlbikge1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgICAqXG4gICAgICogT25seSBlcnJvcnMgYXJlIHJlcG9ydGVkLiBTdWNjZXNzIGlzIHNpbGVudC4gR2FtZSBjaGFuZ2VzIHJlc3VsdGluZ1xuICAgICAqIGZyb20gcmVxdWVzdHMgYXJlIGhhbmRsZWQgdmlhIFNlcnZlciBTZW50IEV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmRwb2ludCAtIFRoZSBlbmRwb2ludCBvbiB0aGUgc2VydmVyIHRvIHNlbmQgcmVxdWVzdCB0b1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gVGhlIHBheWxvYWQgdG8gc2VuZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWV0aG9kPVwiUE9TVF0gLSBUaGUgSFRUUCBtZXRob2QgdG8gdXNlXG4gICAgICovXG4gICAgc2VuZFJlcXVlc3QoZW5kcG9pbnQsIGRhdGEsIG1ldGhvZCA9IFwiUE9TVFwiKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4obWV0aG9kLCBlbmRwb2ludCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3AgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIC8vIEludmFsaWQgcmVxdWVzdCBlcnJvclxuICAgICAgICAgICAgICAgIGlmIChyZXNwLnN1Y2Nlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihyZXNwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgIC8vIEZhaWxlZCByZXF1ZXN0IGVycm9yXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgdGhpcy50b2tlbik7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGFuIGFjdGlvbiByZXF1ZXN0XG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHRoZSBtb3N0IGhlYXZpbHktdXNlZCByZXF1ZXN0IHR5cGUgaW4gdGhlIGdhbWUuIEFsbCBpbi1nYW1lXG4gICAgICogYWN0aW9ucyAoYmV0LCBjaGVjaywgZm9sZCkgaGFwcGVuIGhlcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIFRoZSBwYXlsb2FkIHRvIHNlbmRcbiAgICAgKi9cbiAgICBhY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiYWN0aW9uXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgY2hlY2soKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkNIRUNLXCIpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBiZXQoYW10KSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJFVFwiLCBhbXQpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBmb2xkKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBiYigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkxJTkRcIiwgNTApO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBzYigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkxJTkRcIiwgMjUpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBqb2luKHNlYXROdW0sIGJ1eUluKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XCJwb3NpdGlvblwiOiBzZWF0TnVtLCBcImFtb3VudFwiOiBidXlJbn07XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJqb2luXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgbGVhdmUoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImxlYXZlXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhIGJlYWNvbiB0byB0aGUgc2VydmVyIG9uIGRpc2Nvbm5lY3RcbiAgICAgKlxuICAgICAqIFRoaXMgYWxsb3dzIGZvciBzZXJ2ZXIgdG8ga25vdyB3aGVuIGEgY2xpZW50IGRpc2Nvbm5lY3RzIHNvXG4gICAgICogaXQgY2FuIGNsZWFuIHVwIGFzIG5lY2Vzc2FyeS4gTm8gZ3VhcmFudGVlIHRoYXQgdGhpcyBtZXNzYWdlXG4gICAgICogd2lsbCBnbyB0aHJvdWdoLCBzbyBtdXN0IGhhdmUgcmVkdW5kYW50IG1lYXN1cmVzIGluIHBsYWNlLlxuICAgICAqL1xuICAgIGRpc2Nvbm5lY3RCZWFjb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgY29uc3QgdXJsID0gXCIvZGlzY29ubmVjdC9cIjtcbiAgICAgICAgbmF2aWdhdG9yLnNlbmRCZWFjb24odXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBidWlsZFBheWxvYWQoYWN0aW9uVHlwZSwgYmV0QW10ID0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJwbGF5ZXJJZFwiOiB0aGlzLnBsYXllcklkLFxuICAgICAgICAgICAgXCJhY3Rpb25UeXBlXCI6IGFjdGlvblR5cGUsXG4gICAgICAgICAgICBcImJldEFtdFwiOiBiZXRBbXRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJ1aWxkVXJsKGVuZHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVVcmwgKyBlbmRwb2ludCArIFwiL1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlcjsiLCIvKipcbiAqIEBzdW1tYXJ5IFNpbXBsZSBQaGFzZXIuVGV4dCBleHRlbnN0aW9uIHRvIHN1cHBvcnQgYXV0b21hdGljIHJlc2l6aW5nXG4gKlxuICogSWYgdGV4dCBib3VuZHMgYXJlIHNldCBvbiBpbnN0YW5jZXMgb2YgdGhpcyBjbGFzcywgdGhlbiBlYWNoIHRpbWUgdGhlIHRleHRcbiAqIG9yIHN0eWxlIGlzIGNoYW5nZWQsIHRoZSB0ZXh0IHdpbGwgYXV0b21hdGljYWxseSBzY2FsZSBpdHNlbGYgZG93biB0byBmaXRcbiAqIHdpdGhpbiB0aG9zZSBib3VuZHMgaG9yaXpvbnRhbGx5LiBWZXJ0aWNhbCBib3VuZHMgYXJlIGlnbm9yZWQuXG4gKlxuICogUG9zc2libGUgdXBncmFkZXM6XG4gKiAgIC0gU2V0IG1pbmltdW0gc2NhbGVcbiAqICAgLSBJZiB0ZXh0IHN0aWxsIG92ZXJmbG93cyBtaW4gc2NhbGUsIHRoZW4gdHJ1bmNhdGVcbiAqL1xuY2xhc3MgTGFiZWwgZXh0ZW5kcyBQaGFzZXIuVGV4dCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwgdGV4dCwgc3R5bGUpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwgdGV4dCwgc3R5bGUpO1xuICAgICAgICB0aGlzLmFuY2hvci5zZXRUbygwLCAwLjUpOyAgLy8gQ2VudGVyIHZlcnRpY2FsbHkgdG8gYXZvaWQganVtcHMgb24gcmVzaXplXG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuXG4gICAgc2V0VGV4dCh0ZXh0LCBpbW1lZGlhdGUpIHtcbiAgICAgICAgc3VwZXIuc2V0VGV4dCh0ZXh0LCBpbW1lZGlhdGUpO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgIH1cblxuICAgIHNldFN0eWxlKHN0eWxlLCB1cGRhdGUpIHtcbiAgICAgICAgc3VwZXIuc2V0U3R5bGUoc3R5bGUsIHVwZGF0ZSk7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgUmVzaXplIHRoZSB0ZXh0IGhvcml6b250YWxseVxuICAgICAqXG4gICAgICogSWYgdGV4dCBkb2VzIG5vdCBmaXQgaG9yaXpvbnRhbGx5IGF0IGZ1bGwgc2NhbGUsIHRoZW4gc2NhbGUgZG93blxuICAgICAqIHVudGlsIGl0IGZpdHMuIFZlcnRpY2FsIG92ZXJmbG93IGlzIGlnbm9yZWQuXG4gICAgICovXG4gICAgcmVzaXplKCkge1xuICAgICAgICBpZiAoIXRoaXMudGV4dEJvdW5kcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2NhbGUuc2V0VG8oMSk7XG4gICAgICAgIGlmICh0aGlzLndpZHRoID4gdGhpcy50ZXh0Qm91bmRzLndpZHRoKSB7XG4gICAgICAgICAgICB0aGlzLnNjYWxlLnNldFRvKHRoaXMudGV4dEJvdW5kcy53aWR0aCAvIHRoaXMud2lkdGgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMYWJlbDsiLCJpbXBvcnQgTGFiZWwgZnJvbSBcIi4vTGFiZWxcIjtcbmltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5cbmNsYXNzIE5hbWVwbGF0ZSBleHRlbmRzIFBoYXNlci5JbWFnZSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwga2V5LCBjb25maWcpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwga2V5KTtcbiAgICAgICAgZ2FtZS53b3JsZC5hZGQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnIHx8IHRoaXMuZ2FtZS5jb25maWcubmFtZXBsYXRlO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcbiAgICAgICAgICAgIFwibmFtZXBsYXRlXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYmFsYW5jZVwiOiBudWxsXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lID0gbmV3IExhYmVsKHRoaXMuZ2FtZSwgdGhpcy5jb25maWcubmFtZS54LCB0aGlzLmNvbmZpZy5uYW1lLnksIFwiXCIsIHRoaXMuY29uZmlnLm5hbWUuc3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS5zZXRUZXh0Qm91bmRzKDAsIDAsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggLSAyMCwgMCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5kaXNwbGF5Lm5hbWUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlID0gbmV3IExhYmVsKHRoaXMuZ2FtZSwgdGhpcy5jb25maWcuYmFsYW5jZS54LCB0aGlzLmNvbmZpZy5iYWxhbmNlLnksIFwiXCIsIHRoaXMuY29uZmlnLmJhbGFuY2Uuc3R5bGUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS5zZXRUZXh0Qm91bmRzKDAsIDAsIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggLSAyMCwgMCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmJhbGFuY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEZsYXNoIHRleHRcbiAgICAgKi9cbiAgICBmbGFzaCgpIHtcblxuICAgIH1cblxuICAgIHNldCBuYW1lKG5hbWUpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUuc2V0VGV4dChuYW1lKTtcbiAgICB9XG5cbiAgICBzZXQgYmFsYW5jZShiYWxhbmNlKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLnNldFRleHQoVXRpbC5wYXJzZUN1cnJlbmN5KGJhbGFuY2UpKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5hbWVwbGF0ZTsiLCJpbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi9CdXR0b25cIjtcbmltcG9ydCBTbGlkZXIgZnJvbSBcIi4vU2xpZGVyXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuXG5jbGFzcyBQYW5lbCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJldHMgPSBbMF07XG4gICAgICAgIHRoaXMucHJpbWFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnByaW1hcnlBY3Rpb24gPSBBY3Rpb24uQkVUO1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IEFjdGlvbi5DSEVDSztcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnRlcnRpYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMudGVydGlhcnlBY3Rpb24gPSBBY3Rpb24uRk9MRDtcbiAgICAgICAgdGhpcy5zbGlkZXIgPSBuZXcgU2xpZGVyKHRoaXMuZ2FtZSwgXCJwYW5lbFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbHdheXNWaXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkgPSB0aGlzLm1ha2VCdXR0b24oMCwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5wcmltYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnByaW1hcnlBY3Rpb24sIHRoaXMucHJpbWFyeUJldCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDEzNSwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5zZWNvbmRhcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMuc2Vjb25kYXJ5QWN0aW9uLCB0aGlzLnNlY29uZGFyeUJldCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkudGVydGlhcnkgPSB0aGlzLm1ha2VCdXR0b24oMjcwLCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnRlcnRpYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnRlcnRpYXJ5QWN0aW9uLCAwKSk7XG5cbiAgICAgICAgdGhpcy5zbGlkZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuaW5kZXhDaGFuZ2VkLmFkZCgoaW5kZXgpID0+IHRoaXMuc2V0UHJpbWFyeUJldCh0aGlzLmJldHNbaW5kZXhdKSwgdGhpcyk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNsaWRlcldoZWVsLmFkZCh0aGlzLnNpbmdsZVN0ZXBCZXQsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2xpZGVyID0gdGhpcy5zbGlkZXIuYmFyO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2xpZGVyLnkgPSA2MDtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnByaW1hcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnNlY29uZGFyeSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkudGVydGlhcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnNsaWRlcik7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgbWFrZUJ1dHRvbih4LCB5LCBzaXplLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYnV0dG9uID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIHgsIHksIHRoaXMua2V5KTtcbiAgICAgICAgYnV0dG9uLm9uSW5wdXRVcC5hZGQoY2FsbGJhY2spO1xuICAgICAgICBidXR0b24uc2V0RnJhbWVzKFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfb3V0XCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9kb3duXCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl91cFwiXG4gICAgICAgICk7XG4gICAgICAgIGJ1dHRvbi5zZXRUZXh0U3R5bGUodGhpcy5nYW1lLmNvbmZpZy5wYW5lbC50ZXh0U3R5bGUpO1xuICAgICAgICByZXR1cm4gYnV0dG9uO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIC8vIFBhbmVsIHVwZGF0ZXMgcmVxdWlyZSBwbGF5ZXJzJyBjdXJyZW50IGJldHMsIHNvIGlmXG4gICAgICAgIC8vIHRoZXJlIGlzIG5vIG5leHQgcGxheWVyIHdlIHNob3VsZG4ndCB1cGRhdGUgdGhlIGRpc3BsYXlcbiAgICAgICAgaWYgKCF0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYWN0aW9uVGV4dCA9IHRoaXMuZ2FtZS5yb3VuZEJldCA9PT0gMCA/IFwiQkVUIFwiIDogXCJSQUlTRSBUT1xcblwiO1xuICAgICAgICBsZXQgcHJpbWFyeVRleHQgPSBhY3Rpb25UZXh0ICsgVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMucHJpbWFyeUJldCArIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQpO1xuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeS5zZXRUZXh0KHByaW1hcnlUZXh0KTtcblxuICAgICAgICBsZXQgc2Vjb25kYXJ5VGV4dCA9IFwiQ0hFQ0tcIjtcbiAgICAgICAgaWYgKHRoaXMuc2Vjb25kYXJ5QWN0aW9uICE9PSBBY3Rpb24uQ0hFQ0spIHtcbiAgICAgICAgICAgIHNlY29uZGFyeVRleHQgPSBcIkNBTEwgXCIgKyBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5zZWNvbmRhcnlCZXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheS5zZWNvbmRhcnkuc2V0VGV4dChzZWNvbmRhcnlUZXh0KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkudGVydGlhcnkuc2V0VGV4dChcIkZPTERcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLnZpc2libGUgPSB0aGlzLnZpc2libGU7XG4gICAgfVxuXG4gICAgc2V0QmV0cyhiZXRzKSB7XG4gICAgICAgIGlmIChiZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIGJldHMuIFBhbmVsIG11c3QgYWx3YXlzIGhhdmUgYXQgbGVhc3Qgb25lIHZhbGlkIGJldC5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJldHMgPSBiZXRzO1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSBiZXRzWzBdO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRMZW5ndGgoYmV0cy5sZW5ndGgpO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRJbmRleCgwKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0RW5hYmxlZChiZXRzLmxlbmd0aCA+IDEpO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRQcmltYXJ5QmV0KGJldCkge1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSBiZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldFNlY29uZGFyeUJldChiZXQpIHtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlCZXQgPSBiZXQ7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QWN0aW9uID0gYmV0ID09PSAwID8gQWN0aW9uLkNIRUNLIDogQWN0aW9uLkJFVDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSGlkZSBvciBzaG93IHRoZSBlbnRpcmUgcGFuZWxcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGVcbiAgICAgKi9cbiAgICBzZXRWaXNpYmxlKHZpc2libGUpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZSB8fCB0aGlzLmFsd2F5c1Zpc2libGU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEluY3JlbWVudCBvciBkZWNyZW1lbnQgdGhpcy5wcmltYXJ5QmV0XG4gICAgICogQHBhcmFtIHtQaGFzZXIuTW91c2Uud2hlZWxEZWx0YX0gbW9kaWZpZXIgLSArMSBvciAtMVxuICAgICAqL1xuICAgIHNpbmdsZVN0ZXBCZXQobW9kaWZpZXIpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5zbGlkZXIuaW5kZXggKyBtb2RpZmllcjtcbiAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPD0gdGhpcy5zbGlkZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNsaWRlci5zZXRJbmRleChpbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsOyIsImltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5pbXBvcnQgQ2FyZE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NhcmRNYW5hZ2VyXCI7XG5pbXBvcnQgQ2hpcE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NoaXBNYW5hZ2VyXCI7XG5pbXBvcnQgTmFtZXBsYXRlIGZyb20gXCIuLi9jbGFzc2VzL05hbWVwbGF0ZVwiO1xuXG5jbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGNoaXBDb25maWcpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5jaGlwQ29uZmlnID0gY2hpcENvbmZpZztcblxuICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBudWxsO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBudWxsO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBudWxsO1xuICAgICAgICB0aGlzLnNlYXQgPSBudWxsO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gMDsgIC8vIFN1bSBiZXRzIGJ5IHBsYXllciBpbiBjdXJyZW50IGJldHRpbmcgcm91bmRcblxuICAgICAgICB0aGlzLmlzRGVhbGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNOZXh0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcbiAgICAgICAgICAgIG5hbWVwbGF0ZTogbnVsbCxcbiAgICAgICAgICAgIGNhcmRzOiBudWxsLFxuICAgICAgICAgICAgZGVhbGVyQnV0dG9uOiBudWxsLFxuICAgICAgICAgICAgbmV4dEluZGljYXRvcjogbnVsbCxcbiAgICAgICAgICAgIGNoaXBzOiBudWxsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5jYXJkcyA9IG5ldyBDYXJkTWFuYWdlcih0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmNoaXBzID0gbmV3IENoaXBNYW5hZ2VyKHRoaXMuZ2FtZSwgXCJjaGlwc1wiLCB0aGlzLmdhbWUuY29uZmlnLmRlbm9tcyk7XG4gICAgICAgIHRoaXMubmFtZXBsYXRlID0gbmV3IE5hbWVwbGF0ZSh0aGlzLmdhbWUsIDAsIDAsIFwibmFtZXBsYXRlXCIpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoZGF0YSkge1xuICAgICAgICB0aGlzLmlkID0gZGF0YS5pZDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBkYXRhLnVzZXJJZDtcbiAgICAgICAgdGhpcy5iYWxhbmNlID0gZGF0YS5iYWxhbmNlO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBkYXRhLnNpdHRpbmdPdXQ7XG4gICAgICAgIHRoaXMuc2VhdCA9IGRhdGEuc2VhdDtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICB0aGlzLmlzVXNlciA9IGRhdGEuaXNVc2VyO1xuXG4gICAgICAgIHRoaXMuY2FyZHMuaW5pdGlhbGl6ZSgyKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZSA9IHRoaXMubmFtZXBsYXRlO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkubmFtZXBsYXRlKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMgPSB0aGlzLmNhcmRzLmRpc3BsYXlHcm91cDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLmNlbnRlclggPSAwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMuY2VudGVyWSA9IC0xMjA7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuY2FyZHMpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24gPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCBcImRlYWxlckJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbi5sZWZ0ID0gdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5sZWZ0ICsgNTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbi5ib3R0b20gPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmJvdHRvbSAtIDU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwicmVkQ2lyY2xlXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvci5yaWdodCA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUucmlnaHQgLSA1O1xuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvci5ib3R0b20gPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmJvdHRvbSAtIDU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvcik7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNoaXBzID0gdGhpcy5jaGlwcy5kaXNwbGF5R3JvdXA7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jaGlwcy54ID0gdGhpcy5jaGlwQ29uZmlnW3RoaXMuc2VhdF0ueDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNoaXBzLnkgPSB0aGlzLmNoaXBDb25maWdbdGhpcy5zZWF0XS55O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmNoaXBzLmRpc3BsYXlHcm91cCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5uYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmJhbGFuY2UgPSB0aGlzLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24udmlzaWJsZSA9IHRoaXMuaXNEZWFsZXIgPT09IHRydWU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yLnZpc2libGUgPSB0aGlzLmlzTmV4dCA9PT0gdHJ1ZTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZGF0YSkge1xuICAgICAgICAvLyBUT0RPIC0gRmxlc2ggb3V0IHRoZSByZXN0IG9mIHRoZSBkYXRhIC0tIGRvIEkgbGlrZSB0aGlzIG1ldGhvZD9cbiAgICAgICAgdGhpcy5iYWxhbmNlID0gZGF0YS5iYWxhbmNlID09PSB1bmRlZmluZWQgPyB0aGlzLmJhbGFuY2UgOiBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuaXNEZWFsZXIgPSBkYXRhLmlzRGVhbGVyID09PSB1bmRlZmluZWQgPyB0aGlzLmlzRGVhbGVyIDogZGF0YS5pc0RlYWxlcjtcbiAgICAgICAgdGhpcy5pc05leHQgPSBkYXRhLmlzTmV4dCA9PT0gdW5kZWZpbmVkID8gdGhpcy5pc05leHQgOiBkYXRhLmlzTmV4dDtcbiAgICAgICAgdGhpcy5yb3VuZEJldCA9IGRhdGEucm91bmRCZXQgPT09IHVuZGVmaW5lZCA/IHRoaXMucm91bmRCZXQgOiBkYXRhLnJvdW5kQmV0O1xuICAgICAgICB0aGlzLmNoaXBzLnNldFZhbHVlKHRoaXMucm91bmRCZXQpO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjsiLCJpbXBvcnQgQ2hpcE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NoaXBNYW5hZ2VyXCI7XG5cbmNsYXNzIFBvdCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmFtb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICAgICAgdGhpcy5jaGlwcyA9IG5ldyBDaGlwTWFuYWdlcih0aGlzLmdhbWUsIFwiY2hpcHNcIiwgdGhpcy5nYW1lLmNvbmZpZy5kZW5vbXMpO1xuICAgICAgICB0aGlzLmNoaXBzLnN0YWNrQ2hpcHMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jaGlwcy5jb2xvclVwID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5jaGlwcy5zZXRWYWx1ZSh0aGlzLmFtb3VudCk7XG4gICAgfVxuXG4gICAgc2V0QW1vdW50KGFtb3VudCkge1xuICAgICAgICB0aGlzLmFtb3VudCA9IGFtb3VudDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb3Q7IiwiLyoqXG4gKiBBIHNsaWRlciBVSSBlbGVtZW50XG4gKlxuICogUmVwcmVzZW50ZWQgYnkgYSBiYXIgc3ByaXRlIGFuZCBhIG1hcmtlciBzcHJpdGUuIERlc3BpdGUgaG93IGl0IG1heVxuICogbG9vaywgYWxsIGlucHV0IG9jY3VycyBvbiB0aGUgYmFyIGFuZCB1cGRhdGVzIGFyZSBtYWRlIHRvIHRoZVxuICogbWFya2VyJ3MgcG9zaXRpb24gYmFzZWQgb24gdGhvc2UgaW5wdXRzLlxuICovXG5jbGFzcyBTbGlkZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5iYXIgPSBudWxsOyAgLy8gVGhlIHNsaWRlciBiYXIgc3ByaXRlXG4gICAgICAgIHRoaXMubWFya2VyID0gbnVsbDsgIC8vIFRoZSBkcmFnZ2FibGUgbWFya2VyIHNwcml0ZVxuICAgICAgICB0aGlzLmluZGV4ID0gMDsgIC8vIEN1cnJlbnQgaW5kZXggb2YgbWFya2VyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMTsgIC8vIFRvdGFsIG51bWJlciBvZiBpbmRpY2VzXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2xpZGVyV2hlZWwgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmJhciA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgdGhpcy5rZXksIFwic2xpZGVyX2JhclwiKTtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXREb3duLmFkZCh0aGlzLnN0YXJ0RHJhZywgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0VXAuYWRkKHRoaXMuc3RvcERyYWcsIHRoaXMpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHRoaXMuZW5hYmxlU2xpZGVyV2hlZWwodHJ1ZSkpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4gdGhpcy5lbmFibGVTbGlkZXJXaGVlbChmYWxzZSkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyID0gdGhpcy5iYXI7XG5cbiAgICAgICAgdGhpcy5tYXJrZXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCB0aGlzLmtleSwgXCJzbGlkZXJfbWFya2VyXCIpO1xuICAgICAgICB0aGlzLm1hcmtlci5hbmNob3Iuc2V0VG8oMC41LCAwKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuYm90dG9tID0gdGhpcy5iYXIuYm90dG9tO1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyID0gdGhpcy5tYXJrZXI7XG4gICAgICAgIHRoaXMuYmFyLmFkZENoaWxkKHRoaXMubWFya2VyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgc2xpZGVyIGRyYWdnaW5nIGFuZCBpbml0aWF0ZSBmaXJzdCBkcmFnIGV2ZW50XG4gICAgICogQHBhcmFtIHtQaGFzZXIuU3ByaXRlfSBiYXIgLSBUaGUgYmFyIHNwcml0ZSB0aGF0IHdhcyBjbGlja2VkXG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBwb2ludGVyIHdoaWNoIGluaXRpYXRlZCB0aGUgY2xpY2tcbiAgICAgKi9cbiAgICBzdGFydERyYWcoYmFyLCBwb2ludGVyKSB7XG4gICAgICAgIC8vIEluaXRpYWwgY2FsbCB0byB1cGRhdGVEcmFnIGFsbG93cyBjaGFuZ2luZyBiZXQgd2l0aCBjbGljayBvbiBiYXJcbiAgICAgICAgdGhpcy51cGRhdGVEcmFnKHBvaW50ZXIsIHBvaW50ZXIueCwgcG9pbnRlci55KTtcbiAgICAgICAgdGhpcy5nYW1lLmlucHV0LmFkZE1vdmVDYWxsYmFjayh0aGlzLnVwZGF0ZURyYWcsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IERpc2FibGUgc2xpZGVyIGRyYWdnaW5nXG4gICAgICovXG4gICAgc3RvcERyYWcoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5kZWxldGVNb3ZlQ2FsbGJhY2sodGhpcy51cGRhdGVEcmFnLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBDYWxjdWxhdGUgc2xpZGVyIGluZGV4IGJhc2VkIG9uIGRyYWcgaW5wdXRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Qb2ludGVyfSBwb2ludGVyIC0gVGhlIHNsaWRpbmcgcG9pbnRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSBvZiBwb2ludGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIG9mIHBvaW50ZXJcbiAgICAgKi9cbiAgICB1cGRhdGVEcmFnKHBvaW50ZXIsIHgsIHkpIHtcbiAgICAgICAgbGV0IGxvY2FsWCA9IHggLSB0aGlzLmJhci53b3JsZC54OyAgLy8gQ2xpY2sgcG9zIGluIHJlbGF0aW9uIHRvIGJhclxuXG4gICAgICAgIC8vIFByZXZlbnQgZHJhZ2dpbmcgcGFzdCBiYXIgYm91bmRzXG4gICAgICAgIGlmIChsb2NhbFggPCAwKSB7XG4gICAgICAgICAgICBsb2NhbFggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsWCA+IHRoaXMuYmFyLndpZHRoKSB7XG4gICAgICAgICAgICBsb2NhbFggPSB0aGlzLmJhci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN1YnRyYWN0IDEgZnJvbSBsZW5ndGggYmVjYXVzZSBsZW5ndGggaXMgMS1pbmRleGVkLCBpbmRpY2VzIGFyZSAwLWluZGV4ZWRcbiAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLnJvdW5kKGxvY2FsWCAvIHRoaXMuYmFyLndpZHRoICogKHRoaXMubGVuZ3RoIC0gMSkpO1xuICAgICAgICB0aGlzLnNldEluZGV4KGluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIGluZGV4IG9mIHRoZSBzbGlkZXIgYW5kIHJlcG9ydCB0aGUgbmV3IHZhbHVlXG4gICAgICpcbiAgICAgKiBPcHRpb25hbGx5IHVwZGF0ZSB0aGUgdmlzdWFsIHBvc2l0aW9uIG9mIHRoZSBtYXJrZXIgb24gdGhlIHNsaWRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIE5ldyBpbmRleCB0byBzZXQgb24gc2xpZGVyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXBkYXRlUG9zPXRydWVdIC0gVXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBtYXJrZXI/XG4gICAgICovXG4gICAgc2V0SW5kZXgoaW5kZXgsIHVwZGF0ZVBvcyA9IHRydWUpIHtcbiAgICAgICAgaWYgKGluZGV4ICE9PSB0aGlzLmluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZC5kaXNwYXRjaChpbmRleCk7XG5cbiAgICAgICAgICAgIGlmICh1cGRhdGVQb3MpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiBvbmx5IG9uZSBiZXQgYXZhaWxhYmxlLCBpdCdzIGEgbWF4IGJldFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgMSBmcm9tIGxlbmd0aCBiZWNhdXNlIGxlbmd0aCBpcyAxLWluZGV4ZWQsIGluZGljZXMgYXJlIDAtaW5kZXhlZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGggLyAodGhpcy5sZW5ndGggLSAxKSAqIHRoaXMuaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVXBkYXRlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgKlxuICAgICAqIFRoZSBsZW5ndGggcHJvcGVydHkgZGVzY3JpYmVzIGhvdyBtYW55IGRpc2NyZXRlIGJldHMgdGhlIHNsaWRlciBiYXJcbiAgICAgKiBtdXN0IHJlcHJlc2VudC4gVGhlIHNsaWRlciBkb2VzIG5vdCBjYXJlIGFib3V0IHdoYXQgdGhlIHNwZWNpZmljIGJldFxuICAgICAqIGl0IHJlcHJlc2VudHMgaXMsIG9ubHkgdGhhdCBpdCBoYXMgc29tZSBudW1iZXIgb2YgaW5kaWNlcyBhbG9uZyBpdHNcbiAgICAgKiBsZW5ndGggYW5kIHRoYXQgaXQgbXVzdCByZXBvcnQgaXRzIGluZGV4IHRvIGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbmV3IGxlbmd0aCB0byBzZXRcbiAgICAgKi9cbiAgICBzZXRMZW5ndGgobGVuZ3RoKSB7XG4gICAgICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCBzZXQgc2xpZGVyIGxlbmd0aCBsZXNzIHRoYW4gMVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChsZW5ndGggPiB0aGlzLmJhci53aWR0aCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogU2V0dGluZyBzbGlkZXIgc3RvcHMgZ3JlYXRlciB0aGFuIGxlbmd0aCBtYXkgcmVzdWx0IGluIHVuZXhwZWN0ZWQgYmVoYXZpb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIHNsaWRlclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIElzIHRoZSBzbGlkZXIgZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gZW5hYmxlZDtcblxuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyLnRpbnQgPSB0aW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIGRpc3BhdGNoIG9mIHNpZ25hbCBvbiB3aGVlbCBzY3JvbGxcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBJcyB0aGUgY2FsbGJhY2sgZW5hYmxlZCBvciBkaXNhYmxlZD9cbiAgICAgKi9cbiAgICBlbmFibGVTbGlkZXJXaGVlbChlbmFibGVkKSB7XG4gICAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQubW91c2UubW91c2VXaGVlbENhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyV2hlZWwuZGlzcGF0Y2godGhpcy5nYW1lLmlucHV0Lm1vdXNlLndoZWVsRGVsdGEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS5tb3VzZVdoZWVsQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbGlkZXI7IiwibW9kdWxlLmV4cG9ydHM9e1xuICBcInBhbmVsXCI6IHtcbiAgICBcInBhZGRpbmdcIjogMTAsXG4gICAgXCJ0ZXh0U3R5bGVcIjoge1xuICAgICAgXCJmb250XCI6IFwiYm9sZCAyMnB0IEFyaWFsXCIsXG4gICAgICBcImZpbGxcIjogXCJ3aGl0ZVwiLFxuICAgICAgXCJhbGlnblwiOiBcImNlbnRlclwiXG4gICAgfSxcbiAgICBcInBvc1wiOiB7XG4gICAgICBcInhcIjogMTQ4MCxcbiAgICAgIFwieVwiOiA3OTBcbiAgICB9XG4gIH0sXG4gIFwic2VhdHNcIjoge1xuICAgIFwiMTBcIjogW1xuICAgICAge1wieFwiOiA5MTAsIFwieVwiOiAyMzB9LFxuICAgICAge1wieFwiOiAxMjQ0LCBcInlcIjogMjMwfSxcbiAgICAgIHtcInhcIjogMTQ4NCwgXCJ5XCI6IDM0Nn0sXG4gICAgICB7XCJ4XCI6IDE0ODQsIFwieVwiOiA2NDJ9LFxuICAgICAge1wieFwiOiAxMjQ0LCBcInlcIjogNzU4fSxcbiAgICAgIHtcInhcIjogOTEwLCBcInlcIjogNzU4fSxcbiAgICAgIHtcInhcIjogNTc2LCBcInlcIjogNzU4fSxcbiAgICAgIHtcInhcIjogMzQyLCBcInlcIjogNjQyfSxcbiAgICAgIHtcInhcIjogMzQyLCBcInlcIjogMzQ2fSxcbiAgICAgIHtcInhcIjogNTc2LCBcInlcIjogMjMwfVxuICAgIF0sXG5cbiAgICAvLyBUT0RPXG4gICAgXCI4XCI6IFtdLFxuICAgIFwiOVwiOiBbXVxuICB9LFxuICBcImJ1eUluTW9kYWxcIjoge1xuICAgIFwieFwiOiA4MTAsXG4gICAgXCJ5XCI6IDQzMCxcbiAgICBcImlucHV0Qm94XCI6IHtcbiAgICAgIFwieFwiOiAxNSxcbiAgICAgIFwieVwiOiA4NlxuICAgIH0sXG4gICAgXCJpbnB1dEZpZWxkXCI6IHtcbiAgICAgIFwieFwiOiAzMCxcbiAgICAgIFwieVwiOiAtMlxuICAgIH0sXG4gICAgXCJjYW5jZWxCdXR0b25cIjoge1xuICAgICAgXCJ4XCI6IDE1LFxuICAgICAgXCJ5XCI6IDE0NVxuICAgIH0sXG4gICAgXCJzdWJtaXRCdXR0b25cIjoge1xuICAgICAgXCJ4XCI6IDE1NSxcbiAgICAgIFwieVwiOiAxNDVcbiAgICB9XG4gIH0sXG4gIFwiZGVub21zXCI6IFs1LCAyNSwgMTAwLCA1MDAsIDIwMDBdLFxuICBcImNoaXBzXCI6IHtcbiAgICBcIjEwXCI6IFtcbiAgICAgIHtcInhcIjogMCwgXCJ5XCI6IDk0fSxcbiAgICAgIHtcInhcIjogLTM0LCBcInlcIjogMTAwfSxcbiAgICAgIHtcInhcIjogLTEyNiwgXCJ5XCI6IDkwfSxcbiAgICAgIHtcInhcIjogLTEyNiwgXCJ5XCI6IDM4fSxcbiAgICAgIHtcInhcIjogMTI0LCBcInlcIjogNzh9LFxuICAgICAge1wieFwiOiAxMzIsIFwieVwiOiA3Nn0sXG4gICAgICB7XCJ4XCI6IDEyOCwgXCJ5XCI6IDcyfSxcbiAgICAgIHtcInhcIjogMTMxLCBcInlcIjogNzZ9LFxuICAgICAge1wieFwiOiAxNzQsIFwieVwiOiA3NH0sXG4gICAgICB7XCJ4XCI6IDE0LCBcInlcIjogOTh9XG4gICAgXVxuICB9LFxuICBcIm5hbWVwbGF0ZVwiOiB7XG4gICAgXCJuYW1lXCI6IHtcbiAgICAgIFwieFwiOiAxMCxcbiAgICAgIFwieVwiOiAzMCxcbiAgICAgIFwic3R5bGVcIjoge1xuICAgICAgICBcImZvbnRcIjogXCJib2xkIDIycHQgQXJpYWxcIlxuICAgICAgfVxuICAgIH0sXG4gICAgXCJiYWxhbmNlXCI6IHtcbiAgICAgIFwieFwiOiAxMCxcbiAgICAgIFwieVwiOiA2MCxcbiAgICAgIFwic3R5bGVcIjoge1xuICAgICAgICBcImZvbnRcIjogXCIxNnB0IEFyaWFsXCIsXG4gICAgICAgIFwiYm91bmRzQWxpZ25IXCI6IFwicmlnaHRcIlxuICAgICAgfVxuICAgIH1cbiAgfVxufSIsImltcG9ydCBCdXR0b24gZnJvbSBcIi4uL2NsYXNzZXMvQnV0dG9uXCI7XG5cbmNsYXNzIEJ1eUluTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJ1eUluUmVxdWVzdGVkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5zZWF0cyA9IHt9O1xuXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcImJ1dHRvbnNcIjogW10sIFwibW9kYWxcIjogbnVsbCwgXCJpbnB1dEJveFwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmJ1dHRvbnNHcm91cCk7XG5cbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkICYmIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkLnZpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShzZWF0Q29uZmlnLCBvY2N1cGllZFNlYXRzLCBtb2RhbENvbmZpZykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXRDb25maWcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgc2VhdENvbmZpZ1tpXS54LCBzZWF0Q29uZmlnW2ldLnksIHRoaXMua2V5LCB0aGlzLmJ1dHRvbkNsaWNrZWQsIHRoaXMpO1xuICAgICAgICAgICAgYnV0dG9uLnNlYXROdW0gPSBpOyAvLyBTdG9yZSBmb3IgdXNlIG9uIGNsaWNrXG4gICAgICAgICAgICBidXR0b24uc2V0RnJhbWVzKFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX292ZXJcIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9vdXRcIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9kb3duXCIsXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fdXBcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRUZXh0KFwiQnV5IEluXCIpO1xuICAgICAgICAgICAgdGhpcy5zZWF0c1tpXSA9IHtcbiAgICAgICAgICAgICAgICBcImJ1dHRvblwiOiBidXR0b24sXG4gICAgICAgICAgICAgICAgXCJvY2N1cGllZFwiOiBvY2N1cGllZFNlYXRzLmluZGV4T2YoaSkgIT09IC0xXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmJ1dHRvbnMucHVzaChidXR0b24pO1xuICAgICAgICAgICAgdGhpcy5idXR0b25zR3JvdXAuYWRkKGJ1dHRvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAudmlzaWJsZSA9IHRoaXMuYnV0dG9uc1Zpc2libGU7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsQmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgdGhpcy5nYW1lLnRleHR1cmVzLm1vZGFsQmFja2dyb3VuZCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkubW9kYWxCYWNrZ3JvdW5kKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwgPSB0aGlzLmdhbWUuYWRkLmltYWdlKG1vZGFsQ29uZmlnLngsIG1vZGFsQ29uZmlnLnksIHRoaXMua2V5LCBcIm1vZGFsXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkubW9kYWwpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEJveCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UobW9kYWxDb25maWcuaW5wdXRCb3gueCwgbW9kYWxDb25maWcuaW5wdXRCb3gueSwgdGhpcy5rZXksIFwiaW5wdXRfYm94XCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmlucHV0Qm94KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZCA9IHRoaXMuZ2FtZS5hZGQuaW5wdXRGaWVsZChtb2RhbENvbmZpZy5pbnB1dEZpZWxkLngsIG1vZGFsQ29uZmlnLmlucHV0RmllbGQueSwge1xuICAgICAgICAgICAgZm9udDogJzMycHggQXJpYWwnLFxuICAgICAgICAgICAgZmlsbDogJyMzMzMzMzMnLFxuICAgICAgICAgICAgd2lkdGg6IDIyMCxcbiAgICAgICAgICAgIHBhZGRpbmc6IDgsXG4gICAgICAgICAgICBib3JkZXJXaWR0aDogMCxcbiAgICAgICAgICAgIHBsYWNlSG9sZGVyOiAnMjAuMDAnLFxuICAgICAgICAgICAgdHlwZTogUGhhc2VySW5wdXQuSW5wdXRUeXBlLm51bWJlcixcbiAgICAgICAgICAgIGZpbGxBbHBoYTogMFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0Qm94LmFkZENoaWxkKHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkKTtcblxuICAgICAgICBjb25zdCBidG5UZXh0U3R5bGUgPSB7XG4gICAgICAgICAgICBcImZvbnRcIjogXCJib2xkIDIycHQgQXJpYWxcIixcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICAgICAgICBcImFsaWduXCI6IFwiY2VudGVyXCJcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FuY2VsID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIG1vZGFsQ29uZmlnLmNhbmNlbEJ1dHRvbi54LCBtb2RhbENvbmZpZy5jYW5jZWxCdXR0b24ueSwgdGhpcy5rZXksIHRoaXMuY2FuY2VsLCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbC5zZXRGcmFtZXMoXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X291dFwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X2Rvd25cIixcbiAgICAgICAgICAgIFwiYnRuX3NlY29uZGFyeV91cFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0VGV4dFN0eWxlKGJ0blRleHRTdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0VGV4dChcIkNBTkNFTFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLmFkZENoaWxkKHRoaXMuZGlzcGxheS5jYW5jZWwpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQgPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgbW9kYWxDb25maWcuc3VibWl0QnV0dG9uLngsIG1vZGFsQ29uZmlnLnN1Ym1pdEJ1dHRvbi55LCB0aGlzLmtleSwgdGhpcy5zdWJtaXQsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc3VibWl0LnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX3ByaW1hcnlfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9vdXRcIixcbiAgICAgICAgICAgIFwiYnRuX3ByaW1hcnlfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV91cFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0VGV4dFN0eWxlKGJ0blRleHRTdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0VGV4dChcIkJVWSBJTlwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLmFkZENoaWxkKHRoaXMuZGlzcGxheS5zdWJtaXQpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuc2VhdHNbcGxheWVyRGF0YS5zZWF0XS5vY2N1cGllZCA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHBsYXllckxlZnQocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLnNlYXRzW3BsYXllckRhdGEuc2VhdF0ub2NjdXBpZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgZm9yIChsZXQgc2VhdE51bSBpbiB0aGlzLnNlYXRzKSB7XG4gICAgICAgICAgICBsZXQgc2VhdCA9IHRoaXMuc2VhdHNbc2VhdE51bV07XG4gICAgICAgICAgICBzZWF0LmJ1dHRvbi52aXNpYmxlID0gIXNlYXQub2NjdXBpZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAudmlzaWJsZSA9IHRoaXMuYnV0dG9uc1Zpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgIH1cblxuICAgIGJ1dHRvbkNsaWNrZWQoYnV0dG9uKSB7XG4gICAgICAgIHRoaXMuZGF0YS5zZWF0TnVtID0gYnV0dG9uLnNlYXROdW07XG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBjYW5jZWwoKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHtcInNlYXROdW1cIjogbnVsbCwgXCJidXlJblwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHN1Ym1pdCgpIHtcbiAgICAgICAgdGhpcy5kYXRhLmJ1eUluID0gdGhpcy5kaXNwbGF5LmlucHV0RmllbGQudmFsdWU7XG4gICAgICAgIHRoaXMuYnV5SW5SZXF1ZXN0ZWQuZGlzcGF0Y2godGhpcy5kYXRhLnNlYXROdW0sIHRoaXMuZGF0YS5idXlJbik7XG4gICAgICAgIHRoaXMuZGF0YSA9IHtcInNlYXROdW1cIjogbnVsbCwgXCJidXlJblwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRCdXR0b25zVmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1eUluTWFuYWdlcjsiLCJpbXBvcnQgQ2FyZCBmcm9tIFwiLi4vY2xhc3Nlcy9DYXJkXCI7XG5cbmNsYXNzIENhcmRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuY2FyZHMgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShudW1fY2FyZHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fY2FyZHM7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNhcmQgPSBuZXcgQ2FyZCh0aGlzLmdhbWUsIHRoaXMpO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplKHt9KTtcbiAgICAgICAgICAgIGNhcmQuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICAgICAgdGhpcy5jYXJkcy5wdXNoKGNhcmQpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKGNhcmQuc3ByaXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFsaWduKC0xLCAxLCB0aGlzLmNhcmRzWzBdLnNwcml0ZS53aWR0aCAqIDEuMiwgMCk7XG4gICAgfVxuXG4gICAgc2V0Q2FyZE5hbWVzKG5hbWVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG5hbWVzW2ldO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLm5hbWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmRNYW5hZ2VyOyIsImNsYXNzIENoaXBNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXksIHZhbHVlcykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgICAgICAgdGhpcy5zdGFja0NoaXBzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb2xvclVwID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jaGlwcyA9IFtdO1xuICAgICAgICB0aGlzLnBvb2wgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IDA7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG5cbiAgICB9XG5cbiAgICBnZXRDaGlwKCkge1xuICAgICAgICBsZXQgY2hpcCA9IHRoaXMucG9vbC5wb3AoKTtcbiAgICAgICAgaWYgKCFjaGlwKSB7XG4gICAgICAgICAgICBjaGlwID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgdGhpcy5rZXkpO1xuICAgICAgICAgICAgY2hpcC5hbmdsZSA9IHRoaXMuZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoLTE4MCwgMTgwKTsgICAvLyBSYW5kb20gcm90YXRpb25cbiAgICAgICAgICAgIGNoaXAuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIH1cbiAgICAgICAgY2hpcC5yZXZpdmUoKTtcbiAgICAgICAgdGhpcy5jaGlwcy5wdXNoKGNoaXApO1xuICAgICAgICByZXR1cm4gY2hpcDtcbiAgICB9XG5cbiAgICBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMudmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbG9yVXApIHtcbiAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlIC09IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB0aGlzLnZhbHVlICs9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHlQb3MgPSAwO1xuICAgICAgICBsZXQgdmFsdWVzUHRyID0gdGhpcy52YWx1ZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgd2hpbGUgKHZhbHVlID49IDI1KSB7XG4gICAgICAgICAgICB3aGlsZSAodmFsdWUgPCB0aGlzLnZhbHVlc1t2YWx1ZXNQdHJdKSB7XG4gICAgICAgICAgICAgICAgdmFsdWVzUHRyLS07XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlc1B0ciA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgY2hpcCA9IHRoaXMuZ2V0Q2hpcCgpO1xuICAgICAgICAgICAgY2hpcC5mcmFtZU5hbWUgPSB0aGlzLnZhbHVlc1t2YWx1ZXNQdHJdLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnN0YWNrQ2hpcHMpIHtcbiAgICAgICAgICAgICAgICBjaGlwLnkgPSB5UG9zO1xuICAgICAgICAgICAgICAgIHlQb3MgLT0gNTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hpcHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoaXAueCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGNoaXAueSA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHZhcmlhdGlvbiA9IHRoaXMuZGlzcGxheUdyb3VwLndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgY2hpcC54ID0gdGhpcy5nYW1lLnJuZC5pbnRlZ2VySW5SYW5nZSgtdmFyaWF0aW9uLCB2YXJpYXRpb24pO1xuICAgICAgICAgICAgICAgICAgICBjaGlwLnkgPSB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKC12YXJpYXRpb24sIHZhcmlhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgLT0gdGhpcy52YWx1ZXNbdmFsdWVzUHRyXTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKGNoaXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIGxldCBjaGlwO1xuICAgICAgICB3aGlsZSAoY2hpcCA9IHRoaXMuY2hpcHMucG9wKCkpIHtcbiAgICAgICAgICAgIHRoaXMucG9vbC5wdXNoKGNoaXApO1xuICAgICAgICAgICAgY2hpcC5raWxsKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoaXBNYW5hZ2VyOyIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL2NsYXNzZXMvUGxheWVyXCI7XG5cbmNsYXNzIFBsYXllck1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVzZXJJZCwgc2VhdENvbmZpZywgY2hpcENvbmZpZykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IHVzZXJJZDtcbiAgICAgICAgdGhpcy5zZWF0Q29uZmlnID0gc2VhdENvbmZpZztcbiAgICAgICAgdGhpcy5jaGlwQ29uZmlnID0gY2hpcENvbmZpZztcblxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTsgIC8vIERpcmVjdCBhY2Nlc3MgdG8gdGhlIFBsYXllciBvYmplY3RzXG4gICAgICAgIHRoaXMudXNlclBsYXllciA9IG51bGw7ICAvLyBUaGUgdXNlcidzIHBsYXllciBvYmplY3QsIGlmIGF2YWlsYWJsZVxuICAgICAgICB0aGlzLm5leHRQbGF5ZXIgPSBudWxsOyAgLy8gVGhlIHBsYXllciB0aGF0IHRoZSBnYW1lIGV4cGVjdHMgdG8gYWN0IG5leHRcblxuICAgICAgICAvLyBDb250YWlucyBhbGwgZGlzcGxheSBlbGVtZW50cyBmb3IgYWxsIHBsYXllcnMgaW4gdGhlIGdhbWVcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5uZXdQbGF5ZXIocGxheWVyRGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXdQbGF5ZXIocGxheWVyRGF0YSkge1xuICAgICAgICBsZXQgcGxheWVyID0gbmV3IFBsYXllcih0aGlzLmdhbWUsIHRoaXMuY2hpcENvbmZpZyk7XG4gICAgICAgIHBsYXllci5pbml0aWFsaXplKHBsYXllckRhdGEpO1xuICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnggPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS54O1xuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnkgPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS55O1xuXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChwbGF5ZXIuZGlzcGxheUdyb3VwKTtcblxuICAgICAgICBpZiAocGxheWVyLnVzZXJJZCA9PT0gdGhpcy51c2VySWQpIHtcbiAgICAgICAgICAgIHRoaXMudXNlclBsYXllciA9IHBsYXllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgcGxheWVyTGVmdChwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLmdldEJ5SWQocGxheWVyRGF0YS5pZCk7XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCBmaW5kIHBsYXllciBhdCB0YWJsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAuZGVzdHJveSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1tpXSA9PT0gcGxheWVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbGF5ZXIgPT09IHRoaXMudXNlclBsYXllcikge1xuICAgICAgICAgICAgdGhpcy51c2VyUGxheWVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgZ2V0QnlJZChpZCkge1xuICAgICAgICAvLyBUT0RPIC0gRG8gdGhpcyB3aXRob3V0IGl0ZXJhdGluZyAtLSBidWlsZCBtYXAgb24gaW5pdD9cbiAgICAgICAgLy8gVE9ETyAtIFNob3VsZCB0aGlzIGV2ZXIgcmV0dXJuIG51bGw/XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IGEgbGlzdCBvZiBhbGwgb2NjdXBpZWQgc2VhdHMgYXQgdGhlIHRhYmxlXG4gICAgICogQHJldHVybnMge251bWJlcltdfSAtIFRoZSBJRHMgb2Ygb2NjdXBpZWQgc2VhdHNcbiAgICAgKi9cbiAgICBnZXRPY2N1cGllZFNlYXRzKCkge1xuICAgICAgICBsZXQgb2NjdXBpZWRTZWF0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb2NjdXBpZWRTZWF0cy5wdXNoKHRoaXMucGxheWVyc1tpXS5zZWF0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2NjdXBpZWRTZWF0cztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllck1hbmFnZXI7IiwiY29uc3QgaXNTdHJpbmcgPSB2YWwgPT4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG5jb25zdCBpc0Jsb2IgPSB2YWwgPT4gdmFsIGluc3RhbmNlb2YgQmxvYjtcblxucG9seWZpbGwuY2FsbCh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6IHRoaXMgfHwge30pO1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgaWYgKGlzU3VwcG9ydGVkLmNhbGwodGhpcykpIHJldHVybjtcblxuICBpZiAoISgnbmF2aWdhdG9yJyBpbiB0aGlzKSkgdGhpcy5uYXZpZ2F0b3IgPSB7fTtcbiAgdGhpcy5uYXZpZ2F0b3Iuc2VuZEJlYWNvbiA9IHNlbmRCZWFjb24uYmluZCh0aGlzKTtcbn07XG5cbmZ1bmN0aW9uIHNlbmRCZWFjb24odXJsLCBkYXRhKSB7XG4gIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudCAmJiB0aGlzLmV2ZW50LnR5cGU7XG4gIGNvbnN0IHN5bmMgPSBldmVudCA9PT0gJ3VubG9hZCcgfHwgZXZlbnQgPT09ICdiZWZvcmV1bmxvYWQnO1xuXG4gIGNvbnN0IHhociA9ICgnWE1MSHR0cFJlcXVlc3QnIGluIHRoaXMpID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcbiAgeGhyLm9wZW4oJ1BPU1QnLCB1cmwsICFzeW5jKTtcbiAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnKi8qJyk7XG5cblxuICBpZiAoaXNTdHJpbmcoZGF0YSkpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSAndGV4dC9wbGFpbic7XG4gIH0gZWxzZSBpZiAoaXNCbG9iKGRhdGEpICYmIGRhdGEudHlwZSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCBkYXRhLnR5cGUpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICB4aHIuc2VuZChkYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gIHJldHVybiAoJ25hdmlnYXRvcicgaW4gdGhpcykgJiYgKCdzZW5kQmVhY29uJyBpbiB0aGlzLm5hdmlnYXRvcik7XG59IiwiaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgQ29udHJvbGxlciBmcm9tIFwiLi4vY2xhc3Nlcy9Db250cm9sbGVyXCI7XG5cbmNsYXNzIEJvb3QgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbml0aWFsRGF0YSA9IHRoaXMuYXVnbWVudEluaXRpYWxEYXRhKGluaXRpYWxEYXRhKTtcbiAgICAgICAgdGhpcy5nYW1lLmNvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICAvLyBUT0RPIC0gVGhpcyBzaG91bGQgY29tZSBmcm9tIHNvbWV3aGVyZSBkeW5hbWljXG4gICAgICAgIHRoaXMuZ2FtZS5ydWxlcyA9IHtcbiAgICAgICAgICAgIGFudGU6IDAsXG4gICAgICAgICAgICBibGluZHM6IHtcbiAgICAgICAgICAgICAgICBzbWFsbDogMjUsXG4gICAgICAgICAgICAgICAgYmlnOiA1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcklkLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudG9rZW4pO1xuXG4gICAgICAgIGlmICh0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkKSB7XG4gICAgICAgICAgICB3aW5kb3cuZ2FtZSA9IHRoaXMuZ2FtZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibG9hZFwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAU3VtbWFyeSBDYWxjdWxhdGUgYWRkaXRpb25hbCB2YWx1ZXMgdG8gc3RvcmUgb24gZ2FtZS5pbml0aWFsRGF0YVxuICAgICAqXG4gICAgICogVG8gc2F2ZSBvbiBzZXJ2ZXItc2lkZSBwcm9jZXNzaW5nIGFuZCBkYXRhLXRyYW5zZmVyIGxvYWQsIHRoaXNcbiAgICAgKiBtZXRob2QgaXMgYSBwbGFjZSB0byBnZW5lcmF0ZSBhZGRpdGlvbmFsIGRhdGEgbmVlZGVkIGJ5IHRoZSBnYW1lXG4gICAgICogd2hpY2ggbWF5IGJlIGRlcml2ZWQgZnJvbSB0aGUgZGF0YSBzZW50IGZyb20gdGhlIGJhY2sgZW5kLlxuICAgICAqL1xuICAgIGF1Z21lbnRJbml0aWFsRGF0YShpbml0aWFsRGF0YSkge1xuICAgICAgICBpbml0aWFsRGF0YS5vY2N1cGllZFNlYXRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5pdGlhbERhdGEucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaW5pdGlhbERhdGEub2NjdXBpZWRTZWF0cy5wdXNoKGluaXRpYWxEYXRhLnBsYXllcnNbaV0uc2VhdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5pdGlhbERhdGE7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb290OyIsImNsYXNzIExvYWQgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIHByZWxvYWQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwiYmFja2dyb3VuZFwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2JhY2tncm91bmQucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcImRlYWxlckJ1dHRvblwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2RlYWxlcmJ1dHRvbi5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwicmVkQ2lyY2xlXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcmVkY2lyY2xlLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImNhcmRzXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcInBhbmVsXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcGFuZWwucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcGFuZWwuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImJ1eUluXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV5aW4ucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV5aW4uanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImNoaXBzXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2hpcHMucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2hpcHMuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcIm5hbWVwbGF0ZVwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL25hbWVwbGF0ZS5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9uYW1lcGxhdGUuanNvblwiKTtcblxuICAgICAgICB0aGlzLmdhbWUudGV4dHVyZXMgPSB0aGlzLmNyZWF0ZUN1c3RvbVRleHR1cmVzKCk7XG5cbiAgICAgICAgdGhpcy5sb2FkUGx1Z2lucygpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibWFpblwiKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDdXN0b21UZXh0dXJlcygpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0ge307XG5cbiAgICAgICAgbGV0IGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoNCwgMHgwMDAwMDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgxMDAsIDEwMCwgMTAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlU3F1YXJlXCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgMzAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlUmVjdFwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweDAwMDAwMCwgMC41KTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgdGhpcy5nYW1lLndpZHRoLCB0aGlzLmdhbWUuaGVpZ2h0KTtcbiAgICAgICAgdGV4dHVyZXNbXCJtb2RhbEJhY2tncm91bmRcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHgwMDAwMDAsIDAuNSk7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIDUwLCAzMCk7XG4gICAgICAgIHRleHR1cmVzW1widGV4dFVuZGVybGF5XCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICByZXR1cm4gdGV4dHVyZXM7XG4gICAgfVxuXG4gICAgbG9hZFBsdWdpbnMoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5hZGQucGx1Z2luKFBoYXNlcklucHV0LlBsdWdpbik7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkOyIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2NsYXNzZXMvQWN0aW9uLmpzXCI7XG5pbXBvcnQgQnV5SW5NYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9CdXlJbk1hbmFnZXJcIjtcbmltcG9ydCBDYXJkTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2FyZE1hbmFnZXJcIjtcbmltcG9ydCBQYW5lbCBmcm9tIFwiLi4vY2xhc3Nlcy9QYW5lbFwiO1xuaW1wb3J0IFBsYXllck1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL1BsYXllck1hbmFnZXJcIjtcbmltcG9ydCBQb3QgZnJvbSBcIi4uL2NsYXNzZXMvUG90XCI7XG5pbXBvcnQgUG9rZXIgZnJvbSBcIi4uL1Bva2VyXCI7XG5pbXBvcnQgU1NFIGZyb20gXCIuLi9TU0VcIjtcblxuY2xhc3MgTWFpbiBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlU1NFVXJsKTtcbiAgICAgICAgdGhpcy51c2VyX3NzZSA9IG5ldyBTU0UodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudXNlclNTRVVybCk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmxvYWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuZGlzY29ubmVjdEJlYWNvbigpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSB0aGlzLmdhbWUuYWRkLmltYWdlKDAsIDAsIFwiYmFja2dyb3VuZFwiKTtcbiAgICAgICAgdGhpcy5uZXdIYW5kQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMTAwLCBcIm5ld1xcbmhhbmRcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLm5ld0hhbmQpO1xuICAgICAgICB0aGlzLmRlYWxCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAyMjAsIFwiZGVhbFwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuZGVhbCk7XG4gICAgICAgIHRoaXMubGVhdmVCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAzNDAsIFwibGVhdmVcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmxlYXZlVGFibGUpO1xuICAgICAgICB0aGlzLmJiQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgNDYwLCBcIkJCXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5iYik7XG4gICAgICAgIHRoaXMuc2JCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCA1ODAsIFwiU0JcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLnNiKTtcblxuICAgICAgICBjb25zdCBudW1TZWF0cyA9IDEwOyAgICAvLyBUT0RPIC0gTWFrZSBkeW5hbWljXG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzID0gbmV3IFBsYXllck1hbmFnZXIodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudXNlcklkLCB0aGlzLmdhbWUuY29uZmlnLnNlYXRzW251bVNlYXRzXSwgdGhpcy5nYW1lLmNvbmZpZy5jaGlwc1tudW1TZWF0c10pO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVycy5pbml0aWFsaXplKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5wbGF5ZXJzLCB0aGlzLmdhbWUuY29uZmlnLnNlYXRzW251bVNlYXRzXSk7XG5cbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkID0gbmV3IENhcmRNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5pbml0aWFsaXplKDUpO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmNlbnRlclggPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWDtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5jZW50ZXJZID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclk7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBvdCA9IG5ldyBQb3QodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5jaGlwcy5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYOyAgICAgLy8gVE9ETyAtIFBvc2l0aW9ucyBpbiBjb25maWdcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5jaGlwcy5kaXNwbGF5R3JvdXAuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZIC0gMTQwO1xuXG4gICAgICAgIC8vIFRPRE8gLSBUaGVzZSBzaG91bGQgZ28gc29tZXdoZXJlIGVsc2UuIE1heWJlIGluIFBvdD9cbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbCA9IG5ldyBQYW5lbCh0aGlzLmdhbWUsIFwicGFuZWxcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueCA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLng7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueSA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLnk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5hbHdheXNWaXNpYmxlID0gdGhpcy5nYW1lLmluaXRpYWxEYXRhLmVtdWxhdG9yRW5hYmxlZDtcblxuICAgICAgICB0aGlzLmdhbWUuYnV5SW4gPSBuZXcgQnV5SW5NYW5hZ2VyKHRoaXMuZ2FtZSwgXCJidXlJblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLmluaXRpYWxpemUodGhpcy5nYW1lLmNvbmZpZy5zZWF0c1tudW1TZWF0c10sIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldE9jY3VwaWVkU2VhdHMoKSwgdGhpcy5nYW1lLmNvbmZpZy5idXlJbk1vZGFsKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnNldEJ1dHRvbnNWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIgPT09IG51bGwpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcnMoKTtcblxuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld0hhbmRcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdIYW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucG90LnNldEFtb3VudCgwKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY2FyZHMucmVzZXQoKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNEZWFsZXI6IHBsYXllci5pZCA9PT0gZGF0YS5kZWFsZXIsXG4gICAgICAgICAgICAgICAgICAgIGlzTmV4dDogcGxheWVyLmlkID09PSBkYXRhLm5leHQsXG4gICAgICAgICAgICAgICAgICAgIHJvdW5kQmV0OiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImRlYWxcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWFsOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldChQb2tlci5nZXRNaW5CZXQodGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5lbXVsYXRvckVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiZW11bGF0ZURlYWxcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVtdWxhdGVEZWFsOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXJEYXRhID0gZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChwbGF5ZXJEYXRhLnBsYXllcklkKS5jYXJkcy5zZXRDYXJkTmFtZXMocGxheWVyRGF0YS5ob2xkaW5ncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdSb3VuZFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1JvdW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXS51cGRhdGUoe3JvdW5kQmV0OiAwfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJhY3Rpb25cIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhY3Rpb246IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5zZXRDYXJkTmFtZXMoZGF0YS5ib2FyZCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLnBsYXllcklkKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgIGJhbGFuY2U6IGRhdGEucGxheWVyQmFsYW5jZSxcbiAgICAgICAgICAgICAgICBpc05leHQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJvdW5kQmV0OiBkYXRhLnBsYXllclJvdW5kQmV0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KS51cGRhdGUoe2lzTmV4dDogdHJ1ZX0pO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBvdC5zZXRBbW91bnQoZGF0YS5wb3QpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gZGF0YS5yb3VuZEJldDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gZGF0YS5yb3VuZFJhaXNlO1xuXG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KFBva2VyLmdldE1pbkJldCh0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImhhbmRDb21wbGV0ZVwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhhbmRDb21wbGV0ZTogXCIsIGRhdGEpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLndpbm5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgd2lubmVyID0gZGF0YS53aW5uZXJzW2ldO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQod2lubmVyLmlkKS51cGRhdGUoe2JhbGFuY2U6IHdpbm5lci5iYWxhbmNlfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucG90LmNoaXBzLmNsZWFyKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzW2ldLmNoaXBzLmNsZWFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1BsYXllclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3UGxheWVyOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXdQbGF5ZXIoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4ubmV3UGxheWVyKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnNldEJ1dHRvbnNWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIgPT09IG51bGwpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJwbGF5ZXJMZWZ0XCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwbGF5ZXJMZWZ0OiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJMZWZ0KGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnBsYXllckxlZnQoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4uc2V0QnV0dG9uc1Zpc2libGUodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllciA9PT0gbnVsbCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlLmFkZExpc3RlbmVyKFwiZGVhbFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVhbDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5jYXJkcy5zZXRDYXJkTmFtZXMoZGF0YS5ob2xkaW5ncyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwucHJpbWFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNlY29uZGFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnRlcnRpYXJ5Q2xpY2tlZC5hZGQodGhpcy5oYW5kbGVBY3Rpb24sIHRoaXMpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uYnV5SW5SZXF1ZXN0ZWQuYWRkKHRoaXMuZ2FtZS5jb250cm9sbGVyLmpvaW4sIHRoaXMuZ2FtZS5jb250cm9sbGVyKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJvdXRlIGFjdGlvbnMgdG8gY29udHJvbGxlciByZXF1ZXN0c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY3Rpb24gLSBUaGUgYWN0aW9uIHRvIGJlIHJlcXVlc3RlZCwgZGVmaW5lZCBpbiBBY3Rpb24uanNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmV0IC0gVGhlIGJldCAoaWYgYW55KSB0byBiZSBzZW50IHRvIHRoZSBjb250cm9sbGVyXG4gICAgICovXG4gICAgaGFuZGxlQWN0aW9uKGFjdGlvbiwgYmV0KSB7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5GT0xEOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmZvbGQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uLkNIRUNLOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5CRVQ6XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuYmV0KGJldCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkludmFsaWQgQWN0aW9uIFR5cGU6IFwiICsgYWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIG1ha2VCdG4oeCwgeSwgdGV4dCwgdGV4dHVyZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ0biA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKHgsIHksIHRleHR1cmUsIGNhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgYnRuLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIGxldCBidG5UZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDAsIHRleHQpO1xuICAgICAgICBidG5UZXh0LmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICBidG4uYWRkQ2hpbGQoYnRuVGV4dCk7XG4gICAgICAgIGJ0bi50ZXh0ID0gYnRuVGV4dDtcblxuICAgICAgICByZXR1cm4gYnRuO1xuICAgIH1cblxuICAgIGRlYWwoKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL3RhYmxlcy8nICsgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlTmFtZSArICcvZGVhbC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgbmV3SGFuZCgpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignUE9TVCcsICcvdGFibGVzLycgKyB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVOYW1lICsgJy9uZXctaGFuZC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfTtcblxuICAgIGxlYXZlVGFibGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmxlYXZlKCk7XG4gICAgfVxuXG4gICAgYmIoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmJiKCk7XG4gICAgfTtcblxuICAgIHNiKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5zYigpO1xuICAgIH07XG5cbiAgICBnZW5lcmF0ZUJldHMocGxheWVyUm91bmRCZXQsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIFBva2VyLmdlbmVyYXRlQmV0cygyNSwgNTAsIHRoaXMuZ2FtZS5yb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1haW47Il19
