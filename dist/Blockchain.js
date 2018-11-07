'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Block = require('./Block');

var _Block2 = _interopRequireDefault(_Block);

var _Store = require('./Store');

var _Store2 = _interopRequireDefault(_Store);

var _modules = require('./modules');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var folder = _path2.default.resolve('.', 'store');
var state = new WeakMap();

var Blockchain = function () {
  function Blockchain() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$autoSave = _ref.autoSave,
        autoSave = _ref$autoSave === undefined ? true : _ref$autoSave,
        _ref$difficulty = _ref.difficulty,
        difficulty = _ref$difficulty === undefined ? 1 : _ref$difficulty,
        _ref$file = _ref.file,
        file = _ref$file === undefined ? 'vanillachain' : _ref$file,
        key = _ref.key,
        _ref$readMode = _ref.readMode,
        readMode = _ref$readMode === undefined ? false : _ref$readMode,
        secret = _ref.secret;

    _classCallCheck(this, Blockchain);

    var filename = folder + '/' + file + '.json';

    if (!_fs2.default.existsSync(filename) && readMode) throw Error('File ' + file + ' doesn\'t exists.');

    var store = new _Store2.default({ autoSave: autoSave, filename: filename });

    state.set(this, {
      autoSave: autoSave,
      difficulty: difficulty,
      key: key,
      readMode: readMode,
      secret: secret,
      store: store
    });

    if (!store.get(key).value) this.addBlock('Genesis Block');

    return this;
  }

  _createClass(Blockchain, [{
    key: 'addBlock',
    value: function addBlock() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var previousHash = arguments[1];
      var latestBlock = this.latestBlock;

      var _state$get = state.get(this),
          autoSave = _state$get.autoSave,
          difficulty = _state$get.difficulty,
          key = _state$get.key,
          readMode = _state$get.readMode,
          secret = _state$get.secret,
          store = _state$get.store;

      if (readMode) throw Error('Read mode only.');else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');

      var newBlock = new _Block2.default({ data: data, previousHash: previousHash, difficulty: difficulty });
      store.get(key).push((0, _modules.encrypt)(newBlock, secret));

      if (autoSave) store.save();

      return newBlock;
    }
  }, {
    key: 'save',
    value: function save() {
      var _state$get2 = state.get(this),
          store = _state$get2.store;

      store.save();
    }
  }, {
    key: 'blocks',
    get: function get() {
      var _state$get3 = state.get(this),
          secret = _state$get3.secret,
          value = _state$get3.store.value;

      // return secret ? decrypt(value, secret) : value;


      return secret ? value.map(function (item) {
        return (0, _modules.decrypt)(item, secret);
      }) : value;
    }
  }, {
    key: 'latestBlock',
    get: function get() {
      var _state$get4 = state.get(this),
          _state$get4$store$val = _state$get4.store.value,
          blocks = _state$get4$store$val === undefined ? [] : _state$get4$store$val,
          secret = _state$get4.secret;

      var block = blocks[blocks.length - 1];

      return block ? (0, _modules.decrypt)(block, secret) : {};
    }
  }, {
    key: 'isValidChain',
    get: function get() {
      var _state$get5 = state.get(this),
          _state$get5$store$val = _state$get5.store.value,
          blocks = _state$get5$store$val === undefined ? [] : _state$get5$store$val,
          secret = _state$get5.secret;

      return (0, _modules.isValidChain)(blocks, secret);
    }
  }]);

  return Blockchain;
}();

exports.default = Blockchain;