"use strict";
const Operations = React.createClass({
    getInitialState() {
        return {
            apiData: {operations:[]}
        };
    },
    componentWillMount: function() {
        $.getJSON("data.json", function(result) {
            this.setState({
                apiData: result
            });
        }.bind(this));
    },
    render() {
        return (
            <ul className="operations">
                {this.state.apiData.operations.map((data, i) => {
                    if(data){
                        return (<Operation key={i} data={data}/>);
                    }
                })}
            </ul>
        );
    }
});

const Operation = React.createClass({
    render() {
        return(<li className={this.props.data.method + " operations"}>
                <HeaderOperation httpMethod={this.props.data.method} path={this.props.data.path} description={this.props.data.description}/>
                <ContentOperation parameters={this.props.data.parameters}/>
            </li>
            );
    }
});

const HeaderOperation = React.createClass({
    render() {
        return (
            <div className="heading">
                <h3>
                    <span className="http_method">{this.props.httpMethod}</span>
                    <span className="path">{this.props.path}</span>
                </h3>
                <span className="options">{this.props.description}</span>
            </div>
            );
    }
});

const ContentOperation = React.createClass({
    getInitialState() {
        return {
            response: {}
        };
    },
    render() {
        return (
            <div className="content">
                <Request/>
                <Sandbox/>
                <Result/>
            </div>
        );
    }
});

const Request = React.createClass({
    render() {
        return (
            <div className="request">
                <h4>Parameters</h4>
            </div>
        );
    }
});

const Sandbox = React.createClass({
    render() {
        return (
            <div className="sandbox">
                <input type="button" value="Try it out!" />
            </div>
        );
    }
});

const Result = React.createClass({
    render() {
        return (
            <div class="response">
                <Area title="Request URL">
                    <div className="request_url">
                        <pre></pre>
                    </div>
                </Area>
                <Area title="Response Code">
                    <div className="response_code">
                        <pre></pre>
                    </div>
                </Area>
                <Area title="Response Body">
                    <div className="response_json">
                        <pre className="json"></pre>
                    </div>
                </Area>
            </div>
        );
    }
});

const Area = React.createClass({
    render(){
        return (
            <div>
                <h4>{this.props.title}</h4>
                {this.props.children}
            </div>
        );
    }
});

React.render(
	<Operations/>,
	document.getElementById('container')
);