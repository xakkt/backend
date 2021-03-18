const fs = require('fs')
var newObj =[]
fs.readFile('./mongoCollection/user1.json', 'utf8',  function readFileCallback(err, data){

    obj = JSON.parse(data);
    newObj.push(obj);
    
})


module.exports =
{
    'model': 'User',
    'documents': newObj
}