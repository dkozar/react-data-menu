'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Circle = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _items = require('./../data/items1.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Circle = exports.Circle = function (_Component) {
    _inherits(Circle, _Component);

    function Circle(props) {
        _classCallCheck(this, Circle);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Circle).call(this, props));

        _this.onMouseOver = _this.onMouseOver.bind(_this);
        _this.onMouseOut = _this.onMouseOut.bind(_this);

        _this.state = {
            strokeWidth: 0
        };
        return _this;
    }

    _createClass(Circle, [{
        key: 'onMouseOver',
        value: function onMouseOver() {
            this.setState({
                //r: this.props.r,
                strokeWidth: 5
            });
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut() {
            this.setState({
                //r: this.props.r,
                strokeWidth: 0
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var d = {
                cx: this.props.x,
                cy: this.props.y,
                r: this.props.r,
                stroke: this.props.strokeColor,
                strokeWidth: this.state.strokeWidth,
                fill: this.props.color
            };

            return _react2.default.createElement('circle', _extends({}, d, {
                onContextMenu: this.props.onContextMenu,
                onMouseOver: this.onMouseOver,
                onMouseOut: this.onMouseOut }));
        }
    }]);

    return Circle;
}(_react.Component);

Circle.propTypes = { strokeColor: _react2.default.PropTypes.string };
Circle.defaultProps = { strokeColor: 'white' };