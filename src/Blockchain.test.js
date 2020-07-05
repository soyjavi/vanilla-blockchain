import fs from 'fs';
import path from 'path';

import Blockchain from './Blockchain';

const DEFAULT_FILE = 'vanilla-blockchain';
const DEFAULT_COIN = 'coin';
const DEFAULT_DIFFICULTY = 1;
const filename = 'vanilla-blockchain_2';
const key = 'demo';
const defaults = { blocks: [], [key]: [] };
const difficulty = 3;
const secret = 'salt_and_pepper';

describe('Blockchain', () => {
  beforeEach(() => {
    const folder = path.resolve('.', 'store');
    if (fs.existsSync(`${folder}/vanilla-blockchain.json`)) fs.unlinkSync(`${folder}/vanilla-blockchain.json`);
    if (fs.existsSync(`${folder}/vanilla-blockchain_2.json`)) fs.unlinkSync(`${folder}/vanilla-blockchain_2.json`);
    if (fs.existsSync(`${folder}/vanilla-blockchain_3.json`)) fs.unlinkSync(`${folder}/vanilla-blockchain_3.json`);
  });

  it('default', () => {
    const blockchain = new Blockchain();

    expect(Object.keys(blockchain)).toEqual([]);
    expect(blockchain.blocks.length).toEqual(1);
    const [genesisBlock] = blockchain.blocks;
    expect(genesisBlock.data).toEqual('Genesis Block');
  });

  it('when { filename }', () => {
    const blockchain = new Blockchain({ filename });

    expect(blockchain).toBeDefined();
    expect(fs.existsSync(path.resolve('.', 'store'), `{filename}.json`)).toEqual(true);
  });

  it('when { defaults }', () => {
    const blockchain = new Blockchain({ key, defaults });

    expect(blockchain).toBeDefined();
    expect(blockchain.blocks.length).toEqual(1);
    expect(blockchain.latestBlock).toBeDefined();

    blockchain.get('blocks');
    expect(blockchain.blocks.length).toEqual(1);
  });

  it('when { difficulty }', () => {
    const blockchain = new Blockchain({ difficulty });

    expect(blockchain).toBeDefined();
    expect(blockchain.blocks[0].hash.substring(0, difficulty)).toEqual(Array(difficulty + 1).join('0'));
  });

  it('when { secret }', () => {
    const blockchain = new Blockchain({ secret });

    expect(blockchain).toBeDefined();
    const { latestBlock } = blockchain;
    expect(latestBlock.data).toEqual('Genesis Block');
  });

  it('when invalid { secret }', () => {
    const blockchain = new Blockchain({ filename, secret });

    expect(() => {
      new Blockchain({ filename, secret: `sal_y_pimienta` });
    }).toThrowError(`Blockchain ${filename} can't be decrypted`);
  });

  it('key "blocks" exists by default', () => {
    const blockchain = new Blockchain({ key });

    expect(blockchain.blocks.length).toEqual(1);
    expect(blockchain.blocks[0].data).toEqual('Genesis Block');
  });

  // ---------------------------------------------------------------------------
  // FAILS
  // ---------------------------------------------------------------------------
  // it('when { readMode } & file not exists.', () => {
  //   expect(() => {
  //     new Blockchain({ readMode: true });
  //   }).toThrowError(`File ${DEFAULT_FILE} doesn't exists.`);
  // });
  // ---------------------------------------------------------------------------
  // / FAILS
  // ---------------------------------------------------------------------------

  it('.latestBlock', () => {
    const blockchain = new Blockchain({ key });
    const { data, hash, nonce, previousHash, timestamp } = blockchain.latestBlock;

    expect(data).toEqual('Genesis Block');
    expect(hash.length).toEqual(64);
    expect(nonce).toBeDefined();
    expect(previousHash).toEqual(undefined);
    expect(timestamp).toBeDefined();
  });

  it('.addBlock()', () => {
    const blockchain = new Blockchain();
    const { hash: genesisHash } = blockchain.latestBlock;

    const newData = { hello: 'world ' };
    blockchain.addBlock(newData, genesisHash);
    const { data, hash, nonce, previousHash, timestamp } = blockchain.latestBlock;

    expect(blockchain.blocks.length).toEqual(2);
    expect(data).toEqual(newData);
    expect(hash.length).toEqual(64);
    expect(nonce).toBeDefined();
    expect(previousHash).toEqual(genesisHash);
    expect(timestamp).toBeDefined();

    expect(() => {
      blockchain.addBlock(newData, genesisHash);
    }).toThrowError(`The previous hash is not valid.`);
  });

  it('when { autoSave } & .addBlock()', () => {
    const blockchain = new Blockchain({ autoSave: false });

    const { hash: genesisHash } = blockchain.latestBlock;
    const newData = { hello: 'world ' };
    const block = blockchain.addBlock(newData, genesisHash);

    expect(blockchain.blocks).toEqual([]);

    blockchain.save();
    expect(blockchain.blocks.length).toEqual(2);
  });

  it('when { secret } & .addBlock()', () => {
    const blockchain = new Blockchain({ secret });
    const { hash: genesisHash } = blockchain.latestBlock;

    const newData = { hello: 'world ' };
    blockchain.addBlock(newData, genesisHash);
    const { data, hash, nonce, previousHash, timestamp } = blockchain.latestBlock;

    expect(data).toEqual(newData);
    expect(hash.length).toEqual(64);
    expect(nonce).toBeDefined();
    expect(previousHash).toEqual(genesisHash);
    expect(timestamp).toBeDefined();

    expect(() => {
      blockchain.addBlock(newData, genesisHash);
    }).toThrowError(`The previous hash is not valid.`);
  });

  it('when { readMode } & .addBlock()', () => {
    new Blockchain();

    const blockchain = new Blockchain({ readMode: true });
    const { hash: genesisHash } = blockchain.latestBlock;
    expect(genesisHash).toBeDefined();

    expect(() => {
      blockchain.addBlock({ hello: 'world ' }, genesisHash);
    }).toThrowError('Read mode only');
  });

  it('when { fork } & .addBlock()', () => {
    const blockchain = new Blockchain();

    const newData = { hello: 'world ' };
    const fork = {
      hash: 'b894bd2ef4b59974e2704ec677524f3732bb1e9018c63b0d98df4224ca59dbca',
      nonce: 128,
    };
    const { hash: genesisHash } = blockchain.latestBlock;

    blockchain.addBlock(newData, genesisHash, fork);
    const { data, hash, nonce, previousHash, timestamp } = blockchain.latestBlock;

    expect(data).toEqual(newData);
    expect(hash).toEqual(fork.hash);
    expect(nonce).toEqual(fork.nonce);
    expect(previousHash).toEqual(genesisHash);
  });

  it('when { fork } & .addBlock() & parameters are invalid.', () => {
    const blockchain = new Blockchain();
    const fork = {};

    expect(() => {
      const { hash: genesisHash } = blockchain.latestBlock;
      const newData = { hello: 'world ' };

      blockchain.addBlock(newData, genesisHash, fork);
    }).toThrowError('Not valid fork parameters.');
  });

  it('when { readMode } & key not exists.', () => {
    const blockchain = new Blockchain();

    expect(() => {
      new Blockchain({ key, readMode: true });
    }).toThrowError('Read mode only');
  });

  it('.isValidChain', () => {
    const blockchain = new Blockchain();
    const { hash: genesisHash } = blockchain.latestBlock;

    const block2 = blockchain.addBlock({ hello: 'block_2 ' }, genesisHash);
    const block3 = blockchain.addBlock({ hello: 'block_3 ' }, block2.hash);
    const block4 = blockchain.addBlock({ hello: 'block_4 ' }, block3.hash);

    expect(blockchain.isValidChain).toEqual(true);
  });

  it('when { secret } & .isValidChain', () => {
    const blockchain = new Blockchain({ secret });
    const { hash: genesisHash } = blockchain.latestBlock;

    const block2 = blockchain.addBlock({ hello: 'block_2 ' }, genesisHash);
    const block3 = blockchain.addBlock({ hello: 'block_3 ' }, block2.hash);
    const block4 = blockchain.addBlock({ hello: 'block_4 ' }, block3.hash);

    expect(blockchain.isValidChain).toEqual(true);
  });

  it('.wipe()', () => {
    const filename = 'vanilla-blockchain_3';
    let blockchain = new Blockchain({ filename });
    const { hash: genesisHash } = blockchain.latestBlock;

    blockchain.addBlock({ hello: 'world' }, genesisHash);
    expect(blockchain.blocks.length).toEqual(2);

    blockchain.wipe();

    blockchain = new Blockchain({ filename });
    expect(blockchain.blocks.length).toEqual(1);
    expect(blockchain.latestBlock.data).toEqual('Genesis Block');
  });
});
