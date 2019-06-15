'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cryptoJs = require('crypto-js');

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var secret = arguments[1];

  if (!secret) return value;
  var json = void 0;

  try {
    json = JSON.parse(_cryptoJs.AES.decrypt(value, secret).toString(_cryptoJs2.default.enc.Utf8));
  } catch (e) {
    throw Error('Block ' + value + ' can\'t be decrypted.');
  }

  return json;
};