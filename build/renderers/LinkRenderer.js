'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Dom = require('./../util/Dom');

var _Dom2 = _interopRequireDefault(_Dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var classnames = require('classnames');

var DEFAULT_URL = '#',
    DEFAULT_TARGET = '_self';

var LinkRenderer = function (_Component) {
    _inherits(LinkRenderer, _Component);

    function LinkRenderer() {
        _classCallCheck(this, LinkRenderer);

        return _possibleConstructorReturn(this, (LinkRenderer.__proto__ || Object.getPrototypeOf(LinkRenderer)).apply(this, arguments));
    }

    _createClass(LinkRenderer, [{
        key: 'render',
        value: function render() {
            var className = classnames(this.props.className, _Dom2.default.buildClassNames(this.props.classPrefix, ['menu-item-link'])),
                data = this.props.data;

            return _react2.default.createElement(
                'div',
                { key: data.key, id: data.id, className: className },
                _react2.default.createElement(
                    'a',
                    { href: data.url || DEFAULT_URL, target: data.target || DEFAULT_TARGET },
                    data.title
                )
            );
        }
    }]);

    return LinkRenderer;
}(_react.Component);

exports.default = LinkRenderer;