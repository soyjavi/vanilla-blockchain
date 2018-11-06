'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _modules = require('./modules');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Block = function () {
  function Block() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$data = _ref.data,
        data = _ref$data === undefined ? {} : _ref$data,
        difficulty = _ref.difficulty,
        previousHash = _ref.previousHash,
        _ref$timestamp = _ref.timestamp,
        timestamp = _ref$timestamp === undefined ? new Date().toISOString() : _ref$timestamp,
        secret = _ref.secret;

    _classCallCheck(this, Block);

    this.data = data;
    this.data = secret ? (0, _modules.encrypt)(data, secret) : data;
    this.nonce = 0;
    this.previousHash = previousHash;
    this.timestamp = timestamp;

    if (difficulty) this.mine(difficulty);

    return this;
  }

  _createClass(Block, [{
    key: 'mine',
    value: function mine() {
      var difficulty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.hash = (0, _modules.calculateHash)(this);
      while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
        this.nonce += 1;
        this.hash = (0, _modules.calculateHash)(this);
      }
    }
  }]);

  return Block;
}();

exports.default = Block;