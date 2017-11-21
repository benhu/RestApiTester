'use strict';

export default class ArrayHelper {
    isInArray (value, array) {
        return array.indexOf(value) > -1;
    }

    getParam (key, params) {
        for(let i = 0; i < params.length; ++i) {
            if (params[i].key == key) {
                return params[i];
            }
        }
        return null;
    }
}