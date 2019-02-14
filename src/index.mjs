import dotenv from 'dotenv';
import fs from 'fs';

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

  b.close();

  fs.writeFileSync('baskets.json', JSON.stringify(populatedCollections));

  const summary = populatedCollections.map(c => ({
    name: c.name,
    size: c.elements.length,
    totalPrice: c.elements.reduce((acc, e) => acc + (e.amount * e.price), 0),
  }));

  summary.forEach((s) => {
    console.log(`${s.name},${s.size},${s.totalPrice}`);
  });
};

doIt();
