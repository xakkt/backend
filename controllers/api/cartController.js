const Cart = require('../../models/cart')
const Product = require('../../models/product');
var moment = require('moment');
const { validationResult } = require('express-validator');

exports.listCartProduct = async (req, res) => { 
    
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try{
        const cartInfo = {
            _user: req.decoded.id, 
            _store: req.params.store,
           }
        console.log(req.params.store)
        var products = await Cart.find({_user:cartInfo._user,_store:cartInfo._store}).lean();
        if(!products.length) return res.json({ message: "No product found", data:""});
        return res.json({status: "success", message: "All cart products", data: products});

    }catch(err){
        return res.status(400).json({data: err.message});
    }
},

exports.addPoductToCart = async (req, res) => { 

    const errors = await validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
                }
                
				try{
                    var productInfo = await Product.findById(req.body._product);

					const cartInfo = {
						_user: req.decoded.id, 
                        _store: req.body._store,
                        cart: {
                            _product: req.body._product,
                            quantity: req.body.quantity,
                            total_price: productInfo.price*req.body.quantity,
                        },
                 }
             
                
                console.log(productInfo.price);
                var product = await Cart.findOne({_user:cartInfo._user,_store:cartInfo._store,cart:{$elemMatch: {_product:cartInfo.cart._product}}});
                if(product?.cart){
                    
                    product =  await Cart.findOneAndUpdate({_user:cartInfo._user,_store:cartInfo._store,cart:{$elemMatch: {_product:cartInfo.cart._product}}},{$set : { 
                        "cart.$.quantity":product.cart[0].quantity+1
                    }},{new: true, upsert: true}).lean();
                   
                    
                }else{
                    
                    product = await Cart.findOne({_user:cartInfo._user,_store:cartInfo._store}); 
                    if(!product) {
                            product = await Cart.create(cartInfo);
                            console.log(product)
                        }else{
                            product.cart.push(cartInfo.cart)
                            await product.save();
                        }
                  
                }
           		return res.json({status: "success", message: "Product added to cart successfully", data: product});
			}catch(err){
					return res.status(400).json({data: err.message});
				}				
					
			}; 

exports.removeProductFromCart = async(req,res)=>{
   
    const errors = await validationResult(req);
				if (!errors.isEmpty()) {
					return res.status(400).json({ errors: errors.array() });
                }
    try{            
        const cartInfo = {
            _store:req.body._store,
            _product:req.body._product,
            _user:req.decoded.id,
            
        }
   
	    var product = await Cart.findOneAndUpdate({_user:cartInfo._user,_store:cartInfo._store},{$pull:{cart: { '_product': cartInfo._product }}},{new: true});
                if(product?.cart){
                    product.cart.pull({quantity:10})
                    await product.save()
                   // product.cart.id().remove();
                    console.log(product)
                }
                return res.json({status: "success", message: "Product removed from cart successfully", data: product});
    }catch(err){
                return res.status(400).json({data: err.message});
        }            
	
}

exports.updateProductQuantity = async(req,res) => {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try{            
            const cartInfo = {
                _store:req.body._store,
                _product:req.body._product,
                _user:req.decoded.id,
                quantity:req.body.quantity,
                total_price:req.body.total_price
            }
           var product =  await Cart.findOneAndUpdate({_user:cartInfo._user,_store:cartInfo._store,cart:{$elemMatch: {_product:cartInfo._product}}},{$set : { 
                "cart.$.quantity":cartInfo.quantity, 'cart.$.total_price':cartInfo.total_price
            }},{new: true, upsert: true}).lean();
          //  var product = await Cart.findOneAndUpdate({_user:cartInfo._user,_store:cartInfo._store,cart:{$elemMatch: {_product:cartInfo._product}}},{$set:{cart: {'cart.$.quantity': cartInfo.quantity, 'cart.$.total_price':cartInfo.total_price }}},{new: true});
            if(product?.cart){
                return res.json({status: "success", message: "Cart updated successfully", data: product});
            }
            return res.json({status: "false", message: "No data found", data: {}});
        }catch(err){
            return res.status(400).json({data: err.message});
        }
}
