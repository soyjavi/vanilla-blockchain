import CryptoJS, { AES } from 'crypto-js';

export default (value = '', secret) => {
  if (!secret) return value;
  let json;

  try {
    json = JSON.parse(AES.decrypt(value, secret).toString(CryptoJS.enc.Utf8));
  } catch (e) {
    throw Error(`Block ${value} can't be decrypted.`);
  }

  return json;
};
