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
    const result = await asyncGet(availableSeats);
    if (!result) {
      console.log("Can't read from the database");
    }
    return parseInt(result);
  } catch(error) {
    console.error(error);
  }
}

// queue creation
const queue = kue.createQueue();

// express Server creation
app = express()
app.use(express.json());

app.get('/available_seats', async (req, res) => {
  const numCurrentSeat = await getCurrentAvailableSeats();
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
    }
    res.json({ "status": "Reservation failed" });
  })
  .on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`)
  .on('failed', (error) => {
    console.error(`Seat reservation job ${job.id} failed: ${error}`)
  });
});

app.get('/process', async (req, res) => {
  queue.process('reserve_seat',async (job, done) => {
  const currentAvailableSeats = getCurrentAvailableSeats();

    if (currentAvailableSeats === 0) {
      reservationEnabled = false;
    } else if (currentAvailableSeat >= 1) {
      try {
        const newAvailableSeats = currentAvailableSeats - 1;
        if (newAvailableSeats === 0) {
          reservationEnabled = false;
        }
        reserveSeat(newAvailableSeats);
        done();
      } catch(error) {
        console.log('Not enough seats available');
        res.json('Not enough seats available');
      }
    } else {
    console.log('Not enough seats available');
    res.json('Not enough seats available');
    }
  });
  console.log({ "status": "Queue processing" });
  res.json({ "status": "Queue processing" });
});
