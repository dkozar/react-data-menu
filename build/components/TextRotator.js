'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactWrappyText = require('react-wrappy-text');

var _reactWrappyText2 = _interopRequireDefault(_reactWrappyText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var texts = ['This menu is data driven (hierarchy is not hardcoded).', 'Open the drop-down menu on top.', 'Check out the bottom menu.', 'Right-click the application background for context menu.', 'Right-click the circle for another context menu.', 'Menu popups are fully customizable. Menu items too.', 'None of the popups should ever be cropped by screen edges.', 'You can specify directions of popups by providing hints.'];

var TextRotator = function (_Component) {
    _inherits(TextRotator, _Component);

    function TextRotator(props) {
        _classCallCheck(this, TextRotator);

        var _this = _possibleConstructorReturn(this, (TextRotator.__proto__ || Object.getPrototypeOf(TextRotator)).call(this, props));

        _this.state = {
            index: 0,
            text: texts[0]
        };

        _this.start();
        return _this;
    }

    _createClass(TextRotator, [{
        key: 'start',
        value: function start() {
            var _this2 = this;

            this.interval = setInterval(function () {
                var index = (_this2.state.index + 1) % texts.length;

                _this2.setState({
                    index: index,
                    text: texts[index]
                });
            }, 5000);
        }
    }, {
        key: 'stop',
        value: function stop() {
            clearInterval(this.interval);
            this.interval = null;
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _reactWrappyText2.default,
                { className: 'wrappy' },
                this.state.text
            );
        }
    }]);

    return TextRotator;
}(_react.Component);

exports.default = TextRotator;