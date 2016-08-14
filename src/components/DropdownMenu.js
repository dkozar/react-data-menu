import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Dom } from './../util/Dom';
import { Menu } from './Menu';
import { Aligner } from './../util/Aligner.js';
import _ from 'lodash';

var classnames = require('classnames');

const MOUSE_ENTER_DELAY = 500,
      MOUSE_LEAVE_DELAY = 100,
      ALIGNER = Aligner,
      HINTS = function(depth) { // default hints. Could be overridden via props
          return !depth ?
              ['ss', 'se', 'sm', 'ns', 'ne', 'nm'] : // zero depth (first menu popup)
              ['es', 'em', 'ee', 'ws', 'wm', 'we']; // all the others
      };

export class DropdownMenu extends Component {

    constructor(props) {
        super(props);

        this.onButtonClick = this.onButtonClick.bind(this);
        this.onButtonTouchStart = this.onButtonTouchStart.bind(this);
        this.onButtonMouseEnter = this.onButtonMouseEnter.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.setMenuVisibility = this.setMenuVisibility.bind(this);
        this.hideMenu = this.hideMenu.bind(this);

        this.state = {
            isOpen: false
        };
    }

    onOpen() {
        this.props.onOpen();
    }

    onClose() {
        this.hideMenu();
        this.props.onClose();
    }

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

    tryOpenMenu() {
        if (!this.state.isOpen) { // open only if currently closed
            this.setMenuVisibility(true);
        }
        // else do nothing. If the menu is already open, it will close we'were clicking away from it.
    }

    //<editor-fold desc="Button handlers">
    onButtonClick() {
        this.tryOpenMenu();
    }

    onButtonTouchStart(e) {
        this.tryOpenMenu();
        e.preventDefault();
        e.stopPropagation();
    }

    onButtonMouseEnter() {
        if (this.props.openOnMouseOver) {
            this.tryOpenMenu();
        }
    }

    onButtonContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    //</editor-fold>

    //<editor-fold desc="Rendering">
    renderButton() {
        // render a child passed from the outside, or a default button
        var className = classnames('', Dom.buildClassNames(this.props.classPrefix, ['menu-button'])),
            children = this.props.children || (
                <button ref='button' className={className}>
                    {this.props.buttonText}
                </button>
            ), self = this;

        return React.Children.map(children, function (child) {
            return React.cloneElement(child, {
                ref: 'button',
                onClick: self.onButtonClick,
                onTouchStart: self.onButtonTouchStart,
                onContextMenu: self.onButtonContextMenu,
                onMouseEnter: self.onButtonMouseEnter
            });
        }.bind(this));
    }

    render() {
        var buttonClassName = classnames(this.props.className, Dom.buildClassNames(this.props.classPrefix, ['drop-down'])),
            menu = this.state.isOpen ? (
            <Menu
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
    //</editor-fold>

    componentDidMount() {
        this.buttonElement = ReactDOM.findDOMNode(this.refs.button);
    }
}

DropdownMenu.propTypes = {
    classPrefix: React.PropTypes.string, // CSS class prefix for all the classes used by this dropdown menu
    buttonText: React.PropTypes.string, // the text of the default button
    openOnMouseOver: React.PropTypes.bool.isRequired, // should menu be opened on mouse over (Mac menu is opened on first click)
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
    classPrefix: '',
    buttonText: '- Menu -',
    openOnMouseOver: false,
    items: [],
    aligner: new ALIGNER(),
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