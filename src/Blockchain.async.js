import { AsyncStorage, AsyncJsonAdapter } from 'vanilla-storage';

import { Blockchain as Base } from './Blockchain';

export class AsyncBlockchain extends Base {
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
    // eslint-disable-next-line no-async-promise-executor
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
    const { storage } = this.state;

    const newBlock = super.addBlock(data, previousHash, fork);
    await storage.push(newBlock);

    return newBlock;
  }
}
