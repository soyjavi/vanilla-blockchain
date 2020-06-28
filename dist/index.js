"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _Blockchain["default"];
  }
});
Object.defineProperty(exports, "jsonAdapter", {
  enumerable: true,
  get: function get() {
    return _vanillaStorage.jsonAdapter;
  }
});
Object.defineProperty(exports, "storageAdapter", {
  enumerable: true,
  get: function get() {
    return _vanillaStorage.storageAdapter;
  }
});
Object.defineProperty(exports, "memoryAdapter", {
  enumerable: true,
  get: function get() {
    return _vanillaStorage.memoryAdapter;
  }
});

var _Blockchain = _interopRequireDefault(require("./Blockchain"));

var _vanillaStorage = require("vanilla-storage");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }