import fs from 'fs';
import path from 'path';

import Store from './Store';

const folder = path.resolve('.', 'store');

describe('Store', () => {
  beforeEach(() => {
    if (fs.existsSync(`${folder}/store.json`)) fs.unlinkSync(`${folder}/store.json`);
    if (fs.existsSync(`${folder}/store_2.json`)) fs.unlinkSync(`${folder}/store_2.json`);
    if (fs.existsSync(`${folder}/store_3.json`)) fs.unlinkSync(`${folder}/store_3.json`);
  });

  it('default', () => {
    const store = new Store();

    expect(Object.keys(store)).toEqual([]);
    expect(store.get).toBeDefined();
    expect(store.push).toBeDefined();
    expect(store.save).toBeDefined();
    expect(store.value).toEqual(undefined);
  });

  it('when {filename}', () => {
    const store = new Store({ filename: `${folder}/store_2.json` });
  });

  it('when {defaults}', () => {
    const store = new Store({ defaults: { coins: [1, 2, 3] } });
    expect(store.value).toEqual(undefined);
    expect(store.get('coins').value).toEqual([1, 2, 3]);
  });

  it('.push()', () => {
    const store = new Store();

    store.push({ hello: 'world' });
    expect(store.value).toEqual([{ hello: 'world'}]);
  });

  it('.get() & .push()', () => {
    const store = new Store();

    store.get('spanish').push({ hola: 'mundo' });
    expect(store.value).toEqual([{ hola: 'mundo' }]);
  });

  it('when {autoSave:false} && .push()', () => {
    const store = new Store({ autoSave: false });

    store.push({ kaixo: 'mundua' });
    store.push({ hola: 'mundo' });
    store.push({ hello: 'world' });
    expect(store.value).toEqual(undefined);
  });

  it('when {autoSave:false} && .get() && .push()', () => {
    const store = new Store({ autoSave: false });

    store.get('basque').push({ kaixo: 'mundua' });
    expect(store.value).toEqual(undefined);
    store.get('spanish').push({ hola: 'mundo' });
    expect(store.value).toEqual(undefined);
    store.get('english').push({ hello: 'world' });
    expect(store.value).toEqual(undefined);

    store.save();

    expect(store.get('basque').value).toEqual([{ kaixo: 'mundua' }]);
    expect(store.get('spanish').value).toEqual([{ hola: 'mundo' }]);
    expect(store.get('english').value).toEqual([{ hello: 'world' }]);

    store.save();
  });

  it('.wipe()', () => {
    const store = new Store({ filename: `${folder}/store_3.json` });

    store.push({ hello: 'world' });
    store.wipe();
    expect(store.value).toEqual(undefined);
    store.push({ hello: 'world' });
    expect(store.value).toEqual([{ hello: 'world'}]);
  })
});
