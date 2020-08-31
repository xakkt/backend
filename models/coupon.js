const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const couponSchema = Schema({
  code: {
    type: String,
    required: true,
  },
  user_id: {
      type: Schema.Types.ObjectId, ref: 'User'
  },
  description: {
    type: String,
    required: true
  },
  disclaimer: {
    type: String,
    required: true
  },
  valid_from:{
    type: Date,
    required: true
  },
  valid_till:{
    type: Date,
    required: true
  }
}, {timestampst:true});

module.exports = mongoose.model('Coupon', couponSchema);
