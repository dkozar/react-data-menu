'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Circle = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

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
        _this.onTouchStart = _this.onTouchStart.bind(_this);

        _this.state = {
            strokeWidth: _this.props.selected ? 5 : 0,
            hovered: false
        };
        return _this;
    }

    _createClass(Circle, [{
        key: 'onMouseOver',
        value: function onMouseOver() {
            this.setState({
                hovered: true
            });
        }
    }, {
        key: 'onTouchStart',
        value: function onTouchStart(e) {
            this.setState({
                hovered: true
            });
            this.props.onTouchStart(e);
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut() {
            this.setState({
                hovered: false
            });
        }
    }, {
        key: 'getStroke',
        value: function getStroke() {
            return {
                strokeWidth: this.props.selected || this.state.hovered ? 5 : 0,
                stroke: this.state.hovered ? this.props.strokeColorHovered : this.props.strokeColorSelected
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var d = _lodash2.default.assign({
                cx: this.props.x,
                cy: this.props.y,
                r: this.props.r,
                fill: this.props.color
            }, this.getStroke());

            return _react2.default.createElement('circle', _extends({}, d, {
                onContextMenu: this.props.onContextMenu,
                onTouchStart: this.onTouchStart,
                onMouseOver: this.onMouseOver,
                onMouseOut: this.onMouseOut }));
        }
    }]);

    return Circle;
}(_react.Component);

Circle.propTypes = {
    strokeColorSelected: _react2.default.PropTypes.string,
    strokeColorHovered: _react2.default.PropTypes.string,
    selected: _react2.default.PropTypes.bool,
    onContextMenu: _react2.default.PropTypes.func,
    onTouchStart: _react2.default.PropTypes.func
};
Circle.defaultProps = {
    strokeColorSelected: 'white',
    strokeColorHovered: 'white',
    selected: false,
    onContextMenu: function onContextMenu() {},
    onTouchStart: function onTouchStart() {}
};