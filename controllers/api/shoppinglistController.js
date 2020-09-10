const Shoppinglist = require('../../models/shoppinglist')
const ShoppinglistName = require('../../models/shoppinglist_name')
var ObjectId = require('mongoose').Types.ObjectId; 
var moment = require('moment');
const { validationResult } = require('express-validator');


exports.allShoppingLists = async (req, res)=>{
	
	  try{
		    const listInfo = {
				_user:req.body._user,
				_store:req.body._store
			}
			let shoppinglist = await ShoppinglistName.find(listInfo,'name').exec();
			if(!shoppinglist.length) return res.json({status: "false", message: "No data found", data: shoppinglist});
			return res.json({status: "success", message: "", data: shoppinglist});
			
	   }catch(err){
			res.status(400).json({status: "success", message: "", data: err});
	   }
},

exports.addProductToshoppinglist = async(req, res) => { 

    			const errors = await validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
                }
               
				try{
					    shoppinglistInfo = {
							_shoppinglist: req.body._shoppinglist,
							 _product:req.body._product,
							 quantity:req.body.quantity
						} 
						const product = await Shoppinglist.create(shoppinglistInfo)
						
						return res.json({status: "success", message: "Product added to shoppinglist successfully", data: product});
						
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
				console.log(req.body);
				const ShoppinglistInfo = {
					name: req.body.name,
					_user: req.body._user, 
					_store: req.body._store
				};

				const shoppinglist = await ShoppinglistName.create(ShoppinglistInfo);
				res.json({status: "true", message: "Shopping List Created", data: shoppinglist});

	}catch(err){
		if(err.code==11000)return res.status(400).json({data: "List with this name already exist"});
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
		let shoppinglist = await Shoppinglist.find({_shoppinglist:req.params.shoplist}).populate('_product','name sku price').exec();
		
		if(!shoppinglist.length) return res.json({status: "false", message: "No data found", data: shoppinglist});
		return res.json({status: "success", message: "", data: shoppinglist});
		
   }catch(err){
		res.status(400).json({status: "success", message: "", data: err});
   }
}

