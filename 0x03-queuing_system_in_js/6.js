import kue from 'kue';

const queue = kue.createQueue();
const jobData = {
  phoneNumber: '12345678907',
  message: 'Professor',
};

const job = queue.create('push_notification_code', jobData);

job.on('complete', () => {
  console.log('Notification job completed');
});

job.on('failed', () => {
  console.log('Notification job failed');
});

job.save((error) => {
  if (!error) {
    console.log('Notification job created: ', job.id);
  }
});

// simulate a job process
setTimeout(() => {
  queue.process('push_notification_code', (job, done) => {
    console.log('job process simulated: ', job.id);
    done();
  });
}, 200);

process.on('SIGTERM', () => {
  queue.shutdown(5000, (error) => {
    if (error) {
      console.error('Forceful closure:', error);
    } else {
      console.log('closed gracefully');
    }
    process.exit(0);
  });
});
