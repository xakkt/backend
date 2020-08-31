
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const productCategorySchema = Schema({
  name: {
    type: String,
    required: true,
    unique:true
   },
  parent_id: {
    type: Number,
    default: null
  },
  store_id:{
    type: String
  },
  logo: {
      type: String,
      default: null
  }
}, {timestamps:true});

productCategorySchema.plugin(uniqueValidator)
module.exports = mongoose.model('ProductCategory', productCategorySchema);

