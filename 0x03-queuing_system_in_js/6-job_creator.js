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
