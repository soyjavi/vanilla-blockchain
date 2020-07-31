import { Block } from './Block';
import { calculateHash, decrypt } from './modules';

export class Blockchain {
  addBlock(data, previousHash, fork) {
    const { latestBlock } = this;
    const { difficulty, readMode } = this.state;

    if (readMode) throw Error('Read mode only.');
    else if (previousHash !== latestBlock.hash) throw Error('The previous hash is not valid.');
    else if (fork && (!fork.hash || fork.nonce <= 0)) throw Error('Not valid fork parameters.');

    return new Block({ data, difficulty, fork, previousHash });
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
