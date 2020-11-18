const Product = require('../../models/product');
const ProductCategory = require('../../models/product_category');
let jwt = require('jsonwebtoken');
const Setting = require('../../models/setting')
const Banner = require('../../models/banner')
const _global = require('../../helper/common')
const StoreProductPricing = require('../../models/store_product_pricing')


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
		if (!categories.length) return res.json({ status: "false", message: "No data found", data: categories });

		var cartProductList = await _global.cartProducts(userid, req.params.storeid);
		var wishlistids = await _global.wishList(userid, req.params.storeid)
		var shoppinglistProductIds = await _global.shoppingList(userid, req.params.storeid)

		await Promise.all(categories.map(async (element) => {

			// return element._product.map(data => {
                  var data = {}
				var productId = element._product._id.toString();
				var productPrice = await _global.productprice(req.params.storeid,productId)
			     console.log("-price",productPrice)
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
				data = { ...data, type: "product", is_favourite: 1,deal_price:productPrice.deal_price,regular_price:productPrice.regular_price }
				
				product.push(data)
			// })

		})
		)
		console.log("----data",product)

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

