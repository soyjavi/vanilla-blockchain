'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.calculateHash = exports.Block = undefined;

var _Blockchain = require('./Blockchain');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Blockchain).default;
  }
});

var _calculateHash = require('./modules/calculateHash');

var _calculateHash2 = _interopRequireDefault(_calculateHash);

var _Block = require('./Block');

var _Block2 = _interopRequireDefault(_Block);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Block = _Block2.default;
exports.calculateHash = _calculateHash2.default;