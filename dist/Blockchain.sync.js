"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Blockchain = void 0;

var _vanillaStorage = require("vanilla-storage");

var _Blockchain = require("./Blockchain");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var Blockchain = /*#__PURE__*/function (_Base) {
  _inherits(Blockchain, _Base);

  var _super = _createSuper(Blockchain);

  function Blockchain() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$adapter = _ref.adapter,
        adapter = _ref$adapter === void 0 ? _vanillaStorage.JsonAdapter : _ref$adapter,
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
      var storage = this.state.storage;

      var newBlock = _get(_getPrototypeOf(Blockchain.prototype), "addBlock", this).call(this, data, previousHash, fork);

      storage.push(newBlock);
      return newBlock;
    }
  }]);

  return Blockchain;
}(_Blockchain.Blockchain);

exports.Blockchain = Blockchain;