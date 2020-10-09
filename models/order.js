const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = Schema({
  orderPaymentId: {
      type: String,
      required: true
  },
  orderPaymentMessage: {
    type: Boolean,
    default: true
  },
  orderTotal:{
    type: String,
    required: true
  },
  orderShipping: {
    type: Boolean,
    default: true
  },
  orderItemCount:{
    type: String,
    required: true
  },
  orderProductCount: {
    type: Boolean,
    default: true
  },
  orderCustomer:{
    type: String,
    required: true
  },
  orderEmail: {
    type: Boolean,
    default: true
  },
  orderCompany:{
    type: String,
    required: true
  },
  orderFirstname: {
    type: Boolean,
    default: true
  },
  orderLastname:{
    type: String,
    required: true
  },
  orderAddr1: {
      type:String,
      required:true
  },
  orderAddr2: {
      type:String,
      required:true
  },
  orderCountry: {
      type:String,
      required:true
  },
  orderState: {
      type:String,
      required:true
  },
  orderPostcode: {
      type:String,
      required:true
  },
  orderPhoneNumber: {
      type:String,
      required:true
  },
  orderComment: {
      type:String,
      required:true
  },
  orderStatus: {
      type:String,
      required:true
  },
  orderDate: {
      type:String,
      required:true
  },
  orderProducts: {
      type:String,
      required:true
  },
  orderType: {
      type:String,
      required:true
  },
}, {timestampst:true});

module.exports = mongoose.model('orders', OrderSchema);


          
            