"use strict";

var http       = require('http');
var qs         = require('querystring');
var formidable = require('formidable');
var moment     = require('moment');
var path       = require('path');
var fs         = require('fs');
var CONSTANTS  = require('../constants');
var converter  = require('./converter');
var context    = require('../../context');
var apiErrors  = require('../../common/api_error');
var logger     = require('../../common/drivers/logger').getLogger();

var Errors = new apiErrors.Errors();
const PARKINGMANAGE = 'parking/';
const REPORT = 'filereport/';
const USER_IDENTITY_PATH = 'user/update'
const USER_IDENTITY = 'identity'

module.exports.parseParamAndSaveFiles = function (req, callback) {
    try{
        var path = req.path;
        var form=new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req,function(err,fields,files) {
            var param = {};
            if (err) {
                callback(err,param);
                return;
            }
            var param = converter.cloneObject(fields);
            callback(err,param);
        });
    } catch (err){
        logger.error('something wrong when create report file directory cause %s', err.message);
        let error = Errors.parseParamError();
        callback(error, {});
    }
}

module.exports.http_get = function (req,callback) {
    var response = {}
    var get_req = http.request(req, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            callback(null,chunk);
        });
    });
    get_req.on('error', function (err) {
        callback(err,response);
    });
    get_req.end();
}
