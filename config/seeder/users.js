const fs = require('fs')
var newObj =[]
fs.readFile('./mongoCollection/users.json', 'utf8',  function readFileCallback(err, data){

    obj = JSON.parse(data);
    newObj.push(obj);
    
})


module.exports =
{
    'model': 'User',
    'documents': newObj
}