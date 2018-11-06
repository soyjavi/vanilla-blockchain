import Block from './Block';
import Store from './Store';
import { decrypt, encrypt, isValidChain } from './modules';

const state = new WeakMap();

export default class Blockchain {
  constructor({
    difficulty = 1,
    file = 'vanillachain',
    keyChain = 'coin',
    readMode = false,
    secret,
  } = {}) {
    const { store, blocks = [] } = new Store({ file, keyChain, readMode });

    state.set(this, {
      difficulty,
      keyChain,
      readMode,
      secret,
      store,
      blocks,
    });

    if (blocks.length === 0) this.addBlock('Genesis Block');

    return this;
  }

  addBlock(data = {}, previousHash) {
    const { latestBlock } = this;
    const {
      difficulty, keyChain, readMode, secret, store,
    } = state.get(this);

    if (readMode) throw Error(`The ${keyChain} is in read mode only.`);
    if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');

    const newBlock = new Block({ data, previousHash, difficulty });
    store.get(keyChain).push(encrypt(newBlock, secret)).write();

    return newBlock;
  }

  get blocks() {
    const { blocks } = state.get(this);

    // @TODO: We should decrypt
    return blocks;
  }

  get latestBlock() {
    const { blocks, secret } = state.get(this);
    const block = blocks[blocks.length - 1];

    return block ? decrypt(block, secret) : {};
  }

  get isValidChain() {
    const { blocks, secret } = state.get(this);

    return isValidChain(blocks, secret);
  }
}
