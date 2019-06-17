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

},{"./states/Boot":3,"./states/Load":4,"./states/Main":5}],2:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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
            this.game.load.image("background", "/static/assets/background.png");
            this.game.load.atlasJSONHash("cards", "/static/assets/cards-hd.png", "/static/assets/cards-hd.json");
            this.game.load.atlasJSONHash("chips", "/static/assets/chips-hd.png", "/static/assets/chips-hd.json");
            this.game.load.atlasJSONHash("cardBacks", "/static/assets/cardBacks-hd.png", "/static/assets/cardBacks-hd.json");

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

            textures["whiteRect"] = graphics.generateTexture();

            graphics.destroy();

            return textures;
        }
    }]);

    return Load;
}(Phaser.State);

exports.default = Load;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
            this.sse = new _SSE2.default(this.game, this.gameData.sseUrl);
        }
    }, {
        key: "create",
        value: function create() {
            this.background = this.game.add.image(0, 0, "background");
            this.dealBtn = this.makeBtn("deal", this.game.textures.whiteRect, this.btnClicked);

            this.card = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "cards");
            this.card.anchor.setTo(0.5);

            this.sse.addListener("event", this.updateBtn, this, this.dealBtn);
        }
    }, {
        key: "update",
        value: function update() {}
    }, {
        key: "makeBtn",
        value: function makeBtn(text, texture, callback) {
            var btn = this.game.add.button(100, 100, texture, callback, this);
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
        key: "updateBtn",
        value: function updateBtn(btn) {
            btn.tint = btn.tint === 0xffffff ? 0xff0000 : 0xffffff;
        }
    }]);

    return Main;
}(Phaser.State);

exports.default = Main;

},{"../SSE":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzdGF0aWMvc3JjL0dhbWUuanMiLCJzdGF0aWMvc3JjL1NTRS5qcyIsInN0YXRpYy9zcmMvc3RhdGVzL0Jvb3QuanMiLCJzdGF0aWMvc3JjL3N0YXRlcy9Mb2FkLmpzIiwic3RhdGljL3NyYy9zdGF0ZXMvTWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFTSxJOzs7QUFDRixvQkFBYztBQUFBOztBQUFBLGdIQUNKO0FBQ0YsbUJBQU8sSUFETDtBQUVGLG9CQUFRO0FBRk4sU0FESTs7QUFNVixjQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsTUFBZixFQUF1QixjQUF2QixFQUE2QixLQUE3QjtBQUNBLGNBQUssS0FBTCxDQUFXLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLGNBQXZCLEVBQTZCLEtBQTdCO0FBQ0EsY0FBSyxLQUFMLENBQVcsR0FBWCxDQUFlLE1BQWYsRUFBdUIsY0FBdkIsRUFBNkIsS0FBN0I7O0FBRUEsY0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixNQUFqQjtBQVZVO0FBV2I7OztFQVpjLE9BQU8sSTs7QUFlMUIsSUFBSSxJQUFKOzs7Ozs7Ozs7Ozs7O0lDbkJNLEc7QUFDRixpQkFBWSxJQUFaLEVBQWtCLEdBQWxCLEVBQXVCO0FBQUE7O0FBQ25CLGFBQUssSUFBTCxHQUFZLElBQVo7QUFDQSxhQUFLLE1BQUwsR0FBYyxJQUFJLFdBQUosQ0FBZ0IsR0FBaEIsQ0FBZDtBQUNIOzs7O29DQUVXLEksRUFBTSxRLEVBQVUsZSxFQUEwQjtBQUFBLDhDQUFOLElBQU07QUFBTixvQkFBTTtBQUFBOztBQUNsRCxpQkFBSyxNQUFMLENBQVksZ0JBQVosQ0FBNkIsSUFBN0IsRUFBbUMsVUFBQyxLQUFELEVBQVc7QUFDMUMseUJBQVMsSUFBVCxrQkFBYyxlQUFkLFNBQWtDLElBQWxDLEdBQXdDLEtBQXhDO0FB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R0FBMUIsRUFBK0IsT0FBL0IsRUFBd0MsUUFBeEMsRUFBa0QsSUFBbEQsQ0FBVjtBQUNBLGdCQUFJLE1BQUosQ0FBVyxLQUFYLENBQWlCLEdBQWpCOztBQUVBLGdCQUFJLFVBQVUsS0FBSyxJQUFMLENBQVUsR0FBVixDQUFjLElBQWQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsSUFBekIsQ0FBZDtBQUNBLG9CQUFRLE1BQVIsQ0FBZSxLQUFmLENBQXFCLEdBQXJCO0FBQ0EsZ0JBQUksUUFBSixDQUFhLE9BQWI7QUFDQSxnQkFBSSxJQUFKLEdBQVcsT0FBWDs7QUFFQSxtQkFBTyxHQUFQO0FBQ0g7OzttQ0FFVSxHLEVBQUs7QUFDWixnQkFBSSxNQUFNLElBQUksY0FBSixFQUFWO0FBQ0EsZ0JBQUksSUFBSixDQUFTLE1BQVQsRUFBaUIsaUJBQWpCO0FBQ0EsZ0JBQUksZ0JBQUosQ0FBcUIsY0FBckIsRUFBcUMsa0JBQXJDO0FBQ0EsZ0JBQUksSUFBSixDQUFTLEtBQUssU0FBTCxDQUFlO0FBQ3BCLDJCQUFXLFlBQVk7QUFESCxhQUFmLENBQVQ7QUFHSDs7O2tDQUVTLEcsRUFBSztBQUNYLGdCQUFJLElBQUosR0FBVyxJQUFJLElBQUosS0FBYSxRQUFiLEdBQXdCLFFBQXhCLEdBQW1DLFFBQTlDO0FBQ0g7Ozs7RUEzQ2MsT0FBTyxLOztrQkE4Q1gsSSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBCb290IGZyb20gXCIuL3N0YXRlcy9Cb290XCI7XG5pbXBvcnQgTG9hZCBmcm9tIFwiLi9zdGF0ZXMvTG9hZFwiO1xuaW1wb3J0IE1haW4gZnJvbSBcIi4vc3RhdGVzL01haW5cIjtcblxuY2xhc3MgR2FtZSBleHRlbmRzIFBoYXNlci5HYW1lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoe1xuICAgICAgICAgICAgd2lkdGg6IDE5MjAsXG4gICAgICAgICAgICBoZWlnaHQ6IDEwODBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJib290XCIsIEJvb3QsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJsb2FkXCIsIExvYWQsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5zdGF0ZS5hZGQoXCJtYWluXCIsIE1haW4sIGZhbHNlKTtcblxuICAgICAgICB0aGlzLnN0YXRlLnN0YXJ0KFwiYm9vdFwiKTtcbiAgICB9XG59XG5cbm5ldyBHYW1lKCk7IiwiY2xhc3MgU1NFIHtcbiAgICBjb25zdHJ1Y3RvcihnYW1lLCB1cmwpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UodXJsKTtcbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjaywgY2FsbGJhY2tDb250ZXh0LCAuLi5hcmdzKSB7XG4gICAgICAgIHRoaXMuc291cmNlLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGNhbGxiYWNrQ29udGV4dCwgLi4uYXJncywgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNTRTsiLCJjbGFzcyBCb290IGV4dGVuZHMgUGhhc2VyLlN0YXRlIHtcbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmdhbWUuc2NhbGUuc2NhbGVNb2RlID0gUGhhc2VyLlNjYWxlTWFuYWdlci5TSE9XX0FMTDtcbiAgICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydChcImxvYWRcIik7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCb290OyIsImNsYXNzIExvYWQgZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIHByZWxvYWQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5sb2FkLmltYWdlKFwiYmFja2dyb3VuZFwiLCBcIi9zdGF0aWMvYXNzZXRzL2JhY2tncm91bmQucG5nXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwiY2FyZHNcIiwgXCIvc3RhdGljL2Fzc2V0cy9jYXJkcy1oZC5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9jYXJkcy1oZC5qc29uXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwiY2hpcHNcIiwgXCIvc3RhdGljL2Fzc2V0cy9jaGlwcy1oZC5wbmdcIiwgXCIvc3RhdGljL2Fzc2V0cy9jaGlwcy1oZC5qc29uXCIpO1xuICAgICAgICB0aGlzLmdhbWUubG9hZC5hdGxhc0pTT05IYXNoKFwiY2FyZEJhY2tzXCIsIFwiL3N0YXRpYy9hc3NldHMvY2FyZEJhY2tzLWhkLnBuZ1wiLCBcIi9zdGF0aWMvYXNzZXRzL2NhcmRCYWNrcy1oZC5qc29uXCIpO1xuXG4gICAgICAgIHRoaXMuZ2FtZS50ZXh0dXJlcyA9IHRoaXMuY3JlYXRlQ3VzdG9tVGV4dHVyZXMoKTtcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydChcIm1haW5cIik7XG4gICAgfVxuXG4gICAgY3JlYXRlQ3VzdG9tVGV4dHVyZXMoKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IHt9O1xuXG4gICAgICAgIGxldCBncmFwaGljcyA9IHRoaXMuZ2FtZS5hZGQuZ3JhcGhpY3MoKTtcbiAgICAgICAgZ3JhcGhpY3MuYmVnaW5GaWxsKDB4RkZGRkZGKTtcbiAgICAgICAgZ3JhcGhpY3MuZHJhd1JlY3QoMTAwLCAxMDAsIDEwMCwgMTAwKTtcblxuICAgICAgICB0ZXh0dXJlc1tcIndoaXRlUmVjdFwiXSA9IGdyYXBoaWNzLmdlbmVyYXRlVGV4dHVyZSgpO1xuXG4gICAgICAgIGdyYXBoaWNzLmRlc3Ryb3koKTtcblxuICAgICAgICByZXR1cm4gdGV4dHVyZXM7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2FkOyIsImltcG9ydCBTU0UgZnJvbSBcIi4uL1NTRVwiXG5cbmNsYXNzIE1haW4gZXh0ZW5kcyBQaGFzZXIuU3RhdGUge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuZ2FtZURhdGEgPSBpbml0aWFsRGF0YTtcbiAgICAgICAgdGhpcy5zc2UgPSBuZXcgU1NFKHRoaXMuZ2FtZSwgdGhpcy5nYW1lRGF0YS5zc2VVcmwpO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gdGhpcy5nYW1lLmFkZC5pbWFnZSgwLCAwLCBcImJhY2tncm91bmRcIik7XG4gICAgICAgIHRoaXMuZGVhbEJ0biA9IHRoaXMubWFrZUJ0bihcImRlYWxcIiwgdGhpcy5nYW1lLnRleHR1cmVzLndoaXRlUmVjdCwgdGhpcy5idG5DbGlja2VkKTtcblxuICAgICAgICB0aGlzLmNhcmQgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSh0aGlzLmdhbWUud29ybGQuY2VudGVyWCwgdGhpcy5nYW1lLndvcmxkLmNlbnRlclksIFwiY2FyZHNcIik7XG4gICAgICAgIHRoaXMuY2FyZC5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICB0aGlzLnNzZS5hZGRMaXN0ZW5lcihcImV2ZW50XCIsIHRoaXMudXBkYXRlQnRuLCB0aGlzLCB0aGlzLmRlYWxCdG4pO1xuICAgIH1cblxuICAgIHVwZGF0ZSgpIHtcblxuICAgIH1cblxuICAgIG1ha2VCdG4odGV4dCwgdGV4dHVyZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGJ0biA9IHRoaXMuZ2FtZS5hZGQuYnV0dG9uKDEwMCwgMTAwLCB0ZXh0dXJlLCBjYWxsYmFjaywgdGhpcyk7XG4gICAgICAgIGJ0bi5hbmNob3Iuc2V0VG8oMC41KTtcblxuICAgICAgICBsZXQgYnRuVGV4dCA9IHRoaXMuZ2FtZS5hZGQudGV4dCgwLCAwLCB0ZXh0KTtcbiAgICAgICAgYnRuVGV4dC5hbmNob3Iuc2V0VG8oMC41KTtcbiAgICAgICAgYnRuLmFkZENoaWxkKGJ0blRleHQpO1xuICAgICAgICBidG4udGV4dCA9IGJ0blRleHQ7XG5cbiAgICAgICAgcmV0dXJuIGJ0bjtcbiAgICB9XG5cbiAgICBidG5DbGlja2VkKGJ0bikge1xuICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHhoci5vcGVuKCdQT1NUJywgJy9idXR0b25fY2xpY2tlZCcpO1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgdGFibGVOYW1lOiBpbml0aWFsRGF0YS50YWJsZU5hbWUsXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICB1cGRhdGVCdG4oYnRuKSB7XG4gICAgICAgIGJ0bi50aW50ID0gYnRuLnRpbnQgPT09IDB4ZmZmZmZmID8gMHhmZjAwMDAgOiAweGZmZmZmZjtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1haW47Il19
