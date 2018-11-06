import calculateHash from './calculateHash';
import decrypt from './decrypt';

export default (chain = [], secret) => {
  for (let i = 1; i < chain.length; i += 1) {
    const currentBlock = decrypt(chain[i], secret);
    const previousBlock = decrypt(chain[i - 1], secret);

    if (currentBlock.previousHash !== previousBlock.hash) return false;
    if (currentBlock.hash !== calculateHash(currentBlock)) return false;
  }

  return true;
};
