'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CIRCLE_ID_PREFIX = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CIRCLE_ID_PREFIX = exports.CIRCLE_ID_PREFIX = 'circle-';

var Circle = function (_Component) {
    _inherits(Circle, _Component);

    function Circle() {
        _classCallCheck(this, Circle);

        return _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).apply(this, arguments));
    }

    _createClass(Circle, [{
        key: 'render',
        value: function render() {
            var isHovered = this.props.hovered,
                shouldShowLine = isHovered || this.props.selected,
                config = {
                cx: this.props.x,
                cy: this.props.y,
                r: this.props.r,
                fill: this.props.color,
                strokeWidth: shouldShowLine ? 5 : 0,
                stroke: isHovered ? this.props.strokeColorHovered : this.props.strokeColorSelected
            };

            return _react2.default.createElement('circle', _extends({}, config, {
                id: this.props.id }));
        }
    }]);

    return Circle;
}(_react.Component);

exports.default = Circle;


Circle.propTypes = {
    id: _react2.default.PropTypes.string.isRequired,
    strokeColorSelected: _react2.default.PropTypes.string,
    strokeColorHovered: _react2.default.PropTypes.string,
    selected: _react2.default.PropTypes.bool,
    hovered: _react2.default.PropTypes.bool
};
Circle.defaultProps = {
    strokeColorSelected: 'white',
    strokeColorHovered: 'white',
    selected: false,
    hovered: false
};