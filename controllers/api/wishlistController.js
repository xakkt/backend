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

exports.addPoductToWishlist = async(req, res) => { 

    const errors = await validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
                }
                console.log(req.body);
				try{
					const wishlistInfo = new Wishlist({
						_user: req.decoded.id, 
						_product: req.body._product,
						_store: req.body._store,
                        wish_price: req.body.wish_price,
                        max_price: req.body.max_price
					})
				
				const wishlist = await Wishlist.create(wishlistInfo);
				return res.json({status: "success", message: "Product added to wishlist successfully", data: wishlist});
			
				}catch(err){
					if(err.code==11000)return res.status(400).json({data: "Product with this name already exist"});
					return res.status(400).json({data: err.message});
				}				
					
			}; 


exports.deleteProductWishlist = async(req,res)=>{
  
	Wishlist.deleteOne({ _id: req.params.wishlistid }, function (err, data) {
		console.log(data);
		console.log(err)
		if (err) return handleError(err);
		 return res.json({status:true, message: "Product Removed", data:data});
	  });
	
}

exports.allWishlistProducts = async(req, res)=>{
	try{
		const errors = await validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		console.log(req.body)
		let wishlist = await Wishlist.find({_user:req.decoded.id,_store:req.body._store}).populate('_product','name image price').lean();
		if(!wishlist.length) return res.json({status: "success", message: "no data found", data: []})
		wishlist = wishlist.map( (list) =>{
			if(!list._product) return
			let image_path = (list._product.image)?list._product.image:'not-available-image.jpg';
			let image  = `${process.env.BASE_URL}/images/products/${image_path}`;
						
			return {...list, _product:{ ...list._product,image:image}};
	   } ).filter(Boolean);
		return res.json({status: "success", message: "", data: wishlist})
	}catch(err){ console.log(err)
		return res.status(400).json({status:false, message: "", data:err});
	}
}