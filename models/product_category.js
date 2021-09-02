
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
  slug: {
    type: String,
    required:true
},
  _products:[{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {timestamps:true});


productCategorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: '_products',
  count: true // Set `count: true` on the virtual
});


mongoose.set('toJSON', { virtuals: true });

productCategorySchema.plugin(uniqueValidator)
module.exports = mongoose.model('ProductCategory', productCategorySchema);

