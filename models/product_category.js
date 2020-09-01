
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
  _store:{
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required:true
  },
  logo: {
      type: String,
      default: null
  },
  _products:[{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {timestamps:true});

productCategorySchema.plugin(uniqueValidator)
module.exports = mongoose.model('ProductCategory', productCategorySchema);

