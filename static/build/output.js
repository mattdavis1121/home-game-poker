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

},{"./states/Boot":16,"./states/Load":17,"./states/Main":18}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
        _this.labelPadding = 0;
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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
        this.betAmt = 0;
        this.minDenom = 1;
        this.primaryClicked = new Phaser.Signal();
        this.primaryAction = _Action2.default.BET;
        this.secondaryClicked = new Phaser.Signal();
        this.secondaryAction = _Action2.default.CHECK;
        this.slider = new _Slider2.default(this.game, "panel");
        this.display = {};
        this.displayGroup = this.game.add.group();
    }

    _createClass(Panel, [{
        key: "initialize",
        value: function initialize() {
            var _this = this;

            this.display.primary = this.makeButton(0, 0, "lg", function () {
                return _this.primaryClicked.dispatch(_this.primaryAction);
            });
            this.display.secondary = this.makeButton(270, 0, "med", function () {
                return _this.secondaryClicked.dispatch(_this.secondaryAction);
            });

            this.slider.initializeDisplay();
            this.slider.indexChanged.add(function (index) {
                return _this.setBetAmt(_this.minDenom * index);
            }, this);
            this.slider.sliderWheel.add(this.singleStepBet, this);
            this.display.slider = this.slider.bar;
            this.display.slider.y = 70;

            this.displayGroup.add(this.display.primary);
            this.displayGroup.add(this.display.secondary);
            this.displayGroup.add(this.display.slider);
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
            var p = "BET " + _Util2.default.parseCurrency(this.betAmt);
            var s = this.secondaryAction === _Action2.default.CHECK ? "CHECK" : "FOLD";
            this.display.primary.setText(p);
            this.display.secondary.setText(s);
        }
    }, {
        key: "setBetAmt",
        value: function setBetAmt(bet) {
            this.betAmt = bet;
            this.updateDisplay();
        }
    }, {
        key: "setMinDenom",
        value: function setMinDenom(denom) {
            this.minDenom = denom;
            this.updateDisplay();
        }
    }, {
        key: "setPrimaryAction",
        value: function setPrimaryAction(action) {
            this.primaryAction = action;
            this.updateDisplay();
        }
    }, {
        key: "setSecondaryAction",
        value: function setSecondaryAction(action) {
            this.secondaryAction = action;
            this.updateDisplay();
        }
    }, {
        key: "setEnabled",
        value: function setEnabled(enabled) {
            this.display.primary.setEnabled(enabled);
            this.display.secondary.setEnabled(enabled);
            this.slider.setEnabled(enabled);
        }

        /**
         * @summary Increment or decrement this.betAmt
         * @param {Phaser.Mouse.wheelDelta} modifier - +1 or -1
         */

    }, {
        key: "singleStepBet",
        value: function singleStepBet(modifier) {
            var index = this.slider.index + modifier;
            if (index >= 0 && index <= this.slider.length) {
                this.slider.setIndex(index, true);
            }
        }
    }]);

    return Panel;
}();

exports.default = Panel;

},{"../Util":3,"./Action":4,"./Button":5,"./Slider":11}],9:[function(require,module,exports){
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

},{"../Util":3,"../managers/CardManager":13}],10:[function(require,module,exports){
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

},{"../Util":3}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * TODO - Combine end assets into bar asset
 *
 * This looks pretty good, but the bar is hard to click. Need to make the
 * entire sprite taller. I could do something like add an invisible sprite
 * as a child of the bar which is what's in charge of accepting input, but
 * I think just changing the asset itself is the better choice.
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
        this.prevX = 0; // Needed to know when marker snaps to new pos
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
            this.bar.events.onInputDown.add(this.barClicked, this);
            this.bar.events.onInputOver.add(function () {
                return _this.enableSliderWheel(true);
            });
            this.bar.events.onInputOut.add(function () {
                return _this.enableSliderWheel(false);
            });
            this.display.bar = this.bar;

            this.display.leftEnd = this.game.add.image(0, this.bar.height / 2, this.key, "slider_end");
            this.display.leftEnd.anchor.setTo(0.5);
            this.bar.addChild(this.display.leftEnd);

            this.display.rightEnd = this.game.add.image(400, this.bar.height / 2, this.key, "slider_end");
            this.display.rightEnd.anchor.setTo(0.5);
            this.bar.addChild(this.display.rightEnd);

            this.marker = this.game.add.sprite(0, 22, this.key, "slider_marker");
            this.marker.anchor.setTo(0.5, 0);
            this.marker.inputEnabled = true;
            this.marker.input.enableDrag();
            this.marker.input.allowVerticalDrag = false;
            this.marker.input.boundsRect = new Phaser.Rectangle(-this.marker.width / 2, 22, this.bar.width + this.marker.width, this.marker.height);
            this.marker.input.enableSnap(this.bar.width / this.length, 1);
            this.marker.events.onDragUpdate.add(this.markerDragged, this);
            this.display.marker = this.marker;
            this.bar.addChild(this.marker);
        }
    }, {
        key: "setIndex",
        value: function setIndex(index) {
            var updatePos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.index = index;
            this.indexChanged.dispatch(index);

            if (updatePos) {
                this.marker.x = this.bar.width / this.length * this.index;
            }
        }
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
            this.marker.input.enableSnap(this.bar.width / length, 1);
        }
    }, {
        key: "setEnabled",
        value: function setEnabled(enabled) {
            this.bar.inputEnabled = enabled;
            this.marker.inputEnabled = enabled;

            var tint = enabled ? 0xFFFFFF : 0x808080;
            this.display.bar.tint = tint;
            this.display.leftEnd.tint = tint;
            this.display.rightEnd.tint = tint;
            this.display.marker.tint = tint;
        }

        /**
         * @summary Callback for input directly on the slider bar
         *
         * Allows users to click on the bar and have the marker snap to the
         * clicked position by exploiting some of Phaser's internals.
         *
         * @param {Phaser.Sprite} bar - The clicked sprite, should always be this.bar
         * @param {Phaser.Pointer} pointer - The pointer responsible for the click
         */

    }, {
        key: "barClicked",
        value: function barClicked(bar, pointer) {
            // If the slider hasn't been dragged before being clicked, we need
            // to spoof some cache data. Set the start point of the drag to the
            // leftmost point of the bar.
            if (!this.marker.input._dragPoint.x) {
                var ptr = new Phaser.Pointer(this.game, pointer.id, pointer.pointerMode);
                ptr.x = this.marker.world.x;
                ptr.y = this.marker.world.y;
                this.marker.input.startDrag(ptr);
            }
            this.marker.input.updateDrag(pointer, true);
        }

        /**
         * @summary Callback for marker. Dispatch signal on snap.
         *
         * The onDragUpdate callback is called very frequently by Phaser, but
         * not all of that information is helpful. This filters out most of those
         * calls so all we see are the updates for snaps to new locations on
         * the bar.
         *
         * NOTE: The params passed to this function are defined by Phaser
         * internals. All that's being used here is the snap param, which is how
         * we know if the marker has snapped to a new location.
         *
         * @param {Phaser.Sprite} marker - The dragged marker, unused
         * @param {Phaser.Pointer} pointer - The pointer initiating the drag, unused
         * @param {number} x - The new X coordinate of the sprite, unused
         * @param {number} y - The new Y coordinate of the sprite, unused
         * @param {Phaser.Point} snap - The Point to which the marker snapped
         */

    }, {
        key: "markerDragged",
        value: function markerDragged(marker, pointer, x, y, snap) {
            if (snap.x !== this.prevX) {
                this.prevX = snap.x;
                this.setIndex(this.prevX / this.marker.input.snapX);
            }
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

},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
            console.log(names);
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

},{"../classes/Card":6}],14:[function(require,module,exports){
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

},{"../classes/Player":9}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

            // TODO - This should come from somehwere dynamic
            this.game.rules = {
                minDenom: 25,
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

},{"../classes/Controller":7,"../config":12}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

            // TODO - This should go somewhere else. Maybe in Pot?
            this.game.roundBet = 0;

            this.game.panel = new _Panel2.default(this.game, "panel");
            this.game.panel.initialize();
            this.game.panel.setMinDenom(this.game.rules.minDenom);
            this.game.panel.slider.setLength(this.game.players.userPlayer.balance / this.game.rules.minDenom);
            this.game.panel.displayGroup.x = this.game.config.panel.pos.x;
            this.game.panel.displayGroup.y = this.game.config.panel.pos.y;
            this.registerListeners();

            this.table_sse.addListener("newHand", function (event) {
                var data = JSON.parse(event.data);
                console.log("newHand: ", data);
                _this3.game.board.reset();
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
                _this3.game.panel.setEnabled(userPlayerNext);
                _this3.game.pot.setAmount(0);
                _this3.game.roundBet = 0;
            });
            this.table_sse.addListener("newRound", function (event) {
                var data = JSON.parse(event.data);
                console.log("newRound: ", data);
                _this3.game.panel.setSecondaryAction(_Action2.default.CHECK);
                for (var i = 0; i < _this3.game.players.players.length; i++) {
                    _this3.game.players.players[i].update({ roundBet: 0 });
                }
                _this3.game.roundBet = 0;
            });
            this.table_sse.addListener("action", function (event) {
                var data = JSON.parse(event.data);
                console.log("action: ", data);
                _this3.game.board.setCardNames(data.board);
                _this3.game.players.getById(data.playerId).update({
                    balance: data.playerBalance,
                    isNext: false,
                    roundBet: data.roundBet
                });
                _this3.game.players.getById(data.next).update({ isNext: true });
                _this3.game.pot.setAmount(data.pot);
                _this3.game.roundBet = data.roundBet;

                var userPlayerNext = data.next === _this3.game.players.userPlayer.id;
                _this3.game.panel.setEnabled(userPlayerNext);
                if (data.actionType === _Action2.default.BET) {
                    _this3.game.panel.setSecondaryAction(_Action2.default.FOLD);
                }
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
        }

        /**
         * @summary Route actions to controller requests
         * @param {number} action - The action to be requested, defined in Action.js
         */

    }, {
        key: "handleAction",
        value: function handleAction(action) {
            switch (action) {
                case _Action2.default.FOLD:
                    this.game.controller.fold();
                    break;
                case _Action2.default.CHECK:
                    this.game.controller.check();
                    break;
                case _Action2.default.BET:
                    this.game.controller.bet(this.game.panel.betAmt);
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
    }]);

    return Main;
}(Phaser.State);

exports.default = Main;

},{"../SSE":2,"../classes/Action.js":4,"../classes/Panel":8,"../classes/Pot":10,"../managers/CardManager":13,"../managers/PlayerManager":14}]},{},[1,15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1NTRS5qcyIsInN0YXRpYy9zcmMvVXRpbC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9BY3Rpb24uanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQnV0dG9uLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL0NhcmQuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvQ29udHJvbGxlci5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9QYW5lbC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9QbGF5ZXIuanMiLCJzdGF0aWMvc3JjL2NsYXNzZXMvUG90LmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1NsaWRlci5qcyIsInN0YXRpYy9zcmMvY29uZmlnLmpzb24iLCJzdGF0aWMvc3JjL21hbmFnZXJzL0NhcmRNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9tYW5hZ2Vycy9QbGF5ZXJNYW5hZ2VyLmpzIiwic3RhdGljL3NyYy9wb2x5ZmlsbHMvc2VuZGJlYWNvbi5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL0Jvb3QuanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Mb2FkLmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTSxJOzs7QUFDRixvQkFBYztBQUFBOztBQUFBLGdIQUNKO0FBQ0YsbUJBQU8sSUFETDtBQUVGLG9CQUFRO0FBRk4sU0FESTs7QUFNVixjQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBZixFQUF1QixjQUF2QixFQUE2QixLQUE3QjtBQUNBLGNBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLGNBQXZCLEVBQTZCLEtBQTdCO0FBQ0EsY0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLE1BQWYsRUFBdUIsY0FBdkIsRUFB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S2MsT0FBTyxLOztrQkF3S1gsSSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBCb290IGZyb20gXCIuL3N0YXRlcy9Cb290XCI7XG5pbXBvcnQgTG9hZCBmcm9tIFwiLi9zdGF0ZXMvTG9hZFwiO1xuaW1wb3J0IE1haW4gZnJvbSBcIi4vc3RhdGVzL01haW5cIjtcblxuY2xhc3MgR2FtZSBleHRlbmRzIFBoYXNlci5HYW1lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgd2lkdGg6IDE5MjAsXG4gICAgICAgICAgICBoZWlnaHQ6IDEwODBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJib290XCIsIEJvb3QsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJsb2FkXCIsIExvYWQsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJtYWluXCIsIE1haW4sIGZhbHNlKTtcblxuICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KFwiYm9vdFwiKTtcbiAgICB9XG59XG5cbm5ldyBHYW1lKCk7IiwiY2xhc3MgU1NFIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB1cmwpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIHRoaXMuc291cmNlID0gbmV3IEV2ZW50U291cmNlKHRoaXMudXJsKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZSBhZGRzIGFsbCBsaXN0ZW5lcnMgdG8gdGhpcy5zb3VyY2VcbiAgICAgKlxuICAgICAqIEkgb3JpZ2luYWxseSB3cm90ZSB0aGlzIHRvIHN1cHBvcnQgY2xpZW50IHJlY29ubmVjdHMsIGJ1dCBJIGRvbid0IG5lZWRcbiAgICAgKiB0aGF0IGFueW1vcmUuIEtlZXBpbmcgdGhlIGxpc3RlbmVyIGNvZGUganVzdCBpbiBjYXNlLlxuICAgICAqL1xuICAgIHJlQWRkQWxsTGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5saXN0ZW5lcnM7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG4gICAgICAgICAgICB0aGlzLmFkZExpc3RlbmVyKGxpc3RlbmVyLnR5cGUsIGxpc3RlbmVyLmNhbGxiYWNrLCBsaXN0ZW5lci5jYWxsYmFja0NvbnRleHQsIC4uLmxpc3RlbmVyLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXIodHlwZSwgY2FsbGJhY2ssIGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncykge1xuICAgICAgICAvLyBTdG9yZSBsaXN0ZW5lcnMgZm9yIGV2ZW50dWFsIHJlY29ubmVjdFxuICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKHtcbiAgICAgICAgICAgIFwidHlwZVwiOiB0eXBlLFxuICAgICAgICAgICAgXCJjYWxsYmFja1wiOiBjYWxsYmFjayxcbiAgICAgICAgICAgIFwiY2FsbGJhY2tDb250ZXh0XCI6IGNhbGxiYWNrQ29udGV4dCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBhcmdzXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc291cmNlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncywgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNTRTsiLCJjbGFzcyBVdGlsIHtcbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSZXR1cm4gYSBmb3JtYXR0ZWQgY3VycmVuY3kgc3RyaW5nIGZyb20gYW4gaW50ZWdlclxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZUN1cnJlbmN5KGludCkge1xuICAgICAgICBsZXQgdmFsID0gaW50IC8gMTAwO1xuICAgICAgICByZXR1cm4gXCIkXCIgKyB2YWwudG9GaXhlZCgyKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFV0aWw7IiwiY29uc3QgQWN0aW9uID0ge1xuICAgIEJMSU5EOiAwLFxuICAgIEZPTEQ6IDEsXG4gICAgQ0hFQ0s6IDIsXG4gICAgQkVUOiAzXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBY3Rpb247IiwiLyoqXG4gKiBBIFBoYXNlci5CdXR0b24gd2l0aCBhIFBoYXNlci5UZXh0IGNlbnRlcmVkIG9uIHRoZSBidXR0b25cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIG1lcmVseSBhIHRoaW4gd3JhcHBlciBhcm91bmQgUGhhc2VyLkJ1dHRvbiB0byBhbGxvdyBmb3JcbiAqIGVhc3kgdXNlIG9mIGEgdGV4dCBsYWJlbCBvbiB0aGUgYnV0dG9uLiBUaGUgdGV4dCBpcyBhIGNoaWxkIG9mIHRoZSBidXR0b24sXG4gKiBzbyBpdCBtb3ZlcyB3aGVuIHRoZSBidXR0b24gbW92ZXMuIEl0J3MgY2VudGVyZWQgb24gdGhlIGJ1dHRvbiBhbmQgc2NhbGVzXG4gKiBhdXRvbWF0aWNhbGx5IHRvIGZpeCB3aXRoaW4gdGhlIGJ1dHRvbidzIGJvdW5kcy5cbiAqXG4gKiBJZiBub25lIG9mIHRoZSBsYWJlbCBmdW5jdGlvbmFsaXR5IGlzIHVzZWQsIHRoaXMgY2xhc3MgaXMgaWRlbnRpY2FsIHRvXG4gKiBQaGFzZXIuQnV0dG9uLlxuICovXG5jbGFzcyBCdXR0b24gZXh0ZW5kcyBQaGFzZXIuQnV0dG9uIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSkge1xuICAgICAgICBzdXBlcihnYW1lLCB4LCB5LCBrZXksIGNhbGxiYWNrLCBjYWxsYmFja2NvbnRleHQsIG92ZXJGcmFtZSwgb3V0RnJhbWUsIGRvd25GcmFtZSwgdXBGcmFtZSk7XG5cbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSAwO1xuICAgICAgICB0aGlzLmxhYmVsVGV4dCA9IFwiXCI7XG4gICAgICAgIHRoaXMubGFiZWxTdHlsZSA9IHt9O1xuICAgICAgICB0aGlzLmxhYmVsID0gbmV3IFBoYXNlci5UZXh0KHRoaXMuZ2FtZSwgMCwgMCwgdGhpcy5sYWJlbFRleHQpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMubGFiZWwpO1xuXG4gICAgICAgIC8vIE11c3QgYWRkIHRvIGdhbWUgd29ybGQgbWFudWFsbHkgaWYgbm90IHVzaW5nIGdhbWUuYWRkLmJ1dHRvblxuICAgICAgICB0aGlzLmdhbWUud29ybGQuYWRkKHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFNldCB0aGUgdGV4dCBkaXNwbGF5ZWQgb24gdGhlIGJ1dHRvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gZGlzcGxheVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSBkaXNwbGF5IHVwZGF0ZSBkZXNwaXRlIG9mIHRoaXMuZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRUZXh0KHRleHQsIGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5sYWJlbFRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHN0eWxlIGZvciB0aGUgYnV0dG9uIHRleHRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgLSBUaGUgdGV4dCBzdHlsZSB0byB1c2VcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvcmNlIC0gRm9yY2UgZGlzcGxheSB1cGRhdGUgZGVzcGl0ZSBvZiB0aGlzLmVuYWJsZWQ/XG4gICAgICovXG4gICAgc2V0VGV4dFN0eWxlKHN0eWxlLCBmb3JjZSA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMubGFiZWxTdHlsZSA9IHN0eWxlO1xuICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZXQgdGhlIHBhZGRpbmcgYmV0d2VlbiB0aGUgdGV4dCBhbmQgdGhlIGJ1dHRvbiBwZXJpbWV0ZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFkZGluZyAtIFRoZSBwYWRkaW5nIGluIHBpeGVsc1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yY2UgLSBGb3JjZSBkaXNwbGF5IHVwZGF0ZSBkZXNwaXRlIG9mIHRoaXMuZW5hYmxlZD9cbiAgICAgKi9cbiAgICBzZXRQYWRkaW5nKHBhZGRpbmcsIGZvcmNlID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5sYWJlbFBhZGRpbmcgPSBwYWRkaW5nO1xuICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKGZvcmNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSB0aGUgYnV0dG9uXG4gICAgICogT24gZGlzYWJsZSwgZGlzYWJsZXMgYWxsIGlucHV0IHRvIHRoZSBidXR0b24gYW5kIHJlbmRlcnMgaXQgZ3JheWVkXG4gICAgICogb3V0LiBBbGwgdXBkYXRlcyBhcmUgZGVsYXllZCB1bnRpbCByZS1lbmFibGUsIHVubGVzcyBmb3JjZWQuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gRW5hYmxlIG9yIGRpc2FibGUgYnV0dG9uP1xuICAgICAqL1xuICAgIHNldEVuYWJsZWQoZW5hYmxlZCkge1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSBlbmFibGVkO1xuICAgICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IGVuYWJsZWQ7XG4gICAgICAgIGxldCB0aW50ID0gZW5hYmxlZCA/IDB4RkZGRkZGIDogMHg4MDgwODA7XG4gICAgICAgIHRoaXMudGludCA9IHRpbnQ7XG4gICAgICAgIHRoaXMubGFiZWwudGludCA9IHRpbnQ7XG5cbiAgICAgICAgLy8gVXBkYXRlIG9uIHJlLWVuYWJsZVxuICAgICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVMYWJlbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgVXBkYXRlIGFsbCBidXR0b24gYXR0cmlidXRlcyB0byBjdXJyZW50IHByb3BlcnRpZXNcbiAgICAgKlxuICAgICAqIElmIHRoZSBidXR0b24gaXMgZGlzYWJsZWQsIHRoaXMgd2lsbCBoYXZlIG5vIGVmZmVjdC4gVGhlXG4gICAgICogZGV2ZWxvcGVyIG1heSBvcHRpb25hbGx5IGNob29zZSB0byBmb3JjZSB0aGUgdXBkYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtib29sZWFufSBmb3JjZSAtIEZvcmNlIHRoZSB1cGRhdGU/XG4gICAgICovXG4gICAgdXBkYXRlTGFiZWwoZm9yY2UgPSBmYWxzZSkge1xuICAgICAgICBpZiAodGhpcy5lbmFibGVkIHx8IGZvcmNlKSB7XG4gICAgICAgICAgICB0aGlzLmxhYmVsLnRleHQgPSB0aGlzLmxhYmVsVGV4dDtcbiAgICAgICAgICAgIHRoaXMubGFiZWwuc2V0U3R5bGUodGhpcy5sYWJlbFN0eWxlKTtcbiAgICAgICAgICAgIHRoaXMucmVQb3NMYWJlbCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2NhbGUgbGFiZWwgdGV4dCB0byBmaXQgb24gYnV0dG9uIGFuZCBjZW50ZXJcbiAgICAgKi9cbiAgICByZVBvc0xhYmVsKCkge1xuICAgICAgICB0aGlzLmxhYmVsLnNjYWxlLnNldFRvKDEpO1xuICAgICAgICBsZXQgdGV4dEFyZWEgPSB0aGlzLndpZHRoIC0gdGhpcy5sYWJlbFBhZGRpbmcgKiAyO1xuICAgICAgICBpZiAodGhpcy5sYWJlbC53aWR0aCA+IHRleHRBcmVhKSB7XG4gICAgICAgICAgICBsZXQgcmVkdWNlZFNjYWxlID0gdGV4dEFyZWEgLyB0aGlzLmxhYmVsLndpZHRoO1xuICAgICAgICAgICAgdGhpcy5sYWJlbC5zY2FsZS5zZXRUbyhyZWR1Y2VkU2NhbGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFiZWwuY2VudGVyWCA9IHRoaXMud2lkdGggLyAyO1xuICAgICAgICB0aGlzLmxhYmVsLmNlbnRlclkgPSB0aGlzLmhlaWdodCAvIDI7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEJ1dHRvbjsiLCJjbGFzcyBDYXJkIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBtYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7ICAgLy8gU3RyaW5nIElEIG9mIGNhcmQsIGUuZy4gJ0toJyBvciAnN3MnXG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKGRhdGEpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwiY2FyZHNcIik7XG4gICAgICAgIHRoaXMuc3ByaXRlLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLnNwcml0ZS5zY2FsZS5zZXRUbygxLjUpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lTmFtZSA9IHRoaXMubmFtZSA/IHRoaXMubmFtZSA6IFwiYmFja1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZDsiLCJjbGFzcyBDb250cm9sbGVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBwbGF5ZXJJZCwgdG9rZW4pIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5wbGF5ZXJJZCA9IHBsYXllcklkO1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2V0IHRoZSBhY2Nlc3MgdG9rZW4gdXNlZCB0byBhdXRoZW50aWNhdGUgb24gQVBJIGNhbGxzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIC0gVGhlIEZsYXNrLUpXVC1FeHRlbmRlZCBhY2Nlc3MgdG9rZW5cbiAgICAgKi9cbiAgICBzZXRUb2tlbih0b2tlbikge1xuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgU2VuZCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlclxuICAgICAqXG4gICAgICogT25seSBlcnJvcnMgYXJlIHJlcG9ydGVkLiBTdWNjZXNzIGlzIHNpbGVudC4gR2FtZSBjaGFuZ2VzIHJlc3VsdGluZ1xuICAgICAqIGZyb20gcmVxdWVzdHMgYXJlIGhhbmRsZWQgdmlhIFNlcnZlciBTZW50IEV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmRwb2ludCAtIFRoZSBlbmRwb2ludCBvbiB0aGUgc2VydmVyIHRvIHNlbmQgcmVxdWVzdCB0b1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gVGhlIHBheWxvYWQgdG8gc2VuZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWV0aG9kPVwiUE9TVF0gLSBUaGUgSFRUUCBtZXRob2QgdG8gdXNlXG4gICAgICovXG4gICAgc2VuZFJlcXVlc3QoZW5kcG9pbnQsIGRhdGEsIG1ldGhvZCA9IFwiUE9TVFwiKSB7XG4gICAgICAgIGxldCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4obWV0aG9kLCBlbmRwb2ludCk7XG4gICAgICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgJiYgeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3AgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgICAgIC8vIEludmFsaWQgcmVxdWVzdCBlcnJvclxuICAgICAgICAgICAgICAgIGlmIChyZXNwLnN1Y2Nlc3MgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihyZXNwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICYmIHhoci5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgIC8vIEZhaWxlZCByZXF1ZXN0IGVycm9yXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgJ0JlYXJlciAnICsgdGhpcy50b2tlbik7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGFuIGFjdGlvbiByZXF1ZXN0XG4gICAgICpcbiAgICAgKiBUaGlzIGlzIHRoZSBtb3N0IGhlYXZpbHktdXNlZCByZXF1ZXN0IHR5cGUgaW4gdGhlIGdhbWUuIEFsbCBpbi1nYW1lXG4gICAgICogYWN0aW9ucyAoYmV0LCBjaGVjaywgZm9sZCkgaGFwcGVuIGhlcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZGF0YSAtIFRoZSBwYXlsb2FkIHRvIHNlbmRcbiAgICAgKi9cbiAgICBhY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmJ1aWxkVXJsKFwiYWN0aW9uXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgY2hlY2soKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkNIRUNLXCIpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBiZXQoYW10KSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmJ1aWxkUGF5bG9hZChcIkJFVFwiLCBhbXQpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICBmb2xkKCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5idWlsZFBheWxvYWQoXCJGT0xEXCIpO1xuICAgICAgICB0aGlzLmFjdGlvbihkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBTZW5kIGEgYmVhY29uIHRvIHRoZSBzZXJ2ZXIgb24gZGlzY29ubmVjdFxuICAgICAqXG4gICAgICogVGhpcyBhbGxvd3MgZm9yIHNlcnZlciB0byBrbm93IHdoZW4gYSBjbGllbnQgZGlzY29ubmVjdHMgc29cbiAgICAgKiBpdCBjYW4gY2xlYW4gdXAgYXMgbmVjZXNzYXJ5LiBObyBndWFyYW50ZWUgdGhhdCB0aGlzIG1lc3NhZ2VcbiAgICAgKiB3aWxsIGdvIHRocm91Z2gsIHNvIG11c3QgaGF2ZSByZWR1bmRhbnQgbWVhc3VyZXMgaW4gcGxhY2UuXG4gICAgICovXG4gICAgZGlzY29ubmVjdEJlYWNvbigpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHt9O1xuICAgICAgICBjb25zdCB1cmwgPSBcIi9kaXNjb25uZWN0L1wiO1xuICAgICAgICBuYXZpZ2F0b3Iuc2VuZEJlYWNvbih1cmwsIGRhdGEpO1xuICAgIH1cblxuICAgIGpvaW4oKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XCJ1c2VySWRcIjogdGhpcy5nYW1lLmluaXRpYWxEYXRhLnVzZXJJZH07XG4gICAgICAgIGNvbnN0IHVybCA9IHRoaXMuYnVpbGRVcmwoXCJqb2luXCIpO1xuICAgICAgICB0aGlzLnNlbmRSZXF1ZXN0KHVybCwgZGF0YSk7XG4gICAgfVxuXG4gICAgYnVpbGRQYXlsb2FkKGFjdGlvblR5cGUsIGJldEFtdCA9IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwicGxheWVySWRcIjogdGhpcy5wbGF5ZXJJZCxcbiAgICAgICAgICAgIFwiYWN0aW9uVHlwZVwiOiBhY3Rpb25UeXBlLFxuICAgICAgICAgICAgXCJiZXRBbXRcIjogYmV0QW10XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBidWlsZFVybChlbmRwb2ludCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nYW1lLmluaXRpYWxEYXRhLnRhYmxlVXJsICsgZW5kcG9pbnQgKyBcIi9cIjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXI7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4vQnV0dG9uXCI7XG5pbXBvcnQgU2xpZGVyIGZyb20gXCIuL1NsaWRlclwiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9BY3Rpb25cIjtcblxuY2xhc3MgUGFuZWwge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5iZXRBbXQgPSAwO1xuICAgICAgICB0aGlzLm1pbkRlbm9tID0gMTtcbiAgICAgICAgdGhpcy5wcmltYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMucHJpbWFyeUFjdGlvbiA9IEFjdGlvbi5CRVQ7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5Q2xpY2tlZCA9IG5ldyBQaGFzZXIuU2lnbmFsKCk7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QWN0aW9uID0gQWN0aW9uLkNIRUNLO1xuICAgICAgICB0aGlzLnNsaWRlciA9IG5ldyBTbGlkZXIodGhpcy5nYW1lLCBcInBhbmVsXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7fTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkgPSB0aGlzLm1ha2VCdXR0b24oMCwgMCwgXCJsZ1wiLCAoKSA9PiB0aGlzLnByaW1hcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMucHJpbWFyeUFjdGlvbikpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuc2Vjb25kYXJ5ID0gdGhpcy5tYWtlQnV0dG9uKDI3MCwgMCwgXCJtZWRcIiwgKCkgPT4gdGhpcy5zZWNvbmRhcnlDbGlja2VkLmRpc3BhdGNoKHRoaXMuc2Vjb25kYXJ5QWN0aW9uKSk7XG5cbiAgICAgICAgdGhpcy5zbGlkZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcbiAgICAgICAgdGhpcy5zbGlkZXIuaW5kZXhDaGFuZ2VkLmFkZCgoaW5kZXgpID0+IHRoaXMuc2V0QmV0QW10KHRoaXMubWluRGVub20gKiBpbmRleCksIHRoaXMpO1xuICAgICAgICB0aGlzLnNsaWRlci5zbGlkZXJXaGVlbC5hZGQodGhpcy5zaW5nbGVTdGVwQmV0LCB0aGlzKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNsaWRlciA9IHRoaXMuc2xpZGVyLmJhcjtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNsaWRlci55ID0gNzA7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5wcmltYXJ5KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5zZWNvbmRhcnkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LnNsaWRlcik7XG4gICAgfVxuXG4gICAgbWFrZUJ1dHRvbih4LCB5LCBzaXplLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYnV0dG9uID0gbmV3IEJ1dHRvbih0aGlzLmdhbWUsIHgsIHksIHRoaXMua2V5KTtcbiAgICAgICAgYnV0dG9uLm9uSW5wdXRVcC5hZGQoY2FsbGJhY2spO1xuICAgICAgICBidXR0b24uc2V0RnJhbWVzKFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfb3ZlclwiLFxuICAgICAgICAgICAgXCJidG5fXCIgKyBzaXplICsgXCJfb3V0XCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl9kb3duXCIsXG4gICAgICAgICAgICBcImJ0bl9cIiArIHNpemUgKyBcIl91cFwiXG4gICAgICAgICk7XG4gICAgICAgIGJ1dHRvbi5zZXRUZXh0U3R5bGUodGhpcy5nYW1lLmNvbmZpZy5wYW5lbC50ZXh0U3R5bGUpO1xuICAgICAgICByZXR1cm4gYnV0dG9uO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIGxldCBwID0gXCJCRVQgXCIgKyBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5iZXRBbXQpO1xuICAgICAgICBsZXQgcyA9IHRoaXMuc2Vjb25kYXJ5QWN0aW9uID09PSBBY3Rpb24uQ0hFQ0sgPyBcIkNIRUNLXCIgOiBcIkZPTERcIjtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuc2V0VGV4dChwKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNlY29uZGFyeS5zZXRUZXh0KHMpO1xuICAgIH1cblxuICAgIHNldEJldEFtdChiZXQpIHtcbiAgICAgICAgdGhpcy5iZXRBbXQgPSBiZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHNldE1pbkRlbm9tKGRlbm9tKSB7XG4gICAgICAgIHRoaXMubWluRGVub20gPSBkZW5vbTtcbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgc2V0UHJpbWFyeUFjdGlvbihhY3Rpb24pIHtcbiAgICAgICAgdGhpcy5wcmltYXJ5QWN0aW9uID0gYWN0aW9uO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRTZWNvbmRhcnlBY3Rpb24oYWN0aW9uKSB7XG4gICAgICAgIHRoaXMuc2Vjb25kYXJ5QWN0aW9uID0gYWN0aW9uO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnByaW1hcnkuc2V0RW5hYmxlZChlbmFibGVkKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnNlY29uZGFyeS5zZXRFbmFibGVkKGVuYWJsZWQpO1xuICAgICAgICB0aGlzLnNsaWRlci5zZXRFbmFibGVkKGVuYWJsZWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEluY3JlbWVudCBvciBkZWNyZW1lbnQgdGhpcy5iZXRBbXRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Nb3VzZS53aGVlbERlbHRhfSBtb2RpZmllciAtICsxIG9yIC0xXG4gICAgICovXG4gICAgc2luZ2xlU3RlcEJldChtb2RpZmllcikge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnNsaWRlci5pbmRleCArIG1vZGlmaWVyO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8PSB0aGlzLnNsaWRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVyLnNldEluZGV4KGluZGV4LCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFuZWw7IiwiaW1wb3J0IFV0aWwgZnJvbSBcIi4uL1V0aWxcIjtcbmltcG9ydCBDYXJkTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvQ2FyZE1hbmFnZXJcIjtcblxuY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBtYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG5cbiAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlcklkID0gbnVsbDtcbiAgICAgICAgdGhpcy5iYWxhbmNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5zaXR0aW5nT3V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWF0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5uYW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5yb3VuZEJldCA9IDA7ICAvLyBTdW0gYmV0cyBieSBwbGF5ZXIgaW4gY3VycmVudCBiZXR0aW5nIHJvdW5kXG5cbiAgICAgICAgdGhpcy5pc0RlYWxlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzTmV4dCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzVXNlciA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcblxuICAgICAgICB0aGlzLmNhcmRzID0gbmV3IENhcmRNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkYXRhLmlkO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IGRhdGEudXNlcklkO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuc2l0dGluZ091dCA9IGRhdGEuc2l0dGluZ091dDtcbiAgICAgICAgdGhpcy5zZWF0ID0gZGF0YS5zZWF0O1xuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XG4gICAgICAgIHRoaXMuaXNVc2VyID0gZGF0YS5pc1VzZXI7XG5cbiAgICAgICAgdGhpcy5jYXJkcy5pbml0aWFsaXplKDIpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZCA9IHRoaXMuZGlzcGxheUdyb3VwLmNyZWF0ZSgwLCAwLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVSZWN0KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhY2tncm91bmQuYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgLTIwLCBcIlwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkubmFtZSk7XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMjAsIFwiXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZS5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5iYWxhbmNlKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMgPSB0aGlzLmNhcmRzLmRpc3BsYXlHcm91cDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmNhcmRzLmNlbnRlclggPSAwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMuY2VudGVyWSA9IC0xMjA7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZCh0aGlzLmRpc3BsYXkuY2FyZHMpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24gPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCBcImRlYWxlckJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbi5sZWZ0ID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQubGVmdCArIDU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24uYm90dG9tID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQuYm90dG9tIC0gNTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5kZWFsZXJCdXR0b24pO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yID0gdGhpcy5nYW1lLmFkZC5zcHJpdGUoMCwgMCwgXCJyZWRDaXJjbGVcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uZXh0SW5kaWNhdG9yLnJpZ2h0ID0gdGhpcy5kaXNwbGF5LmJhY2tncm91bmQucmlnaHQgLSA1O1xuICAgICAgICB0aGlzLmRpc3BsYXkubmV4dEluZGljYXRvci5ib3R0b20gPSB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5ib3R0b20gLSA1O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5uYW1lLnRleHQgPSB0aGlzLm5hbWU7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLnRleHQgPSBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5iYWxhbmNlKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmRlYWxlckJ1dHRvbi52aXNpYmxlID0gdGhpcy5pc0RlYWxlciA9PT0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5leHRJbmRpY2F0b3IudmlzaWJsZSA9IHRoaXMuaXNOZXh0ID09PSB0cnVlO1xuICAgIH1cblxuICAgIHVwZGF0ZShkYXRhKSB7XG4gICAgICAgIC8vIFRPRE8gLSBGbGVzaCBvdXQgdGhlIHJlc3Qgb2YgdGhlIGRhdGEgLS0gZG8gSSBsaWtlIHRoaXMgbWV0aG9kP1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2UgPT09IHVuZGVmaW5lZCA/IHRoaXMuYmFsYW5jZSA6IGRhdGEuYmFsYW5jZTtcbiAgICAgICAgdGhpcy5pc0RlYWxlciA9IGRhdGEuaXNEZWFsZXIgPT09IHVuZGVmaW5lZCA/IHRoaXMuaXNEZWFsZXIgOiBkYXRhLmlzRGVhbGVyO1xuICAgICAgICB0aGlzLmlzTmV4dCA9IGRhdGEuaXNOZXh0ID09PSB1bmRlZmluZWQgPyB0aGlzLmlzTmV4dCA6IGRhdGEuaXNOZXh0O1xuICAgICAgICB0aGlzLnJvdW5kQmV0ID0gZGF0YS5yb3VuZEJldCA9PT0gdW5kZWZpbmVkID8gdGhpcy5yb3VuZEJldCA6IGRhdGEucm91bmRCZXQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyOyIsImltcG9ydCBVdGlsIGZyb20gXCIuLi9VdGlsXCI7XG5cbmNsYXNzIFBvdCB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmFtb3VudCA9IDA7XG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSB0aGlzLm1ha2VCdG4oMCwgMCwgXCJcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlUmVjdCwgKCkgPT4ge30pO1xuICAgICAgICB0aGlzLnVwZGF0ZURpc3BsYXkoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZS50ZXh0LnRleHQgPSBVdGlsLnBhcnNlQ3VycmVuY3kodGhpcy5hbW91bnQpO1xuICAgIH1cblxuICAgIHNldEFtb3VudChhbW91bnQpIHtcbiAgICAgICAgdGhpcy5hbW91bnQgPSBhbW91bnQ7XG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIG1ha2VCdG4oeCwgeSwgdGV4dCwgdGV4dHVyZSwgY2FsbGJhY2ssIGNhbGxiYWNrQ29udGV4dCA9IHRoaXMpIHtcbiAgICAgICAgbGV0IGJ0biA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKHgsIHksIHRleHR1cmUsIGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQpO1xuICAgICAgICBidG4uYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgbGV0IGJ0blRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMCwgdGV4dCk7XG4gICAgICAgIGJ0blRleHQuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIGJ0bi5hZGRDaGlsZChidG5UZXh0KTtcbiAgICAgICAgYnRuLnRleHQgPSBidG5UZXh0O1xuXG4gICAgICAgIHJldHVybiBidG47XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQb3Q7IiwiLyoqXG4gKiBUT0RPIC0gQ29tYmluZSBlbmQgYXNzZXRzIGludG8gYmFyIGFzc2V0XG4gKlxuICogVGhpcyBsb29rcyBwcmV0dHkgZ29vZCwgYnV0IHRoZSBiYXIgaXMgaGFyZCB0byBjbGljay4gTmVlZCB0byBtYWtlIHRoZVxuICogZW50aXJlIHNwcml0ZSB0YWxsZXIuIEkgY291bGQgZG8gc29tZXRoaW5nIGxpa2UgYWRkIGFuIGludmlzaWJsZSBzcHJpdGVcbiAqIGFzIGEgY2hpbGQgb2YgdGhlIGJhciB3aGljaCBpcyB3aGF0J3MgaW4gY2hhcmdlIG9mIGFjY2VwdGluZyBpbnB1dCwgYnV0XG4gKiBJIHRoaW5rIGp1c3QgY2hhbmdpbmcgdGhlIGFzc2V0IGl0c2VsZiBpcyB0aGUgYmV0dGVyIGNob2ljZS5cbiAqL1xuXG5jbGFzcyBTbGlkZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIGtleSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgICAgdGhpcy5iYXIgPSBudWxsOyAgLy8gVGhlIHNsaWRlciBiYXIgc3ByaXRlXG4gICAgICAgIHRoaXMubWFya2VyID0gbnVsbDsgIC8vIFRoZSBkcmFnZ2FibGUgbWFya2VyIHNwcml0ZVxuICAgICAgICB0aGlzLmluZGV4ID0gMDsgIC8vIEN1cnJlbnQgaW5kZXggb2YgbWFya2VyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMTsgIC8vIFRvdGFsIG51bWJlciBvZiBpbmRpY2VzXG4gICAgICAgIHRoaXMucHJldlggPSAwOyAgLy8gTmVlZGVkIHRvIGtub3cgd2hlbiBtYXJrZXIgc25hcHMgdG8gbmV3IHBvc1xuICAgICAgICB0aGlzLmRpc3BsYXkgPSB7fTtcbiAgICAgICAgdGhpcy5pbmRleENoYW5nZWQgPSBuZXcgUGhhc2VyLlNpZ25hbCgpO1xuICAgICAgICB0aGlzLnNsaWRlcldoZWVsID0gbmV3IFBoYXNlci5TaWduYWwoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5iYXIgPSB0aGlzLmdhbWUuYWRkLmltYWdlKDAsIDAsIHRoaXMua2V5LCBcInNsaWRlcl9iYXJfZXh0ZW5kZWRcIik7XG4gICAgICAgIHRoaXMuYmFyLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuYmFyLmV2ZW50cy5vbklucHV0RG93bi5hZGQodGhpcy5iYXJDbGlja2VkLCB0aGlzKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRPdmVyLmFkZCgoKSA9PiB0aGlzLmVuYWJsZVNsaWRlcldoZWVsKHRydWUpKTtcbiAgICAgICAgdGhpcy5iYXIuZXZlbnRzLm9uSW5wdXRPdXQuYWRkKCgpID0+IHRoaXMuZW5hYmxlU2xpZGVyV2hlZWwoZmFsc2UpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhciA9IHRoaXMuYmFyO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5sZWZ0RW5kID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCB0aGlzLmJhci5oZWlnaHQgLyAyLCB0aGlzLmtleSwgXCJzbGlkZXJfZW5kXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubGVmdEVuZC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5iYXIuYWRkQ2hpbGQodGhpcy5kaXNwbGF5LmxlZnRFbmQpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5yaWdodEVuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoNDAwLCB0aGlzLmJhci5oZWlnaHQgLyAyLCB0aGlzLmtleSwgXCJzbGlkZXJfZW5kXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkucmlnaHRFbmQuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIHRoaXMuYmFyLmFkZENoaWxkKHRoaXMuZGlzcGxheS5yaWdodEVuZCk7XG5cbiAgICAgICAgdGhpcy5tYXJrZXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAyMiwgdGhpcy5rZXksIFwic2xpZGVyX21hcmtlclwiKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuYW5jaG9yLnNldFRvKDAuNSwgMCk7XG4gICAgICAgIHRoaXMubWFya2VyLmlucHV0RW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHRoaXMubWFya2VyLmlucHV0LmVuYWJsZURyYWcoKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuaW5wdXQuYWxsb3dWZXJ0aWNhbERyYWcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tYXJrZXIuaW5wdXQuYm91bmRzUmVjdCA9IG5ldyBQaGFzZXIuUmVjdGFuZ2xlKFxuICAgICAgICAgICAgLXRoaXMubWFya2VyLndpZHRoIC8gMixcbiAgICAgICAgICAgIDIyLFxuICAgICAgICAgICAgdGhpcy5iYXIud2lkdGggKyB0aGlzLm1hcmtlci53aWR0aCxcbiAgICAgICAgICAgIHRoaXMubWFya2VyLmhlaWdodFxuICAgICAgICApO1xuICAgICAgICB0aGlzLm1hcmtlci5pbnB1dC5lbmFibGVTbmFwKHRoaXMuYmFyLndpZHRoIC8gdGhpcy5sZW5ndGgsIDEpO1xuICAgICAgICB0aGlzLm1hcmtlci5ldmVudHMub25EcmFnVXBkYXRlLmFkZCh0aGlzLm1hcmtlckRyYWdnZWQsIHRoaXMpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyID0gdGhpcy5tYXJrZXI7XG4gICAgICAgIHRoaXMuYmFyLmFkZENoaWxkKHRoaXMubWFya2VyKTtcbiAgICB9XG5cbiAgICBzZXRJbmRleChpbmRleCwgdXBkYXRlUG9zID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLmluZGV4Q2hhbmdlZC5kaXNwYXRjaChpbmRleCk7XG5cbiAgICAgICAgaWYgKHVwZGF0ZVBvcykge1xuICAgICAgICAgICAgdGhpcy5tYXJrZXIueCA9IHRoaXMuYmFyLndpZHRoIC8gdGhpcy5sZW5ndGggKiB0aGlzLmluZGV4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TGVuZ3RoKGxlbmd0aCkge1xuICAgICAgICBpZiAobGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDYW5ub3Qgc2V0IHNsaWRlciBsZW5ndGggbGVzcyB0aGFuIDFcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSBpZiAobGVuZ3RoID4gdGhpcy5iYXIud2lkdGgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIldhcm5pbmc6IFNldHRpbmcgc2xpZGVyIHN0b3BzIGdyZWF0ZXIgdGhhbiBsZW5ndGggbWF5IHJlc3VsdCBpbiB1bmV4cGVjdGVkIGJlaGF2aW9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICB0aGlzLm1hcmtlci5pbnB1dC5lbmFibGVTbmFwKHRoaXMuYmFyLndpZHRoIC8gbGVuZ3RoLCAxKTtcbiAgICB9XG5cbiAgICBzZXRFbmFibGVkKGVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5iYXIuaW5wdXRFbmFibGVkID0gZW5hYmxlZDtcbiAgICAgICAgdGhpcy5tYXJrZXIuaW5wdXRFbmFibGVkID0gZW5hYmxlZDtcblxuICAgICAgICBsZXQgdGludCA9IGVuYWJsZWQgPyAweEZGRkZGRiA6IDB4ODA4MDgwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFyLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmRpc3BsYXkubGVmdEVuZC50aW50ID0gdGludDtcbiAgICAgICAgdGhpcy5kaXNwbGF5LnJpZ2h0RW5kLnRpbnQgPSB0aW50O1xuICAgICAgICB0aGlzLmRpc3BsYXkubWFya2VyLnRpbnQgPSB0aW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IENhbGxiYWNrIGZvciBpbnB1dCBkaXJlY3RseSBvbiB0aGUgc2xpZGVyIGJhclxuICAgICAqXG4gICAgICogQWxsb3dzIHVzZXJzIHRvIGNsaWNrIG9uIHRoZSBiYXIgYW5kIGhhdmUgdGhlIG1hcmtlciBzbmFwIHRvIHRoZVxuICAgICAqIGNsaWNrZWQgcG9zaXRpb24gYnkgZXhwbG9pdGluZyBzb21lIG9mIFBoYXNlcidzIGludGVybmFscy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlNwcml0ZX0gYmFyIC0gVGhlIGNsaWNrZWQgc3ByaXRlLCBzaG91bGQgYWx3YXlzIGJlIHRoaXMuYmFyXG4gICAgICogQHBhcmFtIHtQaGFzZXIuUG9pbnRlcn0gcG9pbnRlciAtIFRoZSBwb2ludGVyIHJlc3BvbnNpYmxlIGZvciB0aGUgY2xpY2tcbiAgICAgKi9cbiAgICBiYXJDbGlja2VkKGJhciwgcG9pbnRlcikge1xuICAgICAgICAvLyBJZiB0aGUgc2xpZGVyIGhhc24ndCBiZWVuIGRyYWdnZWQgYmVmb3JlIGJlaW5nIGNsaWNrZWQsIHdlIG5lZWRcbiAgICAgICAgLy8gdG8gc3Bvb2Ygc29tZSBjYWNoZSBkYXRhLiBTZXQgdGhlIHN0YXJ0IHBvaW50IG9mIHRoZSBkcmFnIHRvIHRoZVxuICAgICAgICAvLyBsZWZ0bW9zdCBwb2ludCBvZiB0aGUgYmFyLlxuICAgICAgICBpZiAoIXRoaXMubWFya2VyLmlucHV0Ll9kcmFnUG9pbnQueCkge1xuICAgICAgICAgICAgbGV0IHB0ciA9IG5ldyBQaGFzZXIuUG9pbnRlcih0aGlzLmdhbWUsIHBvaW50ZXIuaWQsIHBvaW50ZXIucG9pbnRlck1vZGUpO1xuICAgICAgICAgICAgcHRyLnggPSB0aGlzLm1hcmtlci53b3JsZC54O1xuICAgICAgICAgICAgcHRyLnkgPSB0aGlzLm1hcmtlci53b3JsZC55O1xuICAgICAgICAgICAgdGhpcy5tYXJrZXIuaW5wdXQuc3RhcnREcmFnKHB0cik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXJrZXIuaW5wdXQudXBkYXRlRHJhZyhwb2ludGVyLCB0cnVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBDYWxsYmFjayBmb3IgbWFya2VyLiBEaXNwYXRjaCBzaWduYWwgb24gc25hcC5cbiAgICAgKlxuICAgICAqIFRoZSBvbkRyYWdVcGRhdGUgY2FsbGJhY2sgaXMgY2FsbGVkIHZlcnkgZnJlcXVlbnRseSBieSBQaGFzZXIsIGJ1dFxuICAgICAqIG5vdCBhbGwgb2YgdGhhdCBpbmZvcm1hdGlvbiBpcyBoZWxwZnVsLiBUaGlzIGZpbHRlcnMgb3V0IG1vc3Qgb2YgdGhvc2VcbiAgICAgKiBjYWxscyBzbyBhbGwgd2Ugc2VlIGFyZSB0aGUgdXBkYXRlcyBmb3Igc25hcHMgdG8gbmV3IGxvY2F0aW9ucyBvblxuICAgICAqIHRoZSBiYXIuXG4gICAgICpcbiAgICAgKiBOT1RFOiBUaGUgcGFyYW1zIHBhc3NlZCB0byB0aGlzIGZ1bmN0aW9uIGFyZSBkZWZpbmVkIGJ5IFBoYXNlclxuICAgICAqIGludGVybmFscy4gQWxsIHRoYXQncyBiZWluZyB1c2VkIGhlcmUgaXMgdGhlIHNuYXAgcGFyYW0sIHdoaWNoIGlzIGhvd1xuICAgICAqIHdlIGtub3cgaWYgdGhlIG1hcmtlciBoYXMgc25hcHBlZCB0byBhIG5ldyBsb2NhdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlNwcml0ZX0gbWFya2VyIC0gVGhlIGRyYWdnZWQgbWFya2VyLCB1bnVzZWRcbiAgICAgKiBAcGFyYW0ge1BoYXNlci5Qb2ludGVyfSBwb2ludGVyIC0gVGhlIHBvaW50ZXIgaW5pdGlhdGluZyB0aGUgZHJhZywgdW51c2VkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggLSBUaGUgbmV3IFggY29vcmRpbmF0ZSBvZiB0aGUgc3ByaXRlLCB1bnVzZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSAtIFRoZSBuZXcgWSBjb29yZGluYXRlIG9mIHRoZSBzcHJpdGUsIHVudXNlZFxuICAgICAqIEBwYXJhbSB7UGhhc2VyLlBvaW50fSBzbmFwIC0gVGhlIFBvaW50IHRvIHdoaWNoIHRoZSBtYXJrZXIgc25hcHBlZFxuICAgICAqL1xuICAgIG1hcmtlckRyYWdnZWQobWFya2VyLCBwb2ludGVyLCB4LCB5LCBzbmFwKSB7XG4gICAgICAgIGlmIChzbmFwLnggIT09IHRoaXMucHJldlgpIHtcbiAgICAgICAgICAgIHRoaXMucHJldlggPSBzbmFwLng7XG4gICAgICAgICAgICB0aGlzLnNldEluZGV4KHRoaXMucHJldlggLyB0aGlzLm1hcmtlci5pbnB1dC5zbmFwWCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBFbmFibGUgb3IgZGlzYWJsZSBkaXNwYXRjaCBvZiBzaWduYWwgb24gd2hlZWwgc2Nyb2xsXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGVkIC0gSXMgdGhlIGNhbGxiYWNrIGVuYWJsZWQgb3IgZGlzYWJsZWQ/XG4gICAgICovXG4gICAgZW5hYmxlU2xpZGVyV2hlZWwoZW5hYmxlZCkge1xuICAgICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5nYW1lLmlucHV0Lm1vdXNlLm1vdXNlV2hlZWxDYWxsYmFjayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNsaWRlcldoZWVsLmRpc3BhdGNoKHRoaXMuZ2FtZS5pbnB1dC5tb3VzZS53aGVlbERlbHRhKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdhbWUuaW5wdXQubW91c2UubW91c2VXaGVlbENhbGxiYWNrID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2xpZGVyOyIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJwYW5lbFwiOiB7XG4gICAgXCJwYWRkaW5nXCI6IDEwLFxuICAgIFwidGV4dFN0eWxlXCI6IHtcbiAgICAgIFwiZm9udFwiOiBcImJvbGQgMjJwdCBBcmlhbFwiLFxuICAgICAgXCJmaWxsXCI6IFwid2hpdGVcIlxuICAgIH0sXG4gICAgXCJwb3NcIjoge1xuICAgICAgXCJ4XCI6IDE0ODAsXG4gICAgICBcInlcIjogNzkwXG4gICAgfVxuICB9XG59IiwiaW1wb3J0IENhcmQgZnJvbSBcIi4uL2NsYXNzZXMvQ2FyZFwiO1xuXG5jbGFzcyBDYXJkTWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLmNhcmRzID0gW107XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwID0gdGhpcy5nYW1lLmFkZC5ncm91cCgpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUobnVtX2NhcmRzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtX2NhcmRzOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjYXJkID0gbmV3IENhcmQodGhpcy5nYW1lLCB0aGlzKTtcbiAgICAgICAgICAgIGNhcmQuaW5pdGlhbGl6ZSh7fSk7XG4gICAgICAgICAgICBjYXJkLmluaXRpYWxpemVEaXNwbGF5KCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FyZHMucHVzaChjYXJkKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChjYXJkLnNwcml0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hbGlnbigtMSwgMSwgdGhpcy5jYXJkc1swXS5zcHJpdGUud2lkdGggKiAxLjIsIDApO1xuICAgIH1cblxuICAgIHNldENhcmROYW1lcyhuYW1lcykge1xuICAgICAgICBjb25zb2xlLmxvZyhuYW1lcyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0ubmFtZSA9IG5hbWVzW2ldO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLm5hbWUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jYXJkc1tpXS51cGRhdGVEaXNwbGF5KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhcmRNYW5hZ2VyOyIsImltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL2NsYXNzZXMvUGxheWVyXCI7XG5cbmNsYXNzIFBsYXllck1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcblxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTsgIC8vIERpcmVjdCBhY2Nlc3MgdG8gdGhlIFBsYXllciBvYmplY3RzXG4gICAgICAgIHRoaXMudXNlclBsYXllciA9IG51bGw7ICAvLyBUaGUgdXNlcidzIHBsYXllciBvYmplY3QsIGlmIGF2YWlsYWJsZVxuXG4gICAgICAgIC8vIENvbnRhaW5zIGFsbCBkaXNwbGF5IGVsZW1lbnRzIGZvciBhbGwgcGxheWVycyBpbiB0aGUgZ2FtZVxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKHBsYXllckRhdGEpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcGxheWVyID0gbmV3IFBsYXllcih0aGlzLmdhbWUsIHRoaXMpO1xuICAgICAgICAgICAgcGxheWVyLmluaXRpYWxpemUocGxheWVyRGF0YVtpXSk7XG4gICAgICAgICAgICBwbGF5ZXIuaW5pdGlhbGl6ZURpc3BsYXkoKTtcblxuICAgICAgICAgICAgdGhpcy5wbGF5ZXJzLnB1c2gocGxheWVyKTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFkZChwbGF5ZXIuZGlzcGxheUdyb3VwKTtcblxuICAgICAgICAgICAgaWYgKHBsYXllckRhdGFbaV0uaXNVc2VyID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51c2VyUGxheWVyID0gcGxheWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucGxheWVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLmFsaWduKC0xLCAxLCB0aGlzLnBsYXllcnNbMF0uZGlzcGxheUdyb3VwLndpZHRoICogMS4yLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEJ5SWQoaWQpIHtcbiAgICAgICAgLy8gVE9ETyAtIERvIHRoaXMgd2l0aG91dCBpdGVyYXRpbmcgLS0gYnVpbGQgbWFwIG9uIGluaXQ/XG4gICAgICAgIC8vIFRPRE8gLSBTaG91bGQgdGhpcyBldmVyIHJldHVybiBudWxsP1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyTWFuYWdlcjsiLCJjb25zdCBpc1N0cmluZyA9IHZhbCA9PiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbmNvbnN0IGlzQmxvYiA9IHZhbCA9PiB2YWwgaW5zdGFuY2VvZiBCbG9iO1xuXG5wb2x5ZmlsbC5jYWxsKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnID8gd2luZG93IDogdGhpcyB8fCB7fSk7XG5cbmZ1bmN0aW9uIHBvbHlmaWxsKCkge1xuICBpZiAoaXNTdXBwb3J0ZWQuY2FsbCh0aGlzKSkgcmV0dXJuO1xuXG4gIGlmICghKCduYXZpZ2F0b3InIGluIHRoaXMpKSB0aGlzLm5hdmlnYXRvciA9IHt9O1xuICB0aGlzLm5hdmlnYXRvci5zZW5kQmVhY29uID0gc2VuZEJlYWNvbi5iaW5kKHRoaXMpO1xufTtcblxuZnVuY3Rpb24gc2VuZEJlYWNvbih1cmwsIGRhdGEpIHtcbiAgY29uc3QgZXZlbnQgPSB0aGlzLmV2ZW50ICYmIHRoaXMuZXZlbnQudHlwZTtcbiAgY29uc3Qgc3luYyA9IGV2ZW50ID09PSAndW5sb2FkJyB8fCBldmVudCA9PT0gJ2JlZm9yZXVubG9hZCc7XG5cbiAgY29uc3QgeGhyID0gKCdYTUxIdHRwUmVxdWVzdCcgaW4gdGhpcykgPyBuZXcgWE1MSHR0cFJlcXVlc3QoKSA6IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICB4aHIub3BlbignUE9TVCcsIHVybCwgIXN5bmMpO1xuICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0FjY2VwdCcsICcqLyonKTtcblxuXG4gIGlmIChpc1N0cmluZyhkYXRhKSkge1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9wbGFpbjtjaGFyc2V0PVVURi04Jyk7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9ICd0ZXh0L3BsYWluJztcbiAgfSBlbHNlIGlmIChpc0Jsb2IoZGF0YSkgJiYgZGF0YS50eXBlKSB7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsIGRhdGEudHlwZSk7XG4gIH1cblxuICB0cnkge1xuICAgIHhoci5zZW5kKGRhdGEpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBpc1N1cHBvcnRlZCgpIHtcbiAgcmV0dXJuICgnbmF2aWdhdG9yJyBpbiB0aGlzKSAmJiAoJ3NlbmRCZWFjb24nIGluIHRoaXMubmF2aWdhdG9yKTtcbn0iLCJpbXBvcnQgY29uZmlnIGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCBDb250cm9sbGVyIGZyb20gXCIuLi9jbGFzc2VzL0NvbnRyb2xsZXJcIjtcblxuY2xhc3MgQm9vdCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmluaXRpYWxEYXRhID0gaW5pdGlhbERhdGE7XG4gICAgICAgIHRoaXMuZ2FtZS5jb25maWcgPSBjb25maWc7XG5cbiAgICAgICAgLy8gVE9ETyAtIFRoaXMgc2hvdWxkIGNvbWUgZnJvbSBzb21laHdlcmUgZHluYW1pY1xuICAgICAgICB0aGlzLmdhbWUucnVsZXMgPSB7XG4gICAgICAgICAgICBtaW5EZW5vbTogMjUsXG4gICAgICAgICAgICBibGluZHM6IHtcbiAgICAgICAgICAgICAgICBzbWFsbDogMjUsXG4gICAgICAgICAgICAgICAgYmlnOiA1MFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcklkLCB0aGlzLmdhbWUuaW5pdGlhbERhdGEudG9rZW4pO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KFwibG9hZFwiKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJvb3Q7IiwiY2xhc3MgTG9hZCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgcHJlbG9hZCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJiYWNrZ3JvdW5kXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvYmFja2dyb3VuZC5wbmdcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwiZGVhbGVyQnV0dG9uXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvZGVhbGVyYnV0dG9uLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuaW1hZ2UoXCJyZWRDaXJjbGVcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9yZWRjaXJjbGUucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwiY2FyZHNcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9jYXJkcy5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9jYXJkcy5qc29uXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwicGFuZWxcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9wYW5lbC5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9wYW5lbC5qc29uXCIpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS50ZXh0dXJlcyA9IHRoaXMuY3JlYXRlQ3VzdG9tVGV4dHVyZXMoKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydChcIm1haW5cIik7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3VzdG9tVGV4dHVyZXMoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IHt9O1xuXG4gICAgICAgIGxldCBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MubGluZVN0eWxlKDQsIDB4MDAwMDAwKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMTAwLCAxMDAsIDEwMCwgMTAwKTtcbiAgICAgICAgdGV4dHVyZXNbXCJ3aGl0ZVNxdWFyZVwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmxpbmVTdHlsZSg0LCAweDAwMDAwMCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIDMwMCwgMTAwKTtcblxuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlUmVjdFwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuXG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICByZXR1cm4gdGV4dHVyZXM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkOyIsImltcG9ydCBBY3Rpb24gZnJvbSBcIi4uL2NsYXNzZXMvQWN0aW9uLmpzXCI7XG5pbXBvcnQgQ2FyZE1hbmFnZXIgZnJvbSBcIi4uL21hbmFnZXJzL0NhcmRNYW5hZ2VyXCI7XG5pbXBvcnQgUGFuZWwgZnJvbSBcIi4uL2NsYXNzZXMvUGFuZWxcIjtcbmltcG9ydCBQbGF5ZXJNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9QbGF5ZXJNYW5hZ2VyXCI7XG5pbXBvcnQgUG90IGZyb20gXCIuLi9jbGFzc2VzL1BvdFwiO1xuaW1wb3J0IFNTRSBmcm9tIFwiLi4vU1NFXCI7XG5cbmNsYXNzIE1haW4gZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMudGFibGVfc3NlID0gbmV3IFNTRSh0aGlzLmdhbWUsIHRoaXMuZ2FtZS5pbml0aWFsRGF0YS50YWJsZVNTRVVybCk7XG4gICAgICAgIHRoaXMudXNlcl9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lLmluaXRpYWxEYXRhLnVzZXJTU0VVcmwpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5sb2FkXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmRpc2Nvbm5lY3RCZWFjb24oKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCBcImJhY2tncm91bmRcIik7XG4gICAgICAgIHRoaXMuZGVhbEJ0biA9IHRoaXMubWFrZUJ0bigxMDAsIDEwMCwgXCJkZWFsXCIsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVNxdWFyZSwgdGhpcy5kZWFsKTtcblxuICAgICAgICB0aGlzLmdhbWUucGxheWVycyA9IG5ldyBQbGF5ZXJNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmluaXRpYWxpemUodGhpcy5nYW1lLmluaXRpYWxEYXRhLnBsYXllcnMpO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVycy5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYO1xuICAgICAgICB0aGlzLmdhbWUucGxheWVycy5kaXNwbGF5R3JvdXAuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYIC8gNjtcblxuICAgICAgICB0aGlzLmdhbWUuYm9hcmQgPSBuZXcgQ2FyZE1hbmFnZXIodGhpcy5nYW1lKTtcbiAgICAgICAgdGhpcy5nYW1lLmJvYXJkLmluaXRpYWxpemUoNSk7XG4gICAgICAgIHRoaXMuZ2FtZS5ib2FyZC5kaXNwbGF5R3JvdXAuY2VudGVyWCA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYO1xuICAgICAgICB0aGlzLmdhbWUuYm9hcmQuZGlzcGxheUdyb3VwLmNlbnRlclkgPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWTtcblxuICAgICAgICB0aGlzLmdhbWUucG90ID0gbmV3IFBvdCh0aGlzLmdhbWUpO1xuICAgICAgICB0aGlzLmdhbWUucG90LmluaXRpYWxpemVEaXNwbGF5KCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wb3Quc3ByaXRlLmNlbnRlclggPSB0aGlzLmdhbWUud29ybGQuY2VudGVyWDtcbiAgICAgICAgdGhpcy5nYW1lLnBvdC5zcHJpdGUuY2VudGVyWSA9IHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJZIC0gMTQwO1xuXG4gICAgICAgIC8vIFRPRE8gLSBUaGlzIHNob3VsZCBnbyBzb21ld2hlcmUgZWxzZS4gTWF5YmUgaW4gUG90P1xuICAgICAgICB0aGlzLmdhbWUucm91bmRCZXQgPSAwO1xuXG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbCA9IG5ldyBQYW5lbCh0aGlzLmdhbWUsIFwicGFuZWxcIik7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRNaW5EZW5vbSh0aGlzLmdhbWUucnVsZXMubWluRGVub20pO1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2xpZGVyLnNldExlbmd0aCh0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyLmJhbGFuY2UgLyB0aGlzLmdhbWUucnVsZXMubWluRGVub20pO1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuZGlzcGxheUdyb3VwLnggPSB0aGlzLmdhbWUuY29uZmlnLnBhbmVsLnBvcy54O1xuICAgICAgICB0aGlzLmdhbWUucGFuZWwuZGlzcGxheUdyb3VwLnkgPSB0aGlzLmdhbWUuY29uZmlnLnBhbmVsLnBvcy55O1xuICAgICAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdIYW5kXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3SGFuZDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLmJvYXJkLnJlc2V0KCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcGxheWVyID0gdGhpcy5nYW1lLnBsYXllcnMucGxheWVyc1tpXTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuY2FyZHMucmVzZXQoKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgaXNEZWFsZXI6IHBsYXllci5pZCA9PT0gZGF0YS5kZWFsZXIsXG4gICAgICAgICAgICAgICAgICAgIGlzTmV4dDogcGxheWVyLmlkID09PSBkYXRhLm5leHQsXG4gICAgICAgICAgICAgICAgICAgIHJvdW5kQmV0OiAwXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUT0RPIC0gdXNlclBsYXllci5pZCB3aWxsIGZhaWwgZm9yIHdhdGNoZXJzXG4gICAgICAgICAgICBsZXQgdXNlclBsYXllck5leHQgPSBkYXRhLm5leHQgPT09IHRoaXMuZ2FtZS5wbGF5ZXJzLnVzZXJQbGF5ZXIuaWQ7XG4gICAgICAgICAgICB0aGlzLmdhbWUucGFuZWwuc2V0RW5hYmxlZCh1c2VyUGxheWVyTmV4dCk7XG4gICAgICAgICAgICB0aGlzLmdhbWUucG90LnNldEFtb3VudCgwKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5yb3VuZEJldCA9IDA7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcIm5ld1JvdW5kXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3Um91bmQ6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlBY3Rpb24oQWN0aW9uLkNIRUNLKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnBsYXllcnMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV0udXBkYXRlKHtyb3VuZEJldDogMH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gMDtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudGFibGVfc3NlLmFkZExpc3RlbmVyKFwiYWN0aW9uXCIsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYWN0aW9uOiBcIiwgZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmdhbWUuYm9hcmQuc2V0Q2FyZE5hbWVzKGRhdGEuYm9hcmQpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBsYXllcnMuZ2V0QnlJZChkYXRhLnBsYXllcklkKS51cGRhdGUoe1xuICAgICAgICAgICAgICAgIGJhbGFuY2U6IGRhdGEucGxheWVyQmFsYW5jZSxcbiAgICAgICAgICAgICAgICBpc05leHQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJvdW5kQmV0OiBkYXRhLnJvdW5kQmV0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmdldEJ5SWQoZGF0YS5uZXh0KS51cGRhdGUoe2lzTmV4dDogdHJ1ZX0pO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBvdC5zZXRBbW91bnQoZGF0YS5wb3QpO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnJvdW5kQmV0ID0gZGF0YS5yb3VuZEJldDtcblxuICAgICAgICAgICAgbGV0IHVzZXJQbGF5ZXJOZXh0ID0gZGF0YS5uZXh0ID09PSB0aGlzLmdhbWUucGxheWVycy51c2VyUGxheWVyLmlkO1xuICAgICAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnNldEVuYWJsZWQodXNlclBsYXllck5leHQpO1xuICAgICAgICAgICAgaWYgKGRhdGEuYWN0aW9uVHlwZSA9PT0gQWN0aW9uLkJFVCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZXRTZWNvbmRhcnlBY3Rpb24oQWN0aW9uLkZPTEQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJoYW5kQ29tcGxldGVcIiwgZXZlbnQgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJoYW5kQ29tcGxldGU6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS53aW5uZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHdpbm5lciA9IGRhdGEud2lubmVyc1tpXTtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5nZXRCeUlkKHdpbm5lci5pZCkudXBkYXRlKHtiYWxhbmNlOiB3aW5uZXIuYmFsYW5jZX0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdQbGF5ZXJcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5ld1BsYXllcjogXCIsIGRhdGEpO1xuICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICB0aGlzLnVzZXJfc3NlLmFkZExpc3RlbmVyKFwibmV3SGFuZFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibmV3SGFuZDogXCIsIGRhdGEpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV0uaWQgPT09IHRoaXMuZ2FtZS5pbml0aWFsRGF0YS5wbGF5ZXJJZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzW2ldLmNhcmRzLnNldENhcmROYW1lcyhkYXRhLmhvbGRpbmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB0aGlzLnVzZXJfc3NlLmFkZExpc3RlbmVyKFwibmV3UGxheWVyXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJuZXdQbGF5ZXI6IFwiLCBkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLnNldFRva2VuKGRhdGEudG9rZW4pO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICB9XG5cbiAgICByZWdpc3Rlckxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5nYW1lLnBhbmVsLnByaW1hcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgICAgIHRoaXMuZ2FtZS5wYW5lbC5zZWNvbmRhcnlDbGlja2VkLmFkZCh0aGlzLmhhbmRsZUFjdGlvbiwgdGhpcyk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBSb3V0ZSBhY3Rpb25zIHRvIGNvbnRyb2xsZXIgcmVxdWVzdHNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWN0aW9uIC0gVGhlIGFjdGlvbiB0byBiZSByZXF1ZXN0ZWQsIGRlZmluZWQgaW4gQWN0aW9uLmpzXG4gICAgICovXG4gICAgaGFuZGxlQWN0aW9uKGFjdGlvbikge1xuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uRk9MRDpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5mb2xkKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEFjdGlvbi5DSEVDSzpcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWUuY29udHJvbGxlci5jaGVjaygpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBBY3Rpb24uQkVUOlxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5jb250cm9sbGVyLmJldCh0aGlzLmdhbWUucGFuZWwuYmV0QW10KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiSW52YWxpZCBBY3Rpb24gVHlwZTogXCIgKyBhY3Rpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuXG4gICAgfVxuXG4gICAgbWFrZUJ0bih4LCB5LCB0ZXh0LCB0ZXh0dXJlLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYnRuID0gdGhpcy5nYW1lLmFkZC5idXR0b24oeCwgeSwgdGV4dHVyZSwgY2FsbGJhY2ssIHRoaXMpO1xuICAgICAgICBidG4uYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgbGV0IGJ0blRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMCwgdGV4dCk7XG4gICAgICAgIGJ0blRleHQuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIGJ0bi5hZGRDaGlsZChidG5UZXh0KTtcbiAgICAgICAgYnRuLnRleHQgPSBidG5UZXh0O1xuXG4gICAgICAgIHJldHVybiBidG47XG4gICAgfVxuXG4gICAgZGVhbCgpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignUE9TVCcsICcvdGFibGVzLycgKyB0aGlzLmdhbWUuaW5pdGlhbERhdGEudGFibGVOYW1lICsgJy9kZWFsLycpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdGFibGVOYW1lOiBpbml0aWFsRGF0YS50YWJsZU5hbWUsXG4gICAgICAgIH0pKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1haW47Il19
