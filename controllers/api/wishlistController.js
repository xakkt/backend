const Wishlist = require('../../models/wishlist')
var moment = require('moment');
const { validationResult } = require('express-validator');


exports.list = async (req, res)=>{
	
	  try{
			let category = await ProductCategory.find().exec();
			if(!category.length) return res.json({status: "false", message: "No data found", data: category});
			return res.json({status: "success", message: "", data: category});
			
	   }catch(err){
			res.status(400).json({status: "success", message: "Category added successfully", data: err});
	   }
},

exports.addToWishlist = async(req, res) => { 

    const errors = await validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
                }
                console.log(req.body);
				try{
					const wishlistInfo = new Wishlist({
						_user: req.body._user, 
                        _product: req.body._product,
                        wish_price: req.body.wish_price,
                        max_price: req.body.max_price
					})
				
				const wishlist = await Wishlist.create(wishlistInfo);
				res.json({status: "success", message: "Product added to wishlist successfully", data: wishlist});
			
				}catch(err){
					res.status(400).json({data: err.message});
				}				
					
			}; 



exports.updateWishlist = async function(req, res){

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
			if(category)return res.json({status:true, message: "Category updated", data:category});
			return res.status(400).json({status:false, message: "Category not found"});
			
		} catch(err){ console.log(err)
			res.status(400).json({status:false, message: "Not updated", data:err});
		}
	

}

exports.deleteProductWishlist = async(req,res)=>{
	Wishlist.deleteOne({ _id: req.params.id }, function (err) {
		if (err) return handleError(err);
		 res.json({status:true, message: "Category Deleted", data:[]});
	  });
}

