
const Product = require('../../models/product');
const StoreProductPricing = require('../../models/store_product_pricing');
const _global = require('../../helper/common')

exports.list = async (req, res) => {
    try {
        let product = await StoreProductPricing.find({ _store: req.params.id }).populate('_product').lean();
        if (product) {
            product.map(async element => {
                var productid =  element._product._id
                console.log("--logsss",element._store)
                 var price = _global.productprice(element_store,productid)
                // console.log("---logsss",price)

            })
        }
        if (req.session.email) {
            return res.render('frontend/index', { data: req.session.email, product: product })
        }
        return res.render('frontend/index', { data: '', product: product })
    }
    catch (err) {
        console.log("--err", err)
    }
}