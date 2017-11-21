'use strict';

export default class ObjectHelper {
    toKeyValueString (obj) {
        const keys = Object.keys(obj);
        let string = '';

        for(let i = 0; i < keys.length; ++i) {
            if(string && string.length > 0) {
                string += '\r\n';
            }
            string += keys[i] + ': ' + obj[keys[i]];
        }

        return string;
    }
    
    isEmpty(value) {
        return typeof value === 'undefined' || value === '';
    }
}