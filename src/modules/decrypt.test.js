import decrypt from './decrypt';

const block = 'U2FsdGVkX19h+sfKNyz2xil/umVOcfCkb9RTBzBoPi0=';
const valueStr = 'hello world';
const valueObj = { hello: 'world', year: 2000 };
const secret = 'javi';
const secret_2 = 'jimenez';

describe('decrypt', () => {
  it('default', () => {
    expect(decrypt()).toEqual('');
  });

  it('{value:string}', () => {
    expect(decrypt(valueStr)).toEqual(valueStr);
  });

  it('{value:string} + {secret}', () => {
    expect(decrypt(block, secret)).toEqual(valueStr);
    expect(decrypt('U2FsdGVkX18t06X2N3GF+/l4nQJZ/6jp0BhTvGd6Qxg=', secret_2)).toEqual(valueStr);
  });

  it('{value:object} + {secret}', () => {
    expect(decrypt('U2FsdGVkX19hbFMEnxemr3jCTTi9cSwTbljDqL1GdrsIwtVUjJrA3cFbLhPhuc5J', secret)).toEqual(valueObj);
    expect(decrypt('U2FsdGVkX1/CRux2o9ukPAx0zNZw0m/icS3bqacRo/MT3LDLWRSWs0m6ipC476Zk', secret_2)).toEqual(valueObj);
  });

  it('{value:number} + {secret}', () => {
    expect(decrypt('U2FsdGVkX1/PRBfNvm+l+t0ClgavKXwyE4vY4jJle5A=', secret)).toEqual(2000);
  });

  it('{value:bool} + {secret}', () => {
    expect(decrypt('U2FsdGVkX1+iDJ9sVBgZn5OX85GFIBvYq0M+wUQgEQA=', secret)).toEqual(true);
  });

  it('{value:array} + {secret}', () => {
    expect(decrypt('U2FsdGVkX1+VoFmXToPlkb26tIwSW1gvUMP63wByKGY=', secret)).toEqual([1, 2, 3]);
  });

  it('{value:date} + {secret}', () => {
    expect(decrypt('U2FsdGVkX1/BvZgquYu9Epg+j+sRYEXF6pGmLhVv+BA5HTMtiS+YqzOeq/h+I+7f', secret)).toEqual(
      '1980-04-09T17:00:00.000Z',
    );
  });

  it('{value:string} + invalid {secret}', () => {
    expect(() => {
      decrypt(block, `${secret}__`);
    }).toThrowError(`Block ${block} can't be decrypted.`);
  });
});
