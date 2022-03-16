const Cart = require("../../models/cart");
const Product = require("../../models/product");
const Coupon = require("../../models/coupon");

var moment = require("moment");
const { validationResult } = require("express-validator");
const _global = require("../../helper/common");
const { disconnect } = require("mongoose");
exports.list = async (req, res) => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let coupon = await Coupon.find({ _store: req.params.store }).lean();
    console.log(coupon);
    if (!coupon) return res.json({ message: "Data not found", data: [] });
    return res.json({ messag: "Listing of coupons", data: coupon });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};
exports.applycoupon = async (req, res) => {
  try {
    let cart = await Cart.findOne({ _id: req.body._cart }).lean();
    let coupon = await Coupon.findOne({
      coupon_code: req.body.coupan_name,
    }).lean();
    var price = 0;
    if (coupon.min_amount > cart.cart[0].total_price) {
      return res.json({
        message:
          "Cannot apply this coupon min amount should be" + coupon.min_amount,
      });
    }

    if (coupon.apply == "percent") {
      price = eval(
        cart.cart[0].total_price -
          (cart.cart[0].total_price * coupon.amount) / 100
      );
    } else if (coupon.apply == "fixed") {
      price = cart.cart[0].total_price - coupon.amount;
    }
    delete cart.cart[0].total_price;
    cart.cart[0].total_price = price;

    return res.json({ message: "Listing of coupouns", data: cart });
  } catch (err) {
    console.log("--logs", err);
    return res.status(400).json({ data: err.message });
  }
};
