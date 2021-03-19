const Queues = require('bee-queue');
const queue = new Queues('upload');
let jsonObj = './database_dump/user6.json'
const job = queue.createJob(jsonObj);
      job.retries(3).save();
      job.on('succeeded', (result) => {
        console.log(`Received result for job  ${result}`);
      });
      queue.on('job failed', (jobId, err) => {
        console.log('errrrrrr', err.message + 'iddd', jobId);
      });
      job.on('failed', (err) => {
        console.log(`Job ${job.id} failed with error ${err.message}`);
      });
      job.on('retrying', (err) => {
        console.log(
          `Job ${job.id} failed with error ${err.message} but is being retried!`
        );
      });