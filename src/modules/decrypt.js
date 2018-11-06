import CryptoJS, { AES } from 'crypto-js';

export default (value = '', secret) => {
  if (!secret) return value;

  return JSON.parse(AES.decrypt(value, secret).toString(CryptoJS.enc.Utf8));
};
