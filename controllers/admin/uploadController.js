const Product = require('../../models/product')
const Queue = require('../../models/queue')
const Brand = require('../../models/brand')

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
        var declare = 'products'
        for (var i = 0; i < job.data.length; i++) {
          let brandId = await Brand.findOne({brand_id : job.data[i].brand_id}).select('_id')
     let products = {
        "name":{"english":job.data[i].name},"sku":job.data[i].sku, "description": job.data[i].description, "short_description":job.data[i].short_description
   , "brand_id": brandId._id ,"meta_description":job.data[i].meta_description,"meta_keywords":job.data[i].meta_keywords,
"meta_title":job.data[i].meta_title,"crv":job.data[i].crv
}
           await Product.create(products)
        }
        return declare
      });
    })
}