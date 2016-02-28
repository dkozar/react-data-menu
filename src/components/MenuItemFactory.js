import React, { Component } from 'react';
import ReactDOM from 'react-dom';
var classnames = require('classnames');

export class MenuItemFactory {

    constructor(renderers) {
        this.renderers = renderers;
    }

    createItem(data, key, classes) {
        var isExpandable = !!data.items,
            renderer = this.renderers[data.type],
            className = classnames(classes, {
                'menu-item': true,
                'menu-item-expandable': isExpandable
            });

        if (!renderer) {
            throw 'Undefined renderer for type [' + data.type + ']';
        }

        return React.createElement(renderer, {
            data,
            key,
            isExpandable,
            className
        });
    }
}