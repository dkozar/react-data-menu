'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DropdownMenu = require('./DropdownMenu.js');

var _DropdownMenu2 = _interopRequireDefault(_DropdownMenu);

var _items = require('./../data/items1.js');

var _items2 = require('./../data/items2.js');

var _aboutItems = require('./../data/aboutItems.js');

var _AboutRenderer = require('./../renderers/AboutRenderer.js');

var _AboutRenderer2 = _interopRequireDefault(_AboutRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BottomToolbar = function (_Component) {
    _inherits(BottomToolbar, _Component);

    function BottomToolbar() {
        _classCallCheck(this, BottomToolbar);

        return _possibleConstructorReturn(this, (BottomToolbar.__proto__ || Object.getPrototypeOf(BottomToolbar)).apply(this, arguments));
    }

    _createClass(BottomToolbar, [{
        key: 'render',
        value: function render() {
            var hints = function hints() {
                return ['ne'];
            },
                renderers = {
                'about': _AboutRenderer2.default
            };

            /* Bottom toolbar - let's not toggle these buttons */
            return _react2.default.createElement(
                'div',
                { className: 'toolbar toolbar-bottom' },
                _react2.default.createElement(
                    _DropdownMenu2.default,
                    _extends({ items: _items.items1 }, this.props, { toggleMode: false }),
                    _react2.default.createElement(
                        'button',
                        { className: 'menu-button' },
                        'Menu 4'
                    )
                ),
                _react2.default.createElement(_DropdownMenu2.default, _extends({ buttonText: 'Menu 5', items: _items2.items2 }, this.props, { toggleMode: false })),
                _react2.default.createElement(_DropdownMenu2.default, _extends({ buttonText: 'Menu 6', items: _items2.items2 }, this.props, { toggleMode: false })),
                _react2.default.createElement(
                    _DropdownMenu2.default,
                    {
                        items: _aboutItems.aboutItems,
                        classPrefix: 'about-',
                        toggleMode: false,
                        openOnMouseOver: true,
                        closeOnMouseOut: false,
                        mouseEnterDelay: 500,
                        mouseLeaveDelay: 2000,
                        hints: hints,
                        renderers: renderers },
                    _react2.default.createElement(
                        'button',
                        { className: 'menu-button' },
                        _react2.default.createElement('i', { className: 'fa fa-info-circle' })
                    )
                )
            );
        }
    }]);

    return BottomToolbar;
}(_react.Component);

exports.default = BottomToolbar;


BottomToolbar.propTypes = {
    onOpen: _react2.default.PropTypes.func.isRequired,
    openOnMouseOver: _react2.default.PropTypes.bool.isRequired
};