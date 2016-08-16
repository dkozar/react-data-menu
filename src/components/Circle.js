import _ from 'lodash';
import React, { Component } from 'react';
import { items1 } from './../data/items1.js';

export class Circle extends Component {

    constructor(props) {
        super(props);

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);

        this.state = {
            strokeWidth: this.props.selected ? 5 : 0,
            hovered: false
        }
    }

    onMouseOver() {
        this.setState({
            hovered: true
        });
    }

    onMouseOut() {
        this.setState({
            hovered: false
        });
    }

    getStroke() {
        return {
            strokeWidth: (this.props.selected || this.state.hovered) ? 5 : 0,
            stroke: this.state.hovered ? this.props.strokeColorHovered : this.props.strokeColorSelected
        }
    }

    render() {
        var d = _.assign({
            cx: this.props.x,
            cy: this.props.y,
            r: this.props.r,
            fill: this.props.color
        }, this.getStroke());

        return (
            <circle {...d}
                id={this.props.id}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut} />
        );
    }
}
Circle.propTypes = {
    id: React.PropTypes.string,
    strokeColorSelected: React.PropTypes.string,
    strokeColorHovered: React.PropTypes.string,
    selected: React.PropTypes.bool
};
Circle.defaultProps = {
    strokeColorSelected: 'white',
    strokeColorHovered: 'white',
    selected: false
};