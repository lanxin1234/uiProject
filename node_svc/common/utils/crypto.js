/* global __dirname */
/* global process */
/*jshint esversion: 6 */
'use strict';

var crypto = require('crypto');
var MD5    = require('crypto-js/md5');
var utf8   = require('utf8');
var moment = require('moment');

var logger = require('../drivers/logger').getLogger();

const SHA256    = 'sha256'
const RSASHA256 = 'RSA-SHA256'
const LATIN1 = 'latin1'
const HEX = 'hex'
const BASE64 = 'base64'



function CryptoTools(data) {
  this.data = data;
}

CryptoTools.prototype.sign = function(algorithms, prikey, encode) {
  if (!this.data || this.data === '') {
    throw new Error('no data to be signed!');
  }
  if (!encode) {
    encode = BASE64;
  }
  if ([LATIN1, HEX, BASE64].indexOf(encode) === -1) {
    throw new Error('invalid output format');
  }
  switch(algorithms) {
    case RSASHA256:
      var sign = crypto.createSign('RSA-SHA256');
      sign.update(this.data, 'utf8');
      return sign.sign(prikey, encode);
    default:
      throw new Error('No matched algorithms!')
  }

}

CryptoTools.prototype.signatureVerify = function(algorithms, signature, pubkey, encode) {
  if (!this.data || this.data === '') {
    throw new Error('no data to be verified!');
  }
  if (!encode) {
    encode = BASE64;
  }
  if ([LATIN1, HEX, BASE64].indexOf(encode) === -1) {
    throw new Error('invalid output format');
  }
  switch(algorithms) {
    case RSASHA256:
      var verify = crypto.createVerify('RSA-SHA256');
      verify.update(this.data, 'utf8');
      return verify.verify(pubkey, signature, encode);
    default:
      throw new Error('No matched algorithms!');
  }
}

CryptoTools.prototype.apiRequestSignatureVerify = function(data, pubkey, expectedSig, timeExpired) {
  var currentTimestamp = moment().utc().unix();
  var requestTimestamp = data.timestamp;
  var duration = moment(currentTimestamp*1000).diff(requestTimestamp*1000, 'seconds');
  if (Math.abs(duration) > timeExpired) {
    logger.error('request has been expired');
    return false;
  }
  var dataKeys = Object.keys(data).sort();
  var payloadKeys = Object.keys(data.payload).sort();
  var fileKeys = ['videoPartOne', 'videoPartTwo', 'voice', 'imageOne',
    'imageTwo', 'imageThree', 'image', 'frontside', 'backside', 'inhand'];
  // delete keys with value of file
  for (let i = 0; i < fileKeys.length; i++) {
    if (payloadKeys.indexOf(fileKeys[i]) !== -1) {
      payloadKeys.splice(payloadKeys.indexOf(fileKeys[i]), 1);
    }
  }
  var expectedKeys = ['appId', 'method', 'payload', 'timestamp', 'tokenId', 'uri', 'version'].sort();
  // generate payload object sorted keys.
  var payloadSorted = {};
  for (let i = 0; i < payloadKeys.length; i++) {
    payloadSorted[payloadKeys[i]] = data.payload[payloadKeys[i]];
  }
  var payloadStr = JSON.stringify(payloadSorted);
  var dataTobeSigned = {
    appId: data.appId,
    method: data.method,
    payload: payloadStr,
    timestamp: data.timestamp,
    tokenId: data.tokenId,
    uri: data.uri,
    version: data.version
  };
  var unsignedDataStr = '';
  for (let i = 0; i < expectedKeys.length; i++) {
    unsignedDataStr += expectedKeys[i];
    unsignedDataStr += '=';
    if (dataTobeSigned[expectedKeys[i]] && dataTobeSigned[expectedKeys[i]] !== ''
      && dataTobeSigned[expectedKeys[i]] !== '{}'
      ||  dataTobeSigned[expectedKeys[i]] === 0) {
      unsignedDataStr += dataTobeSigned[expectedKeys[i]];
    }
    if (i < expectedKeys.length - 1) {
      unsignedDataStr += '&';
    }
  }
  var verify = crypto.createVerify('RSA-SHA256');
  var encode = BASE64;
  verify.update(unsignedDataStr, 'utf8');

  return verify.verify(pubkey, expectedSig, encode);
}

CryptoTools.prototype.aesEncrypt = function(data, key) {
  var cipher = crypto.createCipher('aes-256-cbc', key);
  var encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

CryptoTools.prototype.aesDecrypt = function(encrypted, key) {
  var decipher = crypto.createDecipher('aes-256-cbc', key);
  var decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = CryptoTools;
