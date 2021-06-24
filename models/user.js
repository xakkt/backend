const mongoose = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters')
var uniqueValidator = require('mongoose-unique-validator');
const FKHelper = require('../helper/foreign-key-constraint');
const md5 = require("md5")

const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const saltRounds = 10;
const childSchema = new Schema({

 
  address: {
    type: String,
  },
  address_type:{
    type: String,
    enum : ['Home','Office','Other'],
        default: 'Home'
  },
  pincode: {
    type: Number
  },
  phoneno: {
    type: Number
  },
  countrycode :{
    type:String
  },
  city: {
    type: String
  },
  region: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
 
 location: {
    type: {
        type: String,
        enum: ['Point'],
        required: false
    },
    coordinates: {
        type: [Number],
        required: false
    }
},

});

const userSchema = Schema({
  first_name: {
    type: String,
    required: false,
  },
  last_name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    unique: true,
    required: false
  },
  profile_pic: {
    type: String,
  },
  password: {
    type: String,
    required: false
  },
  contact_no: {
    type: String,
    required: false
  },
  status: {
    type: Boolean,
    default: false
  },
  last_login: {
    type: Date,
    get: dateToString
  },
  ncrStatus: {
    type: String,
    default: false
  },
  superbuckId: {
    type: Number,
    default: 0
  },
  dob: {
    type: Date,
    required: false
  },
  address: [childSchema],
  _timezone:{
    type:String
},
_company: 
  {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    validate: {
      validator: function (v) {
        return FKHelper(mongoose.model('Company'), v);
      },
      message: `Company doesn't exist`
    }
  },

 role_id: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      validate: {
        validator: function (v) {
          return FKHelper(mongoose.model('Role'), v);
        },
        message: `Role doesn't exist`
      }
    },

  ],
  _store: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      validate: {
        validator: function (v) {
          return FKHelper(mongoose.model('Store'), v);
        },
        message: `Store doesn't exist`
      }
    },

  ],
  last_login: {
    type: Date,
    default: Date.now
  },
  coupons: [
    { type: Schema.Types.ObjectId, ref: 'Coupon' }
  ],
  _supervisor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

userSchema.plugin(mongooseLeanGetters)
userSchema.plugin(uniqueValidator)

userSchema.pre('save', async function () {
  this.password = await md5(this.password);
});

function dateToString(date) {
  if (date) return new Date(date).toISOString();
}

module.exports = mongoose.model('User', userSchema);
