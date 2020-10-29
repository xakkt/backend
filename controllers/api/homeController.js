const Product = require('../../models/product');
const ProductCategory = require('../../models/product_category');
let jwt = require('jsonwebtoken');
const Setting = require('../../models/setting')
const Banner = require('../../models/banner')
const _global = require('../../helper/common')


exports.dashboard = async (req, res) => {
	var product = [];
	var userid;

	try {
		let token = req.headers['authorization'];
		if (token) {
			if (token.startsWith(process.env.JWT_SECRET)) {
				token = token.slice(7, token.length);
			}

			await jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
				if (err) {

					return res.json({
						success: false,
						message: 'Token is not valid'
					});
				}
				userid = decoded.id;

			});
		}

		let categories = await ProductCategory.find({ _store: req.params.storeid }).populate('_products', 'name sku price image').lean();
		if (!categories.length) return res.json({ status: "false", message: "No data found", data: categories });

		var cartProductList = await _global.cartProducts(userid, req.params.storeid);
		var wishlistids = await _global.wishList(userid, req.params.storeid)
		var shoppinglistProductIds = await _global.shoppingList(userid, req.params.storeid)

		categories.map(element => {

			return element._products.map(data => {

				var productId = data._id.toString();
				
				if (productId in cartProductList) {
					data = { ...data, type: "product", in_cart: cartProductList[productId] }
				} else {
					data = { ...data, type: "product", in_cart: 0 }
				}

				if (wishlistids.includes(productId) && shoppinglistProductIds.includes(productId)) {
					data = { ...data, type: "product", is_favourite: 1, in_shoppinglist: 1 }
				} else if (shoppinglistProductIds.includes(productId)) {
					data = { ...data, type: "product", is_favourite: 0, in_shoppinglist: 1 }
				} else if (wishlistids.includes(productId)) {
					data = { ...data, type: "product", is_favourite: 1, in_shoppinglist: 0 }
				} else {
					data = { ...data, type: "product", is_favourite: 0, in_shoppinglist: 0 }
				}
				data = { ...data, type: "product", is_favourite: 1, special_price: data.price }
				product.push(data)

			})

		});

		let banners = await Banner.find({ type: "app" }).lean();
		if (!banners) return res.json({ status: "false", message: "No setting found", data: [] })

		pdata = [
			{
				path: `${process.env.BASE_URL}/images/banners/`,
				type: "banner",
				banner: banners
			},
			{
				path: `${process.env.BASE_URL}/images/products/`,
				type: "product",
				sub_type: "Deals",
				product: product

			},
			{
				path: `${process.env.BASE_URL}/images/products/`,
				type: "product",
				sub_type: "order_again",
				product: []
			}
		];
		return res.json({ status: "true", data: pdata })


	} catch (err) {
		console.log(err)
		res.status(400).json({ status: "false", message: "", data: err });
	}
}

