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

},{"./states/Boot":18,"./states/Load":19,"./states/Main":20}],2:[function(require,module,exports){
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
        value: function join(seatNum) {
            var data = { "position": seatNum };
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

},{"../Util":4,"../managers/CardManager":15}],11:[function(require,module,exports){
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
  }
}
},{}],14:[function(require,module,exports){
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
        this.seats = {};
        this.displayGroup = this.game.add.group();
        this.buyInRequested = new Phaser.Signal();
        this.groupVisible = true;
    }

    _createClass(BuyInManager, [{
        key: "initialize",
        value: function initialize(seatConfig, occupiedSeats) {
            for (var i = 0; i < seatConfig.length; i++) {
                var button = new _Button2.default(this.game, seatConfig[i].x, seatConfig[i].y, this.key, this.buttonClicked, this);
                button.seatNum = i; // Store for use on click
                button.setFrames("btn_buyin_over", "btn_buyin_out", "btn_buyin_down", "btn_buyin_up");
                button.setText("Buy In");
                this.seats[i] = {
                    "button": button,
                    "occupied": occupiedSeats.indexOf(i) !== -1
                };
                this.displayGroup.add(button);
            }
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
            this.displayGroup.visible = this.groupVisible;
        }
    }, {
        key: "buttonClicked",
        value: function buttonClicked(button) {
            this.buyInRequested.dispatch(button.seatNum);
        }
    }]);

    return BuyInManager;
}();

exports.default = BuyInManager;

},{"../classes/Button":6}],15:[function(require,module,exports){
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

},{"../classes/Card":7}],16:[function(require,module,exports){
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
    function PlayerManager(game, userId, seatConfig) {
        _classCallCheck(this, PlayerManager);

        this.game = game;
        this.userId = userId;
        this.seatConfig = seatConfig;

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
            var player = new _Player2.default(this.game, this);
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

},{"../classes/Player":10}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{"../classes/Controller":8,"../config":13}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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
            this.game.players = new _PlayerManager2.default(this.game, this.game.initialData.userId, this.game.config.seats[numSeats]);
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
            this.game.buyIn.initialize(this.game.config.seats[numSeats], this.game.players.getOccupiedSeats());

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
            }, this);
            this.table_sse.addListener("playerLeft", function (event) {
                var data = JSON.parse(event.data);
                console.log("playerLeft: ", data);
                _this3.game.players.playerLeft(data);
                _this3.game.buyIn.playerLeft(data);
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

},{"../Poker":2,"../SSE":3,"../classes/Action.js":5,"../classes/Panel":9,"../classes/Pot":11,"../managers/BuyInManager":14,"../managers/CardManager":15,"../managers/PlayerManager":16}]},{},[1,17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NvbnRyb2xsZXIuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGFuZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGxheWVyLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BvdC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9TbGlkZXIuanMiLCJzdGF0aWMvc3JjL2NvbmZpZy5qc29uIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9CdXlJbk1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL0NhcmRNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9QbGF5ZXJNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9wb2x5ZmlsbHMvc2VuZGJlYWNvbi5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL0Jvb3QuanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Mb2FkLmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTSxJOzs7QUFDRixvQkFBYztBQUFBOztBQUFBLGdIQUNKO0FBQ0YsbUJBQU8sSUFETDtBQUVGLG9CQUFRO0FBRk4sU0FESTs7QUFNVixjQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBZixFQUF1QixjQUF2QixFQUE2QixLQUE3QjtBQUNBLGNBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLGNBQXZCLEVB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QUNBLGdCQUFJLElBQUosQ0FBUyxLQUFLLFNBQUwsQ0FBZTtBQUNwQiwyQkFBVyxZQUFZO0FBREgsYUFBZixDQUFUO0FBR0g7OztxQ0FFWTtBQUNULGlCQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLEtBQXJCO0FBQ0g7Ozs2QkFFSTtBQUNELGlCQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLEVBQXJCO0FBQ0g7Ozs2QkFFSTtBQUNELGlCQUFLLElBQUwsQ0FBVSxVQUFWLENBQXFCLEVBQXJCO0FBQ0g7OztxQ0FFWSxjLEVBQWdCLGEsRUFBZTtBQUN4QyxtQkFBTyxnQkFBTSxZQUFOLENBQW1CLEVBQW5CLEVBQXVCLEVBQXZCLEVBQTJCLEtBQUssSUFBTCxDQUFVLFFBQXJDLEVBQStDLGNBQS9DLEVBQStELEtBQUssSUFBTCxDQUFVLFVBQXpFLEVBQXFGLGFBQXJGLENBQVA7QUFDSDs7OztFQTVOYyxPQUFPLEs7O2tCQStOWCxJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEJvb3QgZnJvbSBcIi4vc3RhdGVzL0Jvb3RcIjtcbmltcG9ydCBMb2FkIGZyb20gXCIuL3N0YXRlcy9Mb2FkXCI7XG5pbXBvcnQgTWFpbiBmcm9tIFwiLi9zdGF0ZXMvTWFpblwiO1xuXG5jbGFzcyBHYW1lIGV4dGVuZHMgUGhhc2VyLkdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICB3aWR0aDogMTkyMCxcbiAgICAgICAgICAgIGhlaWdodDogMTA4MFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImJvb3RcIiwgQm9vdCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImxvYWRcIiwgTG9hZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcIm1haW5cIiwgTWFpbiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJib290XCIpO1xuICAgIH1cbn1cblxubmV3IEdhbWUoKTsiLCIvKipcbiAqIEBzdW1tYXJ5IEEgdXRpbGl0eSBjbGFzcyBvZiBQb2tlci1zcGVjaWZpYyBmdW5jdGlvbmFsaXR5XG4gKi9cbmNsYXNzIFBva2VyIHtcbiAgICAvLyBUT0RPIC0gVGhpcyB1dGlsaXR5IGlzIGhpZ2hseS1zcGVjaWZpYyB0byBOTCBnYW1lcywgbWF5YmUgZXZlbiB0byBOTEhFLlxuICAgIC8vICBOZWVkIHRvIG1ha2UgaXQgbW9yZSBnZW5lcmljIGV2ZW50dWFsbHkgdG8gYWxsb3cgZm9yIG90aGVyIGdhbWVcbiAgICAvLyAgdHlwZXMuIExpbWl0IGFuZCBwb3QtbGltaXQgZ2FtZXMgd2lsbCB3b3JrIGNvbXBsZXRlbHkgZGlmZmVyZW50bHkuXG4gICAgLy8gIEFudGVzIGFyZSBhbHNvIG5vdCBzdXBwb3J0ZWQuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBHZW5lcmF0ZSBhbGwgbGVnYWwgcmFpc2VzIGZvciBwbGF5ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc21hbGxCbGluZCAtIFRoZSBzbWFsbCBibGluZCBmb3IgdGhlIGdhbWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmlnQmxpbmQgLSBUaGUgYmlnIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3VuZEJldCAtIFRoZSBsZWFkaW5nIGJldCBmb3IgdGhpcyBiZXR0aW5nIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllclJvdW5kQmV0IC0gVGhlIGFtb3VudCB0aGlzIHBsYXllciBoYXMgY29udHJpYnV0ZWQgdG8gdGhlIHBvdCBzbyBmYXIgdGhpcyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmV2UmFpc2UgLSBUaGUgYW1vdW50IHRoZSBwcmV2aW91cyByYWlzZSBpbmNyZWFzZWQgdGhlIGJldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJCYWxhbmNlIC0gVGhlIGFtb3VudCB0aGUgcGxheWVyIGhhcyBhdmFpbGFibGUgdG8gYmV0XG4gICAgICogQHJldHVybnMge251bWJlcltdfSAtIFRoZSB2YWxpZCByYWlzZXNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2VuZXJhdGVSYWlzZXMoc21hbGxCbGluZCwgYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCByYWlzZSA9IFBva2VyLmdldE1pblJhaXNlKGJpZ0JsaW5kLCByb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHByZXZSYWlzZSwgcGxheWVyQmFsYW5jZSk7XG4gICAgICAgIGxldCByYWlzZXMgPSBbcmFpc2VdO1xuXG4gICAgICAgIHdoaWxlIChyYWlzZSArIHNtYWxsQmxpbmQgPD0gcGxheWVyQmFsYW5jZSkge1xuICAgICAgICAgICAgcmFpc2UgKz0gc21hbGxCbGluZDtcbiAgICAgICAgICAgIHJhaXNlcy5wdXNoKHJhaXNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyYWlzZSA8IHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgICAgIHJhaXNlcy5wdXNoKHBsYXllckJhbGFuY2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJhaXNlcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBHZXQgdGhlIG1pbmltdW0gYWxsb3dhYmxlIGJldCBmb3IgcGxheWVyXG4gICAgICpcbiAgICAgKiBJZiBubyBiZXRzIGhhdmUgb2NjdXJyZWQgaW4gY3VycmVudCByb3VuZCwgdGhlIG1pbiBiZXQgaXMgYVxuICAgICAqIGNoZWNrIChiZXQgb2YgMCksIG90aGVyd2lzZSBpdCdzIGEgY2FsbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3VuZEJldCAtIFRoZSBsZWFkaW5nIGJldCBmb3IgdGhpcyBiZXR0aW5nIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllclJvdW5kQmV0IC0gVGhlIGFtb3VudCB0aGlzIHBsYXllciBoYXMgY29udHJpYnV0ZWQgdG8gdGhlIHBvdCBzbyBmYXIgdGhpcyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJCYWxhbmNlIC0gVGhlIGFtb3VudCB0aGUgcGxheWVyIGhhcyBhdmFpbGFibGUgdG8gYmV0XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0TWluQmV0KHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICBsZXQgbWluQmV0ID0gcm91bmRCZXQgPT09IDAgPyAwIDogcm91bmRCZXQgLSBwbGF5ZXJSb3VuZEJldDtcbiAgICAgICAgaWYgKHBsYXllckJhbGFuY2UgPCBtaW5CZXQpIHtcbiAgICAgICAgICAgIG1pbkJldCA9IHBsYXllckJhbGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pbkJldDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBHZXQgdGhlIG1pbmltdW0gYWxsb3dhYmxlIHJhaXNlIGZvciBwbGF5ZXJcbiAgICAgKlxuICAgICAqIE5PVEU6IEEgcmFpc2UgaGVyZSBtYXkgYWN0dWFsbHkgbWVhbiBhIGJldCBpbiBwb2tlciB0ZXJtcy4gSW4gdGhlXG4gICAgICogcGFybGFuY2Ugb2YgdGhpcyB1dGlsaXR5LCBhIHJhaXNlIGlzIGFuIGFnZ3Jlc3NpdmUgYWN0aW9uLCBvciBzb21ldGhpbmdcbiAgICAgKiB3aGljaCB3b3VsZCBmb3JjZSBvdGhlciBwbGF5ZXJzIHRvIGNvbnRyaWJ1dGUgbW9yZSB0byB0aGUgcG90IHRoYW5cbiAgICAgKiB0aGUgb3RoZXJ3aXNlIHdvdWxkIGhhdmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmlnQmxpbmQgLSBUaGUgYmlnIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3VuZEJldCAtIFRoZSBsZWFkaW5nIGJldCBmb3IgdGhpcyBiZXR0aW5nIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllclJvdW5kQmV0IC0gVGhlIGFtb3VudCB0aGlzIHBsYXllciBoYXMgY29udHJpYnV0ZWQgdG8gdGhlIHBvdCBzbyBmYXIgdGhpcyByb3VuZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmV2UmFpc2UgLSBUaGUgYW1vdW50IHRoZSBwcmV2aW91cyByYWlzZSBpbmNyZWFzZWQgdGhlIGJldFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwbGF5ZXJCYWxhbmNlIC0gVGhlIGFtb3VudCB0aGUgcGxheWVyIGhhcyBhdmFpbGFibGUgdG8gYmV0XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0TWluUmFpc2UoYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCBtaW5SYWlzZSA9IHJvdW5kQmV0ID09PSAwID8gYmlnQmxpbmQgOiByb3VuZEJldCAtIHBsYXllclJvdW5kQmV0ICsgcHJldlJhaXNlO1xuICAgICAgICBpZiAocGxheWVyQmFsYW5jZSA8IG1pblJhaXNlKSB7XG4gICAgICAgICAgICBtaW5SYWlzZSA9IHBsYXllckJhbGFuY2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1pblJhaXNlO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9rZXI7IiwiY2xhc3MgU1NFIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB1cmwpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIHRoaXMuc291cmNlID0gbmV3IEV2ZW50U291cmNlKHRoaXMudXJsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZSBhZGRzIGFsbCBsaXN0ZW5lcnMgdG8gdGhpcy5zb3VyY2VcbiAgICAgKlxuICAgICAqIEkgb3JpZ2luYWxseSB3cm90ZSB0aGlzIHRvIHN1cHBvcnQgY2xpZW50IHJlY29ubmVjdHMsIGJ1dCBJIGRvbid0IG5lZWRcbiAgICAgKiB0aGF0IGFueW1vcmUuIEtlZXBpbmcgdGhlIGxpc3RlbmVyIGNvZGUganVzdCBpbiBjYXNlLlxuICAgICAqL1xuICAgIHJlQWRkQWxsTGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnM7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICB0aGlzLmFkZExpc3RlbmVyKGxpc3RlbmVyLnR5cGUsIGxpc3RlbmVyLmNhbGxiYWNrLCBsaXN0ZW5lci5jYWxsYmFja0NvbnRleHQsIC4uLmxpc3RlbmVyLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncykge1xuICAgICAgICAvLyBTdG9yZSBsaXN0ZW5lcnMgZm9yIGV2ZW50dWFsIHJlY29ubmVjdFxuICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKHtcbiAgICAgICAgICAgIFwidHlwZVwiOiB0eXBlLFxuICAgICAgICAgICAgXCJjYWxsYmFja1wiOiBjYWxsYmFjayxcbiAgICAgICAgICAgIFwiY2FsbGJhY2tDb250ZXh0XCI6IGNhbGxiYWNrQ29udGV4dCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBhcmdzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc291cmNlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncywgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNTRTsiLCJjbGFzcyBVdGlsIHtcbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZXR1cm4gYSBmb3JtYXR0ZWQgY3VycmVuY3kgc3RyaW5nIGZyb20gYW4gaW50ZWdlclxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZUN1cnJlbmN5KGludCkge1xuICAgICAgICBsZXQgdmFsID0gaW50IC8gMTAwO1xuICAgICAgICByZXR1cm4gXCIkXCIgKyB2YWwudG9GaXhlZCgyKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWw7IiwiY29uc3QgQWN0aW9uID0ge1xuICAgIEJMSU5EOiAwLFxuICAgIEZPTEQ6IDEsXG4gICAgQ0hFQ0s6IDIsXG4gICAgQkVUOiAzXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBY3Rpb247IiwiLyoqXG4gKiBBIFBoYXNlci5CdXR0b24gd2l0aCBhIFBoYXNlci5UZXh0IGNlbnRlcmVkIG9uIHRoZSBidXR0b25cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIG1lcmVseSBhIHRoaW4gd3JhcHBlciBhcm91bmQgUGhhc2VyLkJ1dHRvbiB0byBhbGxvdyBmb3JcbiAqIGVhc3kgdXNlIG9mIGEgdGV4dCBsYWJlbCBvbiB0aGUgYnV0dG9uLiBUaGUgdGV4dCBpcyBhIGNoaWxkIG9mIHRoZSBidXR0b24sXG4gKiBzbyBpdCBtb3ZlcyB3aGVuIHRoZSBidXR0b24gbW92ZXMuIEl0J3MgY2VudGVyZWQgb24gdGhlIGJ1dHRvbiBhbmQgc2NhbGVzXG4gKiBhdXRvbWF0aWNhbGx5IHRvIGZpeCB3aXRoaW4gdGhlIGJ1dHRvbidzIGJvdW5kcy5cbiAqXG4gKiBJZiBub25lIG9mIHRoZSBsYWJlbCBmdW5jdGlvbmFsaXR5IGlzIHVzZWQsIHRoaXMgY2xhc3MgaXMgaWRlbnRpY2FsIHRvXG4gKiBQaGFzZXIuQnV0dG9uLlxuICovXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBQaGFzZXIuQnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSkge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSk7XG5cbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSAxMDtcbiAgICAgICAgdGhpcy5sYWJlbFRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSB7fTtcbiAgICAgICAgdGhpcy5sYWJlbCA9IG5ldyBQaGFzZXIuVGV4dCh0aGlzLmdhbWUsIDAsIDAsIHRoaXMubGFiZWxUZXh0KTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmxhYmVsKTtcblxuICAgICAgICAvLyBNdXN0IGFkZCB0byBnYW1lIHdvcmxkIG1hbnVhbGx5IGlmIG5vdCB1c2luZyBnYW1lLmFkZC5idXR0b25cbiAgICAgICAgdGhpcy5nYW1lLndvcmxkLmFkZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHRleHQgZGlzcGxheWVkIG9uIHRoZSBidXR0b25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGRpc3BsYXlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0VGV4dCh0ZXh0LCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxUZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBzdHlsZSBmb3IgdGhlIGJ1dHRvbiB0ZXh0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gVGhlIHRleHQgc3R5bGUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFRleHRTdHlsZShzdHlsZSwgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSBzdHlsZTtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBwYWRkaW5nIGJldHdlZW4gdGhlIHRleHQgYW5kIHRoZSBidXR0b24gcGVyaW1ldGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmcgLSBUaGUgcGFkZGluZyBpbiBwaXhlbHNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0UGFkZGluZyhwYWRkaW5nLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxQYWRkaW5nID0gcGFkZGluZztcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIGJ1dHRvblxuICAgICAqIE9uIGRpc2FibGUsIGRpc2FibGVzIGFsbCBpbnB1dCB0byB0aGUgYnV0dG9uIGFuZCByZW5kZXJzIGl0IGdyYXllZFxuICAgICAqIG91dC4gQWxsIHVwZGF0ZXMgYXJlIGRlbGF5ZWQgdW50aWwgcmUtZW5hYmxlLCB1bmxlc3MgZm9yY2VkLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIEVuYWJsZSBvciBkaXNhYmxlIGJ1dHRvbj9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmxhYmVsLnRpbnQgPSB0aW50O1xuXG4gICAgICAgIC8vIFVwZGF0ZSBvbiByZS1lbmFibGVcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFVwZGF0ZSBhbGwgYnV0dG9uIGF0dHJpYnV0ZXMgdG8gY3VycmVudCBwcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBJZiB0aGUgYnV0dG9uIGlzIGRpc2FibGVkLCB0aGlzIHdpbGwgaGF2ZSBubyBlZmZlY3QuIFRoZVxuICAgICAqIGRldmVsb3BlciBtYXkgb3B0aW9uYWxseSBjaG9vc2UgdG8gZm9yY2UgdGhlIHVwZGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSB0aGUgdXBkYXRlP1xuICAgICAqL1xuICAgIHVwZGF0ZUxhYmVsKGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCB8fCBmb3JjZSkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbC50ZXh0ID0gdGhpcy5sYWJlbFRleHQ7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnNldFN0eWxlKHRoaXMubGFiZWxTdHlsZSk7XG4gICAgICAgICAgICB0aGlzLnJlUG9zTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNjYWxlIGxhYmVsIHRleHQgdG8gZml0IG9uIGJ1dHRvbiBhbmQgY2VudGVyXG4gICAgICovXG4gICAgcmVQb3NMYWJlbCgpIHtcbiAgICAgICAgdGhpcy5sYWJlbC5zY2FsZS5zZXRUbygxKTtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFIID0gdGhpcy53aWR0aCAtIHRoaXMubGFiZWxQYWRkaW5nICogMjtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFWID0gdGhpcy5oZWlnaHQgLSB0aGlzLmxhYmVsUGFkZGluZyAqIDI7XG4gICAgICAgIGlmICh0aGlzLmxhYmVsLndpZHRoID4gdGV4dEFyZWFIIHx8IHRoaXMubGFiZWwuaGVpZ2h0ID4gdGV4dEFyZWFWKSB7XG4gICAgICAgICAgICBjb25zdCByZWR1Y2VkU2NhbGVIID0gdGV4dEFyZWFIIC8gdGhpcy5sYWJlbC53aWR0aDtcbiAgICAgICAgICAgIGNvbnN0IHJlZHVjZWRTY2FsZVYgPSB0ZXh0QXJlYVYgLyB0aGlzLmxhYmVsLmhlaWdodDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2NhbGUuc2V0VG8oTWF0aC5taW4ocmVkdWNlZFNjYWxlSCwgcmVkdWNlZFNjYWxlVikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFiZWwuY2VudGVyWCA9IHRoaXMud2lkdGggLyAyO1xuICAgICAgICB0aGlzLmxhYmVsLmNlbnRlclkgPSB0aGlzLmhlaWdodCAvIDI7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjsiLCJjbGFzcyBDYXJkIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBtYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7ICAgLy8gU3RyaW5nIElEIG9mIGNhcmQsIGUuZy4gJ0toJyBvciAnN3MnXG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKGRhdGEpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwiY2FyZHNcIik7XG4gICAgICAgIHRoaXMuc3ByaXRlLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLnNwcml0ZS5zY2FsZS5zZXRUbygxLjUpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lTmFtZSA9IHRoaXMubmFtZSA/IHRoaXMubmFtZSA6IFwiYmFja1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZDsiLCJjbGFzcyBDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBwbGF5ZXJJZCwgdG9rZW4pIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBhY2Nlc3MgdG9rZW4gdXNlZCB0byBhdXRoZW50aWNhdGUgb24gQVBJIGNhbGxzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gVGhlIEZsYXNrLUpXVC1FeHRlbmRlZCBhY2Nlc3MgdG9rZW5cbiAgICAgKi9cbiAgICBzZXRUb2tlbih0b2tlbikge1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgICAqXG4gICAgICogT25seSBlcnJvcnMgYXJlIHJlcG9ydGVkLiBTdWNjZXNzIGlzIHNpbGVudC4gR2FtZSBjaGFuZ2VzIHJlc3VsdGluZ1xuICAgICAqIGZyb20gcmVxdWVzdHMgYXJlIGhhbmRsZWQgdmlhIFNlcnZlciBTZW50IEV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmRwb2ludCAtIFRoZSBlbmRwb2ludCBvbiB0aGUgc2VydmVyIHRvIHNlbmQgcmVxdWVzdCB0b1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gVGhlIHBheWxvYWQgdG8gc2VuZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWV0aG9kPVwiUE9TVF0gLSBUaGUgSFRUUCBtZXRob2QgdG8gdXNlXG4gICAgICovXG4gICAgc2VuZFJlcXVlc3QoZW5kcG9pbnQsIGRhdGEsIG1ldGhvZCA9IFwiUE9TVFwiKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4obWV0aG9kLCBlbmRwb2ludCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3AgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIC8vIEludmFsaWQgcmVxdWVzdCBlcnJvclxuICAgICAgICAgICAgICAgIGlmIChyZXNwLnN1Y2Nlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihyZXNwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgIC8vIEZhaWxlZCByZXF1ZXN0IGVycm9yXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgdGhpcy50b2tlbik7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGFuIGFjdGlvbiByZXF1ZXN0XG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHRoZSBtb3N0IGhlYXZpbHktdXNlZCByZXF1ZXN0IHR5cGUgaW4gdGhlIGdhbWUuIEFsbCBpbi1nYW1lXG4gICAgICogYWN0aW9ucyAoYmV0LCBjaGVjaywgZm9sZCkgaGFwcGVuIGhlcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIFRoZSBwYXlsb2FkIHRvIHNlbmRcbiAgICAgKi9cbiAgICBhY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiYWN0aW9uXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgY2hlY2soKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkNIRUNLXCIpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBiZXQoYW10KSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJFVFwiLCBhbXQpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBmb2xkKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBiYigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkxJTkRcIiwgNTApO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBzYigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkxJTkRcIiwgMjUpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBqb2luKHNlYXROdW0pIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcInBvc2l0aW9uXCI6IHNlYXROdW19O1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiam9pblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGxlYXZlKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJsZWF2ZVwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSBiZWFjb24gdG8gdGhlIHNlcnZlciBvbiBkaXNjb25uZWN0XG4gICAgICpcbiAgICAgKiBUaGlzIGFsbG93cyBmb3Igc2VydmVyIHRvIGtub3cgd2hlbiBhIGNsaWVudCBkaXNjb25uZWN0cyBzb1xuICAgICAqIGl0IGNhbiBjbGVhbiB1cCBhcyBuZWNlc3NhcnkuIE5vIGd1YXJhbnRlZSB0aGF0IHRoaXMgbWVzc2FnZVxuICAgICAqIHdpbGwgZ28gdGhyb3VnaCwgc28gbXVzdCBoYXZlIHJlZHVuZGFudCBtZWFzdXJlcyBpbiBwbGFjZS5cbiAgICAgKi9cbiAgICBkaXNjb25uZWN0QmVhY29uKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0IHVybCA9IFwiL2Rpc2Nvbm5lY3QvXCI7XG4gICAgICAgIG5hdmlnYXRvci5zZW5kQmVhY29uKHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgYnVpbGRQYXlsb2FkKGFjdGlvblR5cGUsIGJldEFtdCA9IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwicGxheWVySWRcIjogdGhpcy5wbGF5ZXJJZCxcbiAgICAgICAgICAgIFwiYWN0aW9uVHlwZVwiOiBhY3Rpb25UeXBlLFxuICAgICAgICAgICAgXCJiZXRBbXRcIjogYmV0QW10XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBidWlsZFVybChlbmRwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlVXJsICsgZW5kcG9pbnQgKyBcIi9cIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXI7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4vQnV0dG9uXCI7XG5pbXBvcnQgU2xpZGVyIGZyb20gXCIuL1NsaWRlclwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuY2xhc3MgUGFuZWwge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5iZXRzID0gWzBdO1xuICAgICAgICB0aGlzLnByaW1hcnlDbGlja2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5wcmltYXJ5QWN0aW9uID0gQWN0aW9uLkJFVDtcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gMDtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlDbGlja2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlBY3Rpb24gPSBBY3Rpb24uQ0hFQ0s7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QmV0ID0gMDtcbiAgICAgICAgdGhpcy50ZXJ0aWFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnRlcnRpYXJ5QWN0aW9uID0gQWN0aW9uLkZPTEQ7XG4gICAgICAgIHRoaXMuc2xpZGVyID0gbmV3IFNsaWRlcih0aGlzLmdhbWUsIFwicGFuZWxcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWx3YXlzVmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5wcmltYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDAsIDAsIFwibWVkXCIsICgpID0+IHRoaXMucHJpbWFyeUNsaWNrZWQuZGlzcGF0Y2godGhpcy5wcmltYXJ5QWN0aW9uLCB0aGlzLnByaW1hcnlCZXQpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNlY29uZGFyeSA9IHRoaXMubWFrZUJ1dHRvbigxMzUsIDAsIFwibWVkXCIsICgpID0+IHRoaXMuc2Vjb25kYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnNlY29uZGFyeUFjdGlvbiwgdGhpcy5zZWNvbmRhcnlCZXQpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRlcnRpYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDI3MCwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy50ZXJ0aWFyeUNsaWNrZWQuZGlzcGF0Y2godGhpcy50ZXJ0aWFyeUFjdGlvbiwgMCkpO1xuXG4gICAgICAgIHRoaXMuc2xpZGVyLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuc2xpZGVyLmluZGV4Q2hhbmdlZC5hZGQoKGluZGV4KSA9PiB0aGlzLnNldFByaW1hcnlCZXQodGhpcy5iZXRzW2luZGV4XSksIHRoaXMpO1xuICAgICAgICB0aGlzLnNsaWRlci5zbGlkZXJXaGVlbC5hZGQodGhpcy5zaW5nbGVTdGVwQmV0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNsaWRlciA9IHRoaXMuc2xpZGVyLmJhcjtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNsaWRlci55ID0gNjA7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5wcmltYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zZWNvbmRhcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnRlcnRpYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zbGlkZXIpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG1ha2VCdXR0b24oeCwgeSwgc2l6ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ1dHRvbiA9IG5ldyBCdXR0b24odGhpcy5nYW1lLCB4LCB5LCB0aGlzLmtleSk7XG4gICAgICAgIGJ1dHRvbi5vbklucHV0VXAuYWRkKGNhbGxiYWNrKTtcbiAgICAgICAgYnV0dG9uLnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX292ZXJcIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX291dFwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfdXBcIlxuICAgICAgICApO1xuICAgICAgICBidXR0b24uc2V0VGV4dFN0eWxlKHRoaXMuZ2FtZS5jb25maWcucGFuZWwudGV4dFN0eWxlKTtcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICAvLyBQYW5lbCB1cGRhdGVzIHJlcXVpcmUgcGxheWVycycgY3VycmVudCBiZXRzLCBzbyBpZlxuICAgICAgICAvLyB0aGVyZSBpcyBubyBuZXh0IHBsYXllciB3ZSBzaG91bGRuJ3QgdXBkYXRlIHRoZSBkaXNwbGF5XG4gICAgICAgIGlmICghdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGFjdGlvblRleHQgPSB0aGlzLmdhbWUucm91bmRCZXQgPT09IDAgPyBcIkJFVCBcIiA6IFwiUkFJU0UgVE9cXG5cIjtcbiAgICAgICAgbGV0IHByaW1hcnlUZXh0ID0gYWN0aW9uVGV4dCArIFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLnByaW1hcnlCZXQgKyB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuc2V0VGV4dChwcmltYXJ5VGV4dCk7XG5cbiAgICAgICAgbGV0IHNlY29uZGFyeVRleHQgPSBcIkNIRUNLXCI7XG4gICAgICAgIGlmICh0aGlzLnNlY29uZGFyeUFjdGlvbiAhPT0gQWN0aW9uLkNIRUNLKSB7XG4gICAgICAgICAgICBzZWNvbmRhcnlUZXh0ID0gXCJDQUxMIFwiICsgVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuc2Vjb25kYXJ5QmV0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5LnNldFRleHQoc2Vjb25kYXJ5VGV4dCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnRlcnRpYXJ5LnNldFRleHQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC52aXNpYmxlID0gdGhpcy52aXNpYmxlO1xuICAgIH1cblxuICAgIHNldEJldHMoYmV0cykge1xuICAgICAgICBpZiAoYmV0cy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBiZXRzLiBQYW5lbCBtdXN0IGFsd2F5cyBoYXZlIGF0IGxlYXN0IG9uZSB2YWxpZCBiZXQuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iZXRzID0gYmV0cztcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0c1swXTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0TGVuZ3RoKGJldHMubGVuZ3RoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoMCk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNldEVuYWJsZWQoYmV0cy5sZW5ndGggPiAxKTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc2V0UHJpbWFyeUJldChiZXQpIHtcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gYmV0O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRTZWNvbmRhcnlCZXQoYmV0KSB7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QmV0ID0gYmV0O1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IGJldCA9PT0gMCA/IEFjdGlvbi5DSEVDSyA6IEFjdGlvbi5CRVQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEhpZGUgb3Igc2hvdyB0aGUgZW50aXJlIHBhbmVsXG4gICAgICogQHBhcmFtIHtib29sZWFufSB2aXNpYmxlXG4gICAgICovXG4gICAgc2V0VmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IHZpc2libGUgfHwgdGhpcy5hbHdheXNWaXNpYmxlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBJbmNyZW1lbnQgb3IgZGVjcmVtZW50IHRoaXMucHJpbWFyeUJldFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLk1vdXNlLndoZWVsRGVsdGF9IG1vZGlmaWVyIC0gKzEgb3IgLTFcbiAgICAgKi9cbiAgICBzaW5nbGVTdGVwQmV0KG1vZGlmaWVyKSB7XG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuc2xpZGVyLmluZGV4ICsgbW9kaWZpZXI7XG4gICAgICAgIGlmIChpbmRleCA+PSAwICYmIGluZGV4IDw9IHRoaXMuc2xpZGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYW5lbDsiLCJpbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuXG5jbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIG1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcblxuICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBudWxsO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBudWxsO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBudWxsO1xuICAgICAgICB0aGlzLnNlYXQgPSBudWxsO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gMDsgIC8vIFN1bSBiZXRzIGJ5IHBsYXllciBpbiBjdXJyZW50IGJldHRpbmcgcm91bmRcblxuICAgICAgICB0aGlzLmlzRGVhbGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNOZXh0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuXG4gICAgICAgIHRoaXMuY2FyZHMgPSBuZXcgQ2FyZE1hbmFnZXIodGhpcy5nYW1lKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKGRhdGEpIHtcbiAgICAgICAgdGhpcy5pZCA9IGRhdGEuaWQ7XG4gICAgICAgIHRoaXMudXNlcklkID0gZGF0YS51c2VySWQ7XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGRhdGEuYmFsYW5jZTtcbiAgICAgICAgdGhpcy5zaXR0aW5nT3V0ID0gZGF0YS5zaXR0aW5nT3V0O1xuICAgICAgICB0aGlzLnNlYXQgPSBkYXRhLnNlYXQ7XG4gICAgICAgIHRoaXMubmFtZSA9IGRhdGEubmFtZTtcbiAgICAgICAgdGhpcy5pc1VzZXIgPSBkYXRhLmlzVXNlcjtcblxuICAgICAgICB0aGlzLmNhcmRzLmluaXRpYWxpemUoMik7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kID0gdGhpcy5kaXNwbGF5R3JvdXAuY3JlYXRlKDAsIDAsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVJlY3QpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZSA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAtMjAsIFwiXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5uYW1lKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZSA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAyMCwgXCJcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmJhbGFuY2UpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcyA9IHRoaXMuY2FyZHMuZGlzcGxheUdyb3VwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMuY2VudGVyWCA9IDA7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcy5jZW50ZXJZID0gLTEyMDtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5jYXJkcyk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbiA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwiZGVhbGVyQnV0dG9uXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmxlZnQgPSB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5sZWZ0ICsgNTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbi5ib3R0b20gPSB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5ib3R0b20gLSA1O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbik7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCBcInJlZENpcmNsZVwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IucmlnaHQgPSB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5yaWdodCAtIDU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yLmJvdHRvbSA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLmJvdHRvbSAtIDU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvcik7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUudGV4dCA9IHRoaXMubmFtZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UudGV4dCA9IFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLmJhbGFuY2UpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLnZpc2libGUgPSB0aGlzLmlzRGVhbGVyID09PSB0cnVlO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvci52aXNpYmxlID0gdGhpcy5pc05leHQgPT09IHRydWU7XG4gICAgfVxuXG4gICAgdXBkYXRlKGRhdGEpIHtcbiAgICAgICAgLy8gVE9ETyAtIEZsZXNoIG91dCB0aGUgcmVzdCBvZiB0aGUgZGF0YSAtLSBkbyBJIGxpa2UgdGhpcyBtZXRob2Q/XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGRhdGEuYmFsYW5jZSA9PT0gdW5kZWZpbmVkID8gdGhpcy5iYWxhbmNlIDogZGF0YS5iYWxhbmNlO1xuICAgICAgICB0aGlzLmlzRGVhbGVyID0gZGF0YS5pc0RlYWxlciA9PT0gdW5kZWZpbmVkID8gdGhpcy5pc0RlYWxlciA6IGRhdGEuaXNEZWFsZXI7XG4gICAgICAgIHRoaXMuaXNOZXh0ID0gZGF0YS5pc05leHQgPT09IHVuZGVmaW5lZCA/IHRoaXMuaXNOZXh0IDogZGF0YS5pc05leHQ7XG4gICAgICAgIHRoaXMucm91bmRCZXQgPSBkYXRhLnJvdW5kQmV0ID09PSB1bmRlZmluZWQgPyB0aGlzLnJvdW5kQmV0IDogZGF0YS5yb3VuZEJldDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcblxuY2xhc3MgUG90IHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMuYW1vdW50ID0gMDtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBudWxsO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZSA9IHRoaXMubWFrZUJ0bigwLCAwLCBcIlwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVSZWN0LCAoKSA9PiB7fSk7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlLnRleHQudGV4dCA9IFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLmFtb3VudCk7XG4gICAgfVxuXG4gICAgc2V0QW1vdW50KGFtb3VudCkge1xuICAgICAgICB0aGlzLmFtb3VudCA9IGFtb3VudDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgbWFrZUJ0bih4LCB5LCB0ZXh0LCB0ZXh0dXJlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0ID0gdGhpcykge1xuICAgICAgICBsZXQgYnRuID0gdGhpcy5nYW1lLmFkZC5idXR0b24oeCwgeSwgdGV4dHVyZSwgY2FsbGJhY2ssIGNhbGxiYWNrQ29udGV4dCk7XG4gICAgICAgIGJ0bi5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICBsZXQgYnRuVGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAwLCB0ZXh0KTtcbiAgICAgICAgYnRuVGV4dC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgYnRuLmFkZENoaWxkKGJ0blRleHQpO1xuICAgICAgICBidG4udGV4dCA9IGJ0blRleHQ7XG5cbiAgICAgICAgcmV0dXJuIGJ0bjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBvdDsiLCIvKipcbiAqIEEgc2xpZGVyIFVJIGVsZW1lbnRcbiAqXG4gKiBSZXByZXNlbnRlZCBieSBhIGJhciBzcHJpdGUgYW5kIGEgbWFya2VyIHNwcml0ZS4gRGVzcGl0ZSBob3cgaXQgbWF5XG4gKiBsb29rLCBhbGwgaW5wdXQgb2NjdXJzIG9uIHRoZSBiYXIgYW5kIHVwZGF0ZXMgYXJlIG1hZGUgdG8gdGhlXG4gKiBtYXJrZXIncyBwb3NpdGlvbiBiYXNlZCBvbiB0aG9zZSBpbnB1dHMuXG4gKi9cbmNsYXNzIFNsaWRlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJhciA9IG51bGw7ICAvLyBUaGUgc2xpZGVyIGJhciBzcHJpdGVcbiAgICAgICAgdGhpcy5tYXJrZXIgPSBudWxsOyAgLy8gVGhlIGRyYWdnYWJsZSBtYXJrZXIgc3ByaXRlXG4gICAgICAgIHRoaXMuaW5kZXggPSAwOyAgLy8gQ3VycmVudCBpbmRleCBvZiBtYXJrZXJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAxOyAgLy8gVG90YWwgbnVtYmVyIG9mIGluZGljZXNcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuaW5kZXhDaGFuZ2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5zbGlkZXJXaGVlbCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuYmFyID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCB0aGlzLmtleSwgXCJzbGlkZXJfYmFyXCIpO1xuICAgICAgICB0aGlzLmJhci5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dERvd24uYWRkKHRoaXMuc3RhcnREcmFnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRVcC5hZGQodGhpcy5zdG9wRHJhZywgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4gdGhpcy5lbmFibGVTbGlkZXJXaGVlbCh0cnVlKSk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0T3V0LmFkZCgoKSA9PiB0aGlzLmVuYWJsZVNsaWRlcldoZWVsKGZhbHNlKSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYXIgPSB0aGlzLmJhcjtcblxuICAgICAgICB0aGlzLm1hcmtlciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIHRoaXMua2V5LCBcInNsaWRlcl9tYXJrZXJcIik7XG4gICAgICAgIHRoaXMubWFya2VyLmFuY2hvci5zZXRUbygwLjUsIDApO1xuICAgICAgICB0aGlzLm1hcmtlci5ib3R0b20gPSB0aGlzLmJhci5ib3R0b207XG4gICAgICAgIHRoaXMuZGlzcGxheS5tYXJrZXIgPSB0aGlzLm1hcmtlcjtcbiAgICAgICAgdGhpcy5iYXIuYWRkQ2hpbGQodGhpcy5tYXJrZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBzbGlkZXIgZHJhZ2dpbmcgYW5kIGluaXRpYXRlIGZpcnN0IGRyYWcgZXZlbnRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5TcHJpdGV9IGJhciAtIFRoZSBiYXIgc3ByaXRlIHRoYXQgd2FzIGNsaWNrZWRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Qb2ludGVyfSBwb2ludGVyIC0gVGhlIHBvaW50ZXIgd2hpY2ggaW5pdGlhdGVkIHRoZSBjbGlja1xuICAgICAqL1xuICAgIHN0YXJ0RHJhZyhiYXIsIHBvaW50ZXIpIHtcbiAgICAgICAgLy8gSW5pdGlhbCBjYWxsIHRvIHVwZGF0ZURyYWcgYWxsb3dzIGNoYW5naW5nIGJldCB3aXRoIGNsaWNrIG9uIGJhclxuICAgICAgICB0aGlzLnVwZGF0ZURyYWcocG9pbnRlciwgcG9pbnRlci54LCBwb2ludGVyLnkpO1xuICAgICAgICB0aGlzLmdhbWUuaW5wdXQuYWRkTW92ZUNhbGxiYWNrKHRoaXMudXBkYXRlRHJhZywgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRGlzYWJsZSBzbGlkZXIgZHJhZ2dpbmdcbiAgICAgKi9cbiAgICBzdG9wRHJhZygpIHtcbiAgICAgICAgdGhpcy5nYW1lLmlucHV0LmRlbGV0ZU1vdmVDYWxsYmFjayh0aGlzLnVwZGF0ZURyYWcsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IENhbGN1bGF0ZSBzbGlkZXIgaW5kZXggYmFzZWQgb24gZHJhZyBpbnB1dFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlBvaW50ZXJ9IHBvaW50ZXIgLSBUaGUgc2xpZGluZyBwb2ludGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlIG9mIHBvaW50ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGUgb2YgcG9pbnRlclxuICAgICAqL1xuICAgIHVwZGF0ZURyYWcocG9pbnRlciwgeCwgeSkge1xuICAgICAgICBsZXQgbG9jYWxYID0geCAtIHRoaXMuYmFyLndvcmxkLng7ICAvLyBDbGljayBwb3MgaW4gcmVsYXRpb24gdG8gYmFyXG5cbiAgICAgICAgLy8gUHJldmVudCBkcmFnZ2luZyBwYXN0IGJhciBib3VuZHNcbiAgICAgICAgaWYgKGxvY2FsWCA8IDApIHtcbiAgICAgICAgICAgIGxvY2FsWCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAobG9jYWxYID4gdGhpcy5iYXIud2lkdGgpIHtcbiAgICAgICAgICAgIGxvY2FsWCA9IHRoaXMuYmFyLndpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3VidHJhY3QgMSBmcm9tIGxlbmd0aCBiZWNhdXNlIGxlbmd0aCBpcyAxLWluZGV4ZWQsIGluZGljZXMgYXJlIDAtaW5kZXhlZFxuICAgICAgICBjb25zdCBpbmRleCA9IE1hdGgucm91bmQobG9jYWxYIC8gdGhpcy5iYXIud2lkdGggKiAodGhpcy5sZW5ndGggLSAxKSk7XG4gICAgICAgIHRoaXMuc2V0SW5kZXgoaW5kZXgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgaW5kZXggb2YgdGhlIHNsaWRlciBhbmQgcmVwb3J0IHRoZSBuZXcgdmFsdWVcbiAgICAgKlxuICAgICAqIE9wdGlvbmFsbHkgdXBkYXRlIHRoZSB2aXN1YWwgcG9zaXRpb24gb2YgdGhlIG1hcmtlciBvbiB0aGUgc2xpZGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gTmV3IGluZGV4IHRvIHNldCBvbiBzbGlkZXJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1cGRhdGVQb3M9dHJ1ZV0gLSBVcGRhdGUgdGhlIHBvc2l0aW9uIG9mIG1hcmtlcj9cbiAgICAgKi9cbiAgICBzZXRJbmRleChpbmRleCwgdXBkYXRlUG9zID0gdHJ1ZSkge1xuICAgICAgICBpZiAoaW5kZXggIT09IHRoaXMuaW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhDaGFuZ2VkLmRpc3BhdGNoKGluZGV4KTtcblxuICAgICAgICAgICAgaWYgKHVwZGF0ZVBvcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIG9ubHkgb25lIGJldCBhdmFpbGFibGUsIGl0J3MgYSBtYXggYmV0XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFya2VyLnggPSB0aGlzLmJhci53aWR0aDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCAxIGZyb20gbGVuZ3RoIGJlY2F1c2UgbGVuZ3RoIGlzIDEtaW5kZXhlZCwgaW5kaWNlcyBhcmUgMC1pbmRleGVkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFya2VyLnggPSB0aGlzLmJhci53aWR0aCAvICh0aGlzLmxlbmd0aCAtIDEpICogdGhpcy5pbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBVcGRhdGUgdGhlIGxlbmd0aCBwcm9wZXJ0eVxuICAgICAqXG4gICAgICogVGhlIGxlbmd0aCBwcm9wZXJ0eSBkZXNjcmliZXMgaG93IG1hbnkgZGlzY3JldGUgYmV0cyB0aGUgc2xpZGVyIGJhclxuICAgICAqIG11c3QgcmVwcmVzZW50LiBUaGUgc2xpZGVyIGRvZXMgbm90IGNhcmUgYWJvdXQgd2hhdCB0aGUgc3BlY2lmaWMgYmV0XG4gICAgICogaXQgcmVwcmVzZW50cyBpcywgb25seSB0aGF0IGl0IGhhcyBzb21lIG51bWJlciBvZiBpbmRpY2VzIGFsb25nIGl0c1xuICAgICAqIGxlbmd0aCBhbmQgdGhhdCBpdCBtdXN0IHJlcG9ydCBpdHMgaW5kZXggdG8gbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBuZXcgbGVuZ3RoIHRvIHNldFxuICAgICAqL1xuICAgIHNldExlbmd0aChsZW5ndGgpIHtcbiAgICAgICAgaWYgKGxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IHNldCBzbGlkZXIgbGVuZ3RoIGxlc3MgdGhhbiAxXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGxlbmd0aCA+IHRoaXMuYmFyLndpZHRoKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBTZXR0aW5nIHNsaWRlciBzdG9wcyBncmVhdGVyIHRoYW4gbGVuZ3RoIG1heSByZXN1bHQgaW4gdW5leHBlY3RlZCBiZWhhdmlvclwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSB0aGUgc2xpZGVyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gSXMgdGhlIHNsaWRlciBlbmFibGVkP1xuICAgICAqL1xuICAgIHNldEVuYWJsZWQoZW5hYmxlZCkge1xuICAgICAgICB0aGlzLmJhci5pbnB1dEVuYWJsZWQgPSBlbmFibGVkO1xuXG4gICAgICAgIGxldCB0aW50ID0gZW5hYmxlZCA/IDB4RkZGRkZGIDogMHg4MDgwODA7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYXIudGludCA9IHRpbnQ7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tYXJrZXIudGludCA9IHRpbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgZGlzcGF0Y2ggb2Ygc2lnbmFsIG9uIHdoZWVsIHNjcm9sbFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIElzIHRoZSBjYWxsYmFjayBlbmFibGVkIG9yIGRpc2FibGVkP1xuICAgICAqL1xuICAgIGVuYWJsZVNsaWRlcldoZWVsKGVuYWJsZWQpIHtcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS5tb3VzZVdoZWVsQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJXaGVlbC5kaXNwYXRjaCh0aGlzLmdhbWUuaW5wdXQubW91c2Uud2hlZWxEZWx0YSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmlucHV0Lm1vdXNlLm1vdXNlV2hlZWxDYWxsYmFjayA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNsaWRlcjsiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwicGFuZWxcIjoge1xuICAgIFwicGFkZGluZ1wiOiAxMCxcbiAgICBcInRleHRTdHlsZVwiOiB7XG4gICAgICBcImZvbnRcIjogXCJib2xkIDIycHQgQXJpYWxcIixcbiAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICBcImFsaWduXCI6IFwiY2VudGVyXCJcbiAgICB9LFxuICAgIFwicG9zXCI6IHtcbiAgICAgIFwieFwiOiAxNDgwLFxuICAgICAgXCJ5XCI6IDc5MFxuICAgIH1cbiAgfSxcbiAgXCJzZWF0c1wiOiB7XG4gICAgXCIxMFwiOiBbXG4gICAgICB7XCJ4XCI6IDkxMCwgXCJ5XCI6IDIzMH0sXG4gICAgICB7XCJ4XCI6IDEyNDQsIFwieVwiOiAyMzB9LFxuICAgICAge1wieFwiOiAxNDg0LCBcInlcIjogMzQ2fSxcbiAgICAgIHtcInhcIjogMTQ4NCwgXCJ5XCI6IDY0Mn0sXG4gICAgICB7XCJ4XCI6IDEyNDQsIFwieVwiOiA3NTh9LFxuICAgICAge1wieFwiOiA5MTAsIFwieVwiOiA3NTh9LFxuICAgICAge1wieFwiOiA1NzYsIFwieVwiOiA3NTh9LFxuICAgICAge1wieFwiOiAzNDIsIFwieVwiOiA2NDJ9LFxuICAgICAge1wieFwiOiAzNDIsIFwieVwiOiAzNDZ9LFxuICAgICAge1wieFwiOiA1NzYsIFwieVwiOiAyMzB9XG4gICAgXSxcblxuICAgIC8vIFRPRE9cbiAgICBcIjhcIjogW10sXG4gICAgXCI5XCI6IFtdXG4gIH1cbn0iLCJpbXBvcnQgQnV0dG9uIGZyb20gXCIuLi9jbGFzc2VzL0J1dHRvblwiO1xuXG5jbGFzcyBCdXlJbk1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5zZWF0cyA9IHt9O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5idXlJblJlcXVlc3RlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuZ3JvdXBWaXNpYmxlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKHNlYXRDb25maWcsIG9jY3VwaWVkU2VhdHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWF0Q29uZmlnLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIHNlYXRDb25maWdbaV0ueCwgc2VhdENvbmZpZ1tpXS55LCB0aGlzLmtleSwgdGhpcy5idXR0b25DbGlja2VkLCB0aGlzKTtcbiAgICAgICAgICAgIGJ1dHRvbi5zZWF0TnVtID0gaTsgLy8gU3RvcmUgZm9yIHVzZSBvbiBjbGlja1xuICAgICAgICAgICAgYnV0dG9uLnNldEZyYW1lcyhcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9vdmVyXCIsXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fb3V0XCIsXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fZG93blwiLFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX3VwXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBidXR0b24uc2V0VGV4dChcIkJ1eSBJblwiKTtcbiAgICAgICAgICAgIHRoaXMuc2VhdHNbaV0gPSB7XG4gICAgICAgICAgICAgICAgXCJidXR0b25cIjogYnV0dG9uLFxuICAgICAgICAgICAgICAgIFwib2NjdXBpZWRcIjogb2NjdXBpZWRTZWF0cy5pbmRleE9mKGkpICE9PSAtMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChidXR0b24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuc2VhdHNbcGxheWVyRGF0YS5zZWF0XS5vY2N1cGllZCA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHBsYXllckxlZnQocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLnNlYXRzW3BsYXllckRhdGEuc2VhdF0ub2NjdXBpZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgZm9yIChsZXQgc2VhdE51bSBpbiB0aGlzLnNlYXRzKSB7XG4gICAgICAgICAgICBsZXQgc2VhdCA9IHRoaXMuc2VhdHNbc2VhdE51bV07XG4gICAgICAgICAgICBzZWF0LmJ1dHRvbi52aXNpYmxlID0gIXNlYXQub2NjdXBpZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAudmlzaWJsZSA9IHRoaXMuZ3JvdXBWaXNpYmxlO1xuICAgIH1cblxuICAgIGJ1dHRvbkNsaWNrZWQoYnV0dG9uKSB7XG4gICAgICAgIHRoaXMuYnV5SW5SZXF1ZXN0ZWQuZGlzcGF0Y2goYnV0dG9uLnNlYXROdW0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnV5SW5NYW5hZ2VyOyIsImltcG9ydCBDYXJkIGZyb20gXCIuLi9jbGFzc2VzL0NhcmRcIjtcblxuY2xhc3MgQ2FyZE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5jYXJkcyA9IFtdO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKG51bV9jYXJkcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9jYXJkczsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2FyZCA9IG5ldyBDYXJkKHRoaXMuZ2FtZSwgdGhpcyk7XG4gICAgICAgICAgICBjYXJkLmluaXRpYWxpemUoe30pO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNhcmRzLnB1c2goY2FyZCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQoY2FyZC5zcHJpdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWxpZ24oLTEsIDEsIHRoaXMuY2FyZHNbMF0uc3ByaXRlLndpZHRoICogMS4yLCAwKTtcbiAgICB9XG5cbiAgICBzZXRDYXJkTmFtZXMobmFtZXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS5uYW1lID0gbmFtZXNbaV07XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZE1hbmFnZXI7IiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vY2xhc3Nlcy9QbGF5ZXJcIjtcblxuY2xhc3MgUGxheWVyTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgdXNlcklkLCBzZWF0Q29uZmlnKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMudXNlcklkID0gdXNlcklkO1xuICAgICAgICB0aGlzLnNlYXRDb25maWcgPSBzZWF0Q29uZmlnO1xuXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdOyAgLy8gRGlyZWN0IGFjY2VzcyB0byB0aGUgUGxheWVyIG9iamVjdHNcbiAgICAgICAgdGhpcy51c2VyUGxheWVyID0gbnVsbDsgIC8vIFRoZSB1c2VyJ3MgcGxheWVyIG9iamVjdCwgaWYgYXZhaWxhYmxlXG4gICAgICAgIHRoaXMubmV4dFBsYXllciA9IG51bGw7ICAvLyBUaGUgcGxheWVyIHRoYXQgdGhlIGdhbWUgZXhwZWN0cyB0byBhY3QgbmV4dFxuXG4gICAgICAgIC8vIENvbnRhaW5zIGFsbCBkaXNwbGF5IGVsZW1lbnRzIGZvciBhbGwgcGxheWVycyBpbiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKHBsYXllckRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1BsYXllcihwbGF5ZXJEYXRhW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMuZ2FtZSwgdGhpcyk7XG4gICAgICAgIHBsYXllci5pbml0aWFsaXplKHBsYXllckRhdGEpO1xuICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnggPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS54O1xuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnkgPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS55O1xuXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChwbGF5ZXIuZGlzcGxheUdyb3VwKTtcblxuICAgICAgICBpZiAocGxheWVyLnVzZXJJZCA9PT0gdGhpcy51c2VySWQpIHtcbiAgICAgICAgICAgIHRoaXMudXNlclBsYXllciA9IHBsYXllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgcGxheWVyTGVmdChwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLmdldEJ5SWQocGxheWVyRGF0YS5pZCk7XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCBmaW5kIHBsYXllciBhdCB0YWJsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAuZGVzdHJveSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1tpXSA9PT0gcGxheWVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgZ2V0QnlJZChpZCkge1xuICAgICAgICAvLyBUT0RPIC0gRG8gdGhpcyB3aXRob3V0IGl0ZXJhdGluZyAtLSBidWlsZCBtYXAgb24gaW5pdD9cbiAgICAgICAgLy8gVE9ETyAtIFNob3VsZCB0aGlzIGV2ZXIgcmV0dXJuIG51bGw/XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IGEgbGlzdCBvZiBhbGwgb2NjdXBpZWQgc2VhdHMgYXQgdGhlIHRhYmxlXG4gICAgICogQHJldHVybnMge251bWJlcltdfSAtIFRoZSBJRHMgb2Ygb2NjdXBpZWQgc2VhdHNcbiAgICAgKi9cbiAgICBnZXRPY2N1cGllZFNlYXRzKCkge1xuICAgICAgICBsZXQgb2NjdXBpZWRTZWF0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb2NjdXBpZWRTZWF0cy5wdXNoKHRoaXMucGxheWVyc1tpXS5zZWF0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2NjdXBpZWRTZWF0cztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllck1hbmFnZXI7IiwiY29uc3QgaXNTdHJpbmcgPSB2YWwgPT4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG5jb25zdCBpc0Jsb2IgPSB2YWwgPT4gdmFsIGluc3RhbmNlb2YgQmxvYjtcblxucG9seWZpbGwuY2FsbCh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6IHRoaXMgfHwge30pO1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgaWYgKGlzU3VwcG9ydGVkLmNhbGwodGhpcykpIHJldHVybjtcblxuICBpZiAoISgnbmF2aWdhdG9yJyBpbiB0aGlzKSkgdGhpcy5uYXZpZ2F0b3IgPSB7fTtcbiAgdGhpcy5uYXZpZ2F0b3Iuc2VuZEJlYWNvbiA9IHNlbmRCZWFjb24uYmluZCh0aGlzKTtcbn07XG5cbmZ1bmN0aW9uIHNlbmRCZWFjb24odXJsLCBkYXRhKSB7XG4gIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudCAmJiB0aGlzLmV2ZW50LnR5cGU7XG4gIGNvbnN0IHN5bmMgPSBldmVudCA9PT0gJ3VubG9hZCcgfHwgZXZlbnQgPT09ICdiZWZvcmV1bmxvYWQnO1xuXG4gIGNvbnN0IHhociA9ICgnWE1MSHR0cFJlcXVlc3QnIGluIHRoaXMpID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcbiAgeGhyLm9wZW4oJ1BPU1QnLCB1cmwsICFzeW5jKTtcbiAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnKi8qJyk7XG5cblxuICBpZiAoaXNTdHJpbmcoZGF0YSkpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSAndGV4dC9wbGFpbic7XG4gIH0gZWxzZSBpZiAoaXNCbG9iKGRhdGEpICYmIGRhdGEudHlwZSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCBkYXRhLnR5cGUpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICB4aHIuc2VuZChkYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gIHJldHVybiAoJ25hdmlnYXRvcicgaW4gdGhpcykgJiYgKCdzZW5kQmVhY29uJyBpbiB0aGlzLm5hdmlnYXRvcik7XG59IiwiaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgQ29udHJvbGxlciBmcm9tIFwiLi4vY2xhc3Nlcy9Db250cm9sbGVyXCI7XG5cbmNsYXNzIEJvb3QgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbml0aWFsRGF0YSA9IHRoaXMuYXVnbWVudEluaXRpYWxEYXRhKGluaXRpYWxEYXRhKTtcbiAgICAgICAgdGhpcy5nYW1lLmNvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICAvLyBUT0RPIC0gVGhpcyBzaG91bGQgY29tZSBmcm9tIHNvbWV3aGVyZSBkeW5hbWljXG4gICAgICAgIHRoaXMuZ2FtZS5ydWxlcyA9IHtcbiAgICAgICAgICAgIGFudGU6IDAsXG4gICAgICAgICAgICBibGluZHM6IHtcbiAgICAgICAgICAgICAgICBzbWFsbDogMjUsXG4gICAgICAgICAgICAgICAgYmlnOiA1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcklkLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudG9rZW4pO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibG9hZFwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAU3VtbWFyeSBDYWxjdWxhdGUgYWRkaXRpb25hbCB2YWx1ZXMgdG8gc3RvcmUgb24gZ2FtZS5pbml0aWFsRGF0YVxuICAgICAqXG4gICAgICogVG8gc2F2ZSBvbiBzZXJ2ZXItc2lkZSBwcm9jZXNzaW5nIGFuZCBkYXRhLXRyYW5zZmVyIGxvYWQsIHRoaXNcbiAgICAgKiBtZXRob2QgaXMgYSBwbGFjZSB0byBnZW5lcmF0ZSBhZGRpdGlvbmFsIGRhdGEgbmVlZGVkIGJ5IHRoZSBnYW1lXG4gICAgICogd2hpY2ggbWF5IGJlIGRlcml2ZWQgZnJvbSB0aGUgZGF0YSBzZW50IGZyb20gdGhlIGJhY2sgZW5kLlxuICAgICAqL1xuICAgIGF1Z21lbnRJbml0aWFsRGF0YShpbml0aWFsRGF0YSkge1xuICAgICAgICBpbml0aWFsRGF0YS5vY2N1cGllZFNlYXRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5pdGlhbERhdGEucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaW5pdGlhbERhdGEub2NjdXBpZWRTZWF0cy5wdXNoKGluaXRpYWxEYXRhLnBsYXllcnNbaV0uc2VhdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5pdGlhbERhdGE7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb290OyIsImNsYXNzIExvYWQgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIHByZWxvYWQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwiYmFja2dyb3VuZFwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2JhY2tncm91bmQucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcImRlYWxlckJ1dHRvblwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2RlYWxlcmJ1dHRvbi5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwicmVkQ2lyY2xlXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcmVkY2lyY2xlLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImNhcmRzXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcInBhbmVsXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcGFuZWwucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvcGFuZWwuanNvblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImJ1eUluXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV5aW4ucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV5aW4uanNvblwiKTtcblxuICAgICAgICB0aGlzLmdhbWUudGV4dHVyZXMgPSB0aGlzLmNyZWF0ZUN1c3RvbVRleHR1cmVzKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoXCJtYWluXCIpO1xuICAgIH1cblxuICAgIGNyZWF0ZUN1c3RvbVRleHR1cmVzKCkge1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSB7fTtcblxuICAgICAgICBsZXQgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmxpbmVTdHlsZSg0LCAweDAwMDAwMCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDEwMCwgMTAwLCAxMDAsIDEwMCk7XG4gICAgICAgIHRleHR1cmVzW1wid2hpdGVTcXVhcmVcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoNCwgMHgwMDAwMDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgwLCAwLCAzMDAsIDEwMCk7XG5cbiAgICAgICAgdGV4dHVyZXNbXCJ3aGl0ZVJlY3RcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcblxuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgcmV0dXJuIHRleHR1cmVzO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9hZDsiLCJpbXBvcnQgQWN0aW9uIGZyb20gXCIuLi9jbGFzc2VzL0FjdGlvbi5qc1wiO1xuaW1wb3J0IEJ1eUluTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQnV5SW5NYW5hZ2VyXCI7XG5pbXBvcnQgQ2FyZE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NhcmRNYW5hZ2VyXCI7XG5pbXBvcnQgUGFuZWwgZnJvbSBcIi4uL2NsYXNzZXMvUGFuZWxcIjtcbmltcG9ydCBQbGF5ZXJNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9QbGF5ZXJNYW5hZ2VyXCI7XG5pbXBvcnQgUG90IGZyb20gXCIuLi9jbGFzc2VzL1BvdFwiO1xuaW1wb3J0IFBva2VyIGZyb20gXCIuLi9Qb2tlclwiO1xuaW1wb3J0IFNTRSBmcm9tIFwiLi4vU1NFXCI7XG5cbmNsYXNzIE1haW4gZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMudGFibGVfc3NlID0gbmV3IFNTRSh0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZVNTRVVybCk7XG4gICAgICAgIHRoaXMudXNlcl9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnVzZXJTU0VVcmwpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5sb2FkXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmRpc2Nvbm5lY3RCZWFjb24oKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCBcImJhY2tncm91bmRcIik7XG4gICAgICAgIHRoaXMubmV3SGFuZEJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDEwMCwgXCJuZXdcXG5oYW5kXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5uZXdIYW5kKTtcbiAgICAgICAgdGhpcy5kZWFsQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMjIwLCBcImRlYWxcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmRlYWwpO1xuICAgICAgICB0aGlzLmxlYXZlQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMzQwLCBcImxlYXZlXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5sZWF2ZVRhYmxlKTtcbiAgICAgICAgdGhpcy5iYkJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDQ2MCwgXCJCQlwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuYmIpO1xuICAgICAgICB0aGlzLnNiQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgNTgwLCBcIlNCXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5zYik7XG5cbiAgICAgICAgY29uc3QgbnVtU2VhdHMgPSAxMDsgICAgLy8gVE9ETyAtIE1ha2UgZHluYW1pY1xuICAgICAgICB0aGlzLmdhbWUucGxheWVycyA9IG5ldyBQbGF5ZXJNYW5hZ2VyKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnVzZXJJZCwgdGhpcy5nYW1lLmNvbmZpZy5zZWF0c1tudW1TZWF0c10pO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVycy5pbml0aWFsaXplKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5wbGF5ZXJzLCB0aGlzLmdhbWUuY29uZmlnLnNlYXRzW251bVNlYXRzXSk7XG5cbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkID0gbmV3IENhcmRNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5pbml0aWFsaXplKDUpO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmNlbnRlclggPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWDtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5jZW50ZXJZID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclk7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBvdCA9IG5ldyBQb3QodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgICAgICB0aGlzLmdhbWUucG90LnNwcml0ZS5jZW50ZXJYID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclg7XG4gICAgICAgIHRoaXMuZ2FtZS5wb3Quc3ByaXRlLmNlbnRlclkgPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWSAtIDE0MDtcblxuICAgICAgICAvLyBUT0RPIC0gVGhlc2Ugc2hvdWxkIGdvIHNvbWV3aGVyZSBlbHNlLiBNYXliZSBpbiBQb3Q/XG4gICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gMDtcblxuICAgICAgICB0aGlzLmdhbWUucGFuZWwgPSBuZXcgUGFuZWwodGhpcy5nYW1lLCBcInBhbmVsXCIpO1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuaW5pdGlhbGl6ZSgpO1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuZGlzcGxheUdyb3VwLnggPSB0aGlzLmdhbWUuY29uZmlnLnBhbmVsLnBvcy54O1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuZGlzcGxheUdyb3VwLnkgPSB0aGlzLmdhbWUuY29uZmlnLnBhbmVsLnBvcy55O1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuYWx3YXlzVmlzaWJsZSA9IHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5lbXVsYXRvckVuYWJsZWQ7XG5cbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluID0gbmV3IEJ1eUluTWFuYWdlcih0aGlzLmdhbWUsIFwiYnV5SW5cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbi5pbml0aWFsaXplKHRoaXMuZ2FtZS5jb25maWcuc2VhdHNbbnVtU2VhdHNdLCB0aGlzLmdhbWUucGxheWVycy5nZXRPY2N1cGllZFNlYXRzKCkpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcnMoKTtcblxuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld0hhbmRcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdIYW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucG90LnNldEFtb3VudCgwKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY2FyZHMucmVzZXQoKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNEZWFsZXI6IHBsYXllci5pZCA9PT0gZGF0YS5kZWFsZXIsXG4gICAgICAgICAgICAgICAgICAgIGlzTmV4dDogcGxheWVyLmlkID09PSBkYXRhLm5leHQsXG4gICAgICAgICAgICAgICAgICAgIHJvdW5kQmV0OiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImRlYWxcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkZWFsOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldChQb2tlci5nZXRNaW5CZXQodGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5lbXVsYXRvckVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiZW11bGF0ZURlYWxcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVtdWxhdGVEZWFsOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXJEYXRhID0gZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChwbGF5ZXJEYXRhLnBsYXllcklkKS5jYXJkcy5zZXRDYXJkTmFtZXMocGxheWVyRGF0YS5ob2xkaW5ncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdSb3VuZFwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1JvdW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXS51cGRhdGUoe3JvdW5kQmV0OiAwfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJhY3Rpb25cIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhY3Rpb246IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5zZXRDYXJkTmFtZXMoZGF0YS5ib2FyZCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLnBsYXllcklkKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgIGJhbGFuY2U6IGRhdGEucGxheWVyQmFsYW5jZSxcbiAgICAgICAgICAgICAgICBpc05leHQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJvdW5kQmV0OiBkYXRhLnBsYXllclJvdW5kQmV0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KS51cGRhdGUoe2lzTmV4dDogdHJ1ZX0pO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBvdC5zZXRBbW91bnQoZGF0YS5wb3QpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gZGF0YS5yb3VuZEJldDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gZGF0YS5yb3VuZFJhaXNlO1xuXG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KFBva2VyLmdldE1pbkJldCh0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImhhbmRDb21wbGV0ZVwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImhhbmRDb21wbGV0ZTogXCIsIGRhdGEpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLndpbm5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgd2lubmVyID0gZGF0YS53aW5uZXJzW2ldO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQod2lubmVyLmlkKS51cGRhdGUoe2JhbGFuY2U6IHdpbm5lci5iYWxhbmNlfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1BsYXllclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3UGxheWVyOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXdQbGF5ZXIoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4ubmV3UGxheWVyKGRhdGEpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJwbGF5ZXJMZWZ0XCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwbGF5ZXJMZWZ0OiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJMZWZ0KGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnBsYXllckxlZnQoZGF0YSk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlLmFkZExpc3RlbmVyKFwiZGVhbFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVhbDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5jYXJkcy5zZXRDYXJkTmFtZXMoZGF0YS5ob2xkaW5ncyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwucHJpbWFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNlY29uZGFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnRlcnRpYXJ5Q2xpY2tlZC5hZGQodGhpcy5oYW5kbGVBY3Rpb24sIHRoaXMpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uYnV5SW5SZXF1ZXN0ZWQuYWRkKHRoaXMuZ2FtZS5jb250cm9sbGVyLmpvaW4sIHRoaXMuZ2FtZS5jb250cm9sbGVyKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJvdXRlIGFjdGlvbnMgdG8gY29udHJvbGxlciByZXF1ZXN0c1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY3Rpb24gLSBUaGUgYWN0aW9uIHRvIGJlIHJlcXVlc3RlZCwgZGVmaW5lZCBpbiBBY3Rpb24uanNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmV0IC0gVGhlIGJldCAoaWYgYW55KSB0byBiZSBzZW50IHRvIHRoZSBjb250cm9sbGVyXG4gICAgICovXG4gICAgaGFuZGxlQWN0aW9uKGFjdGlvbiwgYmV0KSB7XG4gICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5GT0xEOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmZvbGQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQWN0aW9uLkNIRUNLOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5CRVQ6XG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuYmV0KGJldCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkludmFsaWQgQWN0aW9uIFR5cGU6IFwiICsgYWN0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcblxuICAgIH1cblxuICAgIG1ha2VCdG4oeCwgeSwgdGV4dCwgdGV4dHVyZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ0biA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKHgsIHksIHRleHR1cmUsIGNhbGxiYWNrLCB0aGlzKTtcbiAgICAgICAgYnRuLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIGxldCBidG5UZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDAsIHRleHQpO1xuICAgICAgICBidG5UZXh0LmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICBidG4uYWRkQ2hpbGQoYnRuVGV4dCk7XG4gICAgICAgIGJ0bi50ZXh0ID0gYnRuVGV4dDtcblxuICAgICAgICByZXR1cm4gYnRuO1xuICAgIH1cblxuICAgIGRlYWwoKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL3RhYmxlcy8nICsgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlTmFtZSArICcvZGVhbC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgbmV3SGFuZCgpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignUE9TVCcsICcvdGFibGVzLycgKyB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVOYW1lICsgJy9uZXctaGFuZC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfTtcblxuICAgIGxlYXZlVGFibGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmxlYXZlKCk7XG4gICAgfVxuXG4gICAgYmIoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmJiKCk7XG4gICAgfTtcblxuICAgIHNiKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5zYigpO1xuICAgIH07XG5cbiAgICBnZW5lcmF0ZUJldHMocGxheWVyUm91bmRCZXQsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIFBva2VyLmdlbmVyYXRlQmV0cygyNSwgNTAsIHRoaXMuZ2FtZS5yb3VuZEJldCwgcGxheWVyUm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1haW47Il19
