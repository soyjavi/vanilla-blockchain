import { SHA256 } from 'crypto-js';

export default ({
  previousHash, timestamp, data = {}, nonce = 0,
} = {}) => SHA256(previousHash + timestamp + JSON.stringify(data) + nonce).toString();
