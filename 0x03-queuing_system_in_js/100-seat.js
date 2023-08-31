import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';
import express from 'express';

// creating redis server
const client = redis.createClient();
let availableSeats = 50;
let reservationEnabled = true;

client.on('connect', () => {
  console.log('Running Redis server Welcome!');
})
.on('error', (error) => {
  console.error(error);
});

function reserveSeat(number) {
  client.set('availableSeats', number, (err, reply) => {
    if (err) {
      console.error(err);
    }
    redis.print(reply);
  });
}

const asyncGet = promisify(client.get).bind(client);

async function getCurrentAvailableSeats() {
  try {
    let result = await asyncGet('availableSeats');
    if (!result) {
      result = "Can't read from the database";
      console.log("Can't read from the database");
    }
    return result;
  } catch(error) {
    console.error(error);
  }
}

// queue creation
const queue = kue.createQueue();

// express Server creation
const app = express()
app.use(express.json());

app.get('/available_seats', async (req, res) => {
  const numCurrentSeats = await getCurrentAvailableSeats();
  res.json({"numberOfAvailableSeats":numCurrentSeats});
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.json({ "status": "Reservation are blocked" });
  }
  const job = queue.create('reserve_seat');
  job.save((error) => {
    if (!error) {
      res.json({ "status": "Reservation in process" });
    } else {
      res.json({ "status": "Reservation failed" });
    }
  })
  .on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  })
  .on('failed', (error) => {
    console.error(`Seat reservation job ${job.id} failed: ${error}`)
  });
});

app.get('/process', async (req, res) => {
  const currentAvailableSeats = getCurrentAvailableSeats();

  if (currentAvailableSeats === 0) {
    reservationEnabled = false;
  } else if (currentAvailableSeats >= 1) {
    queue.process('reserve_seat', async (job, done) => {
      try {
        const newAvailableSeats = currentAvailableSeats - 1;
        if (newAvailableSeats === 0) {
          reservationEnabled = false;
        }
        reserveSeat(newAvailableSeats);
        done();
      } catch(error) {
        console.log('Not enough seats available');
        done('Not enough seats available');
      }
    });
    console.log({ "status": "Queue processing" });
    res.json({ "status": "Queue processing" });
  } else {
    console.log('Not enough seats available');
    res.json('Not enough seats available');
  }
});

app.listen(1245, '0.0.0.0', () => {
  console.log('Connected to redis sever, port 1245 listening on all host');
});

module.exports = app;
