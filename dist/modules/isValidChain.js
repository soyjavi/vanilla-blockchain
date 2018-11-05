'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _calculateHash = require('./calculateHash');

var _calculateHash2 = _interopRequireDefault(_calculateHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var chain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  for (var i = 1; i < chain.length; i += 1) {
    var currentBlock = chain[i];
    var previousBlock = chain[i - 1];

    if (currentBlock.previousHash !== previousBlock.hash) return false;
    if (currentBlock.hash !== (0, _calculateHash2.default)(currentBlock)) return false;
  }

  return true;
};