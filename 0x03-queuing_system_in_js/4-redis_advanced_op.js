import redis from 'redis';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error}`);
});

const dict = {
  Portland: 50,
  Seattle: 80,
  'New York': 20,
  Bogota: 20,
  Cali: 40,
  Paris: 2,
};

const keyValueList = Object.entries(dict);
keyValueList.map(async ([key, value]) => {
  client.hset('HolbertonSchools', key, value, (error, reply) => {
    if (error) {
      console.error(error);
    }
    redis.print(`Reply: ${reply}`);
  });
});

client.hgetall('HolbertonSchools', (error, reply) => {
  if (error) {
    console.log(error);
  }
  console.log(reply);
  client.quit();
});
