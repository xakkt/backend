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
   console.log("=====rrrr",cartProducts.cart[0].quantity)
   console.log("=========datataa",storedata)

		//if(cartProducts?.cart.length)return res.json({status:1,data:cartProducts.cart, store: storedata})
			return res.render('frontend/checkout',{ status:1, data:cartProducts, addresses:user?.address??null, store:storedata })
	}catch (err) {
		console.log("--err", err)
		return res.status(400).json({ data: "Something Went Wrong" });
    }
	
}

exports.cartSize = async (req, res) => {
 
	const errors = await validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ status:0, errors: errors.array() });
	}
 
	try {
		const cartInfo = {
			_user: req.decoded.id,
			_store: req.params.storeid,
		}
 
		var data = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store }).lean();
 
		if (!data) return res.json({ status: 0, message: "cart is empty", data: "" });
		let total_quantity;
		 total_quantity = data.cart.map(product => product.quantity).reduce(function (acc, cur) {
			 return acc + cur;
		 })
 
		 return res.json({ status: 1, message: "total products in the cart", data: { total_products: total_quantity}});
	} catch (err) {
		return res.status(400).json({ status:0, data: err.message });
	}
 },
  
exports.removeProductFromCart = async (req, res) => {
 
	 const errors = await validationResult(req);
	 if (!errors.isEmpty()) {
		 return res.status(400).json({ errors: errors.array() });
	 }
	 try {
		 const cartInfo = {
			 _store: req.body._store,
			 _product: req.body._product,
			 _user: req.session.userid,
 		 }
 
		 var product = await Cart.findOneAndUpdate({ _user: cartInfo._user, _store: cartInfo._store }, { $pull: { cart: { '_product': cartInfo._product } } }, { new: true });

		 
		 if (product?.cart) {
			 product.cart.pull({ _product: cartInfo._product})
			 await product.save()
			 // product.cart.id().remove();
			 console.log(product)
		 }
		 var data = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store }).populate('cart._product', 'name sku price image').lean();
		 if (!data) return res.json({ success: 0, message: "cart is empty", data: "" });
 
		 let total_quantity, total_price, coupon, discounted_price;
		
		 total_quantity = data.cart.map(product => product.quantity).reduce(function (acc, cur) {
			 return acc + cur;
		 })
 
		 total_price = data.cart.map(product => product.total_price).reduce(function (acc, cur) {
			 return acc + cur;
		 })
 
		 products = data.cart.map((list) => {
			 if (!list._product) return
			 let image_path = (list._product.image) ? list._product.image : 'not-available-image.jpg';
			 let image = `${process.env.BASE_URL}/images/products/${image_path}`;
			 let total_price = list.total_price;
			 let quantity = list.quantity;
			 delete (list.total_price)
			 delete (list.quantity)
			 return { ...list, _product: { ...list._product, in_cart: quantity, total_price: total_price.toFixed(2), image: image } }
		 })
	
		 data.cart = products;
		 discounted_price = 20;
		 coupon = {
			 code: 'AZXPN102',
			 discount: '20%'
		 }
		 return res.json({ status: 1, message: "Product removed", data: data, subtotal: { quantity: total_quantity, price: total_price.toFixed(2), shipping_cost: "100.00", coupon: coupon, sub_total: total_price.toFixed(2) } });
	 } catch (err) {
		 console.log(err)
		 return res.status(400).json({ data: err.message });
	 }
 
 }
 
 exports.updateProductQuantity = async (req, res) => {
 
	 
	 const errors = await validationResult(req);
	 if (!errors.isEmpty()) {
		 return res.status(400).json({ errors: errors.array() });
	 }
	 try {
		 const cartInfo = {
			 quantity: req.body.quantity,
			 _store: req.body._store,
			 _product: req.body._product,
			 _user: req.session.userid,
		 }
		 var productInfo = await Product.findById(req.body._product);
		 let productprice = await _global.productprice(req.body._store, req.body._product)
		 if (!productInfo) return res.json({ success: 0, message: "cart is empty", data: "" });
		 //var cartProduct = await Cart.aggregate([{ $unwind: '$cart'},{$match:{_user:mongoose.Types.ObjectId(cartInfo._user),_store:mongoose.Types.ObjectId(cartInfo._store),"cart._product":mongoose.Types.ObjectId(cartInfo._product)} }])
		 var pQuantity = cartInfo.quantity;
		 var pPrice = productprice.effective_price * pQuantity;
		 console.log("--vlaue", pPrice)
		 // console.log(productInfo.price)
		 var product = await Cart.findOneAndUpdate({ _user: cartInfo._user, _store: cartInfo._store, cart: { $elemMatch: { _product: cartInfo._product } } }, {
			 $set: {
				 "cart.$.quantity": pQuantity, 'cart.$.total_price': pPrice
			 }
		 }, { new: true, upsert: true }).lean();
		 
		 //  var product = await Cart.findOneAndUpdate({_user:cartInfo._user,_store:cartInfo._store,cart:{$elemMatch: {_product:cartInfo._product}}},{$set:{cart: {'cart.$.quantity': cartInfo.quantity, 'cart.$.total_price':cartInfo.total_price }}},{new: true});
		 if (product?.cart) {
			 var data = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store }).populate('cart._product', 'name sku price image').lean();
			 if (!data) return res.json({ success: 0, message: "cart is empty", data: "" });
            
			 let total_quantity, total_price, coupon, discounted_price;
 
			 total_quantity = data.cart.map(product => product.quantity).reduce(function (acc, cur) {
				 return acc + cur;
			 })
			 
			 total_price = data.cart.map(product => product.total_price).reduce(function (acc, cur) {
				 return acc + cur;
			 })
			
			 products = data.cart.map((list) => {
				 if (!list._product) return
				 let image_path = (list._product.image) ? list._product.image : 'not-available-image.jpg';
				 let image = `${process.env.BASE_URL}/images/products/${image_path}`;
				 let total_price = list.total_price;
				 let quantity = list.quantity;
				 delete (list.total_price)
				 delete (list.quantity)
				 return { ...list, _product: { ...list._product, in_cart: quantity, total_price: total_price.toFixed(2), image: image } }
			 })
			 data.cart = products;
			 discounted_price = 20;
			 coupon = {
				 code: 'AZXPN102',
				 discount: '20%'
			 }
 
			 if(req.query.view_cart==1){
						 var responseData = { 
											 status: 1, 
											 message: "Product Update", 
											 total_products:total_quantity,
											 data: data, 
											 subtotal: { price: total_price.toFixed(2), shipping_cost: "100.00", sub_total: total_price.toFixed(2) } 
										 }
						 }else{                
						 var responseData   = {
											 status: 1, 
											 message: "Product Update", 
											 total_products:total_quantity,
						 }       
			 }       
			 return res.json(responseData);
		 }
		 return res.json({ status:0, message: "No data found", data: {} });
	 } catch (err) {
		 console.log("--err", err)
		 return res.status(400).json({ data: err.message });
	 }
 }
 
 exports.makeCartEmpty = async (req, res) => {
	 
	 const errors = await validationResult(req);
	 if (!errors.isEmpty()) {
		 return res.status(400).json({ errors: errors.array() });
	 }
 
	 try {
		 let remove = await Cart.deleteOne({  _user: req.session.userid,_store:req.params.storeid }).exec()
		 if (!remove) return res.json({ status: false })
		 return res.json({ status: true, message:"Cart is empty now"})
	 }catch (err) {
		 res.send(err)
	 }
 
 }


 exports.getProductsQuantity = async (req, res)=>{
	try{
		console.log("=====",req.body)
		let storedata = await Store.findOne({ slug: req.params.store }).select('-time_schedule -_department -holidays -__v -createdAt -updatedAt -_user').populate({
			path: '_currency',
			select: 'name',
		  }).lean()


		var user = await User.findOne({_id:req.session.userid }).lean()
			// if(!addresses.address){ return res.json({ status: 0, message: "No default address added for you" }) }
			// return res.json({data:addresses}) 


		
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
        
			const array = []
			cartProducts.cart.map(e=>{
				array.push(e.quantity)
			})
			// console.log("======data",array)
			// return res.json({status :1,data:array})
       console.log("---- im herer")
		//if(cartProducts?.cart.length)return res.json({status:1,data:cartProducts.cart, store: storedata})
			return res.render('_partials/_frontend/navbar.ejs',{ data:"abc"})
	}catch (err) {
		console.log("--err", err)
		return res.status(400).json({ data: "Something Went Wrong" });
    }
	
}

