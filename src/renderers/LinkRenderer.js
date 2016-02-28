import React, { Component } from 'react';
var classnames = require('classnames');

var DEFAULT_URL = '#',
    DEFAULT_TARGET = '_self';

export class LinkRenderer extends Component {
    render() {
        var className = classnames(this.props.className, {
                'menu-item-link': true
            }),
            data = this.props.data;

        return (
            <div key={data.key} id={data.id} className={className}>
                <a href={data.url || DEFAULT_URL} target={data.target || DEFAULT_TARGET}>{data.title}</a>
            </div>
        );
    }
}
