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

},{"./states/Boot":17,"./states/Load":18,"./states/Main":19}],2:[function(require,module,exports){
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
            var textArea = this.width - this.labelPadding * 2;
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

},{}],9:[function(require,module,exports){
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
            var primaryText = "BET " + _Util2.default.parseCurrency(this.primaryBet);
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
            this.visible = visible;
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

},{"../Util":4,"./Action":5,"./Button":6,"./Slider":12}],10:[function(require,module,exports){
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
        this.roundBet = 0; // Sum bets by player in current betting round

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
            this.roundBet = data.roundBet === undefined ? this.roundBet : data.roundBet;
            this.updateDisplay();
        }
    }]);

    return Player;
}();

exports.default = Player;

},{"../Util":4,"../managers/CardManager":14}],11:[function(require,module,exports){
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

},{"../Util":4}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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

},{"../classes/Card":7}],15:[function(require,module,exports){
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

},{"../classes/Player":10}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

            // TODO - This should come from somewhere dynamic
            this.game.rules = {
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

},{"../classes/Controller":8,"../config":13}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Action = require("../classes/Action.js");

var _Action2 = _interopRequireDefault(_Action);

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

            // TODO - These should go somewhere else. Maybe in Pot?
            this.game.roundBet = 0;
            this.game.roundRaise = 0;

            this.game.panel = new _Panel2.default(this.game, "panel");
            this.game.panel.initialize();
            this.game.panel.displayGroup.x = this.game.config.panel.pos.x;
            this.game.panel.displayGroup.y = this.game.config.panel.pos.y;
            this.registerListeners();

            this.table_sse.addListener("newHand", function (event) {
                var data = JSON.parse(event.data);
                console.log("newHand: ", data);
                _this3.game.board.reset();
                _this3.game.roundBet = 0;
                _this3.game.roundRaise = 0;
                _this3.game.pot.setAmount(0);
                for (var i = 0; i < _this3.game.players.players.length; i++) {
                    var player = _this3.game.players.players[i];
                    player.cards.reset();
                    player.update({
                        isDealer: player.id === data.dealer,
                        isNext: player.id === data.next,
                        roundBet: 0
                    });
                }
                // TODO - userPlayer.id will fail for watchers
                var userPlayerNext = data.next === _this3.game.players.userPlayer.id;
                if (userPlayerNext) {
                    _this3.game.panel.setBets(_Poker2.default.generateRaises(_this3.game.rules.blinds.small, _this3.game.rules.blinds.big, _this3.game.roundBet, _this3.game.players.userPlayer.roundBet, _this3.game.roundRaise, _this3.game.players.userPlayer.balance));
                    _this3.game.panel.setSecondaryBet(0);
                }
                _this3.game.panel.setVisible(userPlayerNext);
            });
            this.table_sse.addListener("newRound", function (event) {
                var data = JSON.parse(event.data);
                console.log("newRound: ", data);
                _this3.game.roundBet = 0;
                _this3.game.roundRaise = 0;
                for (var i = 0; i < _this3.game.players.players.length; i++) {
                    _this3.game.players.players[i].update({ roundBet: 0 });
                }
                _this3.game.panel.setBets(_Poker2.default.generateRaises(_this3.game.rules.blinds.small, _this3.game.rules.blinds.big, _this3.game.roundBet, _this3.game.players.userPlayer.roundBet, _this3.game.roundRaise, _this3.game.players.userPlayer.balance));
                _this3.game.panel.setSecondaryBet(0);
            });
            this.table_sse.addListener("action", function (event) {
                var data = JSON.parse(event.data);
                console.log("action: ", data);
                _this3.game.board.setCardNames(data.board);
                _this3.game.players.getById(data.playerId).update({
                    balance: data.playerBalance,
                    isNext: false,
                    roundBet: data.playerRoundBet
                });
                _this3.game.players.getById(data.next).update({ isNext: true });
                _this3.game.pot.setAmount(data.pot);
                _this3.game.roundBet = data.roundBet;
                _this3.game.roundRaise = data.roundRaise;

                var userPlayerNext = data.next === _this3.game.players.userPlayer.id;
                if (userPlayerNext) {
                    _this3.game.panel.setBets(_Poker2.default.generateRaises(_this3.game.rules.blinds.small, _this3.game.rules.blinds.big, _this3.game.roundBet, _this3.game.players.userPlayer.roundBet, _this3.game.roundRaise, _this3.game.players.userPlayer.balance));
                    _this3.game.panel.setSecondaryBet(_Poker2.default.getMinBet(_this3.game.roundBet, _this3.game.players.userPlayer.roundBet, _this3.game.players.userPlayer.balance));
                }
                _this3.game.panel.setVisible(userPlayerNext);
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
            this.game.panel.primaryClicked.add(this.handleAction, this);
            this.game.panel.secondaryClicked.add(this.handleAction, this);
            this.game.panel.tertiaryClicked.add(this.handleAction, this);
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
    }, {
        key: "generateBets",
        value: function generateBets(playerRoundBet, playerBalance) {
            return _Poker2.default.generateBets(25, 50, this.game.roundBet, playerRoundBet, this.game.roundRaise, playerBalance);
        }
    }]);

    return Main;
}(Phaser.State);

exports.default = Main;

},{"../Poker":2,"../SSE":3,"../classes/Action.js":5,"../classes/Panel":9,"../classes/Pot":11,"../managers/CardManager":14,"../managers/PlayerManager":15}]},{},[1,16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NvbnRyb2xsZXIuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGFuZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGxheWVyLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BvdC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9TbGlkZXIuanMiLCJzdGF0aWMvc3JjL2NvbmZpZy5qc29uIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9DYXJkTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvUGxheWVyTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvcG9seWZpbGxzL3NlbmRiZWFjb24uanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Cb290LmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTG9hZC5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL01haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU0sSTs7O0FBQ0Ysb0JBQWM7QUFBQTs7QUFBQSxnSEFDSjtBQUNGLG1CQUFPLElBREw7QUFFRixvQkFBUTtBQUZOLFNBREk7O0FBTVYsY0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLE1BQWYsRUFBdUIsY0FBdkIsRUFBNkIsS0FBN0I7QUFDQSxjQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBZixFQUF1QixjQUF2QixFQUE2QixLQUE3QjtBQUNBLGNBQUssS0FBTCxDQUFXLEdBQVgsQ0FB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TCxDQUFVLFVBQXpFLEVBQXFGLGFBQXJGLENBQVA7QUFDSDs7OztFQW5MYyxPQUFPLEs7O2tCQXNMWCxJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEJvb3QgZnJvbSBcIi4vc3RhdGVzL0Jvb3RcIjtcbmltcG9ydCBMb2FkIGZyb20gXCIuL3N0YXRlcy9Mb2FkXCI7XG5pbXBvcnQgTWFpbiBmcm9tIFwiLi9zdGF0ZXMvTWFpblwiO1xuXG5jbGFzcyBHYW1lIGV4dGVuZHMgUGhhc2VyLkdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICB3aWR0aDogMTkyMCxcbiAgICAgICAgICAgIGhlaWdodDogMTA4MFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImJvb3RcIiwgQm9vdCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImxvYWRcIiwgTG9hZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcIm1haW5cIiwgTWFpbiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJib290XCIpO1xuICAgIH1cbn1cblxubmV3IEdhbWUoKTsiLCIvKipcbiAqIEBzdW1tYXJ5IEEgdXRpbGl0eSBjbGFzcyBvZiBQb2tlci1zcGVjaWZpYyBmdW5jdGlvbmFsaXR5XG4gKi9cbmNsYXNzIFBva2VyIHtcbiAgICAvLyBUT0RPIC0gVGhpcyB1dGlsaXR5IGlzIGhpZ2hseS1zcGVjaWZpYyB0byBOTCBnYW1lcywgbWF5YmUgZXZlbiB0byBOTEhFLlxuICAgIC8vICBOZWVkIHRvIG1ha2UgaXQgbW9yZSBnZW5lcmljIGV2ZW50dWFsbHkgdG8gYWxsb3cgZm9yIG90aGVyIGdhbWVcbiAgICAvLyAgdHlwZXMuIExpbWl0IGFuZCBwb3QtbGltaXQgZ2FtZXMgd2lsbCB3b3JrIGNvbXBsZXRlbHkgZGlmZmVyZW50bHkuXG4gICAgLy8gIEFudGVzIGFyZSBhbHNvIG5vdCBzdXBwb3J0ZWQuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBHZW5lcmF0ZSBhbGwgbGVnYWwgcmFpc2VzIGZvciBwbGF5ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc21hbGxCbGluZCAtIFRoZSBzbWFsbCBibGluZCBmb3IgdGhlIGdhbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmlnQmxpbmQgLSBUaGUgYmlnIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3VuZEJldCAtIFRoZSBsZWFkaW5nIGJldCBmb3IgdGhpcyBiZXR0aW5nIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllclJvdW5kQmV0IC0gVGhlIGFtb3VudCB0aGlzIHBsYXllciBoYXMgY29udHJpYnV0ZWQgdG8gdGhlIHBvdCBzbyBmYXIgdGhpcyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmV2UmFpc2UgLSBUaGUgYW1vdW50IHRoZSBwcmV2aW91cyByYWlzZSBpbmNyZWFzZWQgdGhlIGJldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJCYWxhbmNlIC0gVGhlIGFtb3VudCB0aGUgcGxheWVyIGhhcyBhdmFpbGFibGUgdG8gYmV0XG4gICAgICogQHJldHVybnMge251bWJlcltdfSAtIFRoZSB2YWxpZCByYWlzZXNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2VuZXJhdGVSYWlzZXMoc21hbGxCbGluZCwgYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCByYWlzZSA9IFBva2VyLmdldE1pblJhaXNlKGJpZ0JsaW5kLCByb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHByZXZSYWlzZSwgcGxheWVyQmFsYW5jZSk7XG4gICAgICAgIGxldCByYWlzZXMgPSBbcmFpc2VdO1xuXG4gICAgICAgIHdoaWxlIChyYWlzZSArIHNtYWxsQmxpbmQgPD0gcGxheWVyQmFsYW5jZSkge1xuICAgICAgICAgICAgcmFpc2UgKz0gc21hbGxCbGluZDtcbiAgICAgICAgICAgIHJhaXNlcy5wdXNoKHJhaXNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyYWlzZSA8IHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgICAgIHJhaXNlcy5wdXNoKHBsYXllckJhbGFuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJhaXNlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBHZXQgdGhlIG1pbmltdW0gYWxsb3dhYmxlIGJldCBmb3IgcGxheWVyXG4gICAgICpcbiAgICAgKiBJZiBubyBiZXRzIGhhdmUgb2NjdXJyZWQgaW4gY3VycmVudCByb3VuZCwgdGhlIG1pbiBiZXQgaXMgYVxuICAgICAqIGNoZWNrIChiZXQgb2YgMCksIG90aGVyd2lzZSBpdCdzIGEgY2FsbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3VuZEJldCAtIFRoZSBsZWFkaW5nIGJldCBmb3IgdGhpcyBiZXR0aW5nIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllclJvdW5kQmV0IC0gVGhlIGFtb3VudCB0aGlzIHBsYXllciBoYXMgY29udHJpYnV0ZWQgdG8gdGhlIHBvdCBzbyBmYXIgdGhpcyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJCYWxhbmNlIC0gVGhlIGFtb3VudCB0aGUgcGxheWVyIGhhcyBhdmFpbGFibGUgdG8gYmV0XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0TWluQmV0KHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICBsZXQgbWluQmV0ID0gcm91bmRCZXQgPT09IDAgPyAwIDogcm91bmRCZXQgLSBwbGF5ZXJSb3VuZEJldDtcbiAgICAgICAgaWYgKHBsYXllckJhbGFuY2UgPCBtaW5CZXQpIHtcbiAgICAgICAgICAgIG1pbkJldCA9IHBsYXllckJhbGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pbkJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBHZXQgdGhlIG1pbmltdW0gYWxsb3dhYmxlIHJhaXNlIGZvciBwbGF5ZXJcbiAgICAgKlxuICAgICAqIE5PVEU6IEEgcmFpc2UgaGVyZSBtYXkgYWN0dWFsbHkgbWVhbiBhIGJldCBpbiBwb2tlciB0ZXJtcy4gSW4gdGhlXG4gICAgICogcGFybGFuY2Ugb2YgdGhpcyB1dGlsaXR5LCBhIHJhaXNlIGlzIGFuIGFnZ3Jlc3NpdmUgYWN0aW9uLCBvciBzb21ldGhpbmdcbiAgICAgKiB3aGljaCB3b3VsZCBmb3JjZSBvdGhlciBwbGF5ZXJzIHRvIGNvbnRyaWJ1dGUgbW9yZSB0byB0aGUgcG90IHRoYW5cbiAgICAgKiB0aGUgb3RoZXJ3aXNlIHdvdWxkIGhhdmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmlnQmxpbmQgLSBUaGUgYmlnIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3VuZEJldCAtIFRoZSBsZWFkaW5nIGJldCBmb3IgdGhpcyBiZXR0aW5nIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllclJvdW5kQmV0IC0gVGhlIGFtb3VudCB0aGlzIHBsYXllciBoYXMgY29udHJpYnV0ZWQgdG8gdGhlIHBvdCBzbyBmYXIgdGhpcyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmV2UmFpc2UgLSBUaGUgYW1vdW50IHRoZSBwcmV2aW91cyByYWlzZSBpbmNyZWFzZWQgdGhlIGJldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJCYWxhbmNlIC0gVGhlIGFtb3VudCB0aGUgcGxheWVyIGhhcyBhdmFpbGFibGUgdG8gYmV0XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0TWluUmFpc2UoYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCBtaW5SYWlzZSA9IHJvdW5kQmV0ID09PSAwID8gYmlnQmxpbmQgOiByb3VuZEJldCAtIHBsYXllclJvdW5kQmV0ICsgcHJldlJhaXNlO1xuICAgICAgICBpZiAocGxheWVyQmFsYW5jZSA8IG1pblJhaXNlKSB7XG4gICAgICAgICAgICBtaW5SYWlzZSA9IHBsYXllckJhbGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pblJhaXNlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9rZXI7IiwiY2xhc3MgU1NFIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB1cmwpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIHRoaXMuc291cmNlID0gbmV3IEV2ZW50U291cmNlKHRoaXMudXJsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZSBhZGRzIGFsbCBsaXN0ZW5lcnMgdG8gdGhpcy5zb3VyY2VcbiAgICAgKlxuICAgICAqIEkgb3JpZ2luYWxseSB3cm90ZSB0aGlzIHRvIHN1cHBvcnQgY2xpZW50IHJlY29ubmVjdHMsIGJ1dCBJIGRvbid0IG5lZWRcbiAgICAgKiB0aGF0IGFueW1vcmUuIEtlZXBpbmcgdGhlIGxpc3RlbmVyIGNvZGUganVzdCBpbiBjYXNlLlxuICAgICAqL1xuICAgIHJlQWRkQWxsTGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnM7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICB0aGlzLmFkZExpc3RlbmVyKGxpc3RlbmVyLnR5cGUsIGxpc3RlbmVyLmNhbGxiYWNrLCBsaXN0ZW5lci5jYWxsYmFja0NvbnRleHQsIC4uLmxpc3RlbmVyLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncykge1xuICAgICAgICAvLyBTdG9yZSBsaXN0ZW5lcnMgZm9yIGV2ZW50dWFsIHJlY29ubmVjdFxuICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKHtcbiAgICAgICAgICAgIFwidHlwZVwiOiB0eXBlLFxuICAgICAgICAgICAgXCJjYWxsYmFja1wiOiBjYWxsYmFjayxcbiAgICAgICAgICAgIFwiY2FsbGJhY2tDb250ZXh0XCI6IGNhbGxiYWNrQ29udGV4dCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBhcmdzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc291cmNlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncywgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNTRTsiLCJjbGFzcyBVdGlsIHtcbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZXR1cm4gYSBmb3JtYXR0ZWQgY3VycmVuY3kgc3RyaW5nIGZyb20gYW4gaW50ZWdlclxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZUN1cnJlbmN5KGludCkge1xuICAgICAgICBsZXQgdmFsID0gaW50IC8gMTAwO1xuICAgICAgICByZXR1cm4gXCIkXCIgKyB2YWwudG9GaXhlZCgyKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWw7IiwiY29uc3QgQWN0aW9uID0ge1xuICAgIEJMSU5EOiAwLFxuICAgIEZPTEQ6IDEsXG4gICAgQ0hFQ0s6IDIsXG4gICAgQkVUOiAzXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBY3Rpb247IiwiLyoqXG4gKiBBIFBoYXNlci5CdXR0b24gd2l0aCBhIFBoYXNlci5UZXh0IGNlbnRlcmVkIG9uIHRoZSBidXR0b25cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIG1lcmVseSBhIHRoaW4gd3JhcHBlciBhcm91bmQgUGhhc2VyLkJ1dHRvbiB0byBhbGxvdyBmb3JcbiAqIGVhc3kgdXNlIG9mIGEgdGV4dCBsYWJlbCBvbiB0aGUgYnV0dG9uLiBUaGUgdGV4dCBpcyBhIGNoaWxkIG9mIHRoZSBidXR0b24sXG4gKiBzbyBpdCBtb3ZlcyB3aGVuIHRoZSBidXR0b24gbW92ZXMuIEl0J3MgY2VudGVyZWQgb24gdGhlIGJ1dHRvbiBhbmQgc2NhbGVzXG4gKiBhdXRvbWF0aWNhbGx5IHRvIGZpeCB3aXRoaW4gdGhlIGJ1dHRvbidzIGJvdW5kcy5cbiAqXG4gKiBJZiBub25lIG9mIHRoZSBsYWJlbCBmdW5jdGlvbmFsaXR5IGlzIHVzZWQsIHRoaXMgY2xhc3MgaXMgaWRlbnRpY2FsIHRvXG4gKiBQaGFzZXIuQnV0dG9uLlxuICovXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBQaGFzZXIuQnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSkge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSk7XG5cbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSAxMDtcbiAgICAgICAgdGhpcy5sYWJlbFRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSB7fTtcbiAgICAgICAgdGhpcy5sYWJlbCA9IG5ldyBQaGFzZXIuVGV4dCh0aGlzLmdhbWUsIDAsIDAsIHRoaXMubGFiZWxUZXh0KTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmxhYmVsKTtcblxuICAgICAgICAvLyBNdXN0IGFkZCB0byBnYW1lIHdvcmxkIG1hbnVhbGx5IGlmIG5vdCB1c2luZyBnYW1lLmFkZC5idXR0b25cbiAgICAgICAgdGhpcy5nYW1lLndvcmxkLmFkZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHRleHQgZGlzcGxheWVkIG9uIHRoZSBidXR0b25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGRpc3BsYXlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0VGV4dCh0ZXh0LCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxUZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBzdHlsZSBmb3IgdGhlIGJ1dHRvbiB0ZXh0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gVGhlIHRleHQgc3R5bGUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFRleHRTdHlsZShzdHlsZSwgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSBzdHlsZTtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBwYWRkaW5nIGJldHdlZW4gdGhlIHRleHQgYW5kIHRoZSBidXR0b24gcGVyaW1ldGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmcgLSBUaGUgcGFkZGluZyBpbiBwaXhlbHNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0UGFkZGluZyhwYWRkaW5nLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxQYWRkaW5nID0gcGFkZGluZztcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIGJ1dHRvblxuICAgICAqIE9uIGRpc2FibGUsIGRpc2FibGVzIGFsbCBpbnB1dCB0byB0aGUgYnV0dG9uIGFuZCByZW5kZXJzIGl0IGdyYXllZFxuICAgICAqIG91dC4gQWxsIHVwZGF0ZXMgYXJlIGRlbGF5ZWQgdW50aWwgcmUtZW5hYmxlLCB1bmxlc3MgZm9yY2VkLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIEVuYWJsZSBvciBkaXNhYmxlIGJ1dHRvbj9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmxhYmVsLnRpbnQgPSB0aW50O1xuXG4gICAgICAgIC8vIFVwZGF0ZSBvbiByZS1lbmFibGVcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFVwZGF0ZSBhbGwgYnV0dG9uIGF0dHJpYnV0ZXMgdG8gY3VycmVudCBwcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBJZiB0aGUgYnV0dG9uIGlzIGRpc2FibGVkLCB0aGlzIHdpbGwgaGF2ZSBubyBlZmZlY3QuIFRoZVxuICAgICAqIGRldmVsb3BlciBtYXkgb3B0aW9uYWxseSBjaG9vc2UgdG8gZm9yY2UgdGhlIHVwZGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSB0aGUgdXBkYXRlP1xuICAgICAqL1xuICAgIHVwZGF0ZUxhYmVsKGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCB8fCBmb3JjZSkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbC50ZXh0ID0gdGhpcy5sYWJlbFRleHQ7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnNldFN0eWxlKHRoaXMubGFiZWxTdHlsZSk7XG4gICAgICAgICAgICB0aGlzLnJlUG9zTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNjYWxlIGxhYmVsIHRleHQgdG8gZml0IG9uIGJ1dHRvbiBhbmQgY2VudGVyXG4gICAgICovXG4gICAgcmVQb3NMYWJlbCgpIHtcbiAgICAgICAgdGhpcy5sYWJlbC5zY2FsZS5zZXRUbygxKTtcbiAgICAgICAgbGV0IHRleHRBcmVhID0gdGhpcy53aWR0aCAtIHRoaXMubGFiZWxQYWRkaW5nICogMjtcbiAgICAgICAgaWYgKHRoaXMubGFiZWwud2lkdGggPiB0ZXh0QXJlYSkge1xuICAgICAgICAgICAgbGV0IHJlZHVjZWRTY2FsZSA9IHRleHRBcmVhIC8gdGhpcy5sYWJlbC53aWR0aDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2NhbGUuc2V0VG8ocmVkdWNlZFNjYWxlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhYmVsLmNlbnRlclggPSB0aGlzLndpZHRoIC8gMjtcbiAgICAgICAgdGhpcy5sYWJlbC5jZW50ZXJZID0gdGhpcy5oZWlnaHQgLyAyO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBCdXR0b247IiwiY2xhc3MgQ2FyZCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgbWFuYWdlcikge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsOyAgIC8vIFN0cmluZyBJRCBvZiBjYXJkLCBlLmcuICdLaCcgb3IgJzdzJ1xuICAgICAgICB0aGlzLnNwcml0ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCBcImNhcmRzXCIpO1xuICAgICAgICB0aGlzLnNwcml0ZS5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5zcHJpdGUuc2NhbGUuc2V0VG8oMS41KTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZS5mcmFtZU5hbWUgPSB0aGlzLm5hbWUgPyB0aGlzLm5hbWUgOiBcImJhY2tcIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmQ7IiwiY2xhc3MgQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgcGxheWVySWQsIHRva2VuKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgYWNjZXNzIHRva2VuIHVzZWQgdG8gYXV0aGVudGljYXRlIG9uIEFQSSBjYWxsc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIFRoZSBGbGFzay1KV1QtRXh0ZW5kZWQgYWNjZXNzIHRva2VuXG4gICAgICovXG4gICAgc2V0VG9rZW4odG9rZW4pIHtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICAgKlxuICAgICAqIE9ubHkgZXJyb3JzIGFyZSByZXBvcnRlZC4gU3VjY2VzcyBpcyBzaWxlbnQuIEdhbWUgY2hhbmdlcyByZXN1bHRpbmdcbiAgICAgKiBmcm9tIHJlcXVlc3RzIGFyZSBoYW5kbGVkIHZpYSBTZXJ2ZXIgU2VudCBFdmVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW5kcG9pbnQgLSBUaGUgZW5kcG9pbnQgb24gdGhlIHNlcnZlciB0byBzZW5kIHJlcXVlc3QgdG9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIFRoZSBwYXlsb2FkIHRvIHNlbmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZD1cIlBPU1RdIC0gVGhlIEhUVFAgbWV0aG9kIHRvIHVzZVxuICAgICAqL1xuICAgIHNlbmRSZXF1ZXN0KGVuZHBvaW50LCBkYXRhLCBtZXRob2QgPSBcIlBPU1RcIikge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKG1ldGhvZCwgZW5kcG9pbnQpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIGxldCByZXNwID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAvLyBJbnZhbGlkIHJlcXVlc3QgZXJyb3JcbiAgICAgICAgICAgICAgICBpZiAocmVzcC5zdWNjZXNzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4ocmVzcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCAmJiB4aHIuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAvLyBGYWlsZWQgcmVxdWVzdCBlcnJvclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIHRoaXMudG9rZW4pO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhbiBhY3Rpb24gcmVxdWVzdFxuICAgICAqXG4gICAgICogVGhpcyBpcyB0aGUgbW9zdCBoZWF2aWx5LXVzZWQgcmVxdWVzdCB0eXBlIGluIHRoZSBnYW1lLiBBbGwgaW4tZ2FtZVxuICAgICAqIGFjdGlvbnMgKGJldCwgY2hlY2ssIGZvbGQpIGhhcHBlbiBoZXJlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgLSBUaGUgcGF5bG9hZCB0byBzZW5kXG4gICAgICovXG4gICAgYWN0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImFjdGlvblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGNoZWNrKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJDSEVDS1wiKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgYmV0KGFtdCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJCRVRcIiwgYW10KTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgZm9sZCgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiRk9MRFwiKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhIGJlYWNvbiB0byB0aGUgc2VydmVyIG9uIGRpc2Nvbm5lY3RcbiAgICAgKlxuICAgICAqIFRoaXMgYWxsb3dzIGZvciBzZXJ2ZXIgdG8ga25vdyB3aGVuIGEgY2xpZW50IGRpc2Nvbm5lY3RzIHNvXG4gICAgICogaXQgY2FuIGNsZWFuIHVwIGFzIG5lY2Vzc2FyeS4gTm8gZ3VhcmFudGVlIHRoYXQgdGhpcyBtZXNzYWdlXG4gICAgICogd2lsbCBnbyB0aHJvdWdoLCBzbyBtdXN0IGhhdmUgcmVkdW5kYW50IG1lYXN1cmVzIGluIHBsYWNlLlxuICAgICAqL1xuICAgIGRpc2Nvbm5lY3RCZWFjb24oKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7fTtcbiAgICAgICAgY29uc3QgdXJsID0gXCIvZGlzY29ubmVjdC9cIjtcbiAgICAgICAgbmF2aWdhdG9yLnNlbmRCZWFjb24odXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBqb2luKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge1widXNlcklkXCI6IHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VySWR9O1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiam9pblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGJ1aWxkUGF5bG9hZChhY3Rpb25UeXBlLCBiZXRBbXQgPSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcInBsYXllcklkXCI6IHRoaXMucGxheWVySWQsXG4gICAgICAgICAgICBcImFjdGlvblR5cGVcIjogYWN0aW9uVHlwZSxcbiAgICAgICAgICAgIFwiYmV0QW10XCI6IGJldEFtdFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYnVpbGRVcmwoZW5kcG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZVVybCArIGVuZHBvaW50ICsgXCIvXCI7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyOyIsImltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCIuL0J1dHRvblwiO1xuaW1wb3J0IFNsaWRlciBmcm9tIFwiLi9TbGlkZXJcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmNsYXNzIFBhbmVsIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXkpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuYmV0cyA9IFswXTtcbiAgICAgICAgdGhpcy5wcmltYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMucHJpbWFyeUFjdGlvbiA9IEFjdGlvbi5CRVQ7XG4gICAgICAgIHRoaXMucHJpbWFyeUJldCA9IDA7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QWN0aW9uID0gQWN0aW9uLkNIRUNLO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUJldCA9IDA7XG4gICAgICAgIHRoaXMudGVydGlhcnlDbGlja2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy50ZXJ0aWFyeUFjdGlvbiA9IEFjdGlvbi5GT0xEO1xuICAgICAgICB0aGlzLnNsaWRlciA9IG5ldyBTbGlkZXIodGhpcy5nYW1lLCBcInBhbmVsXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7fTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5wcmltYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDAsIDAsIFwibWVkXCIsICgpID0+IHRoaXMucHJpbWFyeUNsaWNrZWQuZGlzcGF0Y2godGhpcy5wcmltYXJ5QWN0aW9uLCB0aGlzLnByaW1hcnlCZXQpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNlY29uZGFyeSA9IHRoaXMubWFrZUJ1dHRvbigxMzUsIDAsIFwibWVkXCIsICgpID0+IHRoaXMuc2Vjb25kYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnNlY29uZGFyeUFjdGlvbiwgdGhpcy5zZWNvbmRhcnlCZXQpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRlcnRpYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDI3MCwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy50ZXJ0aWFyeUNsaWNrZWQuZGlzcGF0Y2godGhpcy50ZXJ0aWFyeUFjdGlvbiwgMCkpO1xuXG4gICAgICAgIHRoaXMuc2xpZGVyLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuc2xpZGVyLmluZGV4Q2hhbmdlZC5hZGQoKGluZGV4KSA9PiB0aGlzLnNldFByaW1hcnlCZXQodGhpcy5iZXRzW2luZGV4XSksIHRoaXMpO1xuICAgICAgICB0aGlzLnNsaWRlci5zbGlkZXJXaGVlbC5hZGQodGhpcy5zaW5nbGVTdGVwQmV0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNsaWRlciA9IHRoaXMuc2xpZGVyLmJhcjtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNsaWRlci55ID0gNjA7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5wcmltYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zZWNvbmRhcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnRlcnRpYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zbGlkZXIpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG1ha2VCdXR0b24oeCwgeSwgc2l6ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ1dHRvbiA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCB4LCB5LCB0aGlzLmtleSk7XG4gICAgICAgIGJ1dHRvbi5vbklucHV0VXAuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgYnV0dG9uLnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX292ZXJcIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX291dFwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfdXBcIlxuICAgICAgICApO1xuICAgICAgICBidXR0b24uc2V0VGV4dFN0eWxlKHRoaXMuZ2FtZS5jb25maWcucGFuZWwudGV4dFN0eWxlKTtcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICBsZXQgcHJpbWFyeVRleHQgPSBcIkJFVCBcIiArIFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLnByaW1hcnlCZXQpO1xuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeS5zZXRUZXh0KHByaW1hcnlUZXh0KTtcblxuICAgICAgICBsZXQgc2Vjb25kYXJ5VGV4dCA9IFwiQ0hFQ0tcIjtcbiAgICAgICAgaWYgKHRoaXMuc2Vjb25kYXJ5QWN0aW9uICE9PSBBY3Rpb24uQ0hFQ0spIHtcbiAgICAgICAgICAgIHNlY29uZGFyeVRleHQgPSBcIkNBTEwgXCIgKyBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5zZWNvbmRhcnlCZXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheS5zZWNvbmRhcnkuc2V0VGV4dChzZWNvbmRhcnlUZXh0KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkudGVydGlhcnkuc2V0VGV4dChcIkZPTERcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLnZpc2libGUgPSB0aGlzLnZpc2libGU7XG4gICAgfVxuXG4gICAgc2V0QmV0cyhiZXRzKSB7XG4gICAgICAgIGlmIChiZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIGJldHMuIFBhbmVsIG11c3QgYWx3YXlzIGhhdmUgYXQgbGVhc3Qgb25lIHZhbGlkIGJldC5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJldHMgPSBiZXRzO1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSBiZXRzWzBdO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRMZW5ndGgoYmV0cy5sZW5ndGgpO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRJbmRleCgwKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0RW5hYmxlZChiZXRzLmxlbmd0aCA+IDEpO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRQcmltYXJ5QmV0KGJldCkge1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSBiZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldFNlY29uZGFyeUJldChiZXQpIHtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlCZXQgPSBiZXQ7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QWN0aW9uID0gYmV0ID09PSAwID8gQWN0aW9uLkNIRUNLIDogQWN0aW9uLkJFVDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSGlkZSBvciBzaG93IHRoZSBlbnRpcmUgcGFuZWxcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGVcbiAgICAgKi9cbiAgICBzZXRWaXNpYmxlKHZpc2libGUpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSW5jcmVtZW50IG9yIGRlY3JlbWVudCB0aGlzLnByaW1hcnlCZXRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Nb3VzZS53aGVlbERlbHRhfSBtb2RpZmllciAtICsxIG9yIC0xXG4gICAgICovXG4gICAgc2luZ2xlU3RlcEJldChtb2RpZmllcikge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnNsaWRlci5pbmRleCArIG1vZGlmaWVyO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8PSB0aGlzLnNsaWRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyLnNldEluZGV4KGluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFuZWw7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcbmltcG9ydCBDYXJkTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2FyZE1hbmFnZXJcIjtcblxuY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBtYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG5cbiAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlcklkID0gbnVsbDtcbiAgICAgICAgdGhpcy5iYWxhbmNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5zaXR0aW5nT3V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWF0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5yb3VuZEJldCA9IDA7ICAvLyBTdW0gYmV0cyBieSBwbGF5ZXIgaW4gY3VycmVudCBiZXR0aW5nIHJvdW5kXG5cbiAgICAgICAgdGhpcy5pc0RlYWxlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzTmV4dCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzVXNlciA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcblxuICAgICAgICB0aGlzLmNhcmRzID0gbmV3IENhcmRNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkYXRhLmlkO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IGRhdGEudXNlcklkO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuc2l0dGluZ091dCA9IGRhdGEuc2l0dGluZ091dDtcbiAgICAgICAgdGhpcy5zZWF0ID0gZGF0YS5zZWF0O1xuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZGF0YS5pc1VzZXI7XG5cbiAgICAgICAgdGhpcy5jYXJkcy5pbml0aWFsaXplKDIpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZCA9IHRoaXMuZGlzcGxheUdyb3VwLmNyZWF0ZSgwLCAwLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVSZWN0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhY2tncm91bmQuYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgLTIwLCBcIlwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkubmFtZSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMjAsIFwiXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5iYWxhbmNlKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMgPSB0aGlzLmNhcmRzLmRpc3BsYXlHcm91cDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLmNlbnRlclggPSAwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMuY2VudGVyWSA9IC0xMjA7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuY2FyZHMpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24gPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCBcImRlYWxlckJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbi5sZWZ0ID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQubGVmdCArIDU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24uYm90dG9tID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQuYm90dG9tIC0gNTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24pO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgXCJyZWRDaXJjbGVcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yLnJpZ2h0ID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQucmlnaHQgLSA1O1xuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvci5ib3R0b20gPSB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5ib3R0b20gLSA1O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnRleHQgPSB0aGlzLm5hbWU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLnRleHQgPSBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5iYWxhbmNlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbi52aXNpYmxlID0gdGhpcy5pc0RlYWxlciA9PT0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IudmlzaWJsZSA9IHRoaXMuaXNOZXh0ID09PSB0cnVlO1xuICAgIH1cblxuICAgIHVwZGF0ZShkYXRhKSB7XG4gICAgICAgIC8vIFRPRE8gLSBGbGVzaCBvdXQgdGhlIHJlc3Qgb2YgdGhlIGRhdGEgLS0gZG8gSSBsaWtlIHRoaXMgbWV0aG9kP1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2UgPT09IHVuZGVmaW5lZCA/IHRoaXMuYmFsYW5jZSA6IGRhdGEuYmFsYW5jZTtcbiAgICAgICAgdGhpcy5pc0RlYWxlciA9IGRhdGEuaXNEZWFsZXIgPT09IHVuZGVmaW5lZCA/IHRoaXMuaXNEZWFsZXIgOiBkYXRhLmlzRGVhbGVyO1xuICAgICAgICB0aGlzLmlzTmV4dCA9IGRhdGEuaXNOZXh0ID09PSB1bmRlZmluZWQgPyB0aGlzLmlzTmV4dCA6IGRhdGEuaXNOZXh0O1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gZGF0YS5yb3VuZEJldCA9PT0gdW5kZWZpbmVkID8gdGhpcy5yb3VuZEJldCA6IGRhdGEucm91bmRCZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyOyIsImltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5cbmNsYXNzIFBvdCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmFtb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSB0aGlzLm1ha2VCdG4oMCwgMCwgXCJcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlUmVjdCwgKCkgPT4ge30pO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZS50ZXh0LnRleHQgPSBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5hbW91bnQpO1xuICAgIH1cblxuICAgIHNldEFtb3VudChhbW91bnQpIHtcbiAgICAgICAgdGhpcy5hbW91bnQgPSBhbW91bnQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG1ha2VCdG4oeCwgeSwgdGV4dCwgdGV4dHVyZSwgY2FsbGJhY2ssIGNhbGxiYWNrQ29udGV4dCA9IHRoaXMpIHtcbiAgICAgICAgbGV0IGJ0biA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKHgsIHksIHRleHR1cmUsIGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQpO1xuICAgICAgICBidG4uYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgbGV0IGJ0blRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMCwgdGV4dCk7XG4gICAgICAgIGJ0blRleHQuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIGJ0bi5hZGRDaGlsZChidG5UZXh0KTtcbiAgICAgICAgYnRuLnRleHQgPSBidG5UZXh0O1xuXG4gICAgICAgIHJldHVybiBidG47XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb3Q7IiwiLyoqXG4gKiBBIHNsaWRlciBVSSBlbGVtZW50XG4gKlxuICogUmVwcmVzZW50ZWQgYnkgYSBiYXIgc3ByaXRlIGFuZCBhIG1hcmtlciBzcHJpdGUuIERlc3BpdGUgaG93IGl0IG1heVxuICogbG9vaywgYWxsIGlucHV0IG9jY3VycyBvbiB0aGUgYmFyIGFuZCB1cGRhdGVzIGFyZSBtYWRlIHRvIHRoZVxuICogbWFya2VyJ3MgcG9zaXRpb24gYmFzZWQgb24gdGhvc2UgaW5wdXRzLlxuICovXG5jbGFzcyBTbGlkZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5iYXIgPSBudWxsOyAgLy8gVGhlIHNsaWRlciBiYXIgc3ByaXRlXG4gICAgICAgIHRoaXMubWFya2VyID0gbnVsbDsgIC8vIFRoZSBkcmFnZ2FibGUgbWFya2VyIHNwcml0ZVxuICAgICAgICB0aGlzLmluZGV4ID0gMDsgIC8vIEN1cnJlbnQgaW5kZXggb2YgbWFya2VyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMTsgIC8vIFRvdGFsIG51bWJlciBvZiBpbmRpY2VzXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2xpZGVyV2hlZWwgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmJhciA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgdGhpcy5rZXksIFwic2xpZGVyX2JhclwiKTtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXREb3duLmFkZCh0aGlzLnN0YXJ0RHJhZywgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0VXAuYWRkKHRoaXMuc3RvcERyYWcsIHRoaXMpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHRoaXMuZW5hYmxlU2xpZGVyV2hlZWwodHJ1ZSkpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4gdGhpcy5lbmFibGVTbGlkZXJXaGVlbChmYWxzZSkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyID0gdGhpcy5iYXI7XG5cbiAgICAgICAgdGhpcy5tYXJrZXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCB0aGlzLmtleSwgXCJzbGlkZXJfbWFya2VyXCIpO1xuICAgICAgICB0aGlzLm1hcmtlci5hbmNob3Iuc2V0VG8oMC41LCAwKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuYm90dG9tID0gdGhpcy5iYXIuYm90dG9tO1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyID0gdGhpcy5tYXJrZXI7XG4gICAgICAgIHRoaXMuYmFyLmFkZENoaWxkKHRoaXMubWFya2VyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgc2xpZGVyIGRyYWdnaW5nIGFuZCBpbml0aWF0ZSBmaXJzdCBkcmFnIGV2ZW50XG4gICAgICogQHBhcmFtIHtQaGFzZXIuU3ByaXRlfSBiYXIgLSBUaGUgYmFyIHNwcml0ZSB0aGF0IHdhcyBjbGlja2VkXG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBwb2ludGVyIHdoaWNoIGluaXRpYXRlZCB0aGUgY2xpY2tcbiAgICAgKi9cbiAgICBzdGFydERyYWcoYmFyLCBwb2ludGVyKSB7XG4gICAgICAgIC8vIEluaXRpYWwgY2FsbCB0byB1cGRhdGVEcmFnIGFsbG93cyBjaGFuZ2luZyBiZXQgd2l0aCBjbGljayBvbiBiYXJcbiAgICAgICAgdGhpcy51cGRhdGVEcmFnKHBvaW50ZXIsIHBvaW50ZXIueCwgcG9pbnRlci55KTtcbiAgICAgICAgdGhpcy5nYW1lLmlucHV0LmFkZE1vdmVDYWxsYmFjayh0aGlzLnVwZGF0ZURyYWcsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IERpc2FibGUgc2xpZGVyIGRyYWdnaW5nXG4gICAgICovXG4gICAgc3RvcERyYWcoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5kZWxldGVNb3ZlQ2FsbGJhY2sodGhpcy51cGRhdGVEcmFnLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBDYWxjdWxhdGUgc2xpZGVyIGluZGV4IGJhc2VkIG9uIGRyYWcgaW5wdXRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Qb2ludGVyfSBwb2ludGVyIC0gVGhlIHNsaWRpbmcgcG9pbnRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSBvZiBwb2ludGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIG9mIHBvaW50ZXJcbiAgICAgKi9cbiAgICB1cGRhdGVEcmFnKHBvaW50ZXIsIHgsIHkpIHtcbiAgICAgICAgbGV0IGxvY2FsWCA9IHggLSB0aGlzLmJhci53b3JsZC54OyAgLy8gQ2xpY2sgcG9zIGluIHJlbGF0aW9uIHRvIGJhclxuXG4gICAgICAgIC8vIFByZXZlbnQgZHJhZ2dpbmcgcGFzdCBiYXIgYm91bmRzXG4gICAgICAgIGlmIChsb2NhbFggPCAwKSB7XG4gICAgICAgICAgICBsb2NhbFggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsWCA+IHRoaXMuYmFyLndpZHRoKSB7XG4gICAgICAgICAgICBsb2NhbFggPSB0aGlzLmJhci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN1YnRyYWN0IDEgZnJvbSBsZW5ndGggYmVjYXVzZSBsZW5ndGggaXMgMS1pbmRleGVkLCBpbmRpY2VzIGFyZSAwLWluZGV4ZWRcbiAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLnJvdW5kKGxvY2FsWCAvIHRoaXMuYmFyLndpZHRoICogKHRoaXMubGVuZ3RoIC0gMSkpO1xuICAgICAgICB0aGlzLnNldEluZGV4KGluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIGluZGV4IG9mIHRoZSBzbGlkZXIgYW5kIHJlcG9ydCB0aGUgbmV3IHZhbHVlXG4gICAgICpcbiAgICAgKiBPcHRpb25hbGx5IHVwZGF0ZSB0aGUgdmlzdWFsIHBvc2l0aW9uIG9mIHRoZSBtYXJrZXIgb24gdGhlIHNsaWRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIE5ldyBpbmRleCB0byBzZXQgb24gc2xpZGVyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXBkYXRlUG9zPXRydWVdIC0gVXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBtYXJrZXI/XG4gICAgICovXG4gICAgc2V0SW5kZXgoaW5kZXgsIHVwZGF0ZVBvcyA9IHRydWUpIHtcbiAgICAgICAgaWYgKGluZGV4ICE9PSB0aGlzLmluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZC5kaXNwYXRjaChpbmRleCk7XG5cbiAgICAgICAgICAgIGlmICh1cGRhdGVQb3MpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiBvbmx5IG9uZSBiZXQgYXZhaWxhYmxlLCBpdCdzIGEgbWF4IGJldFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgMSBmcm9tIGxlbmd0aCBiZWNhdXNlIGxlbmd0aCBpcyAxLWluZGV4ZWQsIGluZGljZXMgYXJlIDAtaW5kZXhlZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGggLyAodGhpcy5sZW5ndGggLSAxKSAqIHRoaXMuaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVXBkYXRlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgKlxuICAgICAqIFRoZSBsZW5ndGggcHJvcGVydHkgZGVzY3JpYmVzIGhvdyBtYW55IGRpc2NyZXRlIGJldHMgdGhlIHNsaWRlciBiYXJcbiAgICAgKiBtdXN0IHJlcHJlc2VudC4gVGhlIHNsaWRlciBkb2VzIG5vdCBjYXJlIGFib3V0IHdoYXQgdGhlIHNwZWNpZmljIGJldFxuICAgICAqIGl0IHJlcHJlc2VudHMgaXMsIG9ubHkgdGhhdCBpdCBoYXMgc29tZSBudW1iZXIgb2YgaW5kaWNlcyBhbG9uZyBpdHNcbiAgICAgKiBsZW5ndGggYW5kIHRoYXQgaXQgbXVzdCByZXBvcnQgaXRzIGluZGV4IHRvIGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbmV3IGxlbmd0aCB0byBzZXRcbiAgICAgKi9cbiAgICBzZXRMZW5ndGgobGVuZ3RoKSB7XG4gICAgICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCBzZXQgc2xpZGVyIGxlbmd0aCBsZXNzIHRoYW4gMVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChsZW5ndGggPiB0aGlzLmJhci53aWR0aCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogU2V0dGluZyBzbGlkZXIgc3RvcHMgZ3JlYXRlciB0aGFuIGxlbmd0aCBtYXkgcmVzdWx0IGluIHVuZXhwZWN0ZWQgYmVoYXZpb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIHNsaWRlclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIElzIHRoZSBzbGlkZXIgZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gZW5hYmxlZDtcblxuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyLnRpbnQgPSB0aW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIGRpc3BhdGNoIG9mIHNpZ25hbCBvbiB3aGVlbCBzY3JvbGxcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBJcyB0aGUgY2FsbGJhY2sgZW5hYmxlZCBvciBkaXNhYmxlZD9cbiAgICAgKi9cbiAgICBlbmFibGVTbGlkZXJXaGVlbChlbmFibGVkKSB7XG4gICAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQubW91c2UubW91c2VXaGVlbENhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyV2hlZWwuZGlzcGF0Y2godGhpcy5nYW1lLmlucHV0Lm1vdXNlLndoZWVsRGVsdGEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS5tb3VzZVdoZWVsQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbGlkZXI7IiwibW9kdWxlLmV4cG9ydHM9e1xuICBcInBhbmVsXCI6IHtcbiAgICBcInBhZGRpbmdcIjogMTAsXG4gICAgXCJ0ZXh0U3R5bGVcIjoge1xuICAgICAgXCJmb250XCI6IFwiYm9sZCAyMnB0IEFyaWFsXCIsXG4gICAgICBcImZpbGxcIjogXCJ3aGl0ZVwiXG4gICAgfSxcbiAgICBcInBvc1wiOiB7XG4gICAgICBcInhcIjogMTQ4MCxcbiAgICAgIFwieVwiOiA3OTBcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgQ2FyZCBmcm9tIFwiLi4vY2xhc3Nlcy9DYXJkXCI7XG5cbmNsYXNzIENhcmRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuY2FyZHMgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShudW1fY2FyZHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1fY2FyZHM7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNhcmQgPSBuZXcgQ2FyZCh0aGlzLmdhbWUsIHRoaXMpO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplKHt9KTtcbiAgICAgICAgICAgIGNhcmQuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICAgICAgdGhpcy5jYXJkcy5wdXNoKGNhcmQpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKGNhcmQuc3ByaXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFsaWduKC0xLCAxLCB0aGlzLmNhcmRzWzBdLnNwcml0ZS53aWR0aCAqIDEuMiwgMCk7XG4gICAgfVxuXG4gICAgc2V0Q2FyZE5hbWVzKG5hbWVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG5hbWVzW2ldO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLm5hbWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmRNYW5hZ2VyOyIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL2NsYXNzZXMvUGxheWVyXCI7XG5cbmNsYXNzIFBsYXllck1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcblxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTsgIC8vIERpcmVjdCBhY2Nlc3MgdG8gdGhlIFBsYXllciBvYmplY3RzXG4gICAgICAgIHRoaXMudXNlclBsYXllciA9IG51bGw7ICAvLyBUaGUgdXNlcidzIHBsYXllciBvYmplY3QsIGlmIGF2YWlsYWJsZVxuXG4gICAgICAgIC8vIENvbnRhaW5zIGFsbCBkaXNwbGF5IGVsZW1lbnRzIGZvciBhbGwgcGxheWVycyBpbiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKHBsYXllckRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcGxheWVyID0gbmV3IFBsYXllcih0aGlzLmdhbWUsIHRoaXMpO1xuICAgICAgICAgICAgcGxheWVyLmluaXRpYWxpemUocGxheWVyRGF0YVtpXSk7XG4gICAgICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChwbGF5ZXIuZGlzcGxheUdyb3VwKTtcblxuICAgICAgICAgICAgaWYgKHBsYXllckRhdGFbaV0uaXNVc2VyID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VyUGxheWVyID0gcGxheWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucGxheWVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFsaWduKC0xLCAxLCB0aGlzLnBsYXllcnNbMF0uZGlzcGxheUdyb3VwLndpZHRoICogMS4yLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEJ5SWQoaWQpIHtcbiAgICAgICAgLy8gVE9ETyAtIERvIHRoaXMgd2l0aG91dCBpdGVyYXRpbmcgLS0gYnVpbGQgbWFwIG9uIGluaXQ/XG4gICAgICAgIC8vIFRPRE8gLSBTaG91bGQgdGhpcyBldmVyIHJldHVybiBudWxsP1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyTWFuYWdlcjsiLCJjb25zdCBpc1N0cmluZyA9IHZhbCA9PiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbmNvbnN0IGlzQmxvYiA9IHZhbCA9PiB2YWwgaW5zdGFuY2VvZiBCbG9iO1xuXG5wb2x5ZmlsbC5jYWxsKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnID8gd2luZG93IDogdGhpcyB8fCB7fSk7XG5cbmZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICBpZiAoaXNTdXBwb3J0ZWQuY2FsbCh0aGlzKSkgcmV0dXJuO1xuXG4gIGlmICghKCduYXZpZ2F0b3InIGluIHRoaXMpKSB0aGlzLm5hdmlnYXRvciA9IHt9O1xuICB0aGlzLm5hdmlnYXRvci5zZW5kQmVhY29uID0gc2VuZEJlYWNvbi5iaW5kKHRoaXMpO1xufTtcblxuZnVuY3Rpb24gc2VuZEJlYWNvbih1cmwsIGRhdGEpIHtcbiAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50ICYmIHRoaXMuZXZlbnQudHlwZTtcbiAgY29uc3Qgc3luYyA9IGV2ZW50ID09PSAndW5sb2FkJyB8fCBldmVudCA9PT0gJ2JlZm9yZXVubG9hZCc7XG5cbiAgY29uc3QgeGhyID0gKCdYTUxIdHRwUmVxdWVzdCcgaW4gdGhpcykgPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICB4aHIub3BlbignUE9TVCcsIHVybCwgIXN5bmMpO1xuICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICcqLyonKTtcblxuXG4gIGlmIChpc1N0cmluZyhkYXRhKSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jyk7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9ICd0ZXh0L3BsYWluJztcbiAgfSBlbHNlIGlmIChpc0Jsb2IoZGF0YSkgJiYgZGF0YS50eXBlKSB7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsIGRhdGEudHlwZSk7XG4gIH1cblxuICB0cnkge1xuICAgIHhoci5zZW5kKGRhdGEpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc1N1cHBvcnRlZCgpIHtcbiAgcmV0dXJuICgnbmF2aWdhdG9yJyBpbiB0aGlzKSAmJiAoJ3NlbmRCZWFjb24nIGluIHRoaXMubmF2aWdhdG9yKTtcbn0iLCJpbXBvcnQgY29uZmlnIGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCBDb250cm9sbGVyIGZyb20gXCIuLi9jbGFzc2VzL0NvbnRyb2xsZXJcIjtcblxuY2xhc3MgQm9vdCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmluaXRpYWxEYXRhID0gaW5pdGlhbERhdGE7XG4gICAgICAgIHRoaXMuZ2FtZS5jb25maWcgPSBjb25maWc7XG5cbiAgICAgICAgLy8gVE9ETyAtIFRoaXMgc2hvdWxkIGNvbWUgZnJvbSBzb21ld2hlcmUgZHluYW1pY1xuICAgICAgICB0aGlzLmdhbWUucnVsZXMgPSB7XG4gICAgICAgICAgICBibGluZHM6IHtcbiAgICAgICAgICAgICAgICBzbWFsbDogMjUsXG4gICAgICAgICAgICAgICAgYmlnOiA1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcklkLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudG9rZW4pO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibG9hZFwiKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvb3Q7IiwiY2xhc3MgTG9hZCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgcHJlbG9hZCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJiYWNrZ3JvdW5kXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYmFja2dyb3VuZC5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwiZGVhbGVyQnV0dG9uXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvZGVhbGVyYnV0dG9uLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJyZWRDaXJjbGVcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9yZWRjaXJjbGUucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwiY2FyZHNcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9jYXJkcy5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9jYXJkcy5qc29uXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwicGFuZWxcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9wYW5lbC5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9wYW5lbC5qc29uXCIpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS50ZXh0dXJlcyA9IHRoaXMuY3JlYXRlQ3VzdG9tVGV4dHVyZXMoKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydChcIm1haW5cIik7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3VzdG9tVGV4dHVyZXMoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IHt9O1xuXG4gICAgICAgIGxldCBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMTAwLCAxMDAsIDEwMCwgMTAwKTtcbiAgICAgICAgdGV4dHVyZXNbXCJ3aGl0ZVNxdWFyZVwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmxpbmVTdHlsZSg0LCAweDAwMDAwMCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIDMwMCwgMTAwKTtcblxuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlUmVjdFwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuXG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICByZXR1cm4gdGV4dHVyZXM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkOyIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2NsYXNzZXMvQWN0aW9uLmpzXCI7XG5pbXBvcnQgQ2FyZE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NhcmRNYW5hZ2VyXCI7XG5pbXBvcnQgUGFuZWwgZnJvbSBcIi4uL2NsYXNzZXMvUGFuZWxcIjtcbmltcG9ydCBQbGF5ZXJNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9QbGF5ZXJNYW5hZ2VyXCI7XG5pbXBvcnQgUG90IGZyb20gXCIuLi9jbGFzc2VzL1BvdFwiO1xuaW1wb3J0IFBva2VyIGZyb20gXCIuLi9Qb2tlclwiO1xuaW1wb3J0IFNTRSBmcm9tIFwiLi4vU1NFXCI7XG5cbmNsYXNzIE1haW4gZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMudGFibGVfc3NlID0gbmV3IFNTRSh0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZVNTRVVybCk7XG4gICAgICAgIHRoaXMudXNlcl9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnVzZXJTU0VVcmwpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5sb2FkXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmRpc2Nvbm5lY3RCZWFjb24oKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCBcImJhY2tncm91bmRcIik7XG4gICAgICAgIHRoaXMuZGVhbEJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDEwMCwgXCJkZWFsXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5kZWFsKTtcblxuICAgICAgICB0aGlzLmdhbWUucGxheWVycyA9IG5ldyBQbGF5ZXJNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmluaXRpYWxpemUodGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcnMpO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVycy5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVycy5kaXNwbGF5R3JvdXAuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYIC8gNjtcblxuICAgICAgICB0aGlzLmdhbWUuYm9hcmQgPSBuZXcgQ2FyZE1hbmFnZXIodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmluaXRpYWxpemUoNSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmNlbnRlclkgPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWTtcblxuICAgICAgICB0aGlzLmdhbWUucG90ID0gbmV3IFBvdCh0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmdhbWUucG90LmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wb3Quc3ByaXRlLmNlbnRlclggPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWDtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5zcHJpdGUuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZIC0gMTQwO1xuXG4gICAgICAgIC8vIFRPRE8gLSBUaGVzZSBzaG91bGQgZ28gc29tZXdoZXJlIGVsc2UuIE1heWJlIGluIFBvdD9cbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbCA9IG5ldyBQYW5lbCh0aGlzLmdhbWUsIFwicGFuZWxcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueCA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLng7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueSA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLnk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcnMoKTtcblxuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld0hhbmRcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdIYW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucG90LnNldEFtb3VudCgwKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnBsYXllcnMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzW2ldO1xuICAgICAgICAgICAgICAgIHBsYXllci5jYXJkcy5yZXNldCgpO1xuICAgICAgICAgICAgICAgIHBsYXllci51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgICBpc0RlYWxlcjogcGxheWVyLmlkID09PSBkYXRhLmRlYWxlcixcbiAgICAgICAgICAgICAgICAgICAgaXNOZXh0OiBwbGF5ZXIuaWQgPT09IGRhdGEubmV4dCxcbiAgICAgICAgICAgICAgICAgICAgcm91bmRCZXQ6IDBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRPRE8gLSB1c2VyUGxheWVyLmlkIHdpbGwgZmFpbCBmb3Igd2F0Y2hlcnNcbiAgICAgICAgICAgIGxldCB1c2VyUGxheWVyTmV4dCA9IGRhdGEubmV4dCA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5pZDtcbiAgICAgICAgICAgIGlmICh1c2VyUGxheWVyTmV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRCZXRzKFBva2VyLmdlbmVyYXRlUmFpc2VzKHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuc21hbGwsIHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuYmlnLCB0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodXNlclBsYXllck5leHQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdSb3VuZFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1JvdW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXS51cGRhdGUoe3JvdW5kQmV0OiAwfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJhY3Rpb25cIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhY3Rpb246IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5zZXRDYXJkTmFtZXMoZGF0YS5ib2FyZCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEucGxheWVySWQpLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgYmFsYW5jZTogZGF0YS5wbGF5ZXJCYWxhbmNlLFxuICAgICAgICAgICAgICAgIGlzTmV4dDogZmFsc2UsXG4gICAgICAgICAgICAgICAgcm91bmRCZXQ6IGRhdGEucGxheWVyUm91bmRCZXRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpLnVwZGF0ZSh7aXNOZXh0OiB0cnVlfSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucG90LnNldEFtb3VudChkYXRhLnBvdCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSBkYXRhLnJvdW5kQmV0O1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSBkYXRhLnJvdW5kUmFpc2U7XG5cbiAgICAgICAgICAgIGxldCB1c2VyUGxheWVyTmV4dCA9IGRhdGEubmV4dCA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5pZDtcbiAgICAgICAgICAgIGlmICh1c2VyUGxheWVyTmV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRCZXRzKFBva2VyLmdlbmVyYXRlUmFpc2VzKHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuc21hbGwsIHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuYmlnLCB0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KFBva2VyLmdldE1pbkJldCh0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodXNlclBsYXllck5leHQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJoYW5kQ29tcGxldGVcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoYW5kQ29tcGxldGU6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS53aW5uZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHdpbm5lciA9IGRhdGEud2lubmVyc1tpXTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKHdpbm5lci5pZCkudXBkYXRlKHtiYWxhbmNlOiB3aW5uZXIuYmFsYW5jZX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdQbGF5ZXJcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1BsYXllcjogXCIsIGRhdGEpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLnVzZXJfc3NlLmFkZExpc3RlbmVyKFwibmV3SGFuZFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3SGFuZDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV0uaWQgPT09IHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5wbGF5ZXJJZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzW2ldLmNhcmRzLnNldENhcmROYW1lcyhkYXRhLmhvbGRpbmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlLmFkZExpc3RlbmVyKFwibmV3UGxheWVyXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdQbGF5ZXI6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLnNldFRva2VuKGRhdGEudG9rZW4pO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlckxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnByaW1hcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZWNvbmRhcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC50ZXJ0aWFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJvdXRlIGFjdGlvbnMgdG8gY29udHJvbGxlciByZXF1ZXN0c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY3Rpb24gLSBUaGUgYWN0aW9uIHRvIGJlIHJlcXVlc3RlZCwgZGVmaW5lZCBpbiBBY3Rpb24uanNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmV0IC0gVGhlIGJldCAoaWYgYW55KSB0byBiZSBzZW50IHRvIHRoZSBjb250cm9sbGVyXG4gICAgICovXG4gICAgaGFuZGxlQWN0aW9uKGFjdGlvbiwgYmV0KSB7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5GT0xEOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmZvbGQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uLkNIRUNLOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5CRVQ6XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuYmV0KGJldCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkludmFsaWQgQWN0aW9uIFR5cGU6IFwiICsgYWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcblxuICAgIH1cblxuICAgIG1ha2VCdG4oeCwgeSwgdGV4dCwgdGV4dHVyZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ0biA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKHgsIHksIHRleHR1cmUsIGNhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgYnRuLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIGxldCBidG5UZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDAsIHRleHQpO1xuICAgICAgICBidG5UZXh0LmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICBidG4uYWRkQ2hpbGQoYnRuVGV4dCk7XG4gICAgICAgIGJ0bi50ZXh0ID0gYnRuVGV4dDtcblxuICAgICAgICByZXR1cm4gYnRuO1xuICAgIH1cblxuICAgIGRlYWwoKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL3RhYmxlcy8nICsgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlTmFtZSArICcvZGVhbC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVCZXRzKHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIHJldHVybiBQb2tlci5nZW5lcmF0ZUJldHMoMjUsIDUwLCB0aGlzLmdhbWUucm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgcGxheWVyQmFsYW5jZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYWluOyJdfQ==
