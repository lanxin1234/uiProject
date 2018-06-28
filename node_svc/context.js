/* global __dirname */
/* global process */
'use strict';

var path         = require('path');
var yaml         = require('js-yaml');
var fs           = require('fs');
var nock         = require('nock');
var OracleClient = require('./common/drivers/oracledb');

var context = {}

function loadCfg() {
    var cfgyml = path.join(__dirname, './server.yml');
    var cfg = yaml.safeLoad(fs.readFileSync(cfgyml, 'utf8'));
    if ( cfg.logging ) {
      require('./common/drivers/logger').initialize(cfg.logging);
    }

    if ( cfg.oracle ) {
      context.oracle = new OracleClient(cfg.oracle);
    }

}

module.exports = context;

module.exports.initialize = function () {
    loadCfg();
};
