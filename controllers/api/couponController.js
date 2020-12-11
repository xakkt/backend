const Cart = require('../../models/cart')
const Product = require('../../models/product');
const Coupon = require('../../models/coupon');

var moment = require('moment');
const { validationResult } = require('express-validator');
const _global = require('../../helper/common');
exports.listCartProduct = async (req, res) => {
     var product_list = []
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

         let cart = await Cart.findOne({_id:req.body._cart}).lean;
         if(req.body.apply == 'percentage')      
    } catch (err) {
        return res.status(400).json({ data: err.message });
    }
}