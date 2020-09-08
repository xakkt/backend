const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref:'User',
    required: true,
  },
  _product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  wish_price:{
      type: Number,
      require:true
  },
  max_price:{
    type: Number,
    required: true
  },
  valid_till: {
    type: Date,
    
  },
}, {timestamps:true});



function dateToString(date){
  if(date) return new Date(date).toISOString();
}

module.exports = mongoose.model('Wishlist', wishlistSchema);
