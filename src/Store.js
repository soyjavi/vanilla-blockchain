import fs from 'fs';
import path from 'path';

const folder = path.resolve('.', 'store');
const state = new WeakMap();

const write = (filename, data = {}) => {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw new Error(`${filename} could not be saved correctly.`);
  }
};

export default class Store {
  constructor({
    autoSave = true,
    defaults = {},
    filename = `${folder}/store.json`,
  } = {}) {
    let data = defaults;

    if (!fs.existsSync(filename)) {
      write(filename, data);
    } else {
      data = JSON.parse(fs.readFileSync(filename, 'utf8'));

      try {
        data = JSON.parse(fs.readFileSync(filename, 'utf8'));
      } catch (error) {
        throw new Error(`${filename} could not be loaded correctly.`);
      }
    }

    state.set(this, {
      autoSave,
      data,
      filename,
      key: 'default',
      memoryPool: [],
    });

    return this;
  }

  get(key) {
    state.set(this, Object.assign(state.get(this), { key }));

    return this;
  }

  push(value = {}) {
    const { autoSave, key, memoryPool } = state.get(this);

    if (autoSave) this.save(value);
    else memoryPool.push({ key, value });

    return this;
  }

  save(value) {
    const {
      data, filename, key, memoryPool = [],
    } = state.get(this);

    if (value) {
      data[key] = data[key] ? [...data[key], value] : [value];
      write(filename, data);
    } else if (memoryPool.length > 0) {
      memoryPool.forEach((item) => {
        data[item.key] = data[item.key] ? [...data[item.key], item.value] : [item.value];
      });
      write(filename, data);
      state.set(this, Object.assign(state.get(this), { memoryPool: [] }));
    }
  }

  get value() {
    const { data, key } = state.get(this);

    return data[key];
  }

  wipe() {
    const { filename } = state.get(this);

    write(filename);
  }
}
