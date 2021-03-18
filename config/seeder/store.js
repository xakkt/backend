const fs = require('fs')
var newObj =[]
fs.readFile('./mongoCollection/store.json', 'utf8',  function readFileCallback(err, data){
console.log("cmncbv")
    obj = JSON.parse(data);
    newObj.push(obj);
    
})

module.exports =
{
    'model': 'Store',
    'documents': newObj
}