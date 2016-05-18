"use strict";
var objHelper = require('./object'),
    arrHelper = require('./array');

module.exports = self = {
    addParameterToUrl: (url, parameterName, parameterValue, atBeginning) => {
        let replaceDuplicates = true;
        let urlhash = null;
        let cl = 0;

        if (url.indexOf('#') > 0) {
            cl = url.indexOf('#');
            urlhash = url.substring(url.indexOf('#'), url.length);
        }
        else {
            urlhash = '';
            cl = url.length;
        }
        const sourceUrl = url.substring(0, cl);

        const urlParts = sourceUrl.split("?");
        let newQueryString = "";

        if (urlParts.length > 1) {
            var parameters = urlParts[1].split("&");
            for (let i = 0; (i < parameters.length); i++) {
                const parameterParts = parameters[i].split("=");
                if (!(replaceDuplicates && parameterParts[0] == parameterName)) {
                    if (newQueryString == "") {
                        newQueryString = "?";
                    } else {
                        newQueryString += "&";
                    }
                    newQueryString += parameterParts[0] + "=" + (parameterParts[1] ? parameterParts[1] : '');
                }
            }
        }
        if (newQueryString == "")
            newQueryString = "?";

        if (atBeginning) {
            newQueryString = '?' + parameterName + "=" + parameterValue + (newQueryString.length > 1 ? '&' + newQueryString.substring(1) : '');
        }
        else {
            if (newQueryString !== "" && newQueryString != '?')
                newQueryString += "&";
            newQueryString += parameterName + "=" + (parameterValue ? parameterValue : '');
        }
        return urlParts[0] + newQueryString + urlhash;
    },
    createUrl: (url, localhost, path, method, params) => {
        const regex = /\{(.*?)\}/g;
        let completeUri = url + path;
        let paramsUsed = [];
        let response = {};

        if(localhost && window.location.hostname == "localhost") {
            completeUri = self.getRootUrl() + path;
        }

        response.headers = {};
        response.allowed = true;

        completeUri = completeUri.replace(/([^:]\/)\/+/g, "$1");

        let match = regex.exec(path);

        while (match != null) {
            const param = arrHelper.getParam(match[1], params);

            if (param != null) {
                paramsUsed.push(param.key);
                completeUri = completeUri.replace(match[0], param.value);
            }

            match = regex.exec(path);
        }

        if (method != 'GET') {
            for (let i = 0; i < params.length; ++i) {

                if ((objHelper.isEmpty(params[i].required) || params[i].required) && objHelper.isEmpty(params[i].value)) {
                    response.allowed = false;
                    return response;
                }

                if (params[i].type != 'header') {
                    if (params[i].key != 'body') {
                        if (!arrHelper.isInArray(params[i].key, paramsUsed) && (!objHelper.isEmpty(params[i].value) || typeof params[i].default !== "undefined")) {
                            let paramsValue = objHelper.isEmpty(params[i].value) ? params[i].default : params[i].value;
                            paramsValue = encodeURIComponent(paramsValue);
                            completeUri = self.addParameterToUrl(completeUri, params[i].key, paramsValue);
                        }
                    }
                    else {
                        response.data = params[i].value;
                    }
                }
                else {
                    response.headers[params[i].key] = params[i].value;
                }
            }
        }

        response.url = completeUri;

        if(response.data && typeof response.data === 'string') {
            try {
                const jsonData = JSON.parse(response.data);
                response.data = jsonData;
            }
            catch(e) {}
        }

        return response;
    },
    relativeToAbsolute: (url) => {
        if (/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url)) {
            return url;
        }

        const base_url = location.href.match(/^(.+)\/?(?:#.+)?$/)[0] + "/";

        if (url.substring(0, 2) == "//") {
            return location.protocol + url;
        }
        else if (url.charAt(0) == "/") {
            return location.protocol + "//" + location.host + url;
        }
        else if (url.substring(0, 2) == "./") {
            url = "." + url;
        }
        else if (/^\s*$/.test(url)) {
            return "";
        }
        else {
            url = "../" + url;
        }

        url = base_url + url;

        while (/\/\.\.\//.test(url = url.replace(/[^\/]+\/+\.\.\//g, "")))
            url = url.replace(/\.$/, "").replace(/\/\./g, "").replace(/"/g, "%22")
                     .replace(/'/g, "%27").replace(/</g, "%3C").replace(/>/g, "%3E");

        return url;
    },
    getRootUrl: () => {
	    return window.location.origin ? window.location.origin + '/' : window.location.protocol + '/' + window.location.host;
    }
};