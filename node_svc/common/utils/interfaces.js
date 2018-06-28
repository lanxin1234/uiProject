/* global __dirname */
/* global process */
/*jshint esversion: 6 */
'use strict';

/*
  JS interface class.
  To make sure other classes achieve all methods they should include.
*/

var Interfaces = function(name, methods) {
  if (arguments.length != 2) {
    throw new Error('Interface constructor called with' + arguments.length +
      'arguments, but expected exactly 2');
  }
  this.name = name;
  this.methods = [];
  for(let i = 0; i < methods.length; i++) {
    if (typeof methods[i] !== 'string') {
      throw new Error('Interface constructor expects method name to be a string');
    }
    this.methods.push(methods[i]);
  }
}

Interfaces.prototype.ensureImplements = function(obj) {
  if (arguments.length < 2) {
    throw new Error('Function Interface.ensureimplements called with' +
      arguments.length + 'arguments,but expected at least 2');
  }
  for (let i = 1; i < arguments.length; i++) {
    let interfaces = arguments[i];
    if (interfaces.constructor !== Interfaces) {
      throw new Error('Function interface.exsureImplements expects argument 2' +
        'to be instance of Interface');
    }
    for (let j = 0; j< interfaces.methods.length; j++) {
      let method = interfaces.methods[i];
      if (!obj[method] || typeof obj[method] !== 'function') {
        throw new Error('Function Interface.ensureImplements: object' +
          'does not implement the ' + interfaces.name + ' interface method:' +
          method + 'was not found.');
      }
    }
  }
}

module.exports = Interfaces;
