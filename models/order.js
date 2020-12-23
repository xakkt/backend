const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FKHelper = require('../helper/foreign-key-constraint');
var uniqueValidator = require('mongoose-unique-validator');

const OrderSchema = Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref:'User',
    required: true,
    validate: {
      validator: function(v) {
              return FKHelper(mongoose.model('User'), v);
          },
        message: `User doesn't exist`
      }
    
  },
  _store: {
    type: Schema.Types.ObjectId,
    ref:'Store',
    required: true,
    validate: {
      validator: function(v) {
              return FKHelper(mongoose.model('Store'), v);
          },
        message: `Store doesn't exist`
      }
    
  },
  shipping: {
    
    address: { type:String, required: true },
    city:  { type:String, required: true },
    region:  { type:String, required: true },
    state:  { type:String, required: true },
    country:  { type:String, required: true },
    delivery_notes:  { type:String, required: true },
    order_id: { type:String,required: true, unique: true  },
    tracking: {
      company:  { type:String },
      tracking_number:  { type:String },
      status:  { 
        type: String, 
        enum: ['pending','recieved','dispatched','cancelled','delivered','refunded','disputed' ],
        required: true
      },
      estimated_delivery:  { type:String},
    },
  },
  payment: {
    method:{
      type:String,
      enum: ['NetBanking','Stripe','Cash on Delivery'],
      required: true
    },
    transaction_id:  { type:String, required: true },
    payment_date:{type:String }
  },
  feedback: {
     rating: { type: Number, default: 0 },
     comment: { type: String, default:null }
  },
  products: [
    { 
      quantity:  { type:String, required: true }, 
      _product: {
        type: Schema.Types.ObjectId,
        ref:'Product',
        required: true,
        validate: {
          validator: function(v) {
                  return FKHelper(mongoose.model('Product'), v);
              },
            message: `Product doesn't exist`
          }
        
      },
      title:  { type:String, required: true }, 
      unit_cost: { type:String, required: true }, 
      currency: { type:String, required: true }
    }
  ]
    
  
}, {timestamps:true});

OrderSchema.plugin(uniqueValidator)
module.exports = mongoose.model('orders', OrderSchema);


          
            