'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cryptoJs = require('crypto-js');

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      previousHash = _ref.previousHash,
      timestamp = _ref.timestamp,
      _ref$data = _ref.data,
      data = _ref$data === undefined ? {} : _ref$data,
      _ref$nonce = _ref.nonce,
      nonce = _ref$nonce === undefined ? 0 : _ref$nonce;

  return (0, _cryptoJs.SHA256)(previousHash + timestamp + JSON.stringify(data) + nonce).toString();
};