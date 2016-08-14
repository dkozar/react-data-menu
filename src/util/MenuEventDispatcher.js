import _ from 'lodash';

var subscribers = [],
    isTouchInterface = false,
    instance;

export default class MenuEventDispatcher {

    //<editor-fold desc="Singleton">
    static getInstance() {
        if (!instance) {
            instance = new MenuEventDispatcher();
        }
        return instance;
    }
    //</editor-fold>

    constructor() {
        this.onClick = this.onClick.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onAnywhereClick = this.fireHandlers.bind(this, 'onAnywhereClick');
        this.onAnywhereContextMenu = this.fireHandlers.bind(this, 'onAnywhereContextMenu');
        this.onScreenResize = this.fireHandlers.bind(this, 'onScreenResize');
        this.onScroll = this.fireHandlers.bind(this, 'onScroll');
    }

    connect(handlers) {
        var len = subscribers.length;

        if (this.isConnected(handlers)) {
            return;
        }

        subscribers.push(handlers);

        this.handleBrowserEventSubscription(len, subscribers.length);
    }

    disconnect(handlers) {
        var len = subscribers.length;

        _.remove(subscribers, function(subscriber) {
            return subscriber === handlers;
        });

        this.handleBrowserEventSubscription(len, subscribers.length);
    }

    isConnected(handlers) {
        return _.some(subscribers, function(subscriber) {
            return subscriber === handlers;
        });
    }

    fireHandlers(handlerName, e) {
        var handler;

        _.forEach(subscribers, function(handlers) {
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
    onTouchStart(e) {
        this.onAnywhereClick(e);
        isTouchInterface = true;
    }

    /**
     * Fired on document body click
     * If we're on touch interface - do nothing
     * @param e
     */
    onClick(e) {
        if (!isTouchInterface) {
            this.onAnywhereClick(e);
        }
        isTouchInterface = false;
    }
    //</editor-fold>

    //<editor-fold desc="Browser event subscription">
    handleBrowserEventSubscription(previousCount, nextCount) {
        if (previousCount === 0 && nextCount >= 1) {
            this.browserSubscribe();
        } else if (previousCount && nextCount === 0) {
            this.browserUnsubscribe();
        }
    }

    browserSubscribe() {
        document.body.addEventListener('click', this.onClick);
        document.body.addEventListener('touchstart', this.onTouchStart);
        document.body.addEventListener('contextmenu', this.onAnywhereContextMenu);
        window.addEventListener('resize', this.onScreenResize);
        window.addEventListener('scroll', this.onScroll);
    }

    browserUnsubscribe() {
        document.body.removeEventListener('click', this.onClick);
        document.body.removeEventListener('touchstart', this.onTouchStart);
        document.body.removeEventListener('contextmenu', this.onAnywhereContextMenu);
        window.removeEventListener('resize', this.onScreenResize);
        window.removeEventListener('scroll', this.onScroll);
    }
    //</editor-fold>
}