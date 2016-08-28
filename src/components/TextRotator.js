import React, { Component } from 'react';
import WrappyText from 'react-wrappy-text';

const texts = [
        'This menu is data driven (hierarchy is not hardcoded).',
        'Open the drop-down menu on top.',
        'Check out the bottom menu.',
        'Right-click the application background for context menu.',
        'Right-click the circle for another context menu.',
        'Menu popups are fully customizable. Menu items too.',
        'None of the popups should ever be cropped by screen edges.',
        'You can specify directions of popups by providing hints.'
    ];

export default class TextRotator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            text: texts[0]
        };

        this.start();
    }

    start() {
        this.interval = setInterval(
            () => {
                var index = (this.state.index + 1) % texts.length;

                this.setState({
                    index,
                    text: texts[index]
                });
            },
            5000
        );
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    render() {
        return (
            <WrappyText className='wrappy'>{this.state.text}</WrappyText>
        );
    }
}