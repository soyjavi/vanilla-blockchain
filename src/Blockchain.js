import { AsyncStorage, Storage, AsyncJsonAdapter, JsonAdapter } from 'vanilla-storage';

import { Block } from './Block';
import { calculateHash, decrypt } from './modules';

class BlockchainBase {
  // eslint-disable-next-line no-unused-vars
  addBlock(data = {}, previousHash, fork) {
    const { latestBlock } = this;
    const { readMode } = this.state;

    if (readMode) throw Error('Read mode only.');
    else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');
    else if (fork && (!fork.hash || fork.nonce <= 0)) throw Error('Not valid fork parameters.');
  }

  get(key) {
    const { readMode, storage } = this.state;

    const [genesisBlock] = storage.get(key).value || [];
    if (!genesisBlock) {
      if (!readMode) this.addBlock('Genesis Block');
      else throw Error('Read mode only.');
    }

    return this;
  }

  save() {
    const { storage } = this.state;
    storage.save();
  }

  wipe() {
    const { storage } = this.state;
    storage.wipe();
  }

  get blocks() {
    const { storage } = this.state;

    return storage.value;
  }

  get latestBlock() {
    const {
      storage: { value: blocks = [] },
    } = this.state;
    const block = blocks[blocks.length - 1];

    return block || {};
  }

  get isValidChain() {
    const {
      storage: { value: blocks = [] },
      secret,
    } = this.state;

    for (let i = 1; i < blocks.length; i += 1) {
      const currentBlock = decrypt(blocks[i], secret);
      const previousBlock = decrypt(blocks[i - 1], secret);

      if (currentBlock.previousHash !== previousBlock.hash) return false;
      if (currentBlock.hash !== calculateHash(currentBlock)) return false;
    }

    return true;
  }
}
export class Blockchain extends BlockchainBase {
  constructor({
    adapter = JsonAdapter,
    autoSave = true,
    defaults = { blocks: [] },
    difficulty = 1,
    filename = 'vanilla-blockchain',
    key = 'blocks',
    readMode,
    secret,
  } = {}) {
    super();
    const storage = new Storage({ adapter, autoSave, defaults, filename, secret });

    this.state = { difficulty, readMode, storage };

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
    const { difficulty, readMode, storage } = this.state;

    if (readMode) throw Error('Read mode only.');
    else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');
    else if (fork && (!fork.hash || fork.nonce <= 0)) throw Error('Not valid fork parameters.');

    const newBlock = new Block({ data, difficulty, fork, previousHash });
    storage.push(newBlock);

    return newBlock;
  }
}

export class AsyncBlockchain extends BlockchainBase {
  constructor({
    adapter = AsyncJsonAdapter,
    autoSave = true,
    defaults = { blocks: [] },
    difficulty = 1,
    filename = 'vanilla-blockchain',
    key = 'blocks',
    readMode,
    secret,
  } = {}) {
    super();
    return new Promise(async (resolve) => {
      const storage = await new AsyncStorage({
        adapter,
        autoSave,
        defaults,
        filename,
        secret,
      });

      this.state = { difficulty, readMode, storage };

      try {
        this.get(key);
      } catch (error) {
        if (secret) throw Error(`Blockchain ${filename} can't be decrypted`);
        else throw Error(error);
      }

      resolve(this);
    });
  }

  async addBlock(data = {}, previousHash, fork) {
    const { latestBlock } = this;
    const { difficulty, readMode, storage } = this.state;

    if (readMode) throw Error('Read mode only.');
    else if (previousHash !== latestBlock.hash) {
      throw Error('The previous hash is not valid.');
    } else if (fork && (!fork.hash || fork.nonce <= 0)) throw Error('Not valid fork parameters.');

    const newBlock = new Block({ data, difficulty, fork, previousHash });

    await storage.push(newBlock);

    return newBlock;
  }
}
