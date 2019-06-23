import { calculateHash } from './modules';

const Block = ({
  data = {},
  difficulty = 0,
  previousHash,
  timestamp = new Date().toISOString(),
  fork,
} = {}) => {
  let { nonce = 0, hash = '' } = fork || {};

  if (!fork || (nonce === 0 && hash === '')) {
    while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      nonce += 1;
      hash = calculateHash({
        previousHash, timestamp, data, nonce,
      });
    }
  }

  return {
    data,
    nonce,
    previousHash,
    timestamp,
    hash,
  };
};

export default Block;
