const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const FKHelper = require('../helper/foreign-key-constraint');

const bannerSchema = Schema({
  image: {
     type: String,
     required:true,
  },
  _store: {
    type: Schema.Types.ObjectId,
    ref:'Store',
    required:true,
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
    required:true,
    validate: {
            validator: function(v) {
            return FKHelper(mongoose.model('Deal'), v);
         },
        message: `Deal doesn't exist`
    }
},
type: {
  type: String,
  enum: ['app', 'web'],
  default : 'app'
  },
 
}, {timestampst:true});


module.exports = mongoose.model('Banner', bannerSchema);
