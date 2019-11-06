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

            this.display.modal = this.game.add.image(modalConfig.x, modalConfig.y, this.key, "modal");
            this.displayGroup.addChild(this.display.modal);
            this.display.modal.visible = this.modalVisible;

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

            this.display.cancel = new _Button2.default(this.game, 15, 145, this.key, this.cancel, this);
            this.display.cancel.setFrames("btn_secondary_over", "btn_secondary_out", "btn_secondary_down", "btn_secondary_up");
            this.display.cancel.setTextStyle(btnTextStyle);
            this.display.cancel.setText("CANCEL");
            this.display.modal.addChild(this.display.cancel);

            this.display.submit = new _Button2.default(this.game, 155, 145, this.key, this.submit, this);
            this.display.submit.setFrames("btn_primary_over", "btn_primary_out", "btn_primary_down", "btn_primary_up");
            this.display.submit.setTextStyle(btnTextStyle);
            this.display.submit.setText("BUY IN");
            this.display.modal.addChild(this.display.submit);

            // TODO - Remove
            this.display.modal.inputEnabled = true;
            this.display.modal.input.enableDrag();
            console.log(this.display.inputField);
            this.display.inputField.focusIn.add(function () {
                return console.log("focus in");
            });
            this.display.inputField.focusOut.add(function () {
                return console.log("focus out");
            });

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
            this.game.buyIn.initialize(this.game.config.seats[numSeats], this.game.players.getOccupiedSeats(), this.game.config.buyInModal);

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

},{"../Poker":2,"../SSE":3,"../classes/Action.js":5,"../classes/Panel":9,"../classes/Pot":11,"../managers/BuyInManager":14,"../managers/CardManager":15,"../managers/PlayerManager":16}]},{},[1,17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NvbnRyb2xsZXIuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGFuZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGxheWVyLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BvdC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9TbGlkZXIuanMiLCJzdGF0aWMvc3JjL2NvbmZpZy5qc29uIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9CdXlJbk1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL0NhcmRNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9QbGF5ZXJNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9wb2x5ZmlsbHMvc2VuZGJlYWNvbi5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL0Jvb3QuanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Mb2FkLmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTSxJOzs7QUFDRixvQkFBYztBQUFBOztBQUFBLGdIQUNKO0FBQ0YsbUJBQU8sSUFETDtBQUVGLG9CQUFRO0FBRk4sU0FESTs7QUFNVixjQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBZixFQUF1QixjQUF2QixFQUE2QixLQUE3QjtBQUNBLGNBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLGNBQXZCLEVB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O0FBQ0QsaUJBQUssSUFBTCxDQUFVLFVBQVYsQ0FBcUIsRUFBckI7QUFDSDs7OzZCQUVJO0FBQ0QsaUJBQUssSUFBTCxDQUFVLFVBQVYsQ0FBcUIsRUFBckI7QUFDSDs7O3FDQUVZLGMsRUFBZ0IsYSxFQUFlO0FBQ3hDLG1CQUFPLGdCQUFNLFlBQU4sQ0FBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkIsS0FBSyxJQUFMLENBQVUsUUFBckMsRUFBK0MsY0FBL0MsRUFBK0QsS0FBSyxJQUFMLENBQVUsVUFBekUsRUFBcUYsYUFBckYsQ0FBUDtBQUNIOzs7O0VBNU5jLE9BQU8sSzs7a0JBK05YLEkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgQm9vdCBmcm9tIFwiLi9zdGF0ZXMvQm9vdFwiO1xuaW1wb3J0IExvYWQgZnJvbSBcIi4vc3RhdGVzL0xvYWRcIjtcbmltcG9ydCBNYWluIGZyb20gXCIuL3N0YXRlcy9NYWluXCI7XG5cbmNsYXNzIEdhbWUgZXh0ZW5kcyBQaGFzZXIuR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKHtcbiAgICAgICAgICAgIHdpZHRoOiAxOTIwLFxuICAgICAgICAgICAgaGVpZ2h0OiAxMDgwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkKFwiYm9vdFwiLCBCb290LCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc3RhdGUuYWRkKFwibG9hZFwiLCBMb2FkLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc3RhdGUuYWRkKFwibWFpblwiLCBNYWluLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5zdGFydChcImJvb3RcIik7XG4gICAgfVxufVxuXG5uZXcgR2FtZSgpOyIsIi8qKlxuICogQHN1bW1hcnkgQSB1dGlsaXR5IGNsYXNzIG9mIFBva2VyLXNwZWNpZmljIGZ1bmN0aW9uYWxpdHlcbiAqL1xuY2xhc3MgUG9rZXIge1xuICAgIC8vIFRPRE8gLSBUaGlzIHV0aWxpdHkgaXMgaGlnaGx5LXNwZWNpZmljIHRvIE5MIGdhbWVzLCBtYXliZSBldmVuIHRvIE5MSEUuXG4gICAgLy8gIE5lZWQgdG8gbWFrZSBpdCBtb3JlIGdlbmVyaWMgZXZlbnR1YWxseSB0byBhbGxvdyBmb3Igb3RoZXIgZ2FtZVxuICAgIC8vICB0eXBlcy4gTGltaXQgYW5kIHBvdC1saW1pdCBnYW1lcyB3aWxsIHdvcmsgY29tcGxldGVseSBkaWZmZXJlbnRseS5cbiAgICAvLyAgQW50ZXMgYXJlIGFsc28gbm90IHN1cHBvcnRlZC5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdlbmVyYXRlIGFsbCBsZWdhbCByYWlzZXMgZm9yIHBsYXllclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzbWFsbEJsaW5kIC0gVGhlIHNtYWxsIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119IC0gVGhlIHZhbGlkIHJhaXNlc1xuICAgICAqL1xuICAgIHN0YXRpYyBnZW5lcmF0ZVJhaXNlcyhzbWFsbEJsaW5kLCBiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IHJhaXNlID0gUG9rZXIuZ2V0TWluUmFpc2UoYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICAgICAgbGV0IHJhaXNlcyA9IFtyYWlzZV07XG5cbiAgICAgICAgd2hpbGUgKHJhaXNlICsgc21hbGxCbGluZCA8PSBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgICAgICByYWlzZSArPSBzbWFsbEJsaW5kO1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocmFpc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJhaXNlIDwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocGxheWVyQmFsYW5jZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmFpc2VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgYmV0IGZvciBwbGF5ZXJcbiAgICAgKlxuICAgICAqIElmIG5vIGJldHMgaGF2ZSBvY2N1cnJlZCBpbiBjdXJyZW50IHJvdW5kLCB0aGUgbWluIGJldCBpcyBhXG4gICAgICogY2hlY2sgKGJldCBvZiAwKSwgb3RoZXJ3aXNlIGl0J3MgYSBjYWxsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5CZXQocm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCBtaW5CZXQgPSByb3VuZEJldCA9PT0gMCA/IDAgOiByb3VuZEJldCAtIHBsYXllclJvdW5kQmV0O1xuICAgICAgICBpZiAocGxheWVyQmFsYW5jZSA8IG1pbkJldCkge1xuICAgICAgICAgICAgbWluQmV0ID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluQmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgcmFpc2UgZm9yIHBsYXllclxuICAgICAqXG4gICAgICogTk9URTogQSByYWlzZSBoZXJlIG1heSBhY3R1YWxseSBtZWFuIGEgYmV0IGluIHBva2VyIHRlcm1zLiBJbiB0aGVcbiAgICAgKiBwYXJsYW5jZSBvZiB0aGlzIHV0aWxpdHksIGEgcmFpc2UgaXMgYW4gYWdncmVzc2l2ZSBhY3Rpb24sIG9yIHNvbWV0aGluZ1xuICAgICAqIHdoaWNoIHdvdWxkIGZvcmNlIG90aGVyIHBsYXllcnMgdG8gY29udHJpYnV0ZSBtb3JlIHRvIHRoZSBwb3QgdGhhblxuICAgICAqIHRoZSBvdGhlcndpc2Ugd291bGQgaGF2ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5SYWlzZShiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IG1pblJhaXNlID0gcm91bmRCZXQgPT09IDAgPyBiaWdCbGluZCA6IHJvdW5kQmV0IC0gcGxheWVyUm91bmRCZXQgKyBwcmV2UmFpc2U7XG4gICAgICAgIGlmIChwbGF5ZXJCYWxhbmNlIDwgbWluUmFpc2UpIHtcbiAgICAgICAgICAgIG1pblJhaXNlID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluUmFpc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb2tlcjsiLCJjbGFzcyBTU0Uge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVybCkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodGhpcy51cmwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJlIGFkZHMgYWxsIGxpc3RlbmVycyB0byB0aGlzLnNvdXJjZVxuICAgICAqXG4gICAgICogSSBvcmlnaW5hbGx5IHdyb3RlIHRoaXMgdG8gc3VwcG9ydCBjbGllbnQgcmVjb25uZWN0cywgYnV0IEkgZG9uJ3QgbmVlZFxuICAgICAqIHRoYXQgYW55bW9yZS4gS2VlcGluZyB0aGUgbGlzdGVuZXIgY29kZSBqdXN0IGluIGNhc2UuXG4gICAgICovXG4gICAgcmVBZGRBbGxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycztcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobGlzdGVuZXIudHlwZSwgbGlzdGVuZXIuY2FsbGJhY2ssIGxpc3RlbmVyLmNhbGxiYWNrQ29udGV4dCwgLi4ubGlzdGVuZXIuYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIFN0b3JlIGxpc3RlbmVycyBmb3IgZXZlbnR1YWwgcmVjb25uZWN0XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgICAgXCJ0eXBlXCI6IHR5cGUsXG4gICAgICAgICAgICBcImNhbGxiYWNrXCI6IGNhbGxiYWNrLFxuICAgICAgICAgICAgXCJjYWxsYmFja0NvbnRleHRcIjogY2FsbGJhY2tDb250ZXh0LFxuICAgICAgICAgICAgXCJhcmdzXCI6IGFyZ3NcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU1NFOyIsImNsYXNzIFV0aWwge1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJldHVybiBhIGZvcm1hdHRlZCBjdXJyZW5jeSBzdHJpbmcgZnJvbSBhbiBpbnRlZ2VyXG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlQ3VycmVuY3koaW50KSB7XG4gICAgICAgIGxldCB2YWwgPSBpbnQgLyAxMDA7XG4gICAgICAgIHJldHVybiBcIiRcIiArIHZhbC50b0ZpeGVkKDIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXRpbDsiLCJjb25zdCBBY3Rpb24gPSB7XG4gICAgQkxJTkQ6IDAsXG4gICAgRk9MRDogMSxcbiAgICBDSEVDSzogMixcbiAgICBCRVQ6IDNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFjdGlvbjsiLCIvKipcbiAqIEEgUGhhc2VyLkJ1dHRvbiB3aXRoIGEgUGhhc2VyLlRleHQgY2VudGVyZWQgb24gdGhlIGJ1dHRvblxuICpcbiAqIFRoaXMgY2xhc3MgaXMgbWVyZWx5IGEgdGhpbiB3cmFwcGVyIGFyb3VuZCBQaGFzZXIuQnV0dG9uIHRvIGFsbG93IGZvclxuICogZWFzeSB1c2Ugb2YgYSB0ZXh0IGxhYmVsIG9uIHRoZSBidXR0b24uIFRoZSB0ZXh0IGlzIGEgY2hpbGQgb2YgdGhlIGJ1dHRvbixcbiAqIHNvIGl0IG1vdmVzIHdoZW4gdGhlIGJ1dHRvbiBtb3Zlcy4gSXQncyBjZW50ZXJlZCBvbiB0aGUgYnV0dG9uIGFuZCBzY2FsZXNcbiAqIGF1dG9tYXRpY2FsbHkgdG8gZml4IHdpdGhpbiB0aGUgYnV0dG9uJ3MgYm91bmRzLlxuICpcbiAqIElmIG5vbmUgb2YgdGhlIGxhYmVsIGZ1bmN0aW9uYWxpdHkgaXMgdXNlZCwgdGhpcyBjbGFzcyBpcyBpZGVudGljYWwgdG9cbiAqIFBoYXNlci5CdXR0b24uXG4gKi9cbmNsYXNzIEJ1dHRvbiBleHRlbmRzIFBoYXNlci5CdXR0b24ge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGtleSwgY2FsbGJhY2ssIGNhbGxiYWNrY29udGV4dCwgb3ZlckZyYW1lLCBvdXRGcmFtZSwgZG93bkZyYW1lLCB1cEZyYW1lKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSwgY2FsbGJhY2ssIGNhbGxiYWNrY29udGV4dCwgb3ZlckZyYW1lLCBvdXRGcmFtZSwgZG93bkZyYW1lLCB1cEZyYW1lKTtcblxuICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhYmVsUGFkZGluZyA9IDEwO1xuICAgICAgICB0aGlzLmxhYmVsVGV4dCA9IFwiXCI7XG4gICAgICAgIHRoaXMubGFiZWxTdHlsZSA9IHt9O1xuICAgICAgICB0aGlzLmxhYmVsID0gbmV3IFBoYXNlci5UZXh0KHRoaXMuZ2FtZSwgMCwgMCwgdGhpcy5sYWJlbFRleHQpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMubGFiZWwpO1xuXG4gICAgICAgIC8vIE11c3QgYWRkIHRvIGdhbWUgd29ybGQgbWFudWFsbHkgaWYgbm90IHVzaW5nIGdhbWUuYWRkLmJ1dHRvblxuICAgICAgICB0aGlzLmdhbWUud29ybGQuYWRkKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgdGV4dCBkaXNwbGF5ZWQgb24gdGhlIGJ1dHRvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gZGlzcGxheVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSBkaXNwbGF5IHVwZGF0ZSBkZXNwaXRlIG9mIHRoaXMuZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRUZXh0KHRleHQsIGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5sYWJlbFRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHN0eWxlIGZvciB0aGUgYnV0dG9uIHRleHRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgLSBUaGUgdGV4dCBzdHlsZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0VGV4dFN0eWxlKHN0eWxlLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxTdHlsZSA9IHN0eWxlO1xuICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHBhZGRpbmcgYmV0d2VlbiB0aGUgdGV4dCBhbmQgdGhlIGJ1dHRvbiBwZXJpbWV0ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFkZGluZyAtIFRoZSBwYWRkaW5nIGluIHBpeGVsc1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSBkaXNwbGF5IHVwZGF0ZSBkZXNwaXRlIG9mIHRoaXMuZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRQYWRkaW5nKHBhZGRpbmcsIGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSBwYWRkaW5nO1xuICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSB0aGUgYnV0dG9uXG4gICAgICogT24gZGlzYWJsZSwgZGlzYWJsZXMgYWxsIGlucHV0IHRvIHRoZSBidXR0b24gYW5kIHJlbmRlcnMgaXQgZ3JheWVkXG4gICAgICogb3V0LiBBbGwgdXBkYXRlcyBhcmUgZGVsYXllZCB1bnRpbCByZS1lbmFibGUsIHVubGVzcyBmb3JjZWQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gRW5hYmxlIG9yIGRpc2FibGUgYnV0dG9uP1xuICAgICAqL1xuICAgIHNldEVuYWJsZWQoZW5hYmxlZCkge1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgIGxldCB0aW50ID0gZW5hYmxlZCA/IDB4RkZGRkZGIDogMHg4MDgwODA7XG4gICAgICAgIHRoaXMudGludCA9IHRpbnQ7XG4gICAgICAgIHRoaXMubGFiZWwudGludCA9IHRpbnQ7XG5cbiAgICAgICAgLy8gVXBkYXRlIG9uIHJlLWVuYWJsZVxuICAgICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVMYWJlbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVXBkYXRlIGFsbCBidXR0b24gYXR0cmlidXRlcyB0byBjdXJyZW50IHByb3BlcnRpZXNcbiAgICAgKlxuICAgICAqIElmIHRoZSBidXR0b24gaXMgZGlzYWJsZWQsIHRoaXMgd2lsbCBoYXZlIG5vIGVmZmVjdC4gVGhlXG4gICAgICogZGV2ZWxvcGVyIG1heSBvcHRpb25hbGx5IGNob29zZSB0byBmb3JjZSB0aGUgdXBkYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIHRoZSB1cGRhdGU/XG4gICAgICovXG4gICAgdXBkYXRlTGFiZWwoZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICBpZiAodGhpcy5lbmFibGVkIHx8IGZvcmNlKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnRleHQgPSB0aGlzLmxhYmVsVGV4dDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2V0U3R5bGUodGhpcy5sYWJlbFN0eWxlKTtcbiAgICAgICAgICAgIHRoaXMucmVQb3NMYWJlbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2NhbGUgbGFiZWwgdGV4dCB0byBmaXQgb24gYnV0dG9uIGFuZCBjZW50ZXJcbiAgICAgKi9cbiAgICByZVBvc0xhYmVsKCkge1xuICAgICAgICB0aGlzLmxhYmVsLnNjYWxlLnNldFRvKDEpO1xuICAgICAgICBjb25zdCB0ZXh0QXJlYUggPSB0aGlzLndpZHRoIC0gdGhpcy5sYWJlbFBhZGRpbmcgKiAyO1xuICAgICAgICBjb25zdCB0ZXh0QXJlYVYgPSB0aGlzLmhlaWdodCAtIHRoaXMubGFiZWxQYWRkaW5nICogMjtcbiAgICAgICAgaWYgKHRoaXMubGFiZWwud2lkdGggPiB0ZXh0QXJlYUggfHwgdGhpcy5sYWJlbC5oZWlnaHQgPiB0ZXh0QXJlYVYpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlZHVjZWRTY2FsZUggPSB0ZXh0QXJlYUggLyB0aGlzLmxhYmVsLndpZHRoO1xuICAgICAgICAgICAgY29uc3QgcmVkdWNlZFNjYWxlViA9IHRleHRBcmVhViAvIHRoaXMubGFiZWwuaGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5zY2FsZS5zZXRUbyhNYXRoLm1pbihyZWR1Y2VkU2NhbGVILCByZWR1Y2VkU2NhbGVWKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYWJlbC5jZW50ZXJYID0gdGhpcy53aWR0aCAvIDI7XG4gICAgICAgIHRoaXMubGFiZWwuY2VudGVyWSA9IHRoaXMuaGVpZ2h0IC8gMjtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnV0dG9uOyIsImNsYXNzIENhcmQge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIG1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDsgICAvLyBTdHJpbmcgSUQgb2YgY2FyZCwgZS5nLiAnS2gnIG9yICc3cydcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBudWxsO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoZGF0YSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgXCJjYXJkc1wiKTtcbiAgICAgICAgdGhpcy5zcHJpdGUuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuc3ByaXRlLnNjYWxlLnNldFRvKDEuNSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUuZnJhbWVOYW1lID0gdGhpcy5uYW1lID8gdGhpcy5uYW1lIDogXCJiYWNrXCI7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXJkOyIsImNsYXNzIENvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHBsYXllcklkLCB0b2tlbikge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnBsYXllcklkID0gcGxheWVySWQ7XG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIGFjY2VzcyB0b2tlbiB1c2VkIHRvIGF1dGhlbnRpY2F0ZSBvbiBBUEkgY2FsbHNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUaGUgRmxhc2stSldULUV4dGVuZGVkIGFjY2VzcyB0b2tlblxuICAgICAqL1xuICAgIHNldFRva2VuKHRva2VuKSB7XG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgICpcbiAgICAgKiBPbmx5IGVycm9ycyBhcmUgcmVwb3J0ZWQuIFN1Y2Nlc3MgaXMgc2lsZW50LiBHYW1lIGNoYW5nZXMgcmVzdWx0aW5nXG4gICAgICogZnJvbSByZXF1ZXN0cyBhcmUgaGFuZGxlZCB2aWEgU2VydmVyIFNlbnQgRXZlbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVuZHBvaW50IC0gVGhlIGVuZHBvaW50IG9uIHRoZSBzZXJ2ZXIgdG8gc2VuZCByZXF1ZXN0IHRvXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgLSBUaGUgcGF5bG9hZCB0byBzZW5kXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFttZXRob2Q9XCJQT1NUXSAtIFRoZSBIVFRQIG1ldGhvZCB0byB1c2VcbiAgICAgKi9cbiAgICBzZW5kUmVxdWVzdChlbmRwb2ludCwgZGF0YSwgbWV0aG9kID0gXCJQT1NUXCIpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbihtZXRob2QsIGVuZHBvaW50KTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCAmJiB4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzcCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgLy8gSW52YWxpZCByZXF1ZXN0IGVycm9yXG4gICAgICAgICAgICAgICAgaWYgKHJlc3Auc3VjY2VzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKHJlc3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRmFpbGVkIHJlcXVlc3QgZXJyb3JcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyB0aGlzLnRva2VuKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYW4gYWN0aW9uIHJlcXVlc3RcbiAgICAgKlxuICAgICAqIFRoaXMgaXMgdGhlIG1vc3QgaGVhdmlseS11c2VkIHJlcXVlc3QgdHlwZSBpbiB0aGUgZ2FtZS4gQWxsIGluLWdhbWVcbiAgICAgKiBhY3Rpb25zIChiZXQsIGNoZWNrLCBmb2xkKSBoYXBwZW4gaGVyZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gVGhlIHBheWxvYWQgdG8gc2VuZFxuICAgICAqL1xuICAgIGFjdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJhY3Rpb25cIik7XG4gICAgICAgIHRoaXMuc2VuZFJlcXVlc3QodXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBjaGVjaygpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQ0hFQ0tcIik7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGJldChhbXQpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkVUXCIsIGFtdCk7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGZvbGQoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkZPTERcIik7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGJiKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJCTElORFwiLCA1MCk7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIHNiKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJCTElORFwiLCAyNSk7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGpvaW4oc2VhdE51bSwgYnV5SW4pIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcInBvc2l0aW9uXCI6IHNlYXROdW0sIFwiYW1vdW50XCI6IGJ1eUlufTtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImpvaW5cIik7XG4gICAgICAgIHRoaXMuc2VuZFJlcXVlc3QodXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBsZWF2ZSgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwibGVhdmVcIik7XG4gICAgICAgIHRoaXMuc2VuZFJlcXVlc3QodXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGEgYmVhY29uIHRvIHRoZSBzZXJ2ZXIgb24gZGlzY29ubmVjdFxuICAgICAqXG4gICAgICogVGhpcyBhbGxvd3MgZm9yIHNlcnZlciB0byBrbm93IHdoZW4gYSBjbGllbnQgZGlzY29ubmVjdHMgc29cbiAgICAgKiBpdCBjYW4gY2xlYW4gdXAgYXMgbmVjZXNzYXJ5LiBObyBndWFyYW50ZWUgdGhhdCB0aGlzIG1lc3NhZ2VcbiAgICAgKiB3aWxsIGdvIHRocm91Z2gsIHNvIG11c3QgaGF2ZSByZWR1bmRhbnQgbWVhc3VyZXMgaW4gcGxhY2UuXG4gICAgICovXG4gICAgZGlzY29ubmVjdEJlYWNvbigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICBjb25zdCB1cmwgPSBcIi9kaXNjb25uZWN0L1wiO1xuICAgICAgICBuYXZpZ2F0b3Iuc2VuZEJlYWNvbih1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGJ1aWxkUGF5bG9hZChhY3Rpb25UeXBlLCBiZXRBbXQgPSAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcInBsYXllcklkXCI6IHRoaXMucGxheWVySWQsXG4gICAgICAgICAgICBcImFjdGlvblR5cGVcIjogYWN0aW9uVHlwZSxcbiAgICAgICAgICAgIFwiYmV0QW10XCI6IGJldEFtdFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYnVpbGRVcmwoZW5kcG9pbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZVVybCArIGVuZHBvaW50ICsgXCIvXCI7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250cm9sbGVyOyIsImltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCIuL0J1dHRvblwiO1xuaW1wb3J0IFNsaWRlciBmcm9tIFwiLi9TbGlkZXJcIjtcbmltcG9ydCBBY3Rpb24gZnJvbSBcIi4vQWN0aW9uXCI7XG5cbmNsYXNzIFBhbmVsIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXkpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuYmV0cyA9IFswXTtcbiAgICAgICAgdGhpcy5wcmltYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMucHJpbWFyeUFjdGlvbiA9IEFjdGlvbi5CRVQ7XG4gICAgICAgIHRoaXMucHJpbWFyeUJldCA9IDA7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QWN0aW9uID0gQWN0aW9uLkNIRUNLO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUJldCA9IDA7XG4gICAgICAgIHRoaXMudGVydGlhcnlDbGlja2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy50ZXJ0aWFyeUFjdGlvbiA9IEFjdGlvbi5GT0xEO1xuICAgICAgICB0aGlzLnNsaWRlciA9IG5ldyBTbGlkZXIodGhpcy5nYW1lLCBcInBhbmVsXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7fTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFsd2F5c1Zpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeSA9IHRoaXMubWFrZUJ1dHRvbigwLCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnByaW1hcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMucHJpbWFyeUFjdGlvbiwgdGhpcy5wcmltYXJ5QmV0KSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zZWNvbmRhcnkgPSB0aGlzLm1ha2VCdXR0b24oMTM1LCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnNlY29uZGFyeUNsaWNrZWQuZGlzcGF0Y2godGhpcy5zZWNvbmRhcnlBY3Rpb24sIHRoaXMuc2Vjb25kYXJ5QmV0KSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXJ0aWFyeSA9IHRoaXMubWFrZUJ1dHRvbigyNzAsIDAsIFwibWVkXCIsICgpID0+IHRoaXMudGVydGlhcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMudGVydGlhcnlBY3Rpb24sIDApKTtcblxuICAgICAgICB0aGlzLnNsaWRlci5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgICAgICB0aGlzLnNsaWRlci5pbmRleENoYW5nZWQuYWRkKChpbmRleCkgPT4gdGhpcy5zZXRQcmltYXJ5QmV0KHRoaXMuYmV0c1tpbmRleF0pLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2xpZGVyV2hlZWwuYWRkKHRoaXMuc2luZ2xlU3RlcEJldCwgdGhpcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zbGlkZXIgPSB0aGlzLnNsaWRlci5iYXI7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zbGlkZXIueSA9IDYwO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkucHJpbWFyeSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS50ZXJ0aWFyeSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuc2xpZGVyKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBtYWtlQnV0dG9uKHgsIHksIHNpemUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBidXR0b24gPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgeCwgeSwgdGhpcy5rZXkpO1xuICAgICAgICBidXR0b24ub25JbnB1dFVwLmFkZChjYWxsYmFjayk7XG4gICAgICAgIGJ1dHRvbi5zZXRGcmFtZXMoXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9vdmVyXCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9vdXRcIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX2Rvd25cIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX3VwXCJcbiAgICAgICAgKTtcbiAgICAgICAgYnV0dG9uLnNldFRleHRTdHlsZSh0aGlzLmdhbWUuY29uZmlnLnBhbmVsLnRleHRTdHlsZSk7XG4gICAgICAgIHJldHVybiBidXR0b247XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgLy8gUGFuZWwgdXBkYXRlcyByZXF1aXJlIHBsYXllcnMnIGN1cnJlbnQgYmV0cywgc28gaWZcbiAgICAgICAgLy8gdGhlcmUgaXMgbm8gbmV4dCBwbGF5ZXIgd2Ugc2hvdWxkbid0IHVwZGF0ZSB0aGUgZGlzcGxheVxuICAgICAgICBpZiAoIXRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhY3Rpb25UZXh0ID0gdGhpcy5nYW1lLnJvdW5kQmV0ID09PSAwID8gXCJCRVQgXCIgOiBcIlJBSVNFIFRPXFxuXCI7XG4gICAgICAgIGxldCBwcmltYXJ5VGV4dCA9IGFjdGlvblRleHQgKyBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5wcmltYXJ5QmV0ICsgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5wcmltYXJ5LnNldFRleHQocHJpbWFyeVRleHQpO1xuXG4gICAgICAgIGxldCBzZWNvbmRhcnlUZXh0ID0gXCJDSEVDS1wiO1xuICAgICAgICBpZiAodGhpcy5zZWNvbmRhcnlBY3Rpb24gIT09IEFjdGlvbi5DSEVDSykge1xuICAgICAgICAgICAgc2Vjb25kYXJ5VGV4dCA9IFwiQ0FMTCBcIiArIFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLnNlY29uZGFyeUJldCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwbGF5LnNlY29uZGFyeS5zZXRUZXh0KHNlY29uZGFyeVRleHQpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXJ0aWFyeS5zZXRUZXh0KFwiRk9MRFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAudmlzaWJsZSA9IHRoaXMudmlzaWJsZTtcbiAgICB9XG5cbiAgICBzZXRCZXRzKGJldHMpIHtcbiAgICAgICAgaWYgKGJldHMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgYmV0cy4gUGFuZWwgbXVzdCBhbHdheXMgaGF2ZSBhdCBsZWFzdCBvbmUgdmFsaWQgYmV0LlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmV0cyA9IGJldHM7XG4gICAgICAgIHRoaXMucHJpbWFyeUJldCA9IGJldHNbMF07XG4gICAgICAgIHRoaXMuc2xpZGVyLnNldExlbmd0aChiZXRzLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNldEluZGV4KDApO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRFbmFibGVkKGJldHMubGVuZ3RoID4gMSk7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldFByaW1hcnlCZXQoYmV0KSB7XG4gICAgICAgIHRoaXMucHJpbWFyeUJldCA9IGJldDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc2V0U2Vjb25kYXJ5QmV0KGJldCkge1xuICAgICAgICB0aGlzLnNlY29uZGFyeUJldCA9IGJldDtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlBY3Rpb24gPSBiZXQgPT09IDAgPyBBY3Rpb24uQ0hFQ0sgOiBBY3Rpb24uQkVUO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBIaWRlIG9yIHNob3cgdGhlIGVudGlyZSBwYW5lbFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmlzaWJsZVxuICAgICAqL1xuICAgIHNldFZpc2libGUodmlzaWJsZSkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlIHx8IHRoaXMuYWx3YXlzVmlzaWJsZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSW5jcmVtZW50IG9yIGRlY3JlbWVudCB0aGlzLnByaW1hcnlCZXRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Nb3VzZS53aGVlbERlbHRhfSBtb2RpZmllciAtICsxIG9yIC0xXG4gICAgICovXG4gICAgc2luZ2xlU3RlcEJldChtb2RpZmllcikge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnNsaWRlci5pbmRleCArIG1vZGlmaWVyO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8PSB0aGlzLnNsaWRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyLnNldEluZGV4KGluZGV4KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFuZWw7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcbmltcG9ydCBDYXJkTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2FyZE1hbmFnZXJcIjtcblxuY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBtYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG5cbiAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlcklkID0gbnVsbDtcbiAgICAgICAgdGhpcy5iYWxhbmNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5zaXR0aW5nT3V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWF0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5yb3VuZEJldCA9IDA7ICAvLyBTdW0gYmV0cyBieSBwbGF5ZXIgaW4gY3VycmVudCBiZXR0aW5nIHJvdW5kXG5cbiAgICAgICAgdGhpcy5pc0RlYWxlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzTmV4dCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzVXNlciA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcblxuICAgICAgICB0aGlzLmNhcmRzID0gbmV3IENhcmRNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkYXRhLmlkO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IGRhdGEudXNlcklkO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuc2l0dGluZ091dCA9IGRhdGEuc2l0dGluZ091dDtcbiAgICAgICAgdGhpcy5zZWF0ID0gZGF0YS5zZWF0O1xuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZGF0YS5pc1VzZXI7XG5cbiAgICAgICAgdGhpcy5jYXJkcy5pbml0aWFsaXplKDIpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZCA9IHRoaXMuZGlzcGxheUdyb3VwLmNyZWF0ZSgwLCAwLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVSZWN0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhY2tncm91bmQuYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgLTIwLCBcIlwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkubmFtZSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMjAsIFwiXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5iYWxhbmNlKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMgPSB0aGlzLmNhcmRzLmRpc3BsYXlHcm91cDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLmNlbnRlclggPSAwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMuY2VudGVyWSA9IC0xMjA7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuY2FyZHMpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24gPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCBcImRlYWxlckJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbi5sZWZ0ID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQubGVmdCArIDU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24uYm90dG9tID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQuYm90dG9tIC0gNTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24pO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgXCJyZWRDaXJjbGVcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yLnJpZ2h0ID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQucmlnaHQgLSA1O1xuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvci5ib3R0b20gPSB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5ib3R0b20gLSA1O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnRleHQgPSB0aGlzLm5hbWU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLnRleHQgPSBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5iYWxhbmNlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbi52aXNpYmxlID0gdGhpcy5pc0RlYWxlciA9PT0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IudmlzaWJsZSA9IHRoaXMuaXNOZXh0ID09PSB0cnVlO1xuICAgIH1cblxuICAgIHVwZGF0ZShkYXRhKSB7XG4gICAgICAgIC8vIFRPRE8gLSBGbGVzaCBvdXQgdGhlIHJlc3Qgb2YgdGhlIGRhdGEgLS0gZG8gSSBsaWtlIHRoaXMgbWV0aG9kP1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2UgPT09IHVuZGVmaW5lZCA/IHRoaXMuYmFsYW5jZSA6IGRhdGEuYmFsYW5jZTtcbiAgICAgICAgdGhpcy5pc0RlYWxlciA9IGRhdGEuaXNEZWFsZXIgPT09IHVuZGVmaW5lZCA/IHRoaXMuaXNEZWFsZXIgOiBkYXRhLmlzRGVhbGVyO1xuICAgICAgICB0aGlzLmlzTmV4dCA9IGRhdGEuaXNOZXh0ID09PSB1bmRlZmluZWQgPyB0aGlzLmlzTmV4dCA6IGRhdGEuaXNOZXh0O1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gZGF0YS5yb3VuZEJldCA9PT0gdW5kZWZpbmVkID8gdGhpcy5yb3VuZEJldCA6IGRhdGEucm91bmRCZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyOyIsImltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5cbmNsYXNzIFBvdCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmFtb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSB0aGlzLm1ha2VCdG4oMCwgMCwgXCJcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlUmVjdCwgKCkgPT4ge30pO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZS50ZXh0LnRleHQgPSBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5hbW91bnQpO1xuICAgIH1cblxuICAgIHNldEFtb3VudChhbW91bnQpIHtcbiAgICAgICAgdGhpcy5hbW91bnQgPSBhbW91bnQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG1ha2VCdG4oeCwgeSwgdGV4dCwgdGV4dHVyZSwgY2FsbGJhY2ssIGNhbGxiYWNrQ29udGV4dCA9IHRoaXMpIHtcbiAgICAgICAgbGV0IGJ0biA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKHgsIHksIHRleHR1cmUsIGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQpO1xuICAgICAgICBidG4uYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgbGV0IGJ0blRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMCwgdGV4dCk7XG4gICAgICAgIGJ0blRleHQuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIGJ0bi5hZGRDaGlsZChidG5UZXh0KTtcbiAgICAgICAgYnRuLnRleHQgPSBidG5UZXh0O1xuXG4gICAgICAgIHJldHVybiBidG47XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb3Q7IiwiLyoqXG4gKiBBIHNsaWRlciBVSSBlbGVtZW50XG4gKlxuICogUmVwcmVzZW50ZWQgYnkgYSBiYXIgc3ByaXRlIGFuZCBhIG1hcmtlciBzcHJpdGUuIERlc3BpdGUgaG93IGl0IG1heVxuICogbG9vaywgYWxsIGlucHV0IG9jY3VycyBvbiB0aGUgYmFyIGFuZCB1cGRhdGVzIGFyZSBtYWRlIHRvIHRoZVxuICogbWFya2VyJ3MgcG9zaXRpb24gYmFzZWQgb24gdGhvc2UgaW5wdXRzLlxuICovXG5jbGFzcyBTbGlkZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5iYXIgPSBudWxsOyAgLy8gVGhlIHNsaWRlciBiYXIgc3ByaXRlXG4gICAgICAgIHRoaXMubWFya2VyID0gbnVsbDsgIC8vIFRoZSBkcmFnZ2FibGUgbWFya2VyIHNwcml0ZVxuICAgICAgICB0aGlzLmluZGV4ID0gMDsgIC8vIEN1cnJlbnQgaW5kZXggb2YgbWFya2VyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMTsgIC8vIFRvdGFsIG51bWJlciBvZiBpbmRpY2VzXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2xpZGVyV2hlZWwgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmJhciA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgdGhpcy5rZXksIFwic2xpZGVyX2JhclwiKTtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXREb3duLmFkZCh0aGlzLnN0YXJ0RHJhZywgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0VXAuYWRkKHRoaXMuc3RvcERyYWcsIHRoaXMpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dE92ZXIuYWRkKCgpID0+IHRoaXMuZW5hYmxlU2xpZGVyV2hlZWwodHJ1ZSkpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dE91dC5hZGQoKCkgPT4gdGhpcy5lbmFibGVTbGlkZXJXaGVlbChmYWxzZSkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyID0gdGhpcy5iYXI7XG5cbiAgICAgICAgdGhpcy5tYXJrZXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCB0aGlzLmtleSwgXCJzbGlkZXJfbWFya2VyXCIpO1xuICAgICAgICB0aGlzLm1hcmtlci5hbmNob3Iuc2V0VG8oMC41LCAwKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuYm90dG9tID0gdGhpcy5iYXIuYm90dG9tO1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyID0gdGhpcy5tYXJrZXI7XG4gICAgICAgIHRoaXMuYmFyLmFkZENoaWxkKHRoaXMubWFya2VyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgc2xpZGVyIGRyYWdnaW5nIGFuZCBpbml0aWF0ZSBmaXJzdCBkcmFnIGV2ZW50XG4gICAgICogQHBhcmFtIHtQaGFzZXIuU3ByaXRlfSBiYXIgLSBUaGUgYmFyIHNwcml0ZSB0aGF0IHdhcyBjbGlja2VkXG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBwb2ludGVyIHdoaWNoIGluaXRpYXRlZCB0aGUgY2xpY2tcbiAgICAgKi9cbiAgICBzdGFydERyYWcoYmFyLCBwb2ludGVyKSB7XG4gICAgICAgIC8vIEluaXRpYWwgY2FsbCB0byB1cGRhdGVEcmFnIGFsbG93cyBjaGFuZ2luZyBiZXQgd2l0aCBjbGljayBvbiBiYXJcbiAgICAgICAgdGhpcy51cGRhdGVEcmFnKHBvaW50ZXIsIHBvaW50ZXIueCwgcG9pbnRlci55KTtcbiAgICAgICAgdGhpcy5nYW1lLmlucHV0LmFkZE1vdmVDYWxsYmFjayh0aGlzLnVwZGF0ZURyYWcsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IERpc2FibGUgc2xpZGVyIGRyYWdnaW5nXG4gICAgICovXG4gICAgc3RvcERyYWcoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5kZWxldGVNb3ZlQ2FsbGJhY2sodGhpcy51cGRhdGVEcmFnLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBDYWxjdWxhdGUgc2xpZGVyIGluZGV4IGJhc2VkIG9uIGRyYWcgaW5wdXRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Qb2ludGVyfSBwb2ludGVyIC0gVGhlIHNsaWRpbmcgcG9pbnRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IC0gVGhlIHggY29vcmRpbmF0ZSBvZiBwb2ludGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSBUaGUgeSBjb29yZGluYXRlIG9mIHBvaW50ZXJcbiAgICAgKi9cbiAgICB1cGRhdGVEcmFnKHBvaW50ZXIsIHgsIHkpIHtcbiAgICAgICAgbGV0IGxvY2FsWCA9IHggLSB0aGlzLmJhci53b3JsZC54OyAgLy8gQ2xpY2sgcG9zIGluIHJlbGF0aW9uIHRvIGJhclxuXG4gICAgICAgIC8vIFByZXZlbnQgZHJhZ2dpbmcgcGFzdCBiYXIgYm91bmRzXG4gICAgICAgIGlmIChsb2NhbFggPCAwKSB7XG4gICAgICAgICAgICBsb2NhbFggPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGxvY2FsWCA+IHRoaXMuYmFyLndpZHRoKSB7XG4gICAgICAgICAgICBsb2NhbFggPSB0aGlzLmJhci53aWR0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN1YnRyYWN0IDEgZnJvbSBsZW5ndGggYmVjYXVzZSBsZW5ndGggaXMgMS1pbmRleGVkLCBpbmRpY2VzIGFyZSAwLWluZGV4ZWRcbiAgICAgICAgY29uc3QgaW5kZXggPSBNYXRoLnJvdW5kKGxvY2FsWCAvIHRoaXMuYmFyLndpZHRoICogKHRoaXMubGVuZ3RoIC0gMSkpO1xuICAgICAgICB0aGlzLnNldEluZGV4KGluZGV4KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIGluZGV4IG9mIHRoZSBzbGlkZXIgYW5kIHJlcG9ydCB0aGUgbmV3IHZhbHVlXG4gICAgICpcbiAgICAgKiBPcHRpb25hbGx5IHVwZGF0ZSB0aGUgdmlzdWFsIHBvc2l0aW9uIG9mIHRoZSBtYXJrZXIgb24gdGhlIHNsaWRlci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCAtIE5ldyBpbmRleCB0byBzZXQgb24gc2xpZGVyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdXBkYXRlUG9zPXRydWVdIC0gVXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBtYXJrZXI/XG4gICAgICovXG4gICAgc2V0SW5kZXgoaW5kZXgsIHVwZGF0ZVBvcyA9IHRydWUpIHtcbiAgICAgICAgaWYgKGluZGV4ICE9PSB0aGlzLmluZGV4KSB7XG4gICAgICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZC5kaXNwYXRjaChpbmRleCk7XG5cbiAgICAgICAgICAgIGlmICh1cGRhdGVQb3MpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiBvbmx5IG9uZSBiZXQgYXZhaWxhYmxlLCBpdCdzIGEgbWF4IGJldFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGg7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU3VidHJhY3QgMSBmcm9tIGxlbmd0aCBiZWNhdXNlIGxlbmd0aCBpcyAxLWluZGV4ZWQsIGluZGljZXMgYXJlIDAtaW5kZXhlZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gdGhpcy5iYXIud2lkdGggLyAodGhpcy5sZW5ndGggLSAxKSAqIHRoaXMuaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVXBkYXRlIHRoZSBsZW5ndGggcHJvcGVydHlcbiAgICAgKlxuICAgICAqIFRoZSBsZW5ndGggcHJvcGVydHkgZGVzY3JpYmVzIGhvdyBtYW55IGRpc2NyZXRlIGJldHMgdGhlIHNsaWRlciBiYXJcbiAgICAgKiBtdXN0IHJlcHJlc2VudC4gVGhlIHNsaWRlciBkb2VzIG5vdCBjYXJlIGFib3V0IHdoYXQgdGhlIHNwZWNpZmljIGJldFxuICAgICAqIGl0IHJlcHJlc2VudHMgaXMsIG9ubHkgdGhhdCBpdCBoYXMgc29tZSBudW1iZXIgb2YgaW5kaWNlcyBhbG9uZyBpdHNcbiAgICAgKiBsZW5ndGggYW5kIHRoYXQgaXQgbXVzdCByZXBvcnQgaXRzIGluZGV4IHRvIGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgbmV3IGxlbmd0aCB0byBzZXRcbiAgICAgKi9cbiAgICBzZXRMZW5ndGgobGVuZ3RoKSB7XG4gICAgICAgIGlmIChsZW5ndGggPD0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNhbm5vdCBzZXQgc2xpZGVyIGxlbmd0aCBsZXNzIHRoYW4gMVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmIChsZW5ndGggPiB0aGlzLmJhci53aWR0aCkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiV2FybmluZzogU2V0dGluZyBzbGlkZXIgc3RvcHMgZ3JlYXRlciB0aGFuIGxlbmd0aCBtYXkgcmVzdWx0IGluIHVuZXhwZWN0ZWQgYmVoYXZpb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIHNsaWRlclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIElzIHRoZSBzbGlkZXIgZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gZW5hYmxlZDtcblxuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyLnRpbnQgPSB0aW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIGRpc3BhdGNoIG9mIHNpZ25hbCBvbiB3aGVlbCBzY3JvbGxcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBJcyB0aGUgY2FsbGJhY2sgZW5hYmxlZCBvciBkaXNhYmxlZD9cbiAgICAgKi9cbiAgICBlbmFibGVTbGlkZXJXaGVlbChlbmFibGVkKSB7XG4gICAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQubW91c2UubW91c2VXaGVlbENhbGxiYWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVyV2hlZWwuZGlzcGF0Y2godGhpcy5nYW1lLmlucHV0Lm1vdXNlLndoZWVsRGVsdGEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS5tb3VzZVdoZWVsQ2FsbGJhY2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTbGlkZXI7IiwibW9kdWxlLmV4cG9ydHM9e1xuICBcInBhbmVsXCI6IHtcbiAgICBcInBhZGRpbmdcIjogMTAsXG4gICAgXCJ0ZXh0U3R5bGVcIjoge1xuICAgICAgXCJmb250XCI6IFwiYm9sZCAyMnB0IEFyaWFsXCIsXG4gICAgICBcImZpbGxcIjogXCJ3aGl0ZVwiLFxuICAgICAgXCJhbGlnblwiOiBcImNlbnRlclwiXG4gICAgfSxcbiAgICBcInBvc1wiOiB7XG4gICAgICBcInhcIjogMTQ4MCxcbiAgICAgIFwieVwiOiA3OTBcbiAgICB9XG4gIH0sXG4gIFwic2VhdHNcIjoge1xuICAgIFwiMTBcIjogW1xuICAgICAge1wieFwiOiA5MTAsIFwieVwiOiAyMzB9LFxuICAgICAge1wieFwiOiAxMjQ0LCBcInlcIjogMjMwfSxcbiAgICAgIHtcInhcIjogMTQ4NCwgXCJ5XCI6IDM0Nn0sXG4gICAgICB7XCJ4XCI6IDE0ODQsIFwieVwiOiA2NDJ9LFxuICAgICAge1wieFwiOiAxMjQ0LCBcInlcIjogNzU4fSxcbiAgICAgIHtcInhcIjogOTEwLCBcInlcIjogNzU4fSxcbiAgICAgIHtcInhcIjogNTc2LCBcInlcIjogNzU4fSxcbiAgICAgIHtcInhcIjogMzQyLCBcInlcIjogNjQyfSxcbiAgICAgIHtcInhcIjogMzQyLCBcInlcIjogMzQ2fSxcbiAgICAgIHtcInhcIjogNTc2LCBcInlcIjogMjMwfVxuICAgIF0sXG5cbiAgICAvLyBUT0RPXG4gICAgXCI4XCI6IFtdLFxuICAgIFwiOVwiOiBbXVxuICB9LFxuICBcImJ1eUluTW9kYWxcIjoge1xuICAgIFwieFwiOiA4MTAsXG4gICAgXCJ5XCI6IDQzMCxcbiAgICBcImlucHV0Qm94XCI6IHtcbiAgICAgIFwieFwiOiAxNSxcbiAgICAgIFwieVwiOiA4NlxuICAgIH0sXG4gICAgXCJpbnB1dEZpZWxkXCI6IHtcbiAgICAgIFwieFwiOiAzMCxcbiAgICAgIFwieVwiOiAtMlxuICAgIH0sXG4gICAgXCJjYW5jZWxCdXR0b25cIjoge1xuICAgICAgXCJ4XCI6IDE1LFxuICAgICAgXCJ5XCI6IDE0NVxuICAgIH0sXG4gICAgXCJzdWJtaXRCdXR0b25cIjoge1xuICAgICAgXCJ4XCI6IDE1NSxcbiAgICAgIFwieVwiOiAxNDVcbiAgICB9XG4gIH1cbn0iLCJpbXBvcnQgQnV0dG9uIGZyb20gXCIuLi9jbGFzc2VzL0J1dHRvblwiO1xuXG5jbGFzcyBCdXlJbk1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5idXlJblJlcXVlc3RlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2VhdHMgPSB7fTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7XCJidXR0b25zXCI6IFtdLCBcIm1vZGFsXCI6IG51bGwsIFwiaW5wdXRCb3hcIjogbnVsbH07XG4gICAgICAgIHRoaXMuYnV0dG9uc0dyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkQ2hpbGQodGhpcy5idXR0b25zR3JvdXApO1xuXG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZGF0YSA9IHtcInNlYXROdW1cIjogbnVsbCwgXCJidXlJblwiOiBudWxsfTtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZCAmJiB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZC52aXNpYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZC51cGRhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXRpYWxpemUoc2VhdENvbmZpZywgb2NjdXBpZWRTZWF0cywgbW9kYWxDb25maWcpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWF0Q29uZmlnLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYnV0dG9uID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIHNlYXRDb25maWdbaV0ueCwgc2VhdENvbmZpZ1tpXS55LCB0aGlzLmtleSwgdGhpcy5idXR0b25DbGlja2VkLCB0aGlzKTtcbiAgICAgICAgICAgIGJ1dHRvbi5zZWF0TnVtID0gaTsgLy8gU3RvcmUgZm9yIHVzZSBvbiBjbGlja1xuICAgICAgICAgICAgYnV0dG9uLnNldEZyYW1lcyhcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9vdmVyXCIsXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fb3V0XCIsXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fZG93blwiLFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX3VwXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBidXR0b24uc2V0VGV4dChcIkJ1eSBJblwiKTtcbiAgICAgICAgICAgIHRoaXMuc2VhdHNbaV0gPSB7XG4gICAgICAgICAgICAgICAgXCJidXR0b25cIjogYnV0dG9uLFxuICAgICAgICAgICAgICAgIFwib2NjdXBpZWRcIjogb2NjdXBpZWRTZWF0cy5pbmRleE9mKGkpICE9PSAtMVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5idXR0b25zLnB1c2goYnV0dG9uKTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uc0dyb3VwLmFkZChidXR0b24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnV0dG9uc0dyb3VwLnZpc2libGUgPSB0aGlzLmJ1dHRvbnNWaXNpYmxlO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UobW9kYWxDb25maWcueCwgbW9kYWxDb25maWcueSwgdGhpcy5rZXksIFwibW9kYWxcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZENoaWxkKHRoaXMuZGlzcGxheS5tb2RhbCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0Qm94ID0gdGhpcy5nYW1lLmFkZC5pbWFnZShtb2RhbENvbmZpZy5pbnB1dEJveC54LCBtb2RhbENvbmZpZy5pbnB1dEJveC55LCB0aGlzLmtleSwgXCJpbnB1dF9ib3hcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkuaW5wdXRCb3gpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkID0gdGhpcy5nYW1lLmFkZC5pbnB1dEZpZWxkKG1vZGFsQ29uZmlnLmlucHV0RmllbGQueCwgbW9kYWxDb25maWcuaW5wdXRGaWVsZC55LCB7XG4gICAgICAgICAgICBmb250OiAnMzJweCBBcmlhbCcsXG4gICAgICAgICAgICBmaWxsOiAnIzMzMzMzMycsXG4gICAgICAgICAgICB3aWR0aDogMjIwLFxuICAgICAgICAgICAgcGFkZGluZzogOCxcbiAgICAgICAgICAgIGJvcmRlcldpZHRoOiAwLFxuICAgICAgICAgICAgcGxhY2VIb2xkZXI6ICcyMC4wMCcsXG4gICAgICAgICAgICB0eXBlOiBQaGFzZXJJbnB1dC5JbnB1dFR5cGUubnVtYmVyLFxuICAgICAgICAgICAgZmlsbEFscGhhOiAwXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRCb3guYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmlucHV0RmllbGQpO1xuXG4gICAgICAgIGNvbnN0IGJ0blRleHRTdHlsZSA9IHtcbiAgICAgICAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgICAgICAgIFwiYWxpZ25cIjogXCJjZW50ZXJcIlxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwgPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgMTUsIDE0NSwgdGhpcy5rZXksIHRoaXMuY2FuY2VsLCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbC5zZXRGcmFtZXMoXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X291dFwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X2Rvd25cIixcbiAgICAgICAgICAgIFwiYnRuX3NlY29uZGFyeV91cFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0VGV4dFN0eWxlKGJ0blRleHRTdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0VGV4dChcIkNBTkNFTFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLmFkZENoaWxkKHRoaXMuZGlzcGxheS5jYW5jZWwpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQgPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgMTU1LCAxNDUsIHRoaXMua2V5LCB0aGlzLnN1Ym1pdCwgdGhpcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0RnJhbWVzKFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9vdmVyXCIsXG4gICAgICAgICAgICBcImJ0bl9wcmltYXJ5X291dFwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9kb3duXCIsXG4gICAgICAgICAgICBcImJ0bl9wcmltYXJ5X3VwXCJcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnN1Ym1pdC5zZXRUZXh0U3R5bGUoYnRuVGV4dFN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnN1Ym1pdC5zZXRUZXh0KFwiQlVZIElOXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LnN1Ym1pdCk7XG5cblxuICAgICAgICAvLyBUT0RPIC0gUmVtb3ZlXG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuaW5wdXQuZW5hYmxlRHJhZygpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkLmZvY3VzSW4uYWRkKCgpID0+IGNvbnNvbGUubG9nKFwiZm9jdXMgaW5cIikpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZC5mb2N1c091dC5hZGQoKCkgPT4gY29uc29sZS5sb2coXCJmb2N1cyBvdXRcIikpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuc2VhdHNbcGxheWVyRGF0YS5zZWF0XS5vY2N1cGllZCA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHBsYXllckxlZnQocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLnNlYXRzW3BsYXllckRhdGEuc2VhdF0ub2NjdXBpZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgZm9yIChsZXQgc2VhdE51bSBpbiB0aGlzLnNlYXRzKSB7XG4gICAgICAgICAgICBsZXQgc2VhdCA9IHRoaXMuc2VhdHNbc2VhdE51bV07XG4gICAgICAgICAgICBzZWF0LmJ1dHRvbi52aXNpYmxlID0gIXNlYXQub2NjdXBpZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAudmlzaWJsZSA9IHRoaXMuYnV0dG9uc1Zpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgfVxuXG4gICAgYnV0dG9uQ2xpY2tlZChidXR0b24pIHtcbiAgICAgICAgdGhpcy5kYXRhLnNlYXROdW0gPSBidXR0b24uc2VhdE51bTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIGNhbmNlbCgpIHtcbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc3VibWl0KCkge1xuICAgICAgICB0aGlzLmRhdGEuYnV5SW4gPSB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZC52YWx1ZTtcbiAgICAgICAgdGhpcy5idXlJblJlcXVlc3RlZC5kaXNwYXRjaCh0aGlzLmRhdGEuc2VhdE51bSwgdGhpcy5kYXRhLmJ1eUluKTtcbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgICAgICB0aGlzLm1vZGFsVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmJ1dHRvbnNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnV5SW5NYW5hZ2VyOyIsImltcG9ydCBDYXJkIGZyb20gXCIuLi9jbGFzc2VzL0NhcmRcIjtcblxuY2xhc3MgQ2FyZE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5jYXJkcyA9IFtdO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKG51bV9jYXJkcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9jYXJkczsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2FyZCA9IG5ldyBDYXJkKHRoaXMuZ2FtZSwgdGhpcyk7XG4gICAgICAgICAgICBjYXJkLmluaXRpYWxpemUoe30pO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNhcmRzLnB1c2goY2FyZCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQoY2FyZC5zcHJpdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWxpZ24oLTEsIDEsIHRoaXMuY2FyZHNbMF0uc3ByaXRlLndpZHRoICogMS4yLCAwKTtcbiAgICB9XG5cbiAgICBzZXRDYXJkTmFtZXMobmFtZXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS5uYW1lID0gbmFtZXNbaV07XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZE1hbmFnZXI7IiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vY2xhc3Nlcy9QbGF5ZXJcIjtcblxuY2xhc3MgUGxheWVyTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgdXNlcklkLCBzZWF0Q29uZmlnKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMudXNlcklkID0gdXNlcklkO1xuICAgICAgICB0aGlzLnNlYXRDb25maWcgPSBzZWF0Q29uZmlnO1xuXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdOyAgLy8gRGlyZWN0IGFjY2VzcyB0byB0aGUgUGxheWVyIG9iamVjdHNcbiAgICAgICAgdGhpcy51c2VyUGxheWVyID0gbnVsbDsgIC8vIFRoZSB1c2VyJ3MgcGxheWVyIG9iamVjdCwgaWYgYXZhaWxhYmxlXG4gICAgICAgIHRoaXMubmV4dFBsYXllciA9IG51bGw7ICAvLyBUaGUgcGxheWVyIHRoYXQgdGhlIGdhbWUgZXhwZWN0cyB0byBhY3QgbmV4dFxuXG4gICAgICAgIC8vIENvbnRhaW5zIGFsbCBkaXNwbGF5IGVsZW1lbnRzIGZvciBhbGwgcGxheWVycyBpbiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKHBsYXllckRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1BsYXllcihwbGF5ZXJEYXRhW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMuZ2FtZSwgdGhpcyk7XG4gICAgICAgIHBsYXllci5pbml0aWFsaXplKHBsYXllckRhdGEpO1xuICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnggPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS54O1xuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnkgPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS55O1xuXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChwbGF5ZXIuZGlzcGxheUdyb3VwKTtcblxuICAgICAgICBpZiAocGxheWVyLnVzZXJJZCA9PT0gdGhpcy51c2VySWQpIHtcbiAgICAgICAgICAgIHRoaXMudXNlclBsYXllciA9IHBsYXllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgcGxheWVyTGVmdChwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLmdldEJ5SWQocGxheWVyRGF0YS5pZCk7XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCBmaW5kIHBsYXllciBhdCB0YWJsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAuZGVzdHJveSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1tpXSA9PT0gcGxheWVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgZ2V0QnlJZChpZCkge1xuICAgICAgICAvLyBUT0RPIC0gRG8gdGhpcyB3aXRob3V0IGl0ZXJhdGluZyAtLSBidWlsZCBtYXAgb24gaW5pdD9cbiAgICAgICAgLy8gVE9ETyAtIFNob3VsZCB0aGlzIGV2ZXIgcmV0dXJuIG51bGw/XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgR2V0IGEgbGlzdCBvZiBhbGwgb2NjdXBpZWQgc2VhdHMgYXQgdGhlIHRhYmxlXG4gICAgICogQHJldHVybnMge251bWJlcltdfSAtIFRoZSBJRHMgb2Ygb2NjdXBpZWQgc2VhdHNcbiAgICAgKi9cbiAgICBnZXRPY2N1cGllZFNlYXRzKCkge1xuICAgICAgICBsZXQgb2NjdXBpZWRTZWF0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgb2NjdXBpZWRTZWF0cy5wdXNoKHRoaXMucGxheWVyc1tpXS5zZWF0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2NjdXBpZWRTZWF0cztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllck1hbmFnZXI7IiwiY29uc3QgaXNTdHJpbmcgPSB2YWwgPT4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG5jb25zdCBpc0Jsb2IgPSB2YWwgPT4gdmFsIGluc3RhbmNlb2YgQmxvYjtcblxucG9seWZpbGwuY2FsbCh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6IHRoaXMgfHwge30pO1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgaWYgKGlzU3VwcG9ydGVkLmNhbGwodGhpcykpIHJldHVybjtcblxuICBpZiAoISgnbmF2aWdhdG9yJyBpbiB0aGlzKSkgdGhpcy5uYXZpZ2F0b3IgPSB7fTtcbiAgdGhpcy5uYXZpZ2F0b3Iuc2VuZEJlYWNvbiA9IHNlbmRCZWFjb24uYmluZCh0aGlzKTtcbn07XG5cbmZ1bmN0aW9uIHNlbmRCZWFjb24odXJsLCBkYXRhKSB7XG4gIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudCAmJiB0aGlzLmV2ZW50LnR5cGU7XG4gIGNvbnN0IHN5bmMgPSBldmVudCA9PT0gJ3VubG9hZCcgfHwgZXZlbnQgPT09ICdiZWZvcmV1bmxvYWQnO1xuXG4gIGNvbnN0IHhociA9ICgnWE1MSHR0cFJlcXVlc3QnIGluIHRoaXMpID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcbiAgeGhyLm9wZW4oJ1BPU1QnLCB1cmwsICFzeW5jKTtcbiAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnKi8qJyk7XG5cblxuICBpZiAoaXNTdHJpbmcoZGF0YSkpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSAndGV4dC9wbGFpbic7XG4gIH0gZWxzZSBpZiAoaXNCbG9iKGRhdGEpICYmIGRhdGEudHlwZSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCBkYXRhLnR5cGUpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICB4aHIuc2VuZChkYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gIHJldHVybiAoJ25hdmlnYXRvcicgaW4gdGhpcykgJiYgKCdzZW5kQmVhY29uJyBpbiB0aGlzLm5hdmlnYXRvcik7XG59IiwiaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgQ29udHJvbGxlciBmcm9tIFwiLi4vY2xhc3Nlcy9Db250cm9sbGVyXCI7XG5cbmNsYXNzIEJvb3QgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbml0aWFsRGF0YSA9IHRoaXMuYXVnbWVudEluaXRpYWxEYXRhKGluaXRpYWxEYXRhKTtcbiAgICAgICAgdGhpcy5nYW1lLmNvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICAvLyBUT0RPIC0gVGhpcyBzaG91bGQgY29tZSBmcm9tIHNvbWV3aGVyZSBkeW5hbWljXG4gICAgICAgIHRoaXMuZ2FtZS5ydWxlcyA9IHtcbiAgICAgICAgICAgIGFudGU6IDAsXG4gICAgICAgICAgICBibGluZHM6IHtcbiAgICAgICAgICAgICAgICBzbWFsbDogMjUsXG4gICAgICAgICAgICAgICAgYmlnOiA1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcklkLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudG9rZW4pO1xuXG4gICAgICAgIGlmICh0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndGVzdCcpO1xuICAgICAgICAgICAgd2luZG93LmdhbWUgPSB0aGlzLmdhbWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydChcImxvYWRcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQFN1bW1hcnkgQ2FsY3VsYXRlIGFkZGl0aW9uYWwgdmFsdWVzIHRvIHN0b3JlIG9uIGdhbWUuaW5pdGlhbERhdGFcbiAgICAgKlxuICAgICAqIFRvIHNhdmUgb24gc2VydmVyLXNpZGUgcHJvY2Vzc2luZyBhbmQgZGF0YS10cmFuc2ZlciBsb2FkLCB0aGlzXG4gICAgICogbWV0aG9kIGlzIGEgcGxhY2UgdG8gZ2VuZXJhdGUgYWRkaXRpb25hbCBkYXRhIG5lZWRlZCBieSB0aGUgZ2FtZVxuICAgICAqIHdoaWNoIG1heSBiZSBkZXJpdmVkIGZyb20gdGhlIGRhdGEgc2VudCBmcm9tIHRoZSBiYWNrIGVuZC5cbiAgICAgKi9cbiAgICBhdWdtZW50SW5pdGlhbERhdGEoaW5pdGlhbERhdGEpIHtcbiAgICAgICAgaW5pdGlhbERhdGEub2NjdXBpZWRTZWF0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluaXRpYWxEYXRhLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGluaXRpYWxEYXRhLm9jY3VwaWVkU2VhdHMucHVzaChpbml0aWFsRGF0YS5wbGF5ZXJzW2ldLnNlYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluaXRpYWxEYXRhO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQm9vdDsiLCJjbGFzcyBMb2FkIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBwcmVsb2FkKCkge1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcImJhY2tncm91bmRcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9iYWNrZ3JvdW5kLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJkZWFsZXJCdXR0b25cIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9kZWFsZXJidXR0b24ucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcInJlZENpcmNsZVwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3JlZGNpcmNsZS5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJjYXJkc1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NhcmRzLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NhcmRzLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJwYW5lbFwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3BhbmVsLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3BhbmVsLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJidXlJblwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2J1eWluLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2J1eWluLmpzb25cIik7XG5cbiAgICAgICAgdGhpcy5nYW1lLnRleHR1cmVzID0gdGhpcy5jcmVhdGVDdXN0b21UZXh0dXJlcygpO1xuXG4gICAgICAgIHRoaXMubG9hZFBsdWdpbnMoKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydChcIm1haW5cIik7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3VzdG9tVGV4dHVyZXMoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IHt9O1xuXG4gICAgICAgIGxldCBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMTAwLCAxMDAsIDEwMCwgMTAwKTtcbiAgICAgICAgdGV4dHVyZXNbXCJ3aGl0ZVNxdWFyZVwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmxpbmVTdHlsZSg0LCAweDAwMDAwMCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIDMwMCwgMTAwKTtcblxuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlUmVjdFwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuXG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICByZXR1cm4gdGV4dHVyZXM7XG4gICAgfVxuXG4gICAgbG9hZFBsdWdpbnMoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5hZGQucGx1Z2luKFBoYXNlcklucHV0LlBsdWdpbik7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkOyIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2NsYXNzZXMvQWN0aW9uLmpzXCI7XG5pbXBvcnQgQnV5SW5NYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9CdXlJbk1hbmFnZXJcIjtcbmltcG9ydCBDYXJkTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2FyZE1hbmFnZXJcIjtcbmltcG9ydCBQYW5lbCBmcm9tIFwiLi4vY2xhc3Nlcy9QYW5lbFwiO1xuaW1wb3J0IFBsYXllck1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL1BsYXllck1hbmFnZXJcIjtcbmltcG9ydCBQb3QgZnJvbSBcIi4uL2NsYXNzZXMvUG90XCI7XG5pbXBvcnQgUG9rZXIgZnJvbSBcIi4uL1Bva2VyXCI7XG5pbXBvcnQgU1NFIGZyb20gXCIuLi9TU0VcIjtcblxuY2xhc3MgTWFpbiBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlU1NFVXJsKTtcbiAgICAgICAgdGhpcy51c2VyX3NzZSA9IG5ldyBTU0UodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudXNlclNTRVVybCk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ1bmxvYWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuZGlzY29ubmVjdEJlYWNvbigpO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSB0aGlzLmdhbWUuYWRkLmltYWdlKDAsIDAsIFwiYmFja2dyb3VuZFwiKTtcbiAgICAgICAgdGhpcy5uZXdIYW5kQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMTAwLCBcIm5ld1xcbmhhbmRcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLm5ld0hhbmQpO1xuICAgICAgICB0aGlzLmRlYWxCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAyMjAsIFwiZGVhbFwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuZGVhbCk7XG4gICAgICAgIHRoaXMubGVhdmVCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAzNDAsIFwibGVhdmVcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmxlYXZlVGFibGUpO1xuICAgICAgICB0aGlzLmJiQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgNDYwLCBcIkJCXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5iYik7XG4gICAgICAgIHRoaXMuc2JCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCA1ODAsIFwiU0JcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLnNiKTtcblxuICAgICAgICBjb25zdCBudW1TZWF0cyA9IDEwOyAgICAvLyBUT0RPIC0gTWFrZSBkeW5hbWljXG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzID0gbmV3IFBsYXllck1hbmFnZXIodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudXNlcklkLCB0aGlzLmdhbWUuY29uZmlnLnNlYXRzW251bVNlYXRzXSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmluaXRpYWxpemUodGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcnMsIHRoaXMuZ2FtZS5jb25maWcuc2VhdHNbbnVtU2VhdHNdKTtcblxuICAgICAgICB0aGlzLmdhbWUuYm9hcmQgPSBuZXcgQ2FyZE1hbmFnZXIodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmluaXRpYWxpemUoNSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmNlbnRlclkgPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWTtcblxuICAgICAgICB0aGlzLmdhbWUucG90ID0gbmV3IFBvdCh0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmdhbWUucG90LmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wb3Quc3ByaXRlLmNlbnRlclggPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWDtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5zcHJpdGUuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZIC0gMTQwO1xuXG4gICAgICAgIC8vIFRPRE8gLSBUaGVzZSBzaG91bGQgZ28gc29tZXdoZXJlIGVsc2UuIE1heWJlIGluIFBvdD9cbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbCA9IG5ldyBQYW5lbCh0aGlzLmdhbWUsIFwicGFuZWxcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueCA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLng7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueSA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLnk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5hbHdheXNWaXNpYmxlID0gdGhpcy5nYW1lLmluaXRpYWxEYXRhLmVtdWxhdG9yRW5hYmxlZDtcblxuICAgICAgICB0aGlzLmdhbWUuYnV5SW4gPSBuZXcgQnV5SW5NYW5hZ2VyKHRoaXMuZ2FtZSwgXCJidXlJblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLmluaXRpYWxpemUodGhpcy5nYW1lLmNvbmZpZy5zZWF0c1tudW1TZWF0c10sIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldE9jY3VwaWVkU2VhdHMoKSwgdGhpcy5nYW1lLmNvbmZpZy5idXlJbk1vZGFsKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdIYW5kXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3SGFuZDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJvYXJkLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBvdC5zZXRBbW91bnQoMCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV07XG4gICAgICAgICAgICAgICAgcGxheWVyLmNhcmRzLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGlzRGVhbGVyOiBwbGF5ZXIuaWQgPT09IGRhdGEuZGVhbGVyLFxuICAgICAgICAgICAgICAgICAgICBpc05leHQ6IHBsYXllci5pZCA9PT0gZGF0YS5uZXh0LFxuICAgICAgICAgICAgICAgICAgICByb3VuZEJldDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldCgwKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJkZWFsXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVhbDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRCZXRzKFBva2VyLmdlbmVyYXRlUmFpc2VzKHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuc21hbGwsIHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuYmlnLCB0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlCZXQoUG9rZXIuZ2V0TWluQmV0KHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0VmlzaWJsZSh0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID09PSB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImVtdWxhdGVEZWFsXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlbXVsYXRlRGVhbDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGxheWVyRGF0YSA9IGRhdGFbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQocGxheWVyRGF0YS5wbGF5ZXJJZCkuY2FyZHMuc2V0Q2FyZE5hbWVzKHBsYXllckRhdGEuaG9sZGluZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwibmV3Um91bmRcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdSb3VuZDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnBsYXllcnMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV0udXBkYXRlKHtyb3VuZEJldDogMH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldCgwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiYWN0aW9uXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWN0aW9uOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQuc2V0Q2FyZE5hbWVzKGRhdGEuYm9hcmQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5wbGF5ZXJJZCkudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBiYWxhbmNlOiBkYXRhLnBsYXllckJhbGFuY2UsXG4gICAgICAgICAgICAgICAgaXNOZXh0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICByb3VuZEJldDogZGF0YS5wbGF5ZXJSb3VuZEJldFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCkudXBkYXRlKHtpc05leHQ6IHRydWV9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wb3Quc2V0QW1vdW50KGRhdGEucG90KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IGRhdGEucm91bmRCZXQ7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IGRhdGEucm91bmRSYWlzZTtcblxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldChQb2tlci5nZXRNaW5CZXQodGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJoYW5kQ29tcGxldGVcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoYW5kQ29tcGxldGU6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS53aW5uZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHdpbm5lciA9IGRhdGEud2lubmVyc1tpXTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKHdpbm5lci5pZCkudXBkYXRlKHtiYWxhbmNlOiB3aW5uZXIuYmFsYW5jZX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdQbGF5ZXJcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1BsYXllcjogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV3UGxheWVyKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLm5ld1BsYXllcihkYXRhKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwicGxheWVyTGVmdFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGxheWVyTGVmdDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMucGxheWVyTGVmdChkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5idXlJbi5wbGF5ZXJMZWZ0KGRhdGEpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy51c2VyX3NzZS5hZGRMaXN0ZW5lcihcImRlYWxcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlYWw6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIuY2FyZHMuc2V0Q2FyZE5hbWVzKGRhdGEuaG9sZGluZ3MpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlckxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnByaW1hcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZWNvbmRhcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC50ZXJ0aWFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLmJ1eUluUmVxdWVzdGVkLmFkZCh0aGlzLmdhbWUuY29udHJvbGxlci5qb2luLCB0aGlzLmdhbWUuY29udHJvbGxlcik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSb3V0ZSBhY3Rpb25zIHRvIGNvbnRyb2xsZXIgcmVxdWVzdHNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWN0aW9uIC0gVGhlIGFjdGlvbiB0byBiZSByZXF1ZXN0ZWQsIGRlZmluZWQgaW4gQWN0aW9uLmpzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJldCAtIFRoZSBiZXQgKGlmIGFueSkgdG8gYmUgc2VudCB0byB0aGUgY29udHJvbGxlclxuICAgICAqL1xuICAgIGhhbmRsZUFjdGlvbihhY3Rpb24sIGJldCkge1xuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uRk9MRDpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5mb2xkKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5DSEVDSzpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5jaGVjaygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uQkVUOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmJldChiZXQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJJbnZhbGlkIEFjdGlvbiBUeXBlOiBcIiArIGFjdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbi51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBtYWtlQnRuKHgsIHksIHRleHQsIHRleHR1cmUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBidG4gPSB0aGlzLmdhbWUuYWRkLmJ1dHRvbih4LCB5LCB0ZXh0dXJlLCBjYWxsYmFjaywgdGhpcyk7XG4gICAgICAgIGJ0bi5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICBsZXQgYnRuVGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAwLCB0ZXh0KTtcbiAgICAgICAgYnRuVGV4dC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgYnRuLmFkZENoaWxkKGJ0blRleHQpO1xuICAgICAgICBidG4udGV4dCA9IGJ0blRleHQ7XG5cbiAgICAgICAgcmV0dXJuIGJ0bjtcbiAgICB9XG5cbiAgICBkZWFsKCkge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy90YWJsZXMvJyArIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZU5hbWUgKyAnL2RlYWwvJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0YWJsZU5hbWU6IGluaXRpYWxEYXRhLnRhYmxlTmFtZSxcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIG5ld0hhbmQoKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL3RhYmxlcy8nICsgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlTmFtZSArICcvbmV3LWhhbmQvJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0YWJsZU5hbWU6IGluaXRpYWxEYXRhLnRhYmxlTmFtZSxcbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBsZWF2ZVRhYmxlKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5sZWF2ZSgpO1xuICAgIH1cblxuICAgIGJiKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5iYigpO1xuICAgIH07XG5cbiAgICBzYigpIHtcbiAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuc2IoKTtcbiAgICB9O1xuXG4gICAgZ2VuZXJhdGVCZXRzKHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIHJldHVybiBQb2tlci5nZW5lcmF0ZUJldHMoMjUsIDUwLCB0aGlzLmdhbWUucm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgcGxheWVyQmFsYW5jZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYWluOyJdfQ==
