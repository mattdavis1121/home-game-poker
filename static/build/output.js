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

},{"./states/Boot":8,"./states/Load":9,"./states/Main":10}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SSE = function () {
    function SSE(game, url) {
        _classCallCheck(this, SSE);

        this.game = game;
        this.source = new EventSource(url);
    }

    _createClass(SSE, [{
        key: "addListener",
        value: function addListener(type, callback, callbackContext) {
            for (var _len = arguments.length, args = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                args[_key - 3] = arguments[_key];
            }

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

},{}],5:[function(require,module,exports){
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

            this.cards.initialize();
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

            this.updateDisplay();
        }
    }, {
        key: "updateDisplay",
        value: function updateDisplay() {
            this.display.name.text = this.name;
            this.display.balance.text = _Util2.default.parseCurrency(this.balance);
        }
    }]);

    return Player;
}();

exports.default = Player;

},{"../Util":3,"../managers/CardManager":6}],6:[function(require,module,exports){
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
        value: function initialize() {
            var NUM_CARDS = 2; // TODO - get this from somewhere else
            for (var i = 0; i < NUM_CARDS; i++) {
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
    }]);

    return CardManager;
}();

exports.default = CardManager;

},{"../classes/Card":4}],7:[function(require,module,exports){
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

        // Direct access to the Player objects themselves
        this.players = [];

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
            }

            this.displayGroup.align(-1, 1, this.players[0].displayGroup.width * 1.2, 0);
            this.displayGroup.position.setTo(this.game.world.centerX / 2, this.game.world.centerY / 6);
        }
    }]);

    return PlayerManager;
}();

exports.default = PlayerManager;

},{"../classes/Player":5}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
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

},{}],9:[function(require,module,exports){
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
            this.game.load.atlasJSONHash("cards", "/static/assets/hd/cards.png", "/static/assets/hd/cards.json");

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

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PlayerManager = require("../managers/PlayerManager");

var _PlayerManager2 = _interopRequireDefault(_PlayerManager);

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
            this.gameData = initialData;
            this.table_sse = new _SSE2.default(this.game, this.gameData.tableSSEUrl);
            this.user_sse = new _SSE2.default(this.game, this.gameData.userSSEUrl);
        }
    }, {
        key: "create",
        value: function create() {
            var _this2 = this;

            this.background = this.game.add.image(0, 0, "background");
            this.dealBtn = this.makeBtn(100, 100, "deal", this.game.textures.whiteSquare, this.deal);
            this.otherBtn = this.makeBtn(100, 200, "other", this.game.textures.whiteSquare, this.btnClicked);
            this.joinBtn = this.makeBtn(100, 300, "join", this.game.textures.whiteSquare, this.joinTable);

            this.game.players = new _PlayerManager2.default(this.game);
            this.game.players.initialize(this.gameData.players);

            this.table_sse.addListener("event", this.updateBtn, this, this.otherBtn);
            this.table_sse.addListener("newHand", function (event) {
                console.log(event.data);
            }, this);

            this.user_sse.addListener("newHand", function (event) {
                var data = JSON.parse(event.data);
                console.log(data);
                for (var i = 0; i < _this2.game.players.players.length; i++) {
                    if (_this2.game.players.players[i].id === _this2.gameData.playerId) {
                        _this2.game.players.players[i].cards.setCardNames(data.holdings);
                    }
                }
            }, this);
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
        key: "btnClicked",
        value: function btnClicked(btn) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/button_clicked');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                tableName: initialData.tableName
            }));
        }
    }, {
        key: "deal",
        value: function deal() {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/tables/' + this.gameData.tableName + '/deal/');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                tableName: initialData.tableName
            }));
        }
    }, {
        key: "joinTable",
        value: function joinTable() {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/tables/' + this.gameData.tableName + '/join/');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                tableName: initialData.tableName,
                userId: initialData.userId
            }));
        }
    }, {
        key: "updateBtn",
        value: function updateBtn(btn) {
            btn.tint = btn.tint === 0xffffff ? 0xff0000 : 0xffffff;
        }
    }]);

    return Main;
}(Phaser.State);

exports.default = Main;

},{"../SSE":2,"../managers/PlayerManager":7}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1NTRS5qcyIsInN0YXRpYy9zcmMvVXRpbC5qcyIsInN0YXRpYy9zcmMvY2xhc3Nlcy9DYXJkLmpzIiwic3RhdGljL3NyYy9jbGFzc2VzL1BsYXllci5qcyIsInN0YXRpYy9zcmMvbWFuYWdlcnMvQ2FyZE1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL21hbmFnZXJzL1BsYXllck1hbmFnZXIuanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Cb290LmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTG9hZC5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL01haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRU0sSTs7O0FBQ0Ysb0JBQWM7QUFBQTs7QUFBQSxnSEFDSjtBQUNGLG1CQUFPLElBREw7QUFFRixvQkFBUTtBQUZOLFNBREk7O0FBTVYsY0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLE1BQWYsRUFBdUIsY0FBdkIsRUFBNkIsS0FBN0I7QUFDQSxjQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBZixFQUF1QixjQUF2QixFQUE2QixLQUE3QjtBQUNBLGNBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLGNBQXZCLEVBQTZCLEtBQTdCOztBQUVBLGNBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsTUFBakI7QUFWVTtBQVdiOzs7RUFaYyxPQUFPLEk7O0FBZTFCLElBQUksSUFBSjs7Ozs7Ozs7Ozs7OztJQ25CTSxHO0FBQ0YsaUJBQVksSUFBWixFQUFrQixHQUFsQixFQUF1QjtBQUFBOztBQUNuQixhQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsYUFBSyxNQUFMLEdBQWMsSUFBSSxXQUFKLENBQWdCLEdBQWhCLENBQWQ7QUFDSDs7OztvQ0FFVyxJLEVBQU0sUSxFQUFV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VSxHLEVBQUs7QUFDWixnQkFBSSxNQUFNLElBQUksY0FBSixFQUFWO0FBQ0EsZ0JBQUksSUFBSixDQUFTLE1BQVQsRUFBaUIsaUJBQWpCO0FBQ0EsZ0JBQUksZ0JBQUosQ0FBcUIsY0FBckIsRUFBcUMsa0JBQXJDO0FBQ0EsZ0JBQUksSUFBSixDQUFTLEtBQUssU0FBTCxDQUFlO0FBQ3BCLDJCQUFXLFlBQVk7QUFESCxhQUFmLENBQVQ7QUFHSDs7OytCQUVNO0FBQ0gsZ0JBQUksTUFBTSxJQUFJLGNBQUosRUFBVjtBQUNBLGdCQUFJLElBQUosQ0FBUyxNQUFULEVBQWlCLGFBQWEsS0FBSyxRQUFMLENBQWMsU0FBM0IsR0FBdUMsUUFBeEQ7QUFDQSxnQkFBSSxnQkFBSixDQUFxQixjQUFyQixFQUFxQyxrQkFBckM7QUFDQSxnQkFBSSxJQUFKLENBQVMsS0FBSyxTQUFMLENBQWU7QUFDcEIsMkJBQVcsWUFBWTtBQURILGFBQWYsQ0FBVDtBQUdIOzs7b0NBRVc7QUFDUixnQkFBSSxNQUFNLElBQUksY0FBSixFQUFWO0FBQ0EsZ0JBQUksSUFBSixDQUFTLE1BQVQsRUFBaUIsYUFBYSxLQUFLLFFBQUwsQ0FBYyxTQUEzQixHQUF1QyxRQUF4RDtBQUNBLGdCQUFJLGdCQUFKLENBQXFCLGNBQXJCLEVBQXFDLGtCQUFyQztBQUNBLGdCQUFJLElBQUosQ0FBUyxLQUFLLFNBQUwsQ0FBZTtBQUNwQiwyQkFBVyxZQUFZLFNBREg7QUFFcEIsd0JBQVEsWUFBWTtBQUZBLGFBQWYsQ0FBVDtBQUlIOzs7a0NBRVMsRyxFQUFLO0FBQ1gsZ0JBQUksSUFBSixHQUFXLElBQUksSUFBSixLQUFhLFFBQWIsR0FBd0IsUUFBeEIsR0FBbUMsUUFBOUM7QUFDSDs7OztFQTVFYyxPQUFPLEs7O2tCQStFWCxJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEJvb3QgZnJvbSBcIi4vc3RhdGVzL0Jvb3RcIjtcbmltcG9ydCBMb2FkIGZyb20gXCIuL3N0YXRlcy9Mb2FkXCI7XG5pbXBvcnQgTWFpbiBmcm9tIFwiLi9zdGF0ZXMvTWFpblwiO1xuXG5jbGFzcyBHYW1lIGV4dGVuZHMgUGhhc2VyLkdhbWUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih7XG4gICAgICAgICAgICB3aWR0aDogMTkyMCxcbiAgICAgICAgICAgIGhlaWdodDogMTA4MFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImJvb3RcIiwgQm9vdCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcImxvYWRcIiwgTG9hZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLnN0YXRlLmFkZChcIm1haW5cIiwgTWFpbiwgZmFsc2UpO1xuXG4gICAgICAgIHRoaXMuc3RhdGUuc3RhcnQoXCJib290XCIpO1xuICAgIH1cbn1cblxubmV3IEdhbWUoKTsiLCJjbGFzcyBTU0Uge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHVybCkge1xuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSh1cmwpO1xuICAgIH1cblxuICAgIGFkZExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrLCBjYWxsYmFja0NvbnRleHQsIC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5zb3VyY2UuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU1NFOyIsImNsYXNzIFV0aWwge1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IFJldHVybiBhIGZvcm1hdHRlZCBjdXJyZW5jeSBzdHJpbmcgZnJvbSBhbiBpbnRlZ2VyXG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlQ3VycmVuY3koaW50KSB7XG4gICAgICAgIGxldCB2YWwgPSBpbnQgLyAxMDA7XG4gICAgICAgIHJldHVybiBcIiRcIiArIHZhbC50b0ZpeGVkKDIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVXRpbDsiLCJjbGFzcyBDYXJkIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCBtYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgICAgIHRoaXMubmFtZSA9IG51bGw7ICAgLy8gU3RyaW5nIElEIG9mIGNhcmQsIGUuZy4gJ0toJyBvciAnN3MnXG4gICAgICAgIHRoaXMuc3ByaXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKGRhdGEpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gZGF0YS5uYW1lO1xuICAgIH1cblxuICAgIGluaXRpYWxpemVEaXNwbGF5KCkge1xuICAgICAgICB0aGlzLnNwcml0ZSA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsIFwiY2FyZHNcIik7XG4gICAgICAgIHRoaXMuc3ByaXRlLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLnNwcml0ZS5zY2FsZS5zZXRUbygxLjUpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuc3ByaXRlLmZyYW1lTmFtZSA9IHRoaXMubmFtZSA/IHRoaXMubmFtZSA6IFwiYmFja1wiO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FyZDsiLCJpbXBvcnQgVXRpbCBmcm9tIFwiLi4vVXRpbFwiO1xuaW1wb3J0IENhcmRNYW5hZ2VyIGZyb20gXCIuLi9tYW5hZ2Vycy9DYXJkTWFuYWdlclwiO1xuXG5jbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUsIG1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5tYW5hZ2VyID0gbWFuYWdlcjtcblxuICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgdGhpcy51c2VySWQgPSBudWxsO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBudWxsO1xuICAgICAgICB0aGlzLnNpdHRpbmdPdXQgPSBudWxsO1xuICAgICAgICB0aGlzLnNlYXQgPSBudWxsO1xuICAgICAgICB0aGlzLm5hbWUgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheSA9IHt9O1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcblxuICAgICAgICB0aGlzLmNhcmRzID0gbmV3IENhcmRNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShkYXRhKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkYXRhLmlkO1xuICAgICAgICB0aGlzLnVzZXJJZCA9IGRhdGEudXNlcklkO1xuICAgICAgICB0aGlzLmJhbGFuY2UgPSBkYXRhLmJhbGFuY2U7XG4gICAgICAgIHRoaXMuc2l0dGluZ091dCA9IGRhdGEuc2l0dGluZ091dDtcbiAgICAgICAgdGhpcy5zZWF0ID0gZGF0YS5zZWF0O1xuICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XG5cbiAgICAgICAgdGhpcy5jYXJkcy5pbml0aWFsaXplKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZURpc3BsYXkoKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWNrZ3JvdW5kID0gdGhpcy5kaXNwbGF5R3JvdXAuY3JlYXRlKDAsIDAsIHRoaXMuZ2FtZS50ZXh0dXJlcy53aGl0ZVJlY3QpO1xuICAgICAgICB0aGlzLmRpc3BsYXkuYmFja2dyb3VuZC5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZSA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAtMjAsIFwiXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXkubmFtZS5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5uYW1lKTtcblxuICAgICAgICB0aGlzLmRpc3BsYXkuYmFsYW5jZSA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAyMCwgXCJcIik7XG4gICAgICAgIHRoaXMuZGlzcGxheS5iYWxhbmNlLmFuY2hvci5zZXRUbygwLjUpO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQodGhpcy5kaXNwbGF5LmJhbGFuY2UpO1xuXG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcyA9IHRoaXMuY2FyZHMuZGlzcGxheUdyb3VwO1xuICAgICAgICB0aGlzLmRpc3BsYXkuY2FyZHMuY2VudGVyWCA9IDA7XG4gICAgICAgIHRoaXMuZGlzcGxheS5jYXJkcy5jZW50ZXJZID0gLTEyMDtcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWRkKHRoaXMuZGlzcGxheS5jYXJkcyk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5Lm5hbWUudGV4dCA9IHRoaXMubmFtZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5LmJhbGFuY2UudGV4dCA9IFV0aWwucGFyc2VDdXJyZW5jeSh0aGlzLmJhbGFuY2UpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyOyIsImltcG9ydCBDYXJkIGZyb20gXCIuLi9jbGFzc2VzL0NhcmRcIjtcblxuY2xhc3MgQ2FyZE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5jYXJkcyA9IFtdO1xuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cCA9IHRoaXMuZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICBjb25zdCBOVU1fQ0FSRFMgPSAyOyAgICAvLyBUT0RPIC0gZ2V0IHRoaXMgZnJvbSBzb21ld2hlcmUgZWxzZVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IE5VTV9DQVJEUzsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2FyZCA9IG5ldyBDYXJkKHRoaXMuZ2FtZSwgdGhpcyk7XG4gICAgICAgICAgICBjYXJkLmluaXRpYWxpemUoe30pO1xuICAgICAgICAgICAgY2FyZC5pbml0aWFsaXplRGlzcGxheSgpO1xuXG4gICAgICAgICAgICB0aGlzLmNhcmRzLnB1c2goY2FyZCk7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQoY2FyZC5zcHJpdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAuYWxpZ24oLTEsIDEsIHRoaXMuY2FyZHNbMF0uc3ByaXRlLndpZHRoICogMS4yLCAwKTtcbiAgICB9XG5cbiAgICBzZXRDYXJkTmFtZXMobmFtZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2cobmFtZXMpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmRzW2ldLm5hbWUgPSBuYW1lc1tpXTtcbiAgICAgICAgICAgIHRoaXMuY2FyZHNbaV0udXBkYXRlRGlzcGxheSgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYXJkTWFuYWdlcjsiLCJpbXBvcnQgUGxheWVyIGZyb20gXCIuLi9jbGFzc2VzL1BsYXllclwiO1xuXG5jbGFzcyBQbGF5ZXJNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lKSB7XG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG5cbiAgICAgICAgLy8gRGlyZWN0IGFjY2VzcyB0byB0aGUgUGxheWVyIG9iamVjdHMgdGhlbXNlbHZlc1xuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTtcblxuICAgICAgICAvLyBDb250YWlucyBhbGwgZGlzcGxheSBlbGVtZW50cyBmb3IgYWxsIHBsYXllcnMgaW4gdGhlIGdhbWVcbiAgICAgICAgdGhpcy5kaXNwbGF5R3JvdXAgPSB0aGlzLmdhbWUuYWRkLmdyb3VwKCk7XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZShwbGF5ZXJEYXRhKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHBsYXllciA9IG5ldyBQbGF5ZXIodGhpcy5nYW1lLCB0aGlzKTtcbiAgICAgICAgICAgIHBsYXllci5pbml0aWFsaXplKHBsYXllckRhdGFbaV0pO1xuICAgICAgICAgICAgcGxheWVyLmluaXRpYWxpemVEaXNwbGF5KCk7XG5cbiAgICAgICAgICAgIHRoaXMucGxheWVycy5wdXNoKHBsYXllcik7XG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hZGQocGxheWVyLmRpc3BsYXlHcm91cCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpc3BsYXlHcm91cC5hbGlnbigtMSwgMSwgdGhpcy5wbGF5ZXJzWzBdLmRpc3BsYXlHcm91cC53aWR0aCAqIDEuMiwgMCk7XG4gICAgICAgIHRoaXMuZGlzcGxheUdyb3VwLnBvc2l0aW9uLnNldFRvKHRoaXMuZ2FtZS53b3JsZC5jZW50ZXJYIC8gMiwgdGhpcy5nYW1lLndvcmxkLmNlbnRlclkgLyA2KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllck1hbmFnZXI7IiwiY2xhc3MgQm9vdCBleHRlbmRzIFBoYXNlci5TdGF0ZSB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlO1xuICAgICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduVmVydGljYWxseSA9IHRydWU7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoXCJsb2FkXCIpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQm9vdDsiLCJjbGFzcyBMb2FkIGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBwcmVsb2FkKCkge1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5pbWFnZShcImJhY2tncm91bmRcIiwgXCIvc3RhdGljL2Fzc2V0cy9oZC9iYWNrZ3JvdW5kLnBuZ1wiKTtcbiAgICAgICAgdGhpcy5nYW1lLmxvYWQuYXRsYXNKU09OSGFzaChcImNhcmRzXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMucG5nXCIsIFwiL3N0YXRpYy9hc3NldHMvaGQvY2FyZHMuanNvblwiKTtcblxuICAgICAgICB0aGlzLmdhbWUudGV4dHVyZXMgPSB0aGlzLmNyZWF0ZUN1c3RvbVRleHR1cmVzKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoXCJtYWluXCIpO1xuICAgIH1cblxuICAgIGNyZWF0ZUN1c3RvbVRleHR1cmVzKCkge1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSB7fTtcblxuICAgICAgICBsZXQgZ3JhcGhpY3MgPSB0aGlzLmdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgICAgIGdyYXBoaWNzLmJlZ2luRmlsbCgweEZGRkZGRik7XG4gICAgICAgIGdyYXBoaWNzLmRyYXdSZWN0KDEwMCwgMTAwLCAxMDAsIDEwMCk7XG4gICAgICAgIHRleHR1cmVzW1wid2hpdGVTcXVhcmVcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcbiAgICAgICAgZ3JhcGhpY3MuZGVzdHJveSgpO1xuXG4gICAgICAgIGdyYXBoaWNzID0gdGhpcy5nYW1lLmFkZC5ncmFwaGljcygpO1xuICAgICAgICBncmFwaGljcy5saW5lU3R5bGUoNCwgMHgwMDAwMDApO1xuICAgICAgICBncmFwaGljcy5iZWdpbkZpbGwoMHhGRkZGRkYpO1xuICAgICAgICBncmFwaGljcy5kcmF3UmVjdCgwLCAwLCAzMDAsIDEwMCk7XG5cbiAgICAgICAgdGV4dHVyZXNbXCJ3aGl0ZVJlY3RcIl0gPSBncmFwaGljcy5nZW5lcmF0ZVRleHR1cmUoKTtcblxuICAgICAgICBncmFwaGljcy5kZXN0cm95KCk7XG5cbiAgICAgICAgcmV0dXJuIHRleHR1cmVzO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9hZDsiLCJpbXBvcnQgUGxheWVyTWFuYWdlciBmcm9tIFwiLi4vbWFuYWdlcnMvUGxheWVyTWFuYWdlclwiO1xuaW1wb3J0IFNTRSBmcm9tIFwiLi4vU1NFXCI7XG5cbmNsYXNzIE1haW4gZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZURhdGEgPSBpbml0aWFsRGF0YTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lRGF0YS50YWJsZVNTRVVybCk7XG4gICAgICAgIHRoaXMudXNlcl9zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lRGF0YS51c2VyU1NFVXJsKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IHRoaXMuZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgXCJiYWNrZ3JvdW5kXCIpO1xuICAgICAgICB0aGlzLmRlYWxCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAxMDAsIFwiZGVhbFwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuZGVhbCk7XG4gICAgICAgIHRoaXMub3RoZXJCdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAyMDAsIFwib3RoZXJcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlU3F1YXJlLCB0aGlzLmJ0bkNsaWNrZWQpO1xuICAgICAgICB0aGlzLmpvaW5CdG4gPSB0aGlzLm1ha2VCdG4oMTAwLCAzMDAsIFwiam9pblwiLCB0aGlzLmdhbWUudGV4dHVyZXMud2hpdGVTcXVhcmUsIHRoaXMuam9pblRhYmxlKTtcblxuICAgICAgICB0aGlzLmdhbWUucGxheWVycyA9IG5ldyBQbGF5ZXJNYW5hZ2VyKHRoaXMuZ2FtZSk7XG4gICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLmluaXRpYWxpemUodGhpcy5nYW1lRGF0YS5wbGF5ZXJzKTtcblxuICAgICAgICB0aGlzLnRhYmxlX3NzZS5hZGRMaXN0ZW5lcihcImV2ZW50XCIsIHRoaXMudXBkYXRlQnRuLCB0aGlzLCB0aGlzLm90aGVyQnRuKTtcbiAgICAgICAgdGhpcy50YWJsZV9zc2UuYWRkTGlzdGVuZXIoXCJuZXdIYW5kXCIsIChldmVudCkgPT4ge2NvbnNvbGUubG9nKGV2ZW50LmRhdGEpfSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy51c2VyX3NzZS5hZGRMaXN0ZW5lcihcIm5ld0hhbmRcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5nYW1lLnBsYXllcnMucGxheWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdhbWUucGxheWVycy5wbGF5ZXJzW2ldLmlkID09PSB0aGlzLmdhbWVEYXRhLnBsYXllcklkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZ2FtZS5wbGF5ZXJzLnBsYXllcnNbaV0uY2FyZHMuc2V0Q2FyZE5hbWVzKGRhdGEuaG9sZGluZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgdXBkYXRlKCkge1xuXG4gICAgfVxuXG4gICAgbWFrZUJ0bih4LCB5LCB0ZXh0LCB0ZXh0dXJlLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgYnRuID0gdGhpcy5nYW1lLmFkZC5idXR0b24oeCwgeSwgdGV4dHVyZSwgY2FsbGJhY2ssIHRoaXMpO1xuICAgICAgICBidG4uYW5jaG9yLnNldFRvKDAuNSk7XG5cbiAgICAgICAgbGV0IGJ0blRleHQgPSB0aGlzLmdhbWUuYWRkLnRleHQoMCwgMCwgdGV4dCk7XG4gICAgICAgIGJ0blRleHQuYW5jaG9yLnNldFRvKDAuNSk7XG4gICAgICAgIGJ0bi5hZGRDaGlsZChidG5UZXh0KTtcbiAgICAgICAgYnRuLnRleHQgPSBidG5UZXh0O1xuXG4gICAgICAgIHJldHVybiBidG47XG4gICAgfVxuXG4gICAgYnRuQ2xpY2tlZChidG4pIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignUE9TVCcsICcvYnV0dG9uX2NsaWNrZWQnKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgZGVhbCgpIHtcbiAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB4aHIub3BlbignUE9TVCcsICcvdGFibGVzLycgKyB0aGlzLmdhbWVEYXRhLnRhYmxlTmFtZSArICcvZGVhbC8nKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIHRhYmxlTmFtZTogaW5pdGlhbERhdGEudGFibGVOYW1lLFxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgam9pblRhYmxlKCkge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy90YWJsZXMvJyArIHRoaXMuZ2FtZURhdGEudGFibGVOYW1lICsgJy9qb2luLycpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdGFibGVOYW1lOiBpbml0aWFsRGF0YS50YWJsZU5hbWUsXG4gICAgICAgICAgICB1c2VySWQ6IGluaXRpYWxEYXRhLnVzZXJJZFxuICAgICAgICB9KSk7XG4gICAgfVxuXG4gICAgdXBkYXRlQnRuKGJ0bikge1xuICAgICAgICBidG4udGludCA9IGJ0bi50aW50ID09PSAweGZmZmZmZiA/IDB4ZmYwMDAwIDogMHhmZmZmZmY7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNYWluOyJdfQ==
