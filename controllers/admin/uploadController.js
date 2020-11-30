const Product = require('../../models/product')
var mongoose = require('mongoose');
let csvToJson = require('csvtojson');

exports.upload = (req, res) => {
    let filepath = req.file.path
    if (!filepath)
        return res.status(400).send('No files were uploaded.');

    var authorFile = filepath;
    csvToJson()
        .fromFile(authorFile)
        .then(async (jsonObj) => {
            console.log(jsonObj);
            for(var i = 0;i<jsonObj.length;i++)
            {
            let product = await Product.findOneAndUpdate({sku:jsonObj[i].sku},jsonObj[i],{returnOriginal:false})
              if(!product)
              {
                await Product.create(jsonObj)
              }
            }
            return res.json({status:true,message:"Data inserted successfully"})
            // Product.insertMany(jsonObj, (err, res) => {
            //     if (err) throw err
            //     console.log("Number of documents inserted: ",res);
            // })
        })
}