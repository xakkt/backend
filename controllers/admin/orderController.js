const Department = require('../../models/department');
const Order = require('../../models/order');

const { validationResult } = require('express-validator');
var moment = require('moment-timezone');


exports.listing = async (req, res) => {

    try {
        if (req.query.length) {
            var pagno = req.query.start / req.query.length + 1
            var page = parseInt(req.query.draw) || 1; //for next page pass 1 here
            var limit = parseInt(req.query.length) || 5;
            let searchString = req.query.search.value || ''
            let order = await Order.find({

                // coupon_code: { $regex: '.*' + searchString + '.*', $options: 'i' }
            }).populate('_store')
                .skip((pagno - 1) * limit) //Notice here
                .limit(limit)
                .lean();
            let total = await Order.find(
                {
                    // coupon_code: { $regex: '.*' + searchString + '.*', $options: 'i' }
                }
            ).lean()
            console.log("--order")
            return res.json({ draw: page, recordsTotal: total.length, recordsFiltered: total.length, data: order })

        }
        else {
            return res.render('admin/order/listing', { menu: "orders", submenu: "list", success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
        }


    } catch (err) {
        console.log("--err", err)
        res.status(400).json({ data: err.message });
    }
}
exports.edit = async (req, res) => {
    let order = await Order.findOne({ _id: req.params.id }).populate('_user').lean();
    return res.json({ status: true, data: order })
}
exports.update = async (req, res) => {
    try{
        console.log("--rowwww",req.params.id)
    let order = await Order.findOneAndUpdate({ _id: req.params.id },
       { $set:{
           'shipping.tracking.status':req.body.status
       }
    }).lean();
    return res.json({status:true})
    }catch(err)
    {
        console.log('------',err)

    }

}