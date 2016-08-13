'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DropdownMenu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Menu = require('./Menu');

var _Aligner = require('./../util/Aligner.js');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MOUSE_ENTER_DELAY = 500,
    MOUSE_LEAVE_DELAY = 100,
    ALIGNER = _Aligner.Aligner,
    HINTS = function HINTS(depth) {
    // default hints. Could be overridden via props
    return !depth ? ['ss', 'se', 'sm', 'ns', 'ne', 'nm'] : // zero depth (first menu popup)
    ['es', 'em', 'ee', 'ws', 'wm', 'we']; // all the others
};

var DropdownMenu = exports.DropdownMenu = function (_Component) {
    _inherits(DropdownMenu, _Component);

    function DropdownMenu(props) {
        _classCallCheck(this, DropdownMenu);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DropdownMenu).call(this, props));

        _this.onButtonClick = _this.onButtonClick.bind(_this);
        _this.onButtonMouseEnter = _this.onButtonMouseEnter.bind(_this);
        _this.onOpen = _this.onOpen.bind(_this);
        _this.onClose = _this.onClose.bind(_this);
        _this.setMenuVisibility = _this.setMenuVisibility.bind(_this);
        _this.hideMenu = _this.hideMenu.bind(_this);

        _this.state = {
            isOpen: false
        };
        return _this;
    }

    _createClass(DropdownMenu, [{
        key: 'onOpen',
        value: function onOpen() {
            this.props.onOpen();
        }
    }, {
        key: 'onClose',
        value: function onClose() {
            this.hideMenu();
            this.props.onClose();
        }
    }, {
        key: 'hideMenu',
        value: function hideMenu() {
            var self = this;

            _lodash2.default.defer(function () {
                // we're deferring the hiding of the menu, so on close it doesn't go through the open->close->open transition
                self.setMenuVisibility(false);
            });
        }
    }, {
        key: 'setMenuVisibility',
        value: function setMenuVisibility(visible) {
            this.setState({
                isOpen: visible
            });
        }
    }, {
        key: 'tryOpenMenu',
        value: function tryOpenMenu() {
            if (!this.state.isOpen) {
                // open only if currently closed
                this.setMenuVisibility(true);
            }
            // else do nothing. If the menu is already open, it will close we'were clicking away from it.
        }

        //<editor-fold desc="Button handlers">

    }, {
        key: 'onButtonClick',
        value: function onButtonClick() {
            this.tryOpenMenu();
        }
    }, {
        key: 'onButtonMouseEnter',
        value: function onButtonMouseEnter() {
            if (this.props.openOnMouseOver) {
                this.tryOpenMenu();
            }
        }
    }, {
        key: 'onButtonContextMenu',
        value: function onButtonContextMenu(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        //</editor-fold>

        //<editor-fold desc="Rendering">

    }, {
        key: 'renderButton',
        value: function renderButton() {
            // render a child passed from the outside, or a default button
            var children = this.props.children || _react2.default.createElement(
                'button',
                { ref: 'button', className: 'menu-button' },
                this.props.buttonText
            ),
                self = this;

            return _react2.default.Children.map(children, function (child) {
                return _react2.default.cloneElement(child, {
                    ref: 'button',
                    onClick: self.onButtonClick,
                    onContextMenu: self.onButtonContextMenu,
                    onMouseEnter: self.onButtonMouseEnter
                });
            }.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            var menu = this.state.isOpen ? _react2.default.createElement(_Menu.Menu, {
                onOpen: this.onOpen,
                onClose: this.onClose,
                onItemMouseEnter: this.props.onItemMouseEnter,
                onItemMouseLeave: this.props.onItemMouseLeave,
                onItemClick: this.props.onItemClick,
                aligner: this.props.aligner,
                alignTo: this.buttonElement,
                hints: this.props.hints,
                items: this.props.items,
                autoCloseOtherMenuInstances: this.props.autoCloseOtherMenuInstances,
                renderers: this.props.renderers,
                mouseEnterDelay: this.props.mouseEnterDelay,
                mouseLeaveDelay: this.props.mouseLeaveDelay
            }) : null;

            return _react2.default.createElement(
                'div',
                { className: 'drop-down ' + this.props.className },
                this.renderButton(),
                menu
            );
        }
        //</editor-fold>

    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.buttonElement = _reactDom2.default.findDOMNode(this.refs.button);
        }
    }]);

    return DropdownMenu;
}(_react.Component);

DropdownMenu.propTypes = {
    buttonText: _react2.default.PropTypes.string, // the text of the default button
    openOnMouseOver: _react2.default.PropTypes.bool.isRequired, // should menu be opened on mouse over (Mac menu is opened on first click)
    items: _react2.default.PropTypes.array.isRequired, // menu items (data)
    autoCloseOtherMenuInstances: _react2.default.PropTypes.bool.isRequired,
    mouseEnterDelay: _react2.default.PropTypes.number,
    mouseLeaveDelay: _react2.default.PropTypes.number,
    hints: _react2.default.PropTypes.func.isRequired,
    onOpen: _react2.default.PropTypes.func, // custom open handler
    onClose: _react2.default.PropTypes.func, // custom close handler
    onItemMouseEnter: _react2.default.PropTypes.func, // custom item mouse enter handler
    onItemMouseLeave: _react2.default.PropTypes.func, // custom item mouse leave handler
    onItemClick: _react2.default.PropTypes.func // custom item click handler
};
DropdownMenu.defaultProps = {
    buttonText: '- Menu -',
    openOnMouseOver: false,
    items: [],
    aligner: new ALIGNER(),
    autoCloseOtherMenuInstances: true,
    mouseEnterDelay: MOUSE_ENTER_DELAY,
    mouseLeaveDelay: MOUSE_LEAVE_DELAY,
    hints: HINTS,
    onOpen: function onOpen() {},
    onClose: function onClose() {},
    onItemMouseEnter: function onItemMouseEnter() {},
    onItemMouseLeave: function onItemMouseLeave() {},
    onItemClick: function onItemClick() {}
};