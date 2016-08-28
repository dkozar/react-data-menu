import React, { Component } from 'react';
import Dom from './../util/Dom';

var classNames = require('classnames');

export default class MenuPopupFactory {

    constructor(classPrefix) {
        this.classPrefix = classPrefix;
    }

    createItem(config) {
        var className = classNames('showing', Dom.buildClassNames(this.classPrefix, ['menu-popup']));

        return (
            <div {...config.handlers} id={config.popupId} key={config.popupId} className={className} styles={config.styles}>
                {config.children}
            </div>
        );
    }
}