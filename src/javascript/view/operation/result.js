"use strict";
var React = require('react');
var UrlHelper = require('../../helper/rat.js');
var Area = require('./area.js');

module.exports = React.createClass({
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
                                    <pre>{UrlHelper.toKeyValueString(head)}</pre>
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