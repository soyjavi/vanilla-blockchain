import calculateHash from './calculateHash';

const previousHash = 'b894bd2ef4b59974e2704ec677524f3732bb1e9018c63b0d98df4224ca59dbca';
const timestamp = new Date(1980, 10, 4, 0, 0, 0).getTime();
const data = { hello: 'world' };
const nonce = 32;

describe('calculateHash', () => {
  it('default', () => {
    const hash = calculateHash();
    expect(hash).toEqual(previousHash);
  });

  it('add previousHash', () => {
    const hash = calculateHash({ previousHash });
    expect(hash.length).toEqual(64);
  });

  it('add timestamp', () => {
    const hash = calculateHash({ previousHash, timestamp });
    expect(hash.length).toEqual(64);
  });

  it('add data', () => {
    const hash = calculateHash({ previousHash, timestamp, data });
    expect(hash.length).toEqual(64);
  });

  it('add nonce', () => {
    const hash = calculateHash({
      previousHash, timestamp, data, nonce,
    });
    expect(hash.length).toEqual(64);
  });
});
