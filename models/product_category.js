
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
const FKHelper = require('../helper/foreign-key-constraint');

const productCategorySchema = Schema({
  name: {
    type: String,
    required: true,
    unique:true
   },
   parent_id: this,
  _store:{
    type: Schema.Types.ObjectId,
    ref: 'Store',
    validate: {
      validator: function(v) {
            return FKHelper(mongoose.model('Store'), v);
        },
        message: `Store doesn't exist`
    } 
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

