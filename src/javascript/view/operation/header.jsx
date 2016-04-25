"use strict";
const React = require('react');

module.exports = React.createClass({
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
});