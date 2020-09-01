const Product = require('../../models/product');
const ProductCategory = require('../../models/product_category');

const Setting = require('../../models/setting')
const { validationResult } = require('express-validator');


exports.dashboard = async (req, res)=>{
	
	try{
		let categories = await ProductCategory.find().populate('_products').exec();
		let setting = await Setting.find({key:"home_banner"},'value').exec();
		console.log(setting.length)
		if(!setting.length) return res.json({status: "false", message: "No setting found", data: []})
		if(!categories.length) return res.json({status: "false", message: "No data found", data: categories});
		return res.json({status: "success", message: "", data: {categories:categories, banner:setting[0].value}});
		
   }catch(err){
	   console.log(err)
		res.status(400).json({status: "false", message: "", data: err});
   }
}

