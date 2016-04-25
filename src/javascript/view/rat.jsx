"use strict";
const qwest         = require('qwest'),
      React         = require('react'),
      Operation     = require('./operation.jsx');

module.exports = React.createClass({
    getInitialState() {
        return {
            apiData: {operations:[]}
        };
    },
    componentWillMount() {
        qwest.get('data.json').then((xhr, result) => {
            this.setState({apiData: result});
        });
    },
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
});