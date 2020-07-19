import Storage, { jsonAdapter } from 'vanilla-storage';

import { Block } from './Block';
import { calculateHash, decrypt } from './modules';

// eslint-disable-next-line no-undef
const state = new WeakMap();

export class Blockchain {
  constructor({
    adapter = jsonAdapter,
    asyncMode = false,
    autoSave = true,
    defaults = { blocks: [] },
    difficulty = 1,
    filename = 'vanilla-blockchain',
    key = 'blocks',
    readMode,
    secret,
  } = {}) {
    // @TODO: Support async
    const storage = new Storage({ adapter, autoSave, defaults, filename, secret });

    state.set(this, { asyncMode, difficulty, readMode, storage });

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
    const { difficulty, readMode, storage } = state.get(this);

    if (readMode) throw Error('Read mode only.');
    else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');
    else if (fork && (!fork.hash || fork.nonce <= 0)) throw Error('Not valid fork parameters.');

    // @TODO: Support async
    const newBlock = new Block({ data, difficulty, fork, previousHash });
    storage.push(newBlock);

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
  }

  wipe() {
    const { storage } = state.get(this);
    storage.wipe();
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
