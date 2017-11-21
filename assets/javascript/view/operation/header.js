'use strict';
import React from 'react';

export default class Header extends React.Component {
    render() {
        return (
            <div className="heading" onClick={this.props.onClick}>
                <h3>
                    <span className="http_method">{this.props.httpMethod}</span>
                    <span className="path">{this.props.path}</span>
                </h3>
                <span className="options">{this.props.description}</span>
            </div>
        );
    }
}