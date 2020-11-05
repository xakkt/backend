const Product = require('../../models/product');
const ProductCategory = require('../../models/product_category');
var moment = require('moment');
const { validationResult } = require('express-validator');
const fs = require('fs');

exports.list = async (req, res)=>{
	
	  try{
			let products = await Product.find().populate('_category','name logo').lean();
			if(!products.length) return res.json({status: "false", message: "No data found", data: []});
			products = await products.map( (product) =>{
				 product.image = `${process.env.BASE_URL}/images/products/${product.image}`;
				 return product;
			} )
			return res.json({status: "success", baseUrl:process.env.BASE_URL, message: "", data: products});
			
	   }catch(err){
			res.status(400).json({status: "false", message: "", data: err});
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
	
	
}

