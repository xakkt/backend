const Wishlist = require('../models/wishlist')
const Device = require('../models/device')

const mongoose = require('mongoose');

exports.wishlist = async (_store, product, price) => {
    let filter = {
        _product: product,
        _store: _store,
        wish_price: { $gte: price }
    }
    try {
        let list = await Wishlist.find(filter).exec()
        let device = await Device.find({ device_id: "test1" }).exec()
        console.log("--logss", device)
    } catch (err) {
        console.log('error---------', err)
    }


}