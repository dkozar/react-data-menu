import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Aligner from './../util/Aligner.js';
import Dom from './../util/Dom';
import Menu from './Menu';
import MenuEmitter from './../emitters/MenuEmitter.js';
import ClickUtil from './../util/click';

var classnames = require('classnames');

const MOUSE_ENTER_DELAY = 0,
      MOUSE_LEAVE_DELAY = 1000,
      HINTS = function(depth) { // default hints. Could be overridden via props
          return !depth ?
              ['ss', 'se', 'sm', 'ns', 'ne', 'nm'] : // zero depth (first menu popup)
              ['es', 'em', 'ee', 'ws', 'wm', 'we']; // all other depths
      };

export default class DropdownMenu extends Component {

    //<editor-fold desc="Constructor">
    constructor(props) {
        super(props);

        this.onButtonClick = this.onButtonClick.bind(this);
        this.onButtonTouchStart = this.onButtonTouchStart.bind(this);
        this.onButtonMouseEnter = this.onButtonMouseEnter.bind(this);
        this.onButtonMouseLeave = this.onButtonMouseLeave.bind(this);
        this.onButtonContextMenu = this.onButtonContextMenu.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.setMenuVisibility = this.setMenuVisibility.bind(this);
        this.hideMenu = this.hideMenu.bind(this);

        this.state = {
            isOpen: false
        };
    }
    //</editor-fold>

    //<editor-fold desc="Toggle button handlers">
    onButtonClick(e) {
        e.preventDefault();
        if (!ClickUtil.isGhostClickEvent(e)) {
            this.isTouch = false;
            this.openMenu();
        }
    }

    onButtonContextMenu(e) {
        e.preventDefault();
    }

    onButtonTouchStart() {
        this.isTouch = true;
        this.openMenu();
    }

    onButtonMouseEnter(e) {
        if (ClickUtil.isGhostClickEvent(e.nativeEvent)) {
            return;
        }
        if (this.props.openOnMouseOver) {
            _.delay(this.openMenu.bind(this), this.props.mouseEnterDelay);
        }
    }

    onButtonMouseLeave(e) {
        if (ClickUtil.isGhostClickEvent(e.nativeEvent)) {
            return;
        }
        if (this.props.closeOnMouseOut) {
            _.delay(this.closeMenu.bind(this), this.props.mouseLeaveDelay);
        }
    }

    //</editor-fold>

    //<editor-fold desc="Menu handlers">
    onOpen() {
        // if we're in toggle mode, register button as toggle part,
        // clicking or tapping the toggle parts produces 'onClickOutside' (so if the menu is open, clicking the button will close it)
        // however, tap-and-hold won't produce 'onContextMenu' (which would close the menu)
        var isToggle = this.props.toggleMode && !this.isTouch; // do not use toggle behaviour with touch, because it is currently problematic for MenuEmitter processing logic
        
        MenuEmitter.getInstance().registerPart(this.buttonElement, isToggle);
        this.props.onOpen();
    }

    onClose() {
        // if the menu is closed by (this) dropdown menu, isOpen is already false
        // we don't want to go circular, so short circuit here
        if (this.state.isOpen) {
            this.hideMenu();
            this.props.onClose();
        }
    }
    //</editor-fold>

    //<editor-fold desc="Actions">
    hideMenu() {
        var self = this;

        _.defer(function () {
            // we're deferring the hiding of the menu, so on close it doesn't go through the open->close->open transition
            self.setMenuVisibility(false);
        });
    }

    setMenuVisibility(visible) {
        this.setState({
            isOpen: visible
        });
    }

    openMenu() {
        if (!this.state.isOpen) { // open only if currently closed
            this.setMenuVisibility(true);
        }
        // else do nothing. If the menu is already open, it will close we'were clicking away from it.
    }

    closeMenu() {
        if (this.state.isOpen) {
            this.hideMenu();
        }
    }
    //</editor-fold>

    //<editor-fold desc="React">
    renderButton() {
        var className = classnames('', Dom.buildClassNames(this.props.classPrefix, [
                'menu-button',
                this.state.isOpen ? 'menu-button-selected' : null
            ])),
            // render the child passed from the outside, or a default button
            children = this.props.children || (
                <button ref='button' className={className}>
                    {this.props.buttonText}
                </button>
            ), self = this;

        return React.Children.map(children, function (child) {
            return React.cloneElement(child, {
                ref: 'button',
                className,
                onMouseDown: self.onButtonClick, // TODO: onMouseDown
                onTouchStart: self.onButtonTouchStart,
                onMouseEnter: self.onButtonMouseEnter,
                onMouseLeave: self.onButtonMouseLeave,
                onContextMenu: self.onButtonContextMenu
            });
        }.bind(this));
    }

    render() {
        var buttonClassName = classnames(this.props.className, Dom.buildClassNames(this.props.classPrefix, [
                'drop-down',
                this.state.isOpen ? 'drop-down-open' : null
            ])),
            menu = this.state.isOpen ? (
            <Menu
                config={this.props.config}
                classPrefix={this.props.classPrefix}
                onOpen={this.onOpen}
                onClose={this.onClose}
                onItemMouseEnter={this.props.onItemMouseEnter}
                onItemMouseLeave={this.props.onItemMouseLeave}
                onItemClick={this.props.onItemClick}
                aligner={this.props.aligner}
                alignTo={this.buttonElement}
                hints={this.props.hints}
                items={this.props.items}
                autoCloseOtherMenuInstances={this.props.autoCloseOtherMenuInstances}
                renderers={this.props.renderers}
                mouseEnterDelay={this.props.mouseEnterDelay}
                mouseLeaveDelay={this.props.mouseLeaveDelay}
            />
        ) : null;

        return (
            <div className={buttonClassName} >
                {this.renderButton()}
                {menu}
            </div>
        );
    }

    componentDidMount() {
        this.buttonElement = ReactDOM.findDOMNode(this.refs.button);
    }
    //</editor-fold>
}

//<editor-fold desc="Props">
DropdownMenu.propTypes = {
    config: React.PropTypes.object, // config object visiting every menu item
    classPrefix: React.PropTypes.string, // CSS class prefix for all the classes used by this dropdown menu
    buttonText: React.PropTypes.string, // the text of the default button
    toggleMode: React.PropTypes.bool.isRequired, // should menu be toggled (opened/closed) by clicking the button
    openOnMouseOver: React.PropTypes.bool.isRequired, // should menu be opened on mouse over (Mac menu is opened on first *click*)
    closeOnMouseOut: React.PropTypes.bool.isRequired, // should menu be closed on mouse over
    items: React.PropTypes.array.isRequired, // menu items (data)
    autoCloseOtherMenuInstances: React.PropTypes.bool.isRequired,
    mouseEnterDelay: React.PropTypes.number,
    mouseLeaveDelay: React.PropTypes.number,
    hints: React.PropTypes.func.isRequired,
    onOpen: React.PropTypes.func, // custom open handler
    onClose: React.PropTypes.func, // custom close handler
    onItemMouseEnter: React.PropTypes.func, // custom item mouse enter handler
    onItemMouseLeave: React.PropTypes.func, // custom item mouse leave handler
    onItemClick: React.PropTypes.func // custom item click handler
};
DropdownMenu.defaultProps = {
    config: {},
    classPrefix: '',
    buttonText: '- Menu -',
    openOnMouseOver: false,
    closeOnMouseOut: false,
    toggleMode: true,
    items: [],
    aligner: new Aligner(), // default aligner
    autoCloseOtherMenuInstances: true,
    mouseEnterDelay: MOUSE_ENTER_DELAY,
    mouseLeaveDelay: MOUSE_LEAVE_DELAY,
    hints: HINTS,
    onOpen() {},
    onClose() {},
    onItemMouseEnter() {},
    onItemMouseLeave() {},
    onItemClick() {}
};
//</editor-fold>