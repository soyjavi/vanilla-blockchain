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

var state = new WeakMap();

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
        readMode = _ref$readMode === undefined ? false : _ref$readMode,
        secret = _ref.secret;

    _classCallCheck(this, Blockchain);

    var _ref2 = new _Store2.default({ file: file, keyChain: keyChain, readMode: readMode }),
        store = _ref2.store,
        _ref2$blocks = _ref2.blocks,
        blocks = _ref2$blocks === undefined ? [] : _ref2$blocks;

    state.set(this, {
      difficulty: difficulty,
      keyChain: keyChain,
      readMode: readMode,
      secret: secret,
      store: store,
      blocks: blocks
    });

    if (blocks.length === 0) this.addBlock('Genesis Block');

    return this;
  }

  _createClass(Blockchain, [{
    key: 'addBlock',
    value: function addBlock() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var previousHash = arguments[1];
      var latestBlock = this.latestBlock;

      var _state$get = state.get(this),
          difficulty = _state$get.difficulty,
          keyChain = _state$get.keyChain,
          readMode = _state$get.readMode,
          secret = _state$get.secret,
          store = _state$get.store;

      if (readMode) throw Error('The ' + keyChain + ' is in read mode only.');
      if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');

      var newBlock = new _Block2.default({ data: data, previousHash: previousHash, difficulty: difficulty });
      store.get(keyChain).push((0, _modules.encrypt)(newBlock, secret)).write();

      return newBlock;
    }
  }, {
    key: 'blocks',
    get: function get() {
      var _state$get2 = state.get(this),
          blocks = _state$get2.blocks;

      // @TODO: We should decrypt


      return blocks;
    }
  }, {
    key: 'latestBlock',
    get: function get() {
      var _state$get3 = state.get(this),
          blocks = _state$get3.blocks,
          secret = _state$get3.secret;

      var block = blocks[blocks.length - 1];

      return block ? (0, _modules.decrypt)(block, secret) : {};
    }
  }, {
    key: 'isValidChain',
    get: function get() {
      var _state$get4 = state.get(this),
          blocks = _state$get4.blocks,
          secret = _state$get4.secret;

      return (0, _modules.isValidChain)(blocks, secret);
    }
  }]);

  return Blockchain;
}();

exports.default = Blockchain;