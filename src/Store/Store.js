import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import path from 'path';
import fs from 'fs';

import Block from '../Block'; // @TODO: Decouple

export default ({
  difficulty, file, keyChain, readMode,
}) => {
  const folder = path.resolve('.', 'store');
  if (!fs.existsSync(folder) && !readMode) fs.mkdirSync(folder);

  const storeFile = `${folder}/${file}.json`;
  if (!fs.existsSync(storeFile) && readMode) throw Error(`File ${file} doesn't exists.`);

  const store = low(new FileSync(storeFile));
  if (!store.has(keyChain).value()) {
    if (readMode) throw Error(`Blockchain ${keyChain} doesn't exists.`);
    store
      .set(keyChain, [new Block({ data: 'Genesis Block', difficulty, index: 0 })])
      .write();
  }

  return {
    store,
    chain: store.get(keyChain).value(),
  };
};
