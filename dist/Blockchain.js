'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Block = require('./Block');

var _Block2 = _interopRequireDefault(_Block);

var _Store = require('./Store');

var _Store2 = _interopRequireDefault(_Store);

var _modules = require('./modules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Blockchain = function () {
  function Blockchain() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$difficulty = _ref.difficulty,
        difficulty = _ref$difficulty === undefined ? 1 : _ref$difficulty,
        _ref$file = _ref.file,
        file = _ref$file === undefined ? 'vanillachain' : _ref$file,
        _ref$keyChain = _ref.keyChain,
        keyChain = _ref$keyChain === undefined ? 'coin' : _ref$keyChain,
        _ref$readMode = _ref.readMode,
        readMode = _ref$readMode === undefined ? false : _ref$readMode;

    _classCallCheck(this, Blockchain);

    this.file = file;
    this.keyChain = keyChain;
    this.difficulty = difficulty;
    this.readMode = readMode;

    var _ref2 = new _Store2.default(this),
        store = _ref2.store,
        _ref2$chain = _ref2.chain,
        chain = _ref2$chain === undefined ? [] : _ref2$chain;

    this.store = store;
    this.chain = chain;
  }

  _createClass(Blockchain, [{
    key: 'addBlock',
    value: function addBlock() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var previousHash = arguments[1];
      var difficulty = this.difficulty,
          keyChain = this.keyChain,
          latestBlock = this.latestBlock,
          readMode = this.readMode,
          store = this.store;


      if (readMode) throw Error('The ' + keyChain + ' is in read mode only.');
      if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');

      var newBlock = new _Block2.default({ data: data, previousHash: previousHash, difficulty: difficulty });
      store.get(keyChain).push(newBlock).write();

      return newBlock;
    }
  }, {
    key: 'latestBlock',
    get: function get() {
      return this.chain[this.chain.length - 1];
    }
  }, {
    key: 'isValidChain',
    get: function get() {
      return (0, _modules.isValidChain)(this.chain);
    }
  }]);

  return Blockchain;
}();

exports.default = Blockchain;