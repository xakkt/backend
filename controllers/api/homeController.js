const Product = require('../../models/product');
const ProductCategory = require('../../models/product_category');
let jwt = require('jsonwebtoken');
const Setting = require('../../models/setting')
const Banner = require('../../models/banner')
const _global = require('../../helper/common')
const StoreProductPricing = require('../../models/store_product_pricing')

function getUniqueListBy(product, key) {
	return [...new Map(product.map(item => [item[key], item])).values()]
}

exports.dashboard = async (req, res) => {
	var userid;
	var product = [];

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

		let categories = await StoreProductPricing.find({ _store: req.params.storeid }).populate('_product', 'name sku  image').lean();
		console.log(categories)
		if (!categories.length) return res.json({ status: "false", message: "No data found", data: categories });

		var cartProductList = await _global.cartProducts(userid, req.params.storeid);
		var wishlistids = await _global.wishList(userid, req.params.storeid)
		var shoppinglistProductIds = await _global.shoppingList(userid, req.params.storeid)


		await Promise.all(categories.map(async (element) => {
			var data = {}
			console.log("---log", element)
			var productId = element._product._id.toString();
			var productPrice = await _global.productprice(req.params.storeid, productId)
			console.log("--product", element._product._id)

			data = { ...data, type: "product", _id: element._product._id, name: element._product.name, is_favourite: 0, in_shoppinglist: 0, in_cart: 0, image: `${process.env.BASE_URL}/images/products/${element._product.image}`, deal_price: productPrice.deal_price.toFixed(2), regular_price: productPrice.regular_price.toFixed(2) }

			if (productId in cartProductList) {
				data.in_cart = cartProductList[productId]

			}

			if (wishlistids.includes(productId) && shoppinglistProductIds.includes(productId)) {
				data.is_favourite = 1,
					data.in_shoppinglist = 1
			} else if (shoppinglistProductIds.includes(productId)) {
				data.in_shoppinglist = 1
			} else if (wishlistids.includes(productId)) {
				data.is_favourite = 1
			}
			product.push(data)

		})
		)
	
		product = getUniqueListBy(product, '_id')
		
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

