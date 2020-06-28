"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "calculateHash", {
  enumerable: true,
  get: function get() {
    return _calculateHash["default"];
  }
});
Object.defineProperty(exports, "Block", {
  enumerable: true,
  get: function get() {
    return _Block["default"];
  }
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _Blockchain["default"];
  }
});

var _calculateHash = _interopRequireDefault(require("./modules/calculateHash"));

var _Block = _interopRequireDefault(require("./Block"));

var _Blockchain = _interopRequireDefault(require("./Blockchain"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }