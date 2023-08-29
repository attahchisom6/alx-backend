import kue from 'kue';

const queue = kue.createQueue();
const blacklistedNumbers = ['4153518780', '4153518781'];

function sendNotification(phoneNumbet, message, job, done) {
  job.progress(0, 100);

  if (blacklistedNumbers.Includes(phoneNumber)) {
    job.on('failed', (error) => {
      errorObj = {message: `Phone number ${phoneNumber} is blacklisted`};
      throw new Error(errorObj.message);
    })
  } else {
    job.progress(50, 100);
    console.log(`Log to the console Sending notification to ${phoneNumber}, with message: ${message}`);
  }
}

queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
  done();
});
