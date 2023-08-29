import kue from 'kue';
import createPushNotificationsJobs from './8-job':
import { expect } from 'chai';

describe('testing the createPushNotificationJobs function', () => {
  let queue, queTest;

  const testQueData = {
    redis: {
      host: '127.0.0.1',
      port: '6379',
      db: 1,
    },
  };

  beforeEach('setup', () => {
    queue = createQueue(testQueData);
    queTest = queue.testMode;
    queue.enter();
  });

  afterEach('tearsown: clear enviroment after each test', () => {
    queue.clear();
    queue.exit();
  });

  it('Testing Error wen input data is not a list', (done) => {
    const jobs = {
      phoneNumber: '01055683941',
      message: 'this is a wrong number',
    }

    expect(() => createPushNotificationsJobs(jobs, queue)).to.throw(Error, 'Jobs is not an array');
    done();
  });

  it('checks if the function indeed create push notification', (done) => {
    const jobs = [
      {
        phoneNumber: '0101555121',
        message: 'valid user',
      },
      {
        phoneNumber: '14567834518',
        message: 'This is also a valid user',
      }
    ];
    createPushNotificationsJobs(jobs, queue);
    expect(queTest.jobs.length).to.equal(2);
    done();
  });

  it('Test for a completed job', (done) => {
    const jobs = [
      {
        phoneNumber: '07133447722',
        message: 'completely validated user',
      },
    ];
    createPushNotificationsJobs(jobs, queue);
    // simulate a completed job case with emit
    queTest.jobs[0].emit('complete');
    expect(console.log.calledWith(`Notification job ${jobs[0].id} completed`)).to.be.true;
    done();
  });

  it('Test if our code handles appropraitely the failed occasion', (done) => {
    const jobs = {
      phoneNumber: '05054748698',
      message: 'Got an error sending to u',
    }
    createPushNotificationsJobs(jobs, queue);

    queTest.jobs[0].emit('failed', new Error('failed job'));
    expect(console.log.callWith(`Notification job ${jobs[0].id} failed: ${error}`)).to.be.true;
    done();
  });

});
