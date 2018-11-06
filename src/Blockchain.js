import Block from './Block';
import Store from './Store';
import { isValidChain } from './modules';

export default class Blockchain {
  constructor({
    difficulty = 1,
    file = 'vanillachain',
    keyChain = 'coin',
    readMode = false,
    secret,
  } = {}) {
    const { store, chain = [] } = new Store({
      file, keyChain, difficulty, readMode, secret,
    });

    this.file = file;
    this.keyChain = keyChain;
    this.difficulty = difficulty;
    this.readMode = readMode;
    this.store = store;
    this.chain = chain;
  }

  addBlock(data = {}, previousHash, secret) {
    const {
      difficulty, keyChain, latestBlock, readMode, store,
    } = this;

    if (readMode) throw Error(`The ${keyChain} is in read mode only.`);
    if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');

    const newBlock = new Block({
      data, previousHash, difficulty, secret,
    });
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
