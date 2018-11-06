'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _calculateHash = require('./calculateHash');

var _calculateHash2 = _interopRequireDefault(_calculateHash);

var _decrypt = require('./decrypt');

var _decrypt2 = _interopRequireDefault(_decrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var chain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var secret = arguments[1];

  for (var i = 1; i < chain.length; i += 1) {
    var currentBlock = (0, _decrypt2.default)(chain[i], secret);
    var previousBlock = (0, _decrypt2.default)(chain[i - 1], secret);

    if (currentBlock.previousHash !== previousBlock.hash) return false;
    if (currentBlock.hash !== (0, _calculateHash2.default)(currentBlock)) return false;
  }

  return true;
};