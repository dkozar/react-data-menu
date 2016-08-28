import _ from 'lodash';
import ClickUtil from './../util/click';

var EmitterPlug = require('raycast-dom').EmitterPlug.default;

const TAP_AND_HOLD_INTERVAL = 250;

var parts = [],
    instance,
    touchTimeout;

/**
 * Checks if any of the parts is within the clicked ray
 * @param ray The Ray to check
 * @param includeToggleParts Should we treat toggle parts as parts menu parts
 * @returns {boolean}
 */
function isMenuPartClicked(ray, includeToggleParts) {
    return _.some(parts, function (part) {
        var shouldIncludeThisPart = includeToggleParts || !part.isToggle;

        return shouldIncludeThisPart && ray.intersects(part.element);
    });
}

/**
 * Checks if any of the toggle parts is within the clicked ray
 * @param ray The Ray to check
 * @returns {boolean}
 */
function isTogglePartClicked(ray) {
    return _.some(parts, function (part) {
        return part.isToggle && ray.intersects(part.element);
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
export default class MenuEmitter extends EmitterPlug {

    //<editor-fold desc="Singleton">
    static getInstance() {
        if (!instance) {
            instance = new MenuEmitter();
        }
        return instance;
    }
    //</editor-fold>

    //<editor-fold desc="Constructor">
    constructor() {
        super();

        this.dispatchInteraction = this.dispatchInteraction.bind(this);
        this.dispatchClose = this.dispatchClose.bind(this);

        this.handlers = {
            onMouseOver: this.onMouseOver.bind(this),
            onMouseOut: this.onMouseOut.bind(this),
            onMouseDown: this.onMouseDown.bind(this),
            onMouseUp: this.onMouseUp.bind(this),
            onContextMenu: this.onContextMenu.bind(this),
            onTouchStart: this.onTouchStart.bind(this),
            onTouchEnd: this.onTouchEnd.bind(this),
            onResize: this.dispatchClose,
            onScroll: this.dispatchClose
        }
    }
    //</editor-fold>

    //<editor-fold desc="Menu part registration">
    /**
     * Registers menu part
     * This is used for differentiating between clicking the menu and outside of the menu
     * @param element
     */
    registerPart(element, isToggle) {
        parts.push({
            element,
            isToggle
        });
    }

    /**
     * Unregisters all menu parts
     */
    unregisterAllParts() {
        parts = [];
    }
    //</editor-fold>

    //<editor-fold desc="Evaluation and firing">
    /**
     * @param handlerName
     * @param ray Emitter ray
     * @param closeMenu Should we close the menu
     * @returns {boolean} True if happened outside
     */
    dispatchInteraction(handlerName, ray, closeMenu) {
        // 1. close the current menu if needed
        if (closeMenu) {
            this.dispatchClose(ray);
        }
        // 2. fire the requested handler
        this.emit(handlerName, ray);
    }

    /**
     * Dispatches the close event
     */
    dispatchClose(ray) {
        this.unregisterAllParts();
        this.emit(MenuEmitter.ON_CLOSE);
    }
    //</editor-fold>

    //<editor-fold desc="Mouse">
    onMouseDown(ray) {
        this.isMenuCurrentlyOpen = !parts.length;

        var isInside;

        if (!ClickUtil.isGhostClick(ray)) {  // avoid ghost 'click' event on touch devices
            // we're ignoring toggle parts here
            // for instance, if dropdown button is in toggleMode, it is a toggle part
            // if the menu is open and we click the button, the menu should close
            isInside = isMenuPartClicked(ray, false);
            if (isInside) {
                this.dispatchInteraction(MenuEmitter.ON_MOUSE_DOWN_INSIDE, ray);
            } else if (!this.isMenuCurrentlyOpen) {
                this.dispatchInteraction(MenuEmitter.ON_MOUSE_DOWN_OUTSIDE, ray, true);
            }
        }
    }

    /**
     * Fired on document body mouse up
     * If we're on touch interface - do nothing
     * @param e
     */
    onMouseUp(ray) {
        var isInside;

        if (!ClickUtil.isGhostClick(ray)) {  // avoid ghost 'click' event on touch devices
            // we're ignoring toggle parts here
            // we're checking only if this was mouseup inside, which would trigger an item when opening the menu with click-and-drag
            isInside = isMenuPartClicked(ray, false);
            if (isInside) {
                this.dispatchInteraction(MenuEmitter.ON_MOUSE_UP_INSIDE, ray);
            }
        }
    }

    /**
     * Context menu handler
     * Inside our app root, we will prevent default
     * However, here we'll dispatch ON_CONTEXT_MENU_INSIDE or ON_CONTEXT_MENU_OUTSIDE
     * The menu takes care of preventing default when ON_CONTEXT_MENU_INSIDE
     * The app takes care of preventing default when ON_CONTEXT_MENU_OUTSIDE
     * @param e
     */
    onContextMenu(ray) {
        var isInside;

        if (ClickUtil.isGhostClick(ray)) {
            ray.preventDefault(); // avoid ghost 'contextmenu' event on touch devices
        } else {
            isInside = isMenuPartClicked(ray, false);
            if (isInside) {
                this.dispatchInteraction(MenuEmitter.ON_CONTEXT_MENU_INSIDE, ray);
            } else {
                this.dispatchInteraction(MenuEmitter.ON_CONTEXT_MENU_OUTSIDE, ray);
            }
        }
    }

    onMouseOver(ray) {
        this.createRayAndEmit(MenuEmitter.ON_MOUSE_OVER, document, ray);
    }

    onMouseOut(ray) {
        this.createRayAndEmit(MenuEmitter.ON_MOUSE_OUT, document, ray);
    }

    //</editor-fold>

    //<editor-fold desc="Touch">
    /**
     * Fires on document body touchstart
     * We're switching to touch mode upon each touch
     * onClick handler checks if we're in touch mode and does not fire (preventing ghost clicks)
     * Ghost clicks: http://ariatemplates.com/blog/2014/05/ghost-clicks-in-mobile-browsers/
     * @param e
     */
    onTouchStart(ray) {
        var self = this,
            touch = ray.e.changedTouches[0],
            isInside;

            ray.position = {
                x: touch.clientX,
                y: touch.clientY
            };

        isInside = isMenuPartClicked(ray, false);

        if (isInside) {
            // on tap, trigger the click handler
            this.dispatchInteraction(MenuEmitter.ON_TOUCH_START_INSIDE, ray);
        } else {
            this.dispatchInteraction(MenuEmitter.ON_TOUCH_START_OUTSIDE, ray, true);
            // after a delay (tap and hold) trigger the context menu handler
            touchTimeout = setTimeout(function() {
                // we're producing the 'onContextMenu' event on tap-and-hold
                // because of that, we might have tapped the drop-down button, which opened the menu
                // we're still within this timeout interval, waiting to dispatch ON_CONTEXT_MENU
                // however, if the button is in toggle mode, this action would close the menu
                // since we don't want this to happen, we are ignoring the toggle parts here
                isInside = isMenuPartClicked(ray, true); // include toggle parts
                if (!isInside) {
                    self.dispatchInteraction(MenuEmitter.ON_CONTEXT_MENU_OUTSIDE, ray, true); // close menu
                }
            }, TAP_AND_HOLD_INTERVAL);
        }
    }

    /**
     * Fires on document body touchend
     * @param e
     */
    onTouchEnd(ray) {
        var touch = ray.e.changedTouches[0],
            isInside;

        ray.position = {
            x: touch.clientX,
            y: touch.clientY
        };

        // reset the tap-and-hold timer
        clearTimeout(touchTimeout);

        isInside = isMenuPartClicked(ray, false);

        if (isInside) {
            this.dispatchInteraction(MenuEmitter.ON_TOUCH_END_INSIDE, ray);
        }
    }
    //</editor-fold>
}

//<editor-fold desc="Constants">
MenuEmitter.ON_MOUSE_OVER = 'onMouseOver'; // for opening child popups
MenuEmitter.ON_MOUSE_OUT = 'onMouseOut'; // for closing child popups
MenuEmitter.ON_TOUCH_START_INSIDE = 'onTouchStart';
MenuEmitter.ON_TOUCH_END_INSIDE = 'onTouchEnd';
MenuEmitter.ON_TOUCH_START_OUTSIDE = 'onTouchStartOutside';
MenuEmitter.ON_MOUSE_UP_INSIDE = 'onMouseUpInside'; // when menu part clicked
MenuEmitter.ON_MOUSE_DOWN_INSIDE = 'onMouseDownInside'; // when menu part clicked
MenuEmitter.ON_MOUSE_DOWN_OUTSIDE = 'onMouseDownOutside'; // when clicked outside of the menu
MenuEmitter.ON_CONTEXT_MENU_INSIDE = 'onContextMenuInside'; // when menu part right-clicked
MenuEmitter.ON_CONTEXT_MENU_OUTSIDE = 'onContextMenuOutside'; // when right-clicked outside of the menu
MenuEmitter.ON_CLOSE = 'onClose'; // when menu has to close
//</editor-fold>