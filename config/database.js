//Set up mongoose connection
console.log('in db config');
const mongoose = require('mongoose');
var uri = `mongodb://localhost:27017/xakkt`;
mongoose.connect(uri, {useCreateIndex: true,useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
mongoose.Promise = global.Promise;

module.exports = mongoose;
