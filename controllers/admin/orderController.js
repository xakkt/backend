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
            let searchString = req.query.search.value ||''
            let coupon = await Order.find({

                // coupon_code: { $regex: '.*' + searchString + '.*', $options: 'i' }
            })
                .skip((pagno - 1) * limit) //Notice here
                .limit(limit)
                .lean();
            let total = await Order.find(
                {
                    // coupon_code: { $regex: '.*' + searchString + '.*', $options: 'i' }
                }
            ).lean()
            return res.json({ draw: page, recordsTotal: total.length, recordsFiltered: total.length, data: coupon })

        }
        else {
            return res.render('admin/coupon/listing', { menu: "coupon", submenu: "list", success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
        }
        // let brand = await Brand.find().exec();
        // if (!brand.length) return res.render('admin/brand/listing', { menu: "brands", submenu: "list", brand: "", success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
        // return res.render('admin/brand/listing', { menu: "brands", submenu: "list", brand: brand, success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })


    } catch (err) {
        console.log("--err", err)
        res.status(400).json({ data: err.message });
    }
}

