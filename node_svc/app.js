/* global __dirname */
/* global process */
'use strict';

let express                = require('express');
let path                   = require('path');
let bodyParser             = require('body-parser');
let compression            = require('compression');
let morgan                 = require('morgan');
let cors                   = require("cors");
let url                    = require('url');
let http                   = require('http');
let yaml                   = require('js-yaml');
let fs                     = require('fs');
let apiError               = require('./common/api_error');
let jsonResponseV2         = require('./common/misc').jsonResponseV2;

var Errors = new apiError.Errors();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var cfgyml = path.join(__dirname, './server.yml');
var cfg = yaml.safeLoad(fs.readFileSync(cfgyml, 'utf8'));

//load global drivers
var context = require('./context');
context.initialize();

var logger = require('./common/drivers/logger').getLogger();
logger.info("-Initializing view Api Service Application-")

// catch all unknown exceptions
process.on('uncaughtException', function(err) {
    logger.error('Caught exception: ' + err);
});

// get rest app port and host

var port = cfg.server.port;
var host = cfg.server.host;

////////  Pathing and Module Setup  ////////
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Enable CORS preflight across the board.
app.options('*', cors());
app.use(cors());

/////  api routing ////////////

var apis = require('./routes/api');
apis.loadContext(context);
apis.loadApis();
app.use('/', apis);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    var errorCode = err.status || 500;
    res.status(errorCode);
    res.json({status: errorCode,msg: err.stack,data:{}});
});

// create http Server
logger.info('Start Restful Http server on port %s', port);

var server = http.createServer(app).listen(port, host, {fd: 7});
server.timeout = 300000;

logger.info(`Worker ${process.pid} started`);
