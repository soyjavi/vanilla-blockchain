import Block from './Block';
import { decrypt } from './modules';

const data = { hello: 'world', year: 1980, active: true };
const previousHash = 'b894bd2ef4b59974e2704ec677524f3732bb1e9018c63b0d98df4224ca59dbca';
const secret = 'salt_and_pepper';

describe('Block', () => {
  it('default', () => {
    const block = new Block();

    expect(Object.keys(block)).toEqual(['data', 'nonce', 'previousHash', 'timestamp']);

    expect(block.data).toEqual({});
    expect(block.nonce).toEqual(0);
    expect(block.previousHash).toEqual(undefined);
    expect(block.timestamp).toBeDefined();
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
    const block = new Block({ data, previousHash, difficulty: 1 });

    expect(Object.keys(block)).toEqual(['data', 'nonce', 'previousHash', 'timestamp', 'hash']);
    expect(block.hash).toBeDefined();
    expect(block.hash.length).toEqual(64);
  });

  it('when secret', () => {
    const block = new Block({
      data, previousHash, difficulty: 1, secret,
    });

    expect(Object.keys(block)).toEqual(['data', 'nonce', 'previousHash', 'timestamp', 'hash']);
    expect(block.hash).toBeDefined();
    expect(block.hash.length).toEqual(64);
    expect(decrypt(block.data, secret)).toEqual(data);
  });

  it('using mine()', () => {
    const block = new Block({ data, previousHash });

    expect(Object.keys(block)).toEqual(['data', 'nonce', 'previousHash', 'timestamp']);
    expect(block.hash).not;
    block.mine();
    expect(Object.keys(block)).toEqual(['data', 'nonce', 'previousHash', 'timestamp', 'hash']);
    expect(block.hash).toBeDefined();
    expect(block.hash.length).toEqual(64);
  });
});
