'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DropdownMenu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Dom = require('./../util/Dom');

var _Menu = require('./Menu');

var _MenuEventDispatcher = require('./../util/MenuEventDispatcher.js');

var _MenuEventDispatcher2 = _interopRequireDefault(_MenuEventDispatcher);

var _Aligner = require('./../util/Aligner.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var classnames = require('classnames');

var MOUSE_ENTER_DELAY = 0,
    MOUSE_LEAVE_DELAY = 1000,
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
        _this.onButtonTouchStart = _this.onButtonTouchStart.bind(_this);
        _this.onButtonMouseEnter = _this.onButtonMouseEnter.bind(_this);
        _this.onButtonMouseLeave = _this.onButtonMouseLeave.bind(_this);
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
            // if we're in toggle mode, register button as a toggle part,
            // clicking or tapping the toggle parts produces 'onClickOutside' (so if the menu is open, clicking the button will close it)
            // however, tap-and-hold won't produce 'onContextMenu' (which would close the menu)
            _MenuEventDispatcher2.default.getInstance().registerPart(this.buttonElement, this.props.toggleMode);
            this.props.onOpen();
        }
    }, {
        key: 'onClose',
        value: function onClose() {
            // if the menu is closed by (this) dropdown menu, isOpen is already false
            // we don't want to go circular, so short circuit here
            if (this.state.isOpen) {
                this.hideMenu();
                this.props.onClose();
            }
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
    }, {
        key: 'tryCloseMenu',
        value: function tryCloseMenu() {
            if (this.state.isOpen) {
                this.hideMenu();
            }
        }

        //<editor-fold desc="Button handlers">

    }, {
        key: 'onButtonClick',
        value: function onButtonClick() {
            this.tryOpenMenu();
        }
    }, {
        key: 'onButtonTouchStart',
        value: function onButtonTouchStart(e) {
            this.tryOpenMenu();
            e.preventDefault();
            e.stopPropagation();
        }
    }, {
        key: 'onButtonMouseEnter',
        value: function onButtonMouseEnter() {
            if (this.props.openOnMouseOver) {
                _lodash2.default.delay(this.tryOpenMenu.bind(this), this.props.mouseEnterDelay);
            }
        }
    }, {
        key: 'onButtonMouseLeave',
        value: function onButtonMouseLeave() {
            if (this.props.closeOnMouseOut) {
                _lodash2.default.delay(this.tryCloseMenu.bind(this), this.props.mouseLeaveDelay);
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
            var className = classnames('', _Dom.Dom.buildClassNames(this.props.classPrefix, ['menu-button'])),
                children = this.props.children || _react2.default.createElement(
                'button',
                { ref: 'button', className: className },
                this.props.buttonText
            ),
                self = this;

            return _react2.default.Children.map(children, function (child) {
                return _react2.default.cloneElement(child, {
                    ref: 'button',
                    onClick: self.onButtonClick,
                    onTouchStart: self.onButtonTouchStart,
                    onContextMenu: self.onButtonContextMenu,
                    onMouseEnter: self.onButtonMouseEnter,
                    onMouseLeave: self.onButtonMouseLeave
                });
            }.bind(this));
        }
    }, {
        key: 'render',
        value: function render() {
            var buttonClassName = classnames(this.props.className, _Dom.Dom.buildClassNames(this.props.classPrefix, ['drop-down'])),
                menu = this.state.isOpen ? _react2.default.createElement(_Menu.Menu, {
                classPrefix: this.props.classPrefix,
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
                { className: buttonClassName },
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
    classPrefix: _react2.default.PropTypes.string, // CSS class prefix for all the classes used by this dropdown menu
    buttonText: _react2.default.PropTypes.string, // the text of the default button
    toggleMode: _react2.default.PropTypes.bool.isRequired, // should menu be toggled (opened/closed) by clicking the button // TODO
    openOnMouseOver: _react2.default.PropTypes.bool.isRequired, // should menu be opened on mouse over (Mac menu is opened on first *click*)
    closeOnMouseOut: _react2.default.PropTypes.bool.isRequired, // should menu be closed on mouse over
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
    classPrefix: '',
    buttonText: '- Menu -',
    openOnMouseOver: false,
    closeOnMouseOut: false,
    toggleMode: true, // TODO
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