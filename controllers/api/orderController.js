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

exports.orderDetails = async (req, res) => {

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        var order = await Order.findById(req.params.orderid).lean();
        console.log(order)
        if (!order) return res.json({ message: "No Order found", data: "" });
        return res.json({ status: "success", message: "", data:order});

    } catch (err) {
        return res.status(400).json({ data: err.message });
    }
},

exports.rateOrder = async(req, res) => {
    
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        var order = await Order.findByIdAndUpdate(req.params.orderid,{ $set :{ "feedback.rating":req.body.rating,"feedback.comment":req.body.comment} },{new:true}).lean();
        if (!order) return res.json({ message: "No Order found", data: "" });
        return res.json({ status: "success", message: "", data:order});
    }catch (err){
        return res.status(400).json({ data: err.message });
    }
}

exports.updateOrderStatus = async (req, res) => {

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        var order = await Order.findByIdAndUpdate(req.params.orderid,{ $set :{ "shipping.tracking.status":req.body.status} },{new:true}).lean();
        console.log(order)
        if (!order) return res.json({ message: "No Order found", data: "" });
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
                        company: req.body.tracking.company,
                        tracking_number: req.body.tracking.tracking_number,
                        status: req.body.tracking.status,
                        estimated_delivery: req.body.tracking.estimated_delivery
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
exports.myorder = async (req,res) =>{
    try {
        var order = await Order.find({_user: req.decoded.id}).lean();
        // console.log(order)
        if (!order.length) return res.json({ message: "No Order found", data: "" });
        return res.json({ status: "success", message: "", data:order});

    } catch (err) {
        return res.status(400).json({ data: err.message });
    }
}