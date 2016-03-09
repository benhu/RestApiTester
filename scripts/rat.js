"use strict";
const getParam = (key, params) => {
    for(var i = 0; i < params.length; ++i) {
        if (params[i].key == key) {
            return params[i];
        }
    }

    return null;
};

const addParameterToUrl = (url, parameterName, parameterValue, atBeginning) => {
    let replaceDuplicates = true;
    let urlhash = null;
    let cl = 0;

    if(url.indexOf('#') > 0){
        cl = url.indexOf('#');
        urlhash = url.substring(url.indexOf('#'),url.length);
    } else {
        urlhash = '';
        cl = url.length;
    }
    const sourceUrl = url.substring(0,cl);

    const urlParts = sourceUrl.split("?");
    let newQueryString = "";

    if (urlParts.length > 1)
    {
        var parameters = urlParts[1].split("&");
        for (var i=0; (i < parameters.length); i++)
        {
            var parameterParts = parameters[i].split("=");
            if (!(replaceDuplicates && parameterParts[0] == parameterName))
            {
                if (newQueryString == "")
                    newQueryString = "?";
                else
                    newQueryString += "&";
                newQueryString += parameterParts[0] + "=" + (parameterParts[1]?parameterParts[1]:'');
            }
        }
    }
    if (newQueryString == "")
        newQueryString = "?";

    if(atBeginning){
        newQueryString = '?'+ parameterName + "=" + parameterValue + (newQueryString.length>1?'&'+newQueryString.substring(1):'');
    } else {
        if (newQueryString !== "" && newQueryString != '?')
            newQueryString += "&";
        newQueryString += parameterName + "=" + (parameterValue?parameterValue:'');
    }
    return urlParts[0] + newQueryString + urlhash;
};

const isInArray = (value, array) => {
  return array.indexOf(value) > -1;
};

const createUrl = (url, path, method, params) => {
    const regex = /\{(.*?)\}/g;
    let completeUri = url + path;
    let paramsUsed = [];
    let response = {};

    response.headers = {};

    completeUri = completeUri.replace(/([^:]\/)\/+/g, "$1");

    let match = regex.exec(path);

    while(match != null) {
        const param = getParam(match[1], params);

        if(param != null) {
            paramsUsed.push(param.key);
            completeUri = completeUri.replace(match[0], param.value);
        }

        match = regex.exec(path);
    }

    if(method != 'GET') {
        for(var i = 0; i < params.length; ++i) {
            if(params[i].type != 'header'){
                if(params[i].key != 'body') {
                    if(!isInArray(params[i].key, paramsUsed)) {
                        completeUri = addParameterToUrl(completeUri, params[i].key, params[i].value);
                    }
                } else {
                    response.data = params[i].value;
                }
            } else {
                response.headers[params[i].key] = params[i].value;
            }
        }
    }

    response.url = completeUri;

    return response;
};

const toKeyValueString = (obj) => {
    const keys = Object.keys(obj);
    let string = '';

    for(var i = 0; i < keys.length; ++i) {
        if(string && string.length > 0) {
            string += '\r\n';
        }
        string += keys[i] + ': ' + obj[keys[i]];
    }

    return string;
};