import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Menu } from './Menu';
import { Aligner } from './../util/Aligner.js';
import _ from 'lodash';

const MOUSE_ENTER_DELAY = 500,
      MOUSE_LEAVE_DELAY = 100,
      ALIGNER = Aligner,
      HINTS = function(level) {
          return !level ?
              ['ss', 'se', 'sm', 'ns', 'ne', 'nm'] : // zero depth
              ['es', 'em', 'ee', 'ws', 'wm', 'we']; // all the others
      };

export class DropdownMenu extends Component {

    constructor(props) {
        super(props);

        this.onButtonClick = this.onButtonClick.bind(this);
        this.onButtonMouseEnter = this.onButtonMouseEnter.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.setMenuVisibility = this.setMenuVisibility.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
        this.hideMenuDeferred = function () {
            _.defer(this.hideMenu);
        };
        this.state = {
            isOpen: false
        };
    }

    onOpen() {
        this.props.onOpen();
    }

    onClose() {
        this.hideMenuDeferred();
        this.props.onClose();
    }

    hideMenu() {
        this.setMenuVisibility(false);
    }

    setMenuVisibility(menuVisible) {
        this.setState({
            isOpen: menuVisible
        });
    }

    onButtonClick() {
        _.defer(this.setMenuVisibility, !this.state.isOpen);
    }

    onButtonMouseEnter() {
        if (this.props.openOnMouseOver) {
            this.setMenuVisibility(true);
        }
    }

    onButtonContextMenu(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        var menu = this.state.isOpen ? (
                <Menu
                    onClick={this.onMenuClick}
                    onMouseEnter={this.onMenuMouseEnter}
                    onMouseLeave={this.onMenuMouseLeave}
                    onOpen={this.onOpen}
                    onClose={this.onClose}
                    aligner={this.props.aligner}
                    alignTo={this.buttonElement}
                    hints={this.props.hints}
                    items={this.props.items}
                    autoCloseInstances={this.props.autoCloseInstances}
                    renderers={this.props.renderers}
                    mouseEnterDelay={this.props.mouseEnterDelay}
                    mouseLeaveDelay={this.props.mouseLeaveDelay}
                />
            ) : null;

        return (
            <div className={'drop-down ' + this.props.className} >
                {this.renderButton()}
                {menu}
            </div>
        );
    }

    renderButton() {
        var children = this.props.children || (
            <button ref='button' className='menu-button'>
                {this.props.buttonText}
            </button>
        ), self = this;

        return React.Children.map(children, function (child) {
            return React.cloneElement(child, {
                ref: 'button',
                onClick: self.onButtonClick,
                onContextMenu: self.onButtonContextMenu,
                onMouseEnter: self.onButtonMouseEnter
            });
        }.bind(this));
    }

    componentDidMount() {
        this.buttonElement = ReactDOM.findDOMNode(this.refs.button);
    }
}
DropdownMenu.propTypes = {
    buttonText: React.PropTypes.string,
    items: React.PropTypes.array.isRequired,
    openOnMouseOver: React.PropTypes.bool.isRequired,
    autoCloseInstances: React.PropTypes.bool.isRequired,
    mouseEnterDelay: React.PropTypes.number,
    mouseLeaveDelay: React.PropTypes.number,
    hints: React.PropTypes.func.isRequired,
    onOpen: React.PropTypes.func,
    onClose: React.PropTypes.func
};
DropdownMenu.defaultProps = {
    buttonText: '- Menu -',
    items: [],
    aligner: new ALIGNER(),
    autoCloseInstances: true,
    openOnMouseOver: false,
    mouseEnterDelay: MOUSE_ENTER_DELAY,
    mouseLeaveDelay: MOUSE_LEAVE_DELAY,
    hints: HINTS,
    onOpen() {},
    onClose() {}
};