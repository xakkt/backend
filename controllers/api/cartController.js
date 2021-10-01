const Cart = require('../../models/cart')
const Product = require('../../models/product');
const { validationResult } = require('express-validator');
const _global = require('../../helper/common');

exports.listCartProduct = async (req, res) => {
     var product_list = []
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status:0, errors: errors.array() });
    }

    try {
        const cartInfo = {
            _user: req.decoded.id,
            _store: req.params.store,
        }

        var data = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store }).populate({
                                                                                                path:'cart._product', 
                                                                                                select:'name sku price image _unit weight',
                                                                                                populate:{
                                                                                                          path:'_unit',
                                                                                                          select: 'name' 
                                                                                                          }
                                                                                                }).lean();
        if (!data) return res.json({ status: 0, message: "cart is empty", data: "" });
        let total_quantity, total_price, coupon, discounted_price;
        total_quantity = data.cart.map(product => product.quantity).reduce(function (acc, cur) {
            return acc + cur;
        })

        total_price = data.cart.map(product => product.total_price).reduce(function (acc, cur) {
            return acc + cur;
        })

       await Promise.all(products = data.cart.map(async(list) => {
             console.log("---product",list)
            var data ={}
            if (!list._product) return
             let product_price = await  _global.productprice(req.params.store,list._product._id)
            let image_path = (list._product.image) ? list._product.image : 'not-available-image.jpg';
            let image = `${process.env.BASE_URL}/images/products/${image_path}`;
            let total_price = list.total_price;
            let quantity = list.quantity;
            let unit = list._product._unit.name
            delete(list._product._unit)
            delete (list.total_price)
            delete (list.quantity)
            delete(list.price)
            data = { ...list, _product: { ...list._product, in_cart: quantity, total_price: total_price.toFixed(2), image:image,unit:unit,regular_price:product_price.regular_price,deal_price:product_price.deal_price} }
            product_list.push(data)
        })
       )
        data.cart = product_list;
        discounted_price = 20;
        coupon = {
            code: 'AZXPN102',
            discount: '20%'
        }
        return res.json({ status: 1, message: "All cart products", data: data, subtotal: { in_cart: total_quantity, price: total_price.toFixed(2), shipping_cost: "100.00", sub_total: total_price.toFixed(2) } });

    } catch (err) {
        return res.status(400).json({ status:0, data: err.message });
    }
},

exports.cartSize = async (req, res) => {
 
   const errors = await validationResult(req);
   if (!errors.isEmpty()) {
       return res.status(400).json({ status:0, errors: errors.array() });
   }

   try {
       const cartInfo = {
           _user: req.decoded.id,
           _store: req.params.storeid,
       }

       var data = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store }).lean();

       if (!data) return res.json({ status: 0, message: "cart is empty", data: "" });
       let total_quantity;
        total_quantity = data.cart.map(product => product.quantity).reduce(function (acc, cur) {
            return acc + cur;
        })

        return res.json({ status: 1, message: "total products in the cart", data: { total_products: total_quantity}});
   } catch (err) {
       return res.status(400).json({ status:0, data: err.message });
   }
},


exports.addPoductToCart = async (req, res) => {

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        var productInfo = await Product.findById(req.body._product);
        let productprice = await _global.productprice(req.body._store, req.body._product)
        if (!productprice) return res.json({ status: 0, message: "Product Price of this id not set yet" })
        if (!productInfo) return res.json({ status: 0, message: "Product with this id not exists" })
        const cartInfo = {
            _user: req.decoded.id,
            _store: req.body._store,
            cart: {
                _product: req.body._product,
                quantity: req.body.quantity,
                total_price: productprice.effective_price * req.body.quantity,
            },
        }


        var product = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store, cart: { $elemMatch: { _product: cartInfo.cart._product } } });
        if (product?.cart) {
            return res.json({ status: 0, message: "Product is already in the cart" })
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
        var prod = product.toObject();
        var total_products = 0
        product = prod.cart.map(data => {
            data.in_cart = data.quantity;
            total_products += data.quantity
            delete (data.quantity)
            return data;
        })
        
        return res.json({ status: 1, message: "Product added to cart successfully", data: product, total_products: total_products });
    } catch (err) {
        console.log("--errr", err)
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
        var data = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store }).populate('cart._product', 'name sku price image').lean();
        if (!data) return res.json({ success: 0, message: "cart is empty", data: "" });

        let total_quantity, total_price, coupon, discounted_price;

        total_quantity = data.cart.map(product => product.quantity).reduce(function (acc, cur) {
            return acc + cur;
        })

        total_price = data.cart.map(product => product.total_price).reduce(function (acc, cur) {
            return acc + cur;
        })

        products = data.cart.map((list) => {
            if (!list._product) return
            let image_path = (list._product.image) ? list._product.image : 'not-available-image.jpg';
            let image = `${process.env.BASE_URL}/images/products/${image_path}`;
            let total_price = list.total_price;
            let quantity = list.quantity;
            delete (list.total_price)
            delete (list.quantity)
            return { ...list, _product: { ...list._product, in_cart: quantity, total_price: total_price.toFixed(2), image: image } }
        })
        data.cart = products;
        discounted_price = 20;
        coupon = {
            code: 'AZXPN102',
            discount: '20%'
        }
        return res.json({ status: 1, message: "Product removed", data: data, subtotal: { quantity: total_quantity, price: total_price.toFixed(2), shipping_cost: "100.00", coupon: coupon, sub_total: total_price.toFixed(2) } });
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
        let productprice = await _global.productprice(req.body._store, req.body._product)
        if (!productInfo) return res.json({ success: 0, message: "cart is empty", data: "" });
        //var cartProduct = await Cart.aggregate([{ $unwind: '$cart'},{$match:{_user:mongoose.Types.ObjectId(cartInfo._user),_store:mongoose.Types.ObjectId(cartInfo._store),"cart._product":mongoose.Types.ObjectId(cartInfo._product)} }])
        var pQuantity = cartInfo.quantity;
        var pPrice = productprice.effective_price * pQuantity;
        console.log("--vlaue", pPrice)
        // console.log(productInfo.price)
        var product = await Cart.findOneAndUpdate({ _user: cartInfo._user, _store: cartInfo._store, cart: { $elemMatch: { _product: cartInfo._product } } }, {
            $set: {
                "cart.$.quantity": pQuantity, 'cart.$.total_price': pPrice
            }
        }, { new: true, upsert: true }).lean();
        //  var product = await Cart.findOneAndUpdate({_user:cartInfo._user,_store:cartInfo._store,cart:{$elemMatch: {_product:cartInfo._product}}},{$set:{cart: {'cart.$.quantity': cartInfo.quantity, 'cart.$.total_price':cartInfo.total_price }}},{new: true});
        if (product?.cart) {
            var data = await Cart.findOne({ _user: cartInfo._user, _store: cartInfo._store }).populate('cart._product', 'name sku price image').lean();
            if (!data) return res.json({ success: 0, message: "cart is empty", data: "" });

            let total_quantity, total_price, coupon, discounted_price;

            total_quantity = data.cart.map(product => product.quantity).reduce(function (acc, cur) {
                return acc + cur;
            })

            total_price = data.cart.map(product => product.total_price).reduce(function (acc, cur) {
                return acc + cur;
            })

            products = data.cart.map((list) => {
                if (!list._product) return
                let image_path = (list._product.image) ? list._product.image : 'not-available-image.jpg';
                let image = `${process.env.BASE_URL}/images/products/${image_path}`;
                let total_price = list.total_price;
                let quantity = list.quantity;
                delete (list.total_price)
                delete (list.quantity)
                return { ...list, _product: { ...list._product, in_cart: quantity, total_price: total_price.toFixed(2), image: image } }
            })
            data.cart = products;
            discounted_price = 20;
            coupon = {
                code: 'AZXPN102',
                discount: '20%'
            }
            return res.json({ status: 1, message: "Product Update", data: data, subtotal: { quantity: total_quantity, price: total_price.toFixed(2), shipping_cost: "100.00", sub_total: total_price.toFixed(2) } });
        }
        return res.json({ status:0, message: "No data found", data: {} });
    } catch (err) {
        console.log("--err", err)
        return res.status(400).json({ data: err.message });
    }
}

exports.makeCartEmpty = async (req, res) => {
    
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let remove = await Cart.deleteOne({  _user: req.decoded.id,_store:req.params.storeid }).exec()
        if (!remove) return res.json({ status: false })
        return res.json({ status: true, message:"Cart is empty now"})
    }catch (err) {
        res.send(err)
    }

}

