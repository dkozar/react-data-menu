'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _DomRoute = require('./DomRoute');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TAP_AND_HOLD_INTERVAL = 250;

var subscribers = [],
    parts = [],
    isTouchInterface = false,
    instance,
    touchTimeout;

/**
 * Checks if any of the parts is within the clicked route
 * @param route The DomRoute to check
 * @param includeToggleParts Should we treat toggle parts as parts menu parts
 * @returns {boolean}
 */
function menuPartClicked(route, includeToggleParts) {
    return _lodash2.default.some(parts, function (part) {
        var shouldIncludeThisPart = includeToggleParts || !part.isToggle;

        return shouldIncludeThisPart && route.contains(part.element);
    });
}

/**
 * Subscribes to browser events (click, contextmenu, touchstart, touchend, resize and scroll)
 * Dispatches 3 types of events - used by the menu system - by registering handlers and firing them
 * It basically *converts* browser events to another type of events
 * The choice of triggered handlers depends of:
 * 1. is the menu currently on screen
 * 2. do we click inside or outside of the menu
 * 3. do we click/contextmenu or tap/tap-and-hold
 */

var MenuEventDispatcher = function () {
    _createClass(MenuEventDispatcher, null, [{
        key: 'getInstance',


        //<editor-fold desc="Singleton">
        value: function getInstance() {
            if (!instance) {
                instance = new MenuEventDispatcher();
            }
            return instance;
        }
        //</editor-fold>

        //<editor-fold desc="Constructor">

    }]);

    function MenuEventDispatcher() {
        _classCallCheck(this, MenuEventDispatcher);

        this.onClick = this.onClick.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.evaluateAndDispatch = this.evaluateAndDispatch.bind(this);
        this.dispatchClose = this.dispatchClose.bind(this);
    }
    //</editor-fold>

    //<editor-fold desc="Connect/disconnect">


    _createClass(MenuEventDispatcher, [{
        key: 'connect',
        value: function connect(handlers) {
            var len = subscribers.length;

            if (this.isConnected(handlers)) {
                return;
            }
            subscribers.push(handlers);
            this.handleBrowserEventSubscription(len, subscribers.length);
        }
    }, {
        key: 'disconnect',
        value: function disconnect(handlers) {
            var len = subscribers.length;

            _lodash2.default.remove(subscribers, function (subscriber) {
                return subscriber === handlers;
            });
            this.handleBrowserEventSubscription(len, subscribers.length);
        }
    }, {
        key: 'isConnected',
        value: function isConnected(handlers) {
            return _lodash2.default.some(subscribers, function (subscriber) {
                return subscriber === handlers;
            });
        }
        //</editor-fold>

        //<editor-fold desc="Part registration">

        /**
         * Registers menu part
         * This is used for differentiating between clicking the menu and outside of the menu
         * @param element
         */

    }, {
        key: 'registerPart',
        value: function registerPart(element, isToggle) {
            parts.push({
                element: element,
                isToggle: isToggle
            });
        }

        /**
         * Unregisters all menu parts
         */

    }, {
        key: 'unregisterAllParts',
        value: function unregisterAllParts() {
            parts = [];
        }
        //</editor-fold>

        //<editor-fold desc="Evaluation and firing">
        /**
         * Evaluates if the click/touch happened inside or outside of the menu (currently displayed on screen)
         * 1. If it happened outside, fires 1. ON_CLOSE and 2. ON_CLICK_OUTSIDE/ON_CONTEXT_MENU) handlers IN SEQUENCE
         * 2. If it happened inside, does nothing
         * @param handlerName
         * @param e Native event
         * @param position Screen position
         * @param route DOM element route
         * @param includeToggleParts Should we treat toggle parts as parts menu parts
         * @returns {boolean} True if happened outside
         */

    }, {
        key: 'evaluateAndDispatch',
        value: function evaluateAndDispatch(handlerName, e, position, route, includeToggleParts) {
            if (!menuPartClicked(route, includeToggleParts)) {
                // 1. we clicked outside, so close the current menu
                this.dispatchClose();
                // 2. fire the requested handler
                this.fireHandlers(handlerName, e, position, route);
                return true;
            }
            return false;
        }

        /**
         * Dispatches the close event
         */

    }, {
        key: 'dispatchClose',
        value: function dispatchClose() {
            this.unregisterAllParts();
            this.fireHandlers(MenuEventDispatcher.ON_CLOSE);
        }
    }, {
        key: 'fireHandlers',
        value: function fireHandlers(handlerName, e, position, route) {
            var handler;

            _lodash2.default.forEach(subscribers, function (handlers) {
                if (handlers) {
                    // might be undefined because firing some handlers could disconnect others (recursion)
                    handler = handlers[handlerName];
                    if (handler) {
                        handler(e, position, route);
                    }
                }
            });
        }
        //</editor-fold>

        //<editor-fold desc="Click and touch handlers">
        /**
         * Fires on document body touchstart
         * We're switching to touch mode upon each touch
         * onClick handler checks if we're in touch mode and does not fire (preventing ghost clicks)
         * Ghost clicks: http://ariatemplates.com/blog/2014/05/ghost-clicks-in-mobile-browsers/
         * @param e
         */

    }, {
        key: 'onTouchStart',
        value: function onTouchStart(e) {
            var self = this,
                touch,
                position,
                route,
                dispatched;

            e = e || window.event;
            touch = e.changedTouches[0];
            position = {
                x: touch.clientX,
                y: touch.clientY
            };
            route = new _DomRoute.DomRoute(e.target);

            isTouchInterface = true;

            // on tap, trigger the click handler
            dispatched = this.evaluateAndDispatch(MenuEventDispatcher.ON_CLICK_OUTSIDE, e, position, route, false);
            if (!dispatched) {
                // we clicked the menu, so short circuit here
                return;
            }

            // after a delay (tap and hold) trigger the context menu handler
            touchTimeout = setTimeout(function () {
                // we're producing the 'onContextMenu' event on tap-and-hold
                // because of that, we might have tapped the dropdown button, which opened the menu
                // we're still within this timeout interval, waiting to dispatch ON_CONTEXT_MENU
                // however, if the button is in toggle mode, this action would close the menu
                // since we don't want this to happen, we are ignoring the toggle parts here
                self.evaluateAndDispatch(MenuEventDispatcher.ON_CONTEXT_MENU, e, position, route, true);
            }, TAP_AND_HOLD_INTERVAL);
        }

        /**
         * Fires on document body touchend
         * @param e
         */

    }, {
        key: 'onTouchEnd',
        value: function onTouchEnd() {
            // reset the tap-and-hold timer
            isTouchInterface = true;
            clearTimeout(touchTimeout);
        }

        /**
         * Fired on document body click
         * If we're on touch interface - do nothing
         * @param e
         */

    }, {
        key: 'onClick',
        value: function onClick(e) {
            var position, route;

            e = e || window.event;

            if (!isTouchInterface) {
                position = {
                    x: e.clientX,
                    y: e.clientY
                };
                route = new _DomRoute.DomRoute(e.target);
                // we're ignoring toggle parts here
                // for instance, if dropdown button is in toggleMode, it is a toggle part
                // if the menu is open and we click the button, the menu should close
                this.evaluateAndDispatch(MenuEventDispatcher.ON_CLICK_OUTSIDE, e, position, route, false);
            }
            isTouchInterface = false;
        }

        /**
         * Fired on document body context menu
         * @param e
         */

    }, {
        key: 'onContextMenu',
        value: function onContextMenu(e) {
            var position, route;

            e = e || window.event;

            position = {
                x: e.clientX,
                y: e.clientY
            }, route = new _DomRoute.DomRoute(e.target);

            this.evaluateAndDispatch(MenuEventDispatcher.ON_CONTEXT_MENU, e, position, route, false);
            isTouchInterface = false;
        }
        //</editor-fold>

        //<editor-fold desc="Browser event subscription">

    }, {
        key: 'handleBrowserEventSubscription',
        value: function handleBrowserEventSubscription(previousCount, nextCount) {
            if (previousCount === 0 && nextCount >= 1) {
                this.browserSubscribe();
            } else if (previousCount && nextCount === 0) {
                this.browserUnsubscribe();
            }
        }
    }, {
        key: 'browserSubscribe',
        value: function browserSubscribe() {
            document.body.addEventListener('click', this.onClick);
            document.body.addEventListener('contextmenu', this.onContextMenu);
            document.body.addEventListener('touchstart', this.onTouchStart);
            document.body.addEventListener('touchend', this.onTouchEnd);
            window.addEventListener('resize', this.dispatchClose);
            window.addEventListener('scroll', this.dispatchClose);
        }
    }, {
        key: 'browserUnsubscribe',
        value: function browserUnsubscribe() {
            document.body.removeEventListener('click', this.onClick);
            document.body.removeEventListener('contextmenu', this.onContextMenu);
            document.body.removeEventListener('touchstart', this.onTouchStart);
            document.body.removeEventListener('touchend', this.onTouchEnd);
            window.removeEventListener('resize', this.dispatchClose);
            window.removeEventListener('scroll', this.dispatchClose);
        }
        //</editor-fold>

    }]);

    return MenuEventDispatcher;
}();

exports.default = MenuEventDispatcher;


MenuEventDispatcher.ON_CLICK_OUTSIDE = 'onClickOutside';
MenuEventDispatcher.ON_CONTEXT_MENU = 'onContextMenu';
MenuEventDispatcher.ON_CLOSE = 'onClose';