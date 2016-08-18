import _ from 'lodash';
import React, { Component } from 'react';
import { Aligner } from './../util/Aligner.js';
import { Dom } from './../util/Dom';
import MenuEventDispatcher from './../util/MenuEventDispatcher.js';
import { MenuPopup } from './MenuPopup';
import { MenuPopupFactory } from './MenuPopupFactory.js';
import { MenuItemFactory } from './MenuItemFactory.js';
import Liberator from 'react-liberator';

//<editor-fold desc="Default renderers">
import { Button } from './../renderers/ButtonRenderer.js';
import { Label } from './../renderers/LabelRenderer.js';
import { Separator } from './../renderers/SeparatorRenderer.js';
//</editor-fold>

const DEFAULT_LAYER_ID = '___react-data-menu___';

const MOUSE_LEAVE_DELAY = 100,
    MOUSE_ENTER_DELAY = 200,
    RENDERERS = {
        'button': Button,
        'label': Label,
        '-': Separator
    },
    ALIGNER = Aligner,
    HINTS = function() {
        return ['es', 'em', 'ee', 'ws', 'wm', 'we'];
    },
    ALIGN_TO = function(level) {
        return !level ?
            (this.props.alignTo || this.props.position) :
            (this.hoverData ?
                this.hoverData.getElement() :
                null);
    };

// references to all the open menu instances
// usually only the single instance, since by default we're allowing only a single menu on screen (we're auto-closing others)
var instances = [],
    layerElement;

export class Menu extends Component {

    constructor(props) {
        super(props);

        this.onItemClick = this.onItemClick.bind(this);
        this.onItemContextMenu = this.onItemContextMenu.bind(this);
        this.onItemMouseLeave = this.onItemMouseLeave.bind(this);
        this.onItemMouseEnter = this.onItemMouseEnter.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.onAnywhereClickOrContextMenu = this.onAnywhereClickOrContextMenu.bind(this);
        this.createPopup = this.createPopup.bind(this);
        this.removeChildPopups = this.removeChildPopups.bind(this);
        this.removePopups = this.removePopups.bind(this);

        // debouncing: we don't want the child popup to open/close immediately
        this.processInActionDebounced = _.debounce(this.processInAction.bind(this), MOUSE_ENTER_DELAY);
        this.processOutActionDebounced = _.debounce(this.processOutAction.bind(this), MOUSE_LEAVE_DELAY);

        this.popupFactory = new MenuPopupFactory(this.props.classPrefix);
        this.itemFactory = new MenuItemFactory(_.assign(RENDERERS, props.renderers), props.classPrefix);

        this.state = {
            visible: false,
            expanded: false,
            popups: []
        };

        this.hoverData = null;

        this.handlers = {
            onClickOutside: this.onAnywhereClickOrContextMenu,
            onContextMenu: this.onAnywhereClickOrContextMenu,
            onClose: this.closeMenu
        };
    }

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

    removeInstance() {
        var self = this;

        _.remove(instances, function(instance) {
            return self === instance;
        });
    }

    //<editor-fold desc="Subscribe / unsubscribe">
    /**
     * Event subscription
     * Happens when menu becomes visible
     */
    connectToDispatcher() {
        if (this.connected) {
            return;
        }
        MenuEventDispatcher.getInstance().connect(this.handlers);
        this.connected = true;
    }

    /**
     * Unsubscribing from events
     * Happens when menu becomes hidden
     */
    disconnectFromDispatcher() {
        if (!this.connected) {
            return;
        }
        MenuEventDispatcher.getInstance().disconnect(this.handlers);
        this.connected = false;
    }
    //</editor-fold>

    //<editor-fold desc="Event handlers">
    /**
     * Fires on any click
     * Closes the menu if clicked outside of the menu
     * @param e
     */
    onAnywhereClickOrContextMenu(e) {
        this.closeMenu();
    }

    /**
     * Fires on context menu
     * Disables the default browser menu
     * @param event
     */
    onItemContextMenu(hoverData) {
        //event.preventDefault();
    }

    onItemMouseLeave(hoverData) {
        this.hoverData = null;
        this.processOutActionDebounced(hoverData);
        this.props.onItemMouseLeave(hoverData);
    }

    onItemMouseEnter(hoverData) {
        this.processInActionDebounced(hoverData, false);
        this.props.onItemMouseEnter(hoverData);
    }

    onItemClick(hoverData) {
        this.processInAction(hoverData, true);
        if (hoverData.isLeafNode() && !hoverData.isPersistant()) { // leaf node
            this.closeMenu();
        }
        this.props.onItemClick(hoverData);
    }
    //</editor-fold>

    //<editor-fold desc="Actions">
    /**
     * Shows/hides the menu
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
     * Closes the menu
     */
    closeMenu() {
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
    processInAction(hoverData, shouldFireCallback) {
        var childItems, popups;

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

        //if (this.hoverData !== null && this.hoverData.isSiblingOf(hoverData)) {
        //    this.removeChildPopups(hoverData.popupId);
        //}

        // set new hover data
        this.hoverData = hoverData;

        // process child items if exist
        childItems = hoverData.getChildItems();
        if (!childItems) {
            return;
        }

        popups = this.createPopup(childItems);
        this.setState({
            popups
        });
    }

    processOutAction(hoverData) {
        if (!hoverData || // if mouse off menu
            hoverData && this.shouldRemoveChildPopups(hoverData, hoverData)) { //
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
    removeChildPopups(popupId, callback) {
        var index = this.getPopupDepth(popupId),
            popups;

        if (index === -1) {
            return;
        }

        popups = this.removePopups(index + 1, callback);
        this.setState({
            popups,
        }, callback);

        return popups;
    }

    /**
     * Removes popups with index greater than or equal to startIndex
     * @param startIndex
     * @param callback
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
            id = 'menu-popup-' + popups.length;

        popups.push({
            id,
            items
        });
        return popups;
    }
    //</editor-fold>

    //<editor-fold desc="Lifecycle">
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
                            classPrefix={self.props.classPrefix}
                            key={'menu-popup-' + data.id}
                            popupId={data.id}
                            items={self.state.popups[level].items}
                            popupFactory={self.popupFactory}
                            itemFactory={self.itemFactory}
                            aligner={self.props.aligner}
                            onItemClick={self.onItemClick}
                            onItemMouseEnter={self.onItemMouseEnter}
                            onItemMouseLeave={self.onItemMouseLeave}
                            onItemContextMenu={self.onItemContextMenu}
                            alignTo={alignTo}
                            hints={hints}
                            useOffset={level !== 0}
                        />

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
        //console.log('menu componentDidMount')
        if (this.props.autoCloseOtherMenuInstances) {
            this.closeOtherMenuInstances();
            instances = [];
        }
        this.setMenuVisibility(true);
        instances.push(this);
    }

    componentWillUnmount() {
        //console.log('menu componentWillUnmount')
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
        MenuEventDispatcher.getInstance().registerPart(layerElement, false);
    }
    //</editor-fold>

    //<editor-fold desc="Helper">
    /**
     * Returns the popup
     * @param popupId The ID of the popup
     * @returns {*}
     */
    getPopup(popupId) {
        return _.find(this.state.popups, function(popup) {
            return popup.id === popupId;
        });
    }

    /**
     * Returns the depth of the popup specified by popupId
     * @param popupId The ID of the popup
     * @returns {number} Depth starting from 0
     */
    getPopupDepth(popupId) {
        return _.findIndex(this.state.popups, function(popup) {
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
    shouldRemoveChildPopups(previousHoverData, hoverData) {
        return this.getPopupDepth(previousHoverData.id) >= this.getPopupDepth(hoverData.id) &&
            previousHoverData;
    }
    //</editor-fold>
}

//<editor-fold desc="Props">
Menu.propTypes = {
    classPrefix: React.PropTypes.string, // CSS class prefix for all the classes used by this menu
    items: React.PropTypes.array.isRequired, // menu items (data)
    renderers: React.PropTypes.object, // item renderers
    mouseEnterDelay: React.PropTypes.number,
    mouseLeaveDelay: React.PropTypes.number,
    autoCloseOtherMenuInstances: React.PropTypes.bool, // should opening of a menu close other, currently open menu instances
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
    classPrefix: '',
    items: [],
    aligner: new ALIGNER(),
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