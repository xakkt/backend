const ProductCategory = require('../../models/product_category');
const Product = require('../../models/product');

const { validationResult } = require('express-validator');

exports.create = async (req, res) => {
    try {
        var product = await ProductCategory.find({}).lean();
        res.render('admin/product-category/create', { menu: "ProductCategory", product: product })
    } catch (err) {
        res.status(400).json({ data: err.message });
    }
}
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
            
        }
        productinfo.parent_id = (req.body.parent_id) ? req.body.parent_id : null;
        const productCategory = await Product.create(productinfo);
        await req.flash('success', 'Product added successfully!');
        res.redirect('/admin/product')
    } catch (err) {
        await req.flash('failure', err.message);
        res.redirect('/admin/product')
        // res.status(400).json({ data: err.message });
    }
}
exports.productlisting = async (req,res) =>{
    try {
        let product = await Product.find().exec();
        if (!product.length) return res.render('admin/product/listing', { menu: "product", submenu: "list", product: "",success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure')  })
        return res.render('admin/product/listing', { menu: "product", submenu: "list", product: product ,success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })

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
        res.render('admin/product/edit', { status: "success", message: "", product: product, product: product, menu: "Product" })
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