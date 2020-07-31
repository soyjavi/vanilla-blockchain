"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Block = void 0;

var _modules = require("./modules");

var Block = function Block() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? {} : _ref$data,
      _ref$difficulty = _ref.difficulty,
      difficulty = _ref$difficulty === void 0 ? 0 : _ref$difficulty,
      fork = _ref.fork,
      previousHash = _ref.previousHash,
      _ref$timestamp = _ref.timestamp,
      timestamp = _ref$timestamp === void 0 ? new Date().getTime() : _ref$timestamp;

  var _ref2 = fork || {},
      _ref2$nonce = _ref2.nonce,
      nonce = _ref2$nonce === void 0 ? 0 : _ref2$nonce,
      _ref2$hash = _ref2.hash,
      hash = _ref2$hash === void 0 ? '' : _ref2$hash;

  if (!fork || nonce === 0 && hash === '') {
    while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce += 1;
      hash = (0, _modules.calculateHash)({
        data: data,
        nonce: nonce,
        previousHash: previousHash,
        timestamp: timestamp
      });
    }
  }

  return {
    data: data,
    hash: hash,
    nonce: nonce,
    previousHash: previousHash,
    timestamp: timestamp
  };
};

exports.Block = Block;