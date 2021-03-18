const mongoose = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters')
var uniqueValidator = require('mongoose-unique-validator');
const FKHelper = require('../helper/foreign-key-constraint');

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
 
 
//   _timezone: {
//     type: Schema.Types.ObjectId,
//     ref:'Timezone',
//     validate: {
//             validator: function(v) {
//             return FKHelper(mongoose.model('Timezone'), v);
//          },
//         message: `Timezone doesn't exist`
//     }
// },
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
    required: true,
  },
  last_name: {
    type: String,
    required: false
  },
  email: {
    type: String,
   // unique: true,
    required: true
  },
  profile_pic: {
    type: String,
  },
  password: {
    type: String,
    required: true
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

  // _timezone: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Timezone',
  //   validate: {
  //     validator: function (v) {
  //       return FKHelper(mongoose.model('Timezone'), v);
  //     },
  //     message: `Timezone doesn't exist`
  //   }
  // },
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
// userSchema.pre('save', async function () {
//   this.password = await bcrypt.hash(this.password, saltRounds);
// });

function dateToString(date) {
  if (date) return new Date(date).toISOString();
}

module.exports = mongoose.model('User', userSchema);
