const ProductCategory = require('../../models/product_category');
const Product = require('../../models/product');
const Brand = require('../../models/brand')
const Deals = require('../../models/deal')
const Unit = require('../../models/unit')
const Banner = require('../../models/banner')
const Wishlist = require('../../models/wishlist')
var waterfall = require('async-waterfall');

const Stores = require('../../models/store')
const StoreProductPricing = require('../../models/store_product_pricing')
const RegularPrice = require('../../models/product_regular_pricing');

const { validationResult } = require('express-validator');
var moment = require('moment')
var waterfall = require('async-waterfall');
const _global = require('../../helper/notification');

/*
* View of product category
*/
exports.create = async (req, res) => {
    try {
        var product = await ProductCategory.find({}).lean();

        res.render('admin/product-category/create', { menu: "productCategory", submenu: "create", product: product })
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
}
/*
*  Form of product
*/
exports.productCreate = async (req, res) => {
    try {
        var brands = await Brand.find({}).lean();
        var deals = await Deals.find({}).lean();
        var unit = await Unit.find({}).lean();

        var productCategories = await ProductCategory.find({}).lean();
        return res.render('admin/product/create', { menu: "products", submenu: "create", brands: brands, unit: unit, deals: deals, productCategories: productCategories })
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
},
    /*
    * Add new Product Category
    *params[name,filename]
    */
    exports.save = async (req, res) => {

        try {
            const categoryInfo = {
                name: req.body.name,
                logo: req.file.filename
            }
            categoryInfo.parent_id = (req.body.parent_id) ? req.body.parent_id : null;

            const productCategory = await ProductCategory.create(categoryInfo);
            await req.flash('success', 'ProductCategory added successfully!');
            res.redirect('/admin/category')

        } catch (err) {
            await req.flash('failure', err.message);
            res.redirect('/admin/category')
        }


    }
/*
*Listing of Product Category
*/
exports.list = async (req, res) => {

    try {
        let productCategory = await ProductCategory.find().exec();
        if (!productCategory.length) return res.render('admin/product-category/listing', { menu: "productCategory", submenu: "list", productCategory: "", success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
        return res.render('admin/product-category/listing', { menu: "productCategory", submenu: "list", productCategory: productCategory, success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })

    } catch (err) {
        res.status(400).json({ status: "success", message: err });
    }
}
/*
*Delete Product Category using productcategory id
*params[req.params.id]
*/
exports.delete = async (req, res) => {
    ProductCategory.deleteOne({ _id: req.params.id }, function (err) {
        if (err) return res.status(400).json({ data: err });
        req.flash('success', 'Product deleted successfully!');
        res.redirect('/admin/category')
    });
}
/*
*View product category detail
*params:[req.params.id]
*/
exports.edit = async (req, res) => {
    try {
        var product = await ProductCategory.find({}).lean();
        const productCategory = await ProductCategory.findById(req.params.id).exec();
        res.render('admin/product-category/edit', { status: "success", message: "", productCategory: productCategory, product: product, menu: "productCategory" })
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }


}
/*
*Update product category
*/
exports.update = async function (req, res) {

    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const categoryInfo = {
            name: req.body.name,
        }

        if (req.file) { categoryInfo.logo = req.file.filename }
        const productCategory = await ProductCategory.findByIdAndUpdate({ _id: req.params.id }, categoryInfo, { new: true, upsert: true });
        if (productCategory) {
            await req.flash('success', 'Product updated successfully!');
            res.redirect('/admin/category')
        }
        return res.status(400).json({ status: false, message: "ProductCategory not found" });

    } catch (err) {
        console.log(err)
        await req.flash('failure', err.message);
        res.redirect('/admin/category')
    }


}
/*
*Create new product
*/
exports.productsave = async (req, res) => {
    try {
        const productinfo = {
            name: {
                english: req.body.en_name
            },
            description: req.body.description,
            sku: req.body.sku,
            _category: req.body._category,
            weight: req.body.weight,
            short_description: req.body.short_description,
            is_featured: req.body.is_featured,
            _unit: req.body.unit,
            price: req.body.price,
            image: req.file.filename,
            status: req.body.status,
            brand_id: req.body.brand

        }
        productinfo.parent_id = (req.body.parent_id) ? req.body.parent_id : null;
        const product = await Product.create(productinfo);
        res.redirect("/admin/regularprice/create/" + product._id)

    } catch (err) {
        await req.flash('failure', err.message);
        res.redirect('/admin/product')
    }
}
/*
* Product listing
*/
exports.productlisting = async (req, res) => {
    try {
        // let price = await StoreProductPricing.find().exec()
        // let product = await Product.find().exec();
        // if (!product.length) return res.render('admin/product/listing', { menu: "products", submenu: "list", price: "", product: "", success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
        return res.render('admin/product/listing', { menu: "products", submenu: "list", product: '', price: '', success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })

    } catch (err) {
        res.status(400).json({ data: err.message });
    }
}
/*
*Delete product 
params:[req.params.id]
*/
exports.productdelete = async (req, res) => {
    Product.deleteOne({ _id: req.params.id }, function (err) {
        if (err) return res.status(400).json({ data: err });
        req.flash('success', 'Product deleted successfully!');
        res.redirect('/admin/product')
    });
}
/*
* View product
*param:[req.params.id] 
*/
exports.productedit = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).exec();
        var brands = await Brand.find({}).lean();
        var deals = await Deals.find({}).lean();
        var productCategories = await ProductCategory.find({}).lean();
        res.render('admin/product/edit', { status: "success", message: "", brands: brands, deals: deals, product: product, productCategories: productCategories, menu: "Product" })
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }


}
/*
* Update product
* params:[en_name,description,sku,_category,weight,short_description,is_featured,price,status]
*/
exports.productupdate = async function (req, res) {

    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const productinfo = {
            name: {
                english: req.body.en_name
            },
            description: req.body.description,
            sku: req.body.sku,
            _category: req.body._category,
            weight: req.body.weight,
            short_description: req.body.short_description,
            is_featured: req.body.is_featured,
            price: req.body.price,
            _unit: req.body.unit,

            status: req.body.status,

        }
        if (req.file) { productinfo.image = req.file.filename }
        const product = await Product.findByIdAndUpdate({ _id: req.params.id }, productinfo, { new: true, upsert: true });
        if (product) {
            await req.flash('success', 'Product updated successfully!');
            res.redirect('/admin/product')
        }
        return res.status(400).json({ status: false, message: "ProductCategory not found" });

    } catch (err) {
        console.log(err)
        await req.flash('failure', err.message);
        res.redirect('/admin/product')
    }


}
/*
* delete storeproduct price 
*params[id]
*/
exports.remove = async (req, res) => {
    try {
        let remove = await StoreProductPricing.deleteOne({ _id: req.body._id }).exec()
        if (!remove) return res.json({ status: false })
        return res.json({ status: true })
    } catch (err) {
        res.send(err)
    }
}
/*
* Add deal price 
* params[no_of_stores,deal,deal_price,deal_value,stime,etime,store,productid]
*/
exports.priceSave = async (req, res) => {
    try {
        const arr = [];
        for (i = 0; i < req.body.no_of_stores; i++) {
            for (k = i + 1; k < req.body.no_of_stores; k++) {
                if (req.body.store[i] == req.body.store[k] && req.body.deal[i] == req.body.deal[k]) {
                    if (req.body.etime[i] >= req.body.stime[k]) {
                        await req.flash('failure', "Cannot select two  same dates for same deals");
                        return res.redirect('/admin/product/pricing/' + req.body.productid)
                    }
                }
                else if (req.body.store[i]) {
                    if (moment(req.body.stime[k]).isBetween(moment(req.body.stime[i]), moment(req.body.etime[i])) || moment(req.body.stime[k]).isSame(req.body.stime[i]) || moment(req.body.stime[k]).isSame(req.body.etime[i]) || moment(req.body.etime[k]).isSame(req.body.stime[i]) || moment(req.body.etime[k]).isSame(req.body.etime[i])) {
                        await req.flash('failure', "Cannot select two  same dates for same deals");
                        return res.redirect('/admin/product/pricing/' + req.body.productid)
                    }

                }
            }
            // if(req.body.deal_value[i] >0 && req.body.deal_price[i] )
            // {
            //     await req.flash('failure', "Only one value is selected from Deal% and Deal price");
            //     return res.redirect('/admin/product/pricing/' + req.body.productid) 
            // }
        }
        for (i = 0; i < req.body.no_of_stores; i++) {
            data = {};
            data._deal = req.body.deal[i];
            // data.deal_price = req.body.deal_price[i];
            data.deal_percentage = req.body.deal_value[i];
            data.deal_price = req.body.deal_price[i];
            data.deal_start = moment(req.body.stime[i]).startOf('day').toISOString();
            data.deal_end = moment(req.body.etime[i]).endOf('day').toISOString();
            data._store = req.body.store[i]
            data._product = req.body.productid;
            arr.push(data)
            await _global.wishlist(req.body.store[i], req.body.productid, req.body.deal_price[i])
            const bannerinfo = {
                _deal: req.body.deal[i],
                _store: req.body.store[i],
                deal_start: moment(req.body.stime[i]).startOf('day').toISOString(),
                deal_end: moment(req.body.etime[i]).endOf('day').toISOString()
            }
            const banner = {
                _deal: req.body.deal[i],
                _store: req.body.store[i],
                deal_end: { $gte: moment(req.body.stime[i]).startOf('day').toISOString() },

            }
            waterfall([
                function (callback) {
                    Banner.findOneAndUpdate(
                        {$and: [ {_store:req.body.store[i]},{_deal: req.body.deal[i]},{ deal_end: { $gt: moment(req.body.stime[i]).startOf('day').toISOString() }},{deal_end: { $lt: moment(req.body.etime[i]).endOf('day').toISOString() }}  ]},
                        { deal_end: moment(req.body.etime[i]).endOf('day').toISOString() }, { returnOriginal: false },
                        function (err, result) {
                        callback(err, result);
                    })
                },
                function (result, callback) {
                    if (result) callback(null, result);
                    else
                        Banner.findOne(banner, function (err, result1) {
                            callback(err, result1);
                        })
                },
                function (result1, callback) {
                    bannerinfo.image = 'no-image_1606218971.jpeg'
                    if (result1)
                        callback(null, result1);
                    else {
                        Banner.create(bannerinfo)
                    }
                }
            ], function (err, result) {
                // result now equals 'done'
                console.log("--errr", result)
            });

            // const banner = await Banner.findOneAndUpdate({ _store: req.body.store[i], _deal: req.body.deal[i], deal_end: { $gte:moment(req.body.stime[i]).startOf('day').toISOString() }, deal_end: { $lte: moment(req.body.etime[i]).endOf('day').toISOString() } }, { deal_end:moment(req.body.etime[i]).endOf('day').toISOString() }, { returnOriginal: false }).exec()
            // if (!banner) {
            //     const bannerinfo = {
            //         _deal: req.body.deal[i],
            //         _store: req.body.store[i],
            //         deal_start:moment(req.body.stime[i]).startOf('day').toISOString(),
            //         deal_end:moment(req.body.etime[i]).endOf('day').toISOString()
            //     }
            //     await Banner.create(bannerinfo);
            // }
            await StoreProductPricing.deleteOne({ _store: req.body.store[i], _product: req.body.productid }).exec()
        }

        var productprice = await StoreProductPricing.insertMany(arr);
        if (!productprice) {
            await req.flash('failure', "Product price");
            res.redirect('/admin/product')
        }
        res.redirect('/admin/product')

    } catch (err) {
        console.log('===validation', err)
        res.send(err)
    }
}

/*
* product price view
* get regular_price with store list
* params[req.params.productid]
*/
exports.addPrice = async (req, res) => {
    try {
        var prices = [];
        var brands = await Brand.find({}).lean()
        var deals = await Deals.find({}).lean();
        var stores = await Stores.find({}).lean();
        var regularPrice = await RegularPrice.find({}).lean()

        let price = await StoreProductPricing.find({ _product: req.params.productid }).lean()
        if (!price) res.render('admin/product/pricing', { menu: "ProductCategory", productid: req.params.productid, brands: brands, deals: deals, price: '', stores: stores, success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })

        price.map((element) => {
            var data = {}
            regularPrice.forEach(regular => {
                if (regular._product.equals(element._product) && regular._store.equals(element._store)) {
                    data = { ...element, regularprice: regular.regular_price }
                }
            })
            prices.push(data)

        })
        res.render('admin/product/pricing', { menu: "ProductCategory", productid: req.params.productid, brands: brands, deals: deals, price: prices, stores: stores, moment: moment, success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
    } catch (err) {
        console.log("--err", err)
        res.status(400).json({ data: err.message });
    }
}
exports.product_listing = async (req, res) => {
    try {
        // console.log("--logs",req.query.search.value)
        var pagno = req.query.start / req.query.length + 1
        var page = parseInt(req.query.draw) || 1; //for next page pass 1 here
        var limit = parseInt(req.query.length) || 5;
        let searchString = req.query.search.value || ''
        let product = await Product.find({
            $or: [
                { description: { $regex: '.*' + searchString + '.*', $options: 'i' } },
                { "name.english": { $regex:searchString, $options: 'i' } }
            ]
        })
            .skip((pagno - 1) * limit) //Notice here
            .limit(limit)
            .lean();
        let total = await Product.find(
            {
                $or: [
                    { description: { $regex: '.*' + searchString + '.*', $options: 'i' } },
                    { "name.english": { $regex:searchString, $options: 'i' } }
                ]
            }
            ).lean()
        // if (!deal.length) return res.render('admin/deals/listing', { menu: "deal", submenu: "list", deal: "", success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
        return res.json({ draw: page, recordsTotal: total.length, recordsFiltered: total.length, data: product })
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
}

exports.product_delete =  async (req,res) =>{
    try {
        let remove = await Product.deleteMany({ _id: {$in :req.body.id} }).exec()
        if (!remove) return res.json({ status: false })
        return res.json({ status: true })
    } catch (err) {
        res.send(err)
    }
}