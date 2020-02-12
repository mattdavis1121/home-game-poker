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
            height: 1080,
            renderer: Phaser.CANVAS
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

},{"./states/Boot":27,"./states/Load":28,"./states/Main":29}],2:[function(require,module,exports){
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

var FLIP_SPEED_MS = 500;
var ZOOM = 1.2;

var Card = function (_Phaser$Sprite) {
    _inherits(Card, _Phaser$Sprite);

    function Card(game, x, y, key, manager) {
        _classCallCheck(this, Card);

        var _this = _possibleConstructorReturn(this, (Card.__proto__ || Object.getPrototypeOf(Card)).call(this, game, x, y, key));

        game.world.add(_this);

        _this.game = game;
        _this.key = key;
        _this.manager = manager;

        _this._name = null;
        _this._faceUp = null;

        _this.anchor.setTo(0.5);
        _this.inputEnabled = true;
        _this.updateDisplay();
        return _this;
    }

    _createClass(Card, [{
        key: "initialize",
        value: function initialize(data) {
            this.name = data.name;
            // TODO - initialize faceUp
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            if (!this._faceUp || this._name === null) {
                this.frameName = "back";
            } else {
                this.frameName = this._name;
            }
        }
    }, {
        key: "flip",
        value: function flip() {
            this.faceUp = !this.faceUp;
        }
    }, {
        key: "animateFlip",
        value: function animateFlip() {
            var _this2 = this;

            if (!this._name) {
                console.warn("Can't flip a card without a name");
                return;
            }

            var flipTween = this.game.add.tween(this.scale).to({ x: 0, y: ZOOM }, FLIP_SPEED_MS / 2);
            var backFlipTween = this.game.add.tween(this.scale).to({ x: 1, y: 1 }, FLIP_SPEED_MS / 2);
            flipTween.onComplete.add(function () {
                _this2.flip();
                backFlipTween.start();
            });
            flipTween.start();
            return backFlipTween.onComplete;
        }
    }, {
        key: "name",
        set: function set(name) {
            this._name = name;
            this.updateDisplay();
        },
        get: function get() {
            return this._name;
        }
    }, {
        key: "faceUp",
        set: function set(faceUp) {
            if (faceUp && !this._name) {
                console.warn("Can't turn nameless card face up");
                return;
            }

            this._faceUp = faceUp;
            this.updateDisplay();
        },
        get: function get() {
            return this._faceUp;
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

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A signal which automatically calls added listeners if previously dispatched
 *
 * Before being dispatched, a OneTimeSignal works identically to Phaser.Signal.
 * You can add listeners to it and they will not be called until the signal
 * is dispatched. After being dispatched for the first time, any calls to
 * `add` will automatically execute the registered listener.
 *
 * @class OneTimeSignal
 */
var OneTimeSignal = function (_Phaser$Signal) {
    _inherits(OneTimeSignal, _Phaser$Signal);

    function OneTimeSignal() {
        _classCallCheck(this, OneTimeSignal);

        var _this = _possibleConstructorReturn(this, (OneTimeSignal.__proto__ || Object.getPrototypeOf(OneTimeSignal)).call(this));

        _this._dispatched = false;
        _this._args = [];
        return _this;
    }

    _createClass(OneTimeSignal, [{
        key: "add",
        value: function add(listener, listenerContext, priority) {
            var _get2;

            for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                args[_key - 3] = arguments[_key];
            }

            var binding = (_get2 = _get(OneTimeSignal.prototype.__proto__ || Object.getPrototypeOf(OneTimeSignal.prototype), "add", this)).call.apply(_get2, [this, listener, listenerContext, priority].concat(args));

            if (this._dispatched) {
                binding.execute(this._args);
            }

            return binding;
        }
    }, {
        key: "dispatch",
        value: function dispatch() {
            var _get3;

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            (_get3 = _get(OneTimeSignal.prototype.__proto__ || Object.getPrototypeOf(OneTimeSignal.prototype), "dispatch", this)).call.apply(_get3, [this].concat(args));
            this._dispatched = true;
            this._args = args;
        }
    }]);

    return OneTimeSignal;
}(Phaser.Signal);

exports.default = OneTimeSignal;

},{}],14:[function(require,module,exports){
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

},{"../Util":4,"./Action":5,"./Button":6,"./Slider":17}],15:[function(require,module,exports){
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
            for (var i = 0; i < this.cards.length; i++) {
                this.game.add.tween(this.cards.cards[i]).to({ x: 0 }, 500, Phaser.Easing.Quartic.Out, true);
            }

            var hideTween = this.game.add.tween(this.display.cards).to({ top: this.display.nameplate.top }, 500, Phaser.Easing.Quartic.Out);
            this.game.time.events.add(500, function () {
                hideTween.start();
            }, this);

            return hideTween.onComplete;
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

},{"../classes/Action":5,"../classes/Nameplate":12,"../managers/CardManager":22,"../managers/ChipManager":23}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ChipManager = require("../managers/ChipManager");

var _ChipManager2 = _interopRequireDefault(_ChipManager);

var _OneTimeSignal = require("../classes/OneTimeSignal");

var _OneTimeSignal2 = _interopRequireDefault(_OneTimeSignal);

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

            var finished = new _OneTimeSignal2.default();
            var playersWithChips = players.filter(function (player) {
                return player.chips.chips.length;
            });

            var delay = 0;

            var _loop = function _loop(i) {
                var player = playersWithChips[i];
                _this.game.time.events.add(delay, function () {
                    _this.amount += player.chips.value;
                    var takeChipsFinished = _this.chips.takeChips(player.chips.chips);

                    takeChipsFinished.add(function () {
                        return console.log("takeChipsFinished " + i);
                    });

                    if (i === playersWithChips.length - 1) {
                        takeChipsFinished.add(function () {
                            return finished.dispatch();
                        });
                    }
                }, _this);
                delay += 100;
            };

            for (var i = 0; i < playersWithChips.length; i++) {
                _loop(i);
            }

            if (!playersWithChips.length) {
                finished.dispatch();
            }

            return finished;
        }
    }]);

    return Pot;
}();

exports.default = Pot;

},{"../classes/OneTimeSignal":13,"../managers/ChipManager":23}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CardManager = require("./CardManager");

var _CardManager2 = _interopRequireDefault(_CardManager);

var _OneTimeSignal = require("../classes/OneTimeSignal");

var _OneTimeSignal2 = _interopRequireDefault(_OneTimeSignal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CARD_SEPARATOR = 1.2;

var BoardManager = function () {
    function BoardManager(game) {
        _classCallCheck(this, BoardManager);

        this.game = game;

        this.displayGroup = this.game.add.group();
        this.display = {
            cards: null,
            cardsMask: null
        };

        this.numCards = 0;
        this.numCardsRevealed = 0;

        this.cards = new _CardManager2.default(game);
    }

    _createClass(BoardManager, [{
        key: "initialize",
        value: function initialize() {
            var numCards = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;

            // TODO - this will need to be dynamic for other game types
            this.numCards = numCards;
            this.cards.initialize(numCards);
        }
    }, {
        key: "initializeDisplay",
        value: function initializeDisplay() {
            this.display.cards = this.cards.displayGroup;
            this.display.cards.align(-1, 1, this.cards.cardWidth * CARD_SEPARATOR, 1);

            this.display.cardsMask = this.createCardsMask();
            this.display.cardsMask.top = 0;
            this.cards.mask = this.display.cardsMask;

            this.displayGroup.add(this.display.cards);
            this.displayGroup.add(this.display.cardsMask);

            this.hideCards();
        }
    }, {
        key: "createCardsMask",
        value: function createCardsMask() {
            var height = this.display.cards.height * CARD_SEPARATOR;
            var width = this.display.cards.width;
            var mask = this.game.add.graphics(0, 0);
            mask.beginFill(0xffffff);
            mask.drawRect(0, 0, width, height);
            return mask;
        }
    }, {
        key: "animateReveal",
        value: function animateReveal(cards) {
            var _this = this;

            if (!cards) {
                return;
            }

            var delay = 0;
            var complete = new _OneTimeSignal2.default();

            var _loop = function _loop(i) {
                _this.game.time.events.add(delay, function () {
                    _this.cards.cards[i].name = cards[i];
                    var tween = _this.game.add.tween(_this.cards.cards[i]).to({ bottom: 0 }, 1000, Phaser.Easing.Back.InOut, true);
                    _this.game.time.events.add(500, _this.cards.cards[i].animateFlip, _this.cards.cards[i]);

                    if (i === _this.cards.length - 1) {
                        tween.onComplete.add(complete.dispatch, complete);
                    }
                });
                delay += 200;
            };

            for (var i = this.numCardsRevealed; i < cards.length; i++) {
                _loop(i);
            }

            this.numCardsRevealed = cards.length;

            return complete;
        }
    }, {
        key: "animateHide",
        value: function animateHide() {
            var _this2 = this;

            var delay = 0;
            var complete = new _OneTimeSignal2.default();

            var _loop2 = function _loop2(i) {
                _this2.game.time.events.add(delay, function () {
                    var tween = _this2.game.add.tween(_this2.cards.cards[i]).to({ top: 0 }, 1000, Phaser.Easing.Back.InOut, true);
                    tween.onComplete.add(function () {
                        _this2.cards.cards[i].faceUp = false;
                    });

                    if (i === _this2.numCardsRevealed - 1) {
                        tween.onComplete.add(complete.dispatch, complete);
                    }
                });
                delay += 200;
            };

            for (var i = 0; i < this.numCardsRevealed; i++) {
                _loop2(i);
            }

            complete.add(function () {
                _this2.numCardsRevealed = 0;
            });

            return complete;
        }
    }, {
        key: "hideCards",
        value: function hideCards() {
            this.display.cards.top = this.display.cardsMask.bottom;
        }
    }, {
        key: "showCards",
        value: function showCards() {
            this.display.cards.bottom = this.display.cardsMask.bottom;
        }
    }]);

    return BoardManager;
}();

exports.default = BoardManager;

},{"../classes/OneTimeSignal":13,"./CardManager":22}],21:[function(require,module,exports){
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

},{"../classes/Button":6}],22:[function(require,module,exports){
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
        var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "cards";

        _classCallCheck(this, CardManager);

        this.game = game;
        this.key = key;
        this.cards = [];
        this.displayGroup = this.game.add.group();
        this._mask = null; // A mask applied to all cards in displayGroup
    }

    _createClass(CardManager, [{
        key: "initialize",
        value: function initialize(numCards) {
            for (var i = 0; i < numCards; i++) {
                var card = new _Card2.default(this.game, 0, 0, this.key, this);
                card.initialize({});

                this.cards.push(card);
                this.displayGroup.add(card);
            }
        }
    }, {
        key: "setCardNames",
        value: function setCardNames(names) {
            for (var i = 0; i < names.length; i++) {
                this.cards[i].name = names[i];
            }
        }
    }, {
        key: "setCardsFaceUp",
        value: function setCardsFaceUp(faceUp) {
            for (var i = 0; i < this.cards.length; i++) {
                this.cards[i].faceUp = faceUp;
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
        key: "flip",
        value: function flip() {
            for (var i = 0; i < this.cards.length; i++) {
                this.cards[i].flip();
            }
        }
    }, {
        key: "animateFlip",
        value: function animateFlip() {
            for (var i = 0; i < this.cards.length; i++) {
                var complete = this.cards[i].animateFlip();

                if (i === this.cards.length - 1) {
                    return complete;
                }
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

},{"../classes/Card":7}],23:[function(require,module,exports){
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

            return this.transferAnimation(newChips);
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

            var finished = new Phaser.Signal();

            var delay = 0;

            var _loop = function _loop(i) {
                var chip = chips[i];
                _this2.game.time.events.add(delay, function () {
                    var randPos = _this2.randChipPos();
                    var tween = _this2.game.add.tween(chip).to({ x: randPos.x, y: randPos.y }, 200, Phaser.Easing.Quadratic.InOut, true);

                    if (i === chips.length - 1) {
                        tween.onComplete.add(finished.dispatch, finished);
                    }
                }, _this2);
                delay += 100;
            };

            for (var i = 0; i < chips.length; i++) {
                _loop(i);
            }

            return finished;
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

},{"../Util":4,"../classes/Chip":8}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventRegister = function () {
    function EventRegister(game) {
        _classCallCheck(this, EventRegister);

        this.game = game;
        this.events = {};
    }

    _createClass(EventRegister, [{
        key: "add",
        value: function add(key, signal) {
            var _this = this;

            if (this.events[key]) {
                console.warn("TimingManager already has an event for key " + key);
                return;
            }
            this.events[key] = signal;
            signal.add(function () {
                console.log("DELETING EVENT");
                delete _this.events[key];
            });
        }
    }, {
        key: "get",
        value: function get(key) {
            return this.events[key];
        }
    }]);

    return EventRegister;
}();

exports.default = EventRegister;

},{}],25:[function(require,module,exports){
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

},{"../classes/Player":15}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{"../classes/Controller":9,"../config":19}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Action = require("../classes/Action");

var _BoardManager = require("../managers/BoardManager");

var _BoardManager2 = _interopRequireDefault(_BoardManager);

var _BuyInManager = require("../managers/BuyInManager");

var _BuyInManager2 = _interopRequireDefault(_BuyInManager);

var _DealerButton = require("../classes/DealerButton");

var _DealerButton2 = _interopRequireDefault(_DealerButton);

var _EventRegister = require("../managers/EventRegister");

var _EventRegister2 = _interopRequireDefault(_EventRegister);

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

            this.game.board = new _BoardManager2.default(this.game);
            this.game.board.initialize();
            this.game.board.initializeDisplay();
            this.game.board.displayGroup.centerX = this.game.world.centerX;
            this.game.board.displayGroup.centerY = this.game.world.centerY + 80;

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

            // TODO - These are not currently used. Scrap?
            this.game.queue = new _TweenQueue2.default(this.game);
            this.game.register = new _EventRegister2.default(this.game);

            this.registerListeners();

            this.table_sse.addListener("newHand", function (event) {
                var data = JSON.parse(event.data);
                console.log("newHand: ", data);
                for (var i = 0; i < _this3.game.players.length; i++) {
                    var player = _this3.game.players.players[i];
                    player.animateFold().add(player.cards.reset, player.cards);
                    player.chips.clear();
                }
                _this3.game.board.animateHide().add(_this3.game.board.cards.reset, _this3.game.board.cards);
                _this3.game.roundBet = 0;
                _this3.game.roundRaise = 0;
                _this3.game.players.dealerPlayer = _this3.game.players.getById(data.dealer);
                _this3.game.players.nextPlayer = _this3.game.players.getById(data.next);
                for (var _i = 0; _i < _this3.game.players.players.length; _i++) {
                    var _player = _this3.game.players.players[_i];
                    _player.update({
                        isDealer: _player.id === data.dealer,
                        isNext: _player.id === data.next,
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
                        // UNCOMMENT TO REINSTATE GOD MODE
                        // this.game.players.getById(playerData.playerId).cards.setCardNames(playerData.holdings);
                    }
                });
            }
            this.table_sse.addListener("action", function (event) {
                var data = JSON.parse(event.data);
                console.log("action: ", data);

                if (data.actionType === _Action.Action.FOLD) {
                    _this3.game.players.getById(data.playerId).animateFold();
                }

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

                if (data.newRound) {
                    _this3.game.board.animateReveal(data.board);
                }

                if (data.handComplete) {
                    _this3.game.pot.gatherChips(_this3.game.players.players).add(function () {
                        _this3.game.time.events.add(1000, function () {
                            if (data.showdown) {
                                for (var i = 0; i < data.showdown.length; i++) {
                                    var playerData = data.showdown[i];
                                    var player = _this3.game.players.getById(playerData.playerId);
                                    player.cards.setCardNames(playerData.holdings);
                                    player.cards.setCardsFaceUp(true);
                                }
                            }

                            // Delay one second for each player going to showdown
                            var delay = data.showdown ? 1000 * data.showdown.length : 0;
                            _this3.game.time.events.add(delay, function () {
                                _this3.game.players.getById(data.winners[0].id).chips.takeChips(_this3.game.pot.chips.chips);
                            });
                        });
                    });
                } else if (data.roundComplete) {
                    _this3.game.pot.gatherChips(_this3.game.players.players);

                    if (data.newRound) {
                        _this3.game.roundBet = 0;
                        _this3.game.roundRaise = 0;
                        for (var i = 0; i < _this3.game.players.players.length; i++) {
                            _this3.game.players.players[i].update({ roundBet: 0 }, false);
                        }
                        _this3.game.panel.setBets(_Poker2.default.generateRaises(_this3.game.rules.blinds.small, _this3.game.rules.blinds.big, _this3.game.roundBet, _this3.game.players.nextPlayer.roundBet, _this3.game.roundRaise, _this3.game.players.nextPlayer.balance));
                        _this3.game.panel.setSecondaryBet(0);
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
                _this3.game.players.userPlayer.cards.setCardsFaceUp(true);
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

},{"../Poker":2,"../SSE":3,"../classes/Action":5,"../classes/DealerButton":10,"../classes/Panel":14,"../classes/Pot":16,"../classes/TweenQueue":18,"../managers/BoardManager":20,"../managers/BuyInManager":21,"../managers/EventRegister":24,"../managers/PlayerManager":25}]},{},[1,26])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1Bva2VyLmpzIiwic3RhdGljL3NyYy9TU0UuanMiLCJzdGF0aWMvc3JjL1V0aWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQWN0aW9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0J1dHRvbi5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NoaXAuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQ29udHJvbGxlci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9EZWFsZXJCdXR0b24uanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvTGFiZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvTmFtZXBsYXRlLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL09uZVRpbWVTaWduYWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGFuZWwuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUGxheWVyLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BvdC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9TbGlkZXIuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvVHdlZW5RdWV1ZS5qcyIsInN0YXRpYy9zcmMvY29uZmlnLmpzb24iLCJzdGF0aWMvc3JjL21hbmFnZXJzL0JvYXJkTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvQnV5SW5NYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9DYXJkTWFuYWdlci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvQ2hpcE1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL0V2ZW50UmVnaXN0ZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL1BsYXllck1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL3BvbHlmaWxscy9zZW5kYmVhY29uLmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvQm9vdC5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL0xvYWQuanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9NYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNLEk7OztBQUNGLG9CQUFjO0FBQUE7O0FBQUEsZ0hBQ0o7QUFDRixtQkFBTyxJQURMO0FBRUYsb0JBQVEsSUFGTjtBQUdGLHNCQUFVLE9BQU87QUFIZixTQURJOztBQU9WLGNBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLGNBQXZCLEVBQTZCLEtBQTdCO0FBQ0EsY0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLE1BQWYsRUFBdUIsY0FBdkIsRUFBNkIsS0FBN0I7QUFDQSxjQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBZixFQUF1QixjQUF2QixFQUE2QixLQUE3Qjs7QUFFQSxjQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLE1BQWpCO0FBWFU7QUFZYjs7O0VBYmMsT0FBTyxJOztBQWdCMUIsSUFBSSxJQUFKOzs7Ozs7Ozs7Ozs7O0FDcEJBOzs7SUFHTSxLOzs7Ozs7OztBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7O3VDQVVzQixVLEVBQVksUSxFQUFVLFEsRUFBVSxjLEVBQWdCLFMsRUFBVyxhLEVBQWU7QUFDNUYsZ0JBQUksUUFBUSxNQUFNLFdBQU4sQ0FBa0IsUUFBbEIsRUFBNEIsUUFBNUIsRUFBc0MsY0FBdEMsRUFBc0QsU0FBdEQsRUFBaUUsYUFBakUsQ0FBWjtBQUNBLGdCQUFJLFNBQVMsQ0FBQyxLQUFELENBQWI7O0FBRUEsbUJBQU8sUUFBUSxVQUFSLElBQXNCLGFBQTdCLEVBQTRDO0FBQ3hDLHlCQUFTLFVBQVQ7QUFDQSx1QkFBTyxJQUFQLENBQVksS0FBWjtBQUNIOztBQUVELGdCQUFJLFFBQVEsYUFBWixFQUEyQjtBQUN2Qix1QkFBTyxJQUFQLENBQVksYUFBWjtBQUNIOztBQUVELG1CQUFPLE1BQVA7QUFDSDs7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QUNBLGdCQUFJLElBQUosQ0FBUyxLQUFLLFNBQUwsQ0FBZTtBQUNwQiwyQkFBVyxZQUFZO0FBREgsYUFBZixDQUFUO0FBR0g7OztrQ0FFUztBQUNOLGdCQUFJLE1BQU0sSUFBSSxjQUFKLEVBQVY7QUFDQSxnQkFBSSxJQUFKLENBQVMsTUFBVCxFQUFpQixhQUFhLEtBQUssSUFBTCxDQUFVLFdBQVYsQ0FBc0IsU0FBbkMsR0FBK0MsWUFBaEU7QUFDQSxnQkFBSSxnQkFBSixDQUFxQixjQUFyQixFQUFxQyxrQkFBckM7QUFDQSxnQkFBSSxJQUFKLENBQVMsS0FBSyxTQUFMLENBQWU7QUFDcEIsMkJBQVcsWUFBWTtBQURILGFBQWYsQ0FBVDtBQUdIOzs7cUNBRVk7QUFDVCxpQkFBSyxJQUFMLENBQVUsVUFBVixDQUFxQixLQUFyQjtBQUNIOzs7NkJBRUk7QUFDRCxpQkFBSyxJQUFMLENBQVUsVUFBVixDQUFxQixFQUFyQjtBQUNIOzs7NkJBRUk7QUFDRCxpQkFBSyxJQUFMLENBQVUsVUFBVixDQUFxQixFQUFyQjtBQUNIOzs7cUNBRVksYyxFQUFnQixhLEVBQWU7QUFDeEMsbUJBQU8sZ0JBQU0sWUFBTixDQUFtQixFQUFuQixFQUF1QixFQUF2QixFQUEyQixLQUFLLElBQUwsQ0FBVSxRQUFyQyxFQUErQyxjQUEvQyxFQUErRCxLQUFLLElBQUwsQ0FBVSxVQUF6RSxFQUFxRixhQUFyRixDQUFQO0FBQ0g7Ozs7RUE3U2MsT0FBTyxLOztrQkFnVFgsSSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBCb290IGZyb20gXCIuL3N0YXRlcy9Cb290XCI7XG5pbXBvcnQgTG9hZCBmcm9tIFwiLi9zdGF0ZXMvTG9hZFwiO1xuaW1wb3J0IE1haW4gZnJvbSBcIi4vc3RhdGVzL01haW5cIjtcblxuY2xhc3MgR2FtZSBleHRlbmRzIFBoYXNlci5HYW1lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgd2lkdGg6IDE5MjAsXG4gICAgICAgICAgICBoZWlnaHQ6IDEwODAsXG4gICAgICAgICAgICByZW5kZXJlcjogUGhhc2VyLkNBTlZBU1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImJvb3RcIiwgQm9vdCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImxvYWRcIiwgTG9hZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcIm1haW5cIiwgTWFpbiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJib290XCIpO1xuICAgIH1cbn1cblxubmV3IEdhbWUoKTtcbiIsIi8qKlxuICogQHN1bW1hcnkgQSB1dGlsaXR5IGNsYXNzIG9mIFBva2VyLXNwZWNpZmljIGZ1bmN0aW9uYWxpdHlcbiAqL1xuY2xhc3MgUG9rZXIge1xuICAgIC8vIFRPRE8gLSBUaGlzIHV0aWxpdHkgaXMgaGlnaGx5LXNwZWNpZmljIHRvIE5MIGdhbWVzLCBtYXliZSBldmVuIHRvIE5MSEUuXG4gICAgLy8gIE5lZWQgdG8gbWFrZSBpdCBtb3JlIGdlbmVyaWMgZXZlbnR1YWxseSB0byBhbGxvdyBmb3Igb3RoZXIgZ2FtZVxuICAgIC8vICB0eXBlcy4gTGltaXQgYW5kIHBvdC1saW1pdCBnYW1lcyB3aWxsIHdvcmsgY29tcGxldGVseSBkaWZmZXJlbnRseS5cbiAgICAvLyAgQW50ZXMgYXJlIGFsc28gbm90IHN1cHBvcnRlZC5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdlbmVyYXRlIGFsbCBsZWdhbCByYWlzZXMgZm9yIHBsYXllclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzbWFsbEJsaW5kIC0gVGhlIHNtYWxsIGJsaW5kIGZvciB0aGUgZ2FtZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyW119IC0gVGhlIHZhbGlkIHJhaXNlc1xuICAgICAqL1xuICAgIHN0YXRpYyBnZW5lcmF0ZVJhaXNlcyhzbWFsbEJsaW5kLCBiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IHJhaXNlID0gUG9rZXIuZ2V0TWluUmFpc2UoYmlnQmxpbmQsIHJvdW5kQmV0LCBwbGF5ZXJSb3VuZEJldCwgcHJldlJhaXNlLCBwbGF5ZXJCYWxhbmNlKTtcbiAgICAgICAgbGV0IHJhaXNlcyA9IFtyYWlzZV07XG5cbiAgICAgICAgd2hpbGUgKHJhaXNlICsgc21hbGxCbGluZCA8PSBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgICAgICByYWlzZSArPSBzbWFsbEJsaW5kO1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocmFpc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJhaXNlIDwgcGxheWVyQmFsYW5jZSkge1xuICAgICAgICAgICAgcmFpc2VzLnB1c2gocGxheWVyQmFsYW5jZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmFpc2VzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgYmV0IGZvciBwbGF5ZXJcbiAgICAgKlxuICAgICAqIElmIG5vIGJldHMgaGF2ZSBvY2N1cnJlZCBpbiBjdXJyZW50IHJvdW5kLCB0aGUgbWluIGJldCBpcyBhXG4gICAgICogY2hlY2sgKGJldCBvZiAwKSwgb3RoZXJ3aXNlIGl0J3MgYSBjYWxsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5CZXQocm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIGxldCBtaW5CZXQgPSByb3VuZEJldCA9PT0gMCA/IDAgOiByb3VuZEJldCAtIHBsYXllclJvdW5kQmV0O1xuICAgICAgICBpZiAocGxheWVyQmFsYW5jZSA8IG1pbkJldCkge1xuICAgICAgICAgICAgbWluQmV0ID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluQmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCB0aGUgbWluaW11bSBhbGxvd2FibGUgcmFpc2UgZm9yIHBsYXllclxuICAgICAqXG4gICAgICogTk9URTogQSByYWlzZSBoZXJlIG1heSBhY3R1YWxseSBtZWFuIGEgYmV0IGluIHBva2VyIHRlcm1zLiBJbiB0aGVcbiAgICAgKiBwYXJsYW5jZSBvZiB0aGlzIHV0aWxpdHksIGEgcmFpc2UgaXMgYW4gYWdncmVzc2l2ZSBhY3Rpb24sIG9yIHNvbWV0aGluZ1xuICAgICAqIHdoaWNoIHdvdWxkIGZvcmNlIG90aGVyIHBsYXllcnMgdG8gY29udHJpYnV0ZSBtb3JlIHRvIHRoZSBwb3QgdGhhblxuICAgICAqIHRoZSBvdGhlcndpc2Ugd291bGQgaGF2ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaWdCbGluZCAtIFRoZSBiaWcgYmxpbmQgZm9yIHRoZSBnYW1lXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJvdW5kQmV0IC0gVGhlIGxlYWRpbmcgYmV0IGZvciB0aGlzIGJldHRpbmcgcm91bmRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGxheWVyUm91bmRCZXQgLSBUaGUgYW1vdW50IHRoaXMgcGxheWVyIGhhcyBjb250cmlidXRlZCB0byB0aGUgcG90IHNvIGZhciB0aGlzIHJvdW5kXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHByZXZSYWlzZSAtIFRoZSBhbW91bnQgdGhlIHByZXZpb3VzIHJhaXNlIGluY3JlYXNlZCB0aGUgYmV0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBsYXllckJhbGFuY2UgLSBUaGUgYW1vdW50IHRoZSBwbGF5ZXIgaGFzIGF2YWlsYWJsZSB0byBiZXRcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRNaW5SYWlzZShiaWdCbGluZCwgcm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCBwcmV2UmFpc2UsIHBsYXllckJhbGFuY2UpIHtcbiAgICAgICAgbGV0IG1pblJhaXNlID0gcm91bmRCZXQgPT09IDAgPyBiaWdCbGluZCA6IHJvdW5kQmV0IC0gcGxheWVyUm91bmRCZXQgKyBwcmV2UmFpc2U7XG4gICAgICAgIGlmIChwbGF5ZXJCYWxhbmNlIDwgbWluUmFpc2UpIHtcbiAgICAgICAgICAgIG1pblJhaXNlID0gcGxheWVyQmFsYW5jZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluUmFpc2U7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb2tlcjsiLCJjbGFzcyBTU0Uge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVybCkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnVybCA9IHVybDtcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodGhpcy51cmwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJlIGFkZHMgYWxsIGxpc3RlbmVycyB0byB0aGlzLnNvdXJjZVxuICAgICAqXG4gICAgICogSSBvcmlnaW5hbGx5IHdyb3RlIHRoaXMgdG8gc3VwcG9ydCBjbGllbnQgcmVjb25uZWN0cywgYnV0IEkgZG9uJ3QgbmVlZFxuICAgICAqIHRoYXQgYW55bW9yZS4gS2VlcGluZyB0aGUgbGlzdGVuZXIgY29kZSBqdXN0IGluIGNhc2UuXG4gICAgICovXG4gICAgcmVBZGRBbGxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLmxpc3RlbmVycztcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcbiAgICAgICAgICAgIHRoaXMuYWRkTGlzdGVuZXIobGlzdGVuZXIudHlwZSwgbGlzdGVuZXIuY2FsbGJhY2ssIGxpc3RlbmVyLmNhbGxiYWNrQ29udGV4dCwgLi4ubGlzdGVuZXIuYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIFN0b3JlIGxpc3RlbmVycyBmb3IgZXZlbnR1YWwgcmVjb25uZWN0XG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2goe1xuICAgICAgICAgICAgXCJ0eXBlXCI6IHR5cGUsXG4gICAgICAgICAgICBcImNhbGxiYWNrXCI6IGNhbGxiYWNrLFxuICAgICAgICAgICAgXCJjYWxsYmFja0NvbnRleHRcIjogY2FsbGJhY2tDb250ZXh0LFxuICAgICAgICAgICAgXCJhcmdzXCI6IGFyZ3NcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU1NFOyIsImNsYXNzIFV0aWwge1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJldHVybiBhIGZvcm1hdHRlZCBjdXJyZW5jeSBzdHJpbmcgZnJvbSBhbiBpbnRlZ2VyXG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlQ3VycmVuY3koaW50KSB7XG4gICAgICAgIGxldCB2YWwgPSBpbnQgLyAxMDA7XG4gICAgICAgIHJldHVybiBcIiRcIiArIHZhbC50b0ZpeGVkKDIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXRpbDsiLCJjb25zdCBBY3Rpb24gPSB7XG4gICAgQkxJTkQ6IDAsXG4gICAgRk9MRDogMSxcbiAgICBDSEVDSzogMixcbiAgICBCRVQ6IDNcbn07XG5cbmNvbnN0IEFjdGlvblRleHQgPSB7XG4gICAgMDogXCJCTElORFwiLFxuICAgIDE6IFwiRk9MRFwiLFxuICAgIDI6IFwiQ0hFQ0tcIixcbiAgICAzOiBcIkJFVFwiXG59O1xuXG5leHBvcnQge0FjdGlvbiwgQWN0aW9uVGV4dH07IiwiLyoqXG4gKiBBIFBoYXNlci5CdXR0b24gd2l0aCBhIFBoYXNlci5UZXh0IGNlbnRlcmVkIG9uIHRoZSBidXR0b25cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIG1lcmVseSBhIHRoaW4gd3JhcHBlciBhcm91bmQgUGhhc2VyLkJ1dHRvbiB0byBhbGxvdyBmb3JcbiAqIGVhc3kgdXNlIG9mIGEgdGV4dCBsYWJlbCBvbiB0aGUgYnV0dG9uLiBUaGUgdGV4dCBpcyBhIGNoaWxkIG9mIHRoZSBidXR0b24sXG4gKiBzbyBpdCBtb3ZlcyB3aGVuIHRoZSBidXR0b24gbW92ZXMuIEl0J3MgY2VudGVyZWQgb24gdGhlIGJ1dHRvbiBhbmQgc2NhbGVzXG4gKiBhdXRvbWF0aWNhbGx5IHRvIGZpeCB3aXRoaW4gdGhlIGJ1dHRvbidzIGJvdW5kcy5cbiAqXG4gKiBJZiBub25lIG9mIHRoZSBsYWJlbCBmdW5jdGlvbmFsaXR5IGlzIHVzZWQsIHRoaXMgY2xhc3MgaXMgaWRlbnRpY2FsIHRvXG4gKiBQaGFzZXIuQnV0dG9uLlxuICovXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBQaGFzZXIuQnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSkge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSk7XG5cbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSAxMDtcbiAgICAgICAgdGhpcy5sYWJlbFRleHQgPSBcIlwiO1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSB7fTtcbiAgICAgICAgdGhpcy5sYWJlbCA9IG5ldyBQaGFzZXIuVGV4dCh0aGlzLmdhbWUsIDAsIDAsIHRoaXMubGFiZWxUZXh0KTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmxhYmVsKTtcblxuICAgICAgICAvLyBNdXN0IGFkZCB0byBnYW1lIHdvcmxkIG1hbnVhbGx5IGlmIG5vdCB1c2luZyBnYW1lLmFkZC5idXR0b25cbiAgICAgICAgdGhpcy5nYW1lLndvcmxkLmFkZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHRleHQgZGlzcGxheWVkIG9uIHRoZSBidXR0b25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGRpc3BsYXlcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0VGV4dCh0ZXh0LCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxUZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBzdHlsZSBmb3IgdGhlIGJ1dHRvbiB0ZXh0XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIC0gVGhlIHRleHQgc3R5bGUgdG8gdXNlXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIGRpc3BsYXkgdXBkYXRlIGRlc3BpdGUgb2YgdGhpcy5lbmFibGVkP1xuICAgICAqL1xuICAgIHNldFRleHRTdHlsZShzdHlsZSwgZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLmxhYmVsU3R5bGUgPSBzdHlsZTtcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBwYWRkaW5nIGJldHdlZW4gdGhlIHRleHQgYW5kIHRoZSBidXR0b24gcGVyaW1ldGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBhZGRpbmcgLSBUaGUgcGFkZGluZyBpbiBwaXhlbHNcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0UGFkZGluZyhwYWRkaW5nLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxQYWRkaW5nID0gcGFkZGluZztcbiAgICAgICAgdGhpcy51cGRhdGVMYWJlbChmb3JjZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgdGhlIGJ1dHRvblxuICAgICAqIE9uIGRpc2FibGUsIGRpc2FibGVzIGFsbCBpbnB1dCB0byB0aGUgYnV0dG9uIGFuZCByZW5kZXJzIGl0IGdyYXllZFxuICAgICAqIG91dC4gQWxsIHVwZGF0ZXMgYXJlIGRlbGF5ZWQgdW50aWwgcmUtZW5hYmxlLCB1bmxlc3MgZm9yY2VkLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIEVuYWJsZSBvciBkaXNhYmxlIGJ1dHRvbj9cbiAgICAgKi9cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgdGhpcy5pbnB1dEVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmxhYmVsLnRpbnQgPSB0aW50O1xuXG4gICAgICAgIC8vIFVwZGF0ZSBvbiByZS1lbmFibGVcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFVwZGF0ZSBhbGwgYnV0dG9uIGF0dHJpYnV0ZXMgdG8gY3VycmVudCBwcm9wZXJ0aWVzXG4gICAgICpcbiAgICAgKiBJZiB0aGUgYnV0dG9uIGlzIGRpc2FibGVkLCB0aGlzIHdpbGwgaGF2ZSBubyBlZmZlY3QuIFRoZVxuICAgICAqIGRldmVsb3BlciBtYXkgb3B0aW9uYWxseSBjaG9vc2UgdG8gZm9yY2UgdGhlIHVwZGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSB0aGUgdXBkYXRlP1xuICAgICAqL1xuICAgIHVwZGF0ZUxhYmVsKGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZCB8fCBmb3JjZSkge1xuICAgICAgICAgICAgdGhpcy5sYWJlbC50ZXh0ID0gdGhpcy5sYWJlbFRleHQ7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnNldFN0eWxlKHRoaXMubGFiZWxTdHlsZSk7XG4gICAgICAgICAgICB0aGlzLnJlUG9zTGFiZWwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNjYWxlIGxhYmVsIHRleHQgdG8gZml0IG9uIGJ1dHRvbiBhbmQgY2VudGVyXG4gICAgICovXG4gICAgcmVQb3NMYWJlbCgpIHtcbiAgICAgICAgdGhpcy5sYWJlbC5zY2FsZS5zZXRUbygxKTtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFIID0gdGhpcy53aWR0aCAtIHRoaXMubGFiZWxQYWRkaW5nICogMjtcbiAgICAgICAgY29uc3QgdGV4dEFyZWFWID0gdGhpcy5oZWlnaHQgLSB0aGlzLmxhYmVsUGFkZGluZyAqIDI7XG4gICAgICAgIGlmICh0aGlzLmxhYmVsLndpZHRoID4gdGV4dEFyZWFIIHx8IHRoaXMubGFiZWwuaGVpZ2h0ID4gdGV4dEFyZWFWKSB7XG4gICAgICAgICAgICBjb25zdCByZWR1Y2VkU2NhbGVIID0gdGV4dEFyZWFIIC8gdGhpcy5sYWJlbC53aWR0aDtcbiAgICAgICAgICAgIGNvbnN0IHJlZHVjZWRTY2FsZVYgPSB0ZXh0QXJlYVYgLyB0aGlzLmxhYmVsLmhlaWdodDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2NhbGUuc2V0VG8oTWF0aC5taW4ocmVkdWNlZFNjYWxlSCwgcmVkdWNlZFNjYWxlVikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFiZWwuY2VudGVyWCA9IHRoaXMud2lkdGggLyAyO1xuICAgICAgICB0aGlzLmxhYmVsLmNlbnRlclkgPSB0aGlzLmhlaWdodCAvIDI7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjsiLCJjb25zdCBGTElQX1NQRUVEX01TID0gNTAwO1xuY29uc3QgWk9PTSA9IDEuMjtcblxuY2xhc3MgQ2FyZCBleHRlbmRzIFBoYXNlci5TcHJpdGUge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGtleSwgbWFuYWdlcikge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXkpO1xuICAgICAgICBnYW1lLndvcmxkLmFkZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcblxuICAgICAgICB0aGlzLl9uYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZmFjZVVwID0gbnVsbDtcblxuICAgICAgICB0aGlzLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldCBuYW1lKG5hbWUpIHtcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB9XG5cbiAgICBzZXQgZmFjZVVwKGZhY2VVcCkge1xuICAgICAgICBpZiAoZmFjZVVwICYmICF0aGlzLl9uYW1lKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJDYW4ndCB0dXJuIG5hbWVsZXNzIGNhcmQgZmFjZSB1cFwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2ZhY2VVcCA9IGZhY2VVcDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgZ2V0IGZhY2VVcCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhY2VVcDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKGRhdGEpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICAvLyBUT0RPIC0gaW5pdGlhbGl6ZSBmYWNlVXBcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICBpZiAoIXRoaXMuX2ZhY2VVcCB8fCB0aGlzLl9uYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmZyYW1lTmFtZSA9IFwiYmFja1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mcmFtZU5hbWUgPSB0aGlzLl9uYW1lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmxpcCgpIHtcbiAgICAgICAgdGhpcy5mYWNlVXAgPSAhdGhpcy5mYWNlVXA7XG4gICAgfVxuXG4gICAgYW5pbWF0ZUZsaXAoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbmFtZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ2FuJ3QgZmxpcCBhIGNhcmQgd2l0aG91dCBhIG5hbWVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmxpcFR3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLnNjYWxlKS50byh7eDogMCwgeTogWk9PTX0sIEZMSVBfU1BFRURfTVMgLyAyKTtcbiAgICAgICAgbGV0IGJhY2tGbGlwVHdlZW4gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuc2NhbGUpLnRvKHt4OiAxLCB5OiAxfSwgRkxJUF9TUEVFRF9NUyAvIDIpO1xuICAgICAgICBmbGlwVHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mbGlwKCk7XG4gICAgICAgICAgICBiYWNrRmxpcFR3ZWVuLnN0YXJ0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICBmbGlwVHdlZW4uc3RhcnQoKTtcbiAgICAgICAgcmV0dXJuIGJhY2tGbGlwVHdlZW4ub25Db21wbGV0ZTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmQ7XG4iLCJjbGFzcyBDaGlwIGV4dGVuZHMgUGhhc2VyLlNwcml0ZSB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwga2V5LCBtYW5hZ2VyKSB7XG4gICAgICAgIHN1cGVyKGdhbWUsIHgsIHksIGtleSk7XG4gICAgICAgIGdhbWUud29ybGQuYWRkKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuXG4gICAgICAgIHRoaXMuaWQgPSArK0NoaXAuY291bnRlcjtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSAwO1xuICAgICAgICB0aGlzLmFuZ2xlID0gMDtcblxuICAgICAgICB0aGlzLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMucm90YXRlUmFuZG9tKCk7XG4gICAgfVxuXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuZnJhbWVOYW1lID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG5cbiAgICBjbG9uZShjaGlwKSB7XG4gICAgICAgIHRoaXMueCA9IGNoaXAud29ybGRQb3NpdGlvbi54IC0gdGhpcy5wYXJlbnQud29ybGRQb3NpdGlvbi54O1xuICAgICAgICB0aGlzLnkgPSBjaGlwLndvcmxkUG9zaXRpb24ueSAtIHRoaXMucGFyZW50LndvcmxkUG9zaXRpb24ueTtcbiAgICAgICAgdGhpcy5rZXkgPSBjaGlwLmtleTtcbiAgICAgICAgdGhpcy5hbmdsZSA9IGNoaXAuYW5nbGU7XG4gICAgICAgIHRoaXMudmFsdWUgPSBjaGlwLnZhbHVlO1xuICAgIH1cblxuICAgIHJvdGF0ZVJhbmRvbSgpIHtcbiAgICAgICAgdGhpcy5hbmdsZSA9IHRoaXMuZ2FtZS5ybmQuaW50ZWdlckluUmFuZ2UoLTE4MCwgMTgwKTtcbiAgICB9XG59XG5cbkNoaXAuY291bnRlciA9IDA7XG5cbmV4cG9ydCBkZWZhdWx0IENoaXA7IiwiY2xhc3MgQ29udHJvbGxlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwgcGxheWVySWQsIHRva2VuKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMucGxheWVySWQgPSBwbGF5ZXJJZDtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgYWNjZXNzIHRva2VuIHVzZWQgdG8gYXV0aGVudGljYXRlIG9uIEFQSSBjYWxsc1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiAtIFRoZSBGbGFzay1KV1QtRXh0ZW5kZWQgYWNjZXNzIHRva2VuXG4gICAgICovXG4gICAgc2V0VG9rZW4odG9rZW4pIHtcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXJcbiAgICAgKlxuICAgICAqIE9ubHkgZXJyb3JzIGFyZSByZXBvcnRlZC4gU3VjY2VzcyBpcyBzaWxlbnQuIEdhbWUgY2hhbmdlcyByZXN1bHRpbmdcbiAgICAgKiBmcm9tIHJlcXVlc3RzIGFyZSBoYW5kbGVkIHZpYSBTZXJ2ZXIgU2VudCBFdmVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZW5kcG9pbnQgLSBUaGUgZW5kcG9pbnQgb24gdGhlIHNlcnZlciB0byBzZW5kIHJlcXVlc3QgdG9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIFRoZSBwYXlsb2FkIHRvIHNlbmRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZD1cIlBPU1RdIC0gVGhlIEhUVFAgbWV0aG9kIHRvIHVzZVxuICAgICAqL1xuICAgIHNlbmRSZXF1ZXN0KGVuZHBvaW50LCBkYXRhLCBtZXRob2QgPSBcIlBPU1RcIikge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKG1ldGhvZCwgZW5kcG9pbnQpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgIGxldCByZXNwID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgICAvLyBJbnZhbGlkIHJlcXVlc3QgZXJyb3JcbiAgICAgICAgICAgICAgICBpZiAocmVzcC5zdWNjZXNzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4ocmVzcCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCAmJiB4aHIuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgICAgICAgICAgICAvLyBGYWlsZWQgcmVxdWVzdCBlcnJvclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsICdCZWFyZXIgJyArIHRoaXMudG9rZW4pO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhbiBhY3Rpb24gcmVxdWVzdFxuICAgICAqXG4gICAgICogVGhpcyBpcyB0aGUgbW9zdCBoZWF2aWx5LXVzZWQgcmVxdWVzdCB0eXBlIGluIHRoZSBnYW1lLiBBbGwgaW4tZ2FtZVxuICAgICAqIGFjdGlvbnMgKGJldCwgY2hlY2ssIGZvbGQpIGhhcHBlbiBoZXJlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGEgLSBUaGUgcGF5bG9hZCB0byBzZW5kXG4gICAgICovXG4gICAgYWN0aW9uKGRhdGEpIHtcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5idWlsZFVybChcImFjdGlvblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGNoZWNrKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJDSEVDS1wiKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgYmV0KGFtdCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJCRVRcIiwgYW10KTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgZm9sZCgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYnVpbGRQYXlsb2FkKFwiRk9MRFwiKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgYmIoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJMSU5EXCIsIDUwKTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgc2IoKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJMSU5EXCIsIDI1KTtcbiAgICAgICAgdGhpcy5hY3Rpb24oZGF0YSk7XG4gICAgfVxuXG4gICAgam9pbihzZWF0TnVtLCBidXlJbikge1xuICAgICAgICBjb25zdCBkYXRhID0ge1wicG9zaXRpb25cIjogc2VhdE51bSwgXCJhbW91bnRcIjogYnV5SW59O1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiam9pblwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGxlYXZlKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJsZWF2ZVwiKTtcbiAgICAgICAgdGhpcy5zZW5kUmVxdWVzdCh1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNlbmQgYSBiZWFjb24gdG8gdGhlIHNlcnZlciBvbiBkaXNjb25uZWN0XG4gICAgICpcbiAgICAgKiBUaGlzIGFsbG93cyBmb3Igc2VydmVyIHRvIGtub3cgd2hlbiBhIGNsaWVudCBkaXNjb25uZWN0cyBzb1xuICAgICAqIGl0IGNhbiBjbGVhbiB1cCBhcyBuZWNlc3NhcnkuIE5vIGd1YXJhbnRlZSB0aGF0IHRoaXMgbWVzc2FnZVxuICAgICAqIHdpbGwgZ28gdGhyb3VnaCwgc28gbXVzdCBoYXZlIHJlZHVuZGFudCBtZWFzdXJlcyBpbiBwbGFjZS5cbiAgICAgKi9cbiAgICBkaXNjb25uZWN0QmVhY29uKCkge1xuICAgICAgICBjb25zdCBkYXRhID0ge307XG4gICAgICAgIGNvbnN0IHVybCA9IFwiL2Rpc2Nvbm5lY3QvXCI7XG4gICAgICAgIG5hdmlnYXRvci5zZW5kQmVhY29uKHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgYnVpbGRQYXlsb2FkKGFjdGlvblR5cGUsIGJldEFtdCA9IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwicGxheWVySWRcIjogdGhpcy5wbGF5ZXJJZCxcbiAgICAgICAgICAgIFwiYWN0aW9uVHlwZVwiOiBhY3Rpb25UeXBlLFxuICAgICAgICAgICAgXCJiZXRBbXRcIjogYmV0QW10XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBidWlsZFVybChlbmRwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlVXJsICsgZW5kcG9pbnQgKyBcIi9cIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXI7XG4iLCJjb25zdCBCVVRUT05fU1RZTEVTID0ge1xuICAgIFBMQUlOOiAwLFxuICAgIExFVFRFUjogMSxcbiAgICBURVhUOiAyXG59O1xuXG5jbGFzcyBEZWFsZXJCdXR0b24gZXh0ZW5kcyBQaGFzZXIuU3ByaXRlIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIGNvbmZpZykge1xuICAgICAgICBrZXkgPSBrZXkgfHwgXCJkZWFsZXJCdXR0b25cIjtcbiAgICAgICAgc3VwZXIoZ2FtZSwgeCwgeSwga2V5KTtcbiAgICAgICAgZ2FtZS53b3JsZC5hZGQodGhpcyk7XG5cbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnIHx8IHRoaXMuZ2FtZS5jb25maWcuZGVhbGVyQnV0dG9uO1xuXG4gICAgICAgIHRoaXMuX3NlYXQgPSAwO1xuICAgICAgICB0aGlzLmZyYW1lID0gQlVUVE9OX1NUWUxFUy5URVhUO1xuXG4gICAgICAgIHRoaXMuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuc2VhdCA9IDA7XG4gICAgfVxuXG4gICAgc2V0IHNlYXQoc2VhdE51bSkge1xuICAgICAgICB0aGlzLl9zZWF0ID0gc2VhdE51bTtcbiAgICAgICAgdGhpcy54ID0gdGhpcy5jb25maWdbc2VhdE51bV0ueDtcbiAgICAgICAgdGhpcy55ID0gdGhpcy5jb25maWdbc2VhdE51bV0ueTtcbiAgICB9XG5cbiAgICBtb3ZlVG9TZWF0KHNlYXROdW0pIHtcbiAgICAgICAgY29uc3QgeCA9IHRoaXMuY29uZmlnW3NlYXROdW1dLng7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLmNvbmZpZ1tzZWF0TnVtXS55O1xuXG4gICAgICAgIHRoaXMuZ2FtZS5hZGQudHdlZW4odGhpcykudG8oe3g6IHgsIHk6IHl9LCA1MDAsIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLkluT3V0LCB0cnVlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlYWxlckJ1dHRvbjtcbiIsIi8qKlxuICogQHN1bW1hcnkgU2ltcGxlIFBoYXNlci5UZXh0IGV4dGVuc3Rpb24gdG8gc3VwcG9ydCBhdXRvbWF0aWMgcmVzaXppbmdcbiAqXG4gKiBJZiB0ZXh0IGJvdW5kcyBhcmUgc2V0IG9uIGluc3RhbmNlcyBvZiB0aGlzIGNsYXNzLCB0aGVuIGVhY2ggdGltZSB0aGUgdGV4dFxuICogb3Igc3R5bGUgaXMgY2hhbmdlZCwgdGhlIHRleHQgd2lsbCBhdXRvbWF0aWNhbGx5IHNjYWxlIGl0c2VsZiBkb3duIHRvIGZpdFxuICogd2l0aGluIHRob3NlIGJvdW5kcyBob3Jpem9udGFsbHkuIFZlcnRpY2FsIGJvdW5kcyBhcmUgaWdub3JlZC5cbiAqXG4gKiBQb3NzaWJsZSB1cGdyYWRlczpcbiAqICAgLSBTZXQgbWluaW11bSBzY2FsZVxuICogICAtIElmIHRleHQgc3RpbGwgb3ZlcmZsb3dzIG1pbiBzY2FsZSwgdGhlbiB0cnVuY2F0ZVxuICovXG5jbGFzcyBMYWJlbCBleHRlbmRzIFBoYXNlci5UZXh0IHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCB0ZXh0LCBzdHlsZSkge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCB0ZXh0LCBzdHlsZSk7XG4gICAgICAgIHRoaXMuYW5jaG9yLnNldFRvKDAsIDAuNSk7ICAvLyBDZW50ZXIgdmVydGljYWxseSB0byBhdm9pZCBqdW1wcyBvbiByZXNpemVcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9XG5cbiAgICBzZXRUZXh0KHRleHQsIGltbWVkaWF0ZSkge1xuICAgICAgICBzdXBlci5zZXRUZXh0KHRleHQsIGltbWVkaWF0ZSk7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgfVxuXG4gICAgc2V0U3R5bGUoc3R5bGUsIHVwZGF0ZSkge1xuICAgICAgICBzdXBlci5zZXRTdHlsZShzdHlsZSwgdXBkYXRlKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZXNpemUgdGhlIHRleHQgaG9yaXpvbnRhbGx5XG4gICAgICpcbiAgICAgKiBJZiB0ZXh0IGRvZXMgbm90IGZpdCBob3Jpem9udGFsbHkgYXQgZnVsbCBzY2FsZSwgdGhlbiBzY2FsZSBkb3duXG4gICAgICogdW50aWwgaXQgZml0cy4gVmVydGljYWwgb3ZlcmZsb3cgaXMgaWdub3JlZC5cbiAgICAgKi9cbiAgICByZXNpemUoKSB7XG4gICAgICAgIGlmICghdGhpcy50ZXh0Qm91bmRzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zY2FsZS5zZXRUbygxKTtcbiAgICAgICAgaWYgKHRoaXMud2lkdGggPiB0aGlzLnRleHRCb3VuZHMud2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUuc2V0VG8odGhpcy50ZXh0Qm91bmRzLndpZHRoIC8gdGhpcy53aWR0aCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExhYmVsOyIsImltcG9ydCBMYWJlbCBmcm9tIFwiLi9MYWJlbFwiO1xuaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcblxuY2xhc3MgTmFtZXBsYXRlIGV4dGVuZHMgUGhhc2VyLkltYWdlIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIGNvbmZpZykge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXkpO1xuICAgICAgICBnYW1lLndvcmxkLmFkZCh0aGlzKTtcblxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWcgfHwgdGhpcy5nYW1lLmNvbmZpZy5uYW1lcGxhdGU7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge1xuICAgICAgICAgICAgbmFtZXBsYXRlOiBudWxsLFxuICAgICAgICAgICAgbmFtZTogbnVsbCxcbiAgICAgICAgICAgIGJhbGFuY2U6IG51bGwsXG4gICAgICAgICAgICBmbGFzaDogbnVsbFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHNldCBuYW1lKG5hbWUpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUuc2V0VGV4dChuYW1lKTtcbiAgICB9XG5cbiAgICBzZXQgYmFsYW5jZShiYWxhbmNlKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLnNldFRleHQoVXRpbC5wYXJzZUN1cnJlbmN5KGJhbGFuY2UpKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZSA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUgPSBuZXcgTGFiZWwodGhpcy5nYW1lLCB0aGlzLmNvbmZpZy5uYW1lLngsIHRoaXMuY29uZmlnLm5hbWUueSwgXCJcIiwgdGhpcy5jb25maWcubmFtZS5zdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnNldFRleHRCb3VuZHMoMCwgMCwgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS53aWR0aCAtIDIwLCAwKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmRpc3BsYXkubmFtZSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UgPSBuZXcgTGFiZWwodGhpcy5nYW1lLCB0aGlzLmNvbmZpZy5iYWxhbmNlLngsIHRoaXMuY29uZmlnLmJhbGFuY2UueSwgXCJcIiwgdGhpcy5jb25maWcuYmFsYW5jZS5zdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLnNldFRleHRCb3VuZHMoMCwgMCwgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS53aWR0aCAtIDIwLCAwKTtcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmRpc3BsYXkuYmFsYW5jZSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoID0gbmV3IExhYmVsKHRoaXMuZ2FtZSwgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5jZW50ZXJYLCB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmNlbnRlclksIFwiXCIsIHRoaXMuY29uZmlnLmZsYXNoLnN0eWxlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoLnNldFRleHRCb3VuZHMoMCwgMCwgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS53aWR0aCAtIDIwLCAwKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuZmxhc2gudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuZGlzcGxheS5mbGFzaCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRmxhc2ggdGV4dCBmb3IgZHVyYXRpb25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGRpc3BsYXlzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtkdXJhdGlvbj0yMDAwXSAtIE1pbGxpc2Vjb25kcyB0byBkaXNwbGF5IHRleHRcbiAgICAgKi9cbiAgICBmbGFzaCh0ZXh0LCBkdXJhdGlvbiA9IDIwMDApIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmZsYXNoLnNldFRleHQodGV4dCk7XG5cbiAgICAgICAgdGhpcy5nYW1lLnRpbWUuZXZlbnRzLmFkZChkdXJhdGlvbiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUudmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5mbGFzaC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTmFtZXBsYXRlOyIsIi8qKlxuICogQSBzaWduYWwgd2hpY2ggYXV0b21hdGljYWxseSBjYWxscyBhZGRlZCBsaXN0ZW5lcnMgaWYgcHJldmlvdXNseSBkaXNwYXRjaGVkXG4gKlxuICogQmVmb3JlIGJlaW5nIGRpc3BhdGNoZWQsIGEgT25lVGltZVNpZ25hbCB3b3JrcyBpZGVudGljYWxseSB0byBQaGFzZXIuU2lnbmFsLlxuICogWW91IGNhbiBhZGQgbGlzdGVuZXJzIHRvIGl0IGFuZCB0aGV5IHdpbGwgbm90IGJlIGNhbGxlZCB1bnRpbCB0aGUgc2lnbmFsXG4gKiBpcyBkaXNwYXRjaGVkLiBBZnRlciBiZWluZyBkaXNwYXRjaGVkIGZvciB0aGUgZmlyc3QgdGltZSwgYW55IGNhbGxzIHRvXG4gKiBgYWRkYCB3aWxsIGF1dG9tYXRpY2FsbHkgZXhlY3V0ZSB0aGUgcmVnaXN0ZXJlZCBsaXN0ZW5lci5cbiAqXG4gKiBAY2xhc3MgT25lVGltZVNpZ25hbFxuICovXG5jbGFzcyBPbmVUaW1lU2lnbmFsIGV4dGVuZHMgUGhhc2VyLlNpZ25hbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYXJncyA9IFtdO1xuICAgIH1cblxuICAgIGFkZChsaXN0ZW5lciwgbGlzdGVuZXJDb250ZXh0LCBwcmlvcml0eSwgLi4uYXJncykge1xuICAgICAgICBjb25zdCBiaW5kaW5nID0gc3VwZXIuYWRkKGxpc3RlbmVyLCBsaXN0ZW5lckNvbnRleHQsIHByaW9yaXR5LCAuLi5hcmdzKTtcblxuICAgICAgICBpZiAodGhpcy5fZGlzcGF0Y2hlZCkge1xuICAgICAgICAgICAgYmluZGluZy5leGVjdXRlKHRoaXMuX2FyZ3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJpbmRpbmc7XG4gICAgfVxuXG4gICAgZGlzcGF0Y2goLi4uYXJncykge1xuICAgICAgICBzdXBlci5kaXNwYXRjaCguLi5hcmdzKTtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2FyZ3MgPSBhcmdzO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgT25lVGltZVNpZ25hbDtcbiIsImltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5pbXBvcnQgQnV0dG9uIGZyb20gXCIuL0J1dHRvblwiO1xuaW1wb3J0IFNsaWRlciBmcm9tIFwiLi9TbGlkZXJcIjtcbmltcG9ydCB7QWN0aW9ufSBmcm9tIFwiLi9BY3Rpb25cIjtcblxuY2xhc3MgUGFuZWwge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5iZXRzID0gWzBdO1xuICAgICAgICB0aGlzLnByaW1hcnlDbGlja2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5wcmltYXJ5QWN0aW9uID0gQWN0aW9uLkJFVDtcbiAgICAgICAgdGhpcy5wcmltYXJ5QmV0ID0gMDtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlDbGlja2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlBY3Rpb24gPSBBY3Rpb24uQ0hFQ0s7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QmV0ID0gMDtcbiAgICAgICAgdGhpcy50ZXJ0aWFyeUNsaWNrZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnRlcnRpYXJ5QWN0aW9uID0gQWN0aW9uLkZPTEQ7XG4gICAgICAgIHRoaXMuc2xpZGVyID0gbmV3IFNsaWRlcih0aGlzLmdhbWUsIFwicGFuZWxcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWx3YXlzVmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5wcmltYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDAsIDAsIFwibWVkXCIsICgpID0+IHRoaXMucHJpbWFyeUNsaWNrZWQuZGlzcGF0Y2godGhpcy5wcmltYXJ5QWN0aW9uLCB0aGlzLnByaW1hcnlCZXQpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNlY29uZGFyeSA9IHRoaXMubWFrZUJ1dHRvbigxMzUsIDAsIFwibWVkXCIsICgpID0+IHRoaXMuc2Vjb25kYXJ5Q2xpY2tlZC5kaXNwYXRjaCh0aGlzLnNlY29uZGFyeUFjdGlvbiwgdGhpcy5zZWNvbmRhcnlCZXQpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRlcnRpYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDI3MCwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy50ZXJ0aWFyeUNsaWNrZWQuZGlzcGF0Y2godGhpcy50ZXJ0aWFyeUFjdGlvbiwgMCkpO1xuXG4gICAgICAgIHRoaXMuc2xpZGVyLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuc2xpZGVyLmluZGV4Q2hhbmdlZC5hZGQoKGluZGV4KSA9PiB0aGlzLnNldFByaW1hcnlCZXQodGhpcy5iZXRzW2luZGV4XSksIHRoaXMpO1xuICAgICAgICB0aGlzLnNsaWRlci5zbGlkZXJXaGVlbC5hZGQodGhpcy5zaW5nbGVTdGVwQmV0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNsaWRlciA9IHRoaXMuc2xpZGVyLmJhcjtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNsaWRlci55ID0gNjA7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCgoKSA9PiB0aGlzLnNsaWRlci5lbmFibGVTbGlkZXJXaGVlbCh0cnVlKSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5wcmltYXJ5LmV2ZW50cy5vbklucHV0T3V0LmFkZCgoKSA9PiB0aGlzLnNsaWRlci5lbmFibGVTbGlkZXJXaGVlbChmYWxzZSkpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkucHJpbWFyeSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS50ZXJ0aWFyeSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuc2xpZGVyKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBtYWtlQnV0dG9uKHgsIHksIHNpemUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBidXR0b24gPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgeCwgeSwgdGhpcy5rZXkpO1xuICAgICAgICBidXR0b24ub25JbnB1dFVwLmFkZChjYWxsYmFjayk7XG4gICAgICAgIGJ1dHRvbi5zZXRGcmFtZXMoXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9vdmVyXCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9vdXRcIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX2Rvd25cIixcbiAgICAgICAgICAgIFwiYnRuX1wiICsgc2l6ZSArIFwiX3VwXCJcbiAgICAgICAgKTtcbiAgICAgICAgYnV0dG9uLnNldFRleHRTdHlsZSh0aGlzLmdhbWUuY29uZmlnLnBhbmVsLnRleHRTdHlsZSk7XG4gICAgICAgIHJldHVybiBidXR0b247XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgLy8gUGFuZWwgdXBkYXRlcyByZXF1aXJlIHBsYXllcnMnIGN1cnJlbnQgYmV0cywgc28gaWZcbiAgICAgICAgLy8gdGhlcmUgaXMgbm8gbmV4dCBwbGF5ZXIgd2Ugc2hvdWxkbid0IHVwZGF0ZSB0aGUgZGlzcGxheVxuICAgICAgICBpZiAoIXRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBhY3Rpb25UZXh0ID0gdGhpcy5nYW1lLnJvdW5kQmV0ID09PSAwID8gXCJCRVQgXCIgOiBcIlJBSVNFIFRPXFxuXCI7XG4gICAgICAgIGxldCBwcmltYXJ5VGV4dCA9IGFjdGlvblRleHQgKyBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5wcmltYXJ5QmV0ICsgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5wcmltYXJ5LnNldFRleHQocHJpbWFyeVRleHQpO1xuXG4gICAgICAgIGxldCBzZWNvbmRhcnlUZXh0ID0gXCJDSEVDS1wiO1xuICAgICAgICBpZiAodGhpcy5zZWNvbmRhcnlBY3Rpb24gIT09IEFjdGlvbi5DSEVDSykge1xuICAgICAgICAgICAgc2Vjb25kYXJ5VGV4dCA9IFwiQ0FMTCBcIiArIFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLnNlY29uZGFyeUJldCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwbGF5LnNlY29uZGFyeS5zZXRUZXh0KHNlY29uZGFyeVRleHQpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXJ0aWFyeS5zZXRUZXh0KFwiRk9MRFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAudmlzaWJsZSA9IHRoaXMudmlzaWJsZTtcbiAgICB9XG5cbiAgICBzZXRCZXRzKGJldHMpIHtcbiAgICAgICAgaWYgKGJldHMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgYmV0cy4gUGFuZWwgbXVzdCBhbHdheXMgaGF2ZSBhdCBsZWFzdCBvbmUgdmFsaWQgYmV0LlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYmV0cyA9IGJldHM7XG4gICAgICAgIHRoaXMucHJpbWFyeUJldCA9IGJldHNbMF07XG4gICAgICAgIHRoaXMuc2xpZGVyLnNldExlbmd0aChiZXRzLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuc2xpZGVyLnNldEluZGV4KDApO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRFbmFibGVkKGJldHMubGVuZ3RoID4gMSk7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldFByaW1hcnlCZXQoYmV0KSB7XG4gICAgICAgIHRoaXMucHJpbWFyeUJldCA9IGJldDtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc2V0U2Vjb25kYXJ5QmV0KGJldCkge1xuICAgICAgICB0aGlzLnNlY29uZGFyeUJldCA9IGJldDtcbiAgICAgICAgdGhpcy5zZWNvbmRhcnlBY3Rpb24gPSBiZXQgPT09IDAgPyBBY3Rpb24uQ0hFQ0sgOiBBY3Rpb24uQkVUO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBIaWRlIG9yIHNob3cgdGhlIGVudGlyZSBwYW5lbFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmlzaWJsZVxuICAgICAqL1xuICAgIHNldFZpc2libGUodmlzaWJsZSkge1xuICAgICAgICB0aGlzLnZpc2libGUgPSB2aXNpYmxlIHx8IHRoaXMuYWx3YXlzVmlzaWJsZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSW5jcmVtZW50IG9yIGRlY3JlbWVudCB0aGlzLnByaW1hcnlCZXRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Nb3VzZS53aGVlbERlbHRhfSBtb2RpZmllciAtICsxIG9yIC0xXG4gICAgICovXG4gICAgc2luZ2xlU3RlcEJldChtb2RpZmllcikge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnNsaWRlci5pbmRleCArIG1vZGlmaWVyO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuc2xpZGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5zbGlkZXIuc2V0SW5kZXgoaW5kZXgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQYW5lbDtcbiIsImltcG9ydCB7QWN0aW9uVGV4dH0gZnJvbSBcIi4uL2NsYXNzZXMvQWN0aW9uXCI7XG5pbXBvcnQgQ2FyZE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NhcmRNYW5hZ2VyXCI7XG5pbXBvcnQgQ2hpcE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NoaXBNYW5hZ2VyXCI7XG5pbXBvcnQgTmFtZXBsYXRlIGZyb20gXCIuLi9jbGFzc2VzL05hbWVwbGF0ZVwiO1xuXG5jbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGNoaXBDb25maWcpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5jaGlwQ29uZmlnID0gY2hpcENvbmZpZztcblxuICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBudWxsO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBudWxsO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBudWxsO1xuICAgICAgICB0aGlzLnNlYXQgPSBudWxsO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsO1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gMDsgIC8vIFN1bSBiZXRzIGJ5IHBsYXllciBpbiBjdXJyZW50IGJldHRpbmcgcm91bmRcblxuICAgICAgICB0aGlzLmlzRGVhbGVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNOZXh0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcbiAgICAgICAgICAgIG5hbWVwbGF0ZTogbnVsbCxcbiAgICAgICAgICAgIGNhcmRzOiBudWxsLFxuICAgICAgICAgICAgY2FyZHNNYXNrOiBudWxsLFxuICAgICAgICAgICAgY2hpcHM6IG51bGxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmNhcmRzID0gbmV3IENhcmRNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuY2hpcHMgPSBuZXcgQ2hpcE1hbmFnZXIodGhpcy5nYW1lLCBcImNoaXBzXCIsIHRoaXMuZ2FtZS5jb25maWcuZGVub21zKTtcbiAgICAgICAgdGhpcy5uYW1lcGxhdGUgPSBuZXcgTmFtZXBsYXRlKHRoaXMuZ2FtZSwgMCwgMCwgXCJuYW1lcGxhdGVcIik7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkYXRhLmlkO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IGRhdGEudXNlcklkO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuc2l0dGluZ091dCA9IGRhdGEuc2l0dGluZ091dDtcbiAgICAgICAgdGhpcy5zZWF0ID0gZGF0YS5zZWF0O1xuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZGF0YS5pc1VzZXI7XG5cbiAgICAgICAgdGhpcy5jYXJkcy5pbml0aWFsaXplKDIpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlID0gdGhpcy5uYW1lcGxhdGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMgPSB0aGlzLmNhcmRzLmRpc3BsYXlHcm91cDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLnggPSB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmNlbnRlclg7XG4gICAgICAgIHRoaXMuaGlkZUNhcmRzKCk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzTWFzayA9IHRoaXMuY3JlYXRlQ2FyZHNNYXNrKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkc01hc2suYm90dG9tID0gdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS50b3A7XG4gICAgICAgIHRoaXMuY2FyZHMubWFzayA9IHRoaXMuZGlzcGxheS5jYXJkc01hc2s7XG5cbiAgICAgICAgdGhpcy5jaGlwcy5pbml0aWFsaXplRGlzcGxheSgpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMgPSB0aGlzLmNoaXBzLmRpc3BsYXlHcm91cDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNoaXBzLnggPSB0aGlzLmNoaXBDb25maWdbdGhpcy5zZWF0XS54O1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2hpcHMueSA9IHRoaXMuY2hpcENvbmZpZ1t0aGlzLnNlYXRdLnk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuY2hpcHMuZGlzcGxheUdyb3VwKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5jYXJkcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuY2FyZHNNYXNrKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5uYW1lcGxhdGUpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lcGxhdGUubmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS5iYWxhbmNlID0gdGhpcy5iYWxhbmNlO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZXBsYXRlLmZyYW1lTmFtZSA9IHRoaXMuaXNOZXh0ID8gXCJyZWRcIiA6IFwiYmFzZVwiO1xuICAgIH1cblxuICAgIHVwZGF0ZShkYXRhLCB1cGRhdGVDaGlwcyA9IHRydWUpIHtcbiAgICAgICAgLy8gVE9ETyAtIEZsZXNoIG91dCB0aGUgcmVzdCBvZiB0aGUgZGF0YSAtLSBkbyBJIGxpa2UgdGhpcyBtZXRob2Q/XG4gICAgICAgIHRoaXMuYmFsYW5jZSA9IGRhdGEuYmFsYW5jZSA9PT0gdW5kZWZpbmVkID8gdGhpcy5iYWxhbmNlIDogZGF0YS5iYWxhbmNlO1xuICAgICAgICB0aGlzLmlzRGVhbGVyID0gZGF0YS5pc0RlYWxlciA9PT0gdW5kZWZpbmVkID8gdGhpcy5pc0RlYWxlciA6IGRhdGEuaXNEZWFsZXI7XG4gICAgICAgIHRoaXMuaXNOZXh0ID0gZGF0YS5pc05leHQgPT09IHVuZGVmaW5lZCA/IHRoaXMuaXNOZXh0IDogZGF0YS5pc05leHQ7XG4gICAgICAgIHRoaXMucm91bmRCZXQgPSBkYXRhLnJvdW5kQmV0ID09PSB1bmRlZmluZWQgPyB0aGlzLnJvdW5kQmV0IDogZGF0YS5yb3VuZEJldDtcbiAgICAgICAgaWYgKHVwZGF0ZUNoaXBzKSB7XG4gICAgICAgICAgICB0aGlzLmNoaXBzLnNldFZhbHVlKHRoaXMucm91bmRCZXQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGlwcy52YWx1ZSA9IHRoaXMucm91bmRCZXQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgYWN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoe1xuICAgICAgICAgICAgYmFsYW5jZTogZGF0YS5wbGF5ZXJCYWxhbmNlLFxuICAgICAgICAgICAgcm91bmRCZXQ6IGRhdGEucGxheWVyUm91bmRCZXRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IGFjdGlvblRleHQgPSBBY3Rpb25UZXh0W2RhdGEuYWN0aW9uVHlwZV07XG5cbiAgICB9XG5cbiAgICBjcmVhdGVDYXJkc01hc2soKSB7XG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLmNhcmRzLmNhcmRzWzBdLmhlaWdodDtcbiAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5uYW1lcGxhdGUud2lkdGg7XG4gICAgICAgIGxldCBtYXNrID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygwLCAwKTtcbiAgICAgICAgbWFzay5iZWdpbkZpbGwoMHhmZmZmZmYpO1xuICAgICAgICBtYXNrLmRyYXdSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZXR1cm4gbWFzaztcbiAgICB9XG5cbiAgICBhbmltYXRlRGVhbCgpIHtcbiAgICAgICAgY29uc3Qgc2hvd1R3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmRpc3BsYXkuY2FyZHMpLnRvKHt5OiAtdGhpcy5uYW1lcGxhdGUuaGVpZ2h0IC8gMn0sIDUwMCwgUGhhc2VyLkVhc2luZy5RdWFydGljLk91dCwgdHJ1ZSk7XG5cbiAgICAgICAgc2hvd1R3ZWVuLm9uQ29tcGxldGUuYWRkKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhcmRQb3NpdGlvbnMgPSB0aGlzLmNhbGNDYXJkUG9zaXRpb25zKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuY2FyZHMuY2FyZHNbaV0pLnRvKHt4OiBjYXJkUG9zaXRpb25zW2ldfSwgNTAwLCBQaGFzZXIuRWFzaW5nLlF1YXJ0aWMuT3V0LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgYW5pbWF0ZUZvbGQoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmFkZC50d2Vlbih0aGlzLmNhcmRzLmNhcmRzW2ldKS50byh7eDogMH0sIDUwMCwgUGhhc2VyLkVhc2luZy5RdWFydGljLk91dCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBoaWRlVHdlZW4gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuZGlzcGxheS5jYXJkcykudG8oe3RvcDogdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS50b3B9LCA1MDAsIFBoYXNlci5FYXNpbmcuUXVhcnRpYy5PdXQpO1xuICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKDUwMCwgKCkgPT4ge1xuICAgICAgICAgICAgaGlkZVR3ZWVuLnN0YXJ0KCk7XG4gICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgIHJldHVybiBoaWRlVHdlZW4ub25Db21wbGV0ZTtcbiAgICB9XG5cbiAgICBoaWRlQ2FyZHMoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkcy5jYXJkc1tpXS54ID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMudG9wID0gdGhpcy5kaXNwbGF5Lm5hbWVwbGF0ZS50b3A7XG4gICAgfVxuXG4gICAgc2hvd0NhcmRzKCkge1xuICAgICAgICBjb25zdCBjYXJkUG9zaXRpb25zID0gdGhpcy5jYWxjQ2FyZFBvc2l0aW9ucygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHMuY2FyZHNbaV0ueCA9IGNhcmRQb3NpdGlvbnNbaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLnkgPSAtdGhpcy5uYW1lcGxhdGUuaGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBDYWxjdWxhdGUgdGhlIGZpbmFsIHBvc2l0aW9ucyBvZiBhbGwgY2FyZHMgaW4gaGFuZFxuICAgICAqXG4gICAgICogTk9URSBUTyBNRTogRG9uJ3QgZnVjayB3aXRoIHRoaXMuIEl0IHRvb2sgYSBsb25nIHRpbWUgdG8gZ2V0IHJpZ2h0LlxuICAgICAqXG4gICAgICogVGhlIGNhcmRzIG5lZWQgdG8gYmUgcG9zaXRpb25lZCBjb3JyZWN0bHkgYm90aCBpbiByZWxhdGlvbiB0b1xuICAgICAqIHRoZW1zZWx2ZXMgKHN0YWdnZXJlZCBldmVubHkpIGFuZCBhbHNvIGluIHJlbGF0aW9uIHRvIHRoZSBuYW1lcGxhdGUuXG4gICAgICogRG9pbmcgdGhlIGxhdHRlciBieSBjZW50ZXJpbmcgdGhlIGNhcmRzJyBkaXNwbGF5IGdyb3VwIG9uIHRoZSBuYW1lcGxhdGVcbiAgICAgKiB3b3VsZCBoYXZlIGJlZW4gbXVjaCBlYXNpZXIsIGJ1dCB0aGF0IHdheSBtYWRlIGFuaW1hdGluZyB0aGUgY2FyZFxuICAgICAqIHNwcmVhZCBuZWFybHkgaW1wb3NzaWJsZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX1cbiAgICAgKi9cbiAgICBjYWxjQ2FyZFBvc2l0aW9ucygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNhcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHBvc2l0aW9ucyA9IFtdO1xuICAgICAgICBjb25zdCBjYXJkV2lkdGggPSB0aGlzLmNhcmRzLmNhcmRzWzBdLndpZHRoO1xuICAgICAgICBjb25zdCBjYXJkQXJlYSA9IHRoaXMuZGlzcGxheS5uYW1lcGxhdGUud2lkdGggKiAwLjk7XG4gICAgICAgIGNvbnN0IHRvdGFsV2lkdGggPSBjYXJkV2lkdGggKiB0aGlzLmNhcmRzLmxlbmd0aDtcbiAgICAgICAgY29uc3QgdG90YWxPdmVyZmxvdyA9IHRvdGFsV2lkdGggLSBjYXJkQXJlYTtcbiAgICAgICAgY29uc3QgY2FyZE9mZnNldCA9IHRvdGFsT3ZlcmZsb3cgLyAodGhpcy5jYXJkcy5sZW5ndGggLSAxKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBTcGFjZSBjYXJkcyBldmVubHlcbiAgICAgICAgICAgIGxldCBwb3MgPSBjYXJkV2lkdGggKiBpIC0gY2FyZE9mZnNldCAqIGk7XG5cbiAgICAgICAgICAgIC8vIENlbnRlciBjYXJkcyBvbiBuYW1lcGxhdGVcbiAgICAgICAgICAgIHBvcyAtPSBjYXJkQXJlYSAvIDIgLSBjYXJkV2lkdGggLyAyO1xuXG4gICAgICAgICAgICBwb3NpdGlvbnMucHVzaChwb3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3NpdGlvbnM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJpbXBvcnQgQ2hpcE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NoaXBNYW5hZ2VyXCI7XG5pbXBvcnQgT25lVGltZVNpZ25hbCBmcm9tIFwiLi4vY2xhc3Nlcy9PbmVUaW1lU2lnbmFsXCI7XG5cbmNsYXNzIFBvdCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmFtb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICAgICAgdGhpcy5jaGlwcyA9IG5ldyBDaGlwTWFuYWdlcih0aGlzLmdhbWUsIFwiY2hpcHNcIiwgdGhpcy5nYW1lLmNvbmZpZy5kZW5vbXMpO1xuICAgICAgICB0aGlzLmNoaXBzLnN0YWNrQ2hpcHMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jaGlwcy5jb2xvclVwID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuY2hpcHMuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmNoaXBzLnNldFZhbHVlKHRoaXMuYW1vdW50KTtcbiAgICB9XG5cbiAgICBzZXRBbW91bnQoYW1vdW50KSB7XG4gICAgICAgIHRoaXMuYW1vdW50ID0gYW1vdW50O1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBnYXRoZXJDaGlwcyhwbGF5ZXJzKSB7XG4gICAgICAgIGNvbnN0IGZpbmlzaGVkID0gbmV3IE9uZVRpbWVTaWduYWwoKTtcbiAgICAgICAgY29uc3QgcGxheWVyc1dpdGhDaGlwcyA9IHBsYXllcnMuZmlsdGVyKHBsYXllciA9PiBwbGF5ZXIuY2hpcHMuY2hpcHMubGVuZ3RoKTtcblxuICAgICAgICBsZXQgZGVsYXkgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllcnNXaXRoQ2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHBsYXllcnNXaXRoQ2hpcHNbaV07XG4gICAgICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKGRlbGF5LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbW91bnQgKz0gcGxheWVyLmNoaXBzLnZhbHVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRha2VDaGlwc0ZpbmlzaGVkID0gdGhpcy5jaGlwcy50YWtlQ2hpcHMocGxheWVyLmNoaXBzLmNoaXBzKTtcblxuICAgICAgICAgICAgICAgIHRha2VDaGlwc0ZpbmlzaGVkLmFkZCgoKSA9PiBjb25zb2xlLmxvZyhcInRha2VDaGlwc0ZpbmlzaGVkIFwiICsgaSkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHBsYXllcnNXaXRoQ2hpcHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICB0YWtlQ2hpcHNGaW5pc2hlZC5hZGQoKCkgPT4gZmluaXNoZWQuZGlzcGF0Y2goKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICBkZWxheSArPSAxMDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXBsYXllcnNXaXRoQ2hpcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmaW5pc2hlZC5kaXNwYXRjaCgpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmluaXNoZWQ7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb3Q7XG4iLCIvKipcbiAqIEEgc2xpZGVyIFVJIGVsZW1lbnRcbiAqXG4gKiBSZXByZXNlbnRlZCBieSBhIGJhciBzcHJpdGUgYW5kIGEgbWFya2VyIHNwcml0ZS4gRGVzcGl0ZSBob3cgaXQgbWF5XG4gKiBsb29rLCBhbGwgaW5wdXQgb2NjdXJzIG9uIHRoZSBiYXIgYW5kIHVwZGF0ZXMgYXJlIG1hZGUgdG8gdGhlXG4gKiBtYXJrZXIncyBwb3NpdGlvbiBiYXNlZCBvbiB0aG9zZSBpbnB1dHMuXG4gKi9cbmNsYXNzIFNsaWRlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJhciA9IG51bGw7ICAvLyBUaGUgc2xpZGVyIGJhciBzcHJpdGVcbiAgICAgICAgdGhpcy5tYXJrZXIgPSBudWxsOyAgLy8gVGhlIGRyYWdnYWJsZSBtYXJrZXIgc3ByaXRlXG4gICAgICAgIHRoaXMuaW5kZXggPSAwOyAgLy8gQ3VycmVudCBpbmRleCBvZiBtYXJrZXJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAxOyAgLy8gVG90YWwgbnVtYmVyIG9mIGluZGljZXNcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge307XG4gICAgICAgIHRoaXMuaW5kZXhDaGFuZ2VkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5zbGlkZXJXaGVlbCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuYmFyID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCB0aGlzLmtleSwgXCJzbGlkZXJfYmFyXCIpO1xuICAgICAgICB0aGlzLmJhci5pbnB1dEVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmJhci5ldmVudHMub25JbnB1dERvd24uYWRkKHRoaXMuc3RhcnREcmFnLCB0aGlzKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRVcC5hZGQodGhpcy5zdG9wRHJhZywgdGhpcyk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4gdGhpcy5lbmFibGVTbGlkZXJXaGVlbCh0cnVlKSk7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0T3V0LmFkZCgoKSA9PiB0aGlzLmVuYWJsZVNsaWRlcldoZWVsKGZhbHNlKSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYXIgPSB0aGlzLmJhcjtcblxuICAgICAgICB0aGlzLm1hcmtlciA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIHRoaXMua2V5LCBcInNsaWRlcl9tYXJrZXJcIik7XG4gICAgICAgIHRoaXMubWFya2VyLmFuY2hvci5zZXRUbygwLjUsIDApO1xuICAgICAgICB0aGlzLm1hcmtlci5ib3R0b20gPSB0aGlzLmJhci5ib3R0b207XG4gICAgICAgIHRoaXMuZGlzcGxheS5tYXJrZXIgPSB0aGlzLm1hcmtlcjtcbiAgICAgICAgdGhpcy5iYXIuYWRkQ2hpbGQodGhpcy5tYXJrZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEVuYWJsZSBzbGlkZXIgZHJhZ2dpbmcgYW5kIGluaXRpYXRlIGZpcnN0IGRyYWcgZXZlbnRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5TcHJpdGV9IGJhciAtIFRoZSBiYXIgc3ByaXRlIHRoYXQgd2FzIGNsaWNrZWRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Qb2ludGVyfSBwb2ludGVyIC0gVGhlIHBvaW50ZXIgd2hpY2ggaW5pdGlhdGVkIHRoZSBjbGlja1xuICAgICAqL1xuICAgIHN0YXJ0RHJhZyhiYXIsIHBvaW50ZXIpIHtcbiAgICAgICAgLy8gSW5pdGlhbCBjYWxsIHRvIHVwZGF0ZURyYWcgYWxsb3dzIGNoYW5naW5nIGJldCB3aXRoIGNsaWNrIG9uIGJhclxuICAgICAgICB0aGlzLnVwZGF0ZURyYWcocG9pbnRlciwgcG9pbnRlci54LCBwb2ludGVyLnkpO1xuICAgICAgICB0aGlzLmdhbWUuaW5wdXQuYWRkTW92ZUNhbGxiYWNrKHRoaXMudXBkYXRlRHJhZywgdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRGlzYWJsZSBzbGlkZXIgZHJhZ2dpbmdcbiAgICAgKi9cbiAgICBzdG9wRHJhZygpIHtcbiAgICAgICAgdGhpcy5nYW1lLmlucHV0LmRlbGV0ZU1vdmVDYWxsYmFjayh0aGlzLnVwZGF0ZURyYWcsIHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IENhbGN1bGF0ZSBzbGlkZXIgaW5kZXggYmFzZWQgb24gZHJhZyBpbnB1dFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlBvaW50ZXJ9IHBvaW50ZXIgLSBUaGUgc2xpZGluZyBwb2ludGVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgeCBjb29yZGluYXRlIG9mIHBvaW50ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSB5IGNvb3JkaW5hdGUgb2YgcG9pbnRlclxuICAgICAqL1xuICAgIHVwZGF0ZURyYWcocG9pbnRlciwgeCwgeSkge1xuICAgICAgICBsZXQgbG9jYWxYID0geCAtIHRoaXMuYmFyLndvcmxkLng7ICAvLyBDbGljayBwb3MgaW4gcmVsYXRpb24gdG8gYmFyXG5cbiAgICAgICAgLy8gUHJldmVudCBkcmFnZ2luZyBwYXN0IGJhciBib3VuZHNcbiAgICAgICAgaWYgKGxvY2FsWCA8IDApIHtcbiAgICAgICAgICAgIGxvY2FsWCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAobG9jYWxYID4gdGhpcy5iYXIud2lkdGgpIHtcbiAgICAgICAgICAgIGxvY2FsWCA9IHRoaXMuYmFyLndpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3VidHJhY3QgMSBmcm9tIGxlbmd0aCBiZWNhdXNlIGxlbmd0aCBpcyAxLWluZGV4ZWQsIGluZGljZXMgYXJlIDAtaW5kZXhlZFxuICAgICAgICBjb25zdCBpbmRleCA9IE1hdGgucm91bmQobG9jYWxYIC8gdGhpcy5iYXIud2lkdGggKiAodGhpcy5sZW5ndGggLSAxKSk7XG4gICAgICAgIHRoaXMuc2V0SW5kZXgoaW5kZXgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgaW5kZXggb2YgdGhlIHNsaWRlciBhbmQgcmVwb3J0IHRoZSBuZXcgdmFsdWVcbiAgICAgKlxuICAgICAqIE9wdGlvbmFsbHkgdXBkYXRlIHRoZSB2aXN1YWwgcG9zaXRpb24gb2YgdGhlIG1hcmtlciBvbiB0aGUgc2xpZGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0gTmV3IGluZGV4IHRvIHNldCBvbiBzbGlkZXJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFt1cGRhdGVQb3M9dHJ1ZV0gLSBVcGRhdGUgdGhlIHBvc2l0aW9uIG9mIG1hcmtlcj9cbiAgICAgKi9cbiAgICBzZXRJbmRleChpbmRleCwgdXBkYXRlUG9zID0gdHJ1ZSkge1xuICAgICAgICBpZiAoaW5kZXggIT09IHRoaXMuaW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhDaGFuZ2VkLmRpc3BhdGNoKGluZGV4KTtcblxuICAgICAgICAgICAgaWYgKHVwZGF0ZVBvcykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIG9ubHkgb25lIGJldCBhdmFpbGFibGUsIGl0J3MgYSBtYXggYmV0XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFya2VyLnggPSB0aGlzLmJhci53aWR0aDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBTdWJ0cmFjdCAxIGZyb20gbGVuZ3RoIGJlY2F1c2UgbGVuZ3RoIGlzIDEtaW5kZXhlZCwgaW5kaWNlcyBhcmUgMC1pbmRleGVkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFya2VyLnggPSB0aGlzLmJhci53aWR0aCAvICh0aGlzLmxlbmd0aCAtIDEpICogdGhpcy5pbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBVcGRhdGUgdGhlIGxlbmd0aCBwcm9wZXJ0eVxuICAgICAqXG4gICAgICogVGhlIGxlbmd0aCBwcm9wZXJ0eSBkZXNjcmliZXMgaG93IG1hbnkgZGlzY3JldGUgYmV0cyB0aGUgc2xpZGVyIGJhclxuICAgICAqIG11c3QgcmVwcmVzZW50LiBUaGUgc2xpZGVyIGRvZXMgbm90IGNhcmUgYWJvdXQgd2hhdCB0aGUgc3BlY2lmaWMgYmV0XG4gICAgICogaXQgcmVwcmVzZW50cyBpcywgb25seSB0aGF0IGl0IGhhcyBzb21lIG51bWJlciBvZiBpbmRpY2VzIGFsb25nIGl0c1xuICAgICAqIGxlbmd0aCBhbmQgdGhhdCBpdCBtdXN0IHJlcG9ydCBpdHMgaW5kZXggdG8gbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxlbmd0aCAtIFRoZSBuZXcgbGVuZ3RoIHRvIHNldFxuICAgICAqL1xuICAgIHNldExlbmd0aChsZW5ndGgpIHtcbiAgICAgICAgaWYgKGxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ2Fubm90IHNldCBzbGlkZXIgbGVuZ3RoIGxlc3MgdGhhbiAxXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2UgaWYgKGxlbmd0aCA+IHRoaXMuYmFyLndpZHRoKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJXYXJuaW5nOiBTZXR0aW5nIHNsaWRlciBzdG9wcyBncmVhdGVyIHRoYW4gbGVuZ3RoIG1heSByZXN1bHQgaW4gdW5leHBlY3RlZCBiZWhhdmlvclwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSB0aGUgc2xpZGVyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gSXMgdGhlIHNsaWRlciBlbmFibGVkP1xuICAgICAqL1xuICAgIHNldEVuYWJsZWQoZW5hYmxlZCkge1xuICAgICAgICB0aGlzLmJhci5pbnB1dEVuYWJsZWQgPSBlbmFibGVkO1xuXG4gICAgICAgIGxldCB0aW50ID0gZW5hYmxlZCA/IDB4RkZGRkZGIDogMHg4MDgwODA7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYXIudGludCA9IHRpbnQ7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tYXJrZXIudGludCA9IHRpbnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgRW5hYmxlIG9yIGRpc2FibGUgZGlzcGF0Y2ggb2Ygc2lnbmFsIG9uIHdoZWVsIHNjcm9sbFxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5hYmxlZCAtIElzIHRoZSBjYWxsYmFjayBlbmFibGVkIG9yIGRpc2FibGVkP1xuICAgICAqL1xuICAgIGVuYWJsZVNsaWRlcldoZWVsKGVuYWJsZWQpIHtcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS5tb3VzZVdoZWVsQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJXaGVlbC5kaXNwYXRjaCh0aGlzLmdhbWUuaW5wdXQubW91c2Uud2hlZWxEZWx0YSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmlucHV0Lm1vdXNlLm1vdXNlV2hlZWxDYWxsYmFjayA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNsaWRlcjsiLCIvKipcbiAqIEBzdW1tYXJ5IFRyYWNrIGFuZCBxdWV1ZSB0d2VlbnMgZ2FtZSB3aWRlXG4gKlxuICogSXQncyBlYXN5IHRvIGNoYWluIHR3ZWVucyB3aGVuIHRoZXkncmUgY3JlYXRlZCBhdCB0aGUgc2FtZSBwb2ludFxuICogaW4gdGltZSwgYnV0IHdoYXQgaWYgdHdvIHR3ZWVucyBhcmUgY3JlYXRlZCBhdCBjb21wbGV0ZWx5IGRpZmZlcmVudFxuICogcG9pbnRzPyBXaGF0IGlmIHRob3NlIHR3ZWVucyBuZWVkIHRvIHJ1biBjb25zZWN1dGl2ZWx5LCB0aGUgc2Vjb25kXG4gKiB3YWl0aW5nIGZvciB0aGUgZmlyc3QgdG8gY29tcGxldGUgYmVmb3JlIHN0YXJ0aW5nP1xuICovXG5cbmNsYXNzIFR3ZWVuUXVldWUge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcblxuICAgICAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgICAgIHRoaXMuY3VycmVudCA9IG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IHJ1bm5pbmcoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMuY3VycmVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBBZGQgYSB0d2VlbiB0byB0aGUgcXVldWVcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Ud2Vlbn0gdHdlZW4gLSBUaGUgdHdlZW4gdG8gYWRkIHRvIHRoZSBxdWV1ZVxuICAgICAqL1xuICAgIGFkZCh0d2Vlbikge1xuICAgICAgICAvLyBUd2VlbnMgYWRkZWQgdG8gdGhlIHF1ZXVlIG1heSBoYXZlIG90aGVyIG9uQ29tcGxldGUgY2FsbGJhY2tzLFxuICAgICAgICAvLyBidXQgdGhleSBtdXN0IGF0IGxlYXN0IGhhdmUgdGhpcyBvbmUsIHdoaWNoIHRyaWdnZXJzIHRoZVxuICAgICAgICAvLyBuZXh0IHR3ZWVuIGluIHRoZSBxdWV1ZSB0byBiZWdpblxuICAgICAgICB0d2Vlbi5vbkNvbXBsZXRlLmFkZCh0aGlzLm5leHQsIHRoaXMpO1xuXG4gICAgICAgIC8vIEFkZCB0byB0aGUgZnJvbnQsIHJlbW92ZSBmcm9tIHRoZSBiYWNrXG4gICAgICAgIHRoaXMucXVldWUudW5zaGlmdCh0d2Vlbik7XG5cbiAgICAgICAgLy8gQXV0byBzdGFydCB0aGUgY2hhaW4gaWYgaXQncyBub3QgYWxyZWFkeSBydW5uaW5nXG4gICAgICAgIGlmICghdGhpcy5ydW5uaW5nKSB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFN0YXJ0IHRoZSBuZXh0IHR3ZWVuIGluIHRoZSBxdWV1ZVxuICAgICAqL1xuICAgIG5leHQoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMucXVldWUucG9wKCk7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5zdGFydCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUd2VlblF1ZXVlOyIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJwYW5lbFwiOiB7XG4gICAgXCJwYWRkaW5nXCI6IDEwLFxuICAgIFwidGV4dFN0eWxlXCI6IHtcbiAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIixcbiAgICAgIFwiYWxpZ25cIjogXCJjZW50ZXJcIlxuICAgIH0sXG4gICAgXCJwb3NcIjoge1xuICAgICAgXCJ4XCI6IDE0ODAsXG4gICAgICBcInlcIjogNzkwXG4gICAgfVxuICB9LFxuICBcInNlYXRzXCI6IFtcbiAgICB7XCJ4XCI6IDg2MCwgXCJ5XCI6IDIwMH0sXG4gICAge1wieFwiOiAxMTc4LCBcInlcIjogMjAwfSxcbiAgICB7XCJ4XCI6IDE1MjIsIFwieVwiOiAzNDJ9LFxuICAgIHtcInhcIjogMTUyMiwgXCJ5XCI6IDYyNn0sXG4gICAge1wieFwiOiAxMTc4LCBcInlcIjogODk0fSxcbiAgICB7XCJ4XCI6IDg2MCwgXCJ5XCI6IDg5NH0sXG4gICAge1wieFwiOiA1NDIsIFwieVwiOiA4OTR9LFxuICAgIHtcInhcIjogMTk4LCBcInlcIjogNjI2fSxcbiAgICB7XCJ4XCI6IDE5OCwgXCJ5XCI6IDM0Mn0sXG4gICAge1wieFwiOiA1NDIsIFwieVwiOiAyMDB9XG4gIF0sXG4gIFwiYnV5SW5Nb2RhbFwiOiB7XG4gICAgXCJ4XCI6IDgxMCxcbiAgICBcInlcIjogNDMwLFxuICAgIFwiaW5wdXRCb3hcIjoge1xuICAgICAgXCJ4XCI6IDE1LFxuICAgICAgXCJ5XCI6IDg2XG4gICAgfSxcbiAgICBcImlucHV0RmllbGRcIjoge1xuICAgICAgXCJ4XCI6IDMwLFxuICAgICAgXCJ5XCI6IC0yXG4gICAgfSxcbiAgICBcImNhbmNlbEJ1dHRvblwiOiB7XG4gICAgICBcInhcIjogMTUsXG4gICAgICBcInlcIjogMTQ1XG4gICAgfSxcbiAgICBcInN1Ym1pdEJ1dHRvblwiOiB7XG4gICAgICBcInhcIjogMTU1LFxuICAgICAgXCJ5XCI6IDE0NVxuICAgIH1cbiAgfSxcbiAgXCJkZWFsZXJCdXR0b25cIjogW1xuICAgIHtcInhcIjogODQ2LCBcInlcIjogMzAwfSxcbiAgICB7XCJ4XCI6IDExNjQsIFwieVwiOiAzMDB9LFxuICAgIHtcInhcIjogMTUxNiwgXCJ5XCI6IDQ0Mn0sXG4gICAge1wieFwiOiAxNTE2LCBcInlcIjogNTkyfSxcbiAgICB7XCJ4XCI6IDExNTAsIFwieVwiOiA3OTB9LFxuICAgIHtcInhcIjogNzg0LCBcInlcIjogNzkwfSxcbiAgICB7XCJ4XCI6IDUyNiwgXCJ5XCI6IDc5MH0sXG4gICAge1wieFwiOiA0NDAsIFwieVwiOiA1OTJ9LFxuICAgIHtcInhcIjogNDQwLCBcInlcIjogNDQyfSxcbiAgICB7XCJ4XCI6IDUzMiwgXCJ5XCI6IDMwMH1cbiAgXSxcbiAgXCJkZW5vbXNcIjogWzUsIDI1LCAxMDAsIDUwMCwgMjAwMF0sXG4gIFwiY2hpcHNcIjogW1xuICAgIHtcInhcIjogMTAwLCBcInlcIjogMTIwfSxcbiAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IDEyMH0sXG4gICAge1wieFwiOiAtNjAsIFwieVwiOiA0MH0sXG4gICAge1wieFwiOiAtNjAsIFwieVwiOiA0MH0sXG4gICAge1wieFwiOiAxMDAsIFwieVwiOiAtMTQwfSxcbiAgICB7XCJ4XCI6IDEwMCwgXCJ5XCI6IC0xNDB9LFxuICAgIHtcInhcIjogMTAwLCBcInlcIjogLTE0MH0sXG4gICAge1wieFwiOiAyNDAsIFwieVwiOiA0MH0sXG4gICAge1wieFwiOiAyNDAsIFwieVwiOiA0MH0sXG4gICAge1wieFwiOiAxMDAsIFwieVwiOiAxMjB9XG4gIF0sXG4gIFwibmFtZXBsYXRlXCI6IHtcbiAgICBcIm5hbWVcIjoge1xuICAgICAgXCJ4XCI6IDEwLFxuICAgICAgXCJ5XCI6IDMwLFxuICAgICAgXCJzdHlsZVwiOiB7XG4gICAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgICBcImZpbGxcIjogXCIjMzMzMzMzXCJcbiAgICAgIH1cbiAgICB9LFxuICAgIFwiYmFsYW5jZVwiOiB7XG4gICAgICBcInhcIjogMTAsXG4gICAgICBcInlcIjogNjAsXG4gICAgICBcInN0eWxlXCI6IHtcbiAgICAgICAgXCJmb250XCI6IFwiMTZwdCBBcmlhbFwiLFxuICAgICAgICBcImJvdW5kc0FsaWduSFwiOiBcInJpZ2h0XCIsXG4gICAgICAgIFwiZmlsbFwiOiBcIiM1NTU1NTVcIlxuICAgICAgfVxuICAgIH0sXG4gICAgXCJmbGFzaFwiOiB7XG4gICAgICBcInN0eWxlXCI6IHtcbiAgICAgICAgXCJmb250XCI6IFwiYm9sZCAzMHB0IEFyaWFsXCIsXG4gICAgICAgIFwiZmlsbFwiOiBcIiMzMzMzMzNcIlxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgXCJwb3B1cFwiOiB7XG4gICAgXCJ4XCI6IDAsXG4gICAgXCJ5XCI6IDEwLFxuICAgIFwid2lkdGhcIjogNjAsXG4gICAgXCJoZWlnaHRcIjogMjAsXG4gICAgXCJ0ZXh0XCI6IHtcbiAgICAgIFwieFwiOiA2LFxuICAgICAgXCJ5XCI6IDE4LFxuICAgICAgXCJzdHlsZVwiOiB7XG4gICAgICAgIFwiZm9udFwiOiBcIjEycHQgQXJpYWxcIixcbiAgICAgICAgXCJib3VuZHNBbGlnbkhcIjogXCJjZW50ZXJcIixcbiAgICAgICAgXCJib3VuZHNBbGlnblZcIjogXCJjZW50ZXJcIixcbiAgICAgICAgXCJmaWxsXCI6IFwiI0ZGRkZGRlwiXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQ2FyZE1hbmFnZXIgZnJvbSBcIi4vQ2FyZE1hbmFnZXJcIjtcbmltcG9ydCBPbmVUaW1lU2lnbmFsIGZyb20gXCIuLi9jbGFzc2VzL09uZVRpbWVTaWduYWxcIjtcblxuY29uc3QgQ0FSRF9TRVBBUkFUT1IgPSAxLjI7XG5cbmNsYXNzIEJvYXJkTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7XG4gICAgICAgICAgICBjYXJkczogbnVsbCxcbiAgICAgICAgICAgIGNhcmRzTWFzazogbnVsbFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubnVtQ2FyZHMgPSAwO1xuICAgICAgICB0aGlzLm51bUNhcmRzUmV2ZWFsZWQgPSAwO1xuXG4gICAgICAgIHRoaXMuY2FyZHMgPSBuZXcgQ2FyZE1hbmFnZXIoZ2FtZSk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShudW1DYXJkcyA9IDUpIHtcbiAgICAgICAgLy8gVE9ETyAtIHRoaXMgd2lsbCBuZWVkIHRvIGJlIGR5bmFtaWMgZm9yIG90aGVyIGdhbWUgdHlwZXNcbiAgICAgICAgdGhpcy5udW1DYXJkcyA9IG51bUNhcmRzO1xuICAgICAgICB0aGlzLmNhcmRzLmluaXRpYWxpemUobnVtQ2FyZHMpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMgPSB0aGlzLmNhcmRzLmRpc3BsYXlHcm91cDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLmFsaWduKC0xLCAxLCB0aGlzLmNhcmRzLmNhcmRXaWR0aCAqIENBUkRfU0VQQVJBVE9SLCAxKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHNNYXNrID0gdGhpcy5jcmVhdGVDYXJkc01hc2soKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzTWFzay50b3AgPSAwO1xuICAgICAgICB0aGlzLmNhcmRzLm1hc2sgPSB0aGlzLmRpc3BsYXkuY2FyZHNNYXNrO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuY2FyZHMpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmNhcmRzTWFzayk7XG5cbiAgICAgICAgdGhpcy5oaWRlQ2FyZHMoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVDYXJkc01hc2soKSB7XG4gICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLmRpc3BsYXkuY2FyZHMuaGVpZ2h0ICogQ0FSRF9TRVBBUkFUT1I7XG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMuZGlzcGxheS5jYXJkcy53aWR0aDtcbiAgICAgICAgbGV0IG1hc2sgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKDAsIDApO1xuICAgICAgICBtYXNrLmJlZ2luRmlsbCgweGZmZmZmZik7XG4gICAgICAgIG1hc2suZHJhd1JlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIHJldHVybiBtYXNrO1xuICAgIH1cblxuICAgIGFuaW1hdGVSZXZlYWwoY2FyZHMpIHtcbiAgICAgICAgaWYgKCFjYXJkcykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRlbGF5ID0gMDtcbiAgICAgICAgbGV0IGNvbXBsZXRlID0gbmV3IE9uZVRpbWVTaWduYWwoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMubnVtQ2FyZHNSZXZlYWxlZDsgaSA8IGNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKGRlbGF5LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXJkcy5jYXJkc1tpXS5uYW1lID0gY2FyZHNbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgdHdlZW4gPSB0aGlzLmdhbWUuYWRkLnR3ZWVuKHRoaXMuY2FyZHMuY2FyZHNbaV0pLnRvKHtib3R0b206IDB9LCAxMDAwLCBQaGFzZXIuRWFzaW5nLkJhY2suSW5PdXQsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoNTAwLCB0aGlzLmNhcmRzLmNhcmRzW2ldLmFuaW1hdGVGbGlwLCB0aGlzLmNhcmRzLmNhcmRzW2ldKTtcblxuICAgICAgICAgICAgICAgIGlmIChpID09PSB0aGlzLmNhcmRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoY29tcGxldGUuZGlzcGF0Y2gsIGNvbXBsZXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRlbGF5ICs9IDIwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubnVtQ2FyZHNSZXZlYWxlZCA9IGNhcmRzLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gY29tcGxldGU7XG4gICAgfVxuXG4gICAgYW5pbWF0ZUhpZGUoKSB7XG4gICAgICAgIGxldCBkZWxheSA9IDA7XG4gICAgICAgIGxldCBjb21wbGV0ZSA9IG5ldyBPbmVUaW1lU2lnbmFsKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5udW1DYXJkc1JldmVhbGVkOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoZGVsYXksICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0d2VlbiA9IHRoaXMuZ2FtZS5hZGQudHdlZW4odGhpcy5jYXJkcy5jYXJkc1tpXSkudG8oe3RvcDogMH0sIDEwMDAsIFBoYXNlci5FYXNpbmcuQmFjay5Jbk91dCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhcmRzLmNhcmRzW2ldLmZhY2VVcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHRoaXMubnVtQ2FyZHNSZXZlYWxlZCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoY29tcGxldGUuZGlzcGF0Y2gsIGNvbXBsZXRlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRlbGF5ICs9IDIwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbXBsZXRlLmFkZCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm51bUNhcmRzUmV2ZWFsZWQgPSAwO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjb21wbGV0ZTtcbiAgICB9XG5cbiAgICBoaWRlQ2FyZHMoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcy50b3AgPSB0aGlzLmRpc3BsYXkuY2FyZHNNYXNrLmJvdHRvbTtcbiAgICB9XG5cbiAgICBzaG93Q2FyZHMoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcy5ib3R0b20gPSB0aGlzLmRpc3BsYXkuY2FyZHNNYXNrLmJvdHRvbTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvYXJkTWFuYWdlcjtcbiIsImltcG9ydCBCdXR0b24gZnJvbSBcIi4uL2NsYXNzZXMvQnV0dG9uXCI7XG5cbmNsYXNzIEJ1eUluTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5KSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLmJ1eUluUmVxdWVzdGVkID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICAgICAgdGhpcy5zZWF0cyA9IHt9O1xuXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcImJ1dHRvbnNcIjogW10sIFwibW9kYWxcIjogbnVsbCwgXCJpbnB1dEJveFwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmJ1dHRvbnNHcm91cCk7XG5cbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5kYXRhID0ge1wic2VhdE51bVwiOiBudWxsLCBcImJ1eUluXCI6IG51bGx9O1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkICYmIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkLnZpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShzZWF0Q29uZmlnLCBvY2N1cGllZFNlYXRzLCBtb2RhbENvbmZpZykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXRDb25maWcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBidXR0b24gPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgc2VhdENvbmZpZ1tpXS54LCBzZWF0Q29uZmlnW2ldLnksIHRoaXMua2V5LCB0aGlzLmJ1dHRvbkNsaWNrZWQsIHRoaXMpO1xuICAgICAgICAgICAgYnV0dG9uLnNlYXROdW0gPSBpOyAvLyBTdG9yZSBmb3IgdXNlIG9uIGNsaWNrXG4gICAgICAgICAgICBidXR0b24uc2V0RnJhbWVzKFxuICAgICAgICAgICAgICAgIFwiYnRuX2J1eWluX292ZXJcIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9vdXRcIixcbiAgICAgICAgICAgICAgICBcImJ0bl9idXlpbl9kb3duXCIsXG4gICAgICAgICAgICAgICAgXCJidG5fYnV5aW5fdXBcIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGJ1dHRvbi5zZXRUZXh0KFwiQnV5IEluXCIpO1xuICAgICAgICAgICAgdGhpcy5zZWF0c1tpXSA9IHtcbiAgICAgICAgICAgICAgICBcImJ1dHRvblwiOiBidXR0b24sXG4gICAgICAgICAgICAgICAgXCJvY2N1cGllZFwiOiBvY2N1cGllZFNlYXRzLmluZGV4T2YoaSkgIT09IC0xXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmJ1dHRvbnMucHVzaChidXR0b24pO1xuICAgICAgICAgICAgdGhpcy5idXR0b25zR3JvdXAuYWRkKGJ1dHRvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAudmlzaWJsZSA9IHRoaXMuYnV0dG9uc1Zpc2libGU7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsQmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgdGhpcy5nYW1lLnRleHR1cmVzLm1vZGFsQmFja2dyb3VuZCk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkubW9kYWxCYWNrZ3JvdW5kKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwgPSB0aGlzLmdhbWUuYWRkLmltYWdlKG1vZGFsQ29uZmlnLngsIG1vZGFsQ29uZmlnLnksIHRoaXMua2V5LCBcIm1vZGFsXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGRDaGlsZCh0aGlzLmRpc3BsYXkubW9kYWwpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5pbnB1dEJveCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UobW9kYWxDb25maWcuaW5wdXRCb3gueCwgbW9kYWxDb25maWcuaW5wdXRCb3gueSwgdGhpcy5rZXksIFwiaW5wdXRfYm94XCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubW9kYWwuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmlucHV0Qm94KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuaW5wdXRGaWVsZCA9IHRoaXMuZ2FtZS5hZGQuaW5wdXRGaWVsZChtb2RhbENvbmZpZy5pbnB1dEZpZWxkLngsIG1vZGFsQ29uZmlnLmlucHV0RmllbGQueSwge1xuICAgICAgICAgICAgZm9udDogJzMycHggQXJpYWwnLFxuICAgICAgICAgICAgZmlsbDogJyMzMzMzMzMnLFxuICAgICAgICAgICAgd2lkdGg6IDIyMCxcbiAgICAgICAgICAgIHBhZGRpbmc6IDgsXG4gICAgICAgICAgICBib3JkZXJXaWR0aDogMCxcbiAgICAgICAgICAgIHBsYWNlSG9sZGVyOiAnMjAuMDAnLFxuICAgICAgICAgICAgdHlwZTogUGhhc2VySW5wdXQuSW5wdXRUeXBlLm51bWJlcixcbiAgICAgICAgICAgIGZpbGxBbHBoYTogMFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmlucHV0Qm94LmFkZENoaWxkKHRoaXMuZGlzcGxheS5pbnB1dEZpZWxkKTtcblxuICAgICAgICBjb25zdCBidG5UZXh0U3R5bGUgPSB7XG4gICAgICAgICAgICBcImZvbnRcIjogXCJib2xkIDIycHQgQXJpYWxcIixcbiAgICAgICAgICAgIFwiZmlsbFwiOiBcIndoaXRlXCIsXG4gICAgICAgICAgICBcImFsaWduXCI6IFwiY2VudGVyXCJcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FuY2VsID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIG1vZGFsQ29uZmlnLmNhbmNlbEJ1dHRvbi54LCBtb2RhbENvbmZpZy5jYW5jZWxCdXR0b24ueSwgdGhpcy5rZXksIHRoaXMuY2FuY2VsLCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhbmNlbC5zZXRGcmFtZXMoXG4gICAgICAgICAgICBcImJ0bl9zZWNvbmRhcnlfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X291dFwiLFxuICAgICAgICAgICAgXCJidG5fc2Vjb25kYXJ5X2Rvd25cIixcbiAgICAgICAgICAgIFwiYnRuX3NlY29uZGFyeV91cFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0VGV4dFN0eWxlKGJ0blRleHRTdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYW5jZWwuc2V0VGV4dChcIkNBTkNFTFwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLmFkZENoaWxkKHRoaXMuZGlzcGxheS5jYW5jZWwpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQgPSBuZXcgQnV0dG9uKHRoaXMuZ2FtZSwgbW9kYWxDb25maWcuc3VibWl0QnV0dG9uLngsIG1vZGFsQ29uZmlnLnN1Ym1pdEJ1dHRvbi55LCB0aGlzLmtleSwgdGhpcy5zdWJtaXQsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc3VibWl0LnNldEZyYW1lcyhcbiAgICAgICAgICAgIFwiYnRuX3ByaW1hcnlfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV9vdXRcIixcbiAgICAgICAgICAgIFwiYnRuX3ByaW1hcnlfZG93blwiLFxuICAgICAgICAgICAgXCJidG5fcHJpbWFyeV91cFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0VGV4dFN0eWxlKGJ0blRleHRTdHlsZSk7XG4gICAgICAgIHRoaXMuZGlzcGxheS5zdWJtaXQuc2V0VGV4dChcIkJVWSBJTlwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm1vZGFsLmFkZENoaWxkKHRoaXMuZGlzcGxheS5zdWJtaXQpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG5ld1BsYXllcihwbGF5ZXJEYXRhKSB7XG4gICAgICAgIHRoaXMuc2VhdHNbcGxheWVyRGF0YS5zZWF0XS5vY2N1cGllZCA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHBsYXllckxlZnQocGxheWVyRGF0YSkge1xuICAgICAgICB0aGlzLnNlYXRzW3BsYXllckRhdGEuc2VhdF0ub2NjdXBpZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgZm9yIChsZXQgc2VhdE51bSBpbiB0aGlzLnNlYXRzKSB7XG4gICAgICAgICAgICBsZXQgc2VhdCA9IHRoaXMuc2VhdHNbc2VhdE51bV07XG4gICAgICAgICAgICBzZWF0LmJ1dHRvbi52aXNpYmxlID0gIXNlYXQub2NjdXBpZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idXR0b25zR3JvdXAudmlzaWJsZSA9IHRoaXMuYnV0dG9uc1Zpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbC52aXNpYmxlID0gdGhpcy5tb2RhbFZpc2libGU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5tb2RhbEJhY2tncm91bmQudmlzaWJsZSA9IHRoaXMubW9kYWxWaXNpYmxlO1xuICAgIH1cblxuICAgIGJ1dHRvbkNsaWNrZWQoYnV0dG9uKSB7XG4gICAgICAgIHRoaXMuZGF0YS5zZWF0TnVtID0gYnV0dG9uLnNlYXROdW07XG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBjYW5jZWwoKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IHtcInNlYXROdW1cIjogbnVsbCwgXCJidXlJblwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHN1Ym1pdCgpIHtcbiAgICAgICAgdGhpcy5kYXRhLmJ1eUluID0gdGhpcy5kaXNwbGF5LmlucHV0RmllbGQudmFsdWU7XG4gICAgICAgIHRoaXMuYnV5SW5SZXF1ZXN0ZWQuZGlzcGF0Y2godGhpcy5kYXRhLnNlYXROdW0sIHRoaXMuZGF0YS5idXlJbik7XG4gICAgICAgIHRoaXMuZGF0YSA9IHtcInNlYXROdW1cIjogbnVsbCwgXCJidXlJblwiOiBudWxsfTtcbiAgICAgICAgdGhpcy5tb2RhbFZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5idXR0b25zVmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRCdXR0b25zVmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMuYnV0dG9uc1Zpc2libGUgPSB2aXNpYmxlO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1eUluTWFuYWdlcjsiLCJpbXBvcnQgQ2FyZCBmcm9tIFwiLi4vY2xhc3Nlcy9DYXJkXCI7XG5cbmNsYXNzIENhcmRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXkgPSBcImNhcmRzXCIpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMuY2FyZHMgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuX21hc2sgPSBudWxsOyAgLy8gQSBtYXNrIGFwcGxpZWQgdG8gYWxsIGNhcmRzIGluIGRpc3BsYXlHcm91cFxuICAgIH1cblxuICAgIGluaXRpYWxpemUobnVtQ2FyZHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1DYXJkczsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2FyZCA9IG5ldyBDYXJkKHRoaXMuZ2FtZSwgMCwgMCwgdGhpcy5rZXksIHRoaXMpO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplKHt9KTtcblxuICAgICAgICAgICAgdGhpcy5jYXJkcy5wdXNoKGNhcmQpO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKGNhcmQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q2FyZE5hbWVzKG5hbWVzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG5hbWVzW2ldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q2FyZHNGYWNlVXAoZmFjZVVwKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS5mYWNlVXAgPSBmYWNlVXA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLm5hbWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmbGlwKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FyZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0uZmxpcCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5pbWF0ZUZsaXAoKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jYXJkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGNvbXBsZXRlID0gdGhpcy5jYXJkc1tpXS5hbmltYXRlRmxpcCgpO1xuXG4gICAgICAgICAgICBpZiAoaSA9PT0gdGhpcy5jYXJkcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbXBsZXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FyZHMubGVuZ3RoO1xuICAgIH1cblxuICAgIHNldCBtYXNrKG1hc2spIHtcbiAgICAgICAgdGhpcy5fbWFzayA9IG1hc2s7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLm1hc2sgPSBtYXNrO1xuICAgIH1cblxuICAgIGdldCBtYXNrKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFzaztcbiAgICB9XG5cbiAgICBnZXQgY2FyZFdpZHRoKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2FyZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYXJkc1swXS53aWR0aDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmRNYW5hZ2VyO1xuIiwiaW1wb3J0IENoaXAgZnJvbSBcIi4uL2NsYXNzZXMvQ2hpcFwiO1xuaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcblxuY2xhc3MgVG9vbHRpcCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5LCBwYWRkaW5nID0gMTApIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMucGFkZGluZyA9IHBhZGRpbmc7XG5cbiAgICAgICAgdGhpcy5fdGV4dCA9IFwiXCI7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IG51bGwsXG4gICAgICAgICAgICB0ZXh0OiBudWxsXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXQgdGV4dCh0ZXh0KSB7XG4gICAgICAgIHRoaXMuX3RleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dC50ZXh0ID0gdGV4dDtcbiAgICAgICAgdGhpcy5yZVBvcygpO1xuICAgIH1cblxuICAgIGdldCB0ZXh0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGV4dDtcbiAgICB9XG5cbiAgICBzZXQgdmlzaWJsZSh2aXNpYmxlKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLnZpc2libGUgPSB2aXNpYmxlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIHRoaXMua2V5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhY2tncm91bmQuYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMiwgXCJcIik7ICAgLy8gVE9ETyAtIE5vIG1hZ2ljIG51bWJlcnMgKGxlYXZpbmcgZm9yIG5vdyBiZWNhdXNlIGZ1Y2sgdHJ5aW5nIHRvIHBvc2l0aW9uIHRleHQgdmVydGljYWxseSlcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQuc2V0U3R5bGUoe1xuICAgICAgICAgICAgXCJmb250XCI6IFwiMTZwdCBBcmlhbFwiLFxuICAgICAgICAgICAgXCJmaWxsXCI6IFwiI0ZGRkZGRlwiXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmRpc3BsYXkudGV4dC5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmJhY2tncm91bmQpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnRleHQpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC52aXNpYmxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVQb3MoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS50ZXh0LnNjYWxlLnNldFRvKDEpO1xuICAgICAgICBjb25zdCB0ZXh0QXJlYSA9IHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kLndpZHRoIC0gKHRoaXMucGFkZGluZyAqIDIpO1xuICAgICAgICBpZiAodGhpcy5kaXNwbGF5LnRleHQud2lkdGggPiB0ZXh0QXJlYSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LnRleHQuc2NhbGUuc2V0VG8odGV4dEFyZWEgLyB0aGlzLmRpc3BsYXkudGV4dC53aWR0aCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIENoaXBNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBrZXksIHZhbHVlcykge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgICAgICAgdGhpcy5zdGFja0NoaXBzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb2xvclVwID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jaGlwcyA9IFtdO1xuICAgICAgICB0aGlzLnBvb2wgPSBbXTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBudWxsO1xuICAgICAgICB0aGlzLnRvb2x0aXAgPSBuZXcgVG9vbHRpcCh0aGlzLmdhbWUsIHRoaXMuZ2FtZS50ZXh0dXJlcy50ZXh0VW5kZXJsYXkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ID0ge1xuICAgICAgICAgICAgY2hpcHM6IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKSxcbiAgICAgICAgICAgIHRvb2x0aXA6IHRoaXMudG9vbHRpcC5kaXNwbGF5R3JvdXBcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy50cmFuc2ZlckFuaW1hdGlvbiA9IHRoaXMuYW5pbWF0ZUNoaXBDYXNjYWRlO1xuICAgICAgICB0aGlzLnBpbGVSYWRpdXMgPSAzMDtcbiAgICB9XG5cbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy50b29sdGlwLnRleHQgPSBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5fdmFsdWUpO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnRvb2x0aXAuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnRvb2x0aXAueSA9IHRoaXMuZGlzcGxheS50b29sdGlwLmhlaWdodDtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5jaGlwcyk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkudG9vbHRpcCk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoMCk7XG4gICAgfVxuXG4gICAgZ2V0Q2hpcCgpIHtcbiAgICAgICAgbGV0IGNoaXAgPSB0aGlzLnBvb2wucG9wKCk7XG4gICAgICAgIGlmICghY2hpcCkge1xuICAgICAgICAgICAgY2hpcCA9IG5ldyBDaGlwKHRoaXMuZ2FtZSwgMCwgMCwgdGhpcy5rZXksIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5zZXRDaGlwSW5wdXRzKGNoaXApO1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5LmNoaXBzLmFkZENoaWxkKGNoaXApO1xuICAgICAgICB9XG4gICAgICAgIGNoaXAucmV2aXZlKCk7XG4gICAgICAgIGNoaXAucGFyZW50LmJyaW5nVG9Ub3AoY2hpcCk7XG4gICAgICAgIHRoaXMuY2hpcHMucHVzaChjaGlwKTtcbiAgICAgICAgcmV0dXJuIGNoaXA7XG4gICAgfVxuXG4gICAgc2V0Q2hpcElucHV0cyhjaGlwKSB7XG4gICAgICAgIGNoaXAuZXZlbnRzLm9uSW5wdXRPdmVyLnJlbW92ZUFsbCgpO1xuICAgICAgICBjaGlwLmV2ZW50cy5vbklucHV0T3Zlci5hZGQoKCkgPT4ge3RoaXMudG9vbHRpcC52aXNpYmxlID0gdHJ1ZX0pO1xuXG4gICAgICAgIGNoaXAuZXZlbnRzLm9uSW5wdXRPdXQucmVtb3ZlQWxsKCk7XG4gICAgICAgIGNoaXAuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHt0aGlzLnRvb2x0aXAudmlzaWJsZSA9IGZhbHNlfSk7XG4gICAgfVxuXG4gICAgc2V0VmFsdWUodmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSB0aGlzLl92YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29sb3JVcCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgLT0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgKz0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgeVBvcyA9IDA7XG4gICAgICAgIGxldCB2YWx1ZXNQdHIgPSB0aGlzLnZhbHVlcy5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAodmFsdWUgPj0gMjUpIHtcbiAgICAgICAgICAgIHdoaWxlICh2YWx1ZSA8IHRoaXMudmFsdWVzW3ZhbHVlc1B0cl0pIHtcbiAgICAgICAgICAgICAgICB2YWx1ZXNQdHItLTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVzUHRyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBjaGlwID0gdGhpcy5nZXRDaGlwKCk7XG4gICAgICAgICAgICBjaGlwLnZhbHVlID0gdGhpcy52YWx1ZXNbdmFsdWVzUHRyXTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhY2tDaGlwcykge1xuICAgICAgICAgICAgICAgIGNoaXAueSA9IHlQb3M7XG4gICAgICAgICAgICAgICAgeVBvcyAtPSA1O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGlwcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpcC54ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgY2hpcC55ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmFuZFBvcyA9IHRoaXMucmFuZENoaXBQb3MoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hpcC54ID0gcmFuZFBvcy54O1xuICAgICAgICAgICAgICAgICAgICBjaGlwLnkgPSByYW5kUG9zLnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgLT0gdGhpcy52YWx1ZXNbdmFsdWVzUHRyXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICBsZXQgY2hpcDtcbiAgICAgICAgd2hpbGUgKGNoaXAgPSB0aGlzLmNoaXBzLnBvcCgpKSB7XG4gICAgICAgICAgICB0aGlzLnBvb2wucHVzaChjaGlwKTtcbiAgICAgICAgICAgIGNoaXAua2lsbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJDaGlwKGNoaXApIHtcbiAgICAgICAgLy8gUmVtb3ZlIGNoaXAgZnJvbSB0aGlzLmNoaXBzIGlmIGZvdW5kXG4gICAgICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaXBzW2ldLmlkID09PSBjaGlwLmlkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGlwcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICB0aGlzLnBvb2wucHVzaChjaGlwKTtcbiAgICAgICAgICAgIGNoaXAua2lsbCgpO1xuICAgICAgICAgICAgcmV0dXJuIGNoaXA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0YWtlQ2hpcHMoY2hpcHMpIHtcbiAgICAgICAgY2hpcHMgPSBjaGlwcy5zbGljZSgpO1xuICAgICAgICBsZXQgbmV3Q2hpcHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IG5ld0NoaXAgPSB0aGlzLnRha2VDaGlwKGNoaXBzW2ldKTtcbiAgICAgICAgICAgIG5ld0NoaXBzLnB1c2gobmV3Q2hpcCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2ZlckFuaW1hdGlvbihuZXdDaGlwcyk7XG4gICAgfVxuXG4gICAgdGFrZUNoaXAoc3JjQ2hpcCkge1xuICAgICAgICBsZXQgbmV3Q2hpcCA9IHRoaXMuZ2V0Q2hpcCgpO1xuICAgICAgICBuZXdDaGlwLmNsb25lKHNyY0NoaXApO1xuICAgICAgICB0aGlzLnNldENoaXBJbnB1dHMobmV3Q2hpcCk7XG5cbiAgICAgICAgc3JjQ2hpcC5tYW5hZ2VyLmNsZWFyQ2hpcChzcmNDaGlwKTtcblxuICAgICAgICB0aGlzLnZhbHVlICs9IHNyY0NoaXAudmFsdWU7XG5cbiAgICAgICAgcmV0dXJuIG5ld0NoaXA7XG4gICAgfVxuXG4gICAgYW5pbWF0ZVN0YWNrVHJhbnNmZXIoKSB7XG5cbiAgICB9XG5cbiAgICBhbmltYXRlQ2hpcENhc2NhZGUoY2hpcHMpIHtcbiAgICAgICAgY29uc3QgZmluaXNoZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuXG4gICAgICAgIGxldCBkZWxheSA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjaGlwID0gY2hpcHNbaV07XG4gICAgICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKGRlbGF5LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJhbmRQb3MgPSB0aGlzLnJhbmRDaGlwUG9zKCk7XG4gICAgICAgICAgICAgICAgbGV0IHR3ZWVuID0gdGhpcy5nYW1lLmFkZC50d2VlbihjaGlwKS50byh7eDogcmFuZFBvcy54LCB5OiByYW5kUG9zLnl9LCAyMDAsIFBoYXNlci5FYXNpbmcuUXVhZHJhdGljLkluT3V0LCB0cnVlKTtcblxuICAgICAgICAgICAgICAgIGlmIChpID09PSBjaGlwcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHR3ZWVuLm9uQ29tcGxldGUuYWRkKGZpbmlzaGVkLmRpc3BhdGNoLCBmaW5pc2hlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICBkZWxheSArPSAxMDA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmluaXNoZWQ7XG4gICAgfVxuXG4gICAgcmFuZENoaXBQb3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKC10aGlzLnBpbGVSYWRpdXMsIHRoaXMucGlsZVJhZGl1cyksXG4gICAgICAgICAgICB5OiB0aGlzLmdhbWUucm5kLmludGVnZXJJblJhbmdlKC10aGlzLnBpbGVSYWRpdXMsIHRoaXMucGlsZVJhZGl1cylcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENoaXBNYW5hZ2VyO1xuIiwiY2xhc3MgRXZlbnRSZWdpc3RlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIH1cblxuICAgIGFkZChrZXksIHNpZ25hbCkge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNba2V5XSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiVGltaW5nTWFuYWdlciBhbHJlYWR5IGhhcyBhbiBldmVudCBmb3Iga2V5IFwiICsga2V5KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50c1trZXldID0gc2lnbmFsO1xuICAgICAgICBzaWduYWwuYWRkKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiREVMRVRJTkcgRVZFTlRcIik7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNba2V5XTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0KGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5ldmVudHNba2V5XTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50UmVnaXN0ZXI7XG4iLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi9jbGFzc2VzL1BsYXllclwiO1xuXG5jbGFzcyBQbGF5ZXJNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB1c2VySWQsIHNlYXRDb25maWcsIGNoaXBDb25maWcpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy51c2VySWQgPSB1c2VySWQ7XG4gICAgICAgIHRoaXMuc2VhdENvbmZpZyA9IHNlYXRDb25maWc7XG4gICAgICAgIHRoaXMuY2hpcENvbmZpZyA9IGNoaXBDb25maWc7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107ICAvLyBEaXJlY3QgYWNjZXNzIHRvIHRoZSBQbGF5ZXIgb2JqZWN0c1xuICAgICAgICB0aGlzLnVzZXJQbGF5ZXIgPSBudWxsOyAgLy8gVGhlIHVzZXIncyBwbGF5ZXIgb2JqZWN0LCBpZiBhdmFpbGFibGVcbiAgICAgICAgdGhpcy5uZXh0UGxheWVyID0gbnVsbDsgIC8vIFRoZSBwbGF5ZXIgdGhhdCB0aGUgZ2FtZSBleHBlY3RzIHRvIGFjdCBuZXh0XG4gICAgICAgIHRoaXMuZGVhbGVyUGxheWVyID0gbnVsbDsgICAvLyBDdXJyZW50IGhhbmQncyBkZWFsZXJcblxuICAgICAgICAvLyBDb250YWlucyBhbGwgZGlzcGxheSBlbGVtZW50cyBmb3IgYWxsIHBsYXllcnMgaW4gdGhlIGdhbWVcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgfVxuXG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGxheWVycy5sZW5ndGg7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5uZXdQbGF5ZXIocGxheWVyRGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZXdQbGF5ZXIocGxheWVyRGF0YSkge1xuICAgICAgICBsZXQgcGxheWVyID0gbmV3IFBsYXllcih0aGlzLmdhbWUsIHRoaXMuY2hpcENvbmZpZyk7XG4gICAgICAgIHBsYXllci5pbml0aWFsaXplKHBsYXllckRhdGEpO1xuICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnggPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS54O1xuICAgICAgICBwbGF5ZXIuZGlzcGxheUdyb3VwLnkgPSB0aGlzLnNlYXRDb25maWdbcGxheWVyRGF0YS5zZWF0XS55O1xuXG4gICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChwbGF5ZXIuZGlzcGxheUdyb3VwKTtcblxuICAgICAgICBpZiAocGxheWVyLnVzZXJJZCA9PT0gdGhpcy51c2VySWQpIHtcbiAgICAgICAgICAgIHRoaXMudXNlclBsYXllciA9IHBsYXllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgcGxheWVyTGVmdChwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGxldCBwbGF5ZXIgPSB0aGlzLmdldEJ5SWQocGxheWVyRGF0YS5pZCk7XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIkNvdWxkIG5vdCBmaW5kIHBsYXllciBhdCB0YWJsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXllci5kaXNwbGF5R3JvdXAuZGVzdHJveSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1tpXSA9PT0gcGxheWVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbGF5ZXIgPT09IHRoaXMudXNlclBsYXllcikge1xuICAgICAgICAgICAgdGhpcy51c2VyUGxheWVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbGF5ZXI7XG4gICAgfVxuXG4gICAgZ2V0QnlJZChpZCkge1xuICAgICAgICAvLyBUT0RPIC0gRG8gdGhpcyB3aXRob3V0IGl0ZXJhdGluZyAtLSBidWlsZCBtYXAgb24gaW5pdD9cbiAgICAgICAgLy8gVE9ETyAtIFNob3VsZCB0aGlzIGV2ZXIgcmV0dXJuIG51bGw/XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldLmlkID09PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0QnlTZWF0KHNlYXQpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzW2ldLnNlYXQgPT09IHNlYXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEdldCBhIGxpc3Qgb2YgYWxsIG9jY3VwaWVkIHNlYXRzIGF0IHRoZSB0YWJsZVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJbXX0gLSBUaGUgSURzIG9mIG9jY3VwaWVkIHNlYXRzXG4gICAgICovXG4gICAgZ2V0T2NjdXBpZWRTZWF0cygpIHtcbiAgICAgICAgbGV0IG9jY3VwaWVkU2VhdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG9jY3VwaWVkU2VhdHMucHVzaCh0aGlzLnBsYXllcnNbaV0uc2VhdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9jY3VwaWVkU2VhdHM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXJNYW5hZ2VyO1xuIiwiY29uc3QgaXNTdHJpbmcgPSB2YWwgPT4gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZyc7XG5jb25zdCBpc0Jsb2IgPSB2YWwgPT4gdmFsIGluc3RhbmNlb2YgQmxvYjtcblxucG9seWZpbGwuY2FsbCh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyA/IHdpbmRvdyA6IHRoaXMgfHwge30pO1xuXG5mdW5jdGlvbiBwb2x5ZmlsbCgpIHtcbiAgaWYgKGlzU3VwcG9ydGVkLmNhbGwodGhpcykpIHJldHVybjtcblxuICBpZiAoISgnbmF2aWdhdG9yJyBpbiB0aGlzKSkgdGhpcy5uYXZpZ2F0b3IgPSB7fTtcbiAgdGhpcy5uYXZpZ2F0b3Iuc2VuZEJlYWNvbiA9IHNlbmRCZWFjb24uYmluZCh0aGlzKTtcbn07XG5cbmZ1bmN0aW9uIHNlbmRCZWFjb24odXJsLCBkYXRhKSB7XG4gIGNvbnN0IGV2ZW50ID0gdGhpcy5ldmVudCAmJiB0aGlzLmV2ZW50LnR5cGU7XG4gIGNvbnN0IHN5bmMgPSBldmVudCA9PT0gJ3VubG9hZCcgfHwgZXZlbnQgPT09ICdiZWZvcmV1bmxvYWQnO1xuXG4gIGNvbnN0IHhociA9ICgnWE1MSHR0cFJlcXVlc3QnIGluIHRoaXMpID8gbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcbiAgeGhyLm9wZW4oJ1BPU1QnLCB1cmwsICFzeW5jKTtcbiAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBY2NlcHQnLCAnKi8qJyk7XG5cblxuICBpZiAoaXNTdHJpbmcoZGF0YSkpIHtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSAndGV4dC9wbGFpbic7XG4gIH0gZWxzZSBpZiAoaXNCbG9iKGRhdGEpICYmIGRhdGEudHlwZSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCBkYXRhLnR5cGUpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICB4aHIuc2VuZChkYXRhKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XG4gIHJldHVybiAoJ25hdmlnYXRvcicgaW4gdGhpcykgJiYgKCdzZW5kQmVhY29uJyBpbiB0aGlzLm5hdmlnYXRvcik7XG59IiwiaW1wb3J0IGNvbmZpZyBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgQ29udHJvbGxlciBmcm9tIFwiLi4vY2xhc3Nlcy9Db250cm9sbGVyXCI7XG5cbmNsYXNzIEJvb3QgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5pbml0aWFsRGF0YSA9IHRoaXMuYXVnbWVudEluaXRpYWxEYXRhKGluaXRpYWxEYXRhKTtcbiAgICAgICAgdGhpcy5nYW1lLmNvbmZpZyA9IGNvbmZpZztcblxuICAgICAgICAvLyBUT0RPIC0gVGhpcyBzaG91bGQgY29tZSBmcm9tIHNvbWV3aGVyZSBkeW5hbWljXG4gICAgICAgIHRoaXMuZ2FtZS5ydWxlcyA9IHtcbiAgICAgICAgICAgIGFudGU6IDAsXG4gICAgICAgICAgICBibGluZHM6IHtcbiAgICAgICAgICAgICAgICBzbWFsbDogMjUsXG4gICAgICAgICAgICAgICAgYmlnOiA1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcklkLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudG9rZW4pO1xuXG4gICAgICAgIGlmICh0aGlzLmdhbWUuaW5pdGlhbERhdGEuZW11bGF0b3JFbmFibGVkKSB7XG4gICAgICAgICAgICB3aW5kb3cuZ2FtZSA9IHRoaXMuZ2FtZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibG9hZFwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAU3VtbWFyeSBDYWxjdWxhdGUgYWRkaXRpb25hbCB2YWx1ZXMgdG8gc3RvcmUgb24gZ2FtZS5pbml0aWFsRGF0YVxuICAgICAqXG4gICAgICogVG8gc2F2ZSBvbiBzZXJ2ZXItc2lkZSBwcm9jZXNzaW5nIGFuZCBkYXRhLXRyYW5zZmVyIGxvYWQsIHRoaXNcbiAgICAgKiBtZXRob2QgaXMgYSBwbGFjZSB0byBnZW5lcmF0ZSBhZGRpdGlvbmFsIGRhdGEgbmVlZGVkIGJ5IHRoZSBnYW1lXG4gICAgICogd2hpY2ggbWF5IGJlIGRlcml2ZWQgZnJvbSB0aGUgZGF0YSBzZW50IGZyb20gdGhlIGJhY2sgZW5kLlxuICAgICAqL1xuICAgIGF1Z21lbnRJbml0aWFsRGF0YShpbml0aWFsRGF0YSkge1xuICAgICAgICBpbml0aWFsRGF0YS5vY2N1cGllZFNlYXRzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5pdGlhbERhdGEucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaW5pdGlhbERhdGEub2NjdXBpZWRTZWF0cy5wdXNoKGluaXRpYWxEYXRhLnBsYXllcnNbaV0uc2VhdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5pdGlhbERhdGE7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb290OyIsImNsYXNzIExvYWQgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIHByZWxvYWQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwiYmFja2dyb3VuZFwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2JhY2tncm91bmQucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcInJlZENpcmNsZVwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3JlZGNpcmNsZS5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJjYXJkc1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NhcmRzLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NhcmRzLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJwYW5lbFwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3BhbmVsLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL3BhbmVsLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJkZWFsZXJCdXR0b25cIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9idXR0b24ucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYnV0dG9uLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJidXlJblwiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2J1eWluLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2J1eWluLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJjaGlwc1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NoaXBzLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2hkL2NoaXBzLmpzb25cIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmF0bGFzSlNPTkhhc2goXCJuYW1lcGxhdGVcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9uYW1lcGxhdGUucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvbmFtZXBsYXRlLmpzb25cIik7XG5cbiAgICAgICAgdGhpcy5nYW1lLnRleHR1cmVzID0gdGhpcy5jcmVhdGVDdXN0b21UZXh0dXJlcygpO1xuXG4gICAgICAgIHRoaXMubG9hZFBsdWdpbnMoKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydChcIm1haW5cIik7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3VzdG9tVGV4dHVyZXMoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IHt9O1xuXG4gICAgICAgIGxldCBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMTAwLCAxMDAsIDEwMCwgMTAwKTtcbiAgICAgICAgdGV4dHVyZXNbXCJ3aGl0ZVNxdWFyZVwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmxpbmVTdHlsZSg0LCAweDAwMDAwMCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIDMwMCwgMTAwKTtcbiAgICAgICAgdGV4dHVyZXNbXCJ3aGl0ZVJlY3RcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHgwMDAwMDAsIDAuNSk7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIHRoaXMuZ2FtZS53aWR0aCwgdGhpcy5nYW1lLmhlaWdodCk7XG4gICAgICAgIHRleHR1cmVzW1wibW9kYWxCYWNrZ3JvdW5kXCJdID0gZ3JhcGhpY3MuZ2VuZXJhdGVUZXh0dXJlKCk7XG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuXG4gICAgICAgIGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHgwMDAwMDAsIDAuNSk7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIHRoaXMuZ2FtZS5jb25maWcucG9wdXAud2lkdGgsIHRoaXMuZ2FtZS5jb25maWcucG9wdXAuaGVpZ2h0KTtcbiAgICAgICAgdGV4dHVyZXNbXCJ0ZXh0VW5kZXJsYXlcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0dXJlcztcbiAgICB9XG5cbiAgICBsb2FkUGx1Z2lucygpIHtcbiAgICAgICAgdGhpcy5nYW1lLmFkZC5wbHVnaW4oUGhhc2VySW5wdXQuUGx1Z2luKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvYWQ7XG4iLCJpbXBvcnQge0FjdGlvbiwgQWN0aW9uVGV4dH0gZnJvbSBcIi4uL2NsYXNzZXMvQWN0aW9uXCI7XG5pbXBvcnQgQm9hcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9Cb2FyZE1hbmFnZXJcIjtcbmltcG9ydCBCdXlJbk1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0J1eUluTWFuYWdlclwiO1xuaW1wb3J0IERlYWxlckJ1dHRvbiBmcm9tIFwiLi4vY2xhc3Nlcy9EZWFsZXJCdXR0b25cIjtcbmltcG9ydCBFdmVudFJlZ2lzdGVyIGZyb20gXCIuLi9tYW5hZ2Vycy9FdmVudFJlZ2lzdGVyXCI7XG5pbXBvcnQgUGFuZWwgZnJvbSBcIi4uL2NsYXNzZXMvUGFuZWxcIjtcbmltcG9ydCBQbGF5ZXJNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9QbGF5ZXJNYW5hZ2VyXCI7XG5pbXBvcnQgUG90IGZyb20gXCIuLi9jbGFzc2VzL1BvdFwiO1xuaW1wb3J0IFBva2VyIGZyb20gXCIuLi9Qb2tlclwiO1xuaW1wb3J0IFNTRSBmcm9tIFwiLi4vU1NFXCI7XG5pbXBvcnQgVHdlZW5RdWV1ZSBmcm9tIFwiLi4vY2xhc3Nlcy9Ud2VlblF1ZXVlXCI7XG5cbmNsYXNzIE1haW4gZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMudGFibGVfc3NlID0gbmV3IFNTRSh0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZVNTRVVybCk7XG4gICAgICAgIHRoaXMudXNlcl9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnVzZXJTU0VVcmwpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5sb2FkXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmRpc2Nvbm5lY3RCZWFjb24oKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCBcImJhY2tncm91bmRcIik7XG4gICAgICAgIHRoaXMubmV3SGFuZEJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDEwMCwgXCJuZXdcXG5oYW5kXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5uZXdIYW5kKTtcbiAgICAgICAgdGhpcy5kZWFsQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMjIwLCBcImRlYWxcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmRlYWwpO1xuICAgICAgICB0aGlzLmxlYXZlQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgMzQwLCBcImxlYXZlXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5sZWF2ZVRhYmxlKTtcbiAgICAgICAgdGhpcy5iYkJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDQ2MCwgXCJCQlwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuYmIpO1xuICAgICAgICB0aGlzLnNiQnRuID0gdGhpcy5tYWtlQnRuKDEwMCwgNTgwLCBcIlNCXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5zYik7XG5cbiAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMgPSBuZXcgUGxheWVyTWFuYWdlcih0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS51c2VySWQsIHRoaXMuZ2FtZS5jb25maWcuc2VhdHMsIHRoaXMuZ2FtZS5jb25maWcuY2hpcHMpO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVycy5pbml0aWFsaXplKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5wbGF5ZXJzLCB0aGlzLmdhbWUuY29uZmlnLnNlYXRzKTtcblxuICAgICAgICB0aGlzLmdhbWUuZGVhbGVyQnV0dG9uID0gbmV3IERlYWxlckJ1dHRvbih0aGlzLmdhbWUpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZCA9IG5ldyBCb2FyZE1hbmFnZXIodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmNlbnRlclkgPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWSArIDgwO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wb3QgPSBuZXcgUG90KHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wb3QuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5jaGlwcy5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYOyAgICAgLy8gVE9ETyAtIFBvc2l0aW9ucyBpbiBjb25maWdcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5jaGlwcy5kaXNwbGF5R3JvdXAuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZIC0gMTQwO1xuXG4gICAgICAgIC8vIFRPRE8gLSBUaGVzZSBzaG91bGQgZ28gc29tZXdoZXJlIGVsc2UuIE1heWJlIGluIFBvdD9cbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgdGhpcy5nYW1lLnJvdW5kUmFpc2UgPSAwO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbCA9IG5ldyBQYW5lbCh0aGlzLmdhbWUsIFwicGFuZWxcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueCA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLng7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5kaXNwbGF5R3JvdXAueSA9IHRoaXMuZ2FtZS5jb25maWcucGFuZWwucG9zLnk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5hbHdheXNWaXNpYmxlID0gdGhpcy5nYW1lLmluaXRpYWxEYXRhLmVtdWxhdG9yRW5hYmxlZDtcblxuICAgICAgICB0aGlzLmdhbWUuYnV5SW4gPSBuZXcgQnV5SW5NYW5hZ2VyKHRoaXMuZ2FtZSwgXCJidXlJblwiKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLmluaXRpYWxpemUodGhpcy5nYW1lLmNvbmZpZy5zZWF0cywgdGhpcy5nYW1lLnBsYXllcnMuZ2V0T2NjdXBpZWRTZWF0cygpLCB0aGlzLmdhbWUuY29uZmlnLmJ1eUluTW9kYWwpO1xuICAgICAgICB0aGlzLmdhbWUuYnV5SW4uc2V0QnV0dG9uc1Zpc2libGUodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllciA9PT0gbnVsbCk7XG5cbiAgICAgICAgLy8gVE9ETyAtIFRoZXNlIGFyZSBub3QgY3VycmVudGx5IHVzZWQuIFNjcmFwP1xuICAgICAgICB0aGlzLmdhbWUucXVldWUgPSBuZXcgVHdlZW5RdWV1ZSh0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmdhbWUucmVnaXN0ZXIgPSBuZXcgRXZlbnRSZWdpc3Rlcih0aGlzLmdhbWUpO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJMaXN0ZW5lcnMoKTtcblxuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld0hhbmRcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdIYW5kOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuYW5pbWF0ZUZvbGQoKS5hZGQocGxheWVyLmNhcmRzLnJlc2V0LCBwbGF5ZXIuY2FyZHMpO1xuICAgICAgICAgICAgICAgIHBsYXllci5jaGlwcy5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmFuaW1hdGVIaWRlKCkuYWRkKHRoaXMuZ2FtZS5ib2FyZC5jYXJkcy5yZXNldCwgdGhpcy5nYW1lLmJvYXJkLmNhcmRzKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5kZWFsZXJQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEuZGVhbGVyKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPSB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNEZWFsZXI6IHBsYXllci5pZCA9PT0gZGF0YS5kZWFsZXIsXG4gICAgICAgICAgICAgICAgICAgIGlzTmV4dDogcGxheWVyLmlkID09PSBkYXRhLm5leHQsXG4gICAgICAgICAgICAgICAgICAgIHJvdW5kQmV0OiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0QmV0cyhQb2tlci5nZW5lcmF0ZVJhaXNlcyh0aGlzLmdhbWUucnVsZXMuYmxpbmRzLnNtYWxsLCB0aGlzLmdhbWUucnVsZXMuYmxpbmRzLmJpZywgdGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5iYWxhbmNlKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0U2Vjb25kYXJ5QmV0KDApO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFZpc2libGUodGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9PT0gdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllcik7XG4gICAgICAgICAgICB0aGlzLmdhbWUuZGVhbGVyQnV0dG9uLm1vdmVUb1NlYXQodGhpcy5nYW1lLnBsYXllcnMuZGVhbGVyUGxheWVyLnNlYXQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJkZWFsXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVhbDogXCIsIGRhdGEpO1xuXG4gICAgICAgICAgICBsZXQgZGVsYXkgPSAwO1xuICAgICAgICAgICAgbGV0IHNlYXRzID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0T2NjdXBpZWRTZWF0cygpO1xuICAgICAgICAgICAgbGV0IHNlYXRJbmRleCA9IHNlYXRzLmluZGV4T2YodGhpcy5nYW1lLnBsYXllcnMuZGVhbGVyUGxheWVyLnNlYXQpO1xuICAgICAgICAgICAgc2VhdEluZGV4ID0gKHNlYXRJbmRleCArIDEpICUgc2VhdHMubGVuZ3RoOyAgLy8gU3RhcnQgd2l0aCBwbGF5ZXIgdG8gbGVmdCBvZiBkZWFsZXJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VhdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUudGltZS5ldmVudHMuYWRkKGRlbGF5LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5U2VhdChzZWF0c1tzZWF0SW5kZXhdKS5hbmltYXRlRGVhbCgpO1xuICAgICAgICAgICAgICAgICAgICBzZWF0SW5kZXggPSAoc2VhdEluZGV4ICsgMSkgJSBzZWF0cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgZGVsYXkgKz0gMjAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLm5leHQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldChQb2tlci5nZXRNaW5CZXQodGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5lbXVsYXRvckVuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiZW11bGF0ZURlYWxcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImVtdWxhdGVEZWFsOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwbGF5ZXJEYXRhID0gZGF0YVtpXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gVU5DT01NRU5UIFRPIFJFSU5TVEFURSBHT0QgTU9ERVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKHBsYXllckRhdGEucGxheWVySWQpLmNhcmRzLnNldENhcmROYW1lcyhwbGF5ZXJEYXRhLmhvbGRpbmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImFjdGlvblwiLCBldmVudCA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImFjdGlvbjogXCIsIGRhdGEpO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS5hY3Rpb25UeXBlID09PSBBY3Rpb24uRk9MRCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5wbGF5ZXJJZCkuYW5pbWF0ZUZvbGQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5wbGF5ZXJJZCkudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBiYWxhbmNlOiBkYXRhLnBsYXllckJhbGFuY2UsXG4gICAgICAgICAgICAgICAgaXNOZXh0OiBmYWxzZSxcbiAgICAgICAgICAgICAgICByb3VuZEJldDogZGF0YS5wbGF5ZXJSb3VuZEJldFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEucGxheWVySWQpLm5hbWVwbGF0ZS5mbGFzaCh0aGlzLnBhcnNlQWN0aW9uVGV4dChkYXRhKSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKGRhdGEubmV4dCkudXBkYXRlKHtpc05leHQ6IHRydWV9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IGRhdGEucm91bmRCZXQ7XG4gICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IGRhdGEucm91bmRSYWlzZTtcblxuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEJldHMoUG9rZXIuZ2VuZXJhdGVSYWlzZXModGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5zbWFsbCwgdGhpcy5nYW1lLnJ1bGVzLmJsaW5kcy5iaWcsIHRoaXMuZ2FtZS5yb3VuZEJldCwgdGhpcy5nYW1lLnBsYXllcnMubmV4dFBsYXllci5yb3VuZEJldCwgdGhpcy5nYW1lLnJvdW5kUmFpc2UsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIuYmFsYW5jZSkpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldChQb2tlci5nZXRNaW5CZXQodGhpcy5nYW1lLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLnJvdW5kQmV0LCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIpO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS5uZXdSb3VuZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5hbmltYXRlUmV2ZWFsKGRhdGEuYm9hcmQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGF0YS5oYW5kQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucG90LmdhdGhlckNoaXBzKHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMpLmFkZCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS50aW1lLmV2ZW50cy5hZGQoMTAwMCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2hvd2Rvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEuc2hvd2Rvd24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGxheWVyRGF0YSA9IGRhdGEuc2hvd2Rvd25baV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBsYXllciA9IHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQocGxheWVyRGF0YS5wbGF5ZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5jYXJkcy5zZXRDYXJkTmFtZXMocGxheWVyRGF0YS5ob2xkaW5ncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllci5jYXJkcy5zZXRDYXJkc0ZhY2VVcCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlbGF5IG9uZSBzZWNvbmQgZm9yIGVhY2ggcGxheWVyIGdvaW5nIHRvIHNob3dkb3duXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxheSA9IGRhdGEuc2hvd2Rvd24gPyAxMDAwICogZGF0YS5zaG93ZG93bi5sZW5ndGggOiAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnRpbWUuZXZlbnRzLmFkZChkZWxheSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS53aW5uZXJzWzBdLmlkKS5jaGlwcy50YWtlQ2hpcHModGhpcy5nYW1lLnBvdC5jaGlwcy5jaGlwcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEucm91bmRDb21wbGV0ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wb3QuZ2F0aGVyQ2hpcHModGhpcy5nYW1lLnBsYXllcnMucGxheWVycyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5uZXdSb3VuZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucm91bmRSYWlzZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnBsYXllcnMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXS51cGRhdGUoe3JvdW5kQmV0OiAwfSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRCZXRzKFBva2VyLmdlbmVyYXRlUmFpc2VzKHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuc21hbGwsIHRoaXMuZ2FtZS5ydWxlcy5ibGluZHMuYmlnLCB0aGlzLmdhbWUucm91bmRCZXQsIHRoaXMuZ2FtZS5wbGF5ZXJzLm5leHRQbGF5ZXIucm91bmRCZXQsIHRoaXMuZ2FtZS5yb3VuZFJhaXNlLCB0aGlzLmdhbWUucGxheWVycy5uZXh0UGxheWVyLmJhbGFuY2UpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldFNlY29uZGFyeUJldCgwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1BsYXllclwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3UGxheWVyOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5uZXdQbGF5ZXIoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4ubmV3UGxheWVyKGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnNldEJ1dHRvbnNWaXNpYmxlKHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIgPT09IG51bGwpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJwbGF5ZXJMZWZ0XCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwbGF5ZXJMZWZ0OiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJMZWZ0KGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJ1eUluLnBsYXllckxlZnQoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYnV5SW4uc2V0QnV0dG9uc1Zpc2libGUodGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllciA9PT0gbnVsbCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlLmFkZExpc3RlbmVyKFwiZGVhbFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZGVhbDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMudXNlclBsYXllci5jYXJkcy5zZXRDYXJkTmFtZXMoZGF0YS5ob2xkaW5ncyk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyLmNhcmRzLnNldENhcmRzRmFjZVVwKHRydWUpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlckxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnByaW1hcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZWNvbmRhcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC50ZXJ0aWFyeUNsaWNrZWQuYWRkKHRoaXMuaGFuZGxlQWN0aW9uLCB0aGlzKTtcbiAgICAgICAgdGhpcy5nYW1lLmJ1eUluLmJ1eUluUmVxdWVzdGVkLmFkZCh0aGlzLmdhbWUuY29udHJvbGxlci5qb2luLCB0aGlzLmdhbWUuY29udHJvbGxlcik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSb3V0ZSBhY3Rpb25zIHRvIGNvbnRyb2xsZXIgcmVxdWVzdHNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWN0aW9uIC0gVGhlIGFjdGlvbiB0byBiZSByZXF1ZXN0ZWQsIGRlZmluZWQgaW4gQWN0aW9uLmpzXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJldCAtIFRoZSBiZXQgKGlmIGFueSkgdG8gYmUgc2VudCB0byB0aGUgY29udHJvbGxlclxuICAgICAqL1xuICAgIGhhbmRsZUFjdGlvbihhY3Rpb24sIGJldCkge1xuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uRk9MRDpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5mb2xkKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5DSEVDSzpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5jaGVjaygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uQkVUOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmJldChiZXQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJJbnZhbGlkIEFjdGlvbiBUeXBlOiBcIiArIGFjdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBUcmFuc2Zvcm0gYWN0aW9uIGRhdGEgaW50byBtb3JlIGRlc2NyaXB0aXZlIGJldCBzdHJpbmdcbiAgICAgKlxuICAgICAqIEFsbCBiZXRzIGFyZSBiZXRzLCBidXQgc29tZSByZXF1aXJlIG1vcmUgZGVzY3JpcHRpb24gdG8gZm9sbG93IHBva2VyXG4gICAgICogY29udmVudGlvbi4gU3BlY2lmaWNhbGx5LCBhIGJldCB3aGljaCBqdXN0IGVxdWFscyBhbiBleGlzdGluZyBiZXQgaXMgYVxuICAgICAqIGNhbGwsIGFuZCBvbmUgd2hpY2ggaW5jcmVhc2VzIGFuIGV4aXN0aW5nIGJldCBpcyBhIHJhaXNlLlxuICAgICAqXG4gICAgICogTk9URTogVGhpcyBmdW5jdGlvbiBtdXN0IGJlIGNhbGxlZCBCRUZPUkUgdGhlIHN0YXRlJ3MgYHJvdW5kQmV0YCBhbmRcbiAgICAgKiBgcm91bmRSYWlzZWAgdmFyaWFibGVzIGFyZSB1cGRhdGVkLCBhcyB0aGlzIGZ1bmN0aW9uIG11c3QgY29tcGFyZVxuICAgICAqIG5ldyBiZXQgZGF0YSBhZ2FpbnN0IHRoZSBwcmV2aW91cyBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhY3Rpb25EYXRhXG4gICAgICogQHJldHVybnMge3N0cmluZ30gLSBUaGUgdGV4dCB0byBiZSBmbGFzaGVkXG4gICAgICovXG4gICAgcGFyc2VBY3Rpb25UZXh0KGFjdGlvbkRhdGEpIHtcbiAgICAgICAgbGV0IGFjdGlvblRleHQgPSBBY3Rpb25UZXh0W2FjdGlvbkRhdGEuYWN0aW9uVHlwZV07XG4gICAgICAgIGlmIChhY3Rpb25EYXRhLmFjdGlvblR5cGUgPT09IEFjdGlvbi5CRVQpIHtcbiAgICAgICAgICAgIGlmIChhY3Rpb25EYXRhLnBsYXllclJvdW5kQmV0ID09PSB0aGlzLmdhbWUucm91bmRCZXQpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25UZXh0ID0gXCJDQUxMXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbkRhdGEucGxheWVyUm91bmRCZXQgPiB0aGlzLmdhbWUucm91bmRCZXQgJiYgdGhpcy5nYW1lLnJvdW5kQmV0ID4gMCkge1xuICAgICAgICAgICAgICAgIGFjdGlvblRleHQgPSBcIlJBSVNFXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhY3Rpb25EYXRhLnBsYXllckJhbGFuY2UgPT09IDApIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25UZXh0ID0gXCJBTEwgSU5cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWN0aW9uVGV4dDtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5idXlJbi51cGRhdGUoKTtcbiAgICB9XG5cbiAgICBtYWtlQnRuKHgsIHksIHRleHQsIHRleHR1cmUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBidG4gPSB0aGlzLmdhbWUuYWRkLmJ1dHRvbih4LCB5LCB0ZXh0dXJlLCBjYWxsYmFjaywgdGhpcyk7XG4gICAgICAgIGJ0bi5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICBsZXQgYnRuVGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAwLCB0ZXh0KTtcbiAgICAgICAgYnRuVGV4dC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgYnRuLmFkZENoaWxkKGJ0blRleHQpO1xuICAgICAgICBidG4udGV4dCA9IGJ0blRleHQ7XG5cbiAgICAgICAgcmV0dXJuIGJ0bjtcbiAgICB9XG5cbiAgICBkZWFsKCkge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy90YWJsZXMvJyArIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZU5hbWUgKyAnL2RlYWwvJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0YWJsZU5hbWU6IGluaXRpYWxEYXRhLnRhYmxlTmFtZSxcbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIG5ld0hhbmQoKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCAnL3RhYmxlcy8nICsgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlTmFtZSArICcvbmV3LWhhbmQvJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICB0YWJsZU5hbWU6IGluaXRpYWxEYXRhLnRhYmxlTmFtZSxcbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBsZWF2ZVRhYmxlKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5sZWF2ZSgpO1xuICAgIH1cblxuICAgIGJiKCkge1xuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5iYigpO1xuICAgIH07XG5cbiAgICBzYigpIHtcbiAgICAgICAgdGhpcy5nYW1lLmNvbnRyb2xsZXIuc2IoKTtcbiAgICB9O1xuXG4gICAgZ2VuZXJhdGVCZXRzKHBsYXllclJvdW5kQmV0LCBwbGF5ZXJCYWxhbmNlKSB7XG4gICAgICAgIHJldHVybiBQb2tlci5nZW5lcmF0ZUJldHMoMjUsIDUwLCB0aGlzLmdhbWUucm91bmRCZXQsIHBsYXllclJvdW5kQmV0LCB0aGlzLmdhbWUucm91bmRSYWlzZSwgcGxheWVyQmFsYW5jZSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYWluO1xuIl19
