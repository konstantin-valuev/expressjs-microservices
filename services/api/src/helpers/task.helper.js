import kue from 'kue';
import config from '../config';

const queue = kue.createQueue({
  prefix: 'q',
  redis: {
    port: 6379,
    host: 'redis', // name of redis docker container
  }
});

queue.process(config.queue.completedTasks, (job, done) => {
  console.log(`Completed job task is ${job.id}, job task is ${job.data.task.id}`);
  completeTask(job.data.task, done);
});

function completeTask(task, callback) {
  kue.Job.get(task.id, (err, job) => {
    if (err) throw err;
    const report = job.data.report;
    console.log(`Report ${report.format} from ${report.from} to ${report.to} generation status is ${task.status}`);
    job.remove((err) => {
      if (err) throw err;
      // console.log(`Removed job task ${job.id}`);
      callback();
    });
  });
}

function create(params) {
  return new Promise((resolve, reject) => {
    const job = queue
      .create(config.queue.tasks, {
        service: config.services.api,
        report: params,
      })
      .save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(job);
        }
      });
  });
}

export default { create };
