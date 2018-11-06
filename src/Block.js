import { calculateHash } from './modules';

const Block = ({
  data = {},
  difficulty = 0,
  previousHash,
  timestamp = new Date().toISOString(),
} = {}) => {
  let nonce = 0;
  let hash = '';

  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    nonce += 1;
    hash = calculateHash({
      previousHash, timestamp, data, nonce,
    });
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
