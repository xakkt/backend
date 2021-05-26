const RegularPrice = require('../../models/product_regular_pricing');
const Store = require('../../models/store');
const Deal = require('../../models/deal');
const StoreProductPricing = require('../../models/store_product_pricing');

exports.create = async (req, res) => {
    try {
        var store = await Store.find({}).lean();
        var regularPrice = await RegularPrice.find({
            _product: req.params.productid
        }).lean();
        if (!regularPrice) return res.render('admin/product/regular_price', {
            menu: "RegularPrice",
            regularPrice: "",
            store: store,
            productid: req.params.productid
        })
        //   return  res.redirect('/admin/product/list')
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
        const arr = [];
        for (i = 0; i < req.body.no_of_stores; i++) {
            // await RegularPrice.findOne({_store:req.body.store[i],_product:req.body.prod});
            data = {};
            data.regular_price = req.body.regular_price[i];
            data._store = req.body.store[i]
            data._product = req.body.productid
            data._user = req.session.userid
            await RegularPrice.findOneAndUpdate({_store:req.body.store[i],_product:req.body.productid}, data, {
                new: true,
                upsert: true // Make this update into an upsert
              })
            // arr.push(data)
        }
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