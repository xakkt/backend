const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  logo: {
      type: String,
      default: null
  },
  status: {
      type: Boolean,
      default: true
  }

}, {timestampst:true});

module.exports = mongoose.model('Brand', brandSchema);
