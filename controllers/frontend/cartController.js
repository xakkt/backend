const Product = require('../../models/product');
const { validationResult } = require('express-validator');
const _global = require('../../helper/common');
const Cart = require('../../models/cart')
var ObjectId = require('mongoose').Types.ObjectId;

exports.cartProducts = async (req, res) => {
    try {
		
    	 let condition = {_store:req.body.storeid}
		 condition = (req.session.userid)?{ ...condition, _user: req.session.userid} : { ...condition, sessionId: req.sessionID} ;
console.log('condition======>>',condition)
		 var cartProducts = await Cart.findOne(condition).populate({
			 path: 'cart',
			 populate: {
				 path: '_product',
				 model: Product,
				 select:'name image unit'
			 }
			}).lean();

		if(cartProducts?.cart.length)return res.json({status:1,data:cartProducts.cart})
		return res.json({status:0,data:[]})
	}
    catch (err) {
		console.log("--err", err)
		return res.status(400).json({ data: "Something Went Wrong" });
    }
}


exports.addPoductToCart = async (req, res) => {
    try {

        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
	
		var productInfo = await Product.findById(req.body._product);
		let productprice = await _global.productprice(req.body._store, req.body._product)
		if (!productprice) return res.json({ status: 0, message: "Product Price of this id not set yet" })
		if (!productInfo) return res.json({ status: 0, message: "Product with this id not exists" })
		
		
		var data = {
			_product: req.body._product,
			quantity: req.body.quantity,
			total_price: productprice.effective_price * req.body.quantity
		}

		let  condition = { _store: req.body._store }
		condition = (req.session.userid)?{ ...condition, _user: req.session.userid} : { ...condition, sessionId: req.sessionID} ;

		let getProdCond = {...condition, cart: { $elemMatch: { _product: req.body._product } }};

       	var product = await Cart.findOne(getProdCond);
		
		if (product?.cart) {
			
			await Cart.findOneAndUpdate(condition, { $pull: { cart: { _product:req.body._product } } });
			return res.json({ status: 0, message: "Product removed from cart" })
	
		} else {
			
			let addProduct = await Cart.findOneAndUpdate(condition, { $push: { cart: data } },{ upsert: true }).lean();
			
			return res.json({status:1,message:'Product added to the cart'})
			
			
		}
		
	} catch (err) {
		console.log("--errr", err)
		return res.status(400).json({ data: "Something Went Wrong" });
	}

};
