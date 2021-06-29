const RegularPrice = require('../../models/product_regular_pricing');
const Store = require('../../models/store');
const Deal = require('../../models/deal');
const StoreProductPricing = require('../../models/store_product_pricing');
var ObjectId = require('mongoose').Types.ObjectId;
const User = require('../../models/user')

exports.create = async (req, res) => {
    try {
       
        if(req.session.roles.includes('system_admin')){
            var stores = await Store.find({}).populate('_currency').collation({ locale: "en" }).sort({'name': 1}).lean();
            store = stores
        }else{
           
            var stores = await User.findOne({_id:req.session.userid}).select('-_id -password -role_id -coupons -last_login -updatedAt -createdAt -ncrStatus').populate({path:'_store',options: { sort: { 'name': 1 } }, populate: {path: '_currency'} }).lean() 
            store = stores._store
        }

        
        var regularPrice = await RegularPrice.aggregate([
            {$match: {_product:ObjectId(req.params.productid), _user:ObjectId(req.session.userid)}},
            {$lookup: {from: "stores", localField: "_store", foreignField: "_id", as: "store"}},
            {$sort: {"store.name": 1}},
         ])
        if (!regularPrice) return res.render('admin/product/regular_price', {
            menu: "RegularPrice",
            regularPrice: "",
            store: store,
            productid: req.params.productid
        })
        
        return res.render('admin/product/regular_price', {
            menu: "RegularPrice",
            regularPrice: regularPrice,
            stores: store,
            productid: req.params.productid
        })
    } catch (err) {
        res.status(400).json({
            data: err.message
        });
    }
}

exports.addprice = async (req, res) => {
    try { 
        if(req.body.store.length != req.body.regular_price.length){
            return res.json({status:false, message:"Something went wrong"})
        }
        const arr = [];
        for (i = 0; i < req.body.store.length; i++) {
            data = {};
            data.regular_price = req.body.regular_price[i];
            data._store = req.body.store[i]
            data._product = req.body.productid
            data._user = req.session.userid
            arr.push(data)
        }
      
        var remove_price = await RegularPrice.deleteMany({_user:data._user, _product:data._product}).exec();
        if (!remove_price) return res.json({ status: false })

        var prices = await RegularPrice.insertMany(arr).then()
        if(!prices){ return res.json({ message:"Something went wrong", status: false })  }
            res.redirect('/admin/product')

    } catch (err) {
        console.log('===validation', err)
     await req.flash('failure', "Regular price");
        res.send(err)
    }
}
exports.remove = async (req, res) => {
    try {
        let data = await RegularPrice.findOne({
            _id: req.body._id
        }).lean()
       return await Promise.all([
            await StoreProductPricing.deleteOne({
                _store: data._store,
                _product: data._product
            }).exec(),
            await RegularPrice.deleteOne({
                _id: req.body._id
            }).exec()
        ]).then(result => {
            return res.json({
                status: true
            })
        }).catch(error => {
            return res.json({status:false})
        });
        await StoreProductPricing.deleteOne({
            _store: data._store,
            _product: data._product
        }).exec()
        //   let remove =  await RegularPrice.deleteOne({_id:req.body._id}).exec()
        //   if(!remove) return res.json({status:false})
        return res.json({
            status: true
        })
    } catch (err) {
        res.send(err)
    }
}
/**
 *  get regular price and details using store id
 * _store_id
 */
exports.get = async (req, res) => {
    try {
        console.log("0---im here", req.body)
        let currency = await Store.findOne({
            _id: req.body.storeid
        }).populate({
            path: '_currency'
        }).exec()
        var regularPrice = await RegularPrice.findOne({
            _product: req.body.productid,
            _store: req.body.storeid
        }).lean();
        if (!regularPrice) return res.json({
            status: false,
            message: "Not found"
        })
        return res.json({
            status: true,
            message: regularPrice,
            currency: currency
        })
    } catch (err) {
        res.status(400).json({
            data: err.message
        });
    }
}