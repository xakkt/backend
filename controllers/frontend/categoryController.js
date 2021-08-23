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
const ProductCategory = require('../../models/product_category');

function getUniqueListBy(product, key) {
	return [...new Map(product.map(item => [item[key], item])).values()]
}

exports.categoryProducts = async (req, res) => {
	
	var userid = res.locals.userid??req.sessionId
	var pdata = [];
	var product = [];
	//await _time.store_time(req.params.storeid)
	var date = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
	try {
		
		let storedata = await Store.findOne({ slug: req.params.store }).select('-time_schedule -_department -holidays -__v -createdAt -updatedAt -_user').populate({
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
						
			if(dealProducts) bannerArr.push(banner)
			
		}))
		
		var _banners = [ {
			"_id": "60b942742527aa36d0ba23",
			"type": "default",
			"_deal": "",
			"image": "default.jpg",
		},
		{
			"_id": "60b942742527aa36d0ba23",
			"type": "default",
			"_deal": "",
			"image": "default_one.jpg",
		}]

/* ------------- code for banners ---------*/

		if(!bannerArr.length){
			//banners.concat(_banners)
     		pdata[0] = {
				path: `${process.env.BASE_URL}/images/banners/`,
				type: "banner1",
				message: "No banner found",
				banner: _banners
			}

		}else{
			pdata[0] = {
				path: `${process.env.BASE_URL}/images/banners/`,
				type: "banner2",
				banner: bannerArr.reverse()
			}
		}

		//	const mergedArray = [...banners, ..._banners];
/* ----------------- end of code for banners ----------*/


        const categories = await ProductCategory.findOne({slug:req.params.category}).populate('_products','-crv -meta_description -_category').lean();
        var storeProduct= []
        var product = {}

        if(!categories)return res.json({status:0, message:'Category not available'})
       
       
        await Promise.all(categories._products.map(async (product) => {
            var data = {}
            var productId = product._id.toString();
            
            var productPrice = await _global.productprice(storedata._id, productId)
            
            data = {
                ...data,
                _id: product._id,
                name: product.name,
                unit: product._unit?.name??'n/a',
                weight: product.weight,
                is_favourite: 0,
                in_shoppinglist: 0,
                in_cart: 0,
                image: product.image,
                deal_price: productPrice.deal_price,
                regular_price: productPrice.regular_price,
                description: product.description
            }

            

            /*if (productId in cartProductList) {
                data.in_cart = cartProductList[productId]
            }

            if (wishlistids.includes(productId) && shoppinglistProductIds.includes(productId)) {
                data.is_favourite = 1,
                data.in_shoppinglist = 1
            } else if (shoppinglistProductIds.includes(productId)) {
                data.in_shoppinglist = 1
            } else if (wishlistids.includes(productId)) {
                data.is_favourite = 1
            } */
            storeProduct.push(data) 

        }))


		let productCatogories = await Categories.find().lean()
  		
   		return res.render('frontend/category-product',{banners:pdata[0],store:storedata, storeProducts:storeProduct,categories:productCatogories})

	} catch (err) {
		console.log(err)
		res.status(400).json({
			status: 0,
			message: "SOMETHING_WENT_WRONG",
			data: err
		});
	}
}