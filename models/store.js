const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const FKHelper = require('../helper/foreign-key-constraint');
const Schema = mongoose.Schema;


const storeSchema = new Schema({ 
    _department:[ {
        type: Schema.Types.ObjectId,
        ref:'Department',
        required:true,
        validate: {
                validator: function(v) {
                return FKHelper(mongoose.model('Department'), v);
          },
        message: `Department doesn't exist`
      }
    
    }],
    _user: {
        type: String,
        validate: {
                validator: function(v) {
                return FKHelper(mongoose.model('User'), v);
             },
            message: `User doesn't exist`
        }
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    _country: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    contact_no: {
        type: String,
        required: true
    },
    time_schedule: {
         Monday:{startTime:String,endTime:String} ,
         Tuesday:{startTime:String,endTime:String} ,
         Wednesday:{startTime:String,endTime:String} ,
         Thursday:{startTime:String,endTime:String} ,
         Friday:{startTime:String,endTime:String} ,
         Saturday:{startTime:String,endTime:String} ,
         Sunday:{startTime:String,endTime:String} 
    }
 });

 storeSchema.index({ location: "2dsphere" })
 storeSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Store', storeSchema);