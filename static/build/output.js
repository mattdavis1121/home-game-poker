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

},{"./states/Boot":20,"./states/Load":21,"./states/Main":22}],2:[function(require,module,exports){
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
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chip = function () {
    function Chip(game, key) {
        var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        _classCallCheck(this, Chip);

        this.game = game;
        this.key = key;
        this.value = value;
        this.sprite = this.game.add.sprite(0, 0, this.key);

        if (value !== 0) {
            this.setValue(value);
        }
    }

    _createClass(Chip, [{
        key: "setValue",
        value: function setValue(value) {
            this.value = value;
            this.sprite.frameName = value.toString();
        }
    }]);

    return Chip;
}();

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

},{"../Util":4,"./Action":5,"./Button":6,"./Slider":13}],11:[function(require,module,exports){
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

        this.display = {};
        this.displayGroup = this.game.add.group();

        this.cards = new _CardManager2.default(this.game);
        this.chips = new _ChipManager2.default(this.game, "chips", this.game.config.denoms);
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

            this.display.chips = this.chips.displayGroup;
            this.display.chips.x = this.chipConfig[this.seat].x;
            this.display.chips.y = this.chipConfig[this.seat].y;
            this.displayGroup.addChild(this.chips.displayGroup);

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
            this.roundBet = data.roundBet === undefined ? this.roundBet : data.roundBet;
            this.updateDisplay();
        }
    }]);

    return Player;
}();

exports.default = Player;

},{"../Util":4,"../managers/CardManager":16,"../managers/ChipManager":17}],12:[function(require,module,exports){
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

},{"../Util":4}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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
  }
}
},{}],15:[function(require,module,exports){
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

},{"../classes/Button":6}],16:[function(require,module,exports){
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

},{"../classes/Card":7}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Button = require("../classes/Button");

var _Button2 = _interopRequireDefault(_Button);

var _Chip = require("../classes/Chip");

var _Chip2 = _interopRequireDefault(_Chip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChipManager = function () {
    function ChipManager(game, key, values) {
        _classCallCheck(this, ChipManager);

        this.game = game;
        this.key = key;
        this.values = values;

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
        value: function getChip(value) {
            var chip = this.pool.pop();
            if (!chip) {
                chip = new _Chip2.default(this.game, this.key);
            }
            this.chips.push(chip);

            // chip.events.onKilled.add(this.recycleChip, this);

            chip.value = value;
            chip.frameName = value.toString();
            return chip;
        }
    }, {
        key: "setValue",
        value: function setValue(value) {
            this.value = value;
            var i = 0;
            var j = this.values.length - 1;
            while (value >= 25) {
                while (value < this.values[j]) {
                    j--;
                    if (j === 0) {
                        break;
                    }
                }
                var chip = this.game.add.sprite(0, i, this.key);
                chip.frameName = this.values[j].toString();
                chip.anchor.setTo(0.5);
                chip.angle = this.game.rnd.integerInRange(-180, 180);
                i -= 5;
                value -= this.values[j];
                this.displayGroup.addChild(chip);
            }
        }

        // clear() {
        //     let chip;
        //     while (chip = this.chips.pop()) {
        //         chip.kill();
        //     }
        // }
        //
        // recycleChip(chip) {
        //
        // }

    }]);

    return ChipManager;
}();

exports.default = ChipManager;

},{"../classes/Button":6,"../classes/Chip":8}],18:[function(require,module,exports){
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

},{"../classes/Player":11}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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
                console.log('test');
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

},{"../classes/Controller":9,"../config":14}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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
            this.game.pot.initializeDisplay();
            this.game.pot.sprite.centerX = this.game.world.centerX;
            this.game.pot.sprite.centerY = this.game.world.centerY - 140;

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

},{"../Poker":2,"../SSE":3,"../classes/Action.js":5,"../classes/Panel":10,"../classes/Pot":12,"../managers/BuyInManager":15,"../managers/CardManager":16,"../managers/PlayerManager":18}]},{},[1,19])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NoaXAuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQ29udHJvbGxlci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9QYW5lbC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9QbGF5ZXIuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUG90LmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1NsaWRlci5qcyIsInN0YXRpYy9zcmMvY29uZmlnLmpzb24iLCJzdGF0aWMvc3JjL21hbmFnZXJzL0J1eUluTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvQ2FyZE1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL0NoaXBNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9QbGF5ZXJNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9wb2x5ZmlsbHMvc2VuZGJlYWNvbi5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL0Jvb3QuanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Mb2FkLmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTSxJOzs7QUFDRixvQkFBYztBQUFBOztBQUFBLGdIQUNKO0FBQ0YsbUJBQU8sSUFETDtBQUVGLG9CQUFRO0FBRk4sU0FESTs7QUFNVixjQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBZixFQUF1Qixj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QUVBLG1CQUFPLEdBQVA7QUFDSDs7OytCQUVNO0FBQ0gsZ0JBQUksTUFBTSxJQUFJLGNBQUosRUFBVjtBQUNBLGdCQUFJLElBQUosQ0FBUyxNQUFULEVBQWlCLGFBQWEsS0FBSyxJQUFMLENBQVUsV0FBVixDQUFzQixTQUFuQyxHQUErQyxRQUFoRTtBQUNBLGdCQUFJLGdCQUFKLENBQXFCLGNBQXJCLEVBQXFDLGtCQUFyQztBQUNBLGdCQUFJLElBQUosQ0FBUyxLQUFLLFNBQUwsQ0FBZTtBQUNwQiwyQkFBVyxZQUFZO0FBREgsYUFBZixDQUFUO0FBR0g7OztrQ0FFUztBQUNOLGdCQUFJLE1BQU0sSUFBSSxjQUFKLEVBQVY7QUFDQSxnQkFBSSxJQUFKLENBQVMsTUFBVCxFQUFpQixhQUFhLEtBQUssSUFBTCxDQUFVLFdBQVYsQ0FBc0IsU0FBbkMsR0FBK0MsWUFBaEU7QUFDQSxnQkFBSSxnQkFBSixDQUFxQixjQUFyQixFQUFxQyxrQkFBckM7QUFDQSxnQkFBSSxJQUFKLENBQVMsS0FBSyxTQUFMLENBQWU7QUFDcEIsMkJBQVcsWUFBWTtBQURILGFBQWYsQ0FBVDtBQUdIOzs7cUNBRVk7QUFDVCxpQkFBSyxJQUFMLENBQVUsVUFBVixDQUFxQixLQUFyQjtBQUNIOzs7NkJBRUk7QUFDRCxpQkFBSyxJQUFMLENBQVUsVUFBVixDQUFxQixFQUFyQjtBQUNIOzs7NkJBRUk7QUFDRCxpQkFBSyxJQUFMLENBQVUsVUFBVixDQUFxQixFQUFyQjtBQUNIOzs7cUNBRVksYyxFQUFnQixhLEVBQWU7QUFDeEMsbUJBQU8sZ0JBQU0sWUFBTixDQUFtQixFQUFuQixFQUF1QixFQUF2QixFQUEyQixLQUFLLElBQUwsQ0FBVSxRQUFyQyxFQUErQyxjQUEvQyxFQUErRCxLQUFLLElBQUwsQ0FBVSxVQUF6RSxFQUFxRixhQUFyRixDQUFQO0FBQ0g7Ozs7RUEvTmMsT0FBTyxLOztrQkFrT1gsSSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBCb290IGZyb20gXCIuL3N0YXRlcy9Cb290XCI7XG5pbXBvcnQgTG9hZCBmcm9tIFwiLi9zdGF0ZXMvTG9hZFwiO1xuaW1wb3J0IE1haW4gZnJvbSBcIi4vc3RhdGVzL01haW5cIjtcblxuY2xhc3MgR2FtZSBleHRlbmRzIFBoYXNlci5HYW1lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgd2lkdGg6IDE5MjAsXG4gICAgICAgICAgICBoZWlnaHQ6IDEwODBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJib290XCIsIEJvb3QsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJsb2FkXCIsIExvYWQsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJtYWluXCIsIE1haW4sIGZhbHNlKTtcblxuICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KFwiYm9vdFwiKTtcbiAgICB9XG59XG5cbm5ldyBHYW1lKCk7IiwiLyoqXG4gKiBAc3VtbWFyeSBBIHV0aWxpdHkgY2xhc3Mgb2YgUG9rZXItc3BlY2lmaWMgZnVuY3Rpb25hbGl0eVxuICovXG5jbGFzcyBQb2tlciB7XG4gICAgLy8gVE9ETyAtIFRoaXMgdXRpbGl0eSBpcyBoaWdobHktc3BlY2lmaWMgdG8gTkwgZ2FtZXMsIG1heWJlIGV2ZW4gdG8gTkxIRS5cbiAgICAvLyAgTmVlZCB0byBtYWtlIGl0IG1vcmUgZ2VuZXJpYyBldmVudHVhbGx5IHRvIGFsbG93IGZvciBvdGhlciBnYW1lXG4gICAgLy8gIHR5cGVzLiBMaW1pdCBhbmQgcG90LWxpbWl0IGdhbWVzIHdpbGwgd29yayBjb21wbGV0ZWx5IGRpZmZlcmVudGx5LlxuICAgIC8vICBBbnRlcyBhcmUgYWxzbyBub3Qgc3VwcG9ydGVkLlxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2VuZXJhdGUgYWxsIGxlZ2FsIHJhaXNlcyBmb3IgcGxheWVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNtYWxsQmxpbmQgLSBUaGUgc21hbGwgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJpZ0JsaW5kIC0gVGhlIGJpZyBibGluZCBmb3IgdGhlIGdhbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm91bmRCZXQgLSBUaGUgbGVhZGluZyBiZXQgZm9yIHRoaXMgYmV0dGluZyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJSb3VuZEJldCAtIFRoZSBhbW91bnQgdGhpcyBwbGF5ZXIgaGFzIGNvbnRyaWJ1dGVkIHRvIHRoZSBwb3Qgc28gZmFyIHRoaXMgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJldlJhaXNlIC0gVGhlIGFtb3VudCB0aGUgcHJldmlvdXMgcmFpc2UgaW5jcmVhc2VkIHRoZSBiZXRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyQmFsYW5jZSAtIFRoZSBhbW91bnQgdGhlIHBsYXllciBoYXMgYXZhaWxhYmxlIHRvIGJldFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gLSBUaGUgdmFsaWQgcmFpc2VzXG4gICAgICovXG4gICAgc3RhdGljIGdlbmVyYXRlUmFpc2VzKHNtYWxsQmxpbmQsIGJpZ0JsaW5kLCByb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHByZXZSYWlzZSwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICBsZXQgcmFpc2UgPSBQb2tlci5nZXRNaW5SYWlzZShiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpO1xuICAgICAgICBsZXQgcmFpc2VzID0gW3JhaXNlXTtcblxuICAgICAgICB3aGlsZSAocmFpc2UgKyBzbWFsbEJsaW5kIDw9IHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgICAgIHJhaXNlICs9IHNtYWxsQmxpbmQ7XG4gICAgICAgICAgICByYWlzZXMucHVzaChyYWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmFpc2UgPCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgICAgICByYWlzZXMucHVzaChwbGF5ZXJCYWxhbmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByYWlzZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IHRoZSBtaW5pbXVtIGFsbG93YWJsZSBiZXQgZm9yIHBsYXllclxuICAgICAqXG4gICAgICogSWYgbm8gYmV0cyBoYXZlIG9jY3VycmVkIGluIGN1cnJlbnQgcm91bmQsIHRoZSBtaW4gYmV0IGlzIGFcbiAgICAgKiBjaGVjayAoYmV0IG9mIDApLCBvdGhlcndpc2UgaXQncyBhIGNhbGwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm91bmRCZXQgLSBUaGUgbGVhZGluZyBiZXQgZm9yIHRoaXMgYmV0dGluZyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJSb3VuZEJldCAtIFRoZSBhbW91bnQgdGhpcyBwbGF5ZXIgaGFzIGNvbnRyaWJ1dGVkIHRvIHRoZSBwb3Qgc28gZmFyIHRoaXMgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyQmFsYW5jZSAtIFRoZSBhbW91bnQgdGhlIHBsYXllciBoYXMgYXZhaWxhYmxlIHRvIGJldFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldE1pbkJldChyb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IG1pbkJldCA9IHJvdW5kQmV0ID09PSAwID8gMCA6IHJvdW5kQmV0IC0gcGxheWVyUm91bmRCZXQ7XG4gICAgICAgIGlmIChwbGF5ZXJCYWxhbmNlIDwgbWluQmV0KSB7XG4gICAgICAgICAgICBtaW5CZXQgPSBwbGF5ZXJCYWxhbmNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW5CZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IHRoZSBtaW5pbXVtIGFsbG93YWJsZSByYWlzZSBmb3IgcGxheWVyXG4gICAgICpcbiAgICAgKiBOT1RFOiBBIHJhaXNlIGhlcmUgbWF5IGFjdHVhbGx5IG1lYW4gYSBiZXQgaW4gcG9rZXIgdGVybXMuIEluIHRoZVxuICAgICAqIHBhcmxhbmNlIG9mIHRoaXMgdXRpbGl0eSwgYSByYWlzZSBpcyBhbiBhZ2dyZXNzaXZlIGFjdGlvbiwgb3Igc29tZXRoaW5nXG4gICAgICogd2hpY2ggd291bGQgZm9yY2Ugb3RoZXIgcGxheWVycyB0byBjb250cmlidXRlIG1vcmUgdG8gdGhlIHBvdCB0aGFuXG4gICAgICogdGhlIG90aGVyd2lzZSB3b3VsZCBoYXZlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJpZ0JsaW5kIC0gVGhlIGJpZyBibGluZCBmb3IgdGhlIGdhbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm91bmRCZXQgLSBUaGUgbGVhZGluZyBiZXQgZm9yIHRoaXMgYmV0dGluZyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJSb3VuZEJldCAtIFRoZSBhbW91bnQgdGhpcyBwbGF5ZXIgaGFzIGNvbnRyaWJ1dGVkIHRvIHRoZSBwb3Qgc28gZmFyIHRoaXMgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJldlJhaXNlIC0gVGhlIGFtb3VudCB0aGUgcHJldmlvdXMgcmFpc2UgaW5jcmVhc2VkIHRoZSBiZXRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyQmFsYW5jZSAtIFRoZSBhbW91bnQgdGhlIHBsYXllciBoYXMgYXZhaWxhYmxlIHRvIGJldFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldE1pblJhaXNlKGJpZ0JsaW5kLCByb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHByZXZSYWlzZSwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICBsZXQgbWluUmFpc2UgPSByb3VuZEJldCA9PT0gMCA/IGJpZ0JsaW5kIDogcm91bmRCZXQgLSBwbGF5ZXJSb3VuZEJldCArIHByZXZSYWlzZTtcbiAgICAgICAgaWYgKHBsYXllckJhbGFuY2UgPCBtaW5SYWlzZSkge1xuICAgICAgICAgICAgbWluUmFpc2UgPSBwbGF5ZXJCYWxhbmNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW5SYWlzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBva2VyOyIsImNsYXNzIFNTRSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgdXJsKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSh0aGlzLnVybCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgUmUgYWRkcyBhbGwgbGlzdGVuZXJzIHRvIHRoaXMuc291cmNlXG4gICAgICpcbiAgICAgKiBJIG9yaWdpbmFsbHkgd3JvdGUgdGhpcyB0byBzdXBwb3J0IGNsaWVudCByZWNvbm5lY3RzLCBidXQgSSBkb24ndCBuZWVkXG4gICAgICogdGhhdCBhbnltb3JlLiBLZWVwaW5nIHRoZSBsaXN0ZW5lciBjb2RlIGp1c3QgaW4gY2FzZS5cbiAgICAgKi9cbiAgICByZUFkZEFsbExpc3RlbmVycygpIHtcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzO1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihsaXN0ZW5lci50eXBlLCBsaXN0ZW5lci5jYWxsYmFjaywgbGlzdGVuZXIuY2FsbGJhY2tDb250ZXh0LCAuLi5saXN0ZW5lci5hcmdzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gU3RvcmUgbGlzdGVuZXJzIGZvciBldmVudHVhbCByZWNvbm5lY3RcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMucHVzaCh7XG4gICAgICAgICAgICBcInR5cGVcIjogdHlwZSxcbiAgICAgICAgICAgIFwiY2FsbGJhY2tcIjogY2FsbGJhY2ssXG4gICAgICAgICAgICBcImNhbGxiYWNrQ29udGV4dFwiOiBjYWxsYmFja0NvbnRleHQsXG4gICAgICAgICAgICBcImFyZ3NcIjogYXJnc1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNvdXJjZS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjYWxsYmFja0NvbnRleHQsIC4uLmFyZ3MsIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTU0U7IiwiY2xhc3MgVXRpbCB7XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgUmV0dXJuIGEgZm9ybWF0dGVkIGN1cnJlbmN5IHN0cmluZyBmcm9tIGFuIGludGVnZXJcbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2VDdXJyZW5jeShpbnQpIHtcbiAgICAgICAgbGV0IHZhbCA9IGludCAvIDEwMDtcbiAgICAgICAgcmV0dXJuIFwiJFwiICsgdmFsLnRvRml4ZWQoMik7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVdGlsOyIsImNvbnN0IEFjdGlvbiA9IHtcbiAgICBCTElORDogMCxcbiAgICBGT0xEOiAxLFxuICAgIENIRUNLOiAyLFxuICAgIEJFVDogM1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQWN0aW9uOyIsIi8qKlxuICogQSBQaGFzZXIuQnV0dG9uIHdpdGggYSBQaGFzZXIuVGV4dCBjZW50ZXJlZCBvbiB0aGUgYnV0dG9uXG4gKlxuICogVGhpcyBjbGFzcyBpcyBtZXJlbHkgYSB0aGluIHdyYXBwZXIgYXJvdW5kIFBoYXNlci5CdXR0b24gdG8gYWxsb3cgZm9yXG4gKiBlYXN5IHVzZSBvZiBhIHRleHQgbGFiZWwgb24gdGhlIGJ1dHRvbi4gVGhlIHRleHQgaXMgYSBjaGlsZCBvZiB0aGUgYnV0dG9uLFxuICogc28gaXQgbW92ZXMgd2hlbiB0aGUgYnV0dG9uIG1vdmVzLiBJdCdzIGNlbnRlcmVkIG9uIHRoZSBidXR0b24gYW5kIHNjYWxlc1xuICogYXV0b21hdGljYWxseSB0byBmaXggd2l0aGluIHRoZSBidXR0b24ncyBib3VuZHMuXG4gKlxuICogSWYgbm9uZSBvZiB0aGUgbGFiZWwgZnVuY3Rpb25hbGl0eSBpcyB1c2VkLCB0aGlzIGNsYXNzIGlzIGlkZW50aWNhbCB0b1xuICogUGhhc2VyLkJ1dHRvbi5cbiAqL1xuY2xhc3MgQnV0dG9uIGV4dGVuZHMgUGhhc2VyLkJ1dHRvbiB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwga2V5LCBjYWxsYmFjaywgY2FsbGJhY2tjb250ZXh0LCBvdmVyRnJhbWUsIG91dEZyYW1lLCBkb3duRnJhbWUsIHVwRnJhbWUpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwga2V5LCBjYWxsYmFjaywgY2FsbGJhY2tjb250ZXh0LCBvdmVyRnJhbWUsIG91dEZyYW1lLCBkb3duRnJhbWUsIHVwRnJhbWUpO1xuXG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubGFiZWxQYWRkaW5nID0gMTA7XG4gICAgICAgIHRoaXMubGFiZWxUZXh0ID0gXCJcIjtcbiAgICAgICAgdGhpcy5sYWJlbFN0eWxlID0ge307XG4gICAgICAgIHRoaXMubGFiZWwgPSBuZXcgUGhhc2VyLlRleHQodGhpcy5nYW1lLCAwLCAwLCB0aGlzLmxhYmVsVGV4dCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5sYWJlbCk7XG5cbiAgICAgICAgLy8gTXVzdCBhZGQgdG8gZ2FtZSB3b3JsZCBtYW51YWxseSBpZiBub3QgdXNpbmcgZ2FtZS5hZGQuYnV0dG9uXG4gICAgICAgIHRoaXMuZ2FtZS53b3JsZC5hZGQodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSB0ZXh0IGRpc3BsYXllZCBvbiB0aGUgYnV0dG9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBkaXNwbGF5XG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFRleHQodGV4dCwgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsVGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMudXBkYXRlTGFiZWwoZm9yY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgc3R5bGUgZm9yIHRoZSBidXR0b24gdGV4dFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZSAtIFRoZSB0ZXh0IHN0eWxlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSBkaXNwbGF5IHVwZGF0ZSBkZXNwaXRlIG9mIHRoaXMuZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRUZXh0U3R5bGUoc3R5bGUsIGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5sYWJlbFN0eWxlID0gc3R5bGU7XG4gICAgICAgIHRoaXMudXBkYXRlTGFiZWwoZm9yY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgcGFkZGluZyBiZXR3ZWVuIHRoZSB0ZXh0IGFuZCB0aGUgYnV0dG9uIHBlcmltZXRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYWRkaW5nIC0gVGhlIHBhZGRpbmcgaW4gcGl4ZWxzXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFBhZGRpbmcocGFkZGluZywgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsUGFkZGluZyA9IHBhZGRpbmc7XG4gICAgICAgIHRoaXMudXBkYXRlTGFiZWwoZm9yY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIHRoZSBidXR0b25cbiAgICAgKiBPbiBkaXNhYmxlLCBkaXNhYmxlcyBhbGwgaW5wdXQgdG8gdGhlIGJ1dHRvbiBhbmQgcmVuZGVycyBpdCBncmF5ZWRcbiAgICAgKiBvdXQuIEFsbCB1cGRhdGVzIGFyZSBkZWxheWVkIHVudGlsIHJlLWVuYWJsZSwgdW5sZXNzIGZvcmNlZC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBFbmFibGUgb3IgZGlzYWJsZSBidXR0b24/XG4gICAgICovXG4gICAgc2V0RW5hYmxlZChlbmFibGVkKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgIHRoaXMuaW5wdXRFbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgbGV0IHRpbnQgPSBlbmFibGVkID8gMHhGRkZGRkYgOiAweDgwODA4MDtcbiAgICAgICAgdGhpcy50aW50ID0gdGludDtcbiAgICAgICAgdGhpcy5sYWJlbC50aW50ID0gdGludDtcblxuICAgICAgICAvLyBVcGRhdGUgb24gcmUtZW5hYmxlXG4gICAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBVcGRhdGUgYWxsIGJ1dHRvbiBhdHRyaWJ1dGVzIHRvIGN1cnJlbnQgcHJvcGVydGllc1xuICAgICAqXG4gICAgICogSWYgdGhlIGJ1dHRvbiBpcyBkaXNhYmxlZCwgdGhpcyB3aWxsIGhhdmUgbm8gZWZmZWN0LiBUaGVcbiAgICAgKiBkZXZlbG9wZXIgbWF5IG9wdGlvbmFsbHkgY2hvb3NlIHRvIGZvcmNlIHRoZSB1cGRhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgdGhlIHVwZGF0ZT9cbiAgICAgKi9cbiAgICB1cGRhdGVMYWJlbChmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWQgfHwgZm9yY2UpIHtcbiAgICAgICAgICAgIHRoaXMubGFiZWwudGV4dCA9IHRoaXMubGFiZWxUZXh0O1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5zZXRTdHlsZSh0aGlzLmxhYmVsU3R5bGUpO1xuICAgICAgICAgICAgdGhpcy5yZVBvc0xhYmVsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTY2FsZSBsYWJlbCB0ZXh0IHRvIGZpdCBvbiBidXR0b24gYW5kIGNlbnRlclxuICAgICAqL1xuICAgIHJlUG9zTGFiZWwoKSB7XG4gICAgICAgIHRoaXMubGFiZWwuc2NhbGUuc2V0VG8oMSk7XG4gICAgICAgIGNvbnN0IHRleHRBcmVhSCA9IHRoaXMud2lkdGggLSB0aGlzLmxhYmVsUGFkZGluZyAqIDI7XG4gICAgICAgIGNvbnN0IHRleHRBcmVhViA9IHRoaXMuaGVpZ2h0IC0gdGhpcy5sYWJlbFBhZGRpbmcgKiAyO1xuICAgICAgICBpZiAodGhpcy5sYWJlbC53aWR0aCA+IHRleHRBcmVhSCB8fCB0aGlzLmxhYmVsLmhlaWdodCA+IHRleHRBcmVhVikge1xuICAgICAgICAgICAgY29uc3QgcmVkdWNlZFNjYWxlSCA9IHRleHRBcmVhSCAvIHRoaXMubGFiZWwud2lkdGg7XG4gICAgICAgICAgICBjb25zdCByZWR1Y2VkU2NhbGVWID0gdGV4dEFyZWFWIC8gdGhpcy5sYWJlbC5oZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnNjYWxlLnNldFRvKE1hdGgubWluKHJlZHVjZWRTY2FsZUgsIHJlZHVjZWRTY2FsZVYpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhYmVsLmNlbnRlclggPSB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgdGhpcy5sYWJlbC5jZW50ZXJZID0gdGhpcy5oZWlnaHQgLyAyO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBCdXR0b247IiwiY2xhc3MgQ2FyZCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgbWFuYWdlcikge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsOyAgIC8vIFN0cmluZyBJRCBvZiBjYXJkLCBlLmcuICdLaCcgb3IgJzdzJ1xuICAgICAgICB0aGlzLnNwcml0ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCBcImNhcmRzXCIpO1xuICAgICAgICB0aGlzLnNwcml0ZS5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5zcHJpdGUuc2NhbGUuc2V0VG8oMS41KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZU5hbWUgPSB0aGlzLm5hbWUgPyB0aGlzLm5hbWUgOiBcImJhY2tcIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmQ7IiwiY2xhc3MgQ2hpcCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5LCB2YWx1ZSA9IDApIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCB0aGlzLmtleSk7XG5cbiAgICAgICAgaWYgKHZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5zcHJpdGUuZnJhbWVOYW1lID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoaXA7IiwiY2xhc3MgQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgcGxheWVySWQsIHRva2VuKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgYWNjZXNzIHRva2VuIHVzZWQgdG8gYXV0aGVudGljYXRlIG9uIEFQSSBjYWxsc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIFRoZSBGbGFzay1KV1QtRXh0ZW5kZWQgYWNjZXNzIHRva2VuXG4gICAgICovXG4gICAgc2V0VG9rZW4odG9rZW4pIHtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICAgKlxuICAgICAqIE9ubHkgZXJyb3JzIGFyZSByZXBvcnRlZC4gU3VjY2VzcyBpcyBzaWxlbnQuIEdhbWUgY2hhbmdlcyByZXN1bHRpbmdcbiAgICAgKiBmcm9tIHJlcXVlc3RzIGFyZSBoYW5kbGVkIHZpYSBTZXJ2ZXIgU2VudCBFdmVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW5kcG9pbnQgLSBUaGUgZW5kcG9pbnQgb24gdGhlIHNlcnZlciB0byBzZW5kIHJlcXVlc3QgdG9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIFRoZSBwYXlsb2FkIHRvIHNlbmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZD1cIlBPU1RdIC0gVGhlIEhUVFAgbWV0aG9kIHRvIHVzZVxuICAgICAqL1xuICAgIHNlbmRSZXF1ZXN0KGVuZHBvaW50LCBkYXRhLCBtZXRob2QgPSBcIlBPU1RcIikge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKG1ldGhvZCwgZW5kcG9pbnQpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIGxldCByZXNwID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAvLyBJbnZhbGlkIHJlcXVlc3QgZXJyb3JcbiAgICAgICAgICAgICAgICBpZiAocmVzcC5zdWNjZXNzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4ocmVzcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCAmJiB4aHIuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAvLyBGYWlsZWQgcmVxdWVzdCBlcnJvclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIHRoaXMudG9rZW4pO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhbiBhY3Rpb24gcmVxdWVzdFxuICAgICAqXG4gICAgICogVGhpcyBpcyB0aGUgbW9zdCBoZWF2aWx5LXVzZWQgcmVxdWVzdCB0eXBlIGluIHRoZSBnYW1lLiBBbGwgaW4tZ2FtZVxuICAgICAqIGFjdGlvbnMgKGJldCwgY2hlY2ssIGZvbGQpIGhhcHBlbiBoZXJlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgLSBUaGUgcGF5bG9hZCB0byBzZW5kXG4gICAgICovXG4gICAgYWN0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImFjdGlvblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGNoZWNrKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJDSEVDS1wiKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgYmV0KGFtdCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJCRVRcIiwgYW10KTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgZm9sZCgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiRk9MRFwiKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgYmIoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJMSU5EXCIsIDUwKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgc2IoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJMSU5EXCIsIDI1KTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgam9pbihzZWF0TnVtLCBidXlJbikge1xuICAgICAgICBjb25zdCBkYXRhID0ge1wicG9zaXRpb25cIjogc2VhdE51bSwgXCJhbW91bnRcIjogYnV5SW59O1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiam9pblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGxlYXZlKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJsZWF2ZVwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSBiZWFjb24gdG8gdGhlIHNlcnZlciBvbiBkaXNjb25uZWN0XG4gICAgICpcbiAgICAgKiBUaGlzIGFsbG93cyBmb3Igc2VydmVyIHRvIGtub3cgd2hlbiBhIGNsaWVudCBkaXNjb25uZWN0cyBzb1xuICAgICAqIGl0IGNhbiBjbGVhbiB1cCBhcyBuZWNlc3NhcnkuIE5vIGd1YXJhbnRlZSB0aGF0IHRoaXMgbWVzc2FnZVxuICAgICAqIHdpbGwgZ28gdGhyb3VnaCwgc28gbXVzdCBoYXZlIHJlZHVuZGFudCBtZWFzdXJlcyBpbiBwbGFjZS5cbiAgICAgKi9cbiAgICBkaXNjb25uZWN0QmVhY29uKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0IHVybCA9IFwiL2Rpc2Nvbm5lY3QvXCI7XG4gICAgICAgIG5hdmlnYXRvci5zZW5kQmVhY29uKHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgYnVpbGRQYXlsb2FkKGFjdGlvblR5cGUsIGJldEFtdCA9IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwicGxheWVySWRcIjogdGhpcy5wbGF5ZXJJZCxcbiAgICAgICAgICAgIFwiYWN0aW9uVHlwZVwiOiBhY3Rpb25UeXBlLFxuICAgICAgICAgICAgXCJiZXRBbXRcIjogYmV0QW10XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBidWlsZFVybChlbmRwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlVXJsICsgZW5kcG9pbnQgKyBcIi9cIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXI7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4vQnV0dG9uXCI7XG5pbXBvcnQgU2xpZGVyIGZyb20gXCIuL1NsaWRlclwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuY2xhc3MgUGFuZWwge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5iZXRzID0gWzBdO1xuICAgICAgICB0aGlzLnByaW1hcnlDbGlja2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5wcmltYXJ5QWN0aW9uID0gQWN0aW9uLkJFVDtcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gMDtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlDbGlja2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlBY3Rpb24gPSBBY3Rpb24uQ0hFQ0s7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QmV0ID0gMDtcbiAgICAgICAgdGhpcy50ZXJ0aWFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnRlcnRpYXJ5QWN0aW9uID0gQWN0aW9uLkZPTEQ7XG4gICAgICAgIHRoaXMuc2xpZGVyID0gbmV3IFNsaWRlcih0aGlzLmdhbWUsIFwicGFuZWxcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWx3YXlzVmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5wcmltYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDAsIDAsIFwibWVkXCIsICgpID0+IHRoaXMucHJpbWFyeUNsaWNrZWQuZGlzcGF0Y2godGhpcy5wcmltYXJ5QWN0aW9uLCB0aGlzLnByaW1hcnlCZXQpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNlY29uZGFyeSA9IHRoaXMubWFrZUJ1dHRvbigxMzUsIDAsIFwibWVkXCIsICgpID0+IHRoaXMuc2Vjb25kYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnNlY29uZGFyeUFjdGlvbiwgdGhpcy5zZWNvbmRhcnlCZXQpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRlcnRpYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDI3MCwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy50ZXJ0aWFyeUNsaWNrZWQuZGlzcGF0Y2godGhpcy50ZXJ0aWFyeUFjdGlvbiwgMCkpO1xuXG4gICAgICAgIHRoaXMuc2xpZGVyLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuc2xpZGVyLmluZGV4Q2hhbmdlZC5hZGQoKGluZGV4KSA9PiB0aGlzLnNldFByaW1hcnlCZXQodGhpcy5iZXRzW2luZGV4XSksIHRoaXMpO1xuICAgICAgICB0aGlzLnNsaWRlci5zbGlkZXJXaGVlbC5hZGQodGhpcy5zaW5nbGVTdGVwQmV0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNsaWRlciA9IHRoaXMuc2xpZGVyLmJhcjtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNsaWRlci55ID0gNjA7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5wcmltYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zZWNvbmRhcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnRlcnRpYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zbGlkZXIpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG1ha2VCdXR0b24oeCwgeSwgc2l6ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ1dHRvbiA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCB4LCB5LCB0aGlzLmtleSk7XG4gICAgICAgIGJ1dHRvbi5vbklucHV0VXAuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgYnV0dG9uLnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX292ZXJcIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX291dFwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfdXBcIlxuICAgICAgICApO1xuICAgICAgICBidXR0b24uc2V0VGV4dFN0eWxlKHRoaXMuZ2FtZS5jb25maWcucGFuZWwudGV4dFN0eWxlKTtcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICAvLyBQYW5lbCB1cGRhdGVzIHJlcXVpcmUgcGxheWVycycgY3VycmVudCBiZXRzLCBzbyBpZlxuICAgICAgICAvLyB0aGVyZSBpcyBubyBuZXh0IHBsYXllciB3ZSBzaG91bGRuJ3QgdXBkYXRlIHRoZSBkaXNwbGF5XG4gICAgICAgIGlmICghdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFjdGlvblRleHQgPSB0aGlzLmdhbWUucm91bmRCZXQgPT09IDAgPyBcIkJFVCBcIiA6IFwiUkFJU0UgVE9cXG5cIjtcbiAgICAgICAgbGV0IHByaW1hcnlUZXh0ID0gYWN0aW9uVGV4dCArIFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLnByaW1hcnlCZXQgKyB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuc2V0VGV4dChwcmltYXJ5VGV4dCk7XG5cbiAgICAgICAgbGV0IHNlY29uZGFyeVRleHQgPSBcIkNIRUNLXCI7XG4gICAgICAgIGlmICh0aGlzLnNlY29uZGFyeUFjdGlvbiAhPT0gQWN0aW9uLkNIRUNLKSB7XG4gICAgICAgICAgICBzZWNvbmRhcnlUZXh0ID0gXCJDQUxMIFwiICsgVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuc2Vjb25kYXJ5QmV0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5LnNldFRleHQoc2Vjb25kYXJ5VGV4dCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnRlcnRpYXJ5LnNldFRleHQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xuICAgIH1cblxuICAgIHNldEJldHMoYmV0cykge1xuICAgICAgICBpZiAoYmV0cy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBiZXRzLiBQYW5lbCBtdXN0IGFsd2F5cyBoYXZlIGF0IGxlYXN0IG9uZSB2YWxpZCBiZXQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iZXRzID0gYmV0cztcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0c1swXTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0TGVuZ3RoKGJldHMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoMCk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNldEVuYWJsZWQoYmV0cy5sZW5ndGggPiAxKTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc2V0UHJpbWFyeUJldChiZXQpIHtcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRTZWNvbmRhcnlCZXQoYmV0KSB7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QmV0ID0gYmV0O1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IGJldCA9PT0gMCA/IEFjdGlvbi5DSEVDSyA6IEFjdGlvbi5CRVQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEhpZGUgb3Igc2hvdyB0aGUgZW50aXJlIHBhbmVsXG4gICAgICogQHBhcmFtIHtib29sZWFufSB2aXNpYmxlXG4gICAgICovXG4gICAgc2V0VmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGUgfHwgdGhpcy5hbHdheXNWaXNpYmxlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBJbmNyZW1lbnQgb3IgZGVjcmVtZW50IHRoaXMucHJpbWFyeUJldFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLk1vdXNlLndoZWVsRGVsdGF9IG1vZGlmaWVyIC0gKzEgb3IgLTFcbiAgICAgKi9cbiAgICBzaW5nbGVTdGVwQmV0KG1vZGlmaWVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuc2xpZGVyLmluZGV4ICsgbW9kaWZpZXI7XG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDw9IHRoaXMuc2xpZGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYW5lbDsiLCJpbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuaW1wb3J0IENoaXBNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DaGlwTWFuYWdlclwiO1xuXG5jbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGNoaXBDb25maWcpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5jaGlwQ29uZmlnID0gY2hpcENvbmZpZztcblxuICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBudWxsO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBudWxsO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBudWxsO1xuICAgICAgICB0aGlzLnNlYXQgPSBudWxsO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gMDsgIC8vIFN1bSBiZXRzIGJ5IHBsYXllciBpbiBjdXJyZW50IGJldHRpbmcgcm91bmRcblxuICAgICAgICB0aGlzLmlzRGVhbGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNOZXh0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuXG4gICAgICAgIHRoaXMuY2FyZHMgPSBuZXcgQ2FyZE1hbmFnZXIodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5jaGlwcyA9IG5ldyBDaGlwTWFuYWdlcih0aGlzLmdhbWUsIFwiY2hpcHNcIiwgdGhpcy5nYW1lLmNvbmZpZy5kZW5vbXMpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoZGF0YSkge1xuICAgICAgICB0aGlzLmlkID0gZGF0YS5pZDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBkYXRhLnVzZXJJZDtcbiAgICAgICAgdGhpcy5iYWxhbmNlID0gZGF0YS5iYWxhbmNlO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBkYXRhLnNpdHRpbmdPdXQ7XG4gICAgICAgIHRoaXMuc2VhdCA9IGRhdGEuc2VhdDtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICB0aGlzLmlzVXNlciA9IGRhdGEuaXNVc2VyO1xuXG4gICAgICAgIHRoaXMuY2FyZHMuaW5pdGlhbGl6ZSgyKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhY2tncm91bmQgPSB0aGlzLmRpc3BsYXlHcm91cC5jcmVhdGUoMCwgMCwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlUmVjdCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIC0yMCwgXCJcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5Lm5hbWUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDIwLCBcIlwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuYmFsYW5jZSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzID0gdGhpcy5jYXJkcy5kaXNwbGF5R3JvdXA7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcy5jZW50ZXJYID0gMDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLmNlbnRlclkgPSAtMTIwO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmNhcmRzKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgXCJkZWFsZXJCdXR0b25cIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24ubGVmdCA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLmxlZnQgKyA1O1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmJvdHRvbSA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLmJvdHRvbSAtIDU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwicmVkQ2lyY2xlXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvci5yaWdodCA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLnJpZ2h0IC0gNTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IuYm90dG9tID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQuYm90dG9tIC0gNTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMgPSB0aGlzLmNoaXBzLmRpc3BsYXlHcm91cDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNoaXBzLnggPSB0aGlzLmNoaXBDb25maWdbdGhpcy5zZWF0XS54O1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMueSA9IHRoaXMuY2hpcENvbmZpZ1t0aGlzLnNlYXRdLnk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKHRoaXMuY2hpcHMuZGlzcGxheUdyb3VwKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS50ZXh0ID0gdGhpcy5uYW1lO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS50ZXh0ID0gVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuYmFsYW5jZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24udmlzaWJsZSA9IHRoaXMuaXNEZWFsZXIgPT09IHRydWU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yLnZpc2libGUgPSB0aGlzLmlzTmV4dCA9PT0gdHJ1ZTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZGF0YSkge1xuICAgICAgICAvLyBUT0RPIC0gRmxlc2ggb3V0IHRoZSByZXN0IG9mIHRoZSBkYXRhIC0tIGRvIEkgbGlrZSB0aGlzIG1ldGhvZD9cbiAgICAgICAgdGhpcy5iYWxhbmNlID0gZGF0YS5iYWxhbmNlID09PSB1bmRlZmluZWQgPyB0aGlzLmJhbGFuY2UgOiBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuaXNEZWFsZXIgPSBkYXRhLmlzRGVhbGVyID09PSB1bmRlZmluZWQgPyB0aGlzLmlzRGVhbGVyIDogZGF0YS5pc0RlYWxlcjtcbiAgICAgICAgdGhpcy5pc05leHQgPSBkYXRhLmlzTmV4dCA9PT0gdW5kZWZpbmVkID8gdGhpcy5pc05leHQgOiBkYXRhLmlzTmV4dDtcbiAgICAgICAgdGhpcy5yb3VuZEJldCA9IGRhdGEucm91bmRCZXQgPT09IHVuZGVmaW5lZCA/IHRoaXMucm91bmRCZXQgOiBkYXRhLnJvdW5kQmV0O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjsiLCJpbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuXG5jbGFzcyBQb3Qge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5hbW91bnQgPSAwO1xuICAgICAgICB0aGlzLnNwcml0ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gdGhpcy5tYWtlQnRuKDAsIDAsIFwiXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVJlY3QsICgpID0+IHt9KTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUudGV4dC50ZXh0ID0gVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuYW1vdW50KTtcbiAgICB9XG5cbiAgICBzZXRBbW91bnQoYW1vdW50KSB7XG4gICAgICAgIHRoaXMuYW1vdW50ID0gYW1vdW50O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBtYWtlQnRuKHgsIHksIHRleHQsIHRleHR1cmUsIGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQgPSB0aGlzKSB7XG4gICAgICAgIGxldCBidG4gPSB0aGlzLmdhbWUuYWRkLmJ1dHRvbih4LCB5LCB0ZXh0dXJlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0KTtcbiAgICAgICAgYnRuLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIGxldCBidG5UZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDAsIHRleHQpO1xuICAgICAgICBidG5UZXh0LmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICBidG4uYWRkQ2hpbGQoYnRuVGV4dCk7XG4gICAgICAgIGJ0bi50ZXh0ID0gYnRuVGV4dDtcblxuICAgICAgICByZXR1cm4gYnRuO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG90OyIsIi8qKlxuICogQSBzbGlkZXIgVUkgZWxlbWVudFxuICpcbiAqIFJlcHJlc2VudGVkIGJ5IGEgYmFyIHNwcml0ZSBhbmQgYSBtYXJrZXIgc3ByaXRlLiBEZXNwaXRlIGhvdyBpdCBtYXlcbiAqIGxvb2ssIGFsbCBpbnB1dCBvY2N1cnMgb24gdGhlIGJhciBhbmQgdXBkYXRlcyBhcmUgbWFkZSB0byB0aGVcbiAqIG1hcmtlcidzIHBvc2l0aW9uIGJhc2VkIG9uIHRob3NlIGlucHV0cy5cbiAqL1xuY2xhc3MgU2xpZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXkpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuYmFyID0gbnVsbDsgIC8vIFRoZSBzbGlkZXIgYmFyIHNwcml0ZVxuICAgICAgICB0aGlzLm1hcmtlciA9IG51bGw7ICAvLyBUaGUgZHJhZ2dhYmxlIG1hcmtlciBzcHJpdGVcbiAgICAgICAgdGhpcy5pbmRleCA9IDA7ICAvLyBDdXJyZW50IGluZGV4IG9mIG1hcmtlclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDE7ICAvLyBUb3RhbCBudW1iZXIgb2YgaW5kaWNlc1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7fTtcbiAgICAgICAgdGhpcy5pbmRleENoYW5nZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNsaWRlcldoZWVsID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5iYXIgPSB0aGlzLmdhbWUuYWRkLmltYWdlKDAsIDAsIHRoaXMua2V5LCBcInNsaWRlcl9iYXJcIik7XG4gICAgICAgIHRoaXMuYmFyLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0RG93bi5hZGQodGhpcy5zdGFydERyYWcsIHRoaXMpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dFVwLmFkZCh0aGlzLnN0b3BEcmFnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCgoKSA9PiB0aGlzLmVuYWJsZVNsaWRlcldoZWVsKHRydWUpKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHRoaXMuZW5hYmxlU2xpZGVyV2hlZWwoZmFsc2UpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhciA9IHRoaXMuYmFyO1xuXG4gICAgICAgIHRoaXMubWFya2VyID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgdGhpcy5rZXksIFwic2xpZGVyX21hcmtlclwiKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuYW5jaG9yLnNldFRvKDAuNSwgMCk7XG4gICAgICAgIHRoaXMubWFya2VyLmJvdHRvbSA9IHRoaXMuYmFyLmJvdHRvbTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1hcmtlciA9IHRoaXMubWFya2VyO1xuICAgICAgICB0aGlzLmJhci5hZGRDaGlsZCh0aGlzLm1hcmtlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIHNsaWRlciBkcmFnZ2luZyBhbmQgaW5pdGlhdGUgZmlyc3QgZHJhZyBldmVudFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlNwcml0ZX0gYmFyIC0gVGhlIGJhciBzcHJpdGUgdGhhdCB3YXMgY2xpY2tlZFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlBvaW50ZXJ9IHBvaW50ZXIgLSBUaGUgcG9pbnRlciB3aGljaCBpbml0aWF0ZWQgdGhlIGNsaWNrXG4gICAgICovXG4gICAgc3RhcnREcmFnKGJhciwgcG9pbnRlcikge1xuICAgICAgICAvLyBJbml0aWFsIGNhbGwgdG8gdXBkYXRlRHJhZyBhbGxvd3MgY2hhbmdpbmcgYmV0IHdpdGggY2xpY2sgb24gYmFyXG4gICAgICAgIHRoaXMudXBkYXRlRHJhZyhwb2ludGVyLCBwb2ludGVyLngsIHBvaW50ZXIueSk7XG4gICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5hZGRNb3ZlQ2FsbGJhY2sodGhpcy51cGRhdGVEcmFnLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBEaXNhYmxlIHNsaWRlciBkcmFnZ2luZ1xuICAgICAqL1xuICAgIHN0b3BEcmFnKCkge1xuICAgICAgICB0aGlzLmdhbWUuaW5wdXQuZGVsZXRlTW92ZUNhbGxiYWNrKHRoaXMudXBkYXRlRHJhZywgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgQ2FsY3VsYXRlIHNsaWRlciBpbmRleCBiYXNlZCBvbiBkcmFnIGlucHV0XG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBzbGlkaW5nIHBvaW50ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgb2YgcG9pbnRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZSBvZiBwb2ludGVyXG4gICAgICovXG4gICAgdXBkYXRlRHJhZyhwb2ludGVyLCB4LCB5KSB7XG4gICAgICAgIGxldCBsb2NhbFggPSB4IC0gdGhpcy5iYXIud29ybGQueDsgIC8vIENsaWNrIHBvcyBpbiByZWxhdGlvbiB0byBiYXJcblxuICAgICAgICAvLyBQcmV2ZW50IGRyYWdnaW5nIHBhc3QgYmFyIGJvdW5kc1xuICAgICAgICBpZiAobG9jYWxYIDwgMCkge1xuICAgICAgICAgICAgbG9jYWxYID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbFggPiB0aGlzLmJhci53aWR0aCkge1xuICAgICAgICAgICAgbG9jYWxYID0gdGhpcy5iYXIud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdWJ0cmFjdCAxIGZyb20gbGVuZ3RoIGJlY2F1c2UgbGVuZ3RoIGlzIDEtaW5kZXhlZCwgaW5kaWNlcyBhcmUgMC1pbmRleGVkXG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5yb3VuZChsb2NhbFggLyB0aGlzLmJhci53aWR0aCAqICh0aGlzLmxlbmd0aCAtIDEpKTtcbiAgICAgICAgdGhpcy5zZXRJbmRleChpbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBpbmRleCBvZiB0aGUgc2xpZGVyIGFuZCByZXBvcnQgdGhlIG5ldyB2YWx1ZVxuICAgICAqXG4gICAgICogT3B0aW9uYWxseSB1cGRhdGUgdGhlIHZpc3VhbCBwb3NpdGlvbiBvZiB0aGUgbWFya2VyIG9uIHRoZSBzbGlkZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBOZXcgaW5kZXggdG8gc2V0IG9uIHNsaWRlclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VwZGF0ZVBvcz10cnVlXSAtIFVwZGF0ZSB0aGUgcG9zaXRpb24gb2YgbWFya2VyP1xuICAgICAqL1xuICAgIHNldEluZGV4KGluZGV4LCB1cGRhdGVQb3MgPSB0cnVlKSB7XG4gICAgICAgIGlmIChpbmRleCAhPT0gdGhpcy5pbmRleCkge1xuICAgICAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgdGhpcy5pbmRleENoYW5nZWQuZGlzcGF0Y2goaW5kZXgpO1xuXG4gICAgICAgICAgICBpZiAodXBkYXRlUG9zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gb25seSBvbmUgYmV0IGF2YWlsYWJsZSwgaXQncyBhIG1heCBiZXRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrZXIueCA9IHRoaXMuYmFyLndpZHRoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IDEgZnJvbSBsZW5ndGggYmVjYXVzZSBsZW5ndGggaXMgMS1pbmRleGVkLCBpbmRpY2VzIGFyZSAwLWluZGV4ZWRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrZXIueCA9IHRoaXMuYmFyLndpZHRoIC8gKHRoaXMubGVuZ3RoIC0gMSkgKiB0aGlzLmluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFVwZGF0ZSB0aGUgbGVuZ3RoIHByb3BlcnR5XG4gICAgICpcbiAgICAgKiBUaGUgbGVuZ3RoIHByb3BlcnR5IGRlc2NyaWJlcyBob3cgbWFueSBkaXNjcmV0ZSBiZXRzIHRoZSBzbGlkZXIgYmFyXG4gICAgICogbXVzdCByZXByZXNlbnQuIFRoZSBzbGlkZXIgZG9lcyBub3QgY2FyZSBhYm91dCB3aGF0IHRoZSBzcGVjaWZpYyBiZXRcbiAgICAgKiBpdCByZXByZXNlbnRzIGlzLCBvbmx5IHRoYXQgaXQgaGFzIHNvbWUgbnVtYmVyIG9mIGluZGljZXMgYWxvbmcgaXRzXG4gICAgICogbGVuZ3RoIGFuZCB0aGF0IGl0IG11c3QgcmVwb3J0IGl0cyBpbmRleCB0byBsaXN0ZW5lcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIG5ldyBsZW5ndGggdG8gc2V0XG4gICAgICovXG4gICAgc2V0TGVuZ3RoKGxlbmd0aCkge1xuICAgICAgICBpZiAobGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3Qgc2V0IHNsaWRlciBsZW5ndGggbGVzcyB0aGFuIDFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAobGVuZ3RoID4gdGhpcy5iYXIud2lkdGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IFNldHRpbmcgc2xpZGVyIHN0b3BzIGdyZWF0ZXIgdGhhbiBsZW5ndGggbWF5IHJlc3VsdCBpbiB1bmV4cGVjdGVkIGJlaGF2aW9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIHRoZSBzbGlkZXJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBJcyB0aGUgc2xpZGVyIGVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0RW5hYmxlZChlbmFibGVkKSB7XG4gICAgICAgIHRoaXMuYmFyLmlucHV0RW5hYmxlZCA9IGVuYWJsZWQ7XG5cbiAgICAgICAgbGV0IHRpbnQgPSBlbmFibGVkID8gMHhGRkZGRkYgOiAweDgwODA4MDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhci50aW50ID0gdGludDtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1hcmtlci50aW50ID0gdGludDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSBkaXNwYXRjaCBvZiBzaWduYWwgb24gd2hlZWwgc2Nyb2xsXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gSXMgdGhlIGNhbGxiYWNrIGVuYWJsZWQgb3IgZGlzYWJsZWQ/XG4gICAgICovXG4gICAgZW5hYmxlU2xpZGVyV2hlZWwoZW5hYmxlZCkge1xuICAgICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmlucHV0Lm1vdXNlLm1vdXNlV2hlZWxDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlcldoZWVsLmRpc3BhdGNoKHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS53aGVlbERlbHRhKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQubW91c2UubW91c2VXaGVlbENhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyOyIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJwYW5lbFwiOiB7XG4gICAgXCJwYWRkaW5nXCI6IDEwLFxuICAgIFwidGV4dFN0eWxlXCI6IHtcbiAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgIFwiYWxpZ25cIjogXCJjZW50ZXJcIlxuICAgIH0sXG4gICAgXCJwb3NcIjoge1xuICAgICAgXCJ4XCI6IDE0ODAsXG4gICAgICBcInlcIjogNzkwXG4gICAgfVxuICB9LFxuICBcInNlYXRzXCI6IHtcbiAgICBcIjEwXCI6IFtcbiAgICAgIHtcInhcIjogOTEwLCBcInlcIjogMjMwfSxcbiAgICAgIHtcInhcIjogMTI0NCwgXCJ5XCI6IDIzMH0sXG4gICAgICB7XCJ4XCI6IDE0ODQsIFwieVwiOiAzNDZ9LFxuICAgICAge1wieFwiOiAxNDg0LCBcInlcIjogNjQyfSxcbiAgICAgIHtcInhcIjogMTI0NCwgXCJ5XCI6IDc1OH0sXG4gICAgICB7XCJ4XCI6IDkxMCwgXCJ5XCI6IDc1OH0sXG4gICAgICB7XCJ4XCI6IDU3NiwgXCJ5XCI6IDc1OH0sXG4gICAgICB7XCJ4XCI6IDM0MiwgXCJ5XCI6IDY0Mn0sXG4gICAgICB7XCJ4XCI6IDM0MiwgXCJ5XCI6IDM0Nn0sXG4gICAgICB7XCJ4XCI6IDU3NiwgXCJ5XCI6IDIzMH1cbiAgICBdLFxuXG4gICAgLy8gVE9ET1xuICAgIFwiOFwiOiBbXSxcbiAgICBcIjlcIjogW11cbiAgfSxcbiAgXCJidXlJbk1vZGFsXCI6IHtcbiAgICBcInhcIjogODEwLFxuICAgIFwieVwiOiA0MzAsXG4gICAgXCJpbnB1dEJveFwiOiB7XG4gICAgICBcInhcIjogMTUsXG4gICAgICBcInlcIjogODZcbiAgICB9LFxuICAgIFwiaW5wdXRGaWVsZFwiOiB7XG4gICAgICBcInhcIjogMzAsXG4gICAgICBcInlcIjogLTJcbiAgICB9LFxuICAgIFwiY2FuY2VsQnV0dG9uXCI6IHtcbiAgICAgIFwieFwiOiAxNSxcbiAgICAgIFwieVwiOiAxNDVcbiAgICB9LFxuICAgIFwic3VibWl0QnV0dG9uXCI6IHtcbiAgICAgIFwieFwiOiAxNTUsXG4gICAgICBcInlcIjogMTQ1XG4gICAgfVxuICB9LFxuICBcImRlbm9tc1wiOiBbNSwgMjUsIDEwMCwgNTAwLCAyMDAwXSxcbiAgXCJjaGlwc1wiOiB7XG4gICAgXCIxMFwiOiBbXG4gICAgICB7XCJ4XCI6IDAsIFwieVwiOiA5NH0sXG4gICAgICB7XCJ4XCI6IC0zNCwgXCJ5XCI6IDEwMH0sXG4gICAgICB7XCJ4XCI6IC0xMjYsIFwieVwiOiA5MH0sXG4gICAgICB7XCJ4XCI6IC0xMjYsIFwieVwiOiAzOH0sXG4gICAgICB7XCJ4XCI6IDEyNCwgXCJ5XCI6IDc4fSxcbiAgICAgIHtcInhcIjogMTMyLCBcInlcIjogNzZ9LFxuICAgICAge1wieFwiOiAxMjgsIFwieVwiOiA3Mn0sXG4gICAgICB7XCJ4XCI6IDEzMSwgXCJ5XCI6IDc2fSxcbiAgICAgIHtcInhcIjogMTc0LCBcInlcIjogNzR9LFxuICAgICAge1wieFwiOiAxNCwgXCJ5XCI6IDk4fVxuICAgIF1cbiAgfVxufSIsImltcG9ydCBCdXR0b24gZnJvbSBcIi4uL2NsYXNzZXMvQnV0dG9uXCI7XG5cbmNsYXNzIEJ1eUluTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJ1eUluUmVxdWVzdGVkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5zZWF0cyA9IHt9O1xuXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcImJ1dHRvbnNcIjogW10sIFwibW9kYWxcIjogbnVsbCwgXCJpbnB1dEJveFwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmJ1dHRvbnNHcm91cCk7XG5cbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkICYmIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkLnZpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShzZWF0Q29uZmlnLCBvY2N1cGllZFNlYXRzLCBtb2RhbENvbmZpZykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXRDb25maWcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgc2VhdENvbmZpZ1tpXS54LCBzZWF0Q29uZmlnW2ldLnksIHRoaXMua2V5LCB0aGlzLmJ1dHRvbkNsaWNrZWQsIHRoaXMpO1xuICAgICAgICAgICAgYnV0dG9uLnNlYXROdW0gPSBpOyAvLyBTdG9yZSBmb3IgdXNlIG9uIGNsaWNrXG4gICAgICAgICAgICBidXR0b24uc2V0RnJhbWVzKFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX292ZXJcIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9vdXRcIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9kb3duXCIsXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fdXBcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRUZXh0KFwiQnV5IEluXCIpO1xuICAgICAgICAgICAgdGhpcy5zZWF0c1tpXSA9IHtcbiAgICAgICAgICAgICAgICBcImJ1dHRvblwiOiBidXR0b24sXG4gICAgICAgICAgICAgICAgXCJvY2N1cGllZFwiOiBvY2N1cGllZFNlYXRzLmluZGV4T2YoaSkgIT09IC0xXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmJ1dHRvbnMucHVzaChidXR0b24pO1xuICAgICAgICAgICAgdGhpcy5idXR0b25zR3JvdXAuYWRkKGJ1dHRvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAudmlzaWJsZSA9IHRoaXMuYnV0dG9uc1Zpc2libGU7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsQmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgdGhpcy5nYW1lLnRleHR1cmVzLm1vZGFsQmFja2dyb3VuZCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkubW9kYWxCYWNrZ3JvdW5kKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwgPSB0aGlzLmdhbWUuYWRkLmltYWdlKG1vZGFsQ29uZmlnLngsIG1vZGFsQ29uZmlnLnksIHRoaXMua2V5LCBcIm1vZGFsXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkubW9kYWwpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEJveCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UobW9kYWxDb25maWcuaW5wdXRCb3gueCwgbW9kYWxDb25maWcuaW5wdXRCb3gueSwgdGhpcy5rZXksIFwiaW5wdXRfYm94XCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmlucHV0Qm94KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZCA9IHRoaXMuZ2FtZS5hZGQuaW5wdXRGaWVsZChtb2RhbENvbmZpZy5pbnB1dEZpZWxkLngsIG1vZGFsQ29uZmlnLmlucHV0RmllbGQueSwge1xuICAgICAgICAgICAgZm9udDogJzMycHggQXJpYWwnLFxuICAgICAgICAgICAgZmlsbDogJyMzMzMzMzMnLFxuICAgICAgICAgICAgd2lkdGg6IDIyMCxcbiAgICAgICAgICAgIHBhZGRpbmc6IDgsXG4gICAgICAgICAgICBib3JkZXJXaWR0aDogMCxcbiAgICAgICAgICAgIHBsYWNlSG9sZGVyOiAnMjAuMDAnLFxuICAgICAgICAgICAgdHlwZTogUGhhc2VySW5wdXQuSW5wdXRUeXBlLm51bWJlcixcbiAgICAgICAgICAgIGZpbGxBbHBoYTogMFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0Qm94LmFkZENoaWxkKHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkKTtcblxuICAgICAgICBjb25zdCBidG5UZXh0U3R5bGUgPSB7XG4gICAgICAgICAgICBcImZvbnRcIjogXCJib2xkIDIycHQgQXJpYWxcIixcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICAgICAgICBcImFsaWduXCI6IFwiY2VudGVyXCJcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FuY2VsID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIG1vZGFsQ29uZmlnLmNhbmNlbEJ1dHRvbi54LCBtb2RhbENvbmZpZy5jYW5jZWxCdXR0b24ueSwgdGhpcy5rZXksIHRoaXMuY2FuY2VsLCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbC5zZXRGcmFtZXMoXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X291dFwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X2Rvd25cIixcbiAgICAgICAgICAgIFwiYnRuX3NlY29uZGFyeV91cFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0VGV4dFN0eWxlKGJ0blRleHRTdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0VGV4dChcIkNBTkNFTFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLmFkZENoaWxkKHRoaXMuZGlzcGxheS5jYW5jZWwpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQgPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgbW9kYWxDb25maWcuc3VibWl0QnV0dG9uLngsIG1vZGFsQ29uZmlnLnN1Ym1pdEJ1dHRvbi55LCB0aGlzLmtleSwgdGhpcy5zdWJtaXQsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc3VibWl0LnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX3ByaW1hcnlfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9vdXRcIixcbiAgICAgICAgICAgIFwiYnRuX3ByaW1hcnlfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV91cFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0VGV4dFN0eWxlKGJ0blRleHRTdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0VGV4dChcIkJVWSBJTlwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLmFkZENoaWxkKHRoaXMuZGlzcGxheS5zdWJtaXQpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuc2VhdHNbcGxheWVyRGF0YS5zZWF0XS5vY2N1cGllZCA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHBsYXllckxlZnQocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLnNlYXRzW3BsYXllckRhdGEuc2VhdF0ub2NjdXBpZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgZm9yIChsZXQgc2VhdE51bSBpbiB0aGlzLnNlYXRzKSB7XG4gICAgICAgICAgICBsZXQgc2VhdCA9IHRoaXMuc2VhdHNbc2VhdE51bV07XG4gICAgICAgICAgICBzZWF0LmJ1dHRvbi52aXNpYmxlID0gIXNlYXQub2NjdXBpZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAudmlzaWJsZSA9IHRoaXMuYnV0dG9uc1Zpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgIH1cblxuICAgIGJ1dHRvbkNsaWNrZWQoYnV0dG9uKSB7XG4gICAgICAgIHRoaXMuZGF0YS5zZWF0TnVtID0gYnV0dG9uLnNlYXROdW07XG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBjYW5jZWwoKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHtcInNlYXROdW1cIjogbnVsbCwgXCJidXlJblwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHN1Ym1pdCgpIHtcbiAgICAgICAgdGhpcy5kYXRhLmJ1eUluID0gdGhpcy5kaXNwbGF5LmlucHV0RmllbGQudmFsdWU7XG4gICAgICAgIHRoaXMuYnV5SW5SZXF1ZXN0ZWQuZGlzcGF0Y2godGhpcy5kYXRhLnNlYXROdW0sIHRoaXMuZGF0YS5idXlJbik7XG4gICAgICAgIHRoaXMuZGF0YSA9IHtcInNlYXROdW1cIjogbnVsbCwgXCJidXlJblwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRCdXR0b25zVmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1eUluTWFuYWdlcjsiLCJpbXBvcnQgQ2FyZCBmcm9tIFwiLi4vY2xhc3Nlcy9DYXJkXCI7XG5cbmNsYXNzIENhcmRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuY2FyZHMgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShudW1fY2FyZHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fY2FyZHM7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNhcmQgPSBuZXcgQ2FyZCh0aGlzLmdhbWUsIHRoaXMpO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplKHt9KTtcbiAgICAgICAgICAgIGNhcmQuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICAgICAgdGhpcy5jYXJkcy5wdXNoKGNhcmQpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKGNhcmQuc3ByaXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFsaWduKC0xLCAxLCB0aGlzLmNhcmRzWzBdLnNwcml0ZS53aWR0aCAqIDEuMiwgMCk7XG4gICAgfVxuXG4gICAgc2V0Q2FyZE5hbWVzKG5hbWVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG5hbWVzW2ldO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLm5hbWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmRNYW5hZ2VyOyIsImltcG9ydCBCdXR0b24gZnJvbSBcIi4uL2NsYXNzZXMvQnV0dG9uXCI7XG5pbXBvcnQgQ2hpcCBmcm9tIFwiLi4vY2xhc3Nlcy9DaGlwXCI7XG5cbmNsYXNzIENoaXBNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXksIHZhbHVlcykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgICAgICAgdGhpcy5jaGlwcyA9IFtdO1xuICAgICAgICB0aGlzLnBvb2wgPSBbXTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IDA7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG5cbiAgICB9XG5cbiAgICBnZXRDaGlwKHZhbHVlKSB7XG4gICAgICAgIGxldCBjaGlwID0gdGhpcy5wb29sLnBvcCgpO1xuICAgICAgICBpZiAoIWNoaXApIHtcbiAgICAgICAgICAgIGNoaXAgPSBuZXcgQ2hpcCh0aGlzLmdhbWUsIHRoaXMua2V5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoaXBzLnB1c2goY2hpcCk7XG5cbiAgICAgICAgLy8gY2hpcC5ldmVudHMub25LaWxsZWQuYWRkKHRoaXMucmVjeWNsZUNoaXAsIHRoaXMpO1xuXG4gICAgICAgIGNoaXAudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgY2hpcC5mcmFtZU5hbWUgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICByZXR1cm4gY2hpcDtcbiAgICB9XG5cbiAgICBzZXRWYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgbGV0IGogPSB0aGlzLnZhbHVlcy5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAodmFsdWUgPj0gMjUpIHtcbiAgICAgICAgICAgIHdoaWxlICh2YWx1ZSA8IHRoaXMudmFsdWVzW2pdKSB7XG4gICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgICAgIGlmIChqID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjaGlwID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgaSwgdGhpcy5rZXkpO1xuICAgICAgICAgICAgY2hpcC5mcmFtZU5hbWUgPSB0aGlzLnZhbHVlc1tqXS50b1N0cmluZygpO1xuICAgICAgICAgICAgY2hpcC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgICAgIGNoaXAuYW5nbGUgPSB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKC0xODAsIDE4MCk7XG4gICAgICAgICAgICBpIC09IDU7XG4gICAgICAgICAgICB2YWx1ZSAtPSB0aGlzLnZhbHVlc1tqXTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKGNoaXApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gY2xlYXIoKSB7XG4gICAgLy8gICAgIGxldCBjaGlwO1xuICAgIC8vICAgICB3aGlsZSAoY2hpcCA9IHRoaXMuY2hpcHMucG9wKCkpIHtcbiAgICAvLyAgICAgICAgIGNoaXAua2lsbCgpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfVxuICAgIC8vXG4gICAgLy8gcmVjeWNsZUNoaXAoY2hpcCkge1xuICAgIC8vXG4gICAgLy8gfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGlwTWFuYWdlcjsiLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi9jbGFzc2VzL1BsYXllclwiO1xuXG5jbGFzcyBQbGF5ZXJNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB1c2VySWQsIHNlYXRDb25maWcsIGNoaXBDb25maWcpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy51c2VySWQgPSB1c2VySWQ7XG4gICAgICAgIHRoaXMuc2VhdENvbmZpZyA9IHNlYXRDb25maWc7XG4gICAgICAgIHRoaXMuY2hpcENvbmZpZyA9IGNoaXBDb25maWc7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107ICAvLyBEaXJlY3QgYWNjZXNzIHRvIHRoZSBQbGF5ZXIgb2JqZWN0c1xuICAgICAgICB0aGlzLnVzZXJQbGF5ZXIgPSBudWxsOyAgLy8gVGhlIHVzZXIncyBwbGF5ZXIgb2JqZWN0LCBpZiBhdmFpbGFibGVcbiAgICAgICAgdGhpcy5uZXh0UGxheWVyID0gbnVsbDsgIC8vIFRoZSBwbGF5ZXIgdGhhdCB0aGUgZ2FtZSBleHBlY3RzIHRvIGFjdCBuZXh0XG5cbiAgICAgICAgLy8gQ29udGFpbnMgYWxsIGRpc3BsYXkgZWxlbWVudHMgZm9yIGFsbCBwbGF5ZXJzIGluIHRoZSBnYW1lXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUocGxheWVyRGF0YSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllckRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMubmV3UGxheWVyKHBsYXllckRhdGFbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV3UGxheWVyKHBsYXllckRhdGEpIHtcbiAgICAgICAgbGV0IHBsYXllciA9IG5ldyBQbGF5ZXIodGhpcy5nYW1lLCB0aGlzLmNoaXBDb25maWcpO1xuICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZShwbGF5ZXJEYXRhKTtcbiAgICAgICAgcGxheWVyLmluaXRpYWxpemVEaXNwbGF5KCk7XG5cbiAgICAgICAgcGxheWVyLmRpc3BsYXlHcm91cC54ID0gdGhpcy5zZWF0Q29uZmlnW3BsYXllckRhdGEuc2VhdF0ueDtcbiAgICAgICAgcGxheWVyLmRpc3BsYXlHcm91cC55ID0gdGhpcy5zZWF0Q29uZmlnW3BsYXllckRhdGEuc2VhdF0ueTtcblxuICAgICAgICB0aGlzLnBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQocGxheWVyLmRpc3BsYXlHcm91cCk7XG5cbiAgICAgICAgaWYgKHBsYXllci51c2VySWQgPT09IHRoaXMudXNlcklkKSB7XG4gICAgICAgICAgICB0aGlzLnVzZXJQbGF5ZXIgPSBwbGF5ZXI7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGxheWVyO1xuICAgIH1cblxuICAgIHBsYXllckxlZnQocGxheWVyRGF0YSkge1xuICAgICAgICBsZXQgcGxheWVyID0gdGhpcy5nZXRCeUlkKHBsYXllckRhdGEuaWQpO1xuXG4gICAgICAgIGlmICghcGxheWVyKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJDb3VsZCBub3QgZmluZCBwbGF5ZXIgYXQgdGFibGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLmRlc3Ryb3koKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcnNbaV0gPT09IHBsYXllcikge1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGxheWVyID09PSB0aGlzLnVzZXJQbGF5ZXIpIHtcbiAgICAgICAgICAgIHRoaXMudXNlclBsYXllciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGxheWVyO1xuICAgIH1cblxuICAgIGdldEJ5SWQoaWQpIHtcbiAgICAgICAgLy8gVE9ETyAtIERvIHRoaXMgd2l0aG91dCBpdGVyYXRpbmcgLS0gYnVpbGQgbWFwIG9uIGluaXQ/XG4gICAgICAgIC8vIFRPRE8gLSBTaG91bGQgdGhpcyBldmVyIHJldHVybiBudWxsP1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCBhIGxpc3Qgb2YgYWxsIG9jY3VwaWVkIHNlYXRzIGF0IHRoZSB0YWJsZVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gLSBUaGUgSURzIG9mIG9jY3VwaWVkIHNlYXRzXG4gICAgICovXG4gICAgZ2V0T2NjdXBpZWRTZWF0cygpIHtcbiAgICAgICAgbGV0IG9jY3VwaWVkU2VhdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG9jY3VwaWVkU2VhdHMucHVzaCh0aGlzLnBsYXllcnNbaV0uc2VhdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9jY3VwaWVkU2VhdHM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXJNYW5hZ2VyOyIsImNvbnN0IGlzU3RyaW5nID0gdmFsID0+IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xuY29uc3QgaXNCbG9iID0gdmFsID0+IHZhbCBpbnN0YW5jZW9mIEJsb2I7XG5cbnBvbHlmaWxsLmNhbGwodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgPyB3aW5kb3cgOiB0aGlzIHx8IHt9KTtcblxuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gIGlmIChpc1N1cHBvcnRlZC5jYWxsKHRoaXMpKSByZXR1cm47XG5cbiAgaWYgKCEoJ25hdmlnYXRvcicgaW4gdGhpcykpIHRoaXMubmF2aWdhdG9yID0ge307XG4gIHRoaXMubmF2aWdhdG9yLnNlbmRCZWFjb24gPSBzZW5kQmVhY29uLmJpbmQodGhpcyk7XG59O1xuXG5mdW5jdGlvbiBzZW5kQmVhY29uKHVybCwgZGF0YSkge1xuICBjb25zdCBldmVudCA9IHRoaXMuZXZlbnQgJiYgdGhpcy5ldmVudC50eXBlO1xuICBjb25zdCBzeW5jID0gZXZlbnQgPT09ICd1bmxvYWQnIHx8IGV2ZW50ID09PSAnYmVmb3JldW5sb2FkJztcblxuICBjb25zdCB4aHIgPSAoJ1hNTEh0dHBSZXF1ZXN0JyBpbiB0aGlzKSA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7XG4gIHhoci5vcGVuKCdQT1NUJywgdXJsLCAhc3luYyk7XG4gIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJyovKicpO1xuXG5cbiAgaWYgKGlzU3RyaW5nKGRhdGEpKSB7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKTtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gJ3RleHQvcGxhaW4nO1xuICB9IGVsc2UgaWYgKGlzQmxvYihkYXRhKSAmJiBkYXRhLnR5cGUpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgZGF0YS50eXBlKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgeGhyLnNlbmQoZGF0YSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xuICByZXR1cm4gKCduYXZpZ2F0b3InIGluIHRoaXMpICYmICgnc2VuZEJlYWNvbicgaW4gdGhpcy5uYXZpZ2F0b3IpO1xufSIsImltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSBcIi4uL2NsYXNzZXMvQ29udHJvbGxlclwiO1xuXG5jbGFzcyBCb290IGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmdhbWUuaW5pdGlhbERhdGEgPSB0aGlzLmF1Z21lbnRJbml0aWFsRGF0YShpbml0aWFsRGF0YSk7XG4gICAgICAgIHRoaXMuZ2FtZS5jb25maWcgPSBjb25maWc7XG5cbiAgICAgICAgLy8gVE9ETyAtIFRoaXMgc2hvdWxkIGNvbWUgZnJvbSBzb21ld2hlcmUgZHluYW1pY1xuICAgICAgICB0aGlzLmdhbWUucnVsZXMgPSB7XG4gICAgICAgICAgICBhbnRlOiAwLFxuICAgICAgICAgICAgYmxpbmRzOiB7XG4gICAgICAgICAgICAgICAgc21hbGw6IDI1LFxuICAgICAgICAgICAgICAgIGJpZzogNTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlO1xuICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcih0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5wbGF5ZXJJZCwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRva2VuKTtcblxuICAgICAgICBpZiAodGhpcy5nYW1lLmluaXRpYWxEYXRhLmVtdWxhdG9yRW5hYmxlZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Rlc3QnKTtcbiAgICAgICAgICAgIHdpbmRvdy5nYW1lID0gdGhpcy5nYW1lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoXCJsb2FkXCIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBTdW1tYXJ5IENhbGN1bGF0ZSBhZGRpdGlvbmFsIHZhbHVlcyB0byBzdG9yZSBvbiBnYW1lLmluaXRpYWxEYXRhXG4gICAgICpcbiAgICAgKiBUbyBzYXZlIG9uIHNlcnZlci1zaWRlIHByb2Nlc3NpbmcgYW5kIGRhdGEtdHJhbnNmZXIgbG9hZCwgdGhpc1xuICAgICAqIG1ldGhvZCBpcyBhIHBsYWNlIHRvIGdlbmVyYXRlIGFkZGl0aW9uYWwgZGF0YSBuZWVkZWQgYnkgdGhlIGdhbWVcbiAgICAgKiB3aGljaCBtYXkgYmUgZGVyaXZlZCBmcm9tIHRoZSBkYXRhIHNlbnQgZnJvbSB0aGUgYmFjayBlbmQuXG4gICAgICovXG4gICAgYXVnbWVudEluaXRpYWxEYXRhKGluaXRpYWxEYXRhKSB7XG4gICAgICAgIGluaXRpYWxEYXRhLm9jY3VwaWVkU2VhdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbml0aWFsRGF0YS5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpbml0aWFsRGF0YS5vY2N1cGllZFNlYXRzLnB1c2goaW5pdGlhbERhdGEucGxheWVyc1tpXS5zZWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpbml0aWFsRGF0YTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvb3Q7IiwiY2xhc3MgTG9hZCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgcHJlbG9hZCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJiYWNrZ3JvdW5kXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYmFja2dyb3VuZC5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwiZGVhbGVyQnV0dG9uXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvZGVhbGVyYnV0dG9uLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJyZWRDaXJjbGVcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9yZWRjaXJjbGUucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwiY2FyZHNcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9jYXJkcy5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9jYXJkcy5qc29uXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwicGFuZWxcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9wYW5lbC5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9wYW5lbC5qc29uXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwiYnV5SW5cIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9idXlpbi5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9idXlpbi5qc29uXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwiY2hpcHNcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9jaGlwcy5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9jaGlwcy5qc29uXCIpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS50ZXh0dXJlcyA9IHRoaXMuY3JlYXRlQ3VzdG9tVGV4dHVyZXMoKTtcblxuICAgICAgICB0aGlzLmxvYWRQbHVnaW5zKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoXCJtYWluXCIpO1xuICAgIH1cblxuICAgIGNyZWF0ZUN1c3RvbVRleHR1cmVzKCkge1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSB7fTtcblxuICAgICAgICBsZXQgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmxpbmVTdHlsZSg0LCAweDAwMDAwMCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDEwMCwgMTAwLCAxMDAsIDEwMCk7XG4gICAgICAgIHRleHR1cmVzW1wid2hpdGVTcXVhcmVcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoNCwgMHgwMDAwMDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgwLCAwLCAzMDAsIDEwMCk7XG4gICAgICAgIHRleHR1cmVzW1wid2hpdGVSZWN0XCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4MDAwMDAwLCAwLjUpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgwLCAwLCB0aGlzLmdhbWUud2lkdGgsIHRoaXMuZ2FtZS5oZWlnaHQpO1xuICAgICAgICB0ZXh0dXJlc1tcIm1vZGFsQmFja2dyb3VuZFwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweDAwMDAwMCwgMC41KTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgNTAsIDMwKTtcbiAgICAgICAgdGV4dHVyZXNbXCJ0ZXh0VW5kZXJsYXlcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0dXJlcztcbiAgICB9XG5cbiAgICBsb2FkUGx1Z2lucygpIHtcbiAgICAgICAgdGhpcy5nYW1lLmFkZC5wbHVnaW4oUGhhc2VySW5wdXQuUGx1Z2luKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYWQ7IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vY2xhc3Nlcy9BY3Rpb24uanNcIjtcbmltcG9ydCBCdXlJbk1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0J1eUluTWFuYWdlclwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuaW1wb3J0IFBhbmVsIGZyb20gXCIuLi9jbGFzc2VzL1BhbmVsXCI7XG5pbXBvcnQgUGxheWVyTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvUGxheWVyTWFuYWdlclwiO1xuaW1wb3J0IFBvdCBmcm9tIFwiLi4vY2xhc3Nlcy9Qb3RcIjtcbmltcG9ydCBQb2tlciBmcm9tIFwiLi4vUG9rZXJcIjtcbmltcG9ydCBTU0UgZnJvbSBcIi4uL1NTRVwiO1xuXG5jbGFzcyBNYWluIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLnRhYmxlX3NzZSA9IG5ldyBTU0UodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVTU0VVcmwpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlID0gbmV3IFNTRSh0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VyU1NFVXJsKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInVubG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5kaXNjb25uZWN0QmVhY29uKCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgXCJiYWNrZ3JvdW5kXCIpO1xuICAgICAgICB0aGlzLm5ld0hhbmRCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAxMDAsIFwibmV3XFxuaGFuZFwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMubmV3SGFuZCk7XG4gICAgICAgIHRoaXMuZGVhbEJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDIyMCwgXCJkZWFsXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5kZWFsKTtcbiAgICAgICAgdGhpcy5sZWF2ZUJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDM0MCwgXCJsZWF2ZVwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMubGVhdmVUYWJsZSk7XG4gICAgICAgIHRoaXMuYmJCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCA0NjAsIFwiQkJcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmJiKTtcbiAgICAgICAgdGhpcy5zYkJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDU4MCwgXCJTQlwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuc2IpO1xuXG4gICAgICAgIGNvbnN0IG51bVNlYXRzID0gMTA7ICAgIC8vIFRPRE8gLSBNYWtlIGR5bmFtaWNcbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMgPSBuZXcgUGxheWVyTWFuYWdlcih0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VySWQsIHRoaXMuZ2FtZS5jb25maWcuc2VhdHNbbnVtU2VhdHNdLCB0aGlzLmdhbWUuY29uZmlnLmNoaXBzW251bVNlYXRzXSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmluaXRpYWxpemUodGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcnMsIHRoaXMuZ2FtZS5jb25maWcuc2VhdHNbbnVtU2VhdHNdKTtcblxuICAgICAgICB0aGlzLmdhbWUuYm9hcmQgPSBuZXcgQ2FyZE1hbmFnZXIodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmluaXRpYWxpemUoNSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmNlbnRlclkgPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWTtcblxuICAgICAgICB0aGlzLmdhbWUucG90ID0gbmV3IFBvdCh0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmdhbWUucG90LmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wb3Quc3ByaXRlLmNlbnRlclggPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWDtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5zcHJpdGUuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZIC0gMTQwO1xuXG4gICAgICAgIC8vIFRPRE8gLSBUaGVzZSBzaG91bGQgZ28gc29tZXdoZXJlIGVsc2UuIE1heWJlIGluIFBvdD9cbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbCA9IG5ldyBQYW5lbCh0aGlzLmdhbWUsIFwicGFuZWxcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueCA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLng7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueSA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLnk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5hbHdheXNWaXNpYmxlID0gdGhpcy5nYW1lLmluaXRpYWxEYXRhLmVtdWxhdG9yRW5hYmxlZDtcblxuICAgICAgICB0aGlzLmdhbWUuYnV5SW4gPSBuZXcgQnV5SW5NYW5hZ2VyKHRoaXMuZ2FtZSwgXCJidXlJblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLmluaXRpYWxpemUodGhpcy5nYW1lLmNvbmZpZy5zZWF0c1tudW1TZWF0c10sIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldE9jY3VwaWVkU2VhdHMoKSwgdGhpcy5nYW1lLmNvbmZpZy5idXlJbk1vZGFsKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnNldEJ1dHRvbnNWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIgPT09IG51bGwpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcnMoKTtcblxuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld0hhbmRcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdIYW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucG90LnNldEFtb3VudCgwKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY2FyZHMucmVzZXQoKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNEZWFsZXI6IHBsYXllci5pZCA9PT0gZGF0YS5kZWFsZXIsXG4gICAgICAgICAgICAgICAgICAgIGlzTmV4dDogcGxheWVyLmlkID09PSBkYXRhLm5leHQsXG4gICAgICAgICAgICAgICAgICAgIHJvdW5kQmV0OiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImRlYWxcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWFsOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldChQb2tlci5nZXRNaW5CZXQodGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5lbXVsYXRvckVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiZW11bGF0ZURlYWxcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVtdWxhdGVEZWFsOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXJEYXRhID0gZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChwbGF5ZXJEYXRhLnBsYXllcklkKS5jYXJkcy5zZXRDYXJkTmFtZXMocGxheWVyRGF0YS5ob2xkaW5ncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdSb3VuZFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1JvdW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXS51cGRhdGUoe3JvdW5kQmV0OiAwfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJhY3Rpb25cIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhY3Rpb246IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5zZXRDYXJkTmFtZXMoZGF0YS5ib2FyZCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLnBsYXllcklkKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgIGJhbGFuY2U6IGRhdGEucGxheWVyQmFsYW5jZSxcbiAgICAgICAgICAgICAgICBpc05leHQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJvdW5kQmV0OiBkYXRhLnBsYXllclJvdW5kQmV0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KS51cGRhdGUoe2lzTmV4dDogdHJ1ZX0pO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBvdC5zZXRBbW91bnQoZGF0YS5wb3QpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gZGF0YS5yb3VuZEJldDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gZGF0YS5yb3VuZFJhaXNlO1xuXG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KFBva2VyLmdldE1pbkJldCh0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImhhbmRDb21wbGV0ZVwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhhbmRDb21wbGV0ZTogXCIsIGRhdGEpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLndpbm5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgd2lubmVyID0gZGF0YS53aW5uZXJzW2ldO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQod2lubmVyLmlkKS51cGRhdGUoe2JhbGFuY2U6IHdpbm5lci5iYWxhbmNlfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1BsYXllclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3UGxheWVyOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXdQbGF5ZXIoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4ubmV3UGxheWVyKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnNldEJ1dHRvbnNWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIgPT09IG51bGwpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJwbGF5ZXJMZWZ0XCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwbGF5ZXJMZWZ0OiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJMZWZ0KGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnBsYXllckxlZnQoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4uc2V0QnV0dG9uc1Zpc2libGUodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllciA9PT0gbnVsbCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlLmFkZExpc3RlbmVyKFwiZGVhbFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVhbDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5jYXJkcy5zZXRDYXJkTmFtZXMoZGF0YS5ob2xkaW5ncyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwucHJpbWFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNlY29uZGFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnRlcnRpYXJ5Q2xpY2tlZC5hZGQodGhpcy5oYW5kbGVBY3Rpb24sIHRoaXMpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uYnV5SW5SZXF1ZXN0ZWQuYWRkKHRoaXMuZ2FtZS5jb250cm9sbGVyLmpvaW4sIHRoaXMuZ2FtZS5jb250cm9sbGVyKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJvdXRlIGFjdGlvbnMgdG8gY29udHJvbGxlciByZXF1ZXN0c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY3Rpb24gLSBUaGUgYWN0aW9uIHRvIGJlIHJlcXVlc3RlZCwgZGVmaW5lZCBpbiBBY3Rpb24uanNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmV0IC0gVGhlIGJldCAoaWYgYW55KSB0byBiZSBzZW50IHRvIHRoZSBjb250cm9sbGVyXG4gICAgICovXG4gICAgaGFuZGxlQWN0aW9uKGFjdGlvbiwgYmV0KSB7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5GT0xEOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmZvbGQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uLkNIRUNLOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5CRVQ6XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuYmV0KGJldCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkludmFsaWQgQWN0aW9uIFR5cGU6IFwiICsgYWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnVwZGF0ZSgpO1xuICAgIH1cblxuICAgIG1ha2VCdG4oeCwgeSwgdGV4dCwgdGV4dHVyZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ0biA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKHgsIHksIHRleHR1cmUsIGNhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgYnRuLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIGxldCBidG5UZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDAsIHRleHQpO1xuICAgICAgICBidG5UZXh0LmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICBidG4uYWRkQ2hpbGQoYnRuVGV4dCk7XG4gICAgICAgIGJ0bi50ZXh0ID0gYnRuVGV4dDtcblxuICAgICAgICByZXR1cm4gYnRuO1xuICAgIH1cblxuICAgIGRlYWwoKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL3RhYmxlcy8nICsgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlTmFtZSArICcvZGVhbC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgbmV3SGFuZCgpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignUE9TVCcsICcvdGFibGVzLycgKyB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVOYW1lICsgJy9uZXctaGFuZC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfTtcblxuICAgIGxlYXZlVGFibGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmxlYXZlKCk7XG4gICAgfVxuXG4gICAgYmIoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmJiKCk7XG4gICAgfTtcblxuICAgIHNiKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5zYigpO1xuICAgIH07XG5cbiAgICBnZW5lcmF0ZUJldHMocGxheWVyUm91bmRCZXQsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIFBva2VyLmdlbmVyYXRlQmV0cygyNSwgNTAsIHRoaXMuZ2FtZS5yb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1haW47Il19
