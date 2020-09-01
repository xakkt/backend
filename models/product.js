const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  brand_id: {
    type: Schema.Types.ObjectId,
    ref:'Brand'
    //required: true,
  },
  _category: {
    type: Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true
  },
  name:{
      type: Map,
      of: String,
      require:true
  },
  sku:{
    type: String,
    required: true,
    unique:true
  },
  description:{
      type: String,
      required: true
  },
  short_description:{
      type:String,
      //required: true
  },
  weight: {
    type: Number,
    //required: true
  },
  valid_from: {
    type: Date,
    required: true,
    get: dateToString
  },
  valid_till: {
    type: Date,
    required: true,
    get: dateToString
  },
  is_bestseller: {
    type: Boolean,
    default: false
  },
  is_featured: {
    type: Boolean,
    default:false
  },
  meta_title: {
    type: String,
    default:null
  },
  meta_keywords: {
    type: String,
    default: null
  },
  meta_description: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: true
  },
  unit_id: {
    type: Number,
    //required: true
  },
  crv: {
    type: String,
    default: null
  },
   status: {
    type: Boolean,
    default: true
  },
  deleted_on:{
    type: Date,
  },
}, {timestamps:true});

productSchema.plugin(uniqueValidator)

function dateToString(date){
  if(date) return new Date(date).toISOString();
}

module.exports = mongoose.model('Product', productSchema);
