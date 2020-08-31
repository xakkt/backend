const Product = require('../../models/product');
var moment = require('moment');
const { validationResult } = require('express-validator');


exports.list = async (req, res)=>{
	
	  try{
			let product = await Product.find().exec();
			if(!product.length) return res.json({status: "false", message: "No data found", data: product});
			return res.json({status: "success", message: "", data: product});
			
	   }catch(err){
			res.status(400).json({status: "success", message: "Product added successfully", data: err});
	   }
},

exports.show =  async (req, res)=> { 
	try{
		const product = await Product.findById(req.params.id).exec();
		if(!product) return res.json({status: "success", message: "Product not found", data: []});
		return res.json({status: "success", message: "", data: product});
	 }catch(err){
		res.status(400).json({status: "false", data: err});
   }
	
	
},
exports.create = async(req, res) => { 

				const errors = await validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

				try{
						const productinfo = {
							name: {
							  arabic:req.body.arabic,
							  english:req.body.english,
							  spanish:req.body.spanish,
							},
							description: req.body.description,
							sku: req.body.sku,
							_category: req.body._category,
							price: req.body.price,
							weight: req.body.weight,
							meta_description: req.body.meta_description,
							description: req.body.description,
							short_description: req.body.short_description,
							meta_keywords: req.body.meta_keywords,
							crv: req.body.crv,
							is_bestseller: req.body.is_bestseller,
							is_featured: req.body.is_featured,
							status: req.body.status,
							valid_from: req.body.valid_from,
							valid_till: req.body.valid_till
						}
				
				let product = await Product.create(productinfo);
				res.json({status: "success", message: "Product added successfully", data: product});
			
				}catch(err){
					res.status(400).json({data: err.message});
				}				
					
			}; 

exports.update = async function(req, res){

	try{

		const errors = await validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

		const productinfo = {
					name: {
					  arabic:req.body.arabic,
					  english:req.body.english,
					  spanish:req.body.spanish,
					},
					description: req.body.description,
					sku: req.body.sku,
					_category: req.body._category,
					price: req.body.price,
					weight: req.body.weight,
					meta_description: req.body.meta_description,
					description: req.body.description,
					short_description: req.body.short_description,
					meta_keywords: req.body.meta_keywords,
					crv: req.body.crv,
					is_bestseller: req.body.is_bestseller,
					is_featured: req.body.is_featured,
					status: req.body.status,
					valid_from: req.body.valid_from,
					valid_till: req.body.valid_till
				}

		//if(req.file){ userinfo.profile_pic=req.file.path.replace('public/',''); }
		const product =  await Product.findByIdAndUpdate({ _id: req.params.id }, productinfo,{ new: true,	upsert: true});
			if(product)return res.json({status:true, message: "Product updated", data:product});
			return res.status(400).json({status:false, message: "Product not found"});
			
		} catch(err){ console.log(err)
			res.status(400).json({status:false, message: "Not updated", data:err});
		}
	

}

exports.delete = async(req,res)=>{
	Product.deleteOne({ _id: req.params.id }, function (err) {
		if (err) return handleError(err);
		 res.json({status:true, message: "Product Deleted", data:[]});
	  });
}

