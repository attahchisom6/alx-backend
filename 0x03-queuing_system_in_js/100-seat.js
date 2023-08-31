import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';
import express from 'express';

// creating redis server
const client = redis.createClient();

let reservationEnabled = true;

function initializeData(availableSeats) {
  client.set('availableSeats', availableSeats, (error, reply) => {
    if (error) {
      console.error(error);
    }
    redis.print(reply);
  });
}

client.on('connect', () => {
  console.log('Running Redis server Welcome!');
  initializeData(50);
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
      result = "Sorry, No available seat in store";
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
  queue.process('reserve_seat', async (job, done) => {
    try {
      const currentAvailableSeats = await getCurrentAvailableSeats();

      if (currentAvailableSeats === 'Sorry, No available seat in store') {                  console.log('Not enough seats available');
        res.json('Not enough seats available');
        return;
      }

      if (parseInt(currentAvailableSeats) === 0) {
        reservationEnabled = false;
      } else if (parseInt(currentAvailableSeats) >= 1) {
        const newAvailableSeats = currentAvailableSeats - 1;
        if (newAvailableSeats === 0) {
          reservationEnabled = false;
        }
        reserveSeat(newAvailableSeats);
        done();
      } else {
        console.log('Not enough seats available');
        res.json('Not enough seats available');
      }
    } catch(error) {
      console.log('Not enough seats available');
      done('Not enough seats available');
    }
  });
  console.log({ "status": "Queue processing" });
  res.json({ "status": "Queue processing" });
});

app.listen(1245, '0.0.0.0', () => {
  console.log('Connected to redis sever, port 1245 listening on all host');
});

module.exports = app;
