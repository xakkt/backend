const Product = require('../../models/product');
const ProductCategory = require('../../models/product_category');
let jwt = require('jsonwebtoken');
const Setting = require('../../models/setting')
const { validationResult } = require('express-validator');
const Wishlist = require('../../models/wishlist')
const Shoppinglist = require('../../models/shoppinglist')
const ShoppinglistName = require('../../models/shoppinglist_name')

exports.dashboard = async (req, res)=>{
	var product = [];
	var wishlistids = [];
	var shoppinglistids = [];
	var shoppinglistProductIds = [];
	try{
		let token = req.headers['authorization'];
		if(token){
			if (token.startsWith(process.env.JWT_SECRET)) {
				token = token.slice(7, token.length);
		  }
	  
		  await jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
			if (err) {
			  
			  return res.json({
				success: false,
				message: 'Token is not valid'
			  });
			} else {
			  
			  let wishlist = await Wishlist.find({_user:decoded.id,_store:req.params.storeid},'_product').lean();
			    wishlist.map(data => {
				wishlistids.push(data._product.toString())
			  })

			  let allShoppinglist = await ShoppinglistName.find({_user:decoded.id,_store:req.params.storeid},'_id').exec();
			  allShoppinglist.map(data => {
				shoppinglistids.push(data._id)
			  })
			  let listProducts = await Shoppinglist.find({_shoppinglist:{$in:shoppinglistids}},'_product').lean()
			  console.log('fds',listProducts)
			  listProducts.map(data => {
				shoppinglistProductIds.push(data._product.toString())
			  })
			  
			}
		  });
		}

		let categories = await ProductCategory.find({_store:req.params.storeid}).populate('_products','name sku price image').lean();
		
		if(!categories.length) return res.json({status: "false", message: "No data found", data: categories});
		
		 categories.map(element => {
			
			return element._products.map(data => {
			
				if(wishlistids.includes(data._id.toString()) && shoppinglistProductIds.includes(data._id.toString())){
					data = {...data, type:"product", is_favourite:1, in_shoppinglist:1}
				}else if(shoppinglistProductIds.includes(data._id.toString())){
					data = {...data, type:"product", is_favourite:0, in_shoppinglist:1}
				}else if(wishlistids.includes(data._id.toString())){
					data = {...data, type:"product", is_favourite:1, in_shoppinglist:0}
				}else{
					data = {...data, type:"product", is_favourite:0, in_shoppinglist:0}
				}
				
				product.push(data)
				
			})
			
		});
		
		let setting = await Setting.findOne({key:"home_banner"}).lean();
		if(!setting) return res.json({status: "false", message: "No setting found", data: []})

		pdata = [
			{
				path: `${process.env.BASE_URL}/images/banners/`,
				type: "banner",
				banner:setting.value
			},
			{ 
				path:`${process.env.BASE_URL}/images/products/`,
				type: "product",
				sub_type: "Deals",
				product: product
				
			},
			{
				path:`${process.env.BASE_URL}/images/products/`,
				type: "product",
				sub_type: "order_again",
				product:[]
			}			
		];
		return res.json({status: "true",data:pdata})
	
		
   }catch(err){
	   console.log(err)
		res.status(400).json({status: "false", message: "", data: err});
   }
}

