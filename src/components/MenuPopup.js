import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Aligner from './../util/Aligner.js';
import HoverData from './../util/hoverData.js';

export const ITEM_ID_PREFIX = 'menu-item-';

const DEFAULT_ITEM_RENDERER_TYPE = 'button';

var classnames = require('classnames');

export default class MenuPopup extends Component {

    constructor(props) {
        super(props);

        this.aligner = this.props.aligner;
        this.state = {
            showing: false
        };
    }

    render() {
        var index = 0,
            classPrefix = this.props.classPrefix,
            selectedIndex = this.props.selectedIndex,
            popupFactory = this.props.popupFactory,
            itemFactory = this.props.itemFactory,
            self = this,
            key, children, menuItem, styles;

        children = this.props.items ? this.props.items.map(function (data) {
            var classes = {};

            key = ITEM_ID_PREFIX + index;

            if (selectedIndex === index) {
                classes[classPrefix + 'menu-item-selected'] = true;
            }

            data = self.expandDescriptor(data);

            menuItem = itemFactory.createItem(_.assign({}, data, {
                id: key
            }), key, classnames(classes), self.props.config);

            index ++;

            return (menuItem);
        }): null;

        styles = {
            position: 'fixed',
            left: this.props.x + 'px',
            top: this.props.y + 'px'
        };

        return popupFactory.createItem(_.assign({}, {
            popupId: this.props.popupId,
            styles,
            children,
            showing: this.state.showing
        }));
    }

    componentDidMount() {
        var classPrefix = this.props.classPrefix,
            position;

        // measure DOM
        if (!this.dom) {
            this.dom = ReactDOM.findDOMNode(this);
            this.dom.style.position = 'fixed';
        }

        // align
        position = this.aligner.align(this.dom, this.props.alignTo, this.props.hints, this.props.useOffset ? this.dom.firstChild : null);

        // bake some of the position information into popups' className
        if (!position.fitsX) {
            // if popup doesn't horizontally fit the screen, add this class name
            // this could be used to introduce scroll etc.
            this.dom.className += ' ' + classPrefix + 'menu-popup-overflow-x';
        }
        if (!position.fitsY) {
            // if popup doesn't vertically fit the screen, add this class name
            this.dom.className += ' ' + classPrefix + 'menu-popup-overflow-y';
        }
        if (position.direction) {
            // styling different positions ('menu-popup-align-es', 'menu-popup-align-se' etc.)
            this.dom.className += ' ' + classPrefix + 'menu-popup-align-' + position.direction;
        }

        this.setState({
            showing: true
        });
    }

    /**
     * Expands string descriptor to object descriptor
     * @param data
     * @returns {*}
     */
    expandDescriptor(data) {
        if (typeof data === 'string') {
            return {
                type: data
            }
        }
        if (!data.type) {
            data.type = DEFAULT_ITEM_RENDERER_TYPE;
        }
        return data;
    }
}
MenuPopup.propTypes = {
    config: React.PropTypes.object, // config object visiting every menu item
    classPrefix: React.PropTypes.string,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    items: React.PropTypes.arrayOf(React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.string])),
    popupId: React.PropTypes.string.isRequired,
    useOffset: React.PropTypes.bool.isRequired,
    hints: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    selectedIndex: React.PropTypes.number.isRequired
};
MenuPopup.defaultProps = {
    classPrefix: '',
    x: 0,
    y: 0,
    items: [],
    alignTo: null,
    useOffset: false,
    selectedIndex: -1
};
