import React, { Component } from 'react';
import Dom from './../util/Dom';

var classnames = require('classnames');

var DEFAULT_URL = '#',
    DEFAULT_TARGET = '_self';

export default class LinkRenderer extends Component {
    render() {
        var className = classnames(this.props.className, Dom.buildClassNames(this.props.classPrefix, ['menu-item-link'])),
            data = this.props.data;

        return (
            <div key={data.key} id={data.id} className={className}>
                <a href={data.url || DEFAULT_URL} target={data.target || DEFAULT_TARGET}>{data.title}</a>
            </div>
        );
    }
}
