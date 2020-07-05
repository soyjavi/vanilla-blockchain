"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _cryptoJs = require("crypto-js");

var _default = function _default() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      previousHash = _ref.previousHash,
      timestamp = _ref.timestamp,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? {} : _ref$data,
      _ref$nonce = _ref.nonce,
      nonce = _ref$nonce === void 0 ? 0 : _ref$nonce;

  return (0, _cryptoJs.SHA256)(previousHash + timestamp + JSON.stringify(data) + nonce).toString();
};

exports["default"] = _default;