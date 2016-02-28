import React, { Component } from 'react';
var classnames = require('classnames');

export class Label extends Component {
    render() {
        var className = classnames(this.props.className, {
                'menu-item-label': true
            }),
            data = this.props.data;

        return (
            <label key={data.key} id={data.id} className={className} >
                {data.title}
            </label>
        );
    }
}