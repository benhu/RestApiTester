"use strict";
const React = require('react'),
      HeaderOperation = require('./operation/header.jsx'),
      ContentOperation = require('./operation/content.jsx');

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
                <ContentOperation display={this.state.displayContent} data={this.props.data} server={this.props.server} canBeLocalhost={this.props.canBeLocalhost}/>
            </li>
        );
    }
});