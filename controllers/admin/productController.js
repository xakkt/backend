const ProductCategory = require('../../models/product_category');
const Product = require('../../models/product');
const Brand = require('../../models/brand')
const Deals = require('../../models/deal')
const Stores = require('../../models/store')
const StoreProductPricing = require('../../models/store_product_pricing')
const { validationResult } = require('express-validator');
var moment = require('moment')

exports.create = async (req, res) => {
    try {
        var product = await ProductCategory.find({}).lean();
       
        res.render('admin/product-category/create', { menu: "ProductCategory", product: product })
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
}

exports.priceSave = async (req, res) => {
   try{
       console.log("---",req.body)
    const arr = [];
    for(i=0; i<req.body.no_of_stores; i++){

        data = {};
        data._deal = req.body.deal[i];
        data.deal_price = req.body.deal_price[i];
        data.deal_value = req.body.deal_value[i];
        data.deal_price = req.body.deal_price[i]; 
        data.regular_price = req.body.regular_price[i]; 
        data.deal_start = req.body.stime[i];
        data.deal_end = req.body.etime[i]; 
        data._store = req.body.store[i]
        data._product = req.body.productid;
        arr.push(data)

       await StoreProductPricing.deleteOne({_store:req.body.store[i]}).exec()
    }

    var productprice = await StoreProductPricing.insertMany(arr);
    if(!productprice) 
    {
        await req.flash('failure', "Product price");
        res.redirect('/admin/product')
    }
    res.redirect('/admin/product')
}catch(err){

    console.log('===validation',err)
    res.send(err)
}
}

exports.addPrice = async (req, res) => {
    try{
        var brands = await Brand.find({}).lean()
        var deals = await Deals.find({}).lean();
        var stores = await Stores.find({}).lean();
        let price = await StoreProductPricing.find({_product:req.params.productid}).exec()
     if(!price) res.render('admin/product/pricing',{ menu: "ProductCategory",productid:req.params.productid, brands:brands, deals:deals,price:'', stores:stores })
        res.render('admin/product/pricing',{ menu: "ProductCategory",productid:req.params.productid, brands:brands, deals:deals,price:price, stores:stores,moment:moment })
    }catch(err){
        res.status(400).json({ data: err.message });
    }
}

exports.productCreate = async (req, res) => {
    try{
        var brands = await Brand.find({}).lean();
        var deals = await Deals.find({}).lean();
        var productCategories = await ProductCategory.find({}).lean();
        return res.render('admin/product/create', { menu:"products", submenu:"create", brands: brands, deals:deals, productCategories: productCategories})
    }catch(err){
        res.status(400).json({ data: err.message });
    }
},

exports.save = async (req, res) => {

    try {
        const categoryInfo = {
            name: req.body.name,
            logo: req.file.filename
        }
        categoryInfo.parent_id = (req.body.parent_id) ? req.body.parent_id : null;

        const productCategory = await ProductCategory.create(categoryInfo);
        await req.flash('success', 'Product added successfully!');
        res.redirect('/admin/category')

    } catch (err) {
        await req.flash('failure', err.message);
        res.redirect('/admin/category')
        // res.status(400).json({ data: err.message });
    }


}

exports.list = async (req, res) => {

    try {
        let productCategory = await ProductCategory.find().exec();
        if (!productCategory.length) return res.render('admin/product-category/listing', { menu: "productCategory", submenu: "list", productCategory: "",success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure')  })
        return res.render('admin/product-category/listing', { menu: "departments", submenu: "list", productCategory: productCategory ,success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })

    } catch (err) {
        res.status(400).json({ status: "success", message: "Department added successfully", data: err });
    }
}
exports.delete = async (req, res) => {
    ProductCategory.deleteOne({ _id: req.params.id }, function (err) {
        if (err) return res.status(400).json({ data: err });
        req.flash('success', 'Product deleted successfully!');
        res.redirect('/admin/category')
    });
}
exports.edit = async (req, res) => {
    try {
        var product = await ProductCategory.find({}).lean();
        const productCategory = await ProductCategory.findById(req.params.id).exec();
        res.render('admin/product-category/edit', { status: "success", message: "", productCategory: productCategory, product: product, menu: "productCategory" })
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }


}
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
        if (productCategory){
            await req.flash('success', 'Product updated successfully!');
            res.redirect('/admin/category') }
        return res.status(400).json({ status: false, message: "ProductCategory not found" });

    } catch (err) {
        console.log(err)
        await req.flash('failure', err.message);
        res.redirect('/admin/category') 
    }


}
exports.productsave = async (req,res) =>{
    try {
        const productinfo = {
            name:{
                english:req.body.en_name
            },
            description: req.body.description,
            sku: req.body.sku,
            weight: req.body.weight,
            short_description: req.body.short_description,
            is_featured:req.body.is_featured,
            price: req.body.price,
            image:req.file.filename,
            status: req.body.status,
            brand_id:req.body.brand
            
        }
        productinfo.parent_id = (req.body.parent_id) ? req.body.parent_id : null;
        const product = await Product.create(productinfo);
        // await req.flash('success', 'Product added successfully!');
        // res.render('admin/product', { status: "success", message: "", product: product, product: product, menu: "Product" })
        res.redirect("/admin/product/pricing/"+product._id)
        // res.redirect('/admin/product')
    } catch (err) {
        await req.flash('failure', err.message);
        res.redirect('/admin/product')
        // res.status(400).json({ data: err.message });
    }
}
exports.productlisting = async (req,res) =>{
    try {
        let price =  await StoreProductPricing.find().exec()
        let product = await Product.find().exec();
        if (!product.length) return res.render('admin/product/listing', { menu: "product", submenu: "list",price:"", product: "",success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure')  })
        return res.render('admin/product/listing', { menu: "product", submenu: "list", product: product,price:price ,success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })

    } catch (err) {
        res.status(400).json({ data: err.message });
    }
}
exports.productdelete = async (req, res) => {
    Product.deleteOne({ _id: req.params.id }, function (err) {
        if (err) return res.status(400).json({ data: err });
        req.flash('success', 'Product deleted successfully!');
        res.redirect('/admin/product')
    });
}
exports.productedit = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).exec();
        var brands = await Brand.find({}).lean();
        var deals = await Deals.find({}).lean();
        var productCategories = await ProductCategory.find({}).lean();
        res.render('admin/product/edit', { status: "success", message: "", brands: brands, deals:deals, product: product, productCategories: productCategories, menu: "Product" })
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }


}
exports.productupdate = async function (req, res) {

    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const productinfo = {
            name:{
                english:req.body.en_name
            },
            description: req.body.description,
            sku: req.body.sku,
            weight: req.body.weight,
            short_description: req.body.short_description,
            is_featured:req.body.is_featured,
            price: req.body.price,
            status: req.body.status,
            
        }
        if (req.file) { productinfo.image = req.file.filename }
        const product = await Product.findByIdAndUpdate({ _id: req.params.id }, productinfo, { new: true, upsert: true });
        if (product){
            await req.flash('success', 'Product updated successfully!');
            res.redirect('/admin/product') }
        return res.status(400).json({ status: false, message: "ProductCategory not found" });

    } catch (err) {
        console.log(err)
        await req.flash('failure', err.message);
        res.redirect('/admin/product') 
    }


}