import kue from 'kue';
import createPushNotificationJobs from './8-job':
import { expect } from 'chai';

describe('testing the createPushNotificationJobs function', () => {
  const testQueData = {
    message: {
      host: '127.0.0.1',
      port: '6379',
    }
    db: 1,
  };

  beforeEach('setup', () => {
    const queue = createQueue('push_notification_xode_3', testQueData);
    queue.testMode.enter();
  });

  afterEach('tearsown: clear enviroment after each test', () => {
    queue.testMode.clear();
    queue.testMode.quit();
  });

  it('Testing Error wen input data is not a list', (done) => {
    const jobs = {
      phoneNumber: '01055683941',
      message: 'this is a wrong number',
    }

    expect(createPushNotificationsJobs(jobs, queue)).to.throw(new Error('Jobs is not an array'));
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
    expect(createPushNotificationsjobs(jobs, queue)).to.equal('Notification job created: 2');
  });
});
