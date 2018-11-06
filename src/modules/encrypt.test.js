import encrypt from './encrypt';

const valueStr = 'hello world';
const valueObj = { hello: 'world', year: 2000 };
const secret = 'javi';
const secret_2 = 'jimenez';

describe('encrypt', () => {
  it('default', () => {
    expect(encrypt()).toEqual('');
  });

  it('{value:string}', () => {
    expect(encrypt(valueStr)).toEqual(valueStr);
  });

  it('{value:object}', () => {
    expect(encrypt(valueObj)).toEqual(valueObj);
  });

  it('{value:string} + {password}', () => {
    expect(encrypt(valueStr, secret)).not.toEqual(valueStr);
    expect(encrypt(valueStr, secret_2)).not.toEqual(valueStr);
  });

  it('{value:object} + {password}', () => {
    expect(encrypt(valueObj, secret)).not.toEqual(valueObj);
    expect(encrypt(valueObj, secret_2)).not.toEqual(valueObj);
  });

  it('{value:number} + {password}', () => {
    expect(encrypt(2000, secret)).not.toEqual(2000);
  });

  it('{value:bool} + {password}', () => {
    expect(encrypt(true, secret)).not.toEqual(true);
  });

  it('{value:array} + {password}', () => {
    expect(encrypt([1, 2, 3], secret)).not.toEqual([1, 2, 3]);
  });

  it('{value:date} + {password}', () => {
    expect(encrypt(new Date(1980, 3, 10, 0, 0, 0), secret)).not.toEqual(new Date(1980, 3, 10, 0, 0, 0));
  });
});
