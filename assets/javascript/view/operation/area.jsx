'use strict';
import React from 'react';

export default class Area extends React.Component {
    render(){
        return (
            <div>
                <h4>{this.props.title}</h4>
                {this.props.children}
            </div>
        );
    }
}