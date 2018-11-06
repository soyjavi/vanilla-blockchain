'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

var _FileSync = require('lowdb/adapters/FileSync');

var _FileSync2 = _interopRequireDefault(_FileSync);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _Block = require('./Block');

var _Block2 = _interopRequireDefault(_Block);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var difficulty = _ref.difficulty,
      file = _ref.file,
      keyChain = _ref.keyChain,
      readMode = _ref.readMode,
      secret = _ref.secret;

  var folder = _path2.default.resolve('.', 'store');
  if (!_fs2.default.existsSync(folder) && !readMode) _fs2.default.mkdirSync(folder);

  var storeFile = folder + '/' + file + '.json';
  if (!_fs2.default.existsSync(storeFile) && readMode) throw Error('File ' + file + ' doesn\'t exists.');

  var store = (0, _lowdb2.default)(new _FileSync2.default(storeFile));
  if (!store.has(keyChain).value()) {
    if (readMode) throw Error('Blockchain ' + keyChain + ' doesn\'t exists.');
    store.set(keyChain, [new _Block2.default({ data: 'Genesis Block', difficulty: difficulty, secret: secret })]).write();
  }

  return {
    store: store,
    chain: store.get(keyChain).value()
  };
};