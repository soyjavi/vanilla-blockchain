"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _modules = require("./modules");

var Block = function Block() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? {} : _ref$data,
      _ref$difficulty = _ref.difficulty,
      difficulty = _ref$difficulty === void 0 ? 0 : _ref$difficulty,
      previousHash = _ref.previousHash,
      _ref$timestamp = _ref.timestamp,
      timestamp = _ref$timestamp === void 0 ? new Date().getTime() : _ref$timestamp,
      fork = _ref.fork;

  var _ref2 = fork || {},
      _ref2$nonce = _ref2.nonce,
      nonce = _ref2$nonce === void 0 ? 0 : _ref2$nonce,
      _ref2$hash = _ref2.hash,
      hash = _ref2$hash === void 0 ? '' : _ref2$hash;

  if (!fork || nonce === 0 && hash === '') {
    while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce += 1;
      hash = (0, _modules.calculateHash)({
        previousHash: previousHash,
        timestamp: timestamp,
        data: data,
        nonce: nonce
      });
    }
  }

  return {
    data: data,
    nonce: nonce,
    previousHash: previousHash,
    timestamp: timestamp,
    hash: hash
  };
};

var _default = Block;
exports["default"] = _default;