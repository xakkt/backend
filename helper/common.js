
const Wishlist = require('../models/wishlist')
const Shoppinglist = require('../models/shoppinglist')
const ShoppinglistName = require('../models/shoppinglist_name')
const Cart = require('../models/cart')
const StoreProductPricing = require('../models/store_product_pricing')
const Roles = require('../models/role')
const Permission = require('../models/permission')
 var moment = require('moment')
var mongoose = require('mongoose');

exports.cartProducts = async (userid, storeid) => {
    cartProductList = [];
    var cartProducts = await Cart.aggregate([{ $unwind: '$cart' }, { $match: { _user: mongoose.Types.ObjectId(userid), _store: mongoose.Types.ObjectId(storeid) } }])

    cartProducts.map(product => {
        cartProductList[product.cart._product] = product.cart.quantity
    })
    console.log(cartProductList)
    return cartProductList;

}

exports.wishList = (userid, storeid) => {
    var wishlistids = [];
   
    return new Promise(async (resolve, reject) => {
        let wishlist = await Wishlist.find({ _user: userid, _store: storeid }, '_product').lean();
         wishlist.map(data => {
             wishlistids.push(data._product.toString())
         })
        if(wishlist){
            return resolve(wishlistids)
        } else {
            return reject('Error')
        }
    })

    // console.log('here', wishlistids)
    // return wishlistids;

}

exports.shoppingList = async (userid, storeid) => {
    var shoppinglistids = []
    var shoppinglistProductIds = []
    let allShoppinglist = await ShoppinglistName.find({ _user: userid, _store: storeid }, '_id').exec();
    allShoppinglist.map(data => {
        shoppinglistids.push(data._id)
    })
    let listProducts = await Shoppinglist.find({ _shoppinglist: { $in: shoppinglistids } }, '_product').lean()

    listProducts.map(data => {
        shoppinglistProductIds.push(data._product.toString())
    })

    return shoppinglistProductIds;

}
exports.productprice = async (storeid,productid) =>{
   
    let store =  await StoreProductPricing.findOne({_store:storeid,_product:productid}).select('-createdAt -updatedAt -__v -_product -_store -_deal' ).lean()
    var enddate = moment(store.deal_end).format('L')
    var now = moment().format('L');
    if(now <= enddate)
    {
        store.effective_price = store.deal_price
    }else
    {
        store.deal_price = 0,
        store.effective_price = store.regular_price
    }
    return store


}
exports.permission =  (value) => {
    return async(req,res,next) =>{
      const role =  await Roles.findOne({name:value,_id:req.session.roleid}).exec()
      if(role) return next()
      const permission =await Permission.findOne({name:value, _roles: { $in: req.session.roleid }},{}).exec()
       if(!permission)return res.json({status:false,message:"You are not allowed for this route"})
      next()
    }
}
exports.role =  async (value) =>{
    try{
   let role =  await Roles.findOne({name:value}).select(" -description -createdAt -updatedAt -name -_permission -__v").exec()
   if(!role) return res.json({message:"Data not found",data:""})
   return res.json({data:role,message:"Data found"})
    }catch(err)
    {
        return res.status(400).json({error:err.message})

    }
}