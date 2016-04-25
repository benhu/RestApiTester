"use strict";
const React = require('react'),
      ObjectHelper = require('../../helper/object.js'),
      UrlHelper = require('../../helper/url.js'),
      Area = require('./area.jsx');

module.exports = React.createClass({
    render() {

        let partial = null;

        if(Object.keys(this.props.response).length > 0 || Object.keys(Object.getPrototypeOf(this.props.response)).length > 0) {

            let response = '';

            try
            {
                response = JSON.stringify(JSON.parse(this.props.response.responseText), null, 4);
            }
            catch(e)
            {
                response = this.props.response.responseText;
            }

            const url = UrlHelper.relativeToAbsolute(this.props.request.url);

            partial =
            <div className="response">
                <Area title="Request URL">
                    <div className="request_url">
                        <pre>{url}</pre>
                    </div>
                </Area>
                {(() => {
                    const head = this.props.request.headers;
                    if(head && Object.keys(head).length !== 0){
                        return(
                            <Area title="Request Headers">
                                <div className="request_headers">
                                    <pre>{ObjectHelper.toKeyValueString(head)}</pre>
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