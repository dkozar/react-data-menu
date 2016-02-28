import React, { Component } from 'react';
var classnames = require('classnames');

export class Separator extends Component {
    render() {
        var className = classnames(this.props.className, {
            'menu-item-separator': true
        });

        return (
            <hr className={className} key={this.props.key} />
        )
    }
}