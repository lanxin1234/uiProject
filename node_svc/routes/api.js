/* global __dirname */
/* global process */
'use strict';

var express = require('express');
var router = express.Router();
var logger = require('../common/drivers/logger').getLogger();
var dashboard = require('../api/v1/dashboard');

var context = {};

const API_URL_PREFIX = '/api/v1';

function loadApi() {
  var apis = [dashboard];
  apis.forEach(function(apiObj) {
    var api = apiObj.register(context);
    api.forEach(function(rtObj) {
      var method = rtObj.method.toUpperCase();
      var url = API_URL_PREFIX + rtObj.url;
      logger.info('registing api %s with url %s', rtObj.handler.name, url);
      if ( method == 'POST' ) {
        router.route(url).post(rtObj.handler);
      } else if ( method == 'GET') {
        router.route(url).get(rtObj.handler);
      } else {
        router.all(url, rtObj.handler);
      }
    })
  })
}

module.exports = router;

module.exports.loadContext = function(cxt) {
  context = cxt;
}

module.exports.loadApis = function() {
  loadApi();
}
