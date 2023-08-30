import express from 'express';
import redis from 'redis';
import promisify from 'util';

const listProducts = [
  {
    Id: 1,
    name: 'Suitcase 250',
    price: 50,
    stock: 4,
  },
  {
    Id: 2,
    name: 'Suitcase 450',
    price: 100,
    stock: 10,
  },
  {
    Id: 3,
    name: 'Suitcase 650',
    price: 350,
    stock: 2,
  },
  {
    Id: 4,
    name: 'Suitcase 1050',
    price: 550,
    stock: 5,
  },
]

function getItemById(id) {
  listProducts.map((item) => {
    if (item.Id === id) {
      return item;
    }
    return;
  });
};

// express instance
const app = express();
app.use(express.json());

app.get('/list_products', (req, res) => {
  // const data = JSON.stringify(lstProducts);
  res.status(200).send(listProducts);
});

app.get('/list_products/:itemId', (req, res) => {
  const id = req.get(itemId);
  if (!id) {
    res.send({"status":"Product not found"});
    return;
  }
  const item = getCurrentReservedStockById(id);
  return item;
};

app.get('/reserve_product/:itemId', (req, res) => {
  const id = req.get(itemId);
  if (!id) {
    res.send({"status":"Product not found"});
  }
  const items = getCurrentRerservedStock(id);
  if (item.length === 1) {
    res.send('{"status":"Not enough stock available","itemId":1}';)
  }
  reserveStockById(items[o].id, item);
  res.send({"status":"Reservation confirmed","itemId":1});
}

// redis server
const client = redis.createClient();
client.on('connec', () => {
  console.log('connected to redis server, welcome!');
})
.on('error', () => {
  console.log('Error: Not Connected');
});

function reserveStockById(itemId, stock) {
  client.set(itemId, stock, (err, reply) => {
    if (err) {
      console.error(error);
    }
    redis.print(reply);
  });
}

const asyncGet = promisify(client.get).bind(client);

async function getCurrentReservedStockById(itemId) {
  const result = await asyncGet(itemId);
  return result;
}

app.listen(1245, '0.0.0.0');

module.exports = app;
