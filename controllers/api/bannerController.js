const Banner = require('../../models/banner');
const StoreProductPricing = require('../../models/store_product_pricing');
var moment = require('moment')

exports.bannderproduct = async (req, res) => {

    try {
        var date = moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        let store = await StoreProductPricing.find({$and: [
            { _store: req.body._store },
            { _deal: req.body._deal },
            { deal_start:{$lte:date} },{ deal_end:{$gte:date} }
          ],  }).populate('_product').lean()
        if (!store.length) return res.json({ status: false, message: "Data not found" })
        return res.json({ status: true, message: "Listing", data: store })

    } catch (err) {
        return res.status(404).json({ status: false, message: err })

    }
}