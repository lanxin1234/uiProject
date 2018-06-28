"use strict";

var winston = require('winston');
    require('winston-daily-rotate-file')
var moment = require('moment');

var logger = new winston.Logger({
  level: 'debug',
  transports: [
    new winston.transports.DailyRotateFile({
      name: 'service',
      filename: 'service.log',
      formatter: function(options) {
        // Return string will be passed to logger.
        var timestamp = moment().format('YYYY-MM-DD:HH:MM:SS');
        return timestamp +'|'+ options.level.toUpperCase() +'|'+ (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      },
      datePattern: 'yyyy-MM-dd-',
      prepend: true,
      maxFiles: 5
    }),
    new winston.transports.Console({
      handleExceptions: true,
      humanReadableUnhandledException: true,
      formatter: function(options) {
        // Return string will be passed to logger.
        var timestamp = moment().format('YYYY-MM-DD:HH:MM:SS');
        return timestamp +'|'+ options.level.toUpperCase() +'|'+ (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    })
  ],
  exceptionHandlers: [
    new winston.transports.DailyRotateFile({
      filename: 'view-exception.log',
      maxFiles: 5,
      handleExceptions: true,
      json: true,
      humanReadableUnhandledException: true
    })
  ]
})

module.exports.initialize = function(cfg) {
  logger = new winston.Logger({
    level: cfg.level,
    transports: [
      new winston.transports.DailyRotateFile({
        name: 'view-service-log',
        filename: cfg.filename,
        formatter: function(options) {
          // Return string will be passed to logger.
          var timestamp = moment().format('YYYY-MM-DD:HH:MM:SS');
          return timestamp +'|'+ options.level.toUpperCase() +'|'+ (options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
        },
        datePattern: 'yyyy-MM-dd-',
        prepend: true,
        maxFiles: 5
      }),
      new winston.transports.Console({
        handleExceptions: true,
        humanReadableUnhandledException: true,
        formatter: function(options) {
          // Return string will be passed to logger.
          var timestamp = moment().format('YYYY-MM-DD:HH:MM:SS');
          return timestamp +'|'+ options.level.toUpperCase() +'|'+ (options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
        }
      })
    ],
    exceptionHandlers: [
      new winston.transports.DailyRotateFile({
        filename: cfg.exceptionlog,
        maxFiles: 5,
        handleExceptions: true,
        json: true,
        humanReadableUnhandledException: true
      })
    ]
  })
}

module.exports.getLogger = function() {
  return logger
}
