import React, { Component } from 'react';

export default class AboutRenderer extends Component {
    render() {
        var data = this.props.data;

        return (
            <div key={data.key} id={data.id} className='about-menu-item'>
                <div className='about-menu-item-title'>
                    This application is created using ReactJS and Raycast.<br/>
                </div>
                <div className='about-menu-item-library'>
                    <a href={data.reactUrl} target={'_blank'}>React</a> is a Javascript library for building user interfaces.
                </div>
                <div className='about-menu-item-library'>
                    <a href={data.raycastUrl} target={'_blank'}>Raycast</a> is an event framework based on emitting rays onto the user interface.
                </div>
                <div className='about-menu-item-copyright'>
                    <a href={data.copyrightUrl} target={'_blank'}><i className="fa fa-copyright"></i>&nbsp;{data.copyright}</a>
                </div>
            </div>
        );
    }
}