const mongoose = require('mongoose');
const mongooseLeanGetters = require('mongoose-lean-getters')

const Schema = mongoose.Schema;

const timezoneSchema = Schema({

  value: { type: String },
  abbr:  { type: Schema.Types.ObjectId, ref: 'Coupon' },
  offset:{ type:Number },
  text: { type: String }  
}, {timestamps:true});

timezoneSchema.plugin(mongooseLeanGetters)

module.exports = mongoose.model('Timezone', timezoneSchema);
