import Storage, { jsonAdapter } from 'vanilla-storage';

import Block from './Block';
import { calculateHash, decrypt } from './modules';

// eslint-disable-next-line no-undef
const state = new WeakMap();

export default class Blockchain {
  constructor({
    adapter = jsonAdapter,
    autoSave = true,
    defaults = { blocks: [] },
    difficulty = 1,
    filename = 'vanilla-blockchain',
    key = 'blocks',
    readMode,
    secret,
  } = {}) {
    const storage = new Storage({ adapter, autoSave, defaults, filename, secret });

    state.set(this, { autoSave, difficulty, readMode, storage });

    try {
      this.get(key);
    } catch (error) {
      if (secret) throw Error(`Blockchain ${filename} can't be decrypted`);
      else throw Error(error);
    }

    return this;
  }

  addBlock(data = {}, previousHash, fork) {
    const { latestBlock } = this;
    const { autoSave, difficulty, readMode, storage } = state.get(this);

    if (readMode) throw Error('Read mode only.');
    else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');
    else if (fork && (!fork.hash || fork.nonce <= 0)) throw Error('Not valid fork parameters.');

    const newBlock = new Block({
      data,
      difficulty,
      fork,
      previousHash,
    });

    storage.push(newBlock);
    if (autoSave) this.save();

    return newBlock;
  }

  get(key) {
    const { readMode, storage } = state.get(this);

    const [genesisBlock] = storage.get(key).value || [];
    if (!genesisBlock) {
      if (!readMode) this.addBlock('Genesis Block');
      else throw Error('Read mode only.');
    }

    return this;
  }

  save() {
    const { storage } = state.get(this);
    storage.save();

    return this;
  }

  wipe() {
    const { storage } = state.get(this);

    storage.wipe();
    return this;
  }

  get blocks() {
    const { storage } = state.get(this);

    return storage.value;
  }

  get latestBlock() {
    const {
      storage: { value: blocks = [] },
    } = state.get(this);
    const block = blocks[blocks.length - 1];

    return block || {};
  }

  get isValidChain() {
    const {
      storage: { value: blocks = [] },
      secret,
    } = state.get(this);

    for (let i = 1; i < blocks.length; i += 1) {
      const currentBlock = decrypt(blocks[i], secret);
      const previousBlock = decrypt(blocks[i - 1], secret);

      if (currentBlock.previousHash !== previousBlock.hash) return false;
      if (currentBlock.hash !== calculateHash(currentBlock)) return false;
    }

    return true;
  }
}
