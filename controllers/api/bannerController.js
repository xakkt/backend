const Banner = require('../../models/banner');
const StoreProductPricing = require('../../models/store_product_pricing');
var moment = require('moment')
const _global = require('../../helper/common');

exports.bannderproduct = async (req, res) => {

    try {
        var storePrice = []
        var date = moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        let store = await StoreProductPricing.find({$and: [
            { _store: req.body._store },
            { _deal: req.body._deal },
            { deal_start:{$lte:date} },{ deal_end:{$gte:date} }
          ],  }).populate('_product').select(' -deal_start -deal_end -deal_percentage -createdAt -updatedAt').lean()
       await Promise.all(store.map( async (element) =>{
        var data = {}
          var _store = element._store
          var _product = element._product._id
          let productPrice =   await _global.productprice(_store, _product)
          console.log("---pro",productPrice)
          data = { ...element}
           if(productPrice)
           {
               data._product.regular_price = productPrice.regular_price
               data._product.deal_price = productPrice.deal_price

           }
           delete(data.deal_price)
           storePrice.push(data)
        }))
        if (!store.length) return res.json({ status: false, message: "Data not found" })
        return res.json({ status: true, message: "Listing", data: storePrice })

    } catch (err) {
        return res.status(404).json({ status: false, message: err })

    }
}