'use strict';
import React from 'react';
import ObjectHelper from '../../helper/object.js';
import UrlHelper from '../../helper/url.js';
import Area from './area.jsx';

export default class Result extends React.Component {
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

            const objHelper = new ObjectHelper();
            const urlHelper = new UrlHelper();
            const url = urlHelper.relativeToAbsolute(this.props.request.url);

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
                                    <pre>{objHelper.toKeyValueString(head)}</pre>
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
}