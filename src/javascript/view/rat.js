"use strict";
var $ = require('jquery');
var React = require('react');
var Operation = require('./operation.js');

module.exports = React.createClass({
    getInitialState() {
        return {
            apiData: {operations:[]}
        };
    },
    componentWillMount() {
        $.getJSON("data.json").then((result) => {
            this.setState({
                apiData: result
            });
        });
    },
    render() {
        return (
            <ul className="operations">
                {this.state.apiData.operations.map((data, i) => {
                    if(data){
                        return (<Operation key={i} data={data} server={this.state.apiData.server}/>);
                    }
                })}
            </ul>
        );
    }
});