const Role = require('../../models/role');
const User = require('../../models/user');
const StoreProductPricing = require('../../models/store_product_pricing');
const Order = require('../../models/order');
// const moment = require('moment')
var moment = require('moment-timezone');
const { validationResult } = require('express-validator');
var moment = require('moment')

exports.dashboard = async (req, res) => {
    try {
        // let ip = req.ip

        // let ip = req.connection.remoteAddress;
        // console.log("client IP is *********************" + ip);
        let order =  await Order.find({'shipping.tracking.status':"pending"}).lean()
        var date = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        let user = await User.countDocuments().lean();
        let deal = await StoreProductPricing.find({ $and: [{ deal_start: { $lte: date } }, { deal_end: { $gte: date } }] }).lean();
        var filtered = deal.filter(function (a) {
            if (!this[a._deal]) {
                this[a._deal] = true;
                return true;
            }
        });
        return res.render('admin/index', { menu: "dashboard", data: user, deal: filtered.filter(item => item._id).length,order:(order.length)?order.length:0 })
    } catch (err) {
        console.log("--err", err)
    }
}