const Shoppinglist = require('../../models/shoppinglist')
var moment = require('moment');
const { validationResult } = require('express-validator');


exports.allShoppingLists = async (req, res)=>{
	
	  try{
			let shoppinglist = await Shoppinglist.find({_user:req.params.userid},'name').exec();
			if(!shoppinglist.length) return res.json({status: "false", message: "No data found", data: shoppinglist});
			return res.json({status: "success", message: "", data: shoppinglist});
			
	   }catch(err){
			res.status(400).json({status: "success", message: "Category added successfully", data: err});
	   }
},

exports.addProductToshoppinglist = async(req, res) => { 

    			const errors = await validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
                }
               
				try{
				
				console.log(req.body);
				const shoppinglist = await Shoppinglist.findByIdAndUpdate({_id:req.body._shoplist},{$push:{
					_products:req.body._product }},{ new: true }).exec();
				res.json({status: "success", message: "Product added to shoppinglist successfully", data: shoppinglist});
			
				}catch(err){
					res.status(400).json({data: err.message});
				}				
					
			}; 


exports.createShoppingList = async function(req, res){
	try{
				const errors = await validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}
				const ShoppinglistInfo = new Shoppinglist({
					_user: req.body._user, 
					name: req.body.name,
					
				})

				const shoppinglist = await Shoppinglist.create(ShoppinglistInfo);
				res.json({status: "true", message: "Shopping List Created", data: shoppinglist});

	}catch(err){
		res.status(400).json({data: err.message});
	}
},
exports.updateWishlist = async function(req, res){

	
	

}

exports.deleteProductWishlist = async(req,res)=>{
	Wishlist.deleteOne({ _id: req.params.id }, function (err) {
		if (err) return handleError(err);
		 res.json({status:true, message: "Category Deleted", data:[]});
	  });
}

exports.shoppinglistProducts = async(req, res)=> {
    try{
		let shoppinglist = await Shoppinglist.findById(req.params.shoplist).populate('_products').exec();
		console.log(shoppinglist)
		if(!shoppinglist.length) return res.json({status: "false", message: "No data found", data: shoppinglist});
		return res.json({status: "success", message: "", data: shoppinglist});
		
   }catch(err){
		res.status(400).json({status: "success", message: "", data: err});
   }
}

