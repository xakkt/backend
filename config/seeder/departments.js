const fs = require('fs')
var newObj =[]
fs.readFile('./mongoCollection/department.json', 'utf8',  function readFileCallback(err, data){
    obj = JSON.parse(data);
    newObj.push(obj);

})

module.exports =
{
    'model': 'Department',
    'documents': newObj
}