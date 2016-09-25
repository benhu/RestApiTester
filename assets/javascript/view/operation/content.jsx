'use strict';
import React from 'react';
import Qwest from 'qwest';
import UrlHelper from '../../helper/url.js';
import Request from './request.jsx';
import Sandbox from './sandbox.jsx';
import Result from './result.jsx';

export default class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: [],
            response: {},
            request: {},
            isLoading: false,
            qwestReq: null
        };
        this.bind('onParamsChange', 'onSubmit', 'onClear', 'onStop');
    }

    bind(...methods) {
        methods.forEach((method) => this[method] = this[method].bind(this));
    }

    componentWillMount() {
        this.setState({
            params: this.props.data.parameters
        });
    }

    onParamsChange(key, value){

        let params = this.state.params;

        for(let i = 0; i < params.length; ++i) {
            if (params[i].key == key) {
                params[i].value = value;
                break;
            }
        }

        this.setState({params: params});
    }

    onSubmit() {
        let req = {};
        let qwestReq = null;

        const urlHelper = new UrlHelper();
        const ajaxData = urlHelper.createUrl(this.props.server, this.props.canBeLocalhost, this.props.data.path, this.props.method, this.state.params);

        if(ajaxData.allowed)
        {
            req.url = ajaxData.url;
            req.headers = ajaxData.headers;

            this.setState({request: req, isLoading: true});

            req.content = ajaxData.data;

            qwestReq = Qwest.map(
                this.props.data.method,
                req.url,
                req.content,
                {
                    dataType: 'json',
                    headers: req.headers,
                    cache: true
                }
            ).then((xhr) => {
                this.setState({response: xhr, isLoading: false});
            }).catch((e, xhr) => {
                this.setState({response: xhr, isLoading: false});
            });

            this.setState({qwestReq: qwestReq});
        }
    }

    onClear() {
        this.setState({response: {}});
    }

    onStop() {
        this.state.qwestReq.abort();
        this.setState({qwestReq: null, isLoading: false});
    }

    render() {
        const hasResponse = Object.keys(this.state.response).length > 0 || Object.keys(Object.getPrototypeOf(this.state.response)).length > 0;

        /*return (
            <div className={"content" + (this.props.display ? "" : " hidden")}>
                <Request onChange={this.onParamsChange} params={this.state.params}/>
                <Sandbox onSubmit={this.onSubmit} onClear={this.onClear} onStop={this.onStop} hasResponse={hasResponse} loading={this.state.isLoading}/>
                <Result request={this.state.request} response={this.state.response}/>
            </div>
        );*/
        return (
            <div className={"content" + (this.props.display ? "" : " hidden")}>
                <Request onChange={this.onParamsChange} params={this.state.params}/>
                <Sandbox onSubmit={this.onSubmit} onClear={this.onClear} onStop={this.onStop} hasResponse={hasResponse} loading={this.state.isLoading}/>
                <Result request={this.state.request} response={this.state.response}/>
            </div>
        );
    }
}