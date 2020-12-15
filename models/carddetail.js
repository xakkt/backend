const mongoose = require('mongoose');
const FKHelper = require('../helper/foreign-key-constraint');

const Schema = mongoose.Schema;

const carddetailSchema = new Schema({
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
  token:{
   type:String,
   required:true
  },
 last_digit:{
     type:Number,
 },
 _customer:{
   type:String,
  require:true
}
  
}, {timestamps:true});


module.exports = mongoose.model('carddetail', carddetailSchema);
