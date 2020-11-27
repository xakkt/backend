const Banner = require('../../models/banner');
const StoreProductPricing = require('../../models/store_product_pricing');
var moment = require('moment')
const _global = require('../../helper/common');
const _time = require('../../helper/storetimezone')

exports.bannderproduct = async (req, res) => {

    try {
        var storePrice = []
        await _time.store_time(req.body._store)
        var date = moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        console.log("---value",date)
        let store = await StoreProductPricing.find({
            $and: [
                { _store: req.body._store },
                { _deal: req.body._deal },
                { deal_start: { $lte: date } }, { deal_end: { $gte: date } }
            ],
        }).populate('_product').select(' -deal_percentage -createdAt -updatedAt').lean()
        await Promise.all(store.map(async (element) => {
            var data = {}
            var _store = element._store
            var _product = element._product._id
            let productPrice = await _global.productprice(_store, _product)
            data = { ...element }
            if (productPrice) {
                data._product.image = `${process.env.BASE_URL}/images/products/${element._product.image}`,
                data._product.regular_price = productPrice.regular_price
                data._product.deal_price = productPrice.deal_price
            }
            delete (data.deal_price)
            storePrice.push(data)
        }))
        if (!store.length) return res.json({ status: false, message: "Data not found" })
        return res.json({ status: true, message: "Listing", data: storePrice })

    } catch (err) {
        return res.status(404).json({ status: false, message: err })

    }
}