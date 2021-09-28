const Order = require('../../models/order')
const User = require('../../models/user')
var moment = require('moment');
const { validationResult } = require('express-validator');
const orderid = require('order-id')(process.env.ORDER_SECRET);
const _time = require('../../helper/storetimezone')
const mongoose = require('mongoose')
const _global = require('../../helper/common')

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
       await _time.store_time(req.params.storeid)
        var orders = await Order.find(orderInfo).populate('_store','name').lean({ getters: true });

        if (!orders.length) return res.json({ message: "No Order found", data: "" });
        return res.json({ status:1, message: "Order Listing", data:orders});

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
        return res.json({ status:1, message: "", data:order});

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
        return res.json({ status: 1, message: "", data:order});
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
        return res.json({ status:1, message: "", data:order});

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

        var user = await User.findOne({_id:req.decoded.id},{ address: { $elemMatch: { _id: mongoose.Types.ObjectId(req.body.address) } } }).lean()
       
        if(user.address===undefined){  return res.json({status:0, message:'address not found'}) }
            delete  user.address[0]._id
            var address = {...user.address[0]}

            var product = []
            await Promise.all(req.body.products.map(async (element) => {
				
				var data = {}
				var productId = element._product;
				var productPrice = await _global.productprice(req.body._store, productId)

				if(productPrice){
                                    data = {
                                            ...data,
                                            _product:productId,
                                            quantity:element.quantity,
                                            deal_price: productPrice.deal_price,
                                            regular_price: productPrice.regular_price
                                           }
                                           
					
                                    }else{
                                        data = {
                                            ...data,
                                            _product:productId,
                                            quantity:element.quantity,
                                            deal_price: 0,
                                            regular_price: 0
                                        }
                                    }
                                    product.push(data)
                            }))
                            
                            var orderInfo = {
                                _user: req.decoded.id,
                                _store: req.body._store,
                                shipping: {
                                    address: address,
                                    delivery_notes: req.body.delivery_notes??null,
                                    order_id: orderid.generate()
                                },
                
                                payment: {
                                    method: req.body.payment_method,
                                   // transaction_id: req.body.payment.transaction_id
                                },
                                products:product,
                                total_cost:req.body.total_cost
                            }
                            
            var order = await Order.create(orderInfo);
           
           return res.json({ status: 1, message: "Order created", data: {order_id:order.order_id} });
        } catch (err) {
            console.log("---value",err)
            return res.status(400).json({ data: err.message });
        }

    };
exports.myorder = async (req,res) =>{
    try {
        var order = await Order.find({_user: req.decoded.id},).select('-feedback').populate({
            path:'products._product',
            select:'name description _category weight _unit image quantity',
            populate:{
                path:'_unit',
                select:'name'
            }
        }).populate('_store','name').lean({ getters: true });

        order.map((element) => {
           
            for (const [i,product] of element.products.entries()) {
                delete(product._id)
                product._id = product._product._id
                product.name = product._product.name
                product.description = product._product.description
                product._category = product._product._category
                product.weight = product._product.weight
                product._unit = product._product._unit
                product.image = product._product.image
                /*product._product.deal_price= product.deal_price
                product._product.regular_price= product.regular_price*/

                delete(product._product)
                
            }
       })

        // console.log(order)
        if (!order.length) return res.json({ message: "No Order found", data: "" });
        return res.json({ status: 1, message: "", data:order});

    } catch (err) {
        return res.status(400).json({ data: err.message });
    }
}