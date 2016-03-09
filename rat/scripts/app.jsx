"use strict";
const Operations = React.createClass({
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

const Operation = React.createClass({
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

const HeaderOperation = React.createClass({
    render() {
        return (
            <div className="heading" onClick={this.props.onClick}>
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
            response: {},
            request: {}
        };
    },
    componentWillMount() {
        this.setState({
            params: this.props.data.parameters
        });
    },
    onParamsChange(key, value){

        let params = this.state.params;

        for(var i = 0; i < params.length; ++i) {
            if (params[i].key == key) {
                params[i].value = value;
                break;
            }
        }

        this.setState({params: params});
    },
    onSubmit() {
        let req = {};

        const ajaxData = createUrl(this.props.server, this.props.data.path, this.props.method, this.state.params);

        req.url = ajaxData.url;
        req.headers = ajaxData.headers;

        this.setState({request: req});

        req.content = this.props.data.method === 'post' ? JSON.stringify(ajaxData.data) : ajaxData.data;

        $.ajax({
            url: req.url,
            type: this.props.data.method,
            data: req.content,
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            headers: req.headers,
            complete: (xhr) => {
                this.setState({response: xhr});
            }
        });
    },
    onClear() {
        this.setState({response: {}});
    },
    render() {
        const hasResponse = Object.keys(this.state.response).length > 0;

        return (
            <div className={"content" + (this.props.display ? "" : " hidden")}>
                <Request onChange={this.onParamsChange} params={this.state.params}/>
                <Sandbox onSubmit={this.onSubmit} onClear={this.onClear} hasResponse={hasResponse}/>
                <Result request={this.state.request} response={this.state.response}/>
            </div>
        );
    }
});

const Request = React.createClass({
    render() {
        const paramsWidth = {width: 200};

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
                                return (<Parameter key={i} name={param.key} label={param.label} default={param.value} onChange={this.props.onChange} required={!param.required || param.required}/>);
                            }
                        })}
                    </tbody>
                </table>
            </div>;
        }

        return (partial);
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

        const attr = this.props.required ? {required: "required", placeholder:"(required)"} : {};

        if(this.props.name === 'body'){
            input = <AceEditor id={this.state.id} code={this.state.value} onChange={this.onEditorChange} {...attr}/>;
        }else{
            input = <input id={this.state.id} type="text" value={this.state.value} onChange={this.onInputChange} {...attr}/>;
        }

        const label = this.props.label ? this.props.label : this.props.name;

        return (
            <tr>
                <td>
                    <label htmlFor={this.state.id}>{label}</label>
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
    clear(e) {
        e.preventDefault();

        if(this.props.onClear){
            this.props.onClear();
        }
    },
    render() {
        let partial = null;

        if(this.props.hasResponse){
            partial = <input type="button" value="Clear response" onClick={this.clear}/>;
        }

        return (
            <div className="sandbox">
                <input type="button" value="Try it out!" onClick={this.send}/>
                {partial}
            </div>
        );
    }
});

const Result = React.createClass({
    render() {

        let partial = null;

        if(Object.keys(this.props.response).length > 0) {

            let response = '';

            try
            {
                response = JSON.stringify(JSON.parse(this.props.response.responseText), null, 4);
            }
            catch(e)
            {
                response = this.props.response.responseText;
            }

            partial =
            <div className="response">
                <Area title="Request URL">
                    <div className="request_url">
                        <pre>{this.props.request.url}</pre>
                    </div>
                </Area>
                {(() => {
                    const head = this.props.request.headers;
                    if(head && Object.keys(head).length !== 0){
                        return(
                            <Area title="Request Headers">
                                <div className="request_headers">
                                    <pre>{toKeyValueString(head)}</pre>
                                </div>
                            </Area>
                        );
                    }
                })()}
                <Area title="Response Code">
                    <div className="response_code">
                        <pre>{this.props.response.status}</pre>
                    </div>
                </Area>
                <Area title="Response Headers">
                    <div className="response_headers">
                        <pre>{this.props.response.getAllResponseHeaders()}</pre>
                    </div>
                </Area>
                <Area title="Response Body">
                    <div className="response_json">
                        <pre className="json">{response}</pre>
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