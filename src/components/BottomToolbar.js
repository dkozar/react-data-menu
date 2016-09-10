import React, { Component } from 'react';
import DropdownMenu from './DropdownMenu.js';
import { items1 } from './../data/items1.js';
import { items2 } from './../data/items2.js';
import { aboutItems } from './../data/aboutItems.js';
import AboutRenderer from './../renderers/AboutRenderer.js';

export default class BottomToolbar extends Component {
    render() {
        var hints = function() {
            return ['ne']
        }, renderers = {
            'about': AboutRenderer
        };

        /* Bottom toolbar - let's not toggle these buttons */
        return (
            <div className='toolbar toolbar-bottom'>

                { /* Custom button example */ }
                <DropdownMenu items={items1} {...this.props} toggleMode={false}>
                    <button className='menu-button'>Menu 4</button>
                </DropdownMenu>

                <DropdownMenu buttonText='Menu 5' items={items2} {...this.props} toggleMode={false} />
                <DropdownMenu buttonText='Menu 6' items={items2} {...this.props} toggleMode={false} />

                { /* Tooltip example (single item menu and custom button) */ }
                <DropdownMenu
                    items={aboutItems}
                    classPrefix='about-'
                    toggleMode={false}
                    openOnMouseOver={true}
                    closeOnMouseOut={false}
                    mouseEnterDelay={500}
                    mouseLeaveDelay={2000}
                    hints={hints}
                    renderers={renderers}>
                    <button className='menu-button'><i className="fa fa-info-circle"></i></button>
                </DropdownMenu>
            </div>
        );
    }
}

BottomToolbar.propTypes = {
    onOpen: React.PropTypes.func.isRequired,
    openOnMouseOver: React.PropTypes.bool.isRequired
};