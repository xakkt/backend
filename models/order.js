const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FKHelper = require('../helper/foreign-key-constraint');

const OrderSchema = Schema({
  shipping: {
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
    address: String,
    city: String,
    region: String,
    state: String,
    country: String,
    delivery_notes: String,

    tracking: {
      company: String,
      tracking_number: String,
      status: String,
      estimated_delivery: Date
    },
  },

  payment: {
    method: String,
    transaction_id: String
  },
  products: [
    { 
      quantity: Number, 
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
      title: String, 
      unit_cost:Number, 
      currency:String
    }
  ]
    
  
}, {timestampst:true});

module.exports = mongoose.model('orders', OrderSchema);


          
            