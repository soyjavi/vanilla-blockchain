import fs from 'fs';
import path from 'path';

import { decrypt } from './modules';
import Blockchain from './Blockchain';

const DEFAULT_FILE = 'vanillachain';
const DEFAULT_COIN = 'coin';
const DEFAULT_DIFFICULTY = 1;
const file = 'vanillachain_2';
const keyChain = 'demo';
const difficulty = 3;
const secret = 'salt_and_pepper';

describe('Blockchain', () => {
  beforeEach(() => {
    const folder = path.resolve('.', 'store');
    if (fs.existsSync(`${folder}/vanillachain.json`)) fs.unlinkSync(`${folder}/vanillachain.json`);
    if (fs.existsSync(`${folder}/vanillachain_2.json`)) fs.unlinkSync(`${folder}/vanillachain_2.json`);
  });

  it('default', () => {
    const blockchain = new Blockchain();

    expect(Object.keys(blockchain)).toEqual([]);
    expect(blockchain.blocks.length).toEqual(1);
    const [genesisBlock] = blockchain.blocks;
    expect(genesisBlock.data).toEqual('Genesis Block');
  });

  it('when { file }', () => {
    const blockchain = new Blockchain({ file });

    expect(blockchain).toBeDefined();
    expect(fs.existsSync(path.resolve('.', 'store'), `{file}.json`)).toEqual(true);
  });

  it('when { keyChain }', () => {
    const blockchain = new Blockchain({ keyChain });

    expect(blockchain).toBeDefined();
    expect(blockchain.latestBlock).toBeDefined();
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

  it('when { readMode } & file not exists.', () => {
    expect(() => {
      new Blockchain({ readMode: true });
    }).toThrowError(`File ${DEFAULT_FILE} doesn't exists.`)
  });

  it('.blocks', () => {
    const blockchain = new Blockchain({ keyChain });

    expect(blockchain.blocks.length).toEqual(1);
  });

  it('.latestBlock', () => {
    const blockchain = new Blockchain({ keyChain });
    const {
      data, hash, nonce, previousHash, timestamp,
    } = blockchain.latestBlock;

    expect(data).toEqual('Genesis Block');
    expect(hash.length).toEqual(64);
    expect(nonce).toBeDefined();
    expect(previousHash).toEqual(undefined);
    expect(timestamp).toBeDefined();
  });

  it('.addBlock()', () => {
    const blockchain = new Blockchain();
    const { hash: genesisHash } = blockchain.latestBlock;

    const newData = { hello: 'world '};
    blockchain.addBlock(newData, genesisHash);
    const {
      data, hash, nonce, previousHash, timestamp,
    } = blockchain.latestBlock;

    expect(blockchain.blocks.length).toEqual(2);
    expect(data).toEqual(newData);
    expect(hash.length).toEqual(64);
    expect(nonce).toBeDefined();
    expect(previousHash).toEqual(genesisHash);
    expect(timestamp).toBeDefined();

    expect(() => {
      blockchain.addBlock(newData, genesisHash);
    }).toThrowError(`The previous hash is not valid.`)
  });

  it('when { secret } & .addBlock()', () => {
    const blockchain = new Blockchain({ secret });
    const { hash: genesisHash } = blockchain.latestBlock;

    const newData = { hello: 'world '};
    blockchain.addBlock(newData, genesisHash);
    const {
      data, hash, nonce, previousHash, timestamp,
    } = blockchain.latestBlock;

    expect(data).toEqual(newData);
    expect(hash.length).toEqual(64);
    expect(nonce).toBeDefined();
    expect(previousHash).toEqual(genesisHash);
    expect(timestamp).toBeDefined();

    expect(() => {
      blockchain.addBlock(newData, genesisHash);
    }).toThrowError(`The previous hash is not valid.`)
  });

  it('when { readMode } & .addBlock()', () => {
    new Blockchain();

    const blockchain = new Blockchain({ readMode: true });
    const { hash: genesisHash } = blockchain.latestBlock;
    expect(genesisHash).toBeDefined();

    expect(() => {
      blockchain.addBlock({ hello: 'world '}, genesisHash);
    }).toThrowError(`${DEFAULT_COIN} is in read mode only.`)
  });

  it('when { readMode } & keyChain not exists.', () => {
    const blockchain = new Blockchain();

    expect(() => {
      new Blockchain({ keyChain, readMode: true });
    }).toThrowError(`${keyChain} is in read mode only`)
  });

  it('.isValidChain', () => {
    const blockchain = new Blockchain();
    const { hash: genesisHash } = blockchain.latestBlock;

    const block2 = blockchain.addBlock({ hello: 'block_2 '}, genesisHash);
    const block3 = blockchain.addBlock({ hello: 'block_3 '}, block2.hash);
    const block4 = blockchain.addBlock({ hello: 'block_4 '}, block3.hash);

    expect(blockchain.isValidChain).toEqual(true);
  });

  it('when { secret } & .isValidChain', () => {
    const blockchain = new Blockchain({ secret });
    const { hash: genesisHash } = blockchain.latestBlock;

    const block2 = blockchain.addBlock({ hello: 'block_2 '}, genesisHash);
    const block3 = blockchain.addBlock({ hello: 'block_3 '}, block2.hash);
    const block4 = blockchain.addBlock({ hello: 'block_4 '}, block3.hash);

    expect(blockchain.isValidChain).toEqual(true);
  });
});
