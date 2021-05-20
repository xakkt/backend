const ProductCategory = require('../../models/product_category');
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
			const products = await Product.find({_category:req.params.id}).exec();
			if(!products.length) return res.json({message: "No product for this category", data:products});
			return res.json({status:1, message: "", data:products});
		}catch(err){
			console.log(err)
			return res.status(400).send(err);
		}
};

exports.update = async function(req, res){
console.log('here');
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

