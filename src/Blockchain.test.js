import fs from 'fs';
import path from 'path';

import { decrypt } from './modules';
import Blockchain from './Blockchain';

const DEFAULT_FILE = 'vanillachain';
const DEFAULT_COIN = 'coin';
const DEFAULT_DIFFICULTY = 1;
const file = 'demo';
const keyChain = 'demo';
const difficulty = 3;
const secret = 'salt_and_pepper';

describe('Blockchain', () => {
  beforeEach(() => {
    const folder = path.resolve('.', 'store');
    if (fs.existsSync(`${folder}/vanillachain.json`)) fs.unlinkSync(`${folder}/vanillachain.json`);
    if (fs.existsSync(`${folder}/demo.json`)) fs.unlinkSync(`${folder}/demo.json`);
  });

  it('default', () => {
    const blockchain = new Blockchain();

    expect(Object.keys(blockchain)).toEqual(['file', 'keyChain', 'difficulty', 'readMode', 'store', 'chain']);

    expect(blockchain.file).toEqual(DEFAULT_FILE);
    expect(blockchain.keyChain).toEqual(DEFAULT_COIN);
    expect(blockchain.difficulty).toEqual(DEFAULT_DIFFICULTY);
    expect(blockchain.readMode).toEqual(false);
    expect(blockchain.chain.length).toEqual(1);

    const firstBlock = blockchain.chain[0];
    expect(firstBlock.data).toEqual('Genesis Block');
  });

  it('when { file }', () => {
    const blockchain = new Blockchain({ file });

    expect(blockchain).toBeDefined();
    expect(blockchain.file).toEqual(file);
  });

  it('when { keyChain }', () => {
    const blockchain = new Blockchain({ keyChain });

    expect(blockchain).toBeDefined();
    expect(blockchain.file).toEqual(DEFAULT_FILE);
    expect(blockchain.keyChain).toEqual(keyChain);
  });

  it('when { difficulty }', () => {
    const blockchain = new Blockchain({ difficulty });

    expect(blockchain).toBeDefined();
    expect(blockchain.difficulty).toEqual(difficulty);
    expect(blockchain.chain[0].hash.substring(0, difficulty)).toEqual(Array(difficulty + 1).join('0'));
  });

  it('when { secret }', () => {
    const blockchain = new Blockchain({ secret });

    expect(blockchain).toBeDefined();
    const firstBlock = blockchain.chain[0];
    expect(decrypt(firstBlock.data, secret)).toEqual('Genesis Block');
  });

  it('when { readMode } and file not exists.', () => {
    expect(() => {
      new Blockchain({ readMode: true });
    }).toThrowError(`File ${DEFAULT_FILE} doesn't exists.`)
  });

  it('when { readMode } and keyChain not exists.', () => {
    const blockchain = new Blockchain();

    expect(() => {
      new Blockchain({ keyChain, readMode: true });
    }).toThrowError(`Blockchain ${keyChain} doesn't exists.`)
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

    expect(data).toEqual(newData);
    expect(hash.length).toEqual(64);
    expect(nonce).toBeDefined();
    expect(previousHash).toEqual(genesisHash);
    expect(timestamp).toBeDefined();

    expect(() => {
      blockchain.addBlock(newData, genesisHash);
    }).toThrowError(`The previous hash is not valid.`)
  });

  it('when { readMode } and .addBlock()', () => {
    new Blockchain();

    const blockchain = new Blockchain({ readMode: true });
    const { hash: genesisHash } = blockchain.latestBlock;

    expect(() => {
      blockchain.addBlock({ hello: 'world '}, genesisHash);
    }).toThrowError(`The coin is in read mode only.`)
  });

  it('.isValidChain', () => {
    const blockchain = new Blockchain();
    const { hash: genesisHash } = blockchain.latestBlock;

    const block2 = blockchain.addBlock({ hello: 'block_2 '}, genesisHash);
    const block3 = blockchain.addBlock({ hello: 'block_3 '}, block2.hash);
    const block4 = blockchain.addBlock({ hello: 'block_4 '}, block3.hash);

    expect(blockchain.isValidChain).toEqual(true);
  });
});
