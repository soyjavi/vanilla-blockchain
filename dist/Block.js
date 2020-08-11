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
      _ref$fork = _ref.fork,
      fork = _ref$fork === void 0 ? {} : _ref$fork,
      previousHash = _ref.previousHash,
      _ref$timestamp = _ref.timestamp,
      timestamp = _ref$timestamp === void 0 ? new Date().getTime() : _ref$timestamp;

  var _fork$nonce = fork.nonce,
      nonce = _fork$nonce === void 0 ? 0 : _fork$nonce,
      _fork$hash = fork.hash,
      hash = _fork$hash === void 0 ? '' : _fork$hash;

  if (!fork || nonce === 0 && hash === '') {
    while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce += 1;
      hash = (0, _modules.calculateHash)({
        data: data,
        nonce: nonce,
        previousHash: previousHash,
        timestamp: fork.timestamp || timestamp
      });
    }
  }

  return {
    data: data,
    hash: hash,
    nonce: nonce,
    previousHash: previousHash,
    timestamp: fork.timestamp || timestamp
  };
};

exports.Block = Block;