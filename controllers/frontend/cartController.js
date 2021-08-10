const Product = require('../../models/product');

exports.list = async (req, res) => {
    try {
        console.log("-- im heerer")
        var cart = req.cookies["session_id"];
        console.log("--cart",cart)

        if(cart) return res.render('frontend/cart',{data:'',carts:cart})
    }
    catch (err) {
        console.log("--err", err)
    }
}


exports.addPoductToCart = async (req, res) => {

	const errors = await validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		var productInfo = await Product.findById(req.body._product);
		let productprice = await _global.productprice(req.body._store, req.body._product)
		if (!productprice) return res.json({ status: 0, message: "Product Price of this id not set yet" })
		if (!productInfo) return res.json({ status: 0, message: "Product with this id not exists" })
		const cartInfo = {
			_user: req.decoded.id,
			_store: req.body._store,
			cart: {
				_product: req.body._product,
				quantity: req.body.quantity,
				total_price: productprice.effective_price * req.body.quantity,
			},
		}


		var product = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store, cart: { $elemMatch: { _product: cartInfo.cart._product } } });
		if (product?.cart) {
			return res.json({ status: 0, message: "Product is already in the cart" })
		} else {

			product = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store });
			if (!product) {
				product = await Cart.create(cartInfo);
				console.log(product)
			} else {
				product.cart.push(cartInfo.cart)
				await product.save();
			}
		}
		var prod = product.toObject();

		product = prod.cart.map(data => {
			data.in_cart = data.quantity;
			delete (data.quantity)
			return data;
		})
		return res.json({ status: 1, message: "Product added to cart successfully", data: product });
	} catch (err) {
		console.log("--errr", err)
		return res.status(400).json({ data: err.message });
	}

};
