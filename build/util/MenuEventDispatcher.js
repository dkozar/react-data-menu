'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var subscribers = [],
    isTouchInterface = false,
    instance;

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

    }]);

    function MenuEventDispatcher() {
        _classCallCheck(this, MenuEventDispatcher);

        this.onClick = this.onClick.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onAnywhereClick = this.fireHandlers.bind(this, 'onAnywhereClick');
        this.onAnywhereContextMenu = this.fireHandlers.bind(this, 'onAnywhereContextMenu');
        this.onScreenResize = this.fireHandlers.bind(this, 'onScreenResize');
        this.onScroll = this.fireHandlers.bind(this, 'onScroll');
    }

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
    }, {
        key: 'fireHandlers',
        value: function fireHandlers(handlerName, e) {
            var handler;

            _lodash2.default.forEach(subscribers, function (handlers) {
                handler = handlers[handlerName];
                if (handler) {
                    handler(e);
                }
            });
        }

        //<editor-fold desc="Click and touch">
        /**
         * Fired on document body touch
         * We're switching to touch mode upon each touch
         * onClick handler checks if we're in touch mode and does not fire (preventing ghost clicks)
         * Ghost clicks: http://ariatemplates.com/blog/2014/05/ghost-clicks-in-mobile-browsers/
         * @param e
         */

    }, {
        key: 'onTouchStart',
        value: function onTouchStart(e) {
            this.onAnywhereClick(e);
            isTouchInterface = true;
        }

        /**
         * Fired on document body click
         * If we're on touch interface - do nothing
         * @param e
         */

    }, {
        key: 'onClick',
        value: function onClick(e) {
            if (!isTouchInterface) {
                this.onAnywhereClick(e);
            }
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
            document.body.addEventListener('touchstart', this.onTouchStart);
            document.body.addEventListener('contextmenu', this.onAnywhereContextMenu);
            window.addEventListener('resize', this.onScreenResize);
            window.addEventListener('scroll', this.onScroll);
        }
    }, {
        key: 'browserUnsubscribe',
        value: function browserUnsubscribe() {
            document.body.removeEventListener('click', this.onClick);
            document.body.removeEventListener('touchstart', this.onTouchStart);
            document.body.removeEventListener('contextmenu', this.onAnywhereContextMenu);
            window.removeEventListener('resize', this.onScreenResize);
            window.removeEventListener('scroll', this.onScroll);
        }
        //</editor-fold>

    }]);

    return MenuEventDispatcher;
}();

exports.default = MenuEventDispatcher;