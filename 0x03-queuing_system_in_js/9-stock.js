import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

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
  return listProducts.find((item) => item.Id === id);
}

// express instance
const app = express();
app.use(express.json());

app.get('/list_products', (req, res) => {
  const listFormat = listProducts.forEach((item) => {
    "itemId": item.id,
      "itemName": item.name,
      "price": item.price,
      "initialAvailableQuantity": item.stock,
  });
  // use the json method to send json formatted messages
  res.status(200).json(listFormat);
});

app.get('/list_products/:itemId', async (req, res) => {
  const id = parseInt(req.params.itemId);

  const item = getItemById(id);
  if (!item) {
    res.status(404).json({"status":"Product not found"});
  }

  const currentQuantity = await getCurrentReservedStockById(id);
  const jsonItem = {
    "itemId": item.Id,
    "itemName": item.name,
    "price": item.price,
    "initialAvailableQuantity": item.stock,
    "currentQuantity": parseInt(currentQuantity),
  };
  res.status(200).json(jsonItem);
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const id = parseInt(req.params.itemId);

  const item = getItemById(id);
  if (!item) {
    res.status(404).json({"status":"Product not found"});
  }
  const currentQuantity = await getCurrentReservedStockById(id);

  if (currentQuantity === null) {
    res.status(500).json({"status":"This item is no longer available","itemId": id});
  } else if (parseInt(currentQuantity) <= 0) {
    res.status(400).json({"status":"Not enough stock available","itemId":id});
  } else {
    reserveStockById(id, parseInt(currentQuantity) - 1);
  res.status(200).json({"status":"Reservation confirmed","itemId":id});
  }
});

// redis server
const client = redis.createClient();
client.on('connect', () => {
  console.log('Running redis server, welcome!');
})
.on('error', () => {
  console.log('Error: Not Connected');
});

function reserveStockById(itemId, stock) {
  client.set(itemId, stock, (err, reply) => {
    if (err) {
      console.error(err);
    }
    redis.print(reply);
  });
}

const asyncGet = promisify(client.get).bind(client);

async function getCurrentReservedStockById(itemId) {
  const result = await asyncGet(itemId);
  return result;
}

app.listen(1245, '0.0.0.0', () => {
  console.log('Connected to redis server on port 1245, accessible on all host');
});

module.exports = app;
