const Cart = require('../../models/cart')
const Product = require('../../models/product');
var moment = require('moment');
const { validationResult } = require('express-validator');
exports.listCartProduct = async (req, res) => {

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const cartInfo = {
            _user: req.decoded.id,
            _store: req.params.store,
        }

        var data = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store }).populate('cart._product', 'name sku price image').lean();
        if (!data) return res.json({ message: "cart is empty", data: "" });

        let total_quantity, total_price, coupon, discounted_price;
        /*data.cart.forEach((product, index) => {
            total_quantity = product.cart.map(product => product.quantity).reduce(function (acc, cur) {
                return acc + cur;
            })
            total_price = product.cart.map(product => product.total_price).reduce(function (acc, cur) {
                return acc + cur;
            })
            
        });*/

        total_quantity = data.cart.map(product => product.quantity).reduce(function (acc, cur) {
            return acc + cur;
        })

        total_price = data.cart.map(product => product.total_price).reduce(function (acc, cur) {
            return acc + cur;
        })

        products = data.cart.map((list)=>{
                if (!list._product) return
                let image_path = (list._product.image) ? list._product.image : 'not-available-image.jpg';
                let image = `${process.env.BASE_URL}/images/products/${image_path}`;
                return { ...list, _product: { ...list._product, image: image } }          
            }) 
        data.cart = products;
        discounted_price = 20;
        coupon = {
            code: 'AZXPN102',
            discount: '20%'
        }
        return res.json({ status: "success", message: "All cart products", data: data, subtotal: { quantity: total_quantity, price: total_price.toFixed(2), shipping_cost: 100, coupon: coupon, sub_total: (total_price - 100).toFixed(2) } });

    } catch (err) {
        return res.status(400).json({ data: err.message });
    }
},

    exports.addPoductToCart = async (req, res) => {

        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            var productInfo = await Product.findById(req.body._product);
            if (!productInfo) return res.json({ status: "false", message: "Product with this id not exists" })
            const cartInfo = {
                _user: req.decoded.id,
                _store: req.body._store,
                cart: {
                    _product: req.body._product,
                    quantity: req.body.quantity,
                    total_price: productInfo.price * req.body.quantity,
                },
            }


            var product = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store, cart: { $elemMatch: { _product: cartInfo.cart._product } } });
            if (product?.cart) {

                /* product =  await Cart.findOneAndUpdate({_user:cartInfo._user,_store:cartInfo._store,cart:{$elemMatch: {_product:cartInfo.cart._product}}},{$set : { 
                     "cart.$.quantity":product.cart[0].quantity+1
                 }},{new: true, upsert: true}).lean();
                */

                return res.json({ status: "false", message: "Product is already in the cart" })

            } else {

                product = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store });
                if (!product) {
                    product = await Cart.create(cartInfo);
                    console.log(product)
                } else {
                    product.cart.push(cartInfo.cart)
                    await product.save();
                }

            }
            return res.json({ status: "success", message: "Product added to cart successfully", data: product });
        } catch (err) {
            return res.status(400).json({ data: err.message });
        }

    };

exports.removeProductFromCart = async (req, res) => {

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const cartInfo = {
            _store: req.body._store,
            _product: req.body._product,
            _user: req.decoded.id,

        }

        var product = await Cart.findOneAndUpdate({ _user: cartInfo._user, _store: cartInfo._store }, { $pull: { cart: { '_product': cartInfo._product } } }, { new: true });
        if (product?.cart) {
            product.cart.pull({ quantity: 10 })
            await product.save()
            // product.cart.id().remove();
            console.log(product)
        }
        return res.json({ status: "success", message: "Product removed from cart successfully", data: product });
    } catch (err) {
        return res.status(400).json({ data: err.message });
    }

}

exports.updateProductQuantity = async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const cartInfo = {
            quantity: req.body.quantity,
            _store: req.body._store,
            _product: req.body._product,
            _user: req.decoded.id,
        }
        var productInfo = await Product.findById(req.body._product);
        //var cartProduct = await Cart.aggregate([{ $unwind: '$cart'},{$match:{_user:mongoose.Types.ObjectId(cartInfo._user),_store:mongoose.Types.ObjectId(cartInfo._store),"cart._product":mongoose.Types.ObjectId(cartInfo._product)} }])
        var pQuantity = cartInfo.quantity;
        var pPrice = productInfo.price * pQuantity;
        console.log(productInfo.price)
        var product = await Cart.findOneAndUpdate({ _user: cartInfo._user, _store: cartInfo._store, cart: { $elemMatch: { _product: cartInfo._product } } }, {
            $set: {
                "cart.$.quantity": pQuantity, 'cart.$.total_price': pPrice
            }
        }, { new: true, upsert: true }).lean();
        //  var product = await Cart.findOneAndUpdate({_user:cartInfo._user,_store:cartInfo._store,cart:{$elemMatch: {_product:cartInfo._product}}},{$set:{cart: {'cart.$.quantity': cartInfo.quantity, 'cart.$.total_price':cartInfo.total_price }}},{new: true});
        if (product?.cart) {
            return res.json({ status: "success", message: "Cart updated successfully", data: product });
        }
        return res.json({ status: "false", message: "No data found", data: {} });
    } catch (err) {
        return res.status(400).json({ data: err.message });
    }
}
