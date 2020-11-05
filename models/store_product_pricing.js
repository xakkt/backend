const mongoose = require('mongoose');
const FKHelper = require('../helper/foreign-key-constraint');
const Schema = mongoose.Schema;


const storeProductPricingSchema = new Schema({ 
    name:{type: String, required: true},
    _product: {
        type: Schema.Types.ObjectId,
        ref:'Product',
        required:true,
        validate: {
                validator: function(v) {
                return FKHelper(mongoose.model('Product'), v);
          },
        message: `Product doesn't exist`
      }
    
    },
    _user: {
        type: Schema.Types.ObjectId,
        ref:'User',
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
        validate: {
                validator: function(v) {
                return FKHelper(mongoose.model('Store'), v);
             },
            message: `Store doesn't exist`
        }
    },
    _deal: {
        type: Schema.Types.ObjectId,
        ref:'Deal',
        validate: {
                validator: function(v) {
                return FKHelper(mongoose.model('Deal'), v);
             },
            message: `Deal doesn't exist`
        }
    },
    deal_value: {
        type: String,
        enum: ['percentange','fixed'],
        required: true
    },
    regular_price: {
        type: String,
        required: true
    },
    deal_price: {
        type: String,
        required: true
    },
    _country: {
        type: Schema.Types.ObjectId,
        ref:'Country',
        validate: {
                validator: function(v) {
                return FKHelper(mongoose.model('Country'), v);
             },
            message: `Country doesn't exist`
        }
    }
 },{timestamps:true});


module.exports = mongoose.model('StoreProductPricing', storeProductPricingSchema);