const ProductCategory = require('../../models/product_category');
const _global = require('../../helper/common')
const Product = require('../../models/product')
var moment = require('moment');
const { validationResult } = require('express-validator');


exports.list = async (req, res)=>{
	
	  try{
			let category = await ProductCategory.find().exec();
			if(!category.length) return res.json({status: "false", message: "No data found", data: category});
			category.map(element =>{
				return element.logo =  `${process.env.BASE_URL}/images/products/${element.logo}`
			})
			return res.json({status: 1, message: "", data: category});
			
	   }catch(err){
			res.status(400).json({status: 1, message: "Category added successfully", data: err});
	   }
},

exports.show =  async (req, res)=> { 
	try{
		const category = await ProductCategory.findById(req.params.id).exec();
		if(!category) return res.json({status: "success", message: "Category not found", data: []});
		return res.json({status: 1, message: "", data: category});
	 }catch(err){
		res.status(400).json({status:0, data: err});
   }
	
	
},
exports.create = async(req, res) => { 

				const errors = await validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				try{
					const categoryInfo = new ProductCategory({
						name: req.body.name, 
						parent_id: req.body.parent_id,
						_store: req.body._store,
						logo:req.body.logo
					})
				
				const category = await ProductCategory.create(categoryInfo);
				res.json({status: 1, message: "Category added successfully", data: category});
			
				}catch(err){
					res.status(400).json({data: err.message});
				}				
					
			}; 

exports.productsByCategory = async function(req, res){
		try{
			
			var pageNo = (req.query.page)?parseInt(req.query.page):1
			const pc = await ProductCategory.findById(req.params.id).populate('_products');
			if(!pc)return res.json({status:0, message:"no data found"});
			totalItem=pc._products.length;
			var option = {sort: { 'name.english': 1 }}
			option.limit = 3

			if(pageNo!=1){ option.skip = option.limit*(pageNo-1) }
			
			const categories = await ProductCategory.findById(req.params.id)
									.populate({
										path:'_products',
										select:'-crv -meta_description -_category',
										options: option,
										populate:{ path:'_unit'}
									})
			var storeProduct= []
		
            if(!categories)return res.json({status:0, message:'Category not available'})
			await Promise.all(categories._products.map(async (product) => {
				var data = {}
				var productId = product._id.toString();
				
				var productPrice = await _global.productprice(req.query._store, productId)
				if(productPrice)
				{ 
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
						regular_price: productPrice.regular_price
				   }

			   }else{
						data = {
							...data,
							_id: product._id,
							name: product.name,
							unit: product._unit?.name??'n/a',
							weight: product.weight,
							is_favourite: 0,
							in_shoppinglist: 0,
							in_cart: 0,
							image: product.image
						}
			   }
	
				
			   storeProduct.push(data) 

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
				
	
			}))
			var result = {}
			result.status=1;
			var totalPages = Math.ceil(totalItem/option.limit)
			if(totalPages!=pageNo)result.nextPage=pageNo+1	
			result.data=storeProduct;
			
			return res.json(result);
		}catch(err){
			console.log(err)
			return res.status(400).send(err);
		}
};

exports.update = async function(req, res){

	try{

		const errors = await validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

		const categoryInfo = {
			name: req.body.name, 
			//parent_id: req.body.parent_id,
			logo:req.body.logo
		}

		//if(req.file){ userinfo.profile_pic=req.file.path.replace('public/',''); }
		const category =  await ProductCategory.findByIdAndUpdate(req.params.id, categoryInfo,{ new: true,	upsert: false});
		console.log(category)
			if(category)return res.json({status:1, message: "Category updated", data:category});
			return res.status(400).json({status:0, message: "Category not found"});
			
		} catch(err){ console.log(err)
			res.status(400).json({status:0, message: "Not updated", data:err});
		}
	

}

exports.delete = async(req,res)=>{
	ProductCategory.deleteOne({ _id: req.params.id }, function (err) {
		if (err) return handleError(err);
		 res.json({status:true, message: "Category Deleted", data:[]});
	  });
}

