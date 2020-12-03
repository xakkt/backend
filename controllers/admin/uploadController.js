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

            const job = queue.createJob(jsonObj);
            job.save();
            job.on('succeeded', (result) => {
              console.log(`Received result for job  ${result}`);
            });
            queue.on('job failed', (jobId, err) => {
            console.log('errrrrrr',err.message + 'iddd',jobId);
              // queue.getJob(jobId).then((job) => console.log("---jobbb",job.data))
              // console.log('errrrrrr',err.message + 'iddd',jobId);
            });

            queue.process(3,async (job) => {
              var declare = 'test'
              console.log("--logs",job)
                 for(var i = 0;i<job.data.length;i++)
                    {
                      const productinfo = {                                                 
                        name: {
                            english: job.data[i].name
                        },
                        description: job.data[i].description,
                        sku: job.data[i].sku,
                        _category:job.data[i]._category,
                        weight: job.data[i].weight,
                        short_description: job.data[i].short_description,
                        is_featured: job.data[i].is_featured,
                        _unit: job.data[i].unit,
                        price: job.data[i].price,
                        image: job.data[i].image,
                        status: job.data[i].status,
                        brand_id: job.data[i].brand
                    }
                    console.log("---value",productinfo)
                    let product = await Product.findOneAndUpdate({sku:job.data[i].sku},productinfo,{returnOriginal:false})
                      if(!product)
                      {
                       
                        await Product.create(productinfo)
                      }
                   }
               return declare
            });
        })
}