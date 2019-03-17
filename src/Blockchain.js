import fs from 'fs';
import path from 'path';

import Block from './Block';
import Store from './Store';
import { decrypt, encrypt, isValidChain } from './modules';

const folder = path.resolve('.', 'store');
const state = new WeakMap();

export default class Blockchain {
  constructor({
    autoSave = true,
    difficulty = 1,
    file = 'vanillachain',
    key = 'blocks',
    readMode = false,
    secret,
  } = {}) {
    const filename = `${folder}/${file}.json`;

    if (!fs.existsSync(filename) && readMode) throw Error(`File ${file} doesn't exists.`);

    const store = new Store({ autoSave, filename });

    state.set(this, {
      autoSave,
      difficulty,
      key,
      readMode,
      secret,
      store,
    });

    if (!store.get(key).value) this.addBlock('Genesis Block');

    return this;
  }

  addBlock(data = {}, previousHash) {
    const { latestBlock } = this;
    const {
      autoSave, difficulty, key, readMode, secret, store,
    } = state.get(this);

    if (readMode) throw Error('Read mode only.');
    else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');

    const newBlock = new Block({ data, previousHash, difficulty });
    store.get(key).push(encrypt(newBlock, secret));

    if (autoSave) store.save();

    return newBlock;
  }

  save() {
    const { store } = state.get(this);
    store.save();
  }

  get blocks() {
    const { secret, store: { value } } = state.get(this);

    return secret
      ? value.map(item => decrypt(item, secret))
      : value;
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
