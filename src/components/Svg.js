import React, { Component } from 'react';

export default class Svg extends Component {
    render() {
        return (
            <svg x={this.props.top} width={this.props.width} height={this.props.height}>
                {this.props.children}
            </svg>
        );
    }
}