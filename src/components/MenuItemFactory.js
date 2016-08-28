import React, { Component } from 'react';
import ReactDOM from 'react-dom';

var classnames = require('classnames');

export default class MenuItemFactory {

    constructor(renderers, classPrefix) {
        this.renderers = renderers;
        this.classPrefix = classPrefix;
    }

    createItem(data, key, classes, config) {
        var isExpandable = !!data.items,
            renderer = this.renderers[data.type],
            additions = {},
            classPrefix = this.classPrefix,
            className;

            additions[this.classPrefix + 'menu-item'] = true;
            additions[this.classPrefix + 'menu-item-expandable'] = isExpandable;
            className = classnames(classes, additions);

        if (!renderer) {
            throw 'Undefined renderer for type [' + data.type + ']';
        }

        return React.createElement(renderer, {
            data,
            key,
            isExpandable,
            className,
            classPrefix,
            config
        });
    }
}