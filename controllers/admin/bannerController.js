const Banner = require('../../models/banner');
const Store = require('../../models/store');
const Deal = require('../../models/deal');

const Store_product_pricing = require('../../models/store_product_pricing');

const { validationResult } = require('express-validator');

exports.create = async (req, res)=>{
	try{
        const store = await Store.find({}).lean()
        const store_product_pricing = await Store_product_pricing.find({}).lean()
		res.render('admin/banner/create', { menu:"banner", submenu:"create",store:store,store_product_pricing:store_product_pricing })
	}catch(err){
		res.status(400).json({status: "false", data: err});
	}
},


exports.deals = async(req,res) =>{
    try{
        console.log("---im here",req.body.storeid)
        const store= await Store_product_pricing.find({_store:req.body.storeid}).populate('_deal','name').select('-deal_percentage -deal_price -deal_start -percentag_discount_price -deal_end -product -createdAt -updatedAt -_product -_store').lean()
          console.log("----dea",store)
          return res.json({status:true,value:store})
    }catch(err)
    {
        res.status(400).json({status: "false", data: err});
 
    }
}
exports.save = async (req, res) => {

    try {
        console.log("---req.b",req.body)
        const brandinfo = {
            _deal: req.body.deal,
            image: req.file.filename,
            _store: req.body.store,
        }
        // categoryInfo.parent_id = (req.body.parent_id) ? req.body.parent_id : null;

        const banner = await Banner.create(brandinfo);
        return res.json({status:true,data:banner})
        // await req.flash('success', 'Brand added successfully!');
        // res.redirect('/admin/brand')

    } catch (err) {
        console.log("---err",err)
        // await req.flash('failure', err.message);
        // res.redirect('/admin/brand')
        // res.status(400).json({ data: err.message });
    }


}



