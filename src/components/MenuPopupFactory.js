import React, { Component } from 'react';
var classNames = require('classnames');

export class MenuPopupFactory {

    createItem(config) {
        var className = classNames({
            'menu-popup': true,
            'showing': config.showing
        });

        return (
            <div {...config.handlers} id={config.popupId} key={config.popupId} className={className} styles={config.styles}>
                {config.children}
            </div>
        );
    }
}