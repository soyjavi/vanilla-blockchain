import { calculateHash } from './modules';

export const Block = ({ data = {}, difficulty = 0, fork, previousHash, timestamp = new Date().getTime() } = {}) => {
  let { nonce = 0, hash = '' } = fork || {};

  if (!fork || (nonce === 0 && hash === '')) {
    while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce += 1;
      hash = calculateHash({
        data,
        nonce,
        previousHash,
        timestamp,
      });
    }
  }

  return {
    data,
    hash,
    nonce,
    previousHash,
    timestamp,
  };
};
