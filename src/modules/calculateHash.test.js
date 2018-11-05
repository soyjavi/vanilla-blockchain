import calculateHash from './calculateHash';

const previousHash = 'b894bd2ef4b59974e2704ec677524f3732bb1e9018c63b0d98df4224ca59dbca';
const timestamp = new Date(1980, 10, 4, 0, 0, 0);
const data = { hello: 'world' };
const nonce = 32;

describe('calculateHash', () => {
  it('default', () => {
    const hash = calculateHash();
    expect(hash).toEqual(previousHash);
  });

  it('add previousHash', () => {
    const hash = calculateHash({ previousHash });
    expect(hash).toEqual('09e15a4d65da4cb0652e9365390e4641668d2766cef3e28e8722e0a11b56b1b2');
  });

  it('add timestamp', () => {
    const hash = calculateHash({ previousHash, timestamp });
    expect(hash).toEqual('790cb4861b8d36008b577463d9b5474c4e5bbd71ab23c78990d4109c700a7829');
  });

  it('add data', () => {
    const hash = calculateHash({ previousHash, timestamp, data });
    expect(hash).toEqual('bebd6380476c6a344e46f288c92cbf767c74ef753b15e7a18e07a45da78e60d8');
  });

  it('add nonce', () => {
    const hash = calculateHash({
      previousHash, timestamp, data, nonce,
    });
    expect(hash).toEqual('ab011e0742f9fabf032032697aafcc1d74fcfce9ceb4773bf096bba9f59dff87');
  });
});
