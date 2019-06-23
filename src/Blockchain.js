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

    const [genesisBlock] = store.get(key).value || [];
    if (!genesisBlock) {
      this.addBlock('Genesis Block');
    } else if (secret && genesisBlock) {
      try {
        decrypt(genesisBlock, secret);
      } catch (error) { throw Error(`Blockchain ${file} can't be decrypted`); }
    }

    return this;
  }

  addBlock(data = {}, previousHash, fork) {
    const { latestBlock } = this;
    const {
      autoSave, difficulty, key, readMode, secret, store,
    } = state.get(this);

    if (readMode) throw Error('Read mode only.');
    else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');
    else if (fork && (!fork.hash || fork.nonce <= 0)) throw Error('Not valid fork parameters.');

    const newBlock = new Block({
      data, previousHash, difficulty, fork,
    });
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

    if (!secret) return value;
    const blocks = [];
    value.forEach((item) => {
      try {
        blocks.push(decrypt(item, secret));
      } catch (error) { console.log(error); }
    });

    return blocks;
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
