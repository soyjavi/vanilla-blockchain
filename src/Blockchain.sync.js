import { Storage, JsonAdapter } from 'vanilla-storage';

import { Blockchain as Base } from './Blockchain';

export class Blockchain extends Base {
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
    const { storage } = this.state;

    const newBlock = super.addBlock(data, previousHash, fork);
    storage.push(newBlock);

    return newBlock;
  }
}
