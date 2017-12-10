import kue from 'kue';
import config from '../config';

const queue = kue.createQueue({
  prefix: 'q',
  redis: {
    port: 6379,
    host: 'redis', // name of redis docker container
  }
});

function listen() {
  queue.process(config.queue.tasks, (job, done) => {
    onTaskProcess(job, done);
  });
}

function onTaskProcess(job, done) {
  switch (job.data.service) {
    case config.services.api:
      generateReport(job.id, job.data.report, done);
      break;
    default:
      done();
  }
}

function generateReport(taskId, data, callback) {
  // Generate only PDF for testing
  const status = data.format === 'pdf' ? 'completed' : 'failed';
  console.log(`Generate ${data.format} report from ${data.from} to ${data.to}`);
  const job = queue
    .create(config.queue.completedTasks, {
      service: config.services.reportsGenerator,
      task: {
        id: taskId,
        status,
      },
    })
    .removeOnComplete(true)
    .save((err) => {
      if (err) throw err;
      console.log(`Job ${job.id} saved to the ${job.type} queue.`);
      callback();
    });
}

export default { listen };
