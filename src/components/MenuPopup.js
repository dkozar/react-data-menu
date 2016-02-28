import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Aligner } from './../util/Aligner.js';
import { HoverData } from './../util/HoverData.js';
import _ from 'lodash';

var classnames = require('classnames');

export class MenuPopup extends Component {

    constructor(props) {
        super(props);

        this.aligner = this.props.aligner;
        this.onItemClick = this.onItemClick.bind(this);
        this.onPopupContextMenu = this.onPopupContextMenu.bind(this);
        this.onItemMouseEnter = this.onItemMouseEnter.bind(this);
        this.onItemMouseLeave = this.onItemMouseLeave.bind(this);
        this.state = {
            indexMap: {},
            showing: false,
            selectedIndex: -1
        };
    }

    buildHoverData(data, e) {
        var popupId = this.props.popupId,
            buttonId = e.currentTarget.id,
            index = this.state.indexMap[buttonId],
            self = this;

        self.setState({
            selectedIndex: index
        });

        return new HoverData(popupId, buttonId, index, e.currentTarget, data);
    }

    onPopupContextMenu(e) {
        e.preventDefault();
    }

    onItemClick(data, e) {
        this.props.onItemClick(this.buildHoverData(data, e));
    }

    onItemContextMenu(data, e) {
        e.preventDefault();
        this.props.onItemContextMenu(this.buildHoverData(data, e));
    }

    onItemMouseEnter(data, e) {
        this.props.onItemMouseEnter(this.buildHoverData(data, e));
    }

    onItemMouseLeave(data, e) {
        this.props.onItemMouseLeave(this.buildHoverData(data, e));
    }

    render() {
        var index = 0,
            self = this,
            popupFactory = this.props.popupFactory,
            itemFactory = this.props.itemFactory,
            indexMap = this.state.indexMap,
            key, children, menuItem,
            styles;

        children = this.props.items ? this.props.items.map(function (data) {
            key = 'menu-item-' + index;
            indexMap[key] = index;

            var classes = classnames({
                'menu-item-selected': self.state.selectedIndex === index
            });

            data = self.expandDescriptor(data);

            // overriding standard handlers with data handlers
            var handlers = _.assign({
                onClick: self.onItemClick.bind(self, data),
                onContextMenu: self.onItemContextMenu.bind(self, data),
                onMouseEnter: self.onItemMouseEnter.bind(self, data),
                onMouseLeave: self.onItemMouseLeave.bind(self, data)
            }, data.handlers);

            menuItem = itemFactory.createItem(_.assign({}, data, { // BUG FIX "{}, "
                id: key,
                handlers
            }), key, classes);

            index ++;

            return (menuItem);
        }): null;

        styles = {
            position: 'fixed',
            left: this.props.x + 'px',
            top: this.props.y + 'px'
        };

        var handlers = {
            onContextMenu: self.onPopupContextMenu
        };

        return popupFactory.createItem(_.assign({}, {
            popupId: this.props.popupId,
            styles,
            children,
            handlers,
            showing: this.state.showing
        }));
    }

    componentDidMount() {
        // measure DOM
        if (!this.dom) {
            this.dom = ReactDOM.findDOMNode(this);
            this.dom.style.position = 'fixed';
        }

        // align
        this.aligner.align(this.dom, this.props.alignTo, this.props.hints, this.props.useOffset ? this.dom.firstChild : null);

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
            data.type = 'button'; // default renderer type
        }
        return data;
    }
}
MenuPopup.propTypes = {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    items: React.PropTypes.arrayOf(React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.string])),
    popupId: React.PropTypes.string.isRequired,
    useOffset: React.PropTypes.bool.isRequired,
    onPopupContextMenu: React.PropTypes.func.isRequired,
    hints: React.PropTypes.arrayOf(React.PropTypes.string)
};
MenuPopup.defaultProps = {
    x: 0,
    y: 0,
    items: [],
    alignTo: null,
    hints: ['right', 'left', 'bottom', 'top', 'bottom'],
    useOffset: false,
    onPopupContextMenu(e) {}
};