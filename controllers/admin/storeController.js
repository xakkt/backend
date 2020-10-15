const Department = require('../../models/department');
const Store = require('../../models/store');
const Country = require('../../models/country')
const { validationResult } = require('express-validator');


exports.list = async (req, res)=>{
	
	  try{
			let stores = await Store.find().exec();
			if(!stores.length) return res.render('admin/store/listing',{ menu:"store", submenu:"list", data:"" })
			return res.render('admin/store/listing',{ menu:"store", submenu:"list", stores:stores })
			
	   }catch(err){
			res.status(400).json({status: "success", data: err});
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
    
				try{
					var countries = await Country.find({}).lean();
					var departments = await Department.find({}).lean()
					res.render('admin/store/create', { menu:"store", submenu:"create", departments:departments, countries: countries })
			
				}catch(err){
                    console.log(err)
					res.status(400).json({data: err.message});
				}				
					
			}; 
exports.saveStore = async(req, res)=>{
console.log(req.body); res.send
	try{
		const storeinfo =  { 
				_department: req.body._department,
				_user: req._user,
				contact_no: req.body.contact_no,
				address: req.body.address,
				city: req.body.city,
				state: req.body.state,
				_country: req.body._country,
				zipcode: req.body.zipcode,
				location: { type: "Point", coordinates: [req.body.long, req.body.lat] },
				time_schedule: {
					 Monday : { startTime: req.body.schedule.monday_stime, endTime: req.body.schedule.monday_etime },
					 Tuesday : { startTime: req.body.schedule.tuesday_stime, endTime: req.body.schedule.tuesday_etime },
					 Wednesday : { startTime: req.body.schedule.wed_stime, endTime: req.body.schedule.wed_etime },
					 Thursday : { startTime: req.body.schedule.thurs_stime, endTime: req.body.schedule.thurs_etime },
					 Friday : { startTime: req.body.schedule.fri_stime, endTime: req.body.schedule.fri_etime },
					 Saturday : { startTime: req.body.schedule.sat_stime, endTime: req.body.schedule.sat_etime },
					 Sunday : { startTime: req.body.schedule.sun_stime, endTime: req.body.schedule.sun_etime },
				
				}
				
			}
			
	
	let store = await Store.create(storeinfo);
	res.json({status: "success", message: "Store added successfully", data: store});

	}catch(err){
		console.log(err)
		res.status(400).json({data: err.message});
	}

},

exports.addLocation = async(req,res) => {
	var storeLocationInfo = {
		_store: req.body._store,
		address: req.body.address,
		city: req.body.city,
		state: req.body.state,
		_country: req.body._country,
		zipcode: req.body.zipcode, 
		location: { type: "Point", coordinates: [req.body.long, req.body.lat] },
		contact_no: req.body.contact_no,
		time_schedule: req.body.time_schedule
	} 
}
exports.nearByStores = async(req, res) =>{

	const errors = await validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

	Store.find({ location :  { $near :	{ $geometry :  
				{ type : "Point", coordinates : [req.body.long,req.body.lat]  }, $maxDistance:10000 	}  } 
		} ).then( stores => {
			
		   			if(!stores.length) return res.status(400).json({status:false, message: "No department found nearby"});
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

		let departmentinfo =  { 
			name: req.body.name,
			description: req.body.description, 
			contact_no: req.body.contact_no,
			zipcode: req.body.zipcode, 
			location: { type: "Point", coordinates: [req.body.long, req.body.lat] },
			status:req.body.status, 
		}

		//if(req.file){ userinfo.profile_pic=req.file.path.replace('public/',''); }
		const department =  await Store.findByIdAndUpdate({ _id: req.params.id }, departmentinfo,{ new: true,	upsert: true});
			if(department)return res.json({status:true, message: "Store updated", data:department});
			return res.status(400).json({status:false, message: "Store not found"});
			
		} catch(err){ console.log(err)
			res.status(400).json({status:false, message: "Not updated", data:err});
		}
	

}

exports.deleteStore = async(req,res)=>{
	Store.deleteOne({ _id: req.params.id }, function (err) {
		if (err) return res.status(400).json({data:err});
		 return res.json({status:true, message: "Store Deleted", data:[]});
	  });
}

exports.getStoreByZipcode = async(req, res)=>{
	try{
		let stores = await Store.find({zipcode:req.params.zipcode}).lean();
		if(!stores.length) return res.json({message: "Not department found"});
		return res.json({status:true, message: "", data:stores});
	}catch(err){
		res.status(400).json({data:err});
	}
}

