import fs from 'fs';
import path from 'path';

import Block from './Block';
import Store from './Store';
import { decrypt, encrypt, isValidChain } from './modules';

const folder = path.resolve('.', 'store');
const state = new WeakMap();

export default class Blockchain {
  constructor({
    difficulty = 1,
    file = 'vanillachain',
    keyChain = 'coin',
    readMode = false,
    secret,
  } = {}) {
    const filename = `${folder}/${file}.json`;

    if (!fs.existsSync(filename) && readMode) throw Error(`File ${file} doesn't exists.`);

    const store = new Store({ filename });

    state.set(this, {
      difficulty,
      keyChain,
      readMode,
      secret,
      store,
    });

    if (!store.get(keyChain).value) this.addBlock('Genesis Block');

    return this;
  }

  addBlock(data = {}, previousHash) {
    const { latestBlock } = this;
    const {
      difficulty, keyChain, readMode, secret, store,
    } = state.get(this);

    if (readMode) throw Error(`${keyChain} is in read mode only.`);
    else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');

    const newBlock = new Block({ data, previousHash, difficulty });
    store.get(keyChain).push(encrypt(newBlock, secret)).save();

    return newBlock;
  }

  get blocks() {
    const { store: { value } } = state.get(this);

    // @TODO: We should decrypt
    return value;
  }

  get latestBlock() {
    const { store: { value: blocks = [] }, secret } = state.get(this);
    const block = blocks[blocks.length - 1];

    return block ? decrypt(block, secret) : {};
  }

  get isValidChain() {
    const { store: { value: blocks = [] }, secret } = state.get(this);

    return isValidChain(blocks, secret);
  }
}
