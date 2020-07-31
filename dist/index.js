"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AsyncJsonAdapter", {
  enumerable: true,
  get: function get() {
    return _vanillaStorage.AsyncJsonAdapter;
  }
});
Object.defineProperty(exports, "JsonAdapter", {
  enumerable: true,
  get: function get() {
    return _vanillaStorage.JsonAdapter;
  }
});
Object.defineProperty(exports, "MemoryAdapter", {
  enumerable: true,
  get: function get() {
    return _vanillaStorage.MemoryAdapter;
  }
});
Object.defineProperty(exports, "StorageAdapter", {
  enumerable: true,
  get: function get() {
    return _vanillaStorage.StorageAdapter;
  }
});
Object.defineProperty(exports, "Blockchain", {
  enumerable: true,
  get: function get() {
    return _Blockchain.Blockchain;
  }
});
Object.defineProperty(exports, "AsyncBlockchain", {
  enumerable: true,
  get: function get() {
    return _Blockchain2.AsyncBlockchain;
  }
});

var _vanillaStorage = require("vanilla-storage");

var _Blockchain = require("./Blockchain.sync");

var _Blockchain2 = require("./Blockchain.async");