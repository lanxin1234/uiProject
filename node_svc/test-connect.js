/* global __dirname */
/* global process */
/*jshint esversion: 6 */
'use strict';

let oracledb = require('oracledb');
let moment = require('moment');
let connection = require('./context').oracle;
let sql = 'select * from bi_map_order'
 oracledb.getConnection(
  {
    user          : "dbusrbi",
    password      : "futurebi",
    connectString : "59.110.173.186:1521/hdqtls"
  },
  function(err, connection) {
    if (err) {
      console.error(err.message);
      return;
    }
    connection.execute(
        sql,
      function(err, result) {
        if (err) {
          console.error(err.message);
          doRelease(connection);
          return;
        }
        console.log(result.rows);
        doRelease(connection);
      });
  });

function doRelease(connection) {
  connection.close(
    function(err) {
      if (err)
        console.error(err.message);
    });
}

