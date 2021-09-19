const Product = require('../../models/product');
const { validationResult } = require('express-validator');
const _global = require('../../helper/common');
const Cart = require('../../models/cart')
const User = require('../../models/user')
var ObjectId = require('mongoose').Types.ObjectId;
const Store = require('../../models/store');

exports.cartProducts = async (req, res) => {
    try {
		
    	 let condition = {_store:req.body.storeid}
		 condition = (req.session.userid)?{ ...condition, _user: req.session.userid} : { ...condition, sessionId: req.sessionID} ;

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
			return res.json({ status: 1, message: "Product removed from cart" })
	
		} else {
			
			let addProduct = await Cart.findOneAndUpdate(condition, { $push: { cart: data } },{ upsert: true }).lean();
			
			return res.json({status:1,message:'Product added to the cart'})
			
			
		}
		
	} catch (err) {
		console.log("--errr", err)
		return res.status(400).json({ data: "Something Went Wrong" });
	}

};

exports.checkoutPage = async (req, res)=>{
	try{
		let storedata = await Store.findOne({ slug: req.params.store }).select('-time_schedule -_department -holidays -__v -createdAt -updatedAt -_user').populate({
			path: '_currency',
			select: 'name',
		  }).lean()


		var user = await User.findOne({_id:req.session.userid }).lean()
			//if(!addresses.address){ return res.json({ status: 0, message: "No default address added for you" }) }
			//return res.json({data:addresses}) 


		let condition = {_store:storedata._id}
		 condition = (req.session.userid)?{ ...condition, _user: req.session.userid} : { ...condition, sessionId: req.sessionID} ;

		 var cartProducts = await Cart.findOne(condition).populate({
			 path: 'cart',
			 populate: {
				 path: '_product',
				 model: Product,
				 select:'name image unit'
			 }
			}).lean();


		//if(cartProducts?.cart.length)return res.json({status:1,data:cartProducts.cart, store: storedata})
	
		return res.render('frontend/checkout',{ status:1, data:cartProducts, addresses:user.address, store:storedata })
	}catch (err) {
		console.log("--err", err)
		return res.status(400).json({ data: "Something Went Wrong" });
    }
	
}


