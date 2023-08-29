import kue from 'kue';
import createPushNotificationsJobs from './8-job';
import { expect } from 'chai';
import sinon from 'sinon';

describe('testing the createPushNotificationJobs function', () => {
  let queue, queTest, consoleSpy;

  const testQueData = {
    redis: {
      host: '127.0.0.1',
      port: '6379',
      db: 1,
    },
  };

  beforeEach('setup', () => {
    consoleSpy = sinon.spy(console, 'log');
    queue = kue.createQueue(testQueData);
    queTest = queue.testMode;
    queTest.enter();
  });

  afterEach('tearsown: clear enviroment after each test', () => {
    consoleSpy.restore();

    queTest.clear();
    queTest.exit();
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
    expect(consoleSpy.calledWithMatch(`Notification job ${queTest.jobs[0].id} completed`)).to.be.true;
    done();
  });

  it('Test if our code handles appropraitely the failed occasion', (done) => {
    const jobs = [
      {
        phoneNumber: '05054748698',
        message: 'Apologies, an error occured while sending a response',
      },
    ]
    createPushNotificationsJobs(jobs, queue);

    const error = 'Failed job';
    queTest.jobs[0].emit('failed', new Error(error));
    expect(consoleSpy.calledWithMatch(`Notification job ${queTest.jobs[0].id} failed: ${error}`)).to.be.true;
    done();
  });

  it('Test for job progress', (done) => {
    const jobs = [
      {
        phoneNumber: '09054328778',
        message: 'loggin user in progress',
      },
    ];
    createPushNotificationsJobs(jobs, queue);

    queTest.jobs[0].emit('progress', 50);
    expect(consoleSpy.calledWithMatch(`Notification job ${queTest.jobs[0].id} 50% complete`)).to.be.true;
    done();
  });

});
