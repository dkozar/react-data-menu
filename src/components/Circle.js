import React, { Component } from 'react';
import { items1 } from './../data/items1.js';

export class Circle extends Component {

    constructor(props) {
        super(props);

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);

        this.state = {
            strokeWidth: 0
        }
    }

    onMouseOver() {
        this.setState({
            //r: this.props.r,
            strokeWidth: 5
        });
    }

    onMouseOut() {
        this.setState({
            //r: this.props.r,
            strokeWidth: 0
        });
    }

    render() {
        var d = {
            cx: this.props.x,
            cy: this.props.y,
            r: this.props.r,
            stroke: this.props.strokeColor,
            strokeWidth: this.state.strokeWidth,
            fill: this.props.color
        };

        return (
            <circle {...d}
                onContextMenu={this.props.onContextMenu}
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut} />
        );
    }
}
Circle.propTypes = { strokeColor: React.PropTypes.string };
Circle.defaultProps = { strokeColor: 'white' };