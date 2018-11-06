import Block from './Block';
import Store from './Store';
import { decrypt, encrypt, isValidChain } from './modules';

export default class Blockchain {
  constructor({
    difficulty = 1,
    file = 'vanillachain',
    keyChain = 'coin',
    readMode = false,
    secret,
  } = {}) {
    const { store, chain = [] } = new Store({ file, keyChain, readMode });

    this.file = file;
    this.keyChain = keyChain;
    this.difficulty = difficulty;
    this.readMode = readMode;
    this.store = store;
    this.chain = chain;
    this.secret = secret;

    if (chain.length === 0) this.addBlock('Genesis Block');

    return this;
  }

  addBlock(data = {}, previousHash) {
    const {
      difficulty, keyChain, latestBlock, readMode, store, secret,
    } = this;

    if (readMode) throw Error(`The ${keyChain} is in read mode only.`);
    if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');

    const newBlock = new Block({ data, previousHash, difficulty });
    store.get(keyChain).push(encrypt(newBlock, secret)).write();

    return newBlock;
  }

  get latestBlock() {
    const { chain, secret } = this;
    const block = chain[chain.length - 1];

    return block ? decrypt(block, secret) : {};
  }

  get isValidChain() {
    const { chain, secret } = this;

    return isValidChain(chain, secret);
  }
}
