const Department = require('../../models/department');
const Product = require('../../models/product');
const Store = require('../../models/store');
const Categories = require('../../models/product_category')
const Brands = require('../../models/brand')
const StoreProductPricing = require('../../models/store_product_pricing')
const ProductRegularPricing = require('../../models/product_regular_pricing')
const _global = require('../../helper/common')
var moment = require('moment');
const Banner = require('../../models/banner')


function getUniqueListBy(product, key) {
	return [...new Map(product.map(item => [item[key], item])).values()]
}

exports.homepage = async (req, res) => {
  let stores =   await Store.find().lean();
   if(stores) return res.render('frontend/index',{data:req.session.customer,stores:stores})
}

exports.productss = async (req, res) => {
  var storess = []
  var productId = []

  let store = await Store.findOne({slug:req.params.slug}).select('_currency').populate('_currency','name').lean();
  
  /*let stores = await StoreProductPricing.find({
    '_store': store._id
  }).select('-createdAt -updatedAt -__v').populate('_product', 'name image sku').populate('_deal').lean()
  
  if (stores.length) {
    stores.map((item) => {
      productId.push(item._product._id)
    })
  }
  console.log("====>>>>",store._id)
  let regular = await ProductRegularPricing.find({
    _store: store._id,
    _product: {
      $nin: productId
    }
  }).populate('_product')


  if (stores.length >0) {
      
    await Promise.all(stores.map(async (store) => {
      var data = {}
       let prices = await _global.productprice(store._id, store._product)
      _product = store._product,
        _deal = store._deal
      delete store._product;
      delete store._deal;
      data = {
        ...store,
        _product: _product._id,
        name: _product.name,
        regular_price: prices.regular_price,
        image: `${process.env.BASE_URL}/images/products/${_product.image}`,
        sku: _product.sku,
        currency: store._currency.name,
        deal: _deal.name
      }
      storess.push(data)

    }))
  }

  regular.filter((item) => {

    let regularData = {
      _product: item._product._id,
      _store: item._store,
      image: `${process.env.BASE_URL}/images/products/${item._product.image}`,
      sku: item._product.sku,
      name: item._product.name,
      deal_price: 0,
      regular_price: item.regular_price,

    }
    storess.push(regularData)
  })*/
  let categories = await Categories.find().lean()
  let brands = await Brands.find().lean()
   return res.render('frontend/products',{data:req.session.customer,categories:[], brands:brands, products:[]})
}

exports.products = async (req, res) => {
	var userid;
	var pdata = [];
	var product = [];
	//await _time.store_time(req.params.storeid)
	var date = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
	try {
		
		let storedata = await Store.findOne({ slug: req.params.slug }).select('-time_schedule -_department -holidays -__v -createdAt -updatedAt -_user').populate({
			path: '_currency',
			select: 'name',
			
		  }).lean()

		  
		if (!storedata) {
			return res.json({
				status: 0,
				data: 'Store does not exists'
			})
		}
		let nearbystores = await Store.find({
			location: {
				$near: {
					$geometry:
						{ type: "Point", coordinates: storedata.location.coordinates }, $maxDistance: 50000
				}
			}
		}).select('name address city state contact_no')


		

		var storeId = []
		nearbystores.filter((item) => {
			storeId.push(item._id)
		})
		var cartProductList = []
		var wishlistids = []
		var shoppinglistProductIds = []

		let banners = await Banner.find({_store: {
			$in: storeId
		}}).populate('_deal','name').lean();
		
		bannerArr = [];
		await Promise.all(banners.map( async function(banner){
			let dealProducts =  await StoreProductPricing.findOne({$and: [ {_store:banner._store, _deal:banner._deal}, { deal_start:{$lte:date} },{ deal_end:{$gte:date} }  ]}).lean()
		
			if(dealProducts){
					bannerArr.push(banner)
				}
		}))

		_banners = [ {
						"_id": "60b942742527aa36d0ba23",
						"type": "default",
						"_deal": "60b72629b707492d27c576ba",
						"image": "badshah_chana_masala_100gm._1622753908.jpg",
					},
					{
						"_id": "60b942742527aa36d0ba23",
						"type": "default",
						"_deal": "60b72629b707492d27c576ba",
						"image": "badshah_chana_masala_100gm._1622753908.jpg",
					}]

/* ------------- code for banners ---------*/

		if(!banners.length){
			//banners.concat(_banners)
     		pdata[0] = {
				path: `${process.env.BASE_URL}/images/banners/`,
				type: "banner",
				message: "No banner found",
				banner: []
			}

		}else{
			pdata[0] = {
				path: `${process.env.BASE_URL}/images/banners/`,
				type: "banner",
				banner: bannerArr.reverse()
			}
		}

		//	const mergedArray = [...banners, ..._banners];
/* ----------------- end of code for banners ----------*/

	
	let categories = await StoreProductPricing.find({
		_store: storedata._id
	}).populate({
		path: '_product',
		select: 'name sku image weight',
		populate: {
		  path: '_unit',
		  select: 'name'
	    }
	  }).populate({
		path:'_deal',
		select:'name'
	  }).lean();

	  
	if (userid) {
		cartProductList = await _global.cartProducts(userid, storedata._id);
		wishlistids = await _global.wishList(userid, storedata._id)
		shoppinglistProductIds = await _global.shoppingList(userid, storedata._id)
	}

	if (!categories.length){
			pdata[2] = {
				path: `${process.env.BASE_URL}/images/products/`,
				type: "product",
				sub_type: "Deals",
				message: 'No Product on this store available',
				product: []
			}
		}else{
			var deal_name = '';
			await Promise.all(categories.map(async (element) => {
				
				var data = {}
				var productId = element._product._id.toString();
				var productPrice = await _global.productprice(storedata._id, productId)
				
				if(productPrice){

					deal_name = element._deal.name;
								data = {
									...data,
									type: "product",
									_id: element._product._id,
									name: element._product.name,
									unit: element._product._unit?.name??'n/a',
									weight: element._product.weight,
									is_favourite: 0,
									in_shoppinglist: 0,
									in_cart: 0,
									image: `${process.env.BASE_URL}/images/products/${element._product.image}`,
									deal_price: productPrice.deal_price,
									regular_price: productPrice.regular_price
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
					
				}else{
					pdata[2] = {
						path: `${process.env.BASE_URL}/images/products/`,
						type: "product",
						sub_type: "Deals",
						message: 'No Product on this store available',
						product: []
					}
				}
								
					
							}))
							product = getUniqueListBy(product, '_id')
							
							pdata[2] = {
											path: `${process.env.BASE_URL}/images/products/`,
											type: "product",
											dealName: deal_name,
											sub_type: "Deals",
											product: product
										};

		}
		
		/*--------- order again --------*/			
		let orderAgain = []			
		pdata[3] = 	{
						path: `${process.env.BASE_URL}/images/products/`,
						type: "product",
						sub_type: "order_again",
						message: "You have not placed any orders in the last 90 days",
						product: orderAgain
					}			
		/*--------- order again --------*/


		/*--------- trending products --------*/
		
		var trendingProducts = []	
		let allTrendings = await Product.find({
			trending:true
		}).distinct('_id').lean({getter:true});
		let allTrendingIds = allTrendings.map(x => x.toString());
		
		let storeTrending = await ProductRegularPricing.find({ _store:storedata._id,
			_product:{$in: allTrendingIds }}).populate(
				{
				path: '_product',
				select: 'name sku image trending weight',
				populate: {
						path: '_unit',
						select: 'name'
					}
				
				})	
		
	      if(!storeTrending.length){
			pdata[1] = 	{
				path: `${process.env.BASE_URL}/images/products/`,
				type: "product",
				sub_type: "trending",
				message: "No trending product available",
				product: []
			}	
	   }else{
		trendingProducts = [];   
		await Promise.all(storeTrending.map(async (element) => {
			var data = {}
			var productId = element._product._id.toString();
			var productPrice = await _global.productprice(storedata._id, productId)

			data = {
				...data,
				type: "product",
				_id: element._product._id,
				name: element._product.name,
				unit: element._product._unit?.name??'n/a',
				weight: element._product.weight,
				is_favourite: 0,
				in_shoppinglist: 0,
				in_cart: 0,
				image: element._product.image,
				deal_price: productPrice.deal_price,
				regular_price: productPrice.regular_price
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
			trendingProducts.push(data)

		}))

			pdata[1] = 	{
				path: `${process.env.BASE_URL}/images/products/`,
				type: "product",
				sub_type: "trending",
				product: trendingProducts
			}	
			
	   }
	
		/*-------- trending products ------*/		

		/*return res.json({
			status: 1,
			data: pdata[1],
			store:storedata
		}) */
	//	let categories = await Categories.find().lean()
  		let brands = await Brands.find().lean()
   		return res.render('frontend/products',{deal:pdata[2], order_again:pdata[3],store:storedata, brands:brands, trending:pdata[1]})

	} catch (err) {
		console.log(err)
		res.status(400).json({
			status: 0,
			message: "SOMETHING_WENT_WRONG",
			data: err
		});
	}
}
