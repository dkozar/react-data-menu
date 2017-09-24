'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.App = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _AppMenuItems = require('./data/AppMenuItems.js');

var _AppMenuItems2 = _interopRequireDefault(_AppMenuItems);

var _BottomToolbar = require('./components/BottomToolbar.js');

var _BottomToolbar2 = _interopRequireDefault(_BottomToolbar);

var _Circle = require('./components/Circle.js');

var _Circle2 = _interopRequireDefault(_Circle);

var _CircleMenuItems = require('./data/CircleMenuItems.js');

var _CircleMenuItems2 = _interopRequireDefault(_CircleMenuItems);

var _CircleOps = require('./util/CircleOps.js');

var _CircleOps2 = _interopRequireDefault(_CircleOps);

var _LinkRenderer = require('./renderers/LinkRenderer.js');

var _LinkRenderer2 = _interopRequireDefault(_LinkRenderer);

var _Menu = require('./components/Menu.js');

var _Menu2 = _interopRequireDefault(_Menu);

var _MenuEmitter = require('./emitters/MenuEmitter.js');

var _MenuEmitter2 = _interopRequireDefault(_MenuEmitter);

var _Svg = require('./components/Svg.js');

var _Svg2 = _interopRequireDefault(_Svg);

var _TextRotator = require('./components/TextRotator.js');

var _TextRotator2 = _interopRequireDefault(_TextRotator);

var _TopToolbar = require('./components/TopToolbar.js');

var _TopToolbar2 = _interopRequireDefault(_TopToolbar);

var _Colors = require('./util/Colors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Emitter = require('raycast-dom').Emitter.default;

require('./styles/main.less');
require('./styles/menu.less');

var rootNode, canvasNode;

//<editor-fold desc="Helper functions">
function isCircle(target) {
    return target.id.startsWith('circle');
}

function getCircleId(circleElement) {
    return parseInt(circleElement.id.split('-')[1]);
}
//</editor-fold>

var App = exports.App = function (_Component) {
    _inherits(App, _Component);

    //<editor-fold desc="Constructor">
    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.state = {
            contextMenuVisible: false,
            openOnMouseOver: false, // if true, drop-down menu will open on mouse over
            circles: [{
                x: 200, y: 200, r: 100, color: _Colors.PURPLE
            }, {
                x: 800, y: 500, r: 150, color: _Colors.ORANGE
            }],
            hoveredCircleIndex: -1,
            selectedCircleIndex: -1
        };

        _this.onMenuClose = _this.onMenuClose.bind(_this);
        _this.onMouseDownInsideOrOutside = _this.onMouseDownInsideOrOutside.bind(_this);
        _this.onContextMenuOutside = _this.onContextMenuOutside.bind(_this);
        _this.executeCommand = _this.executeCommand.bind(_this);

        // 1. Raycast Emitter subscription
        Emitter.getInstance().connect({
            onMouseOver: _this.onMouseOver.bind(_this), // circle mouse over
            onMouseOut: _this.onMouseOut.bind(_this), // circle mouse out
            onMouseMove: _this.onMouseMove.bind(_this), // drawing circles with Alt key
            onMouseDown: _this.onMouseDown.bind(_this), // drawing circles with Alt key
            onMouseUp: _this.onMouseUp.bind(_this) // stop drawing circles with Alt key
        });

        // 2. MenuEmitter subscription
        _MenuEmitter2.default.getInstance().connect({
            onContextMenuOutside: _this.onContextMenuOutside, // show context menu
            onMouseDownOutside: _this.onMouseDownInsideOrOutside, // flip openOnMouseOver state
            onMouseDownInside: _this.onMouseDownInsideOrOutside, // flip openOnMouseOver state
            onMouseUpInside: _this.onMouseUpInside.bind(_this) // flip openOnMouseOver state
        });
        return _this;
    }
    //</editor-fold>

    //<editor-fold desc="Raycast">


    _createClass(App, [{
        key: 'onMouseOver',
        value: function onMouseOver(ray) {
            var circle = ray.intersectsId(_Circle.CIRCLE_ID_PREFIX),
                circleId,
                circleIndex;

            if (circle) {
                // circle mouse over
                circleId = circle.id;
                circleIndex = parseInt(circleId.split(_Circle.CIRCLE_ID_PREFIX)[1]);
                this.setState({
                    hoveredCircleIndex: circleIndex
                });
            }
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut(ray) {
            var circle = ray.intersectsId(_Circle.CIRCLE_ID_PREFIX);

            if (circle) {
                // circle mouse over
                this.setState({
                    hoveredCircleIndex: -1
                });
            }
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(ray) {
            var self = this;

            if (!ray.intersects(canvasNode)) {
                return;
            }

            this.setState({
                mouseIsDown: true,
                mousePosition: ray.position
            }, function () {
                if (ray.e.altKey) {
                    if (ray.e.shiftKey) {
                        self.executeCommand('clear'); // Alt + Shift + click = clear
                    } else if (ray.intersects(canvasNode)) {
                        self.executeCommand('new-circle'); // Alt + click = new circle
                    }
                }
            });
        }
    }, {
        key: 'onMouseUp',
        value: function onMouseUp() {
            this.setState({
                mouseIsDown: false
            });
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(ray) {
            var self = this;

            if (!ray.e.altKey || !this.state.mouseIsDown || !ray.intersects(canvasNode)) {
                return;
            }

            this.setState({
                mousePosition: ray.position
            }, function () {
                self.executeCommand('new-circle'); // Alt + mouse move = new circle
            });
        }
    }, {
        key: 'onMouseDownInsideOrOutside',
        value: function onMouseDownInsideOrOutside() {
            this.setState({
                openOnMouseOver: false
            });
        }
    }, {
        key: 'onMouseUpInside',
        value: function onMouseUpInside() {
            this.setState({
                openOnMouseOver: false
            });
        }

        /**
         * Fires on contextmenu or tap-and-hold outside of the current menu
         * @param ray Ray
         */

    }, {
        key: 'onContextMenuOutside',
        value: function onContextMenuOutside(ray) {
            var target = ray.target;

            this.setState({
                openOnMouseOver: false
            });

            if (ray.intersects(rootNode)) {
                // cancel default on the app root (not the web page - GitHub link must work)
                ray.preventDefault();
            }

            if (!ray.intersects(canvasNode)) {
                return; // we're interested only in canvas clicks
            }

            // cancel default menu on canvas
            ray.preventDefault();

            if (isCircle(target)) {
                // circle clicked
                this.selectCircle(target);
                this.showContextMenu(ray, this.circleContextMenuItems);
            } else {
                // canvas clicked
                this.setState({
                    selectedCircleIndex: -1
                });
                this.showContextMenu(ray, this.appContextMenuItems);
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
                selectedCircleIndex: -1
            });
        }
        //</editor-fold>

        //<editor-fold desc="Show context menu">

    }, {
        key: 'showContextMenu',
        value: function showContextMenu(ray, items) {
            this.setState({
                contextMenuVisible: true,
                menuPosition: ray.position,
                items: items
            });
        }
        //</editor-fold>

        //<editor-fold desc="Circles & commands">

    }, {
        key: 'selectCircle',
        value: function selectCircle(circleElement) {
            this.state.selectedCircleIndex = getCircleId(circleElement);
        }
    }, {
        key: 'executeCommand',
        value: function executeCommand(command) {
            var position = this.state.mouseIsDown ? this.state.mousePosition : this.state.menuPosition,
                circles = _CircleOps2.default.executeCommand(command, this.state.circles, this.state.selectedCircleIndex, position);

            this.setState({ circles: circles });
        }
        //</editor-fold>

        //<editor-fold desc="React">

    }, {
        key: 'render',
        value: function render() {
            var self = this,
                index = 0,
                commonToolbarProps = {
                openOnMouseOver: this.state.openOnMouseOver,
                renderers: {
                    'link': _LinkRenderer2.default
                },
                onOpen: function onOpen() {
                    self.setState({
                        // let's have the Mac-like behaviour
                        // once the first drop-down was opened by clicking, consequent drop-downs open on mouse-over
                        openOnMouseOver: true
                    });
                }
            },
                circles = this.state.circles.map(function (item) {
                var id = _Circle.CIRCLE_ID_PREFIX + index,
                    circle = _react2.default.createElement(_Circle2.default, _extends({}, item, {
                    id: id,
                    key: id,
                    strokeColor: 'white',
                    hovered: self.state.hoveredCircleIndex === index,
                    selected: self.state.selectedCircleIndex === index }));

                index++;
                return circle;
            }),
                menu = this.state.contextMenuVisible ? _react2.default.createElement(_Menu2.default, { items: this.state.items,
                position: this.state.menuPosition,
                onClose: this.onMenuClose }) : null;

            return _react2.default.createElement(
                'div',
                { ref: 'root' },
                _react2.default.createElement(_TopToolbar2.default, commonToolbarProps),
                _react2.default.createElement(
                    'div',
                    { ref: 'canvas', className: 'container' },
                    _react2.default.createElement(
                        _Svg2.default,
                        { width: '100%', height: '100%' },
                        circles
                    ),
                    _react2.default.createElement(_TextRotator2.default, null)
                ),
                menu,
                _react2.default.createElement(_BottomToolbar2.default, commonToolbarProps)
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
            this.circleContextMenuItems = new _CircleMenuItems2.default(binder);
            this.appContextMenuItems = new _AppMenuItems2.default(binder);

            rootNode = _reactDom2.default.findDOMNode(this.refs.root);
            canvasNode = _reactDom2.default.findDOMNode(this.refs.canvas);
        }
        //</editor-fold>

    }]);

    return App;
}(_react.Component);