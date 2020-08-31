const Store = require('../../models/store');
var moment = require('moment');
const { validationResult } = require('express-validator');


exports.list = async (req, res)=>{
	
	  try{
			let store = await Store.find().exec();
			if(!store.length) return res.json({status: "false", message: "No data found", data: store});
			return res.json({status: "success", message: "", data: store});
			
	   }catch(err){
			res.status(400).json({status: "success", message: "Store added successfully", data: err});
	   }
},

exports.show =  async (req, res)=> { 
	try{
		const stores = await Store.findById(req.params.id).exec();
		res.json({status: "success", message: "", data: stores});
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
					let storeinfo =  { 
						name: req.body.name,
						description: req.body.description, 
						contact_no: req.body.contact_no,
						zipcode: req.body.zipcode, 
						location: { type: "Point", coordinates: [req.body.long, req.body.lat] },
						long: req.body.long, 
						status:req.body.status, 
						isdeleted:req.body.isdeleted,
						}
				
				let store = await Store.create(storeinfo);
				res.json({status: "success", message: "Store added successfully", data: store});
			
				}catch(err){
					res.status(400).json({data: err.message});
				}				
					
			}; 

exports.nearByStores = async(req, res) =>{

	const errors = await validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

	Store.find({ location :  { $near :	{ $geometry :  
				{ type : "Point", coordinates : [req.body.long,req.body.lat]  }, $maxDistance:10000 	}  } 
		} ).then( stores => {
			
		   			if(!stores.length) return res.status(400).json({status:false, message: "No store found nearby"});
					return res.json({status:true, message: "", data:stores}); 
								
		}).catch( err => {
			res.status(400).json({status:false, message:err});
  		})

}
	

exports.updateStore = async function(req, res){

	try{

		const errors = await validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
				}

		let storeinfo =  { 
			name: req.body.name,
			description: req.body.description, 
			contact_no: req.body.contact_no,
			zipcode: req.body.zipcode, 
			location: { type: "Point", coordinates: [req.body.long, req.body.lat] },
			status:req.body.status, 
		}

		//if(req.file){ userinfo.profile_pic=req.file.path.replace('public/',''); }
		const store =  await Store.findByIdAndUpdate({ _id: req.params.id }, storeinfo,{ new: true,	upsert: true});
			if(store)return res.json({status:true, message: "Store updated", data:store});
			return res.status(400).json({status:false, message: "Store not found"});
			
		} catch(err){ console.log(err)
			res.status(400).json({status:false, message: "Not updated", data:err});
		}
	

}

exports.deleteStore = async(req,res)=>{
	Store.deleteOne({ _id: req.params.id }, function (err) {
		if (err) return handleError(err);
		 res.json({status:true, message: "Store Deleted", data:[]});
	  });
}

