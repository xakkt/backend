const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const companySchema = Schema({
  name: {
    type: String,
    unique:true,
    required: true
  },
  description: {
    type: String,
    default: null
  },
  email: {
    type: String,
    unique:true,
    required:true
  },
  contact: {
    type: String,
  },
  address: {
    type: String,
    default: null
  },
}, {timestampst:true});
companySchema.plugin(uniqueValidator)

module.exports = mongoose.model('Company', companySchema);
