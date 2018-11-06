'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cryptoJs = require('crypto-js');

exports.default = function () {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var secret = arguments[1];

  if (!secret) return value;

  return _cryptoJs.AES.encrypt(JSON.stringify(value), secret).toString();
};