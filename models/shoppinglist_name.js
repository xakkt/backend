const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shoppingSchema = new Schema({
   name: { type: String, required: true },
   _user: { type: Schema.Types.ObjectId, ref:'User', required: true,  },
  
 
}, {timestamps:true});

module.exports = mongoose.model('Shoppinglist', shoppingSchema);
