function createPushNotificationsJobs (jobs, queue) {
  if (!isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  jobs.forEach(
