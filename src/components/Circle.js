import _ from 'lodash';
import React, { Component } from 'react';

export const CIRCLE_ID_PREFIX = 'circle-';

export default class Circle extends Component {

    render() {
        var isHovered = this.props.hovered,
            shouldShowLine = isHovered || this.props.selected,
            config = {
                cx: this.props.x,
                cy: this.props.y,
                r: this.props.r,
                fill: this.props.color,
                strokeWidth: shouldShowLine ? 5 : 0,
                stroke: isHovered ? this.props.strokeColorHovered : this.props.strokeColorSelected
            };

        return (
            <circle {...config}
                id={this.props.id} />
        );
    }
}

Circle.propTypes = {
    id: React.PropTypes.string.isRequired,
    strokeColorSelected: React.PropTypes.string,
    strokeColorHovered: React.PropTypes.string,
    selected: React.PropTypes.bool,
    hovered: React.PropTypes.bool
};
Circle.defaultProps = {
    strokeColorSelected: 'white',
    strokeColorHovered: 'white',
    selected: false,
    hovered: false
};