import fs from 'fs';
import path from 'path';
import 'regenerator-runtime/runtime';

import { AsyncBlockchain, AsyncJsonAdapter } from './index';

const DEFAULTS = { adapter: AsyncJsonAdapter, filename: 'vanilla-blockchain-async' };

const filename = 'vanilla-blockchain-async-2';
const key = 'demo';
const defaults = { blocks: [], [key]: [] };
const difficulty = 3;
const secret = 'salt_and_pepper';

describe('AsyncBlockchain (async)', () => {
  beforeEach(() => {
    const folder = path.resolve('.', 'store');
    if (fs.existsSync(`${folder}/vanilla-blockchain-async.json`))
      fs.unlinkSync(`${folder}/vanilla-blockchain-async.json`);
    if (fs.existsSync(`${folder}/vanilla-blockchain-async-2.json`))
      fs.unlinkSync(`${folder}/vanilla-blockchain-async-2.json`);
    if (fs.existsSync(`${folder}/vanilla-blockchain-async-3.json`))
      fs.unlinkSync(`${folder}/vanilla-blockchain-async-3.json`);
  });

  it('default', async () => {
    const blockchain = await new AsyncBlockchain(DEFAULTS);

    expect(Object.keys(blockchain)).toEqual(['state']);
    expect(blockchain.blocks.length).toEqual(1);
    const [genesisBlock] = blockchain.blocks;
    expect(genesisBlock.data).toEqual('Genesis Block');
  });

  it('when { filename }', async () => {
    const blockchain = await new AsyncBlockchain({ ...DEFAULTS, filename });

    expect(blockchain).toBeDefined();
    expect(fs.existsSync(path.resolve('.', 'store'), `{filename}.json`)).toEqual(true);
  });

  it('when { defaults }', async () => {
    const blockchain = await new AsyncBlockchain({ ...DEFAULTS, key, defaults });

    expect(blockchain).toBeDefined();
    expect(blockchain.blocks.length).toEqual(1);
    expect(blockchain.latestBlock).toBeDefined();

    blockchain.get('blocks');
    expect(blockchain.blocks.length).toEqual(1);
  });

  it('when { difficulty }', async () => {
    const blockchain = await new AsyncBlockchain({ ...DEFAULTS, difficulty });

    expect(blockchain).toBeDefined();
    expect(blockchain.blocks[0].hash.substring(0, difficulty)).toEqual(Array(difficulty + 1).join('0'));
  });

  it('when { secret }', async () => {
    const blockchain = await new AsyncBlockchain({ ...DEFAULTS, secret });

    expect(blockchain).toBeDefined();
    const { latestBlock } = blockchain;
    expect(latestBlock.data).toEqual('Genesis Block');
  });

  // it('when invalid { secret }', async () => {
  //   const blockchain = await new AsyncBlockchain({ ...DEFAULTS, secret });

  //   await expect(new AsyncBlockchain({ ...DEFAULTS, secret: `sal_y_pimienta` })).rejects.toThrowError(
  //     `Blockchain ${filename} can't be decrypted`,
  //   );
  // });

  it('key "blocks" exists by default', async () => {
    const blockchain = await new AsyncBlockchain({ ...DEFAULTS, key });

    expect(blockchain.blocks.length).toEqual(1);
    expect(blockchain.blocks[0].data).toEqual('Genesis Block');
  });

  // // ---------------------------------------------------------------------------
  // // FAILS
  // // ---------------------------------------------------------------------------
  // // it('when { readMode } & file not exists.', async () => {
  // //   expect(async () => {
  // //     new AsyncBlockchain({ ...DEFAULTS, readMode: true });
  // //   }).toThrowError(`File ${DEFAULT_FILE} doesn't exists.`);
  // // });
  // // ---------------------------------------------------------------------------
  // // / FAILS
  // // ---------------------------------------------------------------------------

  it('.latestBlock', async () => {
    const blockchain = await new AsyncBlockchain({ ...DEFAULTS, key });
    const { data, hash, nonce, previousHash, timestamp } = blockchain.latestBlock;

    expect(data).toEqual('Genesis Block');
    expect(hash.length).toEqual(64);
    expect(nonce).toBeDefined();
    expect(previousHash).toEqual(undefined);
    expect(timestamp).toBeDefined();
  });

  it('.addBlock()', async () => {
    const blockchain = await new AsyncBlockchain(DEFAULTS);
    const { hash: genesisHash } = blockchain.latestBlock;

    const newData = { hello: 'world ' };
    await blockchain.addBlock(newData, genesisHash);
    const { data, hash, nonce, previousHash, timestamp } = blockchain.latestBlock;

    expect(blockchain.blocks.length).toEqual(2);
    expect(data).toEqual(newData);
    expect(hash.length).toEqual(64);
    expect(nonce).toBeDefined();
    expect(previousHash).toEqual(genesisHash);
    expect(timestamp).toBeDefined();

    await expect(blockchain.addBlock(newData, genesisHash)).rejects.toThrowError(`The previous hash is not valid.`);
  });

  it('when { autoSave } & .addBlock()', async () => {
    const blockchain = await new AsyncBlockchain({ ...DEFAULTS, autoSave: false });

    const { hash: genesisHash } = blockchain.latestBlock;
    const newData = { hello: 'world ' };
    const block = await blockchain.addBlock(newData, genesisHash);

    expect(blockchain.blocks).toEqual([]);

    await blockchain.save();
    expect(blockchain.blocks.length).toEqual(2);
  });

  it('when { secret } & .addBlock()', async () => {
    const blockchain = await new AsyncBlockchain({ ...DEFAULTS, secret });
    const { hash: genesisHash } = blockchain.latestBlock;

    const newData = { hello: 'world ' };
    await blockchain.addBlock(newData, genesisHash);
    const { data, hash, nonce, previousHash, timestamp } = blockchain.latestBlock;

    expect(data).toEqual(newData);
    expect(hash.length).toEqual(64);
    expect(nonce).toBeDefined();
    expect(previousHash).toEqual(genesisHash);
    expect(timestamp).toBeDefined();

    await expect(blockchain.addBlock(newData, genesisHash)).rejects.toThrowError(`The previous hash is not valid.`);
  });

  // it('when { readMode } & .addBlock()', async () => {
  //   await new AsyncBlockchain(DEFAULTS);

  //   const blockchain = await new AsyncBlockchain({ ...DEFAULTS, readMode: true });
  //   const { hash: genesisHash } = blockchain.latestBlock;
  //   expect(genesisHash).toBeDefined();

  //   await expect(blockchain.addBlock({ hello: 'world ' }, genesisHash)).rejects.toThrowError('Read mode only');
  // });

  it('when { fork } & .addBlock()', async () => {
    const blockchain = await new AsyncBlockchain(DEFAULTS);

    const newData = { hello: 'world ' };
    const fork = {
      hash: 'b894bd2ef4b59974e2704ec677524f3732bb1e9018c63b0d98df4224ca59dbca',
      nonce: 128,
    };
    const { hash: genesisHash } = blockchain.latestBlock;

    await blockchain.addBlock(newData, genesisHash, fork);
    const { data, hash, nonce, previousHash, timestamp } = blockchain.latestBlock;

    expect(data).toEqual(newData);
    expect(hash).toEqual(fork.hash);
    expect(nonce).toEqual(fork.nonce);
    expect(previousHash).toEqual(genesisHash);
  });

  it('when { fork } & .addBlock() & parameters are invalid.', async () => {
    const blockchain = await new AsyncBlockchain(DEFAULTS);
    const fork = {};

    const { hash: genesisHash } = blockchain.latestBlock;
    const newData = { hello: 'world ' };

    await expect(blockchain.addBlock(newData, genesisHash, fork)).rejects.toThrowError('Not valid fork parameters.');
  });

  // it('when { readMode } & key not exists.', async () => {
  //   const blockchain = await new AsyncBlockchain(DEFAULTS);

  //   await expect(new AsyncBlockchain({ ...DEFAULTS, key, readMode: true })).rejects.toThrowError('Read mode only');
  // });

  it('.isValidChain', async () => {
    const blockchain = await new AsyncBlockchain(DEFAULTS);
    const { hash: genesisHash } = blockchain.latestBlock;

    const block2 = await blockchain.addBlock({ hello: 'block_2 ' }, genesisHash);
    const block3 = await blockchain.addBlock({ hello: 'block_3 ' }, block2.hash);
    const block4 = await blockchain.addBlock({ hello: 'block_4 ' }, block3.hash);

    expect(blockchain.isValidChain).toEqual(true);
  });

  it('when { secret } & .isValidChain', async () => {
    const blockchain = await new AsyncBlockchain({ ...DEFAULTS, secret });
    const { hash: genesisHash } = blockchain.latestBlock;

    const block2 = await blockchain.addBlock({ hello: 'block_2 ' }, genesisHash);
    const block3 = await blockchain.addBlock({ hello: 'block_3 ' }, block2.hash);
    const block4 = await blockchain.addBlock({ hello: 'block_4 ' }, block3.hash);

    expect(blockchain.isValidChain).toEqual(true);
  });

  it('.wipe()', async () => {
    const filename = 'vanilla-blockchain-3';
    let blockchain = await new AsyncBlockchain({ ...DEFAULTS, filename });
    const { hash: genesisHash } = blockchain.latestBlock;

    await blockchain.addBlock({ hello: 'world' }, genesisHash);
    expect(blockchain.blocks.length).toEqual(2);

    await blockchain.wipe();

    blockchain = await new AsyncBlockchain({ ...DEFAULTS, filename });
    expect(blockchain.blocks.length).toEqual(1);
    expect(blockchain.latestBlock.data).toEqual('Genesis Block');
  });
});
