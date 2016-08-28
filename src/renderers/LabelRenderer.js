import React, { Component } from 'react';
import Dom from './../util/Dom';

var classnames = require('classnames');

export class Label extends Component {
    render() {
        var className = classnames(this.props.className, Dom.buildClassNames(this.props.classPrefix, ['menu-item-label'])),
        data = this.props.data;

        return (
            <label key={data.key} id={data.id} className={className} >
                {data.title}
            </label>
        );
    }
}