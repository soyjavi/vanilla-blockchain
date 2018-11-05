import { calculateHash } from './modules';

export default class Block {
  constructor({
    data = {}, difficulty, previousHash, timestamp = new Date().toISOString(),
  } = {}) {
    this.data = data;
    this.nonce = 0;
    this.previousHash = previousHash;
    this.timestamp = timestamp;

    if (difficulty) this.mine(difficulty);
  }

  mine(difficulty = 0) {
    this.hash = calculateHash(this);
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce += 1;
      this.hash = calculateHash(this);
    }
  }
}
