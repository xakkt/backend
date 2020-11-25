const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dealSchema = Schema({
  name: {
    type: String,
    required: true
  },
  store_id:{
      type: Schema.Types.ObjectId,
      ref:'Store'
  },
  description: {
    type: String,
    default: null
  },
  
}, {timestampst:true});

module.exports = mongoose.model('Deal', dealSchema);
