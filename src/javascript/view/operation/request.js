"use strict";
var React = require('react');
var ObjectHelper = require('../../helper/object.js');
var Parameter = require('./parameter.js');

module.exports = React.createClass({
    render() {
        const paramsWidth = {width: 350};

        let partial = null;

        if(this.props.params.length > 0) {
            partial =
                <div className="request">
                <h4>Parameters</h4>
                <table>
                    <thead>
                        <tr>
                            <th style={paramsWidth}>Parameter</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.params.map((param, i) => {
                            if(param){
                                return (<Parameter key={i} name={param.key} label={param.label} default={param.value} onChange={this.props.onChange} required={ObjectHelper.isEmpty(param.required) || param.required}/>);
                            }
                        })}
                    </tbody>
                </table>
            </div>;
        }

        return (partial);
    }
});