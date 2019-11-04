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
        value: function join(seatNum) {
            var data = { "position": seatNum };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NvbnRyb2xsZXIuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGFuZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGxheWVyLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BvdC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9TbGlkZXIuanMiLCJzdGF0aWMvc3JjL2NvbmZpZy5qc29uIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9CdXlJbk1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL0NhcmRNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9QbGF5ZXJNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9wb2x5ZmlsbHMvc2VuZGJlYWNvbi5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL0Jvb3QuanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Mb2FkLmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTSxJOzs7QUFDRixvQkFBYztBQUFBOztBQUFBLGdIQUNKO0FBQ0YsbUJBQU8sSUFETDtBQUVGLG9CQUFRO0FBRk4sU0FESTs7QUFNVixjQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBZixFQUF1QixjQUF2QixFQUE2QixLQUE3QjtBQUNBLGNBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLGNBQXZCLEVB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Q0EsZ0JBQUksZ0JBQUosQ0FBcUIsY0FBckIsRUFBcUMsa0JBQXJDO0FBQ0EsZ0JBQUksSUFBSixDQUFTLEtBQUssU0FBTCxDQUFlO0FBQ3BCLDJCQUFXLFlBQVk7QUFESCxhQUFmLENBQVQ7QUFHSDs7O3FDQUVZO0FBQ1QsaUJBQUssSUFBTCxDQUFVLFVBQVYsQ0FBcUIsS0FBckI7QUFDSDs7OzZCQUVJO0FBQ0QsaUJBQUssSUFBTCxDQUFVLFVBQVYsQ0FBcUIsRUFBckI7QUFDSDs7OzZCQUVJO0FBQ0QsaUJBQUssSUFBTCxDQUFVLFVBQVYsQ0FBcUIsRUFBckI7QUFDSDs7O3FDQUVZLGMsRUFBZ0IsYSxFQUFlO0FBQ3hDLG1CQUFPLGdCQUFNLFlBQU4sQ0FBbUIsRUFBbkIsRUFBdUIsRUFBdkIsRUFBMkIsS0FBSyxJQUFMLENBQVUsUUFBckMsRUFBK0MsY0FBL0MsRUFBK0QsS0FBSyxJQUFMLENBQVUsVUFBekUsRUFBcUYsYUFBckYsQ0FBUDtBQUNIOzs7O0VBdk5jLE9BQU8sSzs7a0JBME5YLEkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgQm9vdCBmcm9tIFwiLi9zdGF0ZXMvQm9vdFwiO1xuaW1wb3J0IExvYWQgZnJvbSBcIi4vc3RhdGVzL0xvYWRcIjtcbmltcG9ydCBNYWluIGZyb20gXCIuL3N0YXRlcy9NYWluXCI7XG5cbmNsYXNzIEdhbWUgZXh0ZW5kcyBQaGFzZXIuR2FtZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKHtcbiAgICAgICAgICAgIHdpZHRoOiAxOTIwLFxuICAgICAgICAgICAgaGVpZ2h0OiAxMDgwXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuYWRkKFwiYm9vdFwiLCBCb290LCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc3RhdGUuYWRkKFwibG9hZFwiLCBMb2FkLCBmYWxzZSk7XG4gICAgICAgIHRoaXMuc3RhdGUuYWRkKFwibWFpblwiLCBNYWluLCBmYWxzZSk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5zdGFydChcImJvb3RcIik7XG4gICAgfVxufVxuXG5uZXcgR2FtZSgpOyIsIi8qKlxuICogQHN1bW1hcnkgQSB1dGlsaXR5IGNsYXNzIG9mIFBva2VyLXNwZWNpZmljIGZ1bmN0aW9uYWxpdHlcbiAqL1xuY2xhc3MgUG9rZXIge1xuICAgIC8vIFRPRE8gLSBUaGlzIHV0aWxpdHkgaXMgaGlnaGx5LXNwZWNpZmljIHRvIE5MIGdhbWVzLCBtYXliZSBldmVuIHRvIE5MSEUuXG4gICAgLy8gIE5lZWQgdG8gbWFrZSBpdCBtb3JlIGdlbmVyaWMgZXZlbnR1YWxseSB0byBhbGxvdyBmb3Igb3RoZXIgZ2FtZVxuICAgIC8vICB0eXBlcy4gTGltaXQgYW5kIHBvdC1saW1pdCBnYW1lcyB3aWxsIHdvcmsgY29tcGxldGVseSBkaWZmZXJlbnRseS5cbiAgICAvLyAgQW50ZXMgYXJlIGFsc28gbm90IHN1cHBvcnRlZC5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdlbmVyYXRlIGFsbCBsZWdhbCByYWlzZXMgZm9yIHBsYXllclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzbWFsbEJsaW5kIC0gVGhlIHNtYWxsIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119IC0gVGhlIHZhbGlkIHJhaXNlc1xuICAgICAqL1xuICAgIHN0YXRpYyBnZW5lcmF0ZVJhaXNlcyhzbWFsbEJsaW5kLCBiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IHJhaXNlID0gUG9rZXIuZ2V0TWluUmFpc2UoYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICAgICAgbGV0IHJhaXNlcyA9IFtyYWlzZV07XG5cbiAgICAgICAgd2hpbGUgKHJhaXNlICsgc21hbGxCbGluZCA8PSBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgICAgICByYWlzZSArPSBzbWFsbEJsaW5kO1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocmFpc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJhaXNlIDwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocGxheWVyQmFsYW5jZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmFpc2VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgYmV0IGZvciBwbGF5ZXJcbiAgICAgKlxuICAgICAqIElmIG5vIGJldHMgaGF2ZSBvY2N1cnJlZCBpbiBjdXJyZW50IHJvdW5kLCB0aGUgbWluIGJldCBpcyBhXG4gICAgICogY2hlY2sgKGJldCBvZiAwKSwgb3RoZXJ3aXNlIGl0J3MgYSBjYWxsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5CZXQocm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCBtaW5CZXQgPSByb3VuZEJldCA9PT0gMCA/IDAgOiByb3VuZEJldCAtIHBsYXllclJvdW5kQmV0O1xuICAgICAgICBpZiAocGxheWVyQmFsYW5jZSA8IG1pbkJldCkge1xuICAgICAgICAgICAgbWluQmV0ID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluQmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgcmFpc2UgZm9yIHBsYXllclxuICAgICAqXG4gICAgICogTk9URTogQSByYWlzZSBoZXJlIG1heSBhY3R1YWxseSBtZWFuIGEgYmV0IGluIHBva2VyIHRlcm1zLiBJbiB0aGVcbiAgICAgKiBwYXJsYW5jZSBvZiB0aGlzIHV0aWxpdHksIGEgcmFpc2UgaXMgYW4gYWdncmVzc2l2ZSBhY3Rpb24sIG9yIHNvbWV0aGluZ1xuICAgICAqIHdoaWNoIHdvdWxkIGZvcmNlIG90aGVyIHBsYXllcnMgdG8gY29udHJpYnV0ZSBtb3JlIHRvIHRoZSBwb3QgdGhhblxuICAgICAqIHRoZSBvdGhlcndpc2Ugd291bGQgaGF2ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5SYWlzZShiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IG1pblJhaXNlID0gcm91bmRCZXQgPT09IDAgPyBiaWdCbGluZCA6IHJvdW5kQmV0IC0gcGxheWVyUm91bmRCZXQgKyBwcmV2UmFpc2U7XG4gICAgICAgIGlmIChwbGF5ZXJCYWxhbmNlIDwgbWluUmFpc2UpIHtcbiAgICAgICAgICAgIG1pblJhaXNlID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluUmFpc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb2tlcjsiLCJjbGFzcyBTU0Uge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVybCkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodGhpcy51cmwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJlIGFkZHMgYWxsIGxpc3RlbmVycyB0byB0aGlzLnNvdXJjZVxuICAgICAqXG4gICAgICogSSBvcmlnaW5hbGx5IHdyb3RlIHRoaXMgdG8gc3VwcG9ydCBjbGllbnQgcmVjb25uZWN0cywgYnV0IEkgZG9uJ3QgbmVlZFxuICAgICAqIHRoYXQgYW55bW9yZS4gS2VlcGluZyB0aGUgbGlzdGVuZXIgY29kZSBqdXN0IGluIGNhc2UuXG4gICAgICovXG4gICAgcmVBZGRBbGxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycztcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobGlzdGVuZXIudHlwZSwgbGlzdGVuZXIuY2FsbGJhY2ssIGxpc3RlbmVyLmNhbGxiYWNrQ29udGV4dCwgLi4ubGlzdGVuZXIuYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIFN0b3JlIGxpc3RlbmVycyBmb3IgZXZlbnR1YWwgcmVjb25uZWN0XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgICAgXCJ0eXBlXCI6IHR5cGUsXG4gICAgICAgICAgICBcImNhbGxiYWNrXCI6IGNhbGxiYWNrLFxuICAgICAgICAgICAgXCJjYWxsYmFja0NvbnRleHRcIjogY2FsbGJhY2tDb250ZXh0LFxuICAgICAgICAgICAgXCJhcmdzXCI6IGFyZ3NcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU1NFOyIsImNsYXNzIFV0aWwge1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJldHVybiBhIGZvcm1hdHRlZCBjdXJyZW5jeSBzdHJpbmcgZnJvbSBhbiBpbnRlZ2VyXG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlQ3VycmVuY3koaW50KSB7XG4gICAgICAgIGxldCB2YWwgPSBpbnQgLyAxMDA7XG4gICAgICAgIHJldHVybiBcIiRcIiArIHZhbC50b0ZpeGVkKDIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXRpbDsiLCJjb25zdCBBY3Rpb24gPSB7XG4gICAgQkxJTkQ6IDAsXG4gICAgRk9MRDogMSxcbiAgICBDSEVDSzogMixcbiAgICBCRVQ6IDNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFjdGlvbjsiLCIvKipcbiAqIEEgUGhhc2VyLkJ1dHRvbiB3aXRoIGEgUGhhc2VyLlRleHQgY2VudGVyZWQgb24gdGhlIGJ1dHRvblxuICpcbiAqIFRoaXMgY2xhc3MgaXMgbWVyZWx5IGEgdGhpbiB3cmFwcGVyIGFyb3VuZCBQaGFzZXIuQnV0dG9uIHRvIGFsbG93IGZvclxuICogZWFzeSB1c2Ugb2YgYSB0ZXh0IGxhYmVsIG9uIHRoZSBidXR0b24uIFRoZSB0ZXh0IGlzIGEgY2hpbGQgb2YgdGhlIGJ1dHRvbixcbiAqIHNvIGl0IG1vdmVzIHdoZW4gdGhlIGJ1dHRvbiBtb3Zlcy4gSXQncyBjZW50ZXJlZCBvbiB0aGUgYnV0dG9uIGFuZCBzY2FsZXNcbiAqIGF1dG9tYXRpY2FsbHkgdG8gZml4IHdpdGhpbiB0aGUgYnV0dG9uJ3MgYm91bmRzLlxuICpcbiAqIElmIG5vbmUgb2YgdGhlIGxhYmVsIGZ1bmN0aW9uYWxpdHkgaXMgdXNlZCwgdGhpcyBjbGFzcyBpcyBpZGVudGljYWwgdG9cbiAqIFBoYXNlci5CdXR0b24uXG4gKi9cbmNsYXNzIEJ1dHRvbiBleHRlbmRzIFBoYXNlci5CdXR0b24ge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGtleSwgY2FsbGJhY2ssIGNhbGxiYWNrY29udGV4dCwgb3ZlckZyYW1lLCBvdXRGcmFtZSwgZG93bkZyYW1lLCB1cEZyYW1lKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSwgY2FsbGJhY2ssIGNhbGxiYWNrY29udGV4dCwgb3ZlckZyYW1lLCBvdXRGcmFtZSwgZG93bkZyYW1lLCB1cEZyYW1lKTtcblxuICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmxhYmVsUGFkZGluZyA9IDEwO1xuICAgICAgICB0aGlzLmxhYmVsVGV4dCA9IFwiXCI7XG4gICAgICAgIHRoaXMubGFiZWxTdHlsZSA9IHt9O1xuICAgICAgICB0aGlzLmxhYmVsID0gbmV3IFBoYXNlci5UZXh0KHRoaXMuZ2FtZSwgMCwgMCwgdGhpcy5sYWJlbFRleHQpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMubGFiZWwpO1xuXG4gICAgICAgIC8vIE11c3QgYWRkIHRvIGdhbWUgd29ybGQgbWFudWFsbHkgaWYgbm90IHVzaW5nIGdhbWUuYWRkLmJ1dHRvblxuICAgICAgICB0aGlzLmdhbWUud29ybGQuYWRkKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgdGV4dCBkaXNwbGF5ZWQgb24gdGhlIGJ1dHRvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gZGlzcGxheVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSBkaXNwbGF5IHVwZGF0ZSBkZXNwaXRlIG9mIHRoaXMuZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRUZXh0KHRleHQsIGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5sYWJlbFRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHN0eWxlIGZvciB0aGUgYnV0dG9uIHRleHRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgLSBUaGUgdGV4dCBzdHlsZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0VGV4dFN0eWxlKHN0eWxlLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxTdHlsZSA9IHN0eWxlO1xuICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHBhZGRpbmcgYmV0d2VlbiB0aGUgdGV4dCBhbmQgdGhlIGJ1dHRvbiBwZXJpbWV0ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFkZGluZyAtIFRoZSBwYWRkaW5nIGluIHBpeGVsc1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSBkaXNwbGF5IHVwZGF0ZSBkZXNwaXRlIG9mIHRoaXMuZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRQYWRkaW5nKHBhZGRpbmcsIGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSBwYWRkaW5nO1xuICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSB0aGUgYnV0dG9uXG4gICAgICogT24gZGlzYWJsZSwgZGlzYWJsZXMgYWxsIGlucHV0IHRvIHRoZSBidXR0b24gYW5kIHJlbmRlcnMgaXQgZ3JheWVkXG4gICAgICogb3V0LiBBbGwgdXBkYXRlcyBhcmUgZGVsYXllZCB1bnRpbCByZS1lbmFibGUsIHVubGVzcyBmb3JjZWQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gRW5hYmxlIG9yIGRpc2FibGUgYnV0dG9uP1xuICAgICAqL1xuICAgIHNldEVuYWJsZWQoZW5hYmxlZCkge1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgIGxldCB0aW50ID0gZW5hYmxlZCA/IDB4RkZGRkZGIDogMHg4MDgwODA7XG4gICAgICAgIHRoaXMudGludCA9IHRpbnQ7XG4gICAgICAgIHRoaXMubGFiZWwudGludCA9IHRpbnQ7XG5cbiAgICAgICAgLy8gVXBkYXRlIG9uIHJlLWVuYWJsZVxuICAgICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVMYWJlbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVXBkYXRlIGFsbCBidXR0b24gYXR0cmlidXRlcyB0byBjdXJyZW50IHByb3BlcnRpZXNcbiAgICAgKlxuICAgICAqIElmIHRoZSBidXR0b24gaXMgZGlzYWJsZWQsIHRoaXMgd2lsbCBoYXZlIG5vIGVmZmVjdC4gVGhlXG4gICAgICogZGV2ZWxvcGVyIG1heSBvcHRpb25hbGx5IGNob29zZSB0byBmb3JjZSB0aGUgdXBkYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIHRoZSB1cGRhdGU/XG4gICAgICovXG4gICAgdXBkYXRlTGFiZWwoZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICBpZiAodGhpcy5lbmFibGVkIHx8IGZvcmNlKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnRleHQgPSB0aGlzLmxhYmVsVGV4dDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2V0U3R5bGUodGhpcy5sYWJlbFN0eWxlKTtcbiAgICAgICAgICAgIHRoaXMucmVQb3NMYWJlbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2NhbGUgbGFiZWwgdGV4dCB0byBmaXQgb24gYnV0dG9uIGFuZCBjZW50ZXJcbiAgICAgKi9cbiAgICByZVBvc0xhYmVsKCkge1xuICAgICAgICB0aGlzLmxhYmVsLnNjYWxlLnNldFRvKDEpO1xuICAgICAgICBjb25zdCB0ZXh0QXJlYUggPSB0aGlzLndpZHRoIC0gdGhpcy5sYWJlbFBhZGRpbmcgKiAyO1xuICAgICAgICBjb25zdCB0ZXh0QXJlYVYgPSB0aGlzLmhlaWdodCAtIHRoaXMubGFiZWxQYWRkaW5nICogMjtcbiAgICAgICAgaWYgKHRoaXMubGFiZWwud2lkdGggPiB0ZXh0QXJlYUggfHwgdGhpcy5sYWJlbC5oZWlnaHQgPiB0ZXh0QXJlYVYpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlZHVjZWRTY2FsZUggPSB0ZXh0QXJlYUggLyB0aGlzLmxhYmVsLndpZHRoO1xuICAgICAgICAgICAgY29uc3QgcmVkdWNlZFNjYWxlViA9IHRleHRBcmVhViAvIHRoaXMubGFiZWwuaGVpZ2h0O1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5zY2FsZS5zZXRUbyhNYXRoLm1pbihyZWR1Y2VkU2NhbGVILCByZWR1Y2VkU2NhbGVWKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYWJlbC5jZW50ZXJYID0gdGhpcy53aWR0aCAvIDI7XG4gICAgICAgIHRoaXMubGFiZWwuY2VudGVyWSA9IHRoaXMuaGVpZ2h0IC8gMjtcbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnV0dG9uOyIsImNsYXNzIENhcmQge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIG1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDsgICAvLyBTdHJpbmcgSUQgb2YgY2FyZCwgZS5nLiAnS2gnIG9yICc3cydcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBudWxsO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoZGF0YSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgXCJjYXJkc1wiKTtcbiAgICAgICAgdGhpcy5zcHJpdGUuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuc3ByaXRlLnNjYWxlLnNldFRvKDEuNSk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUuZnJhbWVOYW1lID0gdGhpcy5uYW1lID8gdGhpcy5uYW1lIDogXCJiYWNrXCI7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXJkOyIsImNsYXNzIENvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHBsYXllcklkLCB0b2tlbikge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnBsYXllcklkID0gcGxheWVySWQ7XG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIGFjY2VzcyB0b2tlbiB1c2VkIHRvIGF1dGhlbnRpY2F0ZSBvbiBBUEkgY2FsbHNcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gLSBUaGUgRmxhc2stSldULUV4dGVuZGVkIGFjY2VzcyB0b2tlblxuICAgICAqL1xuICAgIHNldFRva2VuKHRva2VuKSB7XG4gICAgICAgIHRoaXMudG9rZW4gPSB0b2tlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyXG4gICAgICpcbiAgICAgKiBPbmx5IGVycm9ycyBhcmUgcmVwb3J0ZWQuIFN1Y2Nlc3MgaXMgc2lsZW50LiBHYW1lIGNoYW5nZXMgcmVzdWx0aW5nXG4gICAgICogZnJvbSByZXF1ZXN0cyBhcmUgaGFuZGxlZCB2aWEgU2VydmVyIFNlbnQgRXZlbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVuZHBvaW50IC0gVGhlIGVuZHBvaW50IG9uIHRoZSBzZXJ2ZXIgdG8gc2VuZCByZXF1ZXN0IHRvXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgLSBUaGUgcGF5bG9hZCB0byBzZW5kXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFttZXRob2Q9XCJQT1NUXSAtIFRoZSBIVFRQIG1ldGhvZCB0byB1c2VcbiAgICAgKi9cbiAgICBzZW5kUmVxdWVzdChlbmRwb2ludCwgZGF0YSwgbWV0aG9kID0gXCJQT1NUXCIpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbihtZXRob2QsIGVuZHBvaW50KTtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCAmJiB4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzcCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgLy8gSW52YWxpZCByZXF1ZXN0IGVycm9yXG4gICAgICAgICAgICAgICAgaWYgKHJlc3Auc3VjY2VzcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKHJlc3ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgLy8gRmFpbGVkIHJlcXVlc3QgZXJyb3JcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0F1dGhvcml6YXRpb24nLCAnQmVhcmVyICcgKyB0aGlzLnRva2VuKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYW4gYWN0aW9uIHJlcXVlc3RcbiAgICAgKlxuICAgICAqIFRoaXMgaXMgdGhlIG1vc3QgaGVhdmlseS11c2VkIHJlcXVlc3QgdHlwZSBpbiB0aGUgZ2FtZS4gQWxsIGluLWdhbWVcbiAgICAgKiBhY3Rpb25zIChiZXQsIGNoZWNrLCBmb2xkKSBoYXBwZW4gaGVyZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gVGhlIHBheWxvYWQgdG8gc2VuZFxuICAgICAqL1xuICAgIGFjdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJhY3Rpb25cIik7XG4gICAgICAgIHRoaXMuc2VuZFJlcXVlc3QodXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBjaGVjaygpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQ0hFQ0tcIik7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGJldChhbXQpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiQkVUXCIsIGFtdCk7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGZvbGQoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkZPTERcIik7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIGJiKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJCTElORFwiLCA1MCk7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIHNiKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJCTElORFwiLCAyNSk7XG4gICAgICAgIHRoaXMuYWN0aW9uKGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSBiZWFjb24gdG8gdGhlIHNlcnZlciBvbiBkaXNjb25uZWN0XG4gICAgICpcbiAgICAgKiBUaGlzIGFsbG93cyBmb3Igc2VydmVyIHRvIGtub3cgd2hlbiBhIGNsaWVudCBkaXNjb25uZWN0cyBzb1xuICAgICAqIGl0IGNhbiBjbGVhbiB1cCBhcyBuZWNlc3NhcnkuIE5vIGd1YXJhbnRlZSB0aGF0IHRoaXMgbWVzc2FnZVxuICAgICAqIHdpbGwgZ28gdGhyb3VnaCwgc28gbXVzdCBoYXZlIHJlZHVuZGFudCBtZWFzdXJlcyBpbiBwbGFjZS5cbiAgICAgKi9cbiAgICBkaXNjb25uZWN0QmVhY29uKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0IHVybCA9IFwiL2Rpc2Nvbm5lY3QvXCI7XG4gICAgICAgIG5hdmlnYXRvci5zZW5kQmVhY29uKHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgam9pbihzZWF0TnVtKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XCJwb3NpdGlvblwiOiBzZWF0TnVtfTtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImpvaW5cIik7XG4gICAgICAgIHRoaXMuc2VuZFJlcXVlc3QodXJsLCBkYXRhKTtcbiAgICB9XG5cbiAgICBidWlsZFBheWxvYWQoYWN0aW9uVHlwZSwgYmV0QW10ID0gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJwbGF5ZXJJZFwiOiB0aGlzLnBsYXllcklkLFxuICAgICAgICAgICAgXCJhY3Rpb25UeXBlXCI6IGFjdGlvblR5cGUsXG4gICAgICAgICAgICBcImJldEFtdFwiOiBiZXRBbXRcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJ1aWxkVXJsKGVuZHBvaW50KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVVcmwgKyBlbmRwb2ludCArIFwiL1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlcjsiLCJpbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi9CdXR0b25cIjtcbmltcG9ydCBTbGlkZXIgZnJvbSBcIi4vU2xpZGVyXCI7XG5pbXBvcnQgQWN0aW9uIGZyb20gXCIuL0FjdGlvblwiO1xuXG5jbGFzcyBQYW5lbCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJldHMgPSBbMF07XG4gICAgICAgIHRoaXMucHJpbWFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnByaW1hcnlBY3Rpb24gPSBBY3Rpb24uQkVUO1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNlY29uZGFyeUFjdGlvbiA9IEFjdGlvbi5DSEVDSztcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlCZXQgPSAwO1xuICAgICAgICB0aGlzLnRlcnRpYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMudGVydGlhcnlBY3Rpb24gPSBBY3Rpb24uRk9MRDtcbiAgICAgICAgdGhpcy5zbGlkZXIgPSBuZXcgU2xpZGVyKHRoaXMuZ2FtZSwgXCJwYW5lbFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLnZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbHdheXNWaXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkgPSB0aGlzLm1ha2VCdXR0b24oMCwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5wcmltYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnByaW1hcnlBY3Rpb24sIHRoaXMucHJpbWFyeUJldCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDEzNSwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5zZWNvbmRhcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMuc2Vjb25kYXJ5QWN0aW9uLCB0aGlzLnNlY29uZGFyeUJldCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXkudGVydGlhcnkgPSB0aGlzLm1ha2VCdXR0b24oMjcwLCAwLCBcIm1lZFwiLCAoKSA9PiB0aGlzLnRlcnRpYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnRlcnRpYXJ5QWN0aW9uLCAwKSk7XG5cbiAgICAgICAgdGhpcy5zbGlkZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuaW5kZXhDaGFuZ2VkLmFkZCgoaW5kZXgpID0+IHRoaXMuc2V0UHJpbWFyeUJldCh0aGlzLmJldHNbaW5kZXhdKSwgdGhpcyk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNsaWRlcldoZWVsLmFkZCh0aGlzLnNpbmdsZVN0ZXBCZXQsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2xpZGVyID0gdGhpcy5zbGlkZXIuYmFyO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2xpZGVyLnkgPSA2MDtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnByaW1hcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnNlY29uZGFyeSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkudGVydGlhcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnNsaWRlcik7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgbWFrZUJ1dHRvbih4LCB5LCBzaXplLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYnV0dG9uID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIHgsIHksIHRoaXMua2V5KTtcbiAgICAgICAgYnV0dG9uLm9uSW5wdXRVcC5hZGQoY2FsbGJhY2spO1xuICAgICAgICBidXR0b24uc2V0RnJhbWVzKFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfb3V0XCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9kb3duXCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl91cFwiXG4gICAgICAgICk7XG4gICAgICAgIGJ1dHRvbi5zZXRUZXh0U3R5bGUodGhpcy5nYW1lLmNvbmZpZy5wYW5lbC50ZXh0U3R5bGUpO1xuICAgICAgICByZXR1cm4gYnV0dG9uO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIC8vIFBhbmVsIHVwZGF0ZXMgcmVxdWlyZSBwbGF5ZXJzJyBjdXJyZW50IGJldHMsIHNvIGlmXG4gICAgICAgIC8vIHRoZXJlIGlzIG5vIG5leHQgcGxheWVyIHdlIHNob3VsZG4ndCB1cGRhdGUgdGhlIGRpc3BsYXlcbiAgICAgICAgaWYgKCF0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgYWN0aW9uVGV4dCA9IHRoaXMuZ2FtZS5yb3VuZEJldCA9PT0gMCA/IFwiQkVUIFwiIDogXCJSQUlTRSBUT1xcblwiO1xuICAgICAgICBsZXQgcHJpbWFyeVRleHQgPSBhY3Rpb25UZXh0ICsgVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMucHJpbWFyeUJldCArIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQpO1xuICAgICAgICB0aGlzLmRpc3BsYXkucHJpbWFyeS5zZXRUZXh0KHByaW1hcnlUZXh0KTtcblxuICAgICAgICBsZXQgc2Vjb25kYXJ5VGV4dCA9IFwiQ0hFQ0tcIjtcbiAgICAgICAgaWYgKHRoaXMuc2Vjb25kYXJ5QWN0aW9uICE9PSBBY3Rpb24uQ0hFQ0spIHtcbiAgICAgICAgICAgIHNlY29uZGFyeVRleHQgPSBcIkNBTEwgXCIgKyBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5zZWNvbmRhcnlCZXQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGxheS5zZWNvbmRhcnkuc2V0VGV4dChzZWNvbmRhcnlUZXh0KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkudGVydGlhcnkuc2V0VGV4dChcIkZPTERcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLnZpc2libGUgPSB0aGlzLnZpc2libGU7XG4gICAgfVxuXG4gICAgc2V0QmV0cyhiZXRzKSB7XG4gICAgICAgIGlmIChiZXRzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIGJldHMuIFBhbmVsIG11c3QgYWx3YXlzIGhhdmUgYXQgbGVhc3Qgb25lIHZhbGlkIGJldC5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJldHMgPSBiZXRzO1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSBiZXRzWzBdO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRMZW5ndGgoYmV0cy5sZW5ndGgpO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRJbmRleCgwKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuc2V0RW5hYmxlZChiZXRzLmxlbmd0aCA+IDEpO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRQcmltYXJ5QmV0KGJldCkge1xuICAgICAgICB0aGlzLnByaW1hcnlCZXQgPSBiZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldFNlY29uZGFyeUJldChiZXQpIHtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlCZXQgPSBiZXQ7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QWN0aW9uID0gYmV0ID09PSAwID8gQWN0aW9uLkNIRUNLIDogQWN0aW9uLkJFVDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSGlkZSBvciBzaG93IHRoZSBlbnRpcmUgcGFuZWxcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGVcbiAgICAgKi9cbiAgICBzZXRWaXNpYmxlKHZpc2libGUpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdmlzaWJsZSB8fCB0aGlzLmFsd2F5c1Zpc2libGU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEluY3JlbWVudCBvciBkZWNyZW1lbnQgdGhpcy5wcmltYXJ5QmV0XG4gICAgICogQHBhcmFtIHtQaGFzZXIuTW91c2Uud2hlZWxEZWx0YX0gbW9kaWZpZXIgLSArMSBvciAtMVxuICAgICAqL1xuICAgIHNpbmdsZVN0ZXBCZXQobW9kaWZpZXIpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5zbGlkZXIuaW5kZXggKyBtb2RpZmllcjtcbiAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPD0gdGhpcy5zbGlkZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnNsaWRlci5zZXRJbmRleChpbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmVsOyIsImltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5pbXBvcnQgQ2FyZE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NhcmRNYW5hZ2VyXCI7XG5cbmNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgbWFuYWdlcikge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuXG4gICAgICAgIHRoaXMuaWQgPSBudWxsO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IG51bGw7XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc2l0dGluZ091dCA9IG51bGw7XG4gICAgICAgIHRoaXMuc2VhdCA9IG51bGw7XG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMucm91bmRCZXQgPSAwOyAgLy8gU3VtIGJldHMgYnkgcGxheWVyIGluIGN1cnJlbnQgYmV0dGluZyByb3VuZFxuXG4gICAgICAgIHRoaXMuaXNEZWFsZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc05leHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pc1VzZXIgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7fTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG5cbiAgICAgICAgdGhpcy5jYXJkcyA9IG5ldyBDYXJkTWFuYWdlcih0aGlzLmdhbWUpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoZGF0YSkge1xuICAgICAgICB0aGlzLmlkID0gZGF0YS5pZDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBkYXRhLnVzZXJJZDtcbiAgICAgICAgdGhpcy5iYWxhbmNlID0gZGF0YS5iYWxhbmNlO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBkYXRhLnNpdHRpbmdPdXQ7XG4gICAgICAgIHRoaXMuc2VhdCA9IGRhdGEuc2VhdDtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICB0aGlzLmlzVXNlciA9IGRhdGEuaXNVc2VyO1xuXG4gICAgICAgIHRoaXMuY2FyZHMuaW5pdGlhbGl6ZSgyKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhY2tncm91bmQgPSB0aGlzLmRpc3BsYXlHcm91cC5jcmVhdGUoMCwgMCwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlUmVjdCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIC0yMCwgXCJcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5Lm5hbWUpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDIwLCBcIlwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuYmFsYW5jZSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzID0gdGhpcy5jYXJkcy5kaXNwbGF5R3JvdXA7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcy5jZW50ZXJYID0gMDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLmNlbnRlclkgPSAtMTIwO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmNhcmRzKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgXCJkZWFsZXJCdXR0b25cIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24ubGVmdCA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLmxlZnQgKyA1O1xuICAgICAgICB0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uLmJvdHRvbSA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLmJvdHRvbSAtIDU7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuZGVhbGVyQnV0dG9uKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwicmVkQ2lyY2xlXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvci5yaWdodCA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLnJpZ2h0IC0gNTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IuYm90dG9tID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQuYm90dG9tIC0gNTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS50ZXh0ID0gdGhpcy5uYW1lO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS50ZXh0ID0gVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuYmFsYW5jZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24udmlzaWJsZSA9IHRoaXMuaXNEZWFsZXIgPT09IHRydWU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yLnZpc2libGUgPSB0aGlzLmlzTmV4dCA9PT0gdHJ1ZTtcbiAgICB9XG5cbiAgICB1cGRhdGUoZGF0YSkge1xuICAgICAgICAvLyBUT0RPIC0gRmxlc2ggb3V0IHRoZSByZXN0IG9mIHRoZSBkYXRhIC0tIGRvIEkgbGlrZSB0aGlzIG1ldGhvZD9cbiAgICAgICAgdGhpcy5iYWxhbmNlID0gZGF0YS5iYWxhbmNlID09PSB1bmRlZmluZWQgPyB0aGlzLmJhbGFuY2UgOiBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuaXNEZWFsZXIgPSBkYXRhLmlzRGVhbGVyID09PSB1bmRlZmluZWQgPyB0aGlzLmlzRGVhbGVyIDogZGF0YS5pc0RlYWxlcjtcbiAgICAgICAgdGhpcy5pc05leHQgPSBkYXRhLmlzTmV4dCA9PT0gdW5kZWZpbmVkID8gdGhpcy5pc05leHQgOiBkYXRhLmlzTmV4dDtcbiAgICAgICAgdGhpcy5yb3VuZEJldCA9IGRhdGEucm91bmRCZXQgPT09IHVuZGVmaW5lZCA/IHRoaXMucm91bmRCZXQgOiBkYXRhLnJvdW5kQmV0O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjsiLCJpbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuXG5jbGFzcyBQb3Qge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5hbW91bnQgPSAwO1xuICAgICAgICB0aGlzLnNwcml0ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gdGhpcy5tYWtlQnRuKDAsIDAsIFwiXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVJlY3QsICgpID0+IHt9KTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUudGV4dC50ZXh0ID0gVXRpbC5wYXJzZUN1cnJlbmN5KHRoaXMuYW1vdW50KTtcbiAgICB9XG5cbiAgICBzZXRBbW91bnQoYW1vdW50KSB7XG4gICAgICAgIHRoaXMuYW1vdW50ID0gYW1vdW50O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBtYWtlQnRuKHgsIHksIHRleHQsIHRleHR1cmUsIGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQgPSB0aGlzKSB7XG4gICAgICAgIGxldCBidG4gPSB0aGlzLmdhbWUuYWRkLmJ1dHRvbih4LCB5LCB0ZXh0dXJlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0KTtcbiAgICAgICAgYnRuLmFuY2hvci5zZXRUbygwLjUpO1xuXG4gICAgICAgIGxldCBidG5UZXh0ID0gdGhpcy5nYW1lLmFkZC50ZXh0KDAsIDAsIHRleHQpO1xuICAgICAgICBidG5UZXh0LmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICBidG4uYWRkQ2hpbGQoYnRuVGV4dCk7XG4gICAgICAgIGJ0bi50ZXh0ID0gYnRuVGV4dDtcblxuICAgICAgICByZXR1cm4gYnRuO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG90OyIsIi8qKlxuICogQSBzbGlkZXIgVUkgZWxlbWVudFxuICpcbiAqIFJlcHJlc2VudGVkIGJ5IGEgYmFyIHNwcml0ZSBhbmQgYSBtYXJrZXIgc3ByaXRlLiBEZXNwaXRlIGhvdyBpdCBtYXlcbiAqIGxvb2ssIGFsbCBpbnB1dCBvY2N1cnMgb24gdGhlIGJhciBhbmQgdXBkYXRlcyBhcmUgbWFkZSB0byB0aGVcbiAqIG1hcmtlcidzIHBvc2l0aW9uIGJhc2VkIG9uIHRob3NlIGlucHV0cy5cbiAqL1xuY2xhc3MgU2xpZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXkpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuYmFyID0gbnVsbDsgIC8vIFRoZSBzbGlkZXIgYmFyIHNwcml0ZVxuICAgICAgICB0aGlzLm1hcmtlciA9IG51bGw7ICAvLyBUaGUgZHJhZ2dhYmxlIG1hcmtlciBzcHJpdGVcbiAgICAgICAgdGhpcy5pbmRleCA9IDA7ICAvLyBDdXJyZW50IGluZGV4IG9mIG1hcmtlclxuICAgICAgICB0aGlzLmxlbmd0aCA9IDE7ICAvLyBUb3RhbCBudW1iZXIgb2YgaW5kaWNlc1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7fTtcbiAgICAgICAgdGhpcy5pbmRleENoYW5nZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNsaWRlcldoZWVsID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5iYXIgPSB0aGlzLmdhbWUuYWRkLmltYWdlKDAsIDAsIHRoaXMua2V5LCBcInNsaWRlcl9iYXJcIik7XG4gICAgICAgIHRoaXMuYmFyLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0RG93bi5hZGQodGhpcy5zdGFydERyYWcsIHRoaXMpO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dFVwLmFkZCh0aGlzLnN0b3BEcmFnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCgoKSA9PiB0aGlzLmVuYWJsZVNsaWRlcldoZWVsKHRydWUpKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHRoaXMuZW5hYmxlU2xpZGVyV2hlZWwoZmFsc2UpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhciA9IHRoaXMuYmFyO1xuXG4gICAgICAgIHRoaXMubWFya2VyID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgdGhpcy5rZXksIFwic2xpZGVyX21hcmtlclwiKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuYW5jaG9yLnNldFRvKDAuNSwgMCk7XG4gICAgICAgIHRoaXMubWFya2VyLmJvdHRvbSA9IHRoaXMuYmFyLmJvdHRvbTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1hcmtlciA9IHRoaXMubWFya2VyO1xuICAgICAgICB0aGlzLmJhci5hZGRDaGlsZCh0aGlzLm1hcmtlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIHNsaWRlciBkcmFnZ2luZyBhbmQgaW5pdGlhdGUgZmlyc3QgZHJhZyBldmVudFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlNwcml0ZX0gYmFyIC0gVGhlIGJhciBzcHJpdGUgdGhhdCB3YXMgY2xpY2tlZFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlBvaW50ZXJ9IHBvaW50ZXIgLSBUaGUgcG9pbnRlciB3aGljaCBpbml0aWF0ZWQgdGhlIGNsaWNrXG4gICAgICovXG4gICAgc3RhcnREcmFnKGJhciwgcG9pbnRlcikge1xuICAgICAgICAvLyBJbml0aWFsIGNhbGwgdG8gdXBkYXRlRHJhZyBhbGxvd3MgY2hhbmdpbmcgYmV0IHdpdGggY2xpY2sgb24gYmFyXG4gICAgICAgIHRoaXMudXBkYXRlRHJhZyhwb2ludGVyLCBwb2ludGVyLngsIHBvaW50ZXIueSk7XG4gICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5hZGRNb3ZlQ2FsbGJhY2sodGhpcy51cGRhdGVEcmFnLCB0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBEaXNhYmxlIHNsaWRlciBkcmFnZ2luZ1xuICAgICAqL1xuICAgIHN0b3BEcmFnKCkge1xuICAgICAgICB0aGlzLmdhbWUuaW5wdXQuZGVsZXRlTW92ZUNhbGxiYWNrKHRoaXMudXBkYXRlRHJhZywgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgQ2FsY3VsYXRlIHNsaWRlciBpbmRleCBiYXNlZCBvbiBkcmFnIGlucHV0XG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBzbGlkaW5nIHBvaW50ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIFRoZSB4IGNvb3JkaW5hdGUgb2YgcG9pbnRlclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IC0gVGhlIHkgY29vcmRpbmF0ZSBvZiBwb2ludGVyXG4gICAgICovXG4gICAgdXBkYXRlRHJhZyhwb2ludGVyLCB4LCB5KSB7XG4gICAgICAgIGxldCBsb2NhbFggPSB4IC0gdGhpcy5iYXIud29ybGQueDsgIC8vIENsaWNrIHBvcyBpbiByZWxhdGlvbiB0byBiYXJcblxuICAgICAgICAvLyBQcmV2ZW50IGRyYWdnaW5nIHBhc3QgYmFyIGJvdW5kc1xuICAgICAgICBpZiAobG9jYWxYIDwgMCkge1xuICAgICAgICAgICAgbG9jYWxYID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbFggPiB0aGlzLmJhci53aWR0aCkge1xuICAgICAgICAgICAgbG9jYWxYID0gdGhpcy5iYXIud2lkdGg7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTdWJ0cmFjdCAxIGZyb20gbGVuZ3RoIGJlY2F1c2UgbGVuZ3RoIGlzIDEtaW5kZXhlZCwgaW5kaWNlcyBhcmUgMC1pbmRleGVkXG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5yb3VuZChsb2NhbFggLyB0aGlzLmJhci53aWR0aCAqICh0aGlzLmxlbmd0aCAtIDEpKTtcbiAgICAgICAgdGhpcy5zZXRJbmRleChpbmRleCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBpbmRleCBvZiB0aGUgc2xpZGVyIGFuZCByZXBvcnQgdGhlIG5ldyB2YWx1ZVxuICAgICAqXG4gICAgICogT3B0aW9uYWxseSB1cGRhdGUgdGhlIHZpc3VhbCBwb3NpdGlvbiBvZiB0aGUgbWFya2VyIG9uIHRoZSBzbGlkZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSBOZXcgaW5kZXggdG8gc2V0IG9uIHNsaWRlclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VwZGF0ZVBvcz10cnVlXSAtIFVwZGF0ZSB0aGUgcG9zaXRpb24gb2YgbWFya2VyP1xuICAgICAqL1xuICAgIHNldEluZGV4KGluZGV4LCB1cGRhdGVQb3MgPSB0cnVlKSB7XG4gICAgICAgIGlmIChpbmRleCAhPT0gdGhpcy5pbmRleCkge1xuICAgICAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICAgICAgdGhpcy5pbmRleENoYW5nZWQuZGlzcGF0Y2goaW5kZXgpO1xuXG4gICAgICAgICAgICBpZiAodXBkYXRlUG9zKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdoZW4gb25seSBvbmUgYmV0IGF2YWlsYWJsZSwgaXQncyBhIG1heCBiZXRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrZXIueCA9IHRoaXMuYmFyLndpZHRoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN1YnRyYWN0IDEgZnJvbSBsZW5ndGggYmVjYXVzZSBsZW5ndGggaXMgMS1pbmRleGVkLCBpbmRpY2VzIGFyZSAwLWluZGV4ZWRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXJrZXIueCA9IHRoaXMuYmFyLndpZHRoIC8gKHRoaXMubGVuZ3RoIC0gMSkgKiB0aGlzLmluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFVwZGF0ZSB0aGUgbGVuZ3RoIHByb3BlcnR5XG4gICAgICpcbiAgICAgKiBUaGUgbGVuZ3RoIHByb3BlcnR5IGRlc2NyaWJlcyBob3cgbWFueSBkaXNjcmV0ZSBiZXRzIHRoZSBzbGlkZXIgYmFyXG4gICAgICogbXVzdCByZXByZXNlbnQuIFRoZSBzbGlkZXIgZG9lcyBub3QgY2FyZSBhYm91dCB3aGF0IHRoZSBzcGVjaWZpYyBiZXRcbiAgICAgKiBpdCByZXByZXNlbnRzIGlzLCBvbmx5IHRoYXQgaXQgaGFzIHNvbWUgbnVtYmVyIG9mIGluZGljZXMgYWxvbmcgaXRzXG4gICAgICogbGVuZ3RoIGFuZCB0aGF0IGl0IG11c3QgcmVwb3J0IGl0cyBpbmRleCB0byBsaXN0ZW5lcnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIG5ldyBsZW5ndGggdG8gc2V0XG4gICAgICovXG4gICAgc2V0TGVuZ3RoKGxlbmd0aCkge1xuICAgICAgICBpZiAobGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3Qgc2V0IHNsaWRlciBsZW5ndGggbGVzcyB0aGFuIDFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAobGVuZ3RoID4gdGhpcy5iYXIud2lkdGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IFNldHRpbmcgc2xpZGVyIHN0b3BzIGdyZWF0ZXIgdGhhbiBsZW5ndGggbWF5IHJlc3VsdCBpbiB1bmV4cGVjdGVkIGJlaGF2aW9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBvciBkaXNhYmxlIHRoZSBzbGlkZXJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuYWJsZWQgLSBJcyB0aGUgc2xpZGVyIGVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0RW5hYmxlZChlbmFibGVkKSB7XG4gICAgICAgIHRoaXMuYmFyLmlucHV0RW5hYmxlZCA9IGVuYWJsZWQ7XG5cbiAgICAgICAgbGV0IHRpbnQgPSBlbmFibGVkID8gMHhGRkZGRkYgOiAweDgwODA4MDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhci50aW50ID0gdGludDtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1hcmtlci50aW50ID0gdGludDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSBkaXNwYXRjaCBvZiBzaWduYWwgb24gd2hlZWwgc2Nyb2xsXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gSXMgdGhlIGNhbGxiYWNrIGVuYWJsZWQgb3IgZGlzYWJsZWQ/XG4gICAgICovXG4gICAgZW5hYmxlU2xpZGVyV2hlZWwoZW5hYmxlZCkge1xuICAgICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmlucHV0Lm1vdXNlLm1vdXNlV2hlZWxDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlcldoZWVsLmRpc3BhdGNoKHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS53aGVlbERlbHRhKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQubW91c2UubW91c2VXaGVlbENhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyOyIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJwYW5lbFwiOiB7XG4gICAgXCJwYWRkaW5nXCI6IDEwLFxuICAgIFwidGV4dFN0eWxlXCI6IHtcbiAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgIFwiYWxpZ25cIjogXCJjZW50ZXJcIlxuICAgIH0sXG4gICAgXCJwb3NcIjoge1xuICAgICAgXCJ4XCI6IDE0ODAsXG4gICAgICBcInlcIjogNzkwXG4gICAgfVxuICB9LFxuICBcInNlYXRzXCI6IHtcbiAgICBcIjEwXCI6IFtcbiAgICAgIHtcInhcIjogOTEwLCBcInlcIjogMjMwfSxcbiAgICAgIHtcInhcIjogMTI0NCwgXCJ5XCI6IDIzMH0sXG4gICAgICB7XCJ4XCI6IDE0ODQsIFwieVwiOiAzNDZ9LFxuICAgICAge1wieFwiOiAxNDg0LCBcInlcIjogNjQyfSxcbiAgICAgIHtcInhcIjogMTI0NCwgXCJ5XCI6IDc1OH0sXG4gICAgICB7XCJ4XCI6IDkxMCwgXCJ5XCI6IDc1OH0sXG4gICAgICB7XCJ4XCI6IDU3NiwgXCJ5XCI6IDc1OH0sXG4gICAgICB7XCJ4XCI6IDM0MiwgXCJ5XCI6IDY0Mn0sXG4gICAgICB7XCJ4XCI6IDM0MiwgXCJ5XCI6IDM0Nn0sXG4gICAgICB7XCJ4XCI6IDU3NiwgXCJ5XCI6IDIzMH1cbiAgICBdLFxuXG4gICAgLy8gVE9ET1xuICAgIFwiOFwiOiBbXSxcbiAgICBcIjlcIjogW11cbiAgfVxufSIsImltcG9ydCBCdXR0b24gZnJvbSBcIi4uL2NsYXNzZXMvQnV0dG9uXCI7XG5cbmNsYXNzIEJ1eUluTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnNlYXRzID0ge307XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmJ1eUluUmVxdWVzdGVkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5ncm91cFZpc2libGUgPSB0cnVlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoc2VhdENvbmZpZywgb2NjdXBpZWRTZWF0cykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXRDb25maWcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgc2VhdENvbmZpZ1tpXS54LCBzZWF0Q29uZmlnW2ldLnksIHRoaXMua2V5LCB0aGlzLmJ1dHRvbkNsaWNrZWQsIHRoaXMpO1xuICAgICAgICAgICAgYnV0dG9uLnNlYXROdW0gPSBpOyAvLyBTdG9yZSBmb3IgdXNlIG9uIGNsaWNrXG4gICAgICAgICAgICBidXR0b24uc2V0RnJhbWVzKFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX292ZXJcIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9vdXRcIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9kb3duXCIsXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fdXBcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRUZXh0KFwiQnV5IEluXCIpO1xuICAgICAgICAgICAgdGhpcy5zZWF0c1tpXSA9IHtcbiAgICAgICAgICAgICAgICBcImJ1dHRvblwiOiBidXR0b24sXG4gICAgICAgICAgICAgICAgXCJvY2N1cGllZFwiOiBvY2N1cGllZFNlYXRzLmluZGV4T2YoaSkgIT09IC0xXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKGJ1dHRvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgbmV3UGxheWVyKHBsYXllckRhdGEpIHtcbiAgICAgICAgdGhpcy5zZWF0c1twbGF5ZXJEYXRhLnNlYXRdLm9jY3VwaWVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgZm9yIChsZXQgc2VhdE51bSBpbiB0aGlzLnNlYXRzKSB7XG4gICAgICAgICAgICBsZXQgc2VhdCA9IHRoaXMuc2VhdHNbc2VhdE51bV07XG4gICAgICAgICAgICBzZWF0LmJ1dHRvbi52aXNpYmxlID0gIXNlYXQub2NjdXBpZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAudmlzaWJsZSA9IHRoaXMuZ3JvdXBWaXNpYmxlO1xuICAgIH1cblxuICAgIGJ1dHRvbkNsaWNrZWQoYnV0dG9uKSB7XG4gICAgICAgIHRoaXMuYnV5SW5SZXF1ZXN0ZWQuZGlzcGF0Y2goYnV0dG9uLnNlYXROdW0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnV5SW5NYW5hZ2VyOyIsImltcG9ydCBDYXJkIGZyb20gXCIuLi9jbGFzc2VzL0NhcmRcIjtcblxuY2xhc3MgQ2FyZE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5jYXJkcyA9IFtdO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKG51bV9jYXJkcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bV9jYXJkczsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2FyZCA9IG5ldyBDYXJkKHRoaXMuZ2FtZSwgdGhpcyk7XG4gICAgICAgICAgICBjYXJkLmluaXRpYWxpemUoe30pO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNhcmRzLnB1c2goY2FyZCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQoY2FyZC5zcHJpdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWxpZ24oLTEsIDEsIHRoaXMuY2FyZHNbMF0uc3ByaXRlLndpZHRoICogMS4yLCAwKTtcbiAgICB9XG5cbiAgICBzZXRDYXJkTmFtZXMobmFtZXMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS5uYW1lID0gbmFtZXNbaV07XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLnVwZGF0ZURpc3BsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZE1hbmFnZXI7IiwiaW1wb3J0IFBsYXllciBmcm9tIFwiLi4vY2xhc3Nlcy9QbGF5ZXJcIjtcblxuY2xhc3MgUGxheWVyTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgdXNlcklkLCBzZWF0Q29uZmlnKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMudXNlcklkID0gdXNlcklkO1xuICAgICAgICB0aGlzLnNlYXRDb25maWcgPSBzZWF0Q29uZmlnO1xuXG4gICAgICAgIHRoaXMucGxheWVycyA9IFtdOyAgLy8gRGlyZWN0IGFjY2VzcyB0byB0aGUgUGxheWVyIG9iamVjdHNcbiAgICAgICAgdGhpcy51c2VyUGxheWVyID0gbnVsbDsgIC8vIFRoZSB1c2VyJ3MgcGxheWVyIG9iamVjdCwgaWYgYXZhaWxhYmxlXG4gICAgICAgIHRoaXMubmV4dFBsYXllciA9IG51bGw7ICAvLyBUaGUgcGxheWVyIHRoYXQgdGhlIGdhbWUgZXhwZWN0cyB0byBhY3QgbmV4dFxuXG4gICAgICAgIC8vIENvbnRhaW5zIGFsbCBkaXNwbGF5IGVsZW1lbnRzIGZvciBhbGwgcGxheWVycyBpbiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKHBsYXllckRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm5ld1BsYXllcihwbGF5ZXJEYXRhW2ldKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMuZ2FtZSwgdGhpcyk7XG4gICAgICAgIHBsYXllci5pbml0aWFsaXplKHBsYXllckRhdGEpO1xuICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnggPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS54O1xuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnkgPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS55O1xuXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChwbGF5ZXIuZGlzcGxheUdyb3VwKTtcblxuICAgICAgICBpZiAocGxheWVyLnVzZXJJZCA9PT0gdGhpcy51c2VySWQpIHtcbiAgICAgICAgICAgIHRoaXMudXNlclBsYXllciA9IHBsYXllcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEJ5SWQoaWQpIHtcbiAgICAgICAgLy8gVE9ETyAtIERvIHRoaXMgd2l0aG91dCBpdGVyYXRpbmcgLS0gYnVpbGQgbWFwIG9uIGluaXQ/XG4gICAgICAgIC8vIFRPRE8gLSBTaG91bGQgdGhpcyBldmVyIHJldHVybiBudWxsP1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCBhIGxpc3Qgb2YgYWxsIG9jY3VwaWVkIHNlYXRzIGF0IHRoZSB0YWJsZVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gLSBUaGUgSURzIG9mIG9jY3VwaWVkIHNlYXRzXG4gICAgICovXG4gICAgZ2V0T2NjdXBpZWRTZWF0cygpIHtcbiAgICAgICAgbGV0IG9jY3VwaWVkU2VhdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG9jY3VwaWVkU2VhdHMucHVzaCh0aGlzLnBsYXllcnNbaV0uc2VhdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9jY3VwaWVkU2VhdHM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXJNYW5hZ2VyOyIsImNvbnN0IGlzU3RyaW5nID0gdmFsID0+IHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnO1xuY29uc3QgaXNCbG9iID0gdmFsID0+IHZhbCBpbnN0YW5jZW9mIEJsb2I7XG5cbnBvbHlmaWxsLmNhbGwodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgPyB3aW5kb3cgOiB0aGlzIHx8IHt9KTtcblxuZnVuY3Rpb24gcG9seWZpbGwoKSB7XG4gIGlmIChpc1N1cHBvcnRlZC5jYWxsKHRoaXMpKSByZXR1cm47XG5cbiAgaWYgKCEoJ25hdmlnYXRvcicgaW4gdGhpcykpIHRoaXMubmF2aWdhdG9yID0ge307XG4gIHRoaXMubmF2aWdhdG9yLnNlbmRCZWFjb24gPSBzZW5kQmVhY29uLmJpbmQodGhpcyk7XG59O1xuXG5mdW5jdGlvbiBzZW5kQmVhY29uKHVybCwgZGF0YSkge1xuICBjb25zdCBldmVudCA9IHRoaXMuZXZlbnQgJiYgdGhpcy5ldmVudC50eXBlO1xuICBjb25zdCBzeW5jID0gZXZlbnQgPT09ICd1bmxvYWQnIHx8IGV2ZW50ID09PSAnYmVmb3JldW5sb2FkJztcblxuICBjb25zdCB4aHIgPSAoJ1hNTEh0dHBSZXF1ZXN0JyBpbiB0aGlzKSA/IG5ldyBYTUxIdHRwUmVxdWVzdCgpIDogbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7XG4gIHhoci5vcGVuKCdQT1NUJywgdXJsLCAhc3luYyk7XG4gIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJyovKicpO1xuXG5cbiAgaWYgKGlzU3RyaW5nKGRhdGEpKSB7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKTtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gJ3RleHQvcGxhaW4nO1xuICB9IGVsc2UgaWYgKGlzQmxvYihkYXRhKSAmJiBkYXRhLnR5cGUpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgZGF0YS50eXBlKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgeGhyLnNlbmQoZGF0YSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xuICByZXR1cm4gKCduYXZpZ2F0b3InIGluIHRoaXMpICYmICgnc2VuZEJlYWNvbicgaW4gdGhpcy5uYXZpZ2F0b3IpO1xufSIsImltcG9ydCBjb25maWcgZnJvbSBcIi4uL2NvbmZpZ1wiO1xuaW1wb3J0IENvbnRyb2xsZXIgZnJvbSBcIi4uL2NsYXNzZXMvQ29udHJvbGxlclwiO1xuXG5jbGFzcyBCb290IGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmdhbWUuaW5pdGlhbERhdGEgPSB0aGlzLmF1Z21lbnRJbml0aWFsRGF0YShpbml0aWFsRGF0YSk7XG4gICAgICAgIHRoaXMuZ2FtZS5jb25maWcgPSBjb25maWc7XG5cbiAgICAgICAgLy8gVE9ETyAtIFRoaXMgc2hvdWxkIGNvbWUgZnJvbSBzb21ld2hlcmUgZHluYW1pY1xuICAgICAgICB0aGlzLmdhbWUucnVsZXMgPSB7XG4gICAgICAgICAgICBhbnRlOiAwLFxuICAgICAgICAgICAgYmxpbmRzOiB7XG4gICAgICAgICAgICAgICAgc21hbGw6IDI1LFxuICAgICAgICAgICAgICAgIGJpZzogNTBcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlO1xuICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcih0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5wbGF5ZXJJZCwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRva2VuKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydChcImxvYWRcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQFN1bW1hcnkgQ2FsY3VsYXRlIGFkZGl0aW9uYWwgdmFsdWVzIHRvIHN0b3JlIG9uIGdhbWUuaW5pdGlhbERhdGFcbiAgICAgKlxuICAgICAqIFRvIHNhdmUgb24gc2VydmVyLXNpZGUgcHJvY2Vzc2luZyBhbmQgZGF0YS10cmFuc2ZlciBsb2FkLCB0aGlzXG4gICAgICogbWV0aG9kIGlzIGEgcGxhY2UgdG8gZ2VuZXJhdGUgYWRkaXRpb25hbCBkYXRhIG5lZWRlZCBieSB0aGUgZ2FtZVxuICAgICAqIHdoaWNoIG1heSBiZSBkZXJpdmVkIGZyb20gdGhlIGRhdGEgc2VudCBmcm9tIHRoZSBiYWNrIGVuZC5cbiAgICAgKi9cbiAgICBhdWdtZW50SW5pdGlhbERhdGEoaW5pdGlhbERhdGEpIHtcbiAgICAgICAgaW5pdGlhbERhdGEub2NjdXBpZWRTZWF0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluaXRpYWxEYXRhLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGluaXRpYWxEYXRhLm9jY3VwaWVkU2VhdHMucHVzaChpbml0aWFsRGF0YS5wbGF5ZXJzW2ldLnNlYXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluaXRpYWxEYXRhO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQm9vdDsiLCJjbGFzcyBMb2FkIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBwcmVsb2FkKCkge1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcImJhY2tncm91bmRcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9iYWNrZ3JvdW5kLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJkZWFsZXJCdXR0b25cIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9kZWFsZXJidXR0b24ucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcInJlZENpcmNsZVwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3JlZGNpcmNsZS5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJjYXJkc1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NhcmRzLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NhcmRzLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJwYW5lbFwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3BhbmVsLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3BhbmVsLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJidXlJblwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2J1eWluLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2J1eWluLmpzb25cIik7XG5cbiAgICAgICAgdGhpcy5nYW1lLnRleHR1cmVzID0gdGhpcy5jcmVhdGVDdXN0b21UZXh0dXJlcygpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibWFpblwiKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDdXN0b21UZXh0dXJlcygpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0ge307XG5cbiAgICAgICAgbGV0IGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoNCwgMHgwMDAwMDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgxMDAsIDEwMCwgMTAwLCAxMDApO1xuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlU3F1YXJlXCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgMzAwLCAxMDApO1xuXG4gICAgICAgIHRleHR1cmVzW1wid2hpdGVSZWN0XCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG5cbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0dXJlcztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYWQ7IiwiaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi4vY2xhc3Nlcy9BY3Rpb24uanNcIjtcbmltcG9ydCBCdXlJbk1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0J1eUluTWFuYWdlclwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuaW1wb3J0IFBhbmVsIGZyb20gXCIuLi9jbGFzc2VzL1BhbmVsXCI7XG5pbXBvcnQgUGxheWVyTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvUGxheWVyTWFuYWdlclwiO1xuaW1wb3J0IFBvdCBmcm9tIFwiLi4vY2xhc3Nlcy9Qb3RcIjtcbmltcG9ydCBQb2tlciBmcm9tIFwiLi4vUG9rZXJcIjtcbmltcG9ydCBTU0UgZnJvbSBcIi4uL1NTRVwiO1xuXG5jbGFzcyBNYWluIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLnRhYmxlX3NzZSA9IG5ldyBTU0UodGhpcy5nYW1lLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVTU0VVcmwpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlID0gbmV3IFNTRSh0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VyU1NFVXJsKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInVubG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5kaXNjb25uZWN0QmVhY29uKCk7XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgXCJiYWNrZ3JvdW5kXCIpO1xuICAgICAgICB0aGlzLm5ld0hhbmRCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAxMDAsIFwibmV3XFxuaGFuZFwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMubmV3SGFuZCk7XG4gICAgICAgIHRoaXMuZGVhbEJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDIyMCwgXCJkZWFsXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5kZWFsKTtcbiAgICAgICAgdGhpcy5sZWF2ZUJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDM0MCwgXCJsZWF2ZVwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMubGVhdmVUYWJsZSk7XG4gICAgICAgIHRoaXMuYmJCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCA0NjAsIFwiQkJcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmJiKTtcbiAgICAgICAgdGhpcy5zYkJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDU4MCwgXCJTQlwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuc2IpO1xuXG4gICAgICAgIGNvbnN0IG51bVNlYXRzID0gMTA7ICAgIC8vIFRPRE8gLSBNYWtlIGR5bmFtaWNcbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMgPSBuZXcgUGxheWVyTWFuYWdlcih0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VySWQsIHRoaXMuZ2FtZS5jb25maWcuc2VhdHNbbnVtU2VhdHNdKTtcbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuaW5pdGlhbGl6ZSh0aGlzLmdhbWUuaW5pdGlhbERhdGEucGxheWVycywgdGhpcy5nYW1lLmNvbmZpZy5zZWF0c1tudW1TZWF0c10pO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZCA9IG5ldyBDYXJkTWFuYWdlcih0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuaW5pdGlhbGl6ZSg1KTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmRpc3BsYXlHcm91cC5jZW50ZXJYID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclg7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wb3QgPSBuZXcgUG90KHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wb3QuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5zcHJpdGUuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYO1xuICAgICAgICB0aGlzLmdhbWUucG90LnNwcml0ZS5jZW50ZXJZID0gdGhpcy5nYW1lLndvcmxkLmNlbnRlclkgLSAxNDA7XG5cbiAgICAgICAgLy8gVE9ETyAtIFRoZXNlIHNob3VsZCBnbyBzb21ld2hlcmUgZWxzZS4gTWF5YmUgaW4gUG90P1xuICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsID0gbmV3IFBhbmVsKHRoaXMuZ2FtZSwgXCJwYW5lbFwiKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmRpc3BsYXlHcm91cC54ID0gdGhpcy5nYW1lLmNvbmZpZy5wYW5lbC5wb3MueDtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmRpc3BsYXlHcm91cC55ID0gdGhpcy5nYW1lLmNvbmZpZy5wYW5lbC5wb3MueTtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLmFsd2F5c1Zpc2libGUgPSB0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbiA9IG5ldyBCdXlJbk1hbmFnZXIodGhpcy5nYW1lLCBcImJ1eUluXCIpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uaW5pdGlhbGl6ZSh0aGlzLmdhbWUuY29uZmlnLnNlYXRzW251bVNlYXRzXSwgdGhpcy5nYW1lLnBsYXllcnMuZ2V0T2NjdXBpZWRTZWF0cygpKTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdIYW5kXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3SGFuZDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJvYXJkLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBvdC5zZXRBbW91bnQoMCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV07XG4gICAgICAgICAgICAgICAgcGxheWVyLmNhcmRzLnJlc2V0KCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGlzRGVhbGVyOiBwbGF5ZXIuaWQgPT09IGRhdGEuZGVhbGVyLFxuICAgICAgICAgICAgICAgICAgICBpc05leHQ6IHBsYXllci5pZCA9PT0gZGF0YS5uZXh0LFxuICAgICAgICAgICAgICAgICAgICByb3VuZEJldDogMFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldCgwKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJkZWFsXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVhbDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRCZXRzKFBva2VyLmdlbmVyYXRlUmFpc2VzKHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuc21hbGwsIHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuYmlnLCB0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlCZXQoUG9rZXIuZ2V0TWluQmV0KHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0VmlzaWJsZSh0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID09PSB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImVtdWxhdGVEZWFsXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJlbXVsYXRlRGVhbDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcGxheWVyRGF0YSA9IGRhdGFbaV07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQocGxheWVyRGF0YS5wbGF5ZXJJZCkuY2FyZHMuc2V0Q2FyZE5hbWVzKHBsYXllckRhdGEuaG9sZGluZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwibmV3Um91bmRcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdSb3VuZDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZFJhaXNlID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnBsYXllcnMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV0udXBkYXRlKHtyb3VuZEJldDogMH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldCgwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiYWN0aW9uXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWN0aW9uOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQuc2V0Q2FyZE5hbWVzKGRhdGEuYm9hcmQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5wbGF5ZXJJZCkudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBiYWxhbmNlOiBkYXRhLnBsYXllckJhbGFuY2UsXG4gICAgICAgICAgICAgICAgaXNOZXh0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICByb3VuZEJldDogZGF0YS5wbGF5ZXJSb3VuZEJldFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCkudXBkYXRlKHtpc05leHQ6IHRydWV9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wb3Quc2V0QW1vdW50KGRhdGEucG90KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IGRhdGEucm91bmRCZXQ7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IGRhdGEucm91bmRSYWlzZTtcblxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldChQb2tlci5nZXRNaW5CZXQodGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJoYW5kQ29tcGxldGVcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoYW5kQ29tcGxldGU6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS53aW5uZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHdpbm5lciA9IGRhdGEud2lubmVyc1tpXTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKHdpbm5lci5pZCkudXBkYXRlKHtiYWxhbmNlOiB3aW5uZXIuYmFsYW5jZX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdQbGF5ZXJcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1BsYXllcjogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV3UGxheWVyKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLm5ld1BsYXllcihkYXRhKTtcbiAgICAgICAgfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy51c2VyX3NzZS5hZGRMaXN0ZW5lcihcImRlYWxcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRlYWw6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIuY2FyZHMuc2V0Q2FyZE5hbWVzKGRhdGEuaG9sZGluZ3MpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlckxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnByaW1hcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZWNvbmRhcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC50ZXJ0aWFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLmJ1eUluUmVxdWVzdGVkLmFkZCh0aGlzLmdhbWUuY29udHJvbGxlci5qb2luLCB0aGlzLmdhbWUuY29udHJvbGxlcik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSb3V0ZSBhY3Rpb25zIHRvIGNvbnRyb2xsZXIgcmVxdWVzdHNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWN0aW9uIC0gVGhlIGFjdGlvbiB0byBiZSByZXF1ZXN0ZWQsIGRlZmluZWQgaW4gQWN0aW9uLmpzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJldCAtIFRoZSBiZXQgKGlmIGFueSkgdG8gYmUgc2VudCB0byB0aGUgY29udHJvbGxlclxuICAgICAqL1xuICAgIGhhbmRsZUFjdGlvbihhY3Rpb24sIGJldCkge1xuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uRk9MRDpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5mb2xkKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5DSEVDSzpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5jaGVjaygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uQkVUOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmJldChiZXQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJJbnZhbGlkIEFjdGlvbiBUeXBlOiBcIiArIGFjdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG5cbiAgICB9XG5cbiAgICBtYWtlQnRuKHgsIHksIHRleHQsIHRleHR1cmUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBidG4gPSB0aGlzLmdhbWUuYWRkLmJ1dHRvbih4LCB5LCB0ZXh0dXJlLCBjYWxsYmFjaywgdGhpcyk7XG4gICAgICAgIGJ0bi5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICBsZXQgYnRuVGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAwLCB0ZXh0KTtcbiAgICAgICAgYnRuVGV4dC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgYnRuLmFkZENoaWxkKGJ0blRleHQpO1xuICAgICAgICBidG4udGV4dCA9IGJ0blRleHQ7XG5cbiAgICAgICAgcmV0dXJuIGJ0bjtcbiAgICB9XG5cbiAgICBkZWFsKCkge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy90YWJsZXMvJyArIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZU5hbWUgKyAnL2RlYWwvJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0YWJsZU5hbWU6IGluaXRpYWxEYXRhLnRhYmxlTmFtZSxcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIG5ld0hhbmQoKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL3RhYmxlcy8nICsgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlTmFtZSArICcvbmV3LWhhbmQvJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0YWJsZU5hbWU6IGluaXRpYWxEYXRhLnRhYmxlTmFtZSxcbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBsZWF2ZVRhYmxlKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5sZWF2ZSgpO1xuICAgIH1cblxuICAgIGJiKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5iYigpO1xuICAgIH07XG5cbiAgICBzYigpIHtcbiAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuc2IoKTtcbiAgICB9O1xuXG4gICAgZ2VuZXJhdGVCZXRzKHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIHJldHVybiBQb2tlci5nZW5lcmF0ZUJldHMoMjUsIDUwLCB0aGlzLmdhbWUucm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgcGxheWVyQmFsYW5jZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYWluOyJdfQ==
