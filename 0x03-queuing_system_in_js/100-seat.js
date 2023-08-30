import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';
import express from 'express';

// creating redis server
const client = redis.createClient();
let available_seats;
boolean reservationEnabled = true;

client.on('connect', () => {
  console.log('Running Redis server Welcome!');
  available_seats = 50;
  if (available_seats === 0) {
    reservationEnabled = false;
  }
  reservationEnabled = true;
})
.on('error', (error) => {
  console.error(error);
});

function reserveSeat(number) {
  client.set(available_seats, number, (err, reply) => {
    if (err) {
      console.error(err);
    }
    redis.print(reply);
  });
}

const asyncGet = promisify(client.get).bind(client);

async function getCurrentAvailableSeats(available_seats) {
  const result = await asyncGet(available_seats);
  if (!result) {
    console.log("Can't read from the database");
  };
  return result;
}

// queue creation
const queue = kue.createQueue();

// express Server creation
app = express()
app.use(express.json());

app.get('/available_seats', async (req, res) => {
  const numCurrentSeat = await getCurrentAvailableSeats(available_seats);
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
  await res.json({ "status": "Queue processing" });
  queue.process('reserve_seat', (job, done) => {
    const num = await getCurrentAvailableSeats(available_seats - 1);
    reserveSeats(num);

    if (num === 0) {
      reservationEnabled = false;
    } else if (num > 0) {
      cons
    } else {
      console.log('Not enough seats available');
      queue.exit();
    }
  });
}
