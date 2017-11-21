'use strict';
import React from 'react';
import ObjectHelper from '../../helper/object';
import Parameter from './parameter';

export default class Request extends React.Component {
    render() {
        const paramsWidth = {width: 350};
        const objHelper = new ObjectHelper();
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
                                return (<Parameter key={i} name={param.key} label={param.label} default={param.value} onChange={this.props.onChange} required={objHelper.isEmpty(param.required) || param.required}/>);
                            }
                        })}
                    </tbody>
                </table>
            </div>;
        }

        return (partial);
    }
}