"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vanillaStorage = _interopRequireWildcard(require("vanilla-storage"));

var _Block = _interopRequireDefault(require("./Block"));

var _modules = require("./modules");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// eslint-disable-next-line no-undef
var state = new WeakMap();

var Blockchain = /*#__PURE__*/function () {
  function Blockchain() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$adapter = _ref.adapter,
        adapter = _ref$adapter === void 0 ? _vanillaStorage.jsonAdapter : _ref$adapter,
        _ref$autoSave = _ref.autoSave,
        autoSave = _ref$autoSave === void 0 ? true : _ref$autoSave,
        _ref$defaults = _ref.defaults,
        defaults = _ref$defaults === void 0 ? {
      blocks: []
    } : _ref$defaults,
        _ref$difficulty = _ref.difficulty,
        difficulty = _ref$difficulty === void 0 ? 1 : _ref$difficulty,
        _ref$filename = _ref.filename,
        filename = _ref$filename === void 0 ? 'vanilla-blockchain' : _ref$filename,
        _ref$key = _ref.key,
        key = _ref$key === void 0 ? 'blocks' : _ref$key,
        readMode = _ref.readMode,
        secret = _ref.secret;

    _classCallCheck(this, Blockchain);

    var storage = new _vanillaStorage["default"]({
      adapter: adapter,
      autoSave: autoSave,
      defaults: defaults,
      filename: filename,
      secret: secret
    });
    state.set(this, {
      autoSave: autoSave,
      difficulty: difficulty,
      readMode: readMode,
      storage: storage
    });

    try {
      this.get(key);
    } catch (error) {
      if (secret) throw Error("Blockchain ".concat(filename, " can't be decrypted"));else throw Error(error);
    }

    return this;
  }

  _createClass(Blockchain, [{
    key: "addBlock",
    value: function addBlock() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var previousHash = arguments.length > 1 ? arguments[1] : undefined;
      var fork = arguments.length > 2 ? arguments[2] : undefined;
      var latestBlock = this.latestBlock;

      var _state$get = state.get(this),
          autoSave = _state$get.autoSave,
          difficulty = _state$get.difficulty,
          readMode = _state$get.readMode,
          storage = _state$get.storage;

      if (readMode) throw Error('Read mode only.');else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');else if (fork && (!fork.hash || fork.nonce <= 0)) throw Error('Not valid fork parameters.');
      var newBlock = new _Block["default"]({
        data: data,
        difficulty: difficulty,
        fork: fork,
        previousHash: previousHash
      });
      storage.push(newBlock);
      if (autoSave) this.save();
      return newBlock;
    }
  }, {
    key: "get",
    value: function get(key) {
      var _state$get2 = state.get(this),
          readMode = _state$get2.readMode,
          storage = _state$get2.storage;

      var _ref2 = storage.get(key).value || [],
          _ref3 = _slicedToArray(_ref2, 1),
          genesisBlock = _ref3[0];

      if (!genesisBlock) {
        if (!readMode) this.addBlock('Genesis Block');else throw Error('Read mode only.');
      }

      return this;
    }
  }, {
    key: "save",
    value: function save() {
      var _state$get3 = state.get(this),
          storage = _state$get3.storage;

      storage.save();
      return this;
    }
  }, {
    key: "wipe",
    value: function wipe() {
      var _state$get4 = state.get(this),
          storage = _state$get4.storage;

      storage.wipe();
      return this;
    }
  }, {
    key: "blocks",
    get: function get() {
      var _state$get5 = state.get(this),
          storage = _state$get5.storage;

      return storage.value;
    }
  }, {
    key: "latestBlock",
    get: function get() {
      var _state$get6 = state.get(this),
          _state$get6$storage$v = _state$get6.storage.value,
          blocks = _state$get6$storage$v === void 0 ? [] : _state$get6$storage$v;

      var block = blocks[blocks.length - 1];
      return block || {};
    }
  }, {
    key: "isValidChain",
    get: function get() {
      var _state$get7 = state.get(this),
          _state$get7$storage$v = _state$get7.storage.value,
          blocks = _state$get7$storage$v === void 0 ? [] : _state$get7$storage$v,
          secret = _state$get7.secret;

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

exports["default"] = Blockchain;