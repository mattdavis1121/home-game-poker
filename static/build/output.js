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
            this.display.slider.y = 70;

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

            this.bar = this.game.add.image(0, 0, this.key, "slider_bar_extended");
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

            this.marker = this.game.add.sprite(0, 22, this.key, "slider_marker");
            this.marker.anchor.setTo(0.5, 0);
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

            var index = Math.round(localX / this.bar.width * this.length);
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

            this.index = index;
            this.indexChanged.dispatch(index);

            if (updatePos) {
                if (this.length === 1) {
                    // When only one bet available, it's a max bet
                    this.marker.x = this.bar.width;
                } else {
                    this.marker.x = this.bar.width / this.length * this.index;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NvbnRyb2xsZXIuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGFuZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGxheWVyLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BvdC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9TbGlkZXIuanMiLCJzdGF0aWMvc3JjL2NvbmZpZy5qc29uIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9DYXJkTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvUGxheWVyTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvcG9seWZpbGxzL3NlbmRiZWFjb24uanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Cb290LmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTG9hZC5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL01haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU0sSTs7O0FBQ0Ysb0JBQWM7QUFBQTs7QUFBQSxnSEFDSjtBQUNGLG1CQUFPLElBREw7QUFFRixvQkFBUTtBQUZOLFNBREk7O0FBTVYsY0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLE1BQWYsRUFBdUIsY0FBdkIsRUFBNkIsS0FBN0I7QUFDQSxjQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBZixFQUF1QixjQUF2QixFQUE2QixLQUE3QjtBQUNBLGNBQUssS0FBTCxDQUFXLEdBQVgsQ0FB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LEVBQVMsUSxFQUFVO0FBQ25DLGdCQUFJLE1BQU0sS0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLE1BQWQsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkIsT0FBM0IsRUFBb0MsUUFBcEMsRUFBOEMsSUFBOUMsQ0FBVjtBQUNBLGdCQUFJLE1BQUosQ0FBVyxLQUFYLENBQWlCLEdBQWpCOztBQUVBLGdCQUFJLFVBQVUsS0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLElBQWQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsSUFBekIsQ0FBZDtBQUNBLG9CQUFRLE1BQVIsQ0FBZSxLQUFmLENBQXFCLEdBQXJCO0FBQ0EsZ0JBQUksUUFBSixDQUFhLE9BQWI7QUFDQSxnQkFBSSxJQUFKLEdBQVcsT0FBWDs7QUFFQSxtQkFBTyxHQUFQO0FBQ0g7OzsrQkFFTTtBQUNILGdCQUFJLE1BQU0sSUFBSSxjQUFKLEVBQVY7QUFDQSxnQkFBSSxJQUFKLENBQVMsTUFBVCxFQUFpQixhQUFhLEtBQUssSUFBTCxDQUFVLFdBQVYsQ0FBc0IsU0FBbkMsR0FBK0MsUUFBaEU7QUFDQSxnQkFBSSxnQkFBSixDQUFxQixjQUFyQixFQUFxQyxrQkFBckM7QUFDQSxnQkFBSSxJQUFKLENBQVMsS0FBSyxTQUFMLENBQWU7QUFDcEIsMkJBQVcsWUFBWTtBQURILGFBQWYsQ0FBVDtBQUdIOzs7cUNBRVksYyxFQUFnQixhLEVBQWU7QUFDeEMsbUJBQU8sZ0JBQU0sWUFBTixDQUFtQixFQUFuQixFQUF1QixFQUF2QixFQUEyQixLQUFLLElBQUwsQ0FBVSxRQUFyQyxFQUErQyxjQUEvQyxFQUErRCxLQUFLLElBQUwsQ0FBVSxVQUF6RSxFQUFxRixhQUFyRixDQUFQO0FBQ0g7Ozs7RUFuTGMsT0FBTyxLOztrQkFzTFgsSSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBCb290IGZyb20gXCIuL3N0YXRlcy9Cb290XCI7XG5pbXBvcnQgTG9hZCBmcm9tIFwiLi9zdGF0ZXMvTG9hZFwiO1xuaW1wb3J0IE1haW4gZnJvbSBcIi4vc3RhdGVzL01haW5cIjtcblxuY2xhc3MgR2FtZSBleHRlbmRzIFBoYXNlci5HYW1lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgd2lkdGg6IDE5MjAsXG4gICAgICAgICAgICBoZWlnaHQ6IDEwODBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJib290XCIsIEJvb3QsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJsb2FkXCIsIExvYWQsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJtYWluXCIsIE1haW4sIGZhbHNlKTtcblxuICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KFwiYm9vdFwiKTtcbiAgICB9XG59XG5cbm5ldyBHYW1lKCk7IiwiLyoqXG4gKiBAc3VtbWFyeSBBIHV0aWxpdHkgY2xhc3Mgb2YgUG9rZXItc3BlY2lmaWMgZnVuY3Rpb25hbGl0eVxuICovXG5jbGFzcyBQb2tlciB7XG4gICAgLy8gVE9ETyAtIFRoaXMgdXRpbGl0eSBpcyBoaWdobHktc3BlY2lmaWMgdG8gTkwgZ2FtZXMsIG1heWJlIGV2ZW4gdG8gTkxIRS5cbiAgICAvLyAgTmVlZCB0byBtYWtlIGl0IG1vcmUgZ2VuZXJpYyBldmVudHVhbGx5IHRvIGFsbG93IGZvciBvdGhlciBnYW1lXG4gICAgLy8gIHR5cGVzLiBMaW1pdCBhbmQgcG90LWxpbWl0IGdhbWVzIHdpbGwgd29yayBjb21wbGV0ZWx5IGRpZmZlcmVudGx5LlxuICAgIC8vICBBbnRlcyBhcmUgYWxzbyBub3Qgc3VwcG9ydGVkLlxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2VuZXJhdGUgYWxsIGxlZ2FsIHJhaXNlcyBmb3IgcGxheWVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNtYWxsQmxpbmQgLSBUaGUgc21hbGwgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJpZ0JsaW5kIC0gVGhlIGJpZyBibGluZCBmb3IgdGhlIGdhbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm91bmRCZXQgLSBUaGUgbGVhZGluZyBiZXQgZm9yIHRoaXMgYmV0dGluZyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJSb3VuZEJldCAtIFRoZSBhbW91bnQgdGhpcyBwbGF5ZXIgaGFzIGNvbnRyaWJ1dGVkIHRvIHRoZSBwb3Qgc28gZmFyIHRoaXMgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJldlJhaXNlIC0gVGhlIGFtb3VudCB0aGUgcHJldmlvdXMgcmFpc2UgaW5jcmVhc2VkIHRoZSBiZXRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyQmFsYW5jZSAtIFRoZSBhbW91bnQgdGhlIHBsYXllciBoYXMgYXZhaWxhYmxlIHRvIGJldFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gLSBUaGUgdmFsaWQgcmFpc2VzXG4gICAgICovXG4gICAgc3RhdGljIGdlbmVyYXRlUmFpc2VzKHNtYWxsQmxpbmQsIGJpZ0JsaW5kLCByb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHByZXZSYWlzZSwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICBsZXQgcmFpc2UgPSBQb2tlci5nZXRNaW5SYWlzZShiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpO1xuICAgICAgICBsZXQgcmFpc2VzID0gW3JhaXNlXTtcblxuICAgICAgICB3aGlsZSAocmFpc2UgKyBzbWFsbEJsaW5kIDw9IHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgICAgIHJhaXNlICs9IHNtYWxsQmxpbmQ7XG4gICAgICAgICAgICByYWlzZXMucHVzaChyYWlzZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmFpc2UgPCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgICAgICByYWlzZXMucHVzaChwbGF5ZXJCYWxhbmNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByYWlzZXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IHRoZSBtaW5pbXVtIGFsbG93YWJsZSBiZXQgZm9yIHBsYXllclxuICAgICAqXG4gICAgICogSWYgbm8gYmV0cyBoYXZlIG9jY3VycmVkIGluIGN1cnJlbnQgcm91bmQsIHRoZSBtaW4gYmV0IGlzIGFcbiAgICAgKiBjaGVjayAoYmV0IG9mIDApLCBvdGhlcndpc2UgaXQncyBhIGNhbGwuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm91bmRCZXQgLSBUaGUgbGVhZGluZyBiZXQgZm9yIHRoaXMgYmV0dGluZyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJSb3VuZEJldCAtIFRoZSBhbW91bnQgdGhpcyBwbGF5ZXIgaGFzIGNvbnRyaWJ1dGVkIHRvIHRoZSBwb3Qgc28gZmFyIHRoaXMgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyQmFsYW5jZSAtIFRoZSBhbW91bnQgdGhlIHBsYXllciBoYXMgYXZhaWxhYmxlIHRvIGJldFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldE1pbkJldChyb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IG1pbkJldCA9IHJvdW5kQmV0ID09PSAwID8gMCA6IHJvdW5kQmV0IC0gcGxheWVyUm91bmRCZXQ7XG4gICAgICAgIGlmIChwbGF5ZXJCYWxhbmNlIDwgbWluQmV0KSB7XG4gICAgICAgICAgICBtaW5CZXQgPSBwbGF5ZXJCYWxhbmNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW5CZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IHRoZSBtaW5pbXVtIGFsbG93YWJsZSByYWlzZSBmb3IgcGxheWVyXG4gICAgICpcbiAgICAgKiBOT1RFOiBBIHJhaXNlIGhlcmUgbWF5IGFjdHVhbGx5IG1lYW4gYSBiZXQgaW4gcG9rZXIgdGVybXMuIEluIHRoZVxuICAgICAqIHBhcmxhbmNlIG9mIHRoaXMgdXRpbGl0eSwgYSByYWlzZSBpcyBhbiBhZ2dyZXNzaXZlIGFjdGlvbiwgb3Igc29tZXRoaW5nXG4gICAgICogd2hpY2ggd291bGQgZm9yY2Ugb3RoZXIgcGxheWVycyB0byBjb250cmlidXRlIG1vcmUgdG8gdGhlIHBvdCB0aGFuXG4gICAgICogdGhlIG90aGVyd2lzZSB3b3VsZCBoYXZlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJpZ0JsaW5kIC0gVGhlIGJpZyBibGluZCBmb3IgdGhlIGdhbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm91bmRCZXQgLSBUaGUgbGVhZGluZyBiZXQgZm9yIHRoaXMgYmV0dGluZyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJSb3VuZEJldCAtIFRoZSBhbW91bnQgdGhpcyBwbGF5ZXIgaGFzIGNvbnRyaWJ1dGVkIHRvIHRoZSBwb3Qgc28gZmFyIHRoaXMgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJldlJhaXNlIC0gVGhlIGFtb3VudCB0aGUgcHJldmlvdXMgcmFpc2UgaW5jcmVhc2VkIHRoZSBiZXRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyQmFsYW5jZSAtIFRoZSBhbW91bnQgdGhlIHBsYXllciBoYXMgYXZhaWxhYmxlIHRvIGJldFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldE1pblJhaXNlKGJpZ0JsaW5kLCByb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHByZXZSYWlzZSwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICBsZXQgbWluUmFpc2UgPSByb3VuZEJldCA9PT0gMCA/IGJpZ0JsaW5kIDogcm91bmRCZXQgLSBwbGF5ZXJSb3VuZEJldCArIHByZXZSYWlzZTtcbiAgICAgICAgaWYgKHBsYXllckJhbGFuY2UgPCBtaW5SYWlzZSkge1xuICAgICAgICAgICAgbWluUmFpc2UgPSBwbGF5ZXJCYWxhbmNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtaW5SYWlzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBva2VyOyIsImNsYXNzIFNTRSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgdXJsKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMudXJsID0gdXJsO1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSh0aGlzLnVybCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgUmUgYWRkcyBhbGwgbGlzdGVuZXJzIHRvIHRoaXMuc291cmNlXG4gICAgICpcbiAgICAgKiBJIG9yaWdpbmFsbHkgd3JvdGUgdGhpcyB0byBzdXBwb3J0IGNsaWVudCByZWNvbm5lY3RzLCBidXQgSSBkb24ndCBuZWVkXG4gICAgICogdGhhdCBhbnltb3JlLiBLZWVwaW5nIHRoZSBsaXN0ZW5lciBjb2RlIGp1c3QgaW4gY2FzZS5cbiAgICAgKi9cbiAgICByZUFkZEFsbExpc3RlbmVycygpIHtcbiAgICAgICAgbGV0IGxpc3RlbmVycyA9IHRoaXMubGlzdGVuZXJzO1xuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGxpc3RlbmVyID0gbGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihsaXN0ZW5lci50eXBlLCBsaXN0ZW5lci5jYWxsYmFjaywgbGlzdGVuZXIuY2FsbGJhY2tDb250ZXh0LCAuLi5saXN0ZW5lci5hcmdzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gU3RvcmUgbGlzdGVuZXJzIGZvciBldmVudHVhbCByZWNvbm5lY3RcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMucHVzaCh7XG4gICAgICAgICAgICBcInR5cGVcIjogdHlwZSxcbiAgICAgICAgICAgIFwiY2FsbGJhY2tcIjogY2FsbGJhY2ssXG4gICAgICAgICAgICBcImNhbGxiYWNrQ29udGV4dFwiOiBjYWxsYmFja0NvbnRleHQsXG4gICAgICAgICAgICBcImFyZ3NcIjogYXJnc1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNvdXJjZS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbChjYWxsYmFja0NvbnRleHQsIC4uLmFyZ3MsIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTU0U7IiwiY2xhc3MgVXRpbCB7XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgUmV0dXJuIGEgZm9ybWF0dGVkIGN1cnJlbmN5IHN0cmluZyBmcm9tIGFuIGludGVnZXJcbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2VDdXJyZW5jeShpbnQpIHtcbiAgICAgICAgbGV0IHZhbCA9IGludCAvIDEwMDtcbiAgICAgICAgcmV0dXJuIFwiJFwiICsgdmFsLnRvRml4ZWQoMik7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBVdGlsOyIsImNvbnN0IEFjdGlvbiA9IHtcbiAgICBCTElORDogMCxcbiAgICBGT0xEOiAxLFxuICAgIENIRUNLOiAyLFxuICAgIEJFVDogM1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQWN0aW9uOyIsIi8qKlxuICogQSBQaGFzZXIuQnV0dG9uIHdpdGggYSBQaGFzZXIuVGV4dCBjZW50ZXJlZCBvbiB0aGUgYnV0dG9uXG4gKlxuICogVGhpcyBjbGFzcyBpcyBtZXJlbHkgYSB0aGluIHdyYXBwZXIgYXJvdW5kIFBoYXNlci5CdXR0b24gdG8gYWxsb3cgZm9yXG4gKiBlYXN5IHVzZSBvZiBhIHRleHQgbGFiZWwgb24gdGhlIGJ1dHRvbi4gVGhlIHRleHQgaXMgYSBjaGlsZCBvZiB0aGUgYnV0dG9uLFxuICogc28gaXQgbW92ZXMgd2hlbiB0aGUgYnV0dG9uIG1vdmVzLiBJdCdzIGNlbnRlcmVkIG9uIHRoZSBidXR0b24gYW5kIHNjYWxlc1xuICogYXV0b21hdGljYWxseSB0byBmaXggd2l0aGluIHRoZSBidXR0b24ncyBib3VuZHMuXG4gKlxuICogSWYgbm9uZSBvZiB0aGUgbGFiZWwgZnVuY3Rpb25hbGl0eSBpcyB1c2VkLCB0aGlzIGNsYXNzIGlzIGlkZW50aWNhbCB0b1xuICogUGhhc2VyLkJ1dHRvbi5cbiAqL1xuY2xhc3MgQnV0dG9uIGV4dGVuZHMgUGhhc2VyLkJ1dHRvbiB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwga2V5LCBjYWxsYmFjaywgY2FsbGJhY2tjb250ZXh0LCBvdmVyRnJhbWUsIG91dEZyYW1lLCBkb3duRnJhbWUsIHVwRnJhbWUpIHtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwga2V5LCBjYWxsYmFjaywgY2FsbGJhY2tjb250ZXh0LCBvdmVyRnJhbWUsIG91dEZyYW1lLCBkb3duRnJhbWUsIHVwRnJhbWUpO1xuXG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubGFiZWxQYWRkaW5nID0gMTA7XG4gICAgICAgIHRoaXMubGFiZWxUZXh0ID0gXCJcIjtcbiAgICAgICAgdGhpcy5sYWJlbFN0eWxlID0ge307XG4gICAgICAgIHRoaXMubGFiZWwgPSBuZXcgUGhhc2VyLlRleHQodGhpcy5nYW1lLCAwLCAwLCB0aGlzLmxhYmVsVGV4dCk7XG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5sYWJlbCk7XG5cbiAgICAgICAgLy8gTXVzdCBhZGQgdG8gZ2FtZSB3b3JsZCBtYW51YWxseSBpZiBub3QgdXNpbmcgZ2FtZS5hZGQuYnV0dG9uXG4gICAgICAgIHRoaXMuZ2FtZS53b3JsZC5hZGQodGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSB0ZXh0IGRpc3BsYXllZCBvbiB0aGUgYnV0dG9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBkaXNwbGF5XG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFRleHQodGV4dCwgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsVGV4dCA9IHRleHQ7XG4gICAgICAgIHRoaXMudXBkYXRlTGFiZWwoZm9yY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgc3R5bGUgZm9yIHRoZSBidXR0b24gdGV4dFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZSAtIFRoZSB0ZXh0IHN0eWxlIHRvIHVzZVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSBkaXNwbGF5IHVwZGF0ZSBkZXNwaXRlIG9mIHRoaXMuZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRUZXh0U3R5bGUoc3R5bGUsIGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5sYWJlbFN0eWxlID0gc3R5bGU7XG4gICAgICAgIHRoaXMudXBkYXRlTGFiZWwoZm9yY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgcGFkZGluZyBiZXR3ZWVuIHRoZSB0ZXh0IGFuZCB0aGUgYnV0dG9uIHBlcmltZXRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwYWRkaW5nIC0gVGhlIHBhZGRpbmcgaW4gcGl4ZWxzXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFBhZGRpbmcocGFkZGluZywgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsUGFkZGluZyA9IHBhZGRpbmc7XG4gICAgICAgIHRoaXMudXBkYXRlTGFiZWwoZm9yY2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIHRoZSBidXR0b25cbiAgICAgKiBPbiBkaXNhYmxlLCBkaXNhYmxlcyBhbGwgaW5wdXQgdG8gdGhlIGJ1dHRvbiBhbmQgcmVuZGVycyBpdCBncmF5ZWRcbiAgICAgKiBvdXQuIEFsbCB1cGRhdGVzIGFyZSBkZWxheWVkIHVudGlsIHJlLWVuYWJsZSwgdW5sZXNzIGZvcmNlZC5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBFbmFibGUgb3IgZGlzYWJsZSBidXR0b24/XG4gICAgICovXG4gICAgc2V0RW5hYmxlZChlbmFibGVkKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgIHRoaXMuaW5wdXRFbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgbGV0IHRpbnQgPSBlbmFibGVkID8gMHhGRkZGRkYgOiAweDgwODA4MDtcbiAgICAgICAgdGhpcy50aW50ID0gdGludDtcbiAgICAgICAgdGhpcy5sYWJlbC50aW50ID0gdGludDtcblxuICAgICAgICAvLyBVcGRhdGUgb24gcmUtZW5hYmxlXG4gICAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBVcGRhdGUgYWxsIGJ1dHRvbiBhdHRyaWJ1dGVzIHRvIGN1cnJlbnQgcHJvcGVydGllc1xuICAgICAqXG4gICAgICogSWYgdGhlIGJ1dHRvbiBpcyBkaXNhYmxlZCwgdGhpcyB3aWxsIGhhdmUgbm8gZWZmZWN0LiBUaGVcbiAgICAgKiBkZXZlbG9wZXIgbWF5IG9wdGlvbmFsbHkgY2hvb3NlIHRvIGZvcmNlIHRoZSB1cGRhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgdGhlIHVwZGF0ZT9cbiAgICAgKi9cbiAgICB1cGRhdGVMYWJlbChmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWQgfHwgZm9yY2UpIHtcbiAgICAgICAgICAgIHRoaXMubGFiZWwudGV4dCA9IHRoaXMubGFiZWxUZXh0O1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5zZXRTdHlsZSh0aGlzLmxhYmVsU3R5bGUpO1xuICAgICAgICAgICAgdGhpcy5yZVBvc0xhYmVsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTY2FsZSBsYWJlbCB0ZXh0IHRvIGZpdCBvbiBidXR0b24gYW5kIGNlbnRlclxuICAgICAqL1xuICAgIHJlUG9zTGFiZWwoKSB7XG4gICAgICAgIHRoaXMubGFiZWwuc2NhbGUuc2V0VG8oMSk7XG4gICAgICAgIGxldCB0ZXh0QXJlYSA9IHRoaXMud2lkdGggLSB0aGlzLmxhYmVsUGFkZGluZyAqIDI7XG4gICAgICAgIGlmICh0aGlzLmxhYmVsLndpZHRoID4gdGV4dEFyZWEpIHtcbiAgICAgICAgICAgIGxldCByZWR1Y2VkU2NhbGUgPSB0ZXh0QXJlYSAvIHRoaXMubGFiZWwud2lkdGg7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnNjYWxlLnNldFRvKHJlZHVjZWRTY2FsZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYWJlbC5jZW50ZXJYID0gdGhpcy53aWR0aCAvIDI7XG4gICAgICAgIHRoaXMubGFiZWwuY2VudGVyWSA9IHRoaXMuaGVpZ2h0IC8gMjtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnV0dG9uOyIsImNsYXNzIENhcmQge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIG1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDsgICAvLyBTdHJpbmcgSUQgb2YgY2FyZCwgZS5nLiAnS2gnIG9yICc3cydcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBudWxsO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoZGF0YSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgXCJjYXJkc1wiKTtcbiAgICAgICAgdGhpcy5zcHJpdGUuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuc3ByaXRlLnNjYWxlLnNldFRvKDEuNSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUuZnJhbWVOYW1lID0gdGhpcy5uYW1lID8gdGhpcy5uYW1lIDogXCJiYWNrXCI7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXJkOyIsImNsYXNzIENvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHBsYXllcklkLCB0b2tlbikge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnBsYXllcklkID0gcGxheWVySWQ7XG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIGFjY2VzcyB0b2tlbiB1c2VkIHRvIGF1dGhlbnRpY2F0ZSBvbiBBUEkgY2FsbHNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUaGUgRmxhc2stSldULUV4dGVuZGVkIGFjY2VzcyB0b2tlblxuICAgICAqL1xuICAgIHNldFRva2VuKHRva2VuKSB7XG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgICpcbiAgICAgKiBPbmx5IGVycm9ycyBhcmUgcmVwb3J0ZWQuIFN1Y2Nlc3MgaXMgc2lsZW50LiBHYW1lIGNoYW5nZXMgcmVzdWx0aW5nXG4gICAgICogZnJvbSByZXF1ZXN0cyBhcmUgaGFuZGxlZCB2aWEgU2VydmVyIFNlbnQgRXZlbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVuZHBvaW50IC0gVGhlIGVuZHBvaW50IG9uIHRoZSBzZXJ2ZXIgdG8gc2VuZCByZXF1ZXN0IHRvXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgLSBUaGUgcGF5bG9hZCB0byBzZW5kXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFttZXRob2Q9XCJQT1NUXSAtIFRoZSBIVFRQIG1ldGhvZCB0byB1c2VcbiAgICAgKi9cbiAgICBzZW5kUmVxdWVzdChlbmRwb2ludCwgZGF0YSwgbWV0aG9kID0gXCJQT1NUXCIpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbihtZXRob2QsIGVuZHBvaW50KTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCAmJiB4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzcCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgLy8gSW52YWxpZCByZXF1ZXN0IGVycm9yXG4gICAgICAgICAgICAgICAgaWYgKHJlc3Auc3VjY2VzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKHJlc3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRmFpbGVkIHJlcXVlc3QgZXJyb3JcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyB0aGlzLnRva2VuKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYW4gYWN0aW9uIHJlcXVlc3RcbiAgICAgKlxuICAgICAqIFRoaXMgaXMgdGhlIG1vc3QgaGVhdmlseS11c2VkIHJlcXVlc3QgdHlwZSBpbiB0aGUgZ2FtZS4gQWxsIGluLWdhbWVcbiAgICAgKiBhY3Rpb25zIChiZXQsIGNoZWNrLCBmb2xkKSBoYXBwZW4gaGVyZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gVGhlIHBheWxvYWQgdG8gc2VuZFxuICAgICAqL1xuICAgIGFjdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJhY3Rpb25cIik7XG4gICAgICAgIHRoaXMuc2VuZFJlcXVlc3QodXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBjaGVjaygpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQ0hFQ0tcIik7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGJldChhbXQpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkVUXCIsIGFtdCk7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGZvbGQoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkZPTERcIik7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSBiZWFjb24gdG8gdGhlIHNlcnZlciBvbiBkaXNjb25uZWN0XG4gICAgICpcbiAgICAgKiBUaGlzIGFsbG93cyBmb3Igc2VydmVyIHRvIGtub3cgd2hlbiBhIGNsaWVudCBkaXNjb25uZWN0cyBzb1xuICAgICAqIGl0IGNhbiBjbGVhbiB1cCBhcyBuZWNlc3NhcnkuIE5vIGd1YXJhbnRlZSB0aGF0IHRoaXMgbWVzc2FnZVxuICAgICAqIHdpbGwgZ28gdGhyb3VnaCwgc28gbXVzdCBoYXZlIHJlZHVuZGFudCBtZWFzdXJlcyBpbiBwbGFjZS5cbiAgICAgKi9cbiAgICBkaXNjb25uZWN0QmVhY29uKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0IHVybCA9IFwiL2Rpc2Nvbm5lY3QvXCI7XG4gICAgICAgIG5hdmlnYXRvci5zZW5kQmVhY29uKHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgam9pbigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcInVzZXJJZFwiOiB0aGlzLmdhbWUuaW5pdGlhbERhdGEudXNlcklkfTtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImpvaW5cIik7XG4gICAgICAgIHRoaXMuc2VuZFJlcXVlc3QodXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBidWlsZFBheWxvYWQoYWN0aW9uVHlwZSwgYmV0QW10ID0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJwbGF5ZXJJZFwiOiB0aGlzLnBsYXllcklkLFxuICAgICAgICAgICAgXCJhY3Rpb25UeXBlXCI6IGFjdGlvblR5cGUsXG4gICAgICAgICAgICBcImJldEFtdFwiOiBiZXRBbXRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJ1aWxkVXJsKGVuZHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVVcmwgKyBlbmRwb2ludCArIFwiL1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlcjsiLCJpbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi9CdXR0b25cIjtcbmltcG9ydCBTbGlkZXIgZnJvbSBcIi4vU2xpZGVyXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuXG5jbGFzcyBQYW5lbCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJldHMgPSBbMF07XG4gICAgICAgIHRoaXMucHJpbWFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnByaW1hcnlBY3Rpb24gPSBBY3Rpb24uQkVUO1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IEFjdGlvbi5DSEVDSztcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnRlcnRpYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMudGVydGlhcnlBY3Rpb24gPSBBY3Rpb24uRk9MRDtcbiAgICAgICAgdGhpcy5zbGlkZXIgPSBuZXcgU2xpZGVyKHRoaXMuZ2FtZSwgXCJwYW5lbFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeSA9IHRoaXMubWFrZUJ1dHRvbigwLCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnByaW1hcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMucHJpbWFyeUFjdGlvbiwgdGhpcy5wcmltYXJ5QmV0KSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zZWNvbmRhcnkgPSB0aGlzLm1ha2VCdXR0b24oMTM1LCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnNlY29uZGFyeUNsaWNrZWQuZGlzcGF0Y2godGhpcy5zZWNvbmRhcnlBY3Rpb24sIHRoaXMuc2Vjb25kYXJ5QmV0KSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXJ0aWFyeSA9IHRoaXMubWFrZUJ1dHRvbigyNzAsIDAsIFwibWVkXCIsICgpID0+IHRoaXMudGVydGlhcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMudGVydGlhcnlBY3Rpb24sIDApKTtcblxuICAgICAgICB0aGlzLnNsaWRlci5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgICAgICB0aGlzLnNsaWRlci5pbmRleENoYW5nZWQuYWRkKChpbmRleCkgPT4gdGhpcy5zZXRQcmltYXJ5QmV0KHRoaXMuYmV0c1tpbmRleF0pLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2xpZGVyV2hlZWwuYWRkKHRoaXMuc2luZ2xlU3RlcEJldCwgdGhpcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zbGlkZXIgPSB0aGlzLnNsaWRlci5iYXI7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zbGlkZXIueSA9IDcwO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkucHJpbWFyeSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS50ZXJ0aWFyeSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuc2xpZGVyKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBtYWtlQnV0dG9uKHgsIHksIHNpemUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBidXR0b24gPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgeCwgeSwgdGhpcy5rZXkpO1xuICAgICAgICBidXR0b24ub25JbnB1dFVwLmFkZChjYWxsYmFjayk7XG4gICAgICAgIGJ1dHRvbi5zZXRGcmFtZXMoXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9vdmVyXCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9vdXRcIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX2Rvd25cIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX3VwXCJcbiAgICAgICAgKTtcbiAgICAgICAgYnV0dG9uLnNldFRleHRTdHlsZSh0aGlzLmdhbWUuY29uZmlnLnBhbmVsLnRleHRTdHlsZSk7XG4gICAgICAgIHJldHVybiBidXR0b247XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgbGV0IHByaW1hcnlUZXh0ID0gXCJCRVQgXCIgKyBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5wcmltYXJ5QmV0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuc2V0VGV4dChwcmltYXJ5VGV4dCk7XG5cbiAgICAgICAgbGV0IHNlY29uZGFyeVRleHQgPSBcIkNIRUNLXCI7XG4gICAgICAgIGlmICh0aGlzLnNlY29uZGFyeUFjdGlvbiAhPT0gQWN0aW9uLkNIRUNLKSB7XG4gICAgICAgICAgICBzZWNvbmRhcnlUZXh0ID0gXCJDQUxMIFwiICsgVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuc2Vjb25kYXJ5QmV0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5LnNldFRleHQoc2Vjb25kYXJ5VGV4dCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnRlcnRpYXJ5LnNldFRleHQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xuICAgIH1cblxuICAgIHNldEJldHMoYmV0cykge1xuICAgICAgICBpZiAoYmV0cy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBiZXRzLiBQYW5lbCBtdXN0IGFsd2F5cyBoYXZlIGF0IGxlYXN0IG9uZSB2YWxpZCBiZXQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iZXRzID0gYmV0cztcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0c1swXTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0TGVuZ3RoKGJldHMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoMCk7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldFByaW1hcnlCZXQoYmV0KSB7XG4gICAgICAgIHRoaXMucHJpbWFyeUJldCA9IGJldDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc2V0U2Vjb25kYXJ5QmV0KGJldCkge1xuICAgICAgICB0aGlzLnNlY29uZGFyeUJldCA9IGJldDtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlBY3Rpb24gPSBiZXQgPT09IDAgPyBBY3Rpb24uQ0hFQ0sgOiBBY3Rpb24uQkVUO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBIaWRlIG9yIHNob3cgdGhlIGVudGlyZSBwYW5lbFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmlzaWJsZVxuICAgICAqL1xuICAgIHNldFZpc2libGUodmlzaWJsZSkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBJbmNyZW1lbnQgb3IgZGVjcmVtZW50IHRoaXMucHJpbWFyeUJldFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLk1vdXNlLndoZWVsRGVsdGF9IG1vZGlmaWVyIC0gKzEgb3IgLTFcbiAgICAgKi9cbiAgICBzaW5nbGVTdGVwQmV0KG1vZGlmaWVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuc2xpZGVyLmluZGV4ICsgbW9kaWZpZXI7XG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDw9IHRoaXMuc2xpZGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYW5lbDsiLCJpbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuXG5jbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIG1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcblxuICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBudWxsO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBudWxsO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBudWxsO1xuICAgICAgICB0aGlzLnNlYXQgPSBudWxsO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gMDsgIC8vIFN1bSBiZXRzIGJ5IHBsYXllciBpbiBjdXJyZW50IGJldHRpbmcgcm91bmRcblxuICAgICAgICB0aGlzLmlzRGVhbGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNOZXh0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuXG4gICAgICAgIHRoaXMuY2FyZHMgPSBuZXcgQ2FyZE1hbmFnZXIodGhpcy5nYW1lKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKGRhdGEpIHtcbiAgICAgICAgdGhpcy5pZCA9IGRhdGEuaWQ7XG4gICAgICAgIHRoaXMudXNlcklkID0gZGF0YS51c2VySWQ7XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGRhdGEuYmFsYW5jZTtcbiAgICAgICAgdGhpcy5zaXR0aW5nT3V0ID0gZGF0YS5zaXR0aW5nT3V0O1xuICAgICAgICB0aGlzLnNlYXQgPSBkYXRhLnNlYXQ7XG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcbiAgICAgICAgdGhpcy5pc1VzZXIgPSBkYXRhLmlzVXNlcjtcblxuICAgICAgICB0aGlzLmNhcmRzLmluaXRpYWxpemUoMik7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kID0gdGhpcy5kaXNwbGF5R3JvdXAuY3JlYXRlKDAsIDAsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVJlY3QpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZSA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAtMjAsIFwiXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5uYW1lKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZSA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAyMCwgXCJcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmJhbGFuY2UpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcyA9IHRoaXMuY2FyZHMuZGlzcGxheUdyb3VwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMuY2VudGVyWCA9IDA7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcy5jZW50ZXJZID0gLTEyMDtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5jYXJkcyk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbiA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwiZGVhbGVyQnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmxlZnQgPSB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5sZWZ0ICsgNTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbi5ib3R0b20gPSB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5ib3R0b20gLSA1O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbik7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCBcInJlZENpcmNsZVwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IucmlnaHQgPSB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5yaWdodCAtIDU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yLmJvdHRvbSA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLmJvdHRvbSAtIDU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvcik7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUudGV4dCA9IHRoaXMubmFtZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UudGV4dCA9IFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLmJhbGFuY2UpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLnZpc2libGUgPSB0aGlzLmlzRGVhbGVyID09PSB0cnVlO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvci52aXNpYmxlID0gdGhpcy5pc05leHQgPT09IHRydWU7XG4gICAgfVxuXG4gICAgdXBkYXRlKGRhdGEpIHtcbiAgICAgICAgLy8gVE9ETyAtIEZsZXNoIG91dCB0aGUgcmVzdCBvZiB0aGUgZGF0YSAtLSBkbyBJIGxpa2UgdGhpcyBtZXRob2Q/XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGRhdGEuYmFsYW5jZSA9PT0gdW5kZWZpbmVkID8gdGhpcy5iYWxhbmNlIDogZGF0YS5iYWxhbmNlO1xuICAgICAgICB0aGlzLmlzRGVhbGVyID0gZGF0YS5pc0RlYWxlciA9PT0gdW5kZWZpbmVkID8gdGhpcy5pc0RlYWxlciA6IGRhdGEuaXNEZWFsZXI7XG4gICAgICAgIHRoaXMuaXNOZXh0ID0gZGF0YS5pc05leHQgPT09IHVuZGVmaW5lZCA/IHRoaXMuaXNOZXh0IDogZGF0YS5pc05leHQ7XG4gICAgICAgIHRoaXMucm91bmRCZXQgPSBkYXRhLnJvdW5kQmV0ID09PSB1bmRlZmluZWQgPyB0aGlzLnJvdW5kQmV0IDogZGF0YS5yb3VuZEJldDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcblxuY2xhc3MgUG90IHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuYW1vdW50ID0gMDtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBudWxsO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZSA9IHRoaXMubWFrZUJ0bigwLCAwLCBcIlwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVSZWN0LCAoKSA9PiB7fSk7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlLnRleHQudGV4dCA9IFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLmFtb3VudCk7XG4gICAgfVxuXG4gICAgc2V0QW1vdW50KGFtb3VudCkge1xuICAgICAgICB0aGlzLmFtb3VudCA9IGFtb3VudDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgbWFrZUJ0bih4LCB5LCB0ZXh0LCB0ZXh0dXJlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0ID0gdGhpcykge1xuICAgICAgICBsZXQgYnRuID0gdGhpcy5nYW1lLmFkZC5idXR0b24oeCwgeSwgdGV4dHVyZSwgY2FsbGJhY2ssIGNhbGxiYWNrQ29udGV4dCk7XG4gICAgICAgIGJ0bi5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICBsZXQgYnRuVGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAwLCB0ZXh0KTtcbiAgICAgICAgYnRuVGV4dC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgYnRuLmFkZENoaWxkKGJ0blRleHQpO1xuICAgICAgICBidG4udGV4dCA9IGJ0blRleHQ7XG5cbiAgICAgICAgcmV0dXJuIGJ0bjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBvdDsiLCIvKipcbiAqIEEgc2xpZGVyIFVJIGVsZW1lbnRcbiAqXG4gKiBSZXByZXNlbnRlZCBieSBhIGJhciBzcHJpdGUgYW5kIGEgbWFya2VyIHNwcml0ZS4gRGVzcGl0ZSBob3cgaXQgbWF5XG4gKiBsb29rLCBhbGwgaW5wdXQgb2NjdXJzIG9uIHRoZSBiYXIgYW5kIHVwZGF0ZXMgYXJlIG1hZGUgdG8gdGhlXG4gKiBtYXJrZXIncyBwb3NpdGlvbiBiYXNlZCBvbiB0aG9zZSBpbnB1dHMuXG4gKi9cbmNsYXNzIFNsaWRlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJhciA9IG51bGw7ICAvLyBUaGUgc2xpZGVyIGJhciBzcHJpdGVcbiAgICAgICAgdGhpcy5tYXJrZXIgPSBudWxsOyAgLy8gVGhlIGRyYWdnYWJsZSBtYXJrZXIgc3ByaXRlXG4gICAgICAgIHRoaXMuaW5kZXggPSAwOyAgLy8gQ3VycmVudCBpbmRleCBvZiBtYXJrZXJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAxOyAgLy8gVG90YWwgbnVtYmVyIG9mIGluZGljZXNcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuaW5kZXhDaGFuZ2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5zbGlkZXJXaGVlbCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuYmFyID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCB0aGlzLmtleSwgXCJzbGlkZXJfYmFyX2V4dGVuZGVkXCIpO1xuICAgICAgICB0aGlzLmJhci5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dERvd24uYWRkKHRoaXMuc3RhcnREcmFnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRVcC5hZGQodGhpcy5zdG9wRHJhZywgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4gdGhpcy5lbmFibGVTbGlkZXJXaGVlbCh0cnVlKSk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0T3V0LmFkZCgoKSA9PiB0aGlzLmVuYWJsZVNsaWRlcldoZWVsKGZhbHNlKSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYXIgPSB0aGlzLmJhcjtcblxuICAgICAgICB0aGlzLm1hcmtlciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDIyLCB0aGlzLmtleSwgXCJzbGlkZXJfbWFya2VyXCIpO1xuICAgICAgICB0aGlzLm1hcmtlci5hbmNob3Iuc2V0VG8oMC41LCAwKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1hcmtlciA9IHRoaXMubWFya2VyO1xuICAgICAgICB0aGlzLmJhci5hZGRDaGlsZCh0aGlzLm1hcmtlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIHNsaWRlciBkcmFnZ2luZyBhbmQgaW5pdGlhdGUgZmlyc3QgZHJhZyBldmVudFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlNwcml0ZX0gYmFyIC0gVGhlIGJhciBzcHJpdGUgdGhhdCB3YXMgY2xpY2tlZFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlBvaW50ZXJ9IHBvaW50ZXIgLSBUaGUgcG9pbnRlciB3aGljaCBpbml0aWF0ZWQgdGhlIGNsaWNrXG4gICAgICovXG4gICAgc3RhcnREcmFnKGJhciwgcG9pbnRlcikge1xuICAgICAgICAvLyBJbml0aWFsIGNhbGwgdG8gdXBkYXRlRHJhZyBhbGxvd3MgY2hhbmdpbmcgYmV0IHdpdGggY2xpY2sgb24gYmFyXG4gICAgICAgIHRoaXMudXBkYXRlRHJhZyhwb2ludGVyLCBwb2ludGVyLngsIHBvaW50ZXIueSk7XG4gICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5hZGRNb3ZlQ2FsbGJhY2sodGhpcy51cGRhdGVEcmFnLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBEaXNhYmxlIHNsaWRlciBkcmFnZ2luZ1xuICAgICAqL1xuICAgIHN0b3BEcmFnKCkge1xuICAgICAgICB0aGlzLmdhbWUuaW5wdXQuZGVsZXRlTW92ZUNhbGxiYWNrKHRoaXMudXBkYXRlRHJhZywgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgQ2FsY3VsYXRlIHNsaWRlciBpbmRleCBiYXNlZCBvbiBkcmFnIGlucHV0XG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBzbGlkaW5nIHBvaW50ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgb2YgcG9pbnRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZSBvZiBwb2ludGVyXG4gICAgICovXG4gICAgdXBkYXRlRHJhZyhwb2ludGVyLCB4LCB5KSB7XG4gICAgICAgIGxldCBsb2NhbFggPSB4IC0gdGhpcy5iYXIud29ybGQueDsgIC8vIENsaWNrIHBvcyBpbiByZWxhdGlvbiB0byBiYXJcblxuICAgICAgICAvLyBQcmV2ZW50IGRyYWdnaW5nIHBhc3QgYmFyIGJvdW5kc1xuICAgICAgICBpZiAobG9jYWxYIDwgMCkge1xuICAgICAgICAgICAgbG9jYWxYID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbFggPiB0aGlzLmJhci53aWR0aCkge1xuICAgICAgICAgICAgbG9jYWxYID0gdGhpcy5iYXIud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpbmRleCA9IE1hdGgucm91bmQobG9jYWxYIC8gdGhpcy5iYXIud2lkdGggKiB0aGlzLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuc2V0SW5kZXgoaW5kZXgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgaW5kZXggb2YgdGhlIHNsaWRlciBhbmQgcmVwb3J0IHRoZSBuZXcgdmFsdWVcbiAgICAgKlxuICAgICAqIE9wdGlvbmFsbHkgdXBkYXRlIHRoZSB2aXN1YWwgcG9zaXRpb24gb2YgdGhlIG1hcmtlciBvbiB0aGUgc2xpZGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gTmV3IGluZGV4IHRvIHNldCBvbiBzbGlkZXJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1cGRhdGVQb3M9dHJ1ZV0gLSBVcGRhdGUgdGhlIHBvc2l0aW9uIG9mIG1hcmtlcj9cbiAgICAgKi9cbiAgICBzZXRJbmRleChpbmRleCwgdXBkYXRlUG9zID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuaW5kZXhDaGFuZ2VkLmRpc3BhdGNoKGluZGV4KTtcblxuICAgICAgICBpZiAodXBkYXRlUG9zKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAvLyBXaGVuIG9ubHkgb25lIGJldCBhdmFpbGFibGUsIGl0J3MgYSBtYXggYmV0XG4gICAgICAgICAgICAgICAgdGhpcy5tYXJrZXIueCA9IHRoaXMuYmFyLndpZHRoO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGggLyB0aGlzLmxlbmd0aCAqIHRoaXMuaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBVcGRhdGUgdGhlIGxlbmd0aCBwcm9wZXJ0eVxuICAgICAqXG4gICAgICogVGhlIGxlbmd0aCBwcm9wZXJ0eSBkZXNjcmliZXMgaG93IG1hbnkgZGlzY3JldGUgYmV0cyB0aGUgc2xpZGVyIGJhclxuICAgICAqIG11c3QgcmVwcmVzZW50LiBUaGUgc2xpZGVyIGRvZXMgbm90IGNhcmUgYWJvdXQgd2hhdCB0aGUgc3BlY2lmaWMgYmV0XG4gICAgICogaXQgcmVwcmVzZW50cyBpcywgb25seSB0aGF0IGl0IGhhcyBzb21lIG51bWJlciBvZiBpbmRpY2VzIGFsb25nIGl0c1xuICAgICAqIGxlbmd0aCBhbmQgdGhhdCBpdCBtdXN0IHJlcG9ydCBpdHMgaW5kZXggdG8gbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBuZXcgbGVuZ3RoIHRvIHNldFxuICAgICAqL1xuICAgIHNldExlbmd0aChsZW5ndGgpIHtcbiAgICAgICAgaWYgKGxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IHNldCBzbGlkZXIgbGVuZ3RoIGxlc3MgdGhhbiAxXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGxlbmd0aCA+IHRoaXMuYmFyLndpZHRoKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBTZXR0aW5nIHNsaWRlciBzdG9wcyBncmVhdGVyIHRoYW4gbGVuZ3RoIG1heSByZXN1bHQgaW4gdW5leHBlY3RlZCBiZWhhdmlvclwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSB0aGUgc2xpZGVyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gSXMgdGhlIHNsaWRlciBlbmFibGVkP1xuICAgICAqL1xuICAgIHNldEVuYWJsZWQoZW5hYmxlZCkge1xuICAgICAgICB0aGlzLmJhci5pbnB1dEVuYWJsZWQgPSBlbmFibGVkO1xuXG4gICAgICAgIGxldCB0aW50ID0gZW5hYmxlZCA/IDB4RkZGRkZGIDogMHg4MDgwODA7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYXIudGludCA9IHRpbnQ7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tYXJrZXIudGludCA9IHRpbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgZGlzcGF0Y2ggb2Ygc2lnbmFsIG9uIHdoZWVsIHNjcm9sbFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIElzIHRoZSBjYWxsYmFjayBlbmFibGVkIG9yIGRpc2FibGVkP1xuICAgICAqL1xuICAgIGVuYWJsZVNsaWRlcldoZWVsKGVuYWJsZWQpIHtcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS5tb3VzZVdoZWVsQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJXaGVlbC5kaXNwYXRjaCh0aGlzLmdhbWUuaW5wdXQubW91c2Uud2hlZWxEZWx0YSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmlucHV0Lm1vdXNlLm1vdXNlV2hlZWxDYWxsYmFjayA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNsaWRlcjsiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwicGFuZWxcIjoge1xuICAgIFwicGFkZGluZ1wiOiAxMCxcbiAgICBcInRleHRTdHlsZVwiOiB7XG4gICAgICBcImZvbnRcIjogXCJib2xkIDIycHQgQXJpYWxcIixcbiAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCJcbiAgICB9LFxuICAgIFwicG9zXCI6IHtcbiAgICAgIFwieFwiOiAxNDgwLFxuICAgICAgXCJ5XCI6IDc5MFxuICAgIH1cbiAgfVxufSIsImltcG9ydCBDYXJkIGZyb20gXCIuLi9jbGFzc2VzL0NhcmRcIjtcblxuY2xhc3MgQ2FyZE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5jYXJkcyA9IFtdO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKG51bV9jYXJkcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9jYXJkczsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2FyZCA9IG5ldyBDYXJkKHRoaXMuZ2FtZSwgdGhpcyk7XG4gICAgICAgICAgICBjYXJkLmluaXRpYWxpemUoe30pO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNhcmRzLnB1c2goY2FyZCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQoY2FyZC5zcHJpdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWxpZ24oLTEsIDEsIHRoaXMuY2FyZHNbMF0uc3ByaXRlLndpZHRoICogMS4yLCAwKTtcbiAgICB9XG5cbiAgICBzZXRDYXJkTmFtZXMobmFtZXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS5uYW1lID0gbmFtZXNbaV07XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZE1hbmFnZXI7IiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vY2xhc3Nlcy9QbGF5ZXJcIjtcblxuY2xhc3MgUGxheWVyTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdOyAgLy8gRGlyZWN0IGFjY2VzcyB0byB0aGUgUGxheWVyIG9iamVjdHNcbiAgICAgICAgdGhpcy51c2VyUGxheWVyID0gbnVsbDsgIC8vIFRoZSB1c2VyJ3MgcGxheWVyIG9iamVjdCwgaWYgYXZhaWxhYmxlXG5cbiAgICAgICAgLy8gQ29udGFpbnMgYWxsIGRpc3BsYXkgZWxlbWVudHMgZm9yIGFsbCBwbGF5ZXJzIGluIHRoZSBnYW1lXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUocGxheWVyRGF0YSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllckRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMuZ2FtZSwgdGhpcyk7XG4gICAgICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZShwbGF5ZXJEYXRhW2ldKTtcbiAgICAgICAgICAgIHBsYXllci5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgICAgICB0aGlzLnBsYXllcnMucHVzaChwbGF5ZXIpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHBsYXllci5kaXNwbGF5R3JvdXApO1xuXG4gICAgICAgICAgICBpZiAocGxheWVyRGF0YVtpXS5pc1VzZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJQbGF5ZXIgPSBwbGF5ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWxpZ24oLTEsIDEsIHRoaXMucGxheWVyc1swXS5kaXNwbGF5R3JvdXAud2lkdGggKiAxLjIsIDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QnlJZChpZCkge1xuICAgICAgICAvLyBUT0RPIC0gRG8gdGhpcyB3aXRob3V0IGl0ZXJhdGluZyAtLSBidWlsZCBtYXAgb24gaW5pdD9cbiAgICAgICAgLy8gVE9ETyAtIFNob3VsZCB0aGlzIGV2ZXIgcmV0dXJuIG51bGw/XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXJNYW5hZ2VyOyIsImNvbnN0IGlzU3RyaW5nID0gdmFsID0+IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xuY29uc3QgaXNCbG9iID0gdmFsID0+IHZhbCBpbnN0YW5jZW9mIEJsb2I7XG5cbnBvbHlmaWxsLmNhbGwodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgPyB3aW5kb3cgOiB0aGlzIHx8IHt9KTtcblxuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gIGlmIChpc1N1cHBvcnRlZC5jYWxsKHRoaXMpKSByZXR1cm47XG5cbiAgaWYgKCEoJ25hdmlnYXRvcicgaW4gdGhpcykpIHRoaXMubmF2aWdhdG9yID0ge307XG4gIHRoaXMubmF2aWdhdG9yLnNlbmRCZWFjb24gPSBzZW5kQmVhY29uLmJpbmQodGhpcyk7XG59O1xuXG5mdW5jdGlvbiBzZW5kQmVhY29uKHVybCwgZGF0YSkge1xuICBjb25zdCBldmVudCA9IHRoaXMuZXZlbnQgJiYgdGhpcy5ldmVudC50eXBlO1xuICBjb25zdCBzeW5jID0gZXZlbnQgPT09ICd1bmxvYWQnIHx8IGV2ZW50ID09PSAnYmVmb3JldW5sb2FkJztcblxuICBjb25zdCB4aHIgPSAoJ1hNTEh0dHBSZXF1ZXN0JyBpbiB0aGlzKSA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7XG4gIHhoci5vcGVuKCdQT1NUJywgdXJsLCAhc3luYyk7XG4gIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJyovKicpO1xuXG5cbiAgaWYgKGlzU3RyaW5nKGRhdGEpKSB7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKTtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gJ3RleHQvcGxhaW4nO1xuICB9IGVsc2UgaWYgKGlzQmxvYihkYXRhKSAmJiBkYXRhLnR5cGUpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgZGF0YS50eXBlKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgeGhyLnNlbmQoZGF0YSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xuICByZXR1cm4gKCduYXZpZ2F0b3InIGluIHRoaXMpICYmICgnc2VuZEJlYWNvbicgaW4gdGhpcy5uYXZpZ2F0b3IpO1xufSIsImltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSBcIi4uL2NsYXNzZXMvQ29udHJvbGxlclwiO1xuXG5jbGFzcyBCb290IGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmdhbWUuaW5pdGlhbERhdGEgPSBpbml0aWFsRGF0YTtcbiAgICAgICAgdGhpcy5nYW1lLmNvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICAvLyBUT0RPIC0gVGhpcyBzaG91bGQgY29tZSBmcm9tIHNvbWV3aGVyZSBkeW5hbWljXG4gICAgICAgIHRoaXMuZ2FtZS5ydWxlcyA9IHtcbiAgICAgICAgICAgIGJsaW5kczoge1xuICAgICAgICAgICAgICAgIHNtYWxsOiAyNSxcbiAgICAgICAgICAgICAgICBiaWc6IDUwXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnblZlcnRpY2FsbHkgPSB0cnVlO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyID0gbmV3IENvbnRyb2xsZXIodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEucGxheWVySWQsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50b2tlbik7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoXCJsb2FkXCIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQm9vdDsiLCJjbGFzcyBMb2FkIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBwcmVsb2FkKCkge1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcImJhY2tncm91bmRcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9iYWNrZ3JvdW5kLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJkZWFsZXJCdXR0b25cIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9kZWFsZXJidXR0b24ucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcInJlZENpcmNsZVwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3JlZGNpcmNsZS5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJjYXJkc1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NhcmRzLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NhcmRzLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJwYW5lbFwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3BhbmVsLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3BhbmVsLmpzb25cIik7XG5cbiAgICAgICAgdGhpcy5nYW1lLnRleHR1cmVzID0gdGhpcy5jcmVhdGVDdXN0b21UZXh0dXJlcygpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibWFpblwiKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDdXN0b21UZXh0dXJlcygpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0ge307XG5cbiAgICAgICAgbGV0IGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoNCwgMHgwMDAwMDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgxMDAsIDEwMCwgMTAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlU3F1YXJlXCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgMzAwLCAxMDApO1xuXG4gICAgICAgIHRleHR1cmVzW1wid2hpdGVSZWN0XCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG5cbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0dXJlcztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYWQ7IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vY2xhc3Nlcy9BY3Rpb24uanNcIjtcbmltcG9ydCBDYXJkTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2FyZE1hbmFnZXJcIjtcbmltcG9ydCBQYW5lbCBmcm9tIFwiLi4vY2xhc3Nlcy9QYW5lbFwiO1xuaW1wb3J0IFBsYXllck1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL1BsYXllck1hbmFnZXJcIjtcbmltcG9ydCBQb3QgZnJvbSBcIi4uL2NsYXNzZXMvUG90XCI7XG5pbXBvcnQgUG9rZXIgZnJvbSBcIi4uL1Bva2VyXCI7XG5pbXBvcnQgU1NFIGZyb20gXCIuLi9TU0VcIjtcblxuY2xhc3MgTWFpbiBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlU1NFVXJsKTtcbiAgICAgICAgdGhpcy51c2VyX3NzZSA9IG5ldyBTU0UodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudXNlclNTRVVybCk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmxvYWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuZGlzY29ubmVjdEJlYWNvbigpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSB0aGlzLmdhbWUuYWRkLmltYWdlKDAsIDAsIFwiYmFja2dyb3VuZFwiKTtcbiAgICAgICAgdGhpcy5kZWFsQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMTAwLCBcImRlYWxcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmRlYWwpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzID0gbmV3IFBsYXllck1hbmFnZXIodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuaW5pdGlhbGl6ZSh0aGlzLmdhbWUuaW5pdGlhbERhdGEucGxheWVycyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmRpc3BsYXlHcm91cC5jZW50ZXJYID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclg7XG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmRpc3BsYXlHcm91cC5jZW50ZXJZID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclggLyA2O1xuXG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZCA9IG5ldyBDYXJkTWFuYWdlcih0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuaW5pdGlhbGl6ZSg1KTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5jZW50ZXJYID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclg7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wb3QgPSBuZXcgUG90KHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wb3QuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5zcHJpdGUuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYO1xuICAgICAgICB0aGlzLmdhbWUucG90LnNwcml0ZS5jZW50ZXJZID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclkgLSAxNDA7XG5cbiAgICAgICAgLy8gVE9ETyAtIFRoZXNlIHNob3VsZCBnbyBzb21ld2hlcmUgZWxzZS4gTWF5YmUgaW4gUG90P1xuICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsID0gbmV3IFBhbmVsKHRoaXMuZ2FtZSwgXCJwYW5lbFwiKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmRpc3BsYXlHcm91cC54ID0gdGhpcy5nYW1lLmNvbmZpZy5wYW5lbC5wb3MueDtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmRpc3BsYXlHcm91cC55ID0gdGhpcy5nYW1lLmNvbmZpZy5wYW5lbC5wb3MueTtcbiAgICAgICAgdGhpcy5yZWdpc3Rlckxpc3RlbmVycygpO1xuXG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwibmV3SGFuZFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld0hhbmQ6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gMDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wb3Quc2V0QW1vdW50KDApO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV07XG4gICAgICAgICAgICAgICAgcGxheWVyLmNhcmRzLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGlzRGVhbGVyOiBwbGF5ZXIuaWQgPT09IGRhdGEuZGVhbGVyLFxuICAgICAgICAgICAgICAgICAgICBpc05leHQ6IHBsYXllci5pZCA9PT0gZGF0YS5uZXh0LFxuICAgICAgICAgICAgICAgICAgICByb3VuZEJldDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVE9ETyAtIHVzZXJQbGF5ZXIuaWQgd2lsbCBmYWlsIGZvciB3YXRjaGVyc1xuICAgICAgICAgICAgbGV0IHVzZXJQbGF5ZXJOZXh0ID0gZGF0YS5uZXh0ID09PSB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyLmlkO1xuICAgICAgICAgICAgaWYgKHVzZXJQbGF5ZXJOZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlCZXQoMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0VmlzaWJsZSh1c2VyUGxheWVyTmV4dCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1JvdW5kXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3Um91bmQ6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzW2ldLnVwZGF0ZSh7cm91bmRCZXQ6IDB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRCZXRzKFBva2VyLmdlbmVyYXRlUmFpc2VzKHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuc21hbGwsIHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuYmlnLCB0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlCZXQoMCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImFjdGlvblwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImFjdGlvbjogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJvYXJkLnNldENhcmROYW1lcyhkYXRhLmJvYXJkKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5wbGF5ZXJJZCkudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBiYWxhbmNlOiBkYXRhLnBsYXllckJhbGFuY2UsXG4gICAgICAgICAgICAgICAgaXNOZXh0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICByb3VuZEJldDogZGF0YS5wbGF5ZXJSb3VuZEJldFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCkudXBkYXRlKHtpc05leHQ6IHRydWV9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wb3Quc2V0QW1vdW50KGRhdGEucG90KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IGRhdGEucm91bmRCZXQ7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IGRhdGEucm91bmRSYWlzZTtcblxuICAgICAgICAgICAgbGV0IHVzZXJQbGF5ZXJOZXh0ID0gZGF0YS5uZXh0ID09PSB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyLmlkO1xuICAgICAgICAgICAgaWYgKHVzZXJQbGF5ZXJOZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlCZXQoUG9rZXIuZ2V0TWluQmV0KHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0VmlzaWJsZSh1c2VyUGxheWVyTmV4dCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImhhbmRDb21wbGV0ZVwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhhbmRDb21wbGV0ZTogXCIsIGRhdGEpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLndpbm5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgd2lubmVyID0gZGF0YS53aW5uZXJzW2ldO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQod2lubmVyLmlkKS51cGRhdGUoe2JhbGFuY2U6IHdpbm5lci5iYWxhbmNlfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1BsYXllclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3UGxheWVyOiBcIiwgZGF0YSk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHRoaXMudXNlcl9zc2UuYWRkTGlzdGVuZXIoXCJuZXdIYW5kXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdIYW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXS5pZCA9PT0gdGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV0uY2FyZHMuc2V0Q2FyZE5hbWVzKGRhdGEuaG9sZGluZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMudXNlcl9zc2UuYWRkTGlzdGVuZXIoXCJuZXdQbGF5ZXJcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1BsYXllcjogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuc2V0VG9rZW4oZGF0YS50b2tlbik7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwucHJpbWFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNlY29uZGFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnRlcnRpYXJ5Q2xpY2tlZC5hZGQodGhpcy5oYW5kbGVBY3Rpb24sIHRoaXMpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgUm91dGUgYWN0aW9ucyB0byBjb250cm9sbGVyIHJlcXVlc3RzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFjdGlvbiAtIFRoZSBhY3Rpb24gdG8gYmUgcmVxdWVzdGVkLCBkZWZpbmVkIGluIEFjdGlvbi5qc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiZXQgLSBUaGUgYmV0IChpZiBhbnkpIHRvIGJlIHNlbnQgdG8gdGhlIGNvbnRyb2xsZXJcbiAgICAgKi9cbiAgICBoYW5kbGVBY3Rpb24oYWN0aW9uLCBiZXQpIHtcbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uLkZPTEQ6XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuZm9sZCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uQ0hFQ0s6XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuY2hlY2soKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uLkJFVDpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5iZXQoYmV0KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiSW52YWxpZCBBY3Rpb24gVHlwZTogXCIgKyBhY3Rpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuXG4gICAgfVxuXG4gICAgbWFrZUJ0bih4LCB5LCB0ZXh0LCB0ZXh0dXJlLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYnRuID0gdGhpcy5nYW1lLmFkZC5idXR0b24oeCwgeSwgdGV4dHVyZSwgY2FsbGJhY2ssIHRoaXMpO1xuICAgICAgICBidG4uYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgbGV0IGJ0blRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMCwgdGV4dCk7XG4gICAgICAgIGJ0blRleHQuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIGJ0bi5hZGRDaGlsZChidG5UZXh0KTtcbiAgICAgICAgYnRuLnRleHQgPSBidG5UZXh0O1xuXG4gICAgICAgIHJldHVybiBidG47XG4gICAgfVxuXG4gICAgZGVhbCgpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignUE9TVCcsICcvdGFibGVzLycgKyB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVOYW1lICsgJy9kZWFsLycpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdGFibGVOYW1lOiBpbml0aWFsRGF0YS50YWJsZU5hbWUsXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZUJldHMocGxheWVyUm91bmRCZXQsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIFBva2VyLmdlbmVyYXRlQmV0cygyNSwgNTAsIHRoaXMuZ2FtZS5yb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1haW47Il19
