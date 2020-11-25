const Banner = require('../../models/banner');
const Store = require('../../models/store');
const Deal = require('../../models/deal');
var moment = require('moment')

const Store_product_pricing = require('../../models/store_product_pricing');

const { validationResult } = require('express-validator');
const product_category = require('../../models/product_category');

exports.create = async (req, res) => {
    try {
        const store = await Store.find({}).lean()
        const store_product_pricing = await Store_product_pricing.find({}).lean()
        res.render('admin/banner/create', { menu: "banner", submenu: "create", store: store, store_product_pricing: store_product_pricing })
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }
},


    exports.deals = async (req, res) => {
        try {
            var date = moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
            const store = await Store_product_pricing.find({ $and: [{ _store: req.body.storeid }, { deal_start: { $lte: date } }, { deal_end: { $gte: date } }] }).populate('_deal', 'name').select('-deal_percentage -deal_price -deal_start -percentag_discount_price -deal_end -product -createdAt -updatedAt -_product -_store').lean()
            // const store =   Store_product_pricing.aggregate([
            //     {
            //         $match:{
            //             _store:req.body.storeid
            //         },
            //     },
            //     {$group : {_deal}},
            // ]).exec()
            // console.log("--logss",store)

            return res.json({ status: true, value: store })
        } catch (err) {
            res.status(400).json({ status: "false", data: err });

        }
    }
exports.save = async (req, res) => {
    try {
        const brandinfo = {
            _deal: req.body.deal,
            image: req.file.filename,
            _store: req.body.store,
        }
        const banner = await Banner.create(brandinfo);
        if (!banner) return res.json({ status: false, message: "Data not saved" })
        await req.flash('success', 'Banner added successfully!');
        res.redirect('/admin/banner/list')


    } catch (err) {
        await req.flash('failure', err.message);
        res.redirect('/admin/banner/list')

        // res.status(400).json({ data: err.message });
    }


}
exports.list = async (req, res) => {

    try {
        var banner_image = []
        var date = moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        const banner = await Banner.find({ $and: [{ deal_start: { $lte: date } }, { deal_end: { $gte: date } }] }).populate('_store', 'name')
            .populate('_deal', 'name').lean()
        banner.map((element) => {
            var data = {}
            data = { ...element }
            if (!element.image) data.image = 'no-image.jpeg'
            banner_image.push(data)
        })
        
        if (!banner) return res.render('admin/banner/list', { menu: "banner", submenu: "list", data: "", success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
        return res.render('admin/banner/list', { menu: "banner", submenu: "list", data: banner_image, moment: moment, success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })

    } catch (err) {
        res.status(400).json({ data: err.message });

    }
}
exports.delete = async (req, res) => {
    Banner.deleteOne({ _id: req.params.id }, function (err) {
        if (err) return res.status(400).json({ data: err });
        req.flash('success', 'Banner deleted successfully!');
        res.redirect('/admin/banner/list')
        //  return res.json({status:true, message: "Department Deleted", data:[]});
    })
}

exports.edit = async (req, res) => {
    try {
        // const store = await Store.find({}).lean()
        const banner = await Banner.findById(req.params.id).exec();
        res.render('admin/banner/edit', { status: "success", data: banner, menu: "banner", submenu: "edit" })
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }
}

exports.agreement = async (req, res) => {
    try {
        return res.render('/admin/pages/agreement')
    } catch (err) {
        console.log("--err", er)
        return res.status(404).json({ status: false, message: err })
    }
}
exports.update = async (req, res) => {
    try {

        console.log("req.pra", req.params.id)
        const baanerinfo = {}
        if (req.file) { baanerinfo.image = req.file.filename }
        const banner = await Banner.findOneAndUpdate({ _id: req.params.id }, baanerinfo, { returnOriginal: false });
        if (!banner) return res.json({ status: false, message: "Data not saved" })
        return res.json({ status: true, message: "Data Updated" })

    } catch (err) {
        console.log("--err", err)
        res.status(404).json({ status: false, message: err.message })
    }
}