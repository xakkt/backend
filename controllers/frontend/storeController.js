const Department = require('../../models/department');
const Store = require('../../models/store');
const Categories = require('../../models/product_category')
const Brands = require('../../models/brand')
const StoreProductPricing = require('../../models/store_product_pricing')
const ProductRegularPricing = require('../../models/product_regular_pricing')
const _global = require('../../helper/common')

exports.homepage = async (req, res) => {
  let stores =   await Store.find().lean();
   if(stores) return res.render('frontend/index',{data:req.session.customer,stores:stores})
}

exports.products = async (req, res) => {
  var storess = []
  var productId = []

  let currency = await Store.findById(req.params.storeid).select('_currency').populate('_currency','name').lean();
  
  let stores = await StoreProductPricing.find({
    '_store': req.params.storeid
  }).select('-createdAt -updatedAt -__v').populate('_product', 'name image sku').populate('_deal').lean()

  if (stores.length) {
    stores.map((item) => {
      productId.push(item._product._id)
    })
  }
  let regular = await ProductRegularPricing.find({
    _store: req.params.storeid,
    _product: {
      $nin: productId
    }
  }).populate('_product')


  if (stores.length >0) {
      
    await Promise.all(stores.map(async (store) => {
      var data = {}
       let prices = await _global.productprice(req.params.storeid, store._product)
      _product = store._product,
        _deal = store._deal
      delete store._product;
      delete store._deal;
      data = {
        ...store,
        _product: _product._id,
        name: _product.name,
        regular_price: prices.regular_price,
        image: `${process.env.BASE_URL}/images/products/${_product.image}`,
        sku: _product.sku,
        currency: currency._currency.name,
        deal: _deal.name
      }
      storess.push(data)

    }))
  }

  regular.filter((item) => {

    let regularData = {
      _product: item._product._id,
      _store: item._store,
      image: `${process.env.BASE_URL}/images/products/${item._product.image}`,
      sku: item._product.sku,
      name: item._product.name,
      deal_price: 0,
      regular_price: item.regular_price,

    }
    storess.push(regularData)
  })
  let categories = await Categories.find().lean()
  let brands = await Brands.find().lean()
   return res.render('frontend/products',{data:req.session.customer,categories:categories, brands:brands, products:storess})
}

