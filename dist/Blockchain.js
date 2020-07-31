"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Blockchain = void 0;

var _Block = require("./Block");

var _modules = require("./modules");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Blockchain = /*#__PURE__*/function () {
  function Blockchain() {
    _classCallCheck(this, Blockchain);
  }

  _createClass(Blockchain, [{
    key: "addBlock",
    value: function addBlock(data, previousHash, fork) {
      var latestBlock = this.latestBlock;
      var _this$state = this.state,
          difficulty = _this$state.difficulty,
          readMode = _this$state.readMode;
      if (readMode) throw Error('Read mode only.');else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');else if (fork && (!fork.hash || fork.nonce <= 0)) throw Error('Not valid fork parameters.');
      return new _Block.Block({
        data: data,
        difficulty: difficulty,
        fork: fork,
        previousHash: previousHash
      });
    }
  }, {
    key: "get",
    value: function get(key) {
      var _this$state2 = this.state,
          readMode = _this$state2.readMode,
          storage = _this$state2.storage;

      var _ref = storage.get(key).value || [],
          _ref2 = _slicedToArray(_ref, 1),
          genesisBlock = _ref2[0];

      if (!genesisBlock) {
        if (!readMode) this.addBlock('Genesis Block');else throw Error('Read mode only.');
      }

      return this;
    }
  }, {
    key: "save",
    value: function save() {
      var storage = this.state.storage;
      storage.save();
    }
  }, {
    key: "wipe",
    value: function wipe() {
      var storage = this.state.storage;
      storage.wipe();
    }
  }, {
    key: "blocks",
    get: function get() {
      var storage = this.state.storage;
      return storage.value;
    }
  }, {
    key: "latestBlock",
    get: function get() {
      var _this$state$storage$v = this.state.storage.value,
          blocks = _this$state$storage$v === void 0 ? [] : _this$state$storage$v;
      var block = blocks[blocks.length - 1];
      return block || {};
    }
  }, {
    key: "isValidChain",
    get: function get() {
      var _this$state3 = this.state,
          _this$state3$storage$ = _this$state3.storage.value,
          blocks = _this$state3$storage$ === void 0 ? [] : _this$state3$storage$,
          secret = _this$state3.secret;

      for (var i = 1; i < blocks.length; i += 1) {
        var currentBlock = (0, _modules.decrypt)(blocks[i], secret);
        var previousBlock = (0, _modules.decrypt)(blocks[i - 1], secret);
        if (currentBlock.previousHash !== previousBlock.hash) return false;
        if (currentBlock.hash !== (0, _modules.calculateHash)(currentBlock)) return false;
      }

      return true;
    }
  }]);

  return Blockchain;
}();

exports.Blockchain = Blockchain;