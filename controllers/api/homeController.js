const Product = require('../../models/product');
const ProductCategory = require('../../models/product_category');

const Setting = require('../../models/setting')
const { validationResult } = require('express-validator');


exports.dashboard = async (req, res)=>{
	var product = [];
	try{
		let categories = await ProductCategory.find({_store:req.params.storeid}).populate('_products','name sku price image').lean();
		
		 categories.map(element => {
			
			return element._products.map(data => {
				data = {...data, type:"product"}
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
		return res.json({data:pdata})
	/*	let setting = await Setting.find({key:"home_banner"},'value').exec();
		console.log(setting.length)
		if(!setting.length) return res.json({status: "false", message: "No setting found", data: []})
		if(!categories.length) return res.json({status: "false", message: "No data found", data: categories});
		return res.json({status: "success", message: "", categories: categories, banner:setting[0].value });*/
		
   }catch(err){
	   console.log(err)
		res.status(400).json({status: "false", message: "", data: err});
   }
}

