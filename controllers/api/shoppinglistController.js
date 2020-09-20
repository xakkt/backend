const Shoppinglist = require('../../models/shoppinglist')
const ShoppinglistName = require('../../models/shoppinglist_name')
var ObjectId = require('mongoose').Types.ObjectId; 
var moment = require('moment');
const { validationResult } = require('express-validator');


exports.allShoppingLists = async (req, res)=>{
	
	  try{
		    const listInfo = {
				_user:req.decoded.id,
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
				
				const ShoppinglistInfo = {
					name: req.body.name,
					_user: req.decoded.id, 
					_store: req.body._store
				};

				const shoppinglist = await ShoppinglistName.create(ShoppinglistInfo);
				return res.json({status: "true", message: "Shopping List Created", data: shoppinglist});

	}catch(err){
		if(err.code==11000)return res.status(400).json({data: "List with this name already exist"});
		res.status(400).json({data: err.message});
	}
},
exports.updateShoppinglist = async function(req, res){
		try{
				const updatedList = await Shoppinglist.findByIdAndUpdate(req.body._shoppinglistid, {$set: {quantity:req.body.quantity}},{ new: true }).exec();
				return res.json({status: "true", message: "Shopping List Updated", data: updatedList});
			}catch(err){
				return res.status(400).json({status: "false", message: "", data: err});
			}
	}

exports.deleteProductFromShoppinglist = async(req,res)=>{
	
	try{
		Shoppinglist.deleteOne({ _id: req.params.shoppinglistid }, function (err) {
			if (err) return res.json({status:true, message: "", data:err});
			return res.json({status:true, message: "Product removed", data:[]});
		});

	}catch(err){
		return res.status(400).json({status: "false", message: "", data: err});
	} 
}

exports.deleteShoppinglist = async(req, res)=>{
	try{
		const delList = await ShoppinglistName.deleteOne({_id: req.params.id}).then();
		if(!delList.deletedCount){ return res.json({status:true, message: "No category found", data:""}); }
		const delProducts = await Shoppinglist.deleteMany({_shoppinglist: req.params.id}).exec();
		res.json({status: "false", message:"List deleted",data:delProducts})
	}catch(err){
		return res.status(400).json({status: "false", message: "", data: err});
	}
}

exports.shoppinglistProducts = async(req, res)=> {
    try{
		let shoppinglist = await Shoppinglist.find({_shoppinglist:req.params.shoplist}).populate('_product','name sku price image').lean();
		
		if(!shoppinglist.length) return res.json({status: "false", message: "No data found", data: shoppinglist});

		shoppinglist = shoppinglist.map( (list) =>{
			if(!list._product) return
			let image_path = (list._product.image)?list._product.image:'not-available-image.jpg';
			let image  = `${process.env.BASE_URL}/images/products/${image_path}`;
						
			return {...list, _product:{ ...list._product,image:image}};
	   } ).filter(Boolean);

	   	return res.json({status: "success", message: "", data: shoppinglist});
		
   }catch(err){
	   console.log(err)
		res.status(400).json({status: "failure", message: "", data: err});
   }
}

