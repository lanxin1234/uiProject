'use strict';
/* global process */
/* global __dirname */

var logger = require('../../common/drivers/logger').getLogger();

var Token = function() {}

// insert
Token.prototype.tokenCreate = function( client, tokenId, content, timeExpired, callback ) {
  client.set(tokenId, content, timeExpired, function (err) {
    if ( err ) {
        logger.error("set memcached kv error: ", err);
        callback( err, null );
        return;
    }
    callback( null, tokenId);
  });
}
// query
Token.prototype.tokenRetrive = function( client, tokenId, callback ) {
  client.get( tokenId, function(err, data) {
    if ( err ) {
        logger.error("failed to query token info with err: ", err);
        callback( err, null );
        return;
    }
    callback( null, data )
  })
}
// delete
Token.prototype.tokenDelete = function( client, tokenId, callback ) {
  client.del( tokenId, function( err ) {
    if ( err ) {
        logger.error("failed to del token with err: ", err);
        callback( err, null );
        return;
    }
    callback( null, null )
  })
}
// renew
Token.prototype.tokenRenew = function( client, tokenId, timeExpired, callback ) {
  client.touch( tokenId, timeExpired, function( err ) {
    if ( err ) {
        logger.error("failed to touch the key with err: ", err);
        callback( err, null );
        return;
    }
    callback( null, null )
  })
}

module.exports = Token;
