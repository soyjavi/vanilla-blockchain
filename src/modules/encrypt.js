import { AES } from 'crypto-js';

export default (value = '', secret) => {
  if (!secret) return value;

  return AES.encrypt(JSON.stringify(value), secret).toString();
};
