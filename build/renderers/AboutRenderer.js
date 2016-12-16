'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AboutRenderer = function (_Component) {
    _inherits(AboutRenderer, _Component);

    function AboutRenderer() {
        _classCallCheck(this, AboutRenderer);

        return _possibleConstructorReturn(this, (AboutRenderer.__proto__ || Object.getPrototypeOf(AboutRenderer)).apply(this, arguments));
    }

    _createClass(AboutRenderer, [{
        key: 'render',
        value: function render() {
            var data = this.props.data;

            return _react2.default.createElement(
                'div',
                { key: data.key, id: data.id, className: 'about-menu-item' },
                _react2.default.createElement(
                    'div',
                    { className: 'about-menu-item-title' },
                    'This application is created using ReactJS and Raycast.',
                    _react2.default.createElement('br', null)
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'about-menu-item-library' },
                    _react2.default.createElement(
                        'a',
                        { href: data.reactUrl, target: '_blank' },
                        'React'
                    ),
                    ' is a Javascript library for building user interfaces.'
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'about-menu-item-library' },
                    _react2.default.createElement(
                        'a',
                        { href: data.raycastUrl, target: '_blank' },
                        'Raycast'
                    ),
                    ' is an event framework based on emitting rays onto the user interface.'
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'about-menu-item-copyright' },
                    _react2.default.createElement(
                        'a',
                        { href: data.copyrightUrl, target: '_blank' },
                        _react2.default.createElement('i', { className: 'fa fa-copyright' }),
                        '\xA0',
                        data.copyright
                    )
                )
            );
        }
    }]);

    return AboutRenderer;
}(_react.Component);

exports.default = AboutRenderer;