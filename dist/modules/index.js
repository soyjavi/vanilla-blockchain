'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidChain = exports.calculateHash = undefined;

var _calculateHash = require('./calculateHash');

var _calculateHash2 = _interopRequireDefault(_calculateHash);

var _isValidChain = require('./isValidChain');

var _isValidChain2 = _interopRequireDefault(_isValidChain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.calculateHash = _calculateHash2.default;
exports.isValidChain = _isValidChain2.default;