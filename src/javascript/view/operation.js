"use strict";
var React = require('react');
var HeaderOperation = require('./operation/header.js');
var ContentOperation = require('./operation/content.js');

module.exports = React.createClass({
    getInitialState() {
        return {
            displayContent: false
        };
    },
    onHeaderClick() {
        this.setState({displayContent: !this.state.displayContent});
    },
    render() {
        return(
            <li className={this.props.data.method + " operations"}>
                <HeaderOperation httpMethod={this.props.data.method} path={this.props.data.path} description={this.props.data.description} onClick={this.onHeaderClick}/>
                <ContentOperation display={this.state.displayContent} data={this.props.data} server={this.props.server}/>
            </li>
        );
    }
});