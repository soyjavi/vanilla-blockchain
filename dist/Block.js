'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _modules = require('./modules');

var Block = function Block() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$data = _ref.data,
      data = _ref$data === undefined ? {} : _ref$data,
      _ref$difficulty = _ref.difficulty,
      difficulty = _ref$difficulty === undefined ? 0 : _ref$difficulty,
      previousHash = _ref.previousHash,
      _ref$timestamp = _ref.timestamp,
      timestamp = _ref$timestamp === undefined ? new Date().toISOString() : _ref$timestamp;

  var nonce = 0;
  var hash = '';

  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    nonce += 1;
    hash = (0, _modules.calculateHash)({
      previousHash: previousHash, timestamp: timestamp, data: data, nonce: nonce
    });
  }

  return {
    data: data,
    nonce: nonce,
    previousHash: previousHash,
    timestamp: timestamp,
    hash: hash
  };
};

exports.default = Block;