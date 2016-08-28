import _ from 'lodash';
import React, { Component } from 'react';
import Aligner from './../util/Aligner.js';
import { DefaultRenderers } from './../renderers/defaultRenderers.js';
import Dom from './../util/Dom';
import HoverData from './../util/hoverData';
import HoverDataBuilder from './../util/hoverDataBuilder';
import MenuEmitter from './../emitters/MenuEmitter.js';
import MenuItemFactory from './MenuItemFactory.js';
import MenuPopup from './MenuPopup';
import MenuPopupFactory from './MenuPopupFactory.js';
import Liberator from 'react-liberator';

export const POPUP_ID_PREFIX = 'menu-popup-';

const DEFAULT_LAYER_ID = 'react-data-menu-popup',
    MOUSE_LEAVE_DELAY = 100,
    MOUSE_ENTER_DELAY = 200,
    HINTS = function() {
        return ['es', 'em', 'ee', 'ws', 'wm', 'we'];
    },
    ALIGN_TO = function(level) {
        return !level ?
            (this.props.alignTo || this.props.position) :
            (this.currentHoverData ?
                this.currentHoverData.getElement() :
                null);
    };

// references to all the open menu instances
// usually only the single instance, since by default we're allowing only a single menu on screen (we're auto-closing others)
var instances = [],
    layerElement;

export default class Menu extends Component {

    //<editor-fold desc="Constructor">
    constructor(props) {
        super(props);

        this.onItemClick = this.onItemClick.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.createPopup = this.createPopup.bind(this);
        this.removeChildPopups = this.removeChildPopups.bind(this);
        this.removePopups = this.removePopups.bind(this);

        // debouncing: we don't want the child popup to open/close immediately
        this.processInActionDebounced = _.debounce(this.processInAction.bind(this), MOUSE_ENTER_DELAY);
        this.processOutActionDebounced = _.debounce(this.processOutAction.bind(this), MOUSE_LEAVE_DELAY);

        this.popupFactory = new MenuPopupFactory(this.props.classPrefix);
        this.itemFactory = new MenuItemFactory(_.assign(DefaultRenderers, props.renderers), props.classPrefix);

        this.state = {
            visible: false,
            expanded: false,
            popups: []
        };

        this.currentHoverData = null;

        this.handlers = {
            onMouseDownOutside: this.onMouseDownOutside.bind(this),
            onMouseUpInside: this.onMouseUpInside.bind(this),
            onContextMenuInside: this.onContextMenuInside.bind(this),
            onClose: this.closeMenu,
            onMouseOver: this.onMouseOver.bind(this),
            onMouseOut: this.onMouseOut.bind(this),
            onTouchStart: this.onTouchStart.bind(this),
            onTouchEnd: this.onTouchEnd.bind(this),
            onTouchStartOutside: this.onTouchStartOutside.bind(this)
        };
    }
    //</editor-fold>

    //<editor-fold desc="Instance handling">
    /**
     * Only a single menu instance should be visible on screen
     * Instances do close on window click, however they might get instantiated by other means
     * (mouse-over the drop-down button etc.)
     */
    closeOtherMenuInstances() {
        var self = this;

        _.forEach(instances, function(instance) {
            if (instance !== self) {
                instance.closeMenu();
            }
        });
    }

    /**
     * Removes this menu from instances array
     */
    removeInstance() {
        var self = this;

        _.remove(instances, function(instance) {
            return self === instance;
        });
    }
    //</editor-fold>

    //<editor-fold desc="Emitter subscribe / unsubscribe">
    /**
     * Event subscription
     * Happens when menu becomes visible
     */
    connectToDispatcher() {
        MenuEmitter.getInstance().connect(this.handlers);
    }

    /**
     * Unsubscribing from events
     * Happens when menu becomes hidden
     */
    disconnectFromDispatcher() {
        MenuEmitter.getInstance().disconnect(this.handlers);
    }
    //</editor-fold>

    //<editor-fold desc="Raycast">
    /**
     * Fires on context menu inside of the menu
     * @param ray
     */
    onContextMenuInside(ray) {
        ray.preventDefault(); // prevent default menu
    }

    onMouseOver(ray) {
        var hoverData = HoverDataBuilder.build(this.state.popups, ray),
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
            popups
        });

        this.processInActionDebounced(hoverData, false);
    }

    onMouseOut(ray) {
        var hoverData = HoverDataBuilder.build(this.state.popups, ray);

        if (hoverData) {
            this.processOutActionDebounced(hoverData);
        }
    }

    /**
     * Closes the menu if clicked outside of the menu
     */
    onMouseDownOutside() {
        this.closeMenu();
    }

    onMouseUpInside(ray) {
        var hoverData = HoverDataBuilder.build(this.state.popups, ray);

        if (hoverData) {
            this.onItemClick(hoverData);
        }
    }

    onTouchStart(ray) {
        var hoverData = HoverDataBuilder.build(this.state.popups, ray);

        if (hoverData) {
            this.processInAction(hoverData, false);
        }
    }

    onTouchEnd(ray) {
        var hoverData = HoverDataBuilder.build(this.state.popups, ray);

        if (hoverData) {
            this.onItemClick(hoverData);
        }
    }

    onTouchStartOutside(ray) {
        this.closeMenu();
    }

    onItemClick(hoverData) {
        var self = this;

        this.processInAction(hoverData, true);
        if (hoverData.isLeafNode() && !hoverData.isPersistant()) { // leaf node
            // defer and allow item handlers to be executed
            _.defer(function() {
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
    setMenuVisibility(visible) {
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
            visible,
            popups
        }, function() {
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
    closeMenu() {
        this.setMenuVisibility(false);
        MenuEmitter.getInstance().unregisterAllParts();
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
    processInAction(hoverData, shouldFireCallback) {
        var hoverDataChanged = !hoverData.equals(this.currentHoverData),
            childItems, popups;

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
            popups
        });

        this.props.onItemMouseEnter(hoverData);
    }

    processOutAction(hoverData) {
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
    removeChildPopups(index) {
        var popups = this.removePopups(index + 1);

        this.setState({
            popups
        });
    }

    /**
     * Removes popups with an index greater than or equal to startIndex
     * @param startIndex
     */
    removePopups(startIndex) {
        var popups = startIndex === 0 ? [] : this.state.popups.slice(0, startIndex);

        return popups;
    }

    createPopup(items, clean) {
        if (!items) {
            return;
        }

        var popups = clean ? [] : this.state.popups.slice(0),
            id = POPUP_ID_PREFIX + popups.length;

        popups.push({
            id,
            items
        });
        return popups;
    }
    //</editor-fold>

    //<editor-fold desc="React">
    render() {
        var level = 0,
            self = this,
            alignTo, hints, popup,

            popups = this.state.popups.map(function (data) {
                alignTo = self.props.alignToFunc.call(self, level),
                hints = self.props.hints.call(self, level),
                popup = (
                    <Liberator
                        key={'liberator-popup-' + level}
                        layer={self.props.layer}
                        layerId={self.props.layerId}
                        autoCleanup={self.props.autoCleanup}
                        onActivate={self.activateHandler}>
                        <MenuPopup
                            config={self.props.config}
                            classPrefix={self.props.classPrefix}
                            key={POPUP_ID_PREFIX + data.id}
                            popupId={data.id}
                            items={self.state.popups[level].items}
                            popupFactory={self.popupFactory}
                            itemFactory={self.itemFactory}
                            aligner={self.props.aligner}
                            alignTo={alignTo}
                            hints={hints}
                            useOffset={level !== 0}
                            selectedIndex={data.selectedIndex} />

                    </Liberator>
                );
                level++;
                return popup;
            });

        return (
            <div className='menu' >
                {popups}
            </div>
        );
    }

    componentDidMount() {
        if (this.props.autoCloseOtherMenuInstances) {
            this.closeOtherMenuInstances();
            instances = [];
        }
        this.setMenuVisibility(true);
        instances.push(this);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.visible) {
            this.connectToDispatcher();
        } else {
            this.disconnectFromDispatcher();
        }
    }

    activateHandler(e) {
        layerElement = e.layer;
        MenuEmitter.getInstance().registerPart(layerElement, false);
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
    shouldRemoveChildPopups(previousHoverData, hoverData) {
        return previousHoverData &&
            previousHoverData.popupIndex >= hoverData.popupIndex;
    }
    //</editor-fold>
}

//<editor-fold desc="Props">
Menu.propTypes = {
    config: React.PropTypes.object, // config object visiting each menu item
    classPrefix: React.PropTypes.string, // CSS class prefix for all the classes used by this menu
    items: React.PropTypes.array.isRequired, // menu items (data)
    renderers: React.PropTypes.object, // item renderers
    mouseEnterDelay: React.PropTypes.number,
    mouseLeaveDelay: React.PropTypes.number,
    autoCloseOtherMenuInstances: React.PropTypes.bool, // should opening of a menu close other (currently open) menu instances
    onOpen: React.PropTypes.func,
    onClose: React.PropTypes.func,
    onItemMouseEnter: React.PropTypes.func,
    onItemMouseLeave: React.PropTypes.func,
    onItemClick: React.PropTypes.func,
    hints: React.PropTypes.func,
    alignToFunc: React.PropTypes.func,
    layer: React.PropTypes.node,
    layerId: React.PropTypes.string,
    autoCleanup: React.PropTypes.bool // Liberator's empty layer auto cleanup
};
Menu.defaultProps = {
    config: {},
    classPrefix: '',
    items: [],
    aligner: new Aligner(),
    mouseEnterDelay: MOUSE_ENTER_DELAY,
    mouseLeaveDelay: MOUSE_LEAVE_DELAY,
    autoCloseOtherMenuInstances: true,
    onOpen() {},
    onClose() {},
    onItemMouseEnter() {},
    onItemMouseLeave() {},
    onItemClick() {},
    hints: HINTS,
    alignToFunc: ALIGN_TO,
    layer: null,
    layerId: DEFAULT_LAYER_ID,
    autoCleanup: true
};
//</editor-fold>