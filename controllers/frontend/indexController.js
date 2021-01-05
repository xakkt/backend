
const Product = require('../../models/product');
const StoreProductPricing = require('../../models/store_product_pricing');
const _global = require('../../helper/common')

exports.list = async (req, res) => {
    try {
        var prices = []
        let product = await StoreProductPricing.find({ _store: req.params.id }).populate('_product').lean();
        if (product) {
            await Promise.all(product.map(async element => {
                let data ={} ;
                var productid =  element._product._id
                 var price = await  _global.productprice(element._store,productid)
                //  console.log("---priceddd",price.regular_price)
                 data ={...element}
                data.regular_price = price.regular_price
                data.effective_price = price.effective_price
                data.deal_price = price.deal_price
                prices.push(data)
            })
            )
        }
        if (req.session.customer) {
            console.log("reqddddd",req.session.customer)
            return res.render('frontend/index', { data: req.session.customer, product: prices })
        }
        return res.render('frontend/index', { data: '', product: prices })
    }
    catch (err) {
        console.log("--err", err)
    }
}
exports.cookie = (req,res) =>{
    let arr =[];
    arr.push(req.body)
    let options = {
        maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        httpOnly: true, // The cookie only accessible by the web server
        // signed: true // Indicates if the cookie should be signed
    }

    // Set cookie
    res.cookie('session_id', '12345',options) //
    console.log("--done",req.cookies["session_id"])
        return res.send('Cookie has been set');
    }
exports.cookiees = async (req,res) =>{
    // var username = req.cookies['username'];
    return res.json({cookie:req.signedCookies})
    console.log('---varuser',req.cookies
    )
}