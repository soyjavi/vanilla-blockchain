import Block from './Block';
import { decrypt } from './modules';

const data = { hello: 'world', year: 1980, active: true };
const previousHash = 'b894bd2ef4b59974e2704ec677524f3732bb1e9018c63b0d98df4224ca59dbca';
const secret = 'salt_and_pepper';

describe('Block', () => {
  it('default', () => {
    const block = new Block();

    expect(Object.keys(block)).toEqual(['data', 'nonce', 'previousHash', 'timestamp', 'hash']);

    expect(block.data).toEqual({});
    expect(block.nonce).toEqual(0);
    expect(typeof block.nonce).toEqual('number');
    expect(block.previousHash).toEqual(undefined);
    expect(block.timestamp).toBeDefined();
    expect(typeof block.timestamp).toEqual('number');
  });

  it('when data', () => {
    const block = new Block({ data });

    expect(block.data).toEqual(data);
  });

  it('when previousHash', () => {
    const block = new Block({ data, previousHash });

    expect(block.previousHash).toEqual(previousHash);
  });

  it('when difficulty', () => {
    const block = new Block({ data, previousHash, difficulty: 2 });

    expect(Object.keys(block)).toEqual(['data', 'nonce', 'previousHash', 'timestamp', 'hash']);
    expect(block.hash).toBeDefined();
    expect(block.hash.substring(0, 2)).toEqual('00');
    expect(block.hash.length).toEqual(64);
  });

  it('when fork', () => {
    const fork = {
      hash: '004272a6b83735c597e29eaa9e91392ceb814c4bf680ccb0391d5e474ecb6980',
      nonce: 128,
    };
    const block = new Block({ data, previousHash, difficulty: 2, fork });

    expect(Object.keys(block)).toEqual(['data', 'nonce', 'previousHash', 'timestamp', 'hash']);
    expect(block.hash).toEqual(fork.hash);
    expect(block.nonce).toEqual(fork.nonce);
  });
});
