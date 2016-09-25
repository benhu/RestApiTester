'use strict';
import React from 'react';
import Qwest from 'qwest';
import BaseComponent from './base.jsx';
import Operation from './operation.jsx';

export default class Rat extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {apiData: {operations:[]}};
    }

    componentWillMount() {
        Qwest.get('data.json').then((xhr, result) => {
            this.setState({apiData: result});
        });
    }

    render() {
        return (
            <ul className="operations">
                {this.state.apiData.operations.map((data, i) => {
                    if(data){
                        return (<Operation key={i} data={data} server={this.state.apiData.server} canBeLocalhost={this.state.apiData.localhost}/>);
                    }
                })}
            </ul>
        );
    }
}