'use strict';
/* global process */
/* global __dirname */


var logger       = require("./drivers/logger").getLogger();

const OK = 0;
const SUCCESS_MSG = '成功';

module.exports = {
  jsonResponse: function(req, res, data, err) {
    var message = {
      status: (err)
        ? err.code
        : OK,
      msg: (err)
        ? err.message
        : SUCCESS_MSG,
      data: (err)
        ? {}
        : data || {}
    };
    logger.debug("request %s get response %s", req.url, JSON.stringify(message));
    res.status(200).json(message);
  }
}
