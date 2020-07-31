"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AsyncBlockchain = exports.Blockchain = void 0;

var _vanillaStorage = require("vanilla-storage");

var _Block = require("./Block");

var _modules = require("./modules");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BlockchainBase = /*#__PURE__*/function () {
  function BlockchainBase() {
    _classCallCheck(this, BlockchainBase);
  }

  _createClass(BlockchainBase, [{
    key: "addBlock",
    // eslint-disable-next-line no-unused-vars
    value: function addBlock() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var previousHash = arguments.length > 1 ? arguments[1] : undefined;
      var fork = arguments.length > 2 ? arguments[2] : undefined;
      var latestBlock = this.latestBlock;
      var readMode = this.state.readMode;
      if (readMode) throw Error('Read mode only.');else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');else if (fork && (!fork.hash || fork.nonce <= 0)) throw Error('Not valid fork parameters.');
    }
  }, {
    key: "get",
    value: function get(key) {
      var _this$state = this.state,
          readMode = _this$state.readMode,
          storage = _this$state.storage;

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
      var _this$state2 = this.state,
          _this$state2$storage$ = _this$state2.storage.value,
          blocks = _this$state2$storage$ === void 0 ? [] : _this$state2$storage$,
          secret = _this$state2.secret;

      for (var i = 1; i < blocks.length; i += 1) {
        var currentBlock = (0, _modules.decrypt)(blocks[i], secret);
        var previousBlock = (0, _modules.decrypt)(blocks[i - 1], secret);
        if (currentBlock.previousHash !== previousBlock.hash) return false;
        if (currentBlock.hash !== (0, _modules.calculateHash)(currentBlock)) return false;
      }

      return true;
    }
  }]);

  return BlockchainBase;
}();

var Blockchain = /*#__PURE__*/function (_BlockchainBase) {
  _inherits(Blockchain, _BlockchainBase);

  var _super = _createSuper(Blockchain);

  function Blockchain() {
    var _this;

    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref3$adapter = _ref3.adapter,
        adapter = _ref3$adapter === void 0 ? _vanillaStorage.JsonAdapter : _ref3$adapter,
        _ref3$autoSave = _ref3.autoSave,
        autoSave = _ref3$autoSave === void 0 ? true : _ref3$autoSave,
        _ref3$defaults = _ref3.defaults,
        defaults = _ref3$defaults === void 0 ? {
      blocks: []
    } : _ref3$defaults,
        _ref3$difficulty = _ref3.difficulty,
        difficulty = _ref3$difficulty === void 0 ? 1 : _ref3$difficulty,
        _ref3$filename = _ref3.filename,
        filename = _ref3$filename === void 0 ? 'vanilla-blockchain' : _ref3$filename,
        _ref3$key = _ref3.key,
        key = _ref3$key === void 0 ? 'blocks' : _ref3$key,
        readMode = _ref3.readMode,
        secret = _ref3.secret;

    _classCallCheck(this, Blockchain);

    _this = _super.call(this);
    var storage = new _vanillaStorage.Storage({
      adapter: adapter,
      autoSave: autoSave,
      defaults: defaults,
      filename: filename,
      secret: secret
    });
    _this.state = {
      difficulty: difficulty,
      readMode: readMode,
      storage: storage
    };

    try {
      _this.get(key);
    } catch (error) {
      if (secret) throw Error("Blockchain ".concat(filename, " can't be decrypted"));else throw Error(error);
    }

    return _possibleConstructorReturn(_this, _assertThisInitialized(_this));
  }

  _createClass(Blockchain, [{
    key: "addBlock",
    value: function addBlock() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var previousHash = arguments.length > 1 ? arguments[1] : undefined;
      var fork = arguments.length > 2 ? arguments[2] : undefined;
      var latestBlock = this.latestBlock;
      var _this$state3 = this.state,
          difficulty = _this$state3.difficulty,
          readMode = _this$state3.readMode,
          storage = _this$state3.storage;
      if (readMode) throw Error('Read mode only.');else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');else if (fork && (!fork.hash || fork.nonce <= 0)) throw Error('Not valid fork parameters.');
      var newBlock = new _Block.Block({
        data: data,
        difficulty: difficulty,
        fork: fork,
        previousHash: previousHash
      });
      storage.push(newBlock);
      return newBlock;
    }
  }]);

  return Blockchain;
}(BlockchainBase);

exports.Blockchain = Blockchain;

var AsyncBlockchain = /*#__PURE__*/function (_BlockchainBase2) {
  _inherits(AsyncBlockchain, _BlockchainBase2);

  var _super2 = _createSuper(AsyncBlockchain);

  function AsyncBlockchain() {
    var _this2;

    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref4$adapter = _ref4.adapter,
        adapter = _ref4$adapter === void 0 ? _vanillaStorage.AsyncJsonAdapter : _ref4$adapter,
        _ref4$autoSave = _ref4.autoSave,
        autoSave = _ref4$autoSave === void 0 ? true : _ref4$autoSave,
        _ref4$defaults = _ref4.defaults,
        defaults = _ref4$defaults === void 0 ? {
      blocks: []
    } : _ref4$defaults,
        _ref4$difficulty = _ref4.difficulty,
        difficulty = _ref4$difficulty === void 0 ? 1 : _ref4$difficulty,
        _ref4$filename = _ref4.filename,
        filename = _ref4$filename === void 0 ? 'vanilla-blockchain' : _ref4$filename,
        _ref4$key = _ref4.key,
        key = _ref4$key === void 0 ? 'blocks' : _ref4$key,
        readMode = _ref4.readMode,
        secret = _ref4.secret;

    _classCallCheck(this, AsyncBlockchain);

    _this2 = _super2.call(this);
    return _possibleConstructorReturn(_this2, new Promise( /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve) {
        var storage;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return new _vanillaStorage.AsyncStorage({
                  adapter: adapter,
                  autoSave: autoSave,
                  defaults: defaults,
                  filename: filename,
                  secret: secret
                });

              case 2:
                storage = _context.sent;
                _this2.state = {
                  difficulty: difficulty,
                  readMode: readMode,
                  storage: storage
                };
                _context.prev = 4;

                _this2.get(key);

                _context.next = 15;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](4);

                if (!secret) {
                  _context.next = 14;
                  break;
                }

                throw Error("Blockchain ".concat(filename, " can't be decrypted"));

              case 14:
                throw Error(_context.t0);

              case 15:
                resolve(_assertThisInitialized(_this2));

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[4, 8]]);
      }));

      return function (_x) {
        return _ref5.apply(this, arguments);
      };
    }()));
  }

  _createClass(AsyncBlockchain, [{
    key: "addBlock",
    value: function () {
      var _addBlock = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var data,
            previousHash,
            fork,
            latestBlock,
            _this$state4,
            difficulty,
            readMode,
            storage,
            newBlock,
            _args2 = arguments;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                data = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
                previousHash = _args2.length > 1 ? _args2[1] : undefined;
                fork = _args2.length > 2 ? _args2[2] : undefined;
                latestBlock = this.latestBlock;
                _this$state4 = this.state, difficulty = _this$state4.difficulty, readMode = _this$state4.readMode, storage = _this$state4.storage;

                if (!readMode) {
                  _context2.next = 9;
                  break;
                }

                throw Error('Read mode only.');

              case 9:
                if (!(previousHash !== latestBlock.hash)) {
                  _context2.next = 13;
                  break;
                }

                throw Error('The previous hash is not valid.');

              case 13:
                if (!(fork && (!fork.hash || fork.nonce <= 0))) {
                  _context2.next = 15;
                  break;
                }

                throw Error('Not valid fork parameters.');

              case 15:
                newBlock = new _Block.Block({
                  data: data,
                  difficulty: difficulty,
                  fork: fork,
                  previousHash: previousHash
                });
                _context2.next = 18;
                return storage.push(newBlock);

              case 18:
                return _context2.abrupt("return", newBlock);

              case 19:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function addBlock() {
        return _addBlock.apply(this, arguments);
      }

      return addBlock;
    }()
  }]);

  return AsyncBlockchain;
}(BlockchainBase);

exports.AsyncBlockchain = AsyncBlockchain;