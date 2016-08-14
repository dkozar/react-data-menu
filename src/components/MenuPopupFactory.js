import React, { Component } from 'react';
import { Dom } from './../util/Dom';

var classNames = require('classnames');

export class MenuPopupFactory {

    constructor(classPrefix) {
        this.classPrefix = classPrefix;
    }

    createItem(config) {
        var className = classNames(Dom.buildClassNames(this.classPrefix, ['menu-popup', 'showing']));

        return (
            <div {...config.handlers} id={config.popupId} key={config.popupId} className={className} styles={config.styles}>
                {config.children}
            </div>
        );
    }
}