const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannerSchema = Schema({
  name: {
    type: String,
    required: true
  },
  image: {
     type: String,
     required: true
  },
  description: {
    type: String,
    default: null
  },
  url: {
      type: String,
      default: null
  },
  type: {
    type: String,
    enum: ['app', 'web'],
  },
  language:{
    type: String
  }
}, {timestampst:true});


module.exports = mongoose.model('Banner', bannerSchema);
