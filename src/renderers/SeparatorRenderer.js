import React, { Component } from 'react';
import Dom from './../util/Dom';

var classnames = require('classnames');

export class Separator extends Component {
    render() {
        var className = classnames(this.props.className, Dom.buildClassNames(this.props.classPrefix, ['menu-item-separator']));

        return (
            <hr className={className} key={this.props.key} />
        )
    }
}