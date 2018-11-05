import Block from './Block';
import Store from './Store';
import { isValidChain } from './modules';

export default class Blockchain {
  constructor({
    difficulty = 1, file = 'vanillachain', keyChain = 'coin', readMode = false,
  } = {}) {
    this.file = file;
    this.keyChain = keyChain;
    this.difficulty = difficulty;
    this.readMode = readMode;

    const { store, chain = [] } = new Store(this);
    this.store = store;
    this.chain = chain;
  }

  addBlock(data = {}, previousHash) {
    const {
      difficulty, keyChain, latestBlock, readMode, store,
    } = this;

    if (readMode) throw Error(`The ${keyChain} is in read mode only.`);
    if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');

    const newBlock = new Block({ data, previousHash, difficulty });
    store.get(keyChain).push(newBlock).write();

    return newBlock;
  }

  get latestBlock() {
    return this.chain[this.chain.length - 1];
  }

  get isValidChain() {
    return isValidChain(this.chain);
  }
}
