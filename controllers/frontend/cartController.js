const Product = require('../../models/product');

exports.list = async (req, res) => {
    try {
        console.log("-- im heerer")
        var cart = req.cookies["session_id"];
        console.log("--cart",cart)

        if(cart) return res.render('frontend/cart',{data:'',carts:cart})
    }
    catch (err) {
        console.log("--err", err)
    }
}
