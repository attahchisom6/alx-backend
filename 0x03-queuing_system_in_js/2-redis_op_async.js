import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (error) => {
  console.log(`Redis client not connected to the server: ${error}`);
});

const asyncGet = promisify(client.get).bind(client);

async function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (error, reply) => {
    if (error) {
      console.error(`Error: ${error}`);
    }
    console.log('redis.print:', reply);
  });
}

async function displaySchoolValue(schoolName) {
  try {
    const reply = await asyncGet(schoolName);
    console.log(reply);
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  await displaySchoolValue('Holberton');
  await setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
}

main();
