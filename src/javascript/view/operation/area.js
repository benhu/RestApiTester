"use strict";
const React = require('react');

module.exports = React.createClass({
    render(){
        return (
            <div>
                <h4>{this.props.title}</h4>
                {this.props.children}
            </div>
        );
    }
});