'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.App = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Dom = require('./util/Dom');

var _DomRoute = require('./util/DomRoute');

var _DropdownMenu = require('./components/DropdownMenu.js');

var _Svg = require('./components/Svg.js');

var _TextRotator = require('./components/TextRotator.js');

var _AppMenuItems = require('./data/AppMenuItems.js');

var _Circle = require('./components/Circle.js');

var _CircleMenuItems = require('./data/CircleMenuItems.js');

var _Menu = require('./components/Menu.js');

var _items = require('./data/items1.js');

var _items2 = require('./data/items2.js');

var _helpItems = require('./data/helpItems.js');

var _LinkRenderer = require('./renderers/LinkRenderer.js');

var _HelpRenderer = require('./renderers/HelpRenderer.js');

var _MenuEventDispatcher = require('./util/MenuEventDispatcher.js');

var _MenuEventDispatcher2 = _interopRequireDefault(_MenuEventDispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./styles/main.css');
require('./styles/menu.css');

var TOOLBAR_HEIGHT = 82,
    PURPLE = '#5943aa',
    ORANGE = '#ff7c35',
    RED = '#e31d65',
    YELLOW = '#ffcc00',
    COLORS = [PURPLE, ORANGE, RED, YELLOW];

var canvasElement;

//<editor-fold desc="Helper functions">
function isCanvasElement(route) {
    return route.contains(canvasElement);
}

function isCircle(target) {
    return isCanvasElement && target.id.startsWith('circle');
}
//</editor-fold>

var App = exports.App = function (_Component) {
    _inherits(App, _Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));

        _this.state = {
            contextMenuVisible: false,
            openOnMouseOver: false,
            circles: [{
                x: 200, y: 200, r: 100, color: PURPLE
            }, {
                x: 800, y: 500, r: 150, color: ORANGE
            }],
            current: -1
        };

        _this.onMenuClose = _this.onMenuClose.bind(_this);
        _this.onClickOutside = _this.onClickOutside.bind(_this);
        _this.onContextMenu = _this.onContextMenu.bind(_this);
        _this.executeCommand = _this.executeCommand.bind(_this);

        // subscribing to menu event dispatcher
        _MenuEventDispatcher2.default.getInstance().connect({
            onClickOutside: _this.onClickOutside,
            onContextMenu: _this.onContextMenu
        });
        return _this;
    }

    //<editor-fold desc="Handlers">
    /**
     * Fires when clicked outside of the current menu
     */


    _createClass(App, [{
        key: 'onClickOutside',
        value: function onClickOutside() {
            this.setState({
                openOnMouseOver: false
            });
        }

        /**
         * Fires on contextmenu or tap-and-hold
         * @param e
         * @param position
         * @param route DomRoute
         */

    }, {
        key: 'onContextMenu',
        value: function onContextMenu(e, position, route) {
            //var target = route.getTarget();
            var target = e.target;

            this.setState({
                openOnMouseOver: false
            });

            if (!isCanvasElement(route)) {
                return; // we're interested only in canvas clicks
            }
            if (isCircle(target)) {
                // circle clicked
                this.selectCircle(target);
                this.showContextMenu(e, position, this.circleMenuItems);
            } else {
                // background clicked
                this.setState({
                    current: -1
                });
                this.showContextMenu(e, position, this.appMenuItems);
            }
        }

        /**
         * Fires on menu close
         * We would accomplish the same effect by subscribing to dispatched directly, instead of the Menu
         */

    }, {
        key: 'onMenuClose',
        value: function onMenuClose() {
            this.setState({
                contextMenuVisible: false,
                current: -1
            });
        }
        //</editor-fold>

        //<editor-fold desc="Show/hide menu">

    }, {
        key: 'showContextMenu',
        value: function showContextMenu(e, position, items) {
            var self = this;

            e.preventDefault();
            e.stopPropagation();

            self.setState({
                contextMenuVisible: true,
                menuPosition: position,
                items: items
            });
        }
        //</editor-fold>

        //<editor-fold desc="Circles & commands">

    }, {
        key: 'executeCommand',
        value: function executeCommand(command) {
            var circles = this.state.circles,
                current = this.state.current,
                circle = circles[current],
                transformed = false;

            switch (command) {
                case 'increase-x':
                    circle.x += 10;
                    transformed = true;
                    break;
                case 'decrease-x':
                    circle.x -= 10;
                    transformed = true;
                    break;
                case 'increase-y':
                    circle.y += 10;
                    transformed = true;
                    break;
                case 'decrease-y':
                    circle.y -= 10;
                    transformed = true;
                    break;
                case 'increase-r':
                    circle.r += 10;
                    transformed = true;
                    break;
                case 'decrease-r':
                    circle.r -= 10;
                    transformed = true;
                    break;
                case 'bring-to-front':
                    this.bringToTop(circles, circle, current);
                    break;
                case 'send-to-back':
                    this.sendToBack(circles, circle, current);
                    break;
                case 'new-circle':
                    this.newCircle(circles);
                    break;
                case 'remove-circle':
                    this.removeCircle(circles, current);
                    break;
                case 'clear':
                    this.clear(circles);
                    break;
            }

            if (transformed) {
                circle.x = Math.max(circle.x, 10);
                circle.y = Math.max(circle.y, 10);
                circle.r = Math.max(circle.r, 10);
            }

            this.setState({ circles: circles });
        }
    }, {
        key: 'selectCircle',
        value: function selectCircle(circleElement) {
            var circleIndex = parseInt(circleElement.id.split('-')[1]);

            this.state.current = circleIndex;
        }
    }, {
        key: 'bringToTop',
        value: function bringToTop(circles, circle, current) {
            circles.splice(current, 1);
            circles.push(circle);
        }
    }, {
        key: 'sendToBack',
        value: function sendToBack(circles, circle, current) {
            circles.splice(current, 1);
            circles.unshift(circle);
        }
    }, {
        key: 'newCircle',
        value: function newCircle(circles) {
            var pos = this.state.menuPosition,
                r = Math.floor(Math.random() * 150) + 50,
                color = COLORS[Math.floor(Math.random() * COLORS.length)],
                circle = {
                x: pos.x, y: pos.y - TOOLBAR_HEIGHT, r: r, color: color
            };

            circles.push(circle);
        }
    }, {
        key: 'removeCircle',
        value: function removeCircle(circles, current) {
            circles.splice(current, 1);
        }
    }, {
        key: 'clear',
        value: function clear(circles) {
            circles.splice(0, circles.length);
        }
        //</editor-fold>

    }, {
        key: 'render',
        value: function render() {
            var self = this,
                index = 0,
                menu = this.state.contextMenuVisible ? _react2.default.createElement(_Menu.Menu, { items: this.state.items,
                position: this.state.menuPosition,
                onClose: this.onMenuClose }) : null,
                circles = this.state.circles.map(function (circle) {
                var circle = _react2.default.createElement(_Circle.Circle, _extends({}, circle, { id: 'circle-' + index, key: 'circle-' + index, strokeColor: 'white',
                    selected: self.state.current === index }));

                index++;
                return circle;
            }),
                renderers = {
                'link': _LinkRenderer.LinkRenderer
            },
                common = {
                openOnMouseOver: this.state.openOnMouseOver,
                renderers: renderers,
                onOpen: function onOpen() {
                    self.setState({
                        openOnMouseOver: true // let's have the Mac-like behaviour. Once the first dropdown is open by clicking, consequent open on mouse-over.
                    });
                }
            };

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'toolbar' },
                    _react2.default.createElement(_DropdownMenu.DropdownMenu, _extends({ buttonText: 'React Data Menu', items: _items.items1 }, common)),
                    _react2.default.createElement(_DropdownMenu.DropdownMenu, _extends({ buttonText: 'Menu 1', items: _items2.items2 }, common)),
                    _react2.default.createElement(_DropdownMenu.DropdownMenu, _extends({ buttonText: 'Menu 2', items: _items2.items2 }, common)),
                    _react2.default.createElement(_DropdownMenu.DropdownMenu, _extends({ buttonText: 'Menu 3', items: _items2.items2 }, common))
                ),
                _react2.default.createElement(
                    'div',
                    { ref: 'canvas', className: 'container' },
                    _react2.default.createElement(
                        _Svg.Svg,
                        { width: '100%', height: '100%' },
                        circles
                    ),
                    _react2.default.createElement(_TextRotator.TextRotator, null)
                ),
                menu,
                _react2.default.createElement(
                    'div',
                    { className: 'toolbar toolbar-bottom' },
                    _react2.default.createElement(
                        _DropdownMenu.DropdownMenu,
                        _extends({ items: _items.items1 }, common, { toggleMode: false }),
                        _react2.default.createElement(
                            'button',
                            { className: 'menu-button' },
                            'Menu 4'
                        )
                    ),
                    _react2.default.createElement(_DropdownMenu.DropdownMenu, _extends({ buttonText: 'Menu 5', items: _items2.items2 }, common, { toggleMode: false })),
                    _react2.default.createElement(_DropdownMenu.DropdownMenu, _extends({ buttonText: 'Menu 6', items: _items2.items2 }, common, { toggleMode: false })),
                    _react2.default.createElement(
                        _DropdownMenu.DropdownMenu,
                        {
                            items: _helpItems.helpItems,
                            className: 'about',
                            classPrefix: 'help-',
                            toggleMode: false,
                            openOnMouseOver: true,
                            closeOnMouseOut: false,
                            mouseEnterDelay: 500,
                            mouseLeaveDelay: 2000,
                            hints: function hints() {
                                return ['ne'];
                            },
                            renderers: {
                                'help': _HelpRenderer.HelpRenderer
                            } },
                        _react2.default.createElement(
                            'button',
                            { className: 'menu-button' },
                            '?'
                        )
                    )
                )
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var self = this;

            function binder() {
                var _self$executeCommand;

                return (_self$executeCommand = self.executeCommand).bind.apply(_self$executeCommand, [self].concat(Array.prototype.slice.call(arguments)));
            }
            this.circleMenuItems = new _CircleMenuItems.CircleMenuItems(binder);
            this.appMenuItems = new _AppMenuItems.AppMenuItems(binder);

            canvasElement = _reactDom2.default.findDOMNode(this.refs.canvas);
        }
    }]);

    return App;
}(_react.Component);