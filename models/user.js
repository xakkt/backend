const mongoose = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters')
var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true
  },
  email:{
    type: String,
    unique: true,
    required: true
  },
  profile_pic:{
    type: String,
  },
  password:{
    type: String,
    required: true
  },
  contact_no:{
      type: String,
      required: true
  },
  status:{
      type: Boolean,
      default: false
  },
  last_login: {
    type: Date,
    get: dateToString
  },
  ncrStatus: {
      type: Boolean,
      default: false
  },
  superbuckId: {
      type: Number,
      default: 0
  },
  dob:{
      type: Date,
      required:true
  },
  _timezone: {
    type: Schema.Types.ObjectId,
    ref:'Timezone',
    validate: {
            validator: function(v) {
            return FKHelper(mongoose.model('Timezone'), v);
         },
        message: `Timezone doesn't exist`
    }
},
  coupons: [
    { type: Schema.Types.ObjectId, ref: 'Coupon' }
  ] 
}, {timestamps:true});

userSchema.plugin(mongooseLeanGetters)
userSchema.plugin(uniqueValidator)

userSchema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, saltRounds);
});

function dateToString(date){
  if(date) return new Date(date).toISOString();
}

module.exports = mongoose.model('User', userSchema);
