"use strict";
const Operations = React.createClass({
    getInitialState() {
        return {
            apiData: {operations:[]}
        };
    },
    componentWillMount() {
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
                        return (<Operation key={i} data={data} server={this.state.apiData.server}/>);
                    }
                })}
            </ul>
        );
    }
});

const Operation = React.createClass({
    render() {
        return(
            <li className={this.props.data.method + " operations"}>
                <HeaderOperation httpMethod={this.props.data.method} path={this.props.data.path} description={this.props.data.description}/>
                <ContentOperation data={this.props.data} server={this.props.server}/>
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
            params: [],
            response: {}
        };
    },
    componentWillMount() {
        this.setState({
            params: this.props.data.parameters
        });
    },
    onParamsChange(key, value){

        let params = this.state.params;

        $.each(params,() => {
            if (this.key == key) {
                this.value = value;
                return;
            }
        });

        this.setState({params: params});
    },
    onSubmit() {
        let data = {};

        this.state.params.forEach((element) => {
            data[element.key] = element.value;
        });

        var uri = this.props.server + this.props.data.path;

        uri = uri.replace(/([^:]\/)\/+/g, "$1");

        $.ajax({
            url: uri,
            type: this.props.data.method,
            data: data,
            contentType: "application/json; charset=UTF-8"
        });
    },
    render() {
        return (
            <div className="content">
                <Request onChange={this.onParamsChange} params={this.state.params}/>
                <Sandbox onSubmit={this.onSubmit}/>
                <Result response={this.state.response}/>
            </div>
        );
    }
});

const Request = React.createClass({
    onParamChange(key, value){
        if(this.props.onChange){
            this.props.onChange(key, value);
        }
    },
    render() {
        const paramsWidth = {width: 200};
        return (
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
                                return (<Parameter key={i} name={param.key} default={param.value} onChange={this.onParamChange}/>);
                            }
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
});

const Parameter = React.createClass({
    getInitialState() {
        return {
            id: uuid.v1(),
            value: ''
        };
    },
    componentWillMount() {
        if(this.props.default && typeof this.props.default === 'object'){
            this.setState({
                value: JSON.stringify(this.props.default, undefined, 4)
            });
        }else{
            this.setState({
                value: this.props.default
            });
        }
    },
    onInputChange(e){
        if(this.props.onChange){
            this.props.onChange(this.props.name, e.target.value);
        }
        this.setState({
            value: e.target.value
        });
    },
    onEditorChange(value){
        this.props.onChange(this.props.name, value);
    },
    render(){
        let input;

        if(this.props.name === 'body'){
            input = <AceEditor id={this.state.id} code={this.state.value} onChange={this.onEditorChange}/>;
        }else{
            input = <input id={this.state.id} type="text" value={this.state.value} onChange={this.onInputChange}/>;
        }
        return (
            <tr>
                <td>
                    <label htmlFor={this.state.id}>{this.props.name}</label>
                </td>
                <td>
                    {input}
                </td>
            </tr>
        );
    }
});

const AceEditor = React.createClass({
    propTypes: {
        mode: React.PropTypes.string,
        content: React.PropTypes.string,
    },
    componentDidMount() {
        const node = React.findDOMNode(this.refs.editor);
        const editor = ace.edit(node);
        editor.setTheme("ace/theme/chrome");
        editor.getSession().setMode("ace/mode/json");
        editor.setShowPrintMargin(false);
        editor.setOptions({minLines: 5});
        editor.setOptions({maxLines: 50});
        editor.getSession().on("change", () => {this.props.onChange(editor.getSession().getValue())});
    },
    onChange() {
        if (this.props.onChange && !this.silent) {
            const value = this.editor.getValue();
            this.props.onChange(value);
        }
    },
    render() {
        const style = {fontSize: '14px !important', border: '1px solid lightgray'};
        return (
            <div ref="editor" style={style}>
                {this.props.code}
            </div>
        );
    }
});


const Sandbox = React.createClass({
    send(e) {
        e.preventDefault();

        if(this.props.onSubmit){
            this.props.onSubmit();
        }
    },
    render() {
        return (
            <div className="sandbox">
                <input type="button" value="Try it out!" onClick={this.send}/>
            </div>
        );
    }
});

const Result = React.createClass({
    render() {

        let partial = null;

        if(Object.keys(this.props.response).length > 0) {
            partial =
            <div className="response">
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
            </div>;
        }

        return partial;
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