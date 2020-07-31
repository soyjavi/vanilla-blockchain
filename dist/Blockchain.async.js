"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AsyncBlockchain = void 0;

var _vanillaStorage = require("vanilla-storage");

var _Blockchain = require("./Blockchain");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var AsyncBlockchain = /*#__PURE__*/function (_Base) {
  _inherits(AsyncBlockchain, _Base);

  var _super = _createSuper(AsyncBlockchain);

  function AsyncBlockchain() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$adapter = _ref.adapter,
        adapter = _ref$adapter === void 0 ? _vanillaStorage.AsyncJsonAdapter : _ref$adapter,
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

    _classCallCheck(this, AsyncBlockchain);

    _this = _super.call(this); // eslint-disable-next-line no-async-promise-executor

    return _possibleConstructorReturn(_this, new Promise( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve) {
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
                _this.state = {
                  difficulty: difficulty,
                  readMode: readMode,
                  storage: storage
                };
                _context.prev = 4;

                _this.get(key);

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
                resolve(_assertThisInitialized(_this));

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[4, 8]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
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
                storage = this.state.storage;
                newBlock = _get(_getPrototypeOf(AsyncBlockchain.prototype), "addBlock", this).call(this, data, previousHash, fork);
                _context2.next = 7;
                return storage.push(newBlock);

              case 7:
                return _context2.abrupt("return", newBlock);

              case 8:
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
}(_Blockchain.Blockchain);

exports.AsyncBlockchain = AsyncBlockchain;