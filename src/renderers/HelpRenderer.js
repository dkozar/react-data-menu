import React, { Component } from 'react';

export class HelpRenderer extends Component {
    render() {
        var data = this.props.data;

        return (
            <div key={data.key} id={data.id} className='menu-item-help'>
                <div className='menu-item-help-title'>About</div>
                <div className='menu-item-help-text'>
                    This application is created using <a href={data.reactUrl} target={'_blank'}>ReactJS</a>.<br/>
                    React is a Javascript library for building<br/>user interfaces.
                </div>
                <div className='menu-item-help-copyright'>
                    <a href={data.copyrightUrl} target={'_blank'}>&copy;&nbsp;{data.copyright}</a>
                </div>
            </div>
        );
    }
}