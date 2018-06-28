/* global __dirname */
/* global process */
/*jshint esversion: 6 */
'use strict';

let async          = require('async');
let moment         = require('moment');
let url            = require('url');
let oracledb       = require('oracledb');
let CONSTANTS      = require('../../common/constants');
let jsonResponse   = require('../../common/misc').jsonResponse;
let apiErrors      = require('../../common/api_error');
let logger         = require('../../common/drivers/logger').getLogger();

let Errors = new apiErrors.Errors();
let context = {};

// API module register
// returns an array of API specifications
module.exports.register = function (cxt) {
  context = cxt;
  return [
    {url: '/dashboard/viewInterfaceA', method: 'get', handler: viewInterfaceAHandler},
    {url: '/dashboard/viewInterfaceB', method: 'get', handler: viewInterfaceBHandler},
    {url: '/dashboard/viewInterfaceC', method: 'get', handler: viewInterfaceCHandler},
    {url: '/dashboard/viewInterfaceD', method: 'get', handler: viewInterfaceDHandler},
    {url: '/dashboard/viewInterfaceE', method: 'get', handler: viewInterfaceEHandler},
    {url: '/dashboard/viewInterfaceF', method: 'get', handler: viewInterfaceFHandler},
    {url: '/dashboard/viewInterfaceG', method: 'get', handler: viewInterfaceGHandler},
    {url: '/dashboard/viewInterfaceH', method: 'get', handler: viewInterfaceHHandler},
    {url: '/dashboard/viewInterfaceISales', method: 'get', handler: viewInterfaceISalesHandler},
    {url: '/dashboard/viewInterfaceIProfit', method: 'get', handler: viewInterfaceIProfitHandler},
    {url: '/dashboard/viewInterfaceJ', method: 'get', handler: viewInterfaceJHandler},
    {url: '/dashboard/getStore', method: 'get', handler: getStoreHandler},
    ];
};

function viewInterfaceAHandler(req, res) {
  let oracleClient = context.oracle;
  async.auto({
    getConn: function(callback) {
      oracleClient.getConnection(function(err, connection) {
        if (err) {
          logger.error('get oracle connection failed: [%s]', err.message);
          callback(null, null);
          return;
        }
        callback(null, connection);
      });
    },
    TotalOrder: ['getConn', function(callback, result) {
      result.getConn.execute(oracleClient.SQL.totalOrder, function(err, result) {
        if(err) {
          logger.error('get oracle connection failed: [%s]', err.message);
          callback(null, null);
          return;
        }
        callback(null, result.rows);
      })
    }],
    orderAmount: ['getConn', function(callback, result) {
      result.getConn.execute(oracleClient.SQL.orderAmount, function(err, result) {
        if(err) {
          logger.error('get oracle connection failed: [%s]', err.message);
          callback(null, null);
          return;
        }
        callback(null, result.rows);
      });
    }],
    perCustomerTransaction: ['getConn', function(callback, result) {
      result.getConn.execute(oracleClient.SQL.perCustomerTransaction, function(err, result) {
        if(err) {
          logger.error('get oracle connection failed: [%s]', err.message);
          callback(null, null);
          return;
        }
        callback(null, result.rows);
      });
    }],
    onlineSales: ['getConn', function(callback, result) {
      result.getConn.execute(oracleClient.SQL.onlineSales, function(err, result) {
        if(err) {
          logger.error('get oracle connection failed: [%s]', err.message);
          callback(null, null);
          return;
        }
        callback(null, result.rows);
      });
    }],
    trafficCounting: ['getConn', function(callback, result) {
      result.getConn.execute(oracleClient.SQL.trafficCounting, function(err, result) {
        if(err) {
          logger.error('get oracle connection failed: [%s]', err.message);
          callback(null, null);
          return;
        }
        callback(null, result.rows);
      });
    }],
    conversionRates: ['getConn', function(callback, result) {
      result.getConn.execute(oracleClient.SQL.conversionRates, function(err, result) {
        if(err) {
          logger.error('get oracle connection failed: [%s]', err.message);
          callback(null, null);
          return;
        }
        callback(null, result.rows);
      });
    }]
  }, function(err, result) {
    if (err) {
      return jsonResponse(req, res, result, err);
    }
    delete result.getConn;
    return jsonResponse(req, res, result);
  });
};

function viewInterfaceBHandler(req, res) {
    let param = url.parse(req.url, true).query;
    let oracleClient = context.oracle;
    async.waterfall([
        function(callback) {
            oracleClient.getConnection(function(err, connection) {
                if (err) {
                    logger.error('get oracle connection failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                connection.execute(oracleClient.SQL.saleMap, function(err, result) {
                    if (err) {
                        logger.error('execute dataTrend failed: [%s]', err.message);
                        callback(null, null);
                        return;
                    }
                    let res = [];
                    for (let data of result.rows) {
                        data = {
                            id: data[0],
                            paytime: moment(data[1]).format('YYYY-MM-DD HH:mm:ss'),
                            longlat: [data[2], data[3]],
                            store: data[4],
                            price: data[5]
                        };
                        res.push(data);
                    }
                    return callback(null, res);
                })
            })
        }
    ], function(err, result) {
        if (err) {
            return jsonResponse(req, res, result, err);
        }
        return jsonResponse(req, res, result);
    });
};

function viewInterfaceCHandler(req, res) {
    let param = url.parse(req.url, true).query;
    let oracleClient = context.oracle;
    async.waterfall([
        function(callback) {
            oracleClient.getConnection(function(err, connection) {
                if (err) {
                    logger.error('get oracle connection failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                let sql = oracleClient.SQL.dataTrend;
                let parameter = [];
                if (param.num) {
                    sql = oracleClient.SQL.dataTrendParam;
                    parameter.push(param.num);
                }
                connection.execute(sql, parameter, function(err, result) {
                    if (err) {
                        logger.error('execute dataTrend failed: [%s]', err.message);
                        callback(null, null);
                        return;
                    }
                    for (let data of result.rows) {
                        data[0] = moment(data[0]).format('YYYY-MM');
                    }
                    return callback(null, result.rows);
                })
            })
        }
    ], function(err, result) {
        if (err) {
            return jsonResponse(req, res, result, err);
        }
        return jsonResponse(req, res, result);
    });
};

function viewInterfaceDHandler(req, res) {
    let oracleClient = context.oracle;
    async.waterfall([
        function(callback) {
            oracleClient.getConnection(function(err, connection) {
                if (err) {
                    logger.error('get oracle connection failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                connection.execute(oracleClient.SQL.topStores, function(err, result) {
                    if (err) {
                        logger.error('execute topStores failed: [%s]', err.message);
                        callback(null, null);
                        return;
                    }
                    return callback(null, result.rows);
                })
            })
        }
    ], function(err, result) {
        if (err) {
            return jsonResponse(req, res, result, err);
        }
        return jsonResponse(req, res, result);
    });
};

function viewInterfaceEHandler(req, res) {
    let oracleClient = context.oracle;
    let param = url.parse(req.url, true).query;
    async.waterfall([
        function(callback) {
            oracleClient.getConnection(function(err, connection) {
                if (err) {
                    logger.error('get oracle connection failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                let sql = oracleClient.SQL.saleProgress;
                let parameter = [];
                if (param.num) {
                    sql = oracleClient.SQL.storeSalesProcess;
                    parameter = [param.num];
                }
                connection.execute(sql, parameter, function(err, result) {
                    if (err) {
                        logger.error('execute saleProgress failed: [%s]', err.message);
                        callback(null, null);
                        return;
                    }
                    return callback(null, result.rows);
                })
            })
        }
    ], function(err, result) {
        if (err) {
            return jsonResponse(req, res, result, err);
        }
        return jsonResponse(req, res, result);
    });
};

function viewInterfaceFHandler(req, res) {
    let oracleClient = context.oracle;
    async.waterfall([
        function(callback) {
            oracleClient.getConnection(function(err, connection) {
                if (err) {
                    logger.error('get oracle connection failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                connection.execute(oracleClient.SQL.firstGrade, function(err, firstGradeResult) {
                    if (err) {
                        logger.error('execute firstGrade failed: [%s]', err.message);
                        callback(null, null);
                        return;
                    }
                    connection.execute(oracleClient.SQL.secondGrade, function (err, secondGradeResult) {
                        if (err) {
                            logger.error('execute secondGrade failed: [%s]', err.message);
                            callback(null, null);
                            return;
                        }
                        return callback(null, {
                            firstGradeResult: firstGradeResult.rows,
                            secondGradeResult: secondGradeResult.rows
                        });
                    })
                })
            })
        }
    ], function(err, result) {
        if (err) {
            return jsonResponse(req, res, result, err);
        }
        return jsonResponse(req, res, result);
    });
};

function viewInterfaceGHandler(req, res) {
    let oracleClient = context.oracle;
    async.waterfall([
        function(callback) {
            oracleClient.getConnection(function(err, connection) {
                if (err) {
                    logger.error('get oracle connection failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                connection.execute(oracleClient.SQL.storeDynamic, function(err, result) {
                    if (err) {
                        logger.error('execute storeDynamic failed: [%s]', err.message);
                        callback(null, null);
                        return;
                    }
                    return callback(null, result.rows);
                })
            })
        }
    ], function(err, result) {
        if (err) {
            return jsonResponse(req, res, result, err);
        }
        return jsonResponse(req, res, result);
    });
};

function viewInterfaceHHandler(req, res) {
    let oracleClient = context.oracle;
    async.auto({
        getConn: function(callback) {
            oracleClient.getConnection(function(err, connection) {
                if (err) {
                    logger.error('get oracle connection failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                callback(null, connection);
            });
        },
        newProductsDynamic: ['getConn', function(callback, result) {
            result.getConn.execute(oracleClient.SQL.newProductsDynamic, function(err, result) {
                if(err) {
                    logger.error('get oracle newProductsDynamic failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                callback(null, result.rows);
            })
        }],
        sellingProductsDynamic: ['getConn', function(callback, result) {
            result.getConn.execute(oracleClient.SQL.sellingProductsDynamic, function(err, result) {
                if(err) {
                    logger.error('get oracle sellingProductsDynamic failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                callback(null, result.rows);
            });
        }],
        unsalableProductsDynamic: ['getConn', function(callback, result) {
            result.getConn.execute(oracleClient.SQL.unsalableProductsDynamic, function(err, result) {
                if(err) {
                    logger.error('get oracle unsalableProductsDynamic failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                callback(null, result.rows);
            });
        }]
    }, function(err, result) {
        if (err) {
            return jsonResponse(req, res, result, err);
        }
        delete result.getConn;
        return jsonResponse(req, res, result);
    });
};

function viewInterfaceISalesHandler(req, res) {
    let oracleClient = context.oracle;
    async.waterfall([
        function(callback) {
            oracleClient.getConnection(function(err, connection) {
                if (err) {
                    logger.error('get oracle connection failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                connection.execute(oracleClient.SQL.storeSales, function(err, storeSalesResult) {
                    if (err) {
                        logger.error('execute storeSales failed: [%s]', err.message);
                        callback(null, null);
                        return;
                    }
                    return callback(null, storeSalesResult.rows);
                    })
                })
        }
    ], function(err, result) {
        if (err) {
            return jsonResponse(req, res, result, err);
        }
        return jsonResponse(req, res, result);
    });
};

function viewInterfaceIProfitHandler(req, res) {
    let oracleClient = context.oracle;
    async.waterfall([
        function(callback) {
            oracleClient.getConnection(function(err, connection) {
                if (err) {
                    logger.error('get oracle connection failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                connection.execute(oracleClient.SQL.storeProfit, function(err, result) {
                    if (err) {
                        logger.error('execute storeProfit failed: [%s]', err.message);
                        callback(null, null);
                        return;
                    }
                    return callback(null, result.rows);
                })
            })
        }
    ], function(err, result) {
        if (err) {
            return jsonResponse(req, res, result, err);
        }
        return jsonResponse(req, res, result);
    });
};

function viewInterfaceJHandler(req, res) {
    let oracleClient = context.oracle;
    async.waterfall([
        function(callback) {
            oracleClient.getConnection(function(err, connection) {
                if (err) {
                    logger.error('get oracle connection failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                connection.execute(oracleClient.SQL.noticeBoard, function(err, result) {
                    if (err) {
                        logger.error('execute noticeBoard failed: [%s]', err.message);
                        callback(null, null);
                        return;
                    }
                    return callback(null, result.rows);
                })
            })
        }
    ], function(err, result) {
        if (err) {
            return jsonResponse(req, res, result, err);
        }
        return jsonResponse(req, res, result);
    });
};

function getStoreHandler(req, res) {
    let oracleClient = context.oracle;
    async.waterfall([
        function(callback) {
            oracleClient.getConnection(function(err, connection) {
                if (err) {
                    logger.error('get oracle connection failed: [%s]', err.message);
                    callback(null, null);
                    return;
                }
                connection.execute(oracleClient.SQL.getAllStore, function(err, result) {
                    if (err) {
                        logger.error('execute getAllStore failed: [%s]', err.message);
                        callback(null, null);
                        return;
                    }
                    return callback(null, result.rows);
                })
            })
        }
    ], function(err, result) {
        if (err) {
            return jsonResponse(req, res, result, err);
        }
        return jsonResponse(req, res, result);
    });
};