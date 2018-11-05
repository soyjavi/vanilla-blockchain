# vanillachain-core
[![npm](https://img.shields.io/npm/v/vanillachain.svg?style=flat-square)](https://www.npmjs.com/package/vanillachain-core)
[![Build Status](http://img.shields.io/travis/soyjavi/vanillachain-core/master.svg?style=flat-square)](https://travis-ci.org/soyjavi/vanillachain-core)
[![dependencies Status](https://david-dm.org/soyjavi/vanillachain-core/status.svg?style=flat-square)](https://david-dm.org/soyjavi/vanillachain-core)
[![devDependencies Status](https://david-dm.org/soyjavi/vanillachain-core/dev-status.svg?style=flat-square)](https://david-dm.org/soyjavi/vanillachain-core?type=dev)
[![NpmLicense](https://img.shields.io/npm/l/vanillachain.svg?style=flat-square)](https://spdx.org/licenses/MIT)

> A distributed database that maintains a continuously growing list of ordered records.

## Motivation
All the current implementations of blockchains are tightly coupled with the larger context and problems they (e.g. Bitcoin or Ethereum) are trying to solve. This makes understanding blockchains a necessarily harder task, than it must be. Especially source-code-wisely. This project is an attempt to provide as concise and simple implementation of a blockchain as possible.

If we look for the definition of blockchain in [Wikipedia](https://en.wikipedia.org/wiki/Blockchain_(database)) we will find something like:

> Blockchain is a distributed database that maintains a continuously-growing list of records called blocks secured from tampering and revision.

So we will work on this concept extracting the most important points that VanillaChain has to solve:

* Use **HTTP interface** in each node to add new blocks or find them.
* Use **Websockets** in order to communicate with the network of nodes.
* Find a way to **add/remove nodes** from the network.
* Super simple **protocol** in our P2P communication.
* All **data** will be persisted in *JSON* files.
* Use a basic implementation of **Proof of work**.


## Overview
A blockchain is a public database that consists out of blocks that anyone can read. Nothing special, but they have an interesting property: they are immutable. Once a block has been added to the chain, it cannot be changed anymore without invalidating the rest of the chain.

![VanillaChain text](https://i.imgur.com/N3szdY7.png)

That is the reason why cryptocurrencies are based on blockchains. You don't want people changing their transactions after they've made them!


### Block structure

We will start by defining the block structure. Only the most essential properties are included at the block at this point.

* `data`: Any data that is included in the block.
* `timestamp`: A timestamp using ISO format.
* `nonce` : A number of attempts to generate the correct hash.
* `hash`: A sha256 hash taken from the content of the block.
* `previousHash`: A reference to the hash of the previous block.

The code for the block structure looks like the following:

```
class Block {
  constructor({
    data = {}, previousHash, timestamp = new Date().toISOString(),
  } = {}) {
    this.data = data;
    this.nonce = 0;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
  }
}
```

### Block hash
The block hash is one of the most important property of the block. The hash is calculated over all data of the block. This means that if anything in the block changes, the original hash is no longer valid. The block hash can also be thought as the unique identifier of the block.

We calculate the hash of the block using the following code:

```
import { SHA256 } from 'crypto-js';

export default ({
  previousHash, timestamp, data = {}, nonce = 0,
} = {}) => SHA256(previousHash + timestamp + JSON.stringify(data) + nonce).toString();
```

### Proof of Work
It's a simple technique that prevents abuse by requiring a certain amount of computing work. That amount of work is key to prevent spam and tampering. Bitcoin implements *proof-of-work* by requiring that the hash of a block starts with a specific number of zero's. This is also called the **difficulty**.

To fix this problem, blockchains add a `nonce` value. This is a number that gets incremented until a good hash is found. And because you cannot predict the output of a hash function, you simply have to try a lot of combinations before you get a hash that satisfies the difficulty. Looking for a valid hash (to create a new block) is also called *mining* in the cryptoworld.

Adjusting the difficulty we can decide how long it would take to calculate a new block. Let's see the code of our mining function:

```
mine(difficulty = 0) {
  this.hash = calculateHash(this);
  while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
    this.nonce += 1;
    this.hash = calculateHash(this);
  }
}
```


## Getting Started

### Configure your environment
The easiest way for choose your kind of instance is creating a `.env` file in the root of the project. You just to choose the kind of *instance* and its *port* of running.

```
# Instance configuration
INSTANCE=network
PORT=3000

# Network address
NETWORK=http://localhost:3000
```


## `Commands`

#### Start the *network* instance (for now we need a broadcasting system)
```
PORT=3000 INSTANCE=network yarn start
```

#### Start some *peer* instances
```
PORT=3001 INSTANCE=peer yarn start
PORT=3002 INSTANCE=peer yarn start
PORT=3003 INSTANCE=peer yarn start
```

#### Store a new block in an specific *peer*

We should send a object with:

```
{
  data: {...}         // The data you wanna keep in the blockchain
  file: 'vanilla', // The name of the store
  keyChain: 'myChain', // The key of your blockchain you wanna use inside your store.
  previousHash: '..', // The last block hash
}
```

```
curl -H "Content-type:application/json" --data '{"file": "vanilla", "keyChain": "myChain", "data" : "Some data to the first block", "previousHash": "03407ea4418f161744ecc811816530f0dc3b345fc9af6841427f831e3afb46db"}' http://localhost:3001/block
```

#### Mine a new block in an specific *peer*

If you wanna just *mine* a block and not store it in your blockchain:

```
curl -H "Content-type:application/json" --data '{"file": "vanilla", "keyChain": "myChain", "data" : "Some data to the first block", "previousHash": "03407ea4418f161744ecc811816530f0dc3b345fc9af6841427f831e3afb46db"}' http://localhost:3001/block/mine
```

#### Get the last block mined in an specific *peer*
```
curl -G 'http://localhost:3001/block/last' -d 'file=vanilla&keyChain=myChain'
```

#### Send to all peers a block to mine
```
curl -H "Content-type:application/json" --data '{"data" : "Some data to the first block"}' http://localhost:3000/mine/block
```
