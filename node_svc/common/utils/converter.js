'use strict';

module.exports.cloneObject = function cloneObject(src) {

    var dest = {};
    if(typeof(src) === 'object') {
        for (var key in src) {

            if (typeof(src) === 'object') {

                dest[key] = cloneObject(src[key]);
            } else {
                dest[key] = src[key];
            }
        }
    } else {
        dest = src
    }
    return dest;
}

module.exports.nullToEmpty = function nullToEmpty(src) {
    var dest = {};
    if(typeof(src) === 'object') {
        for (var key in src) {
            if (typeof src === "object") {
                dest[key] = nullToEmpty(src[key]);
            } else {
                if (!src[key]) {
                    dest[key] = '';
                } else {
                    dest[key] = src[key];
                }
            }
        }
    }
    return dest;
}