const Order = require('../../models/order')
var moment = require('moment');
const { validationResult } = require('express-validator');
const orderid = require('order-id')(process.env.ORDER_SECRET);


exports.listOrders = async (req, res) => {

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const orderInfo = {
            _user: req.decoded.id,
            _store: req.params.storeid,
        }

        var order = await Order.find(orderInfo).lean();
        console.log(order)
        if (!order.length) return res.json({ message: "No Order found", data: "" });
        return res.json({ status: "success", message: "", data:order});

    } catch (err) {
        return res.status(400).json({ data: err.message });
    }
},

    exports.creatOrder = async (req, res) => {

        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            var orderInfo = {
                _user: req.decoded.id,
                _store: req.body._store,
                shipping: {
                    address: req.body.address,
                    city: req.body.city,
                    region: req.body.region,
                    state: req.body.state,
                    country: req.body.country,
                    delivery_notes: req.body.delivery_notes,
                    order_id: orderid.generate(),
                    tracking: {
                        company: req.body.company,
                        tracking_number: req.body.tracking_number,
                        status: req.body.status,
                        estimated_delivery: req.body.estimated_delivery
                    }
                },

                payment: {
                    method: req.body.payment.method,
                    transaction_id: req.body.payment.transaction_id
                },
                products: req.body.products
            }
            var order = await Order.create(orderInfo);
           
           return res.json({ status: "success", message: "Order created", data: order });
        } catch (err) {
            return res.status(400).json({ data: err.message });
        }

    };



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
        var orderInfo = await Product.findById(req.body._product);
        //var cartProduct = await Order.aggregate([{ $unwind: '$cart'},{$match:{_user:mongoose.Types.ObjectId(cartInfo._user),_store:mongoose.Types.ObjectId(cartInfo._store),"cart._product":mongoose.Types.ObjectId(cartInfo._product)} }])
        var pQuantity = cartInfo.quantity;
        var pPrice = orderInfo.price * pQuantity;
        console.log(orderInfo.price)
        var product = await Order.findOneAndUpdate({ _user: cartInfo._user, _store: cartInfo._store, cart: { $elemMatch: { _product: cartInfo._product } } }, {
            $set: {
                "cart.$.quantity": pQuantity, 'cart.$.total_price': pPrice
            }
        }, { new: true, upsert: true }).lean();
        //  var product = await Order.findOneAndUpdate({_user:cartInfo._user,_store:cartInfo._store,cart:{$elemMatch: {_product:cartInfo._product}}},{$set:{cart: {'cart.$.quantity': cartInfo.quantity, 'cart.$.total_price':cartInfo.total_price }}},{new: true});
        if (product?.cart) {
            return res.json({ status: "success", message: "Order updated successfully", data: product });
        }
        return res.json({ status: "false", message: "No data found", data: {} });
    } catch (err) {
        return res.status(400).json({ data: err.message });
    }
}
