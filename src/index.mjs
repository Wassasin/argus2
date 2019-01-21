import dotenv from 'dotenv';
dotenv.config();

import Browser from './browser';
import Coop from './coop';

const syncAll = async (arr) => {
  const result = [];

  for (const f of arr) {
    result.push(await f());
  }
  
  return result;
};

const doIt = async () => {
  const b = new Browser('https://www.coop.nl/odoornschippers/');
  await b.init();

  const c = new Coop(b);
  await c.login(process.env.COOP_USERNAME, process.env.COOP_PASSWORD);

  const collections = await c.listCollections();
  const populatedCollections = await syncAll(collections.map(collection => () => c.getCollection(collection)));

  console.log(populatedCollections);
};

doIt();
