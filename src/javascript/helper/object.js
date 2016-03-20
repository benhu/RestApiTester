"use strict";
module.exports = self = {
    toKeyValueString: (obj) => {
        const keys = Object.keys(obj);
        let string = '';

        for(var i = 0; i < keys.length; ++i) {
            if(string && string.length > 0) {
                string += '\r\n';
            }
            string += keys[i] + ': ' + obj[keys[i]];
        }

        return string;
    },
    isEmpty: (value) => {
        return typeof value === 'undefined' || value === '';
    }
};