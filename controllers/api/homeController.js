const Product = require('../../models/product');
const ProductCategory = require('../../models/product_category');
let jwt = require('jsonwebtoken');
const Setting = require('../../models/setting')
const Banner = require('../../models/banner')
const _global = require('../../helper/common')
const _time = require('../../helper/storetimezone')

const StoreProductPricing = require('../../models/store_product_pricing')
var moment = require('moment');

function getUniqueListBy(product, key) {
	return [...new Map(product.map(item => [item[key], item])).values()]
}

exports.dashboard = async (req, res) => {
	var userid;
	var product = [];
	await _time.store_time(req.params.storeid)
	var date = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
	try {
		var userid
		let token = req.headers['authorization'];
		if (token) {
			if (token.startsWith(process.env.JWT_SECRET)) {
				token = token.slice(7, token.length);

			}
			await jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
				if (decoded) {
					userid = decoded.id;
				}
			});

		}
		var cartProductList = []
		var wishlistids = []
		var shoppinglistProductIds = []
		let categories = await StoreProductPricing.find({
			_store: req.params.storeid
		}).populate('_product', 'name sku  image').lean();
		if (!categories.length) return res.json({
			status: "false",
			message: "No data found",
			data: categories
		});
		if (userid) {
			cartProductList = await _global.cartProducts(userid, req.params.storeid);
			wishlistids = await _global.wishList(userid, req.params.storeid)
			shoppinglistProductIds = await _global.shoppingList(userid, req.params.storeid)
		}

		await Promise.all(categories.map(async (element) => {
			var data = {}
			var productId = element._product._id.toString();
			var productPrice = await _global.productprice(req.params.storeid, productId)

			data = {
				...data,
				type: "product",
				_id: element._product._id,
				name: element._product.name,
				is_favourite: 0,
				in_shoppinglist: 0,
				in_cart: 0,
				image: `${process.env.BASE_URL}/images/products/${element._product.image}`,
				deal_price: productPrice.deal_price.toFixed(2),
				regular_price: productPrice.regular_price.toFixed(2)
			}

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

		}))
		product = getUniqueListBy(product, '_id')
		let banners =  await StoreProductPricing.find({
			  	$and: [{
					_store:req.params.storeid
				},
				{
					deal_start: {
						$lte: date
					}
				}, {
					deal_end: {
						$gte: date
					}
				}
			],
		}).lean();
		let data = []
		 banners.filter(item => {
			data.push(JSON.stringify(item._deal))
		})
			let bannerss = await Banner.find({
			_store:req.params.storeid,
			 _deal:{
				 $in :JSON.parse(data)
				}
			 }
		).lean()
		if (!bannerss) return res.json({
			status: "false",
			message: "No setting found",
			data: []
		})

		pdata = [{
				path: `${process.env.BASE_URL}/images/banners/`,
				type: "banner",
				banner: bannerss
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
		return res.json({
			status: 1,
			data: pdata
		})
	} catch (err) {
		console.log(err)
		res.status(400).json({
			status: 0,
			message: "",
			data: err
		});
	}
}