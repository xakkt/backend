const fs = require('fs')
const StreamArray = require('stream-json/streamers/StreamArray');
const jsonStream = StreamArray.withParser();

jsonStream.on('data', ({key, value}) => {
    try{
    let products = {
        "name":{"english":value.name},"sku":value.sku, "description": value.description, "short_description":value.short_description
    }
    module.exports.documents.push(products) 
}catch(err){
    console.log(err)
}
   
})
jsonStream.on('end', () => {
    console.log('All done');
});

fs.createReadStream('./database_dump/products.json').pipe(jsonStream.input)

module.exports =
{
    'model': 'Product',
    'documents':[]
}

