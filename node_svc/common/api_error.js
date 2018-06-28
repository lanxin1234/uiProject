/* global __dirname */
/* global process */
"use strict";

var logger = require("./drivers/logger").getLogger();

const CODES = {
    SUCCESS: 0,
    SYSTEM_ERROR: 9999,
}

module.exports.Errors = function() {
    this.internalServerError = function(msg) {
        var errMessage = msg || '系统异常';
        var err = new Error(errMessage);
        err.code = CODES.SYSTEM_ERROR;
        return err;
    }
}
