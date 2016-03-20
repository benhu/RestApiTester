'use strict';
const qwest         = require('qwest'),
      React         = require('react'),
      UrlHelper     = require('../../helper/url.js'),
      Request       = require('./request.js'),
      Sandbox       = require('./sandbox.js'),
      Result        = require('./result.js');

module.exports = React.createClass({
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

        const ajaxData = UrlHelper.createUrl(this.props.server, this.props.data.path, this.props.method, this.state.params);

        if(ajaxData.allowed)
        {
            req.url = ajaxData.url;
            req.headers = ajaxData.headers;

            this.setState({request: req});

            req.content = this.props.data.method === 'post' ? JSON.stringify(ajaxData.data) : ajaxData.data;

            qwest.map(
                this.props.data.method,
                req.url,
                req.content,
                {
                    dataType: 'json',
                    headers: req.headers
                }
            ).then((xhr) => {
                this.setState({response: xhr});
            }).catch((e, xhr) => {
                this.setState({response: xhr});
            });
        }
    },
    onClear() {
        this.setState({response: {}});
    },
    render() {
        const hasResponse = Object.keys(this.state.response).length > 0 || Object.keys(Object.getPrototypeOf(this.state.response)).length > 0;

        return (
            <div className={"content" + (this.props.display ? "" : " hidden")}>
                <Request onChange={this.onParamsChange} params={this.state.params}/>
                <Sandbox onSubmit={this.onSubmit} onClear={this.onClear} hasResponse={hasResponse}/>
                <Result request={this.state.request} response={this.state.response}/>
            </div>
        );
    }
});