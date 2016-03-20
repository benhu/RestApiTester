"use strict";
module.exports = self = {
    isInArray: (value, array) => {
        return array.indexOf(value) > -1;
    },
    getParam: (key, params) => {
        for(var i = 0; i < params.length; ++i) {
            if (params[i].key == key) {
                return params[i];
            }
        }
        return null;
    }
};