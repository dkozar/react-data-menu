import React, { Component } from 'react';
import Dom from './../util/Dom';

var classnames = require('classnames');

export class Button extends Component {
    render() {
        var className = classnames(this.props.className, Dom.buildClassNames(this.props.classPrefix, ['menu-item-button'])),
            data = this.props.data,
            chevron = this.props.isExpandable ? <span className='fa fa-chevron-right fa-fw'></span> : null;

        return (
            <button {...data.handlers} key={data.key} id={data.id} className={className}>
                {data.title}
                {chevron}
            </button>
        );
    }
}