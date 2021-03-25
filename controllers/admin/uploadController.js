const Product = require('../../models/product')
const Queue = require('../../models/queue')

var mongoose = require('mongoose');
let csvToJson = require('csvtojson');
const Queues = require('bee-queue');
const queue = new Queues('upload');


exports.upload = (req, res) => {
  let filepath = req.file.path
  if (!filepath)
    return res.status(400).send('No files were uploaded.');

  var authorFile = filepath;
  csvToJson()
    .fromFile(authorFile)
    .then(async (jsonObj) => {
      console.log('=================>>jsonObj',jsonObj[0])

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
      queue.process(3, async (job) =>   {
        var declare = 'test'
        for (var i = 0; i < job.data.length; i++) {
          // console.log("--nameeee",job.data[i].name)
          const productinfo = {
            name: {
              english: job.data[i].name
            },
            description: job.data[i].description,
            sku: job.data[i].sku,
            _category: job.data[i]._category,
            weight: job.data[i].weight,
            short_description: job.data[i].short_description,
            is_featured: job.data[i].is_featured,
            _unit: job.data[i].unit,
            price: job.data[i].price,
            image: job.data[i].image,
            status: job.data[i].status,
            brand_id: job.data[i].brand
          }
           await Product.findOneAndUpdate({ sku: job.data[i].sku }, productinfo,{upsert: true}).lean()
        }
        return declare
      });
    })
}