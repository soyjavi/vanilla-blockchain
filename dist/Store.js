'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var folder = _path2.default.resolve('.', 'store');
var state = new WeakMap();

var write = function write(filename) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  try {
    _fs2.default.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw new Error(filename + ' could not be saved correctly.');
  }
};

var Store = function () {
  function Store() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$autoSave = _ref.autoSave,
        autoSave = _ref$autoSave === undefined ? true : _ref$autoSave,
        _ref$defaults = _ref.defaults,
        defaults = _ref$defaults === undefined ? {} : _ref$defaults,
        _ref$filename = _ref.filename,
        filename = _ref$filename === undefined ? folder + '/store.json' : _ref$filename;

    _classCallCheck(this, Store);

    var data = defaults;

    if (!_fs2.default.existsSync(filename)) {
      write(filename, data);
    } else {
      data = JSON.parse(_fs2.default.readFileSync(filename, 'utf8'));

      try {
        data = JSON.parse(_fs2.default.readFileSync(filename, 'utf8'));
      } catch (error) {
        throw new Error(filename + ' could not be loaded correctly.');
      }
    }

    state.set(this, {
      autoSave: autoSave,
      data: data,
      filename: filename,
      key: 'default',
      memoryPool: []
    });

    return this;
  }

  _createClass(Store, [{
    key: 'get',
    value: function get(key) {
      state.set(this, Object.assign(state.get(this), { key: key }));

      return this;
    }
  }, {
    key: 'push',
    value: function push() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _state$get = state.get(this),
          autoSave = _state$get.autoSave,
          key = _state$get.key,
          memoryPool = _state$get.memoryPool;

      if (autoSave) this.save(value);else memoryPool.push({ key: key, value: value });

      return this;
    }
  }, {
    key: 'save',
    value: function save(value) {
      var _state$get2 = state.get(this),
          data = _state$get2.data,
          filename = _state$get2.filename,
          key = _state$get2.key,
          _state$get2$memoryPoo = _state$get2.memoryPool,
          memoryPool = _state$get2$memoryPoo === undefined ? [] : _state$get2$memoryPoo;

      if (value) {
        data[key] = data[key] ? [].concat(_toConsumableArray(data[key]), [value]) : [value];
        write(filename, data);
      } else if (memoryPool.length > 0) {
        memoryPool.forEach(function (item) {
          data[item.key] = data[item.key] ? [].concat(_toConsumableArray(data[item.key]), [item.value]) : [item.value];
        });
        write(filename, data);
        state.set(this, Object.assign(state.get(this), { memoryPool: [] }));
      }
    }
  }, {
    key: 'wipe',
    value: function wipe() {
      var _state$get3 = state.get(this),
          filename = _state$get3.filename;

      write(filename);
    }
  }, {
    key: 'value',
    get: function get() {
      var _state$get4 = state.get(this),
          data = _state$get4.data,
          key = _state$get4.key;

      return data[key];
    }
  }]);

  return Store;
}();

exports.default = Store;