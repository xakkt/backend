console.log('in db config');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, {useUnifiedTopology: true})
mongoose.Promise = global.Promise;
module.exports = mongoose;