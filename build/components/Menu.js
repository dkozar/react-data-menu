'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.POPUP_ID_PREFIX = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Aligner = require('./../util/Aligner.js');

var _Aligner2 = _interopRequireDefault(_Aligner);

var _defaultRenderers = require('./../renderers/defaultRenderers.js');

var _Dom = require('./../util/Dom');

var _Dom2 = _interopRequireDefault(_Dom);

var _hoverData = require('./../util/hoverData');

var _hoverData2 = _interopRequireDefault(_hoverData);

var _hoverDataBuilder = require('./../util/hoverDataBuilder');

var _hoverDataBuilder2 = _interopRequireDefault(_hoverDataBuilder);

var _MenuEmitter = require('./../emitters/MenuEmitter.js');

var _MenuEmitter2 = _interopRequireDefault(_MenuEmitter);

var _MenuItemFactory = require('./MenuItemFactory.js');

var _MenuItemFactory2 = _interopRequireDefault(_MenuItemFactory);

var _MenuPopup = require('./MenuPopup');

var _MenuPopup2 = _interopRequireDefault(_MenuPopup);

var _MenuPopupFactory = require('./MenuPopupFactory.js');

var _MenuPopupFactory2 = _interopRequireDefault(_MenuPopupFactory);

var _reactLiberator = require('react-liberator');

var _reactLiberator2 = _interopRequireDefault(_reactLiberator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var POPUP_ID_PREFIX = exports.POPUP_ID_PREFIX = 'menu-popup-';

var DEFAULT_LAYER_ID = 'react-data-menu-popup',
    MOUSE_LEAVE_DELAY = 100,
    MOUSE_ENTER_DELAY = 200,
    HINTS = function HINTS() {
    return ['es', 'em', 'ee', 'ws', 'wm', 'we'];
},
    ALIGN_TO = function ALIGN_TO(level) {
    return !level ? this.props.alignTo || this.props.position : this.currentHoverData ? this.currentHoverData.getElement() : null;
};

// references to all the open menu instances
// usually only the single instance, since by default we're allowing only a single menu on screen (we're auto-closing others)
var instances = [],
    layerElement;

var Menu = function (_Component) {
    _inherits(Menu, _Component);

    //<editor-fold desc="Constructor">
    function Menu(props) {
        _classCallCheck(this, Menu);

        var _this = _possibleConstructorReturn(this, (Menu.__proto__ || Object.getPrototypeOf(Menu)).call(this, props));

        _this.onItemClick = _this.onItemClick.bind(_this);
        _this.closeMenu = _this.closeMenu.bind(_this);
        _this.createPopup = _this.createPopup.bind(_this);
        _this.removeChildPopups = _this.removeChildPopups.bind(_this);
        _this.removePopups = _this.removePopups.bind(_this);

        // debouncing: we don't want the child popup to open/close immediately
        _this.processInActionDebounced = _lodash2.default.debounce(_this.processInAction.bind(_this), MOUSE_ENTER_DELAY);
        _this.processOutActionDebounced = _lodash2.default.debounce(_this.processOutAction.bind(_this), MOUSE_LEAVE_DELAY);

        _this.popupFactory = new _MenuPopupFactory2.default(_this.props.classPrefix);
        _this.itemFactory = new _MenuItemFactory2.default(_lodash2.default.assign(_defaultRenderers.DefaultRenderers, props.renderers), props.classPrefix);

        _this.state = {
            visible: false,
            expanded: false,
            popups: []
        };

        _this.currentHoverData = null;

        _this.handlers = {
            onMouseDownOutside: _this.onMouseDownOutside.bind(_this),
            onMouseUpInside: _this.onMouseUpInside.bind(_this),
            onContextMenuInside: _this.onContextMenuInside.bind(_this),
            onClose: _this.closeMenu,
            onMouseOver: _this.onMouseOver.bind(_this),
            onMouseOut: _this.onMouseOut.bind(_this),
            onTouchStart: _this.onTouchStart.bind(_this),
            onTouchEnd: _this.onTouchEnd.bind(_this),
            onTouchStartOutside: _this.onTouchStartOutside.bind(_this)
        };
        return _this;
    }
    //</editor-fold>

    //<editor-fold desc="Instance handling">
    /**
     * Only a single menu instance should be visible on screen
     * Instances do close on window click, however they might get instantiated by other means
     * (mouse-over the drop-down button etc.)
     */


    _createClass(Menu, [{
        key: 'closeOtherMenuInstances',
        value: function closeOtherMenuInstances() {
            var self = this;

            _lodash2.default.forEach(instances, function (instance) {
                if (instance !== self) {
                    instance.closeMenu();
                }
            });
        }

        /**
         * Removes this menu from instances array
         */

    }, {
        key: 'removeInstance',
        value: function removeInstance() {
            var self = this;

            _lodash2.default.remove(instances, function (instance) {
                return self === instance;
            });
        }
        //</editor-fold>

        //<editor-fold desc="Emitter subscribe / unsubscribe">
        /**
         * Event subscription
         * Happens when menu becomes visible
         */

    }, {
        key: 'connectToDispatcher',
        value: function connectToDispatcher() {
            _MenuEmitter2.default.getInstance().connect(this.handlers);
        }

        /**
         * Unsubscribing from events
         * Happens when menu becomes hidden
         */

    }, {
        key: 'disconnectFromDispatcher',
        value: function disconnectFromDispatcher() {
            _MenuEmitter2.default.getInstance().disconnect(this.handlers);
        }
        //</editor-fold>

        //<editor-fold desc="Raycast">
        /**
         * Fires on context menu inside of the menu
         * @param ray
         */

    }, {
        key: 'onContextMenuInside',
        value: function onContextMenuInside(ray) {
            ray.preventDefault(); // prevent default menu
        }
    }, {
        key: 'onMouseOver',
        value: function onMouseOver(ray) {
            var hoverData = _hoverDataBuilder2.default.build(this.state.popups, ray),
                popups;

            if (!hoverData) {
                return;
            }

            // keeping the selection
            // Note: the selection should be changed immediately, so the UI is snappy
            // however, we're calling the debounced action below, because the child popup should open with delay
            popups = this.state.popups;
            popups[hoverData.popupIndex].selectedIndex = hoverData.itemIndex;
            this.setState({
                popups: popups
            });

            this.processInActionDebounced(hoverData, false);
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut(ray) {
            var hoverData = _hoverDataBuilder2.default.build(this.state.popups, ray);

            if (hoverData) {
                this.processOutActionDebounced(hoverData);
            }
        }

        /**
         * Closes the menu if clicked outside of the menu
         */

    }, {
        key: 'onMouseDownOutside',
        value: function onMouseDownOutside() {
            this.closeMenu();
        }
    }, {
        key: 'onMouseUpInside',
        value: function onMouseUpInside(ray) {
            var hoverData = _hoverDataBuilder2.default.build(this.state.popups, ray);

            if (hoverData) {
                this.onItemClick(hoverData);
            }
        }
    }, {
        key: 'onTouchStart',
        value: function onTouchStart(ray) {
            var hoverData = _hoverDataBuilder2.default.build(this.state.popups, ray);

            if (hoverData) {
                this.processInAction(hoverData, false);
            }
        }
    }, {
        key: 'onTouchEnd',
        value: function onTouchEnd(ray) {
            var hoverData = _hoverDataBuilder2.default.build(this.state.popups, ray);

            if (hoverData) {
                this.onItemClick(hoverData);
            }
        }
    }, {
        key: 'onTouchStartOutside',
        value: function onTouchStartOutside(ray) {
            this.closeMenu();
        }
    }, {
        key: 'onItemClick',
        value: function onItemClick(hoverData) {
            var self = this;

            this.processInAction(hoverData, true);
            if (hoverData.isLeafNode() && !hoverData.isPersistant()) {
                // leaf node
                // defer and allow item handlers to be executed
                _lodash2.default.defer(function () {
                    self.closeMenu();
                });
            }
            this.props.onItemClick(hoverData);
        }
        //</editor-fold>

        //<editor-fold desc="Actions">
        /**
         * Shows/hides menu
         * @param visible
         */

    }, {
        key: 'setMenuVisibility',
        value: function setMenuVisibility(visible) {
            var visibilityChanging = this.state.visible !== visible,
                isOpening = visibilityChanging && visible,
                isClosing = visibilityChanging && !visible,
                self = this,
                popups;

            if (!visibilityChanging) {
                return;
            }

            if (isOpening) {
                popups = this.createPopup(this.props.items, true);
            } else if (isClosing) {
                popups = this.removePopups(0);
            }

            this.setState({
                visible: visible,
                popups: popups
            }, function () {
                if (self.state.visible) {
                    this.props.onOpen();
                    this.connectToDispatcher();
                } else {
                    this.disconnectFromDispatcher();
                }
            });
        }

        /**
         * Hides menu
         */

    }, {
        key: 'closeMenu',
        value: function closeMenu() {
            this.setMenuVisibility(false);
            _MenuEmitter2.default.getInstance().unregisterAllParts();
            this.disconnectFromDispatcher();
            this.removeInstance();
            this.processInActionDebounced.cancel();
            this.processOutActionDebounced.cancel();
            this.props.onClose();
        }

        /**
         * Handles the menu item hover or click action
         * @param hoverData
         * @param shouldFireCallback
         */

    }, {
        key: 'processInAction',
        value: function processInAction(hoverData, shouldFireCallback) {
            var hoverDataChanged = !hoverData.equals(this.currentHoverData),
                childItems,
                popups;

            if (shouldFireCallback && hoverData.hasCallback()) {
                hoverData.fireCallback(hoverData);
            }

            if (!hoverDataChanged) {
                return; // it's a child
            }

            this.removeChildPopups(hoverData.popupIndex);
            //if (hoverData.isSiblingOf(this.currentHoverData)) {
            //    this.removeChildPopups(hoverData.popupIndex);
            //}

            // set current hover data
            this.currentHoverData = hoverData;

            // process child items if exist
            childItems = hoverData.getChildItems();
            if (!childItems) {
                return;
            }

            popups = this.createPopup(childItems);

            this.setState({
                popups: popups
            });

            this.props.onItemMouseEnter(hoverData);
        }
    }, {
        key: 'processOutAction',
        value: function processOutAction(hoverData) {
            var hoverDataChanged = !hoverData.equals(this.currentHoverData);

            if (!hoverDataChanged) {
                return; // it's a child
            }

            if (!hoverData || // if mouse off menu
            hoverData && this.shouldRemoveChildPopups(this.currentHoverData, hoverData)) {
                // remove child popups if hovering over another menu item in the same popup
                // or hovering the parent popup
                //this.removeChildPopups(hoverData.popupIndex); // Complex Mac menu behaviour
                this.props.onItemMouseLeave(hoverData);
            }
        }
        //</editor-fold>

        //<editor-fold desc="Create/remove popups">
        /**
         * Removes descendants of a popup specified with popupId and sets the state
         * @param popupId
         * @param callback
         */

    }, {
        key: 'removeChildPopups',
        value: function removeChildPopups(index) {
            var popups = this.removePopups(index + 1);

            this.setState({
                popups: popups
            });
        }

        /**
         * Removes popups with an index greater than or equal to startIndex
         * @param startIndex
         */

    }, {
        key: 'removePopups',
        value: function removePopups(startIndex) {
            var popups = startIndex === 0 ? [] : this.state.popups.slice(0, startIndex);

            return popups;
        }
    }, {
        key: 'createPopup',
        value: function createPopup(items, clean) {
            if (!items) {
                return;
            }

            var popups = clean ? [] : this.state.popups.slice(0),
                id = POPUP_ID_PREFIX + popups.length;

            popups.push({
                id: id,
                items: items
            });
            return popups;
        }
        //</editor-fold>

        //<editor-fold desc="React">

    }, {
        key: 'render',
        value: function render() {
            var level = 0,
                self = this,
                alignTo,
                hints,
                popup,
                popups = this.state.popups.map(function (data) {
                alignTo = self.props.alignToFunc.call(self, level), hints = self.props.hints.call(self, level), popup = _react2.default.createElement(
                    _reactLiberator2.default,
                    {
                        key: 'liberator-popup-' + level,
                        layer: self.props.layer,
                        layerId: self.props.layerId,
                        autoCleanup: self.props.autoCleanup,
                        onActivate: self.activateHandler },
                    _react2.default.createElement(_MenuPopup2.default, {
                        config: self.props.config,
                        classPrefix: self.props.classPrefix,
                        key: POPUP_ID_PREFIX + data.id,
                        popupId: data.id,
                        items: self.state.popups[level].items,
                        popupFactory: self.popupFactory,
                        itemFactory: self.itemFactory,
                        aligner: self.props.aligner,
                        alignTo: alignTo,
                        hints: hints,
                        useOffset: level !== 0,
                        selectedIndex: data.selectedIndex })
                );
                level++;
                return popup;
            });

            return _react2.default.createElement(
                'div',
                { className: 'menu' },
                popups
            );
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (this.props.autoCloseOtherMenuInstances) {
                this.closeOtherMenuInstances();
                instances = [];
            }
            this.setMenuVisibility(true);
            instances.push(this);
        }
    }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps, nextState) {
            if (nextState.visible) {
                this.connectToDispatcher();
            } else {
                this.disconnectFromDispatcher();
            }
        }
    }, {
        key: 'activateHandler',
        value: function activateHandler(e) {
            layerElement = e.layer;
            _MenuEmitter2.default.getInstance().registerPart(layerElement, false);
        }
        //</editor-fold>

        //<editor-fold desc="Helper">

        /**
         * Returns true if child popups should be removed
         * The decision is made based on depth of currently hovered popup
         * @param hoverData
         * @param popupId
         * @returns {*}
         */

    }, {
        key: 'shouldRemoveChildPopups',
        value: function shouldRemoveChildPopups(previousHoverData, hoverData) {
            return previousHoverData && previousHoverData.popupIndex >= hoverData.popupIndex;
        }
        //</editor-fold>

    }]);

    return Menu;
}(_react.Component);

//<editor-fold desc="Props">


exports.default = Menu;
Menu.propTypes = {
    config: _react2.default.PropTypes.object, // config object visiting each menu item
    classPrefix: _react2.default.PropTypes.string, // CSS class prefix for all the classes used by this menu
    items: _react2.default.PropTypes.array.isRequired, // menu items (data)
    renderers: _react2.default.PropTypes.object, // item renderers
    mouseEnterDelay: _react2.default.PropTypes.number,
    mouseLeaveDelay: _react2.default.PropTypes.number,
    autoCloseOtherMenuInstances: _react2.default.PropTypes.bool, // should opening of a menu close other (currently open) menu instances
    onOpen: _react2.default.PropTypes.func,
    onClose: _react2.default.PropTypes.func,
    onItemMouseEnter: _react2.default.PropTypes.func,
    onItemMouseLeave: _react2.default.PropTypes.func,
    onItemClick: _react2.default.PropTypes.func,
    hints: _react2.default.PropTypes.func,
    alignToFunc: _react2.default.PropTypes.func,
    layer: _react2.default.PropTypes.node,
    layerId: _react2.default.PropTypes.string,
    autoCleanup: _react2.default.PropTypes.bool // Liberator's empty layer auto cleanup
};
Menu.defaultProps = {
    config: {},
    classPrefix: '',
    items: [],
    aligner: new _Aligner2.default(),
    mouseEnterDelay: MOUSE_ENTER_DELAY,
    mouseLeaveDelay: MOUSE_LEAVE_DELAY,
    autoCloseOtherMenuInstances: true,
    onOpen: function onOpen() {},
    onClose: function onClose() {},
    onItemMouseEnter: function onItemMouseEnter() {},
    onItemMouseLeave: function onItemMouseLeave() {},
    onItemClick: function onItemClick() {},

    hints: HINTS,
    alignToFunc: ALIGN_TO,
    layer: null,
    layerId: DEFAULT_LAYER_ID,
    autoCleanup: true
};
//</editor-fold>