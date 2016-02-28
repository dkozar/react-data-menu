'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Menu = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Aligner = require('./../util/Aligner.js');

var _Dom = require('./../util/Dom');

var _MenuEventDispatcher = require('./../util/MenuEventDispatcher.js');

var _MenuEventDispatcher2 = _interopRequireDefault(_MenuEventDispatcher);

var _MenuPopup = require('./MenuPopup');

var _MenuPopupFactory = require('./MenuPopupFactory.js');

var _MenuItemFactory = require('./MenuItemFactory.js');

var _reactLiberator = require('react-liberator');

var _reactLiberator2 = _interopRequireDefault(_reactLiberator);

var _ButtonRenderer = require('./../renderers/ButtonRenderer.js');

var _LabelRenderer = require('./../renderers/LabelRenderer.js');

var _SeparatorRenderer = require('./../renderers/SeparatorRenderer.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//<editor-fold desc="Default renderers">


//</editor-fold>

var DEFAULT_LAYER_ID = '___menu___';

var MOUSE_LEAVE_DELAY = 100,
    MOUSE_ENTER_DELAY = 200,
    RENDERERS = {
    'button': _ButtonRenderer.Button,
    'label': _LabelRenderer.Label,
    '-': _SeparatorRenderer.Separator
},
    ALIGNER = _Aligner.Aligner,
    HINTS = function HINTS() {
    return ['es', 'em', 'ee', 'ws', 'wm', 'we'];
},
    ALIGN_TO = function ALIGN_TO(level) {
    return !level ? this.props.alignTo || this.props.position : this.hoverData ? this.hoverData.getElement() : null;
};

var instances = [];

var Menu = exports.Menu = function (_Component) {
    _inherits(Menu, _Component);

    function Menu(props) {
        _classCallCheck(this, Menu);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Menu).call(this, props));

        _this.onItemClick = _this.onItemClick.bind(_this);
        _this.onItemContextMenu = _this.onItemContextMenu.bind(_this);
        _this.onItemMouseLeave = _this.onItemMouseLeave.bind(_this);
        _this.onItemMouseEnter = _this.onItemMouseEnter.bind(_this);
        _this.closeMenu = _this.closeMenu.bind(_this);
        _this.closeMenuDeferred = function () {
            _lodash2.default.defer(this.closeMenu);
        };
        _this.onAnywhereClickOrContextMenu = _this.onAnywhereClickOrContextMenu.bind(_this);
        _this.createPopup = _this.createPopup.bind(_this);
        _this.removeChildPopups = _this.removeChildPopups.bind(_this);
        _this.removePopups = _this.removePopups.bind(_this);

        // debouncing: we don't want the child popup to open immediately
        _this.processInActionDebounced = _lodash2.default.debounce(_this.processInAction.bind(_this), MOUSE_ENTER_DELAY);
        _this.processOutActionDebounced = _lodash2.default.debounce(_this.processOutAction.bind(_this), MOUSE_LEAVE_DELAY);

        _this.popupFactory = new _MenuPopupFactory.MenuPopupFactory();
        _this.itemFactory = new _MenuItemFactory.MenuItemFactory(_lodash2.default.assign(RENDERERS, props.renderers));

        _this.state = {
            visible: false,
            expanded: false,
            popups: []
        };

        _this.hoverData = null;

        if (props.autoCloseInstances) {
            _this.closeOtherMenuInstances();
        }

        //instances.push(this); // BUG with closeOtherMenuInstances

        _this.handlers = {
            onAnywhereClick: _this.onAnywhereClickOrContextMenu,
            onAnywhereContextMenu: _this.onAnywhereClickOrContextMenu,
            onScreenResize: _this.closeMenu,
            onScroll: _this.closeMenu
        };
        return _this;
    }

    /**
     * Only a single instance menu instance should be visible on screen
     * Instances do close on window click, however they might get instantiated by other means
     * (mouse-over the drop-down button etc.)
     */


    _createClass(Menu, [{
        key: 'closeOtherMenuInstances',
        value: function closeOtherMenuInstances() {
            _lodash2.default.forEach(instances, function (instance) {
                instance.closeMenuDeferred();
            });
            instances = [];
        }
    }, {
        key: 'removeInstance',
        value: function removeInstance() {
            _lodash2.default.remove(instances, function (instance) {
                return this === instance;
            });
        }

        //<editor-fold desc="Subscribe / unsubscribe">
        /**
         * Event subscription
         * Happens when menu becomes visible
         */

    }, {
        key: 'connectToDispatcher',
        value: function connectToDispatcher() {
            if (this.connected) {
                return;
            }
            _MenuEventDispatcher2.default.getInstance().connect(this.handlers);
            this.connected = true;
        }

        /**
         * Unsubscribing from events
         * Happens when menu becomes hidden
         */

    }, {
        key: 'disconnectFromDispatcher',
        value: function disconnectFromDispatcher() {
            if (!this.connected) {
                return;
            }
            _MenuEventDispatcher2.default.getInstance().disconnect(this.handlers);
            this.connected = false;
        }
        //</editor-fold>

        //<editor-fold desc="Event handlers">
        /**
         * Fires on any click
         * Closes the menu if clicked outside of the menu
         * @param e
         */

    }, {
        key: 'onAnywhereClickOrContextMenu',
        value: function onAnywhereClickOrContextMenu(e) {
            var clickedElement = e.target;
            if (!this.popupsContain(clickedElement)) {
                this.closeMenu();
            }
        }

        /**
         * Fires on context menu
         * Disables the default browser menu
         * @param event
         */

    }, {
        key: 'onItemContextMenu',
        value: function onItemContextMenu(hoverData) {
            //event.preventDefault();
        }
    }, {
        key: 'onItemMouseLeave',
        value: function onItemMouseLeave(hoverData) {
            this.hoverData = null;
            this.processOutActionDebounced(hoverData);
        }
    }, {
        key: 'onItemMouseEnter',
        value: function onItemMouseEnter(hoverData) {
            this.processInActionDebounced(hoverData, false);
        }
    }, {
        key: 'onItemClick',
        value: function onItemClick(hoverData) {
            this.processInAction(hoverData, true);
            if (hoverData.isLeafNode() && !hoverData.isPersistant()) {
                // leaf node
                this.closeMenu();
            }
        }
        //</editor-fold>

        //<editor-fold desc="Actions">
        /**
         * Shows/hides the menu
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
         * Closes the menu
         */

    }, {
        key: 'closeMenu',
        value: function closeMenu() {
            this.setMenuVisibility(false);
            this.disconnectFromDispatcher();
            this.removeInstance();
            this.props.onClose();
        }

        /**
         * Handles the menu action
         * @param popupId
         * @param itemId
         * @param itemIndex
         * @param shouldFireCallback
         */

    }, {
        key: 'processInAction',
        value: function processInAction(hoverData, shouldFireCallback) {
            var childItems;

            if (!hoverData) {
                return;
            }

            if (shouldFireCallback && hoverData.hasCallback()) {
                hoverData.fireCallback(hoverData);
            }

            if (this.hoverData !== null && this.hoverData.equals(hoverData)) {
                return;
            }

            this.removeChildPopups(hoverData.popupId);

            if (this.hoverData !== null && this.hoverData.isSiblingOf(hoverData)) {
                this.removeChildPopups(hoverData.popupId);
            }

            // set new hover data
            this.hoverData = hoverData;

            // process child items if exist
            childItems = hoverData.getChildItems();
            if (!childItems) {
                return;
            }

            var popups = this.createPopup(childItems);
            this.setState({
                popups: popups
            });
        }
    }, {
        key: 'processOutAction',
        value: function processOutAction(hoverData) {
            if (!hoverData || // if mouse off menu
            hoverData && this.shouldRemoveChildPopups(hoverData, hoverData)) {//
                // remove child popups if hovering over another menu item in the same popup
                // or hovering the parent popup
                //this.removeChildPopups(hoverData.popupId);
            }
        }

        /**
         * Removes descendants of a popup specified with popupId and sets the state
         * @param popupId
         * @param callback
         */

    }, {
        key: 'removeChildPopups',
        value: function removeChildPopups(popupId, callback) {
            var index = this.getPopupDepth(popupId),
                popups;

            if (index === -1) {
                return;
            }

            popups = this.removePopups(index + 1, callback);
            this.setState({
                popups: popups
            }, callback);

            return popups;
        }

        /**
         * Removes popups starting with index sets the state
         * @param startIndex
         * @param callback
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
                id = 'menu-popup-' + popups.length;

            popups.push({
                id: id,
                items: items
            });
            return popups;
        }
        //</editor-fold>

        //<editor-fold desc="Lifecycle">

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
                    { key: 'liberator-popup-' + level,
                        layer: self.props.layer, layerId: self.props.layerId, autoCleanup: self.props.autoCleanup },
                    _react2.default.createElement(_MenuPopup.MenuPopup, {
                        key: 'menu-popup-' + data.id,
                        popupId: data.id,
                        items: self.state.popups[level].items,
                        popupFactory: self.popupFactory,
                        itemFactory: self.itemFactory,
                        aligner: self.props.aligner,
                        onItemClick: self.onItemClick,
                        onItemMouseEnter: self.onItemMouseEnter,
                        onItemMouseLeave: self.onItemMouseLeave,
                        onItemContextMenu: self.onItemContextMenu,
                        alignTo: alignTo,
                        hints: hints,
                        useOffset: level !== 0
                    })
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
            this.setMenuVisibility(true);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.setMenuVisibility(false);
            this.disconnectFromDispatcher();
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
        //</editor-fold>

        //<editor-fold desc="Helper">
        /**
         * Returns true if any of the popups contain element
         * @param element The element to test against
         * @returns {boolean}
         */

    }, {
        key: 'popupsContain',
        value: function popupsContain(element) {
            var parentElement;

            return this.state.popups.some(function (popup) {
                parentElement = document.getElementById(popup.id);

                return _Dom.Dom.contains(parentElement, element);
            });
        }

        /**
         * Returns the popup
         * @param popupId The ID of the popup
         * @returns {*}
         */

    }, {
        key: 'getPopup',
        value: function getPopup(popupId) {
            var self = this;

            return _lodash2.default.find(self.state.popups, function (popup) {
                return popup.id === popupId;
            });
        }

        /**
         * Returns the depth of the popup specified by popupId
         * @param popupId The ID of the popup
         * @returns {number} Depth starting from 0
         */

    }, {
        key: 'getPopupDepth',
        value: function getPopupDepth(popupId) {
            return _lodash2.default.findIndex(this.state.popups, function (popup) {
                return popup.id === popupId;
            });
        }

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
            return this.getPopupDepth(previousHoverData.id) >= this.getPopupDepth(hoverData.id) && previousHoverData;
        }
        //</editor-fold>

    }]);

    return Menu;
}(_react.Component);

//<editor-fold desc="Props">


Menu.propTypes = {
    items: _react2.default.PropTypes.array.isRequired,
    renderers: _react2.default.PropTypes.object,
    mouseEnterDelay: _react2.default.PropTypes.number,
    mouseLeaveDelay: _react2.default.PropTypes.number,
    autoCloseInstances: _react2.default.PropTypes.bool,
    onOpen: _react2.default.PropTypes.func,
    onClose: _react2.default.PropTypes.func,
    hints: _react2.default.PropTypes.func,
    alignToFunc: _react2.default.PropTypes.func,
    layer: _react2.default.PropTypes.node,
    layerId: _react2.default.PropTypes.string,
    autoCleanup: _react2.default.PropTypes.bool
};
Menu.defaultProps = {
    items: [],
    aligner: new ALIGNER(),
    mouseEnterDelay: MOUSE_ENTER_DELAY,
    mouseLeaveDelay: MOUSE_LEAVE_DELAY,
    autoCloseInstances: true,
    onOpen: function onOpen() {},
    onClose: function onClose() {},

    hints: HINTS,
    alignToFunc: ALIGN_TO,
    layer: null,
    layerId: DEFAULT_LAYER_ID,
    autoCleanup: true
};
//</editor-fold>