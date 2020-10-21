const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const homeController = require('../controllers/api/homeController')
const productController = require('../controllers/api/productController')
const cartController = require('../controllers/api/cartController')
const categoryController = require('../controllers/api/categoryController')
const orderController = require('../controllers/api/orderController')
const settingController = require('../controllers/api/settingController');
const shoppingController = require('../controllers/api/shoppinglistController');
const storeController = require('../controllers/api/storeController');
const departmentController = require('../controllers/api/departmentController');
const userController = require('../controllers/api/userController');
const wishController = require('../controllers/api/wishlistController')

const verifyjwt = require('../middlewares/tokenVerification');


const storeValidation = [
    body('name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('contact_no').not().isEmpty().trim().escape(),
    verifyjwt.checkToken
]

const storeLocationValidation = [
   
    body('zipcode').not().isEmpty().trim().escape(),
    body('lat').not().isEmpty().trim().escape(),
    body('long').not().isEmpty().trim().escape(),
    
]

const storeNearByValidation = [
    body('lat').not().isEmpty().trim().escape(),
    body('long').not().isEmpty().trim().escape()
];

const categoryValidation = [
    body('name').not().isEmpty().trim().escape()
]

const cartValidation = [
    body('_product').not().isEmpty().trim().escape().withMessage('_product should not be empty'),
    body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
    body('quantity').not().isEmpty().withMessage('cart_price should not be empty'),
]

const removeProductValidation = [
    body('_product').not().isEmpty().trim().escape().withMessage('_product should not be empty'),
    body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
]

const productValidation = [
    body('sku').not().isEmpty().trim().escape(),
    body('en_name').not().isEmpty().trim().escape(),
    body('es_name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('valid_from').not().isEmpty().trim().escape(),
    body('valid_till').not().isEmpty().trim().escape()
]

const settingValidation = [
    body('key').not().isEmpty().trim().escape()
]

const shoppinglistValidation = [
    body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
    body('name').not().isEmpty().trim().escape().withMessage('name should not be empty')
]

const getListValidation = [
       body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
   ]

const updateListValidation = [
    body('_shoppinglist').not().isEmpty().trim().escape().withMessage('_shoppinglist should not be empty'),
    body('_product').not().isEmpty().trim().escape().withMessage('_product should not be empty'),
    body('quantity').not().isEmpty().trim().escape().withMessage('quantity should not be empty')   
]

const userValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Should be an email'),
    body('first_name').not().isEmpty().trim().escape().withMessage('first_name should not be empty'),
    body('last_name').not().isEmpty().trim().escape().withMessage('last_name should not be empty'),
    body('contact_no').not().isEmpty().trim().escape().withMessage('contact_no should not be empty'),
    
]

const authValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').not().isEmpty().trim().escape()
]

const wishlistValidation = [
    body('_product').not().isEmpty().trim().escape().withMessage('_product should not be empty'),
    body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
    body('wish_price').not().isEmpty().trim().escape().withMessage('wish_price should not be empty'),
    body('max_price').not().isEmpty().trim().escape().withMessage('max_price should not be empty'),
]

const listProductsVali = [
        body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
]


/*--- user ---*/
router.post('/user/create',userValidation,userController.create);
router.get('/user/list', userController.list);
router.post('/user/authenticate', authValidation, userController.authenticate);
router.put('/user/update/:id',verifyjwt.checkToken,userController.updateProfile);
router.get('/user/:id', verifyjwt.checkToken,userController.getUser);


/*--- home ---*/
router.get('/app/dashboard/:storeid', homeController.dashboard);

/*---- product ---*/
router.post('/product/create', verifyjwt.checkToken, productValidation, productController.create);
router.get('/product/list',productController.list);
router.get('/product/:id',productController.show);
router.delete('/product/:id/delete', verifyjwt.checkToken, productController.delete);
router.put('/product/:id/update',  verifyjwt.checkToken,productValidation, productController.update);


/*---- cart ---*/

router.post('/cart/add_product', verifyjwt.checkToken,cartValidation,cartController.addPoductToCart);
router.get('/cart/products/:store', verifyjwt.checkToken, cartController.listCartProduct);
router.delete('/cart/remove_product', verifyjwt.checkToken,removeProductValidation, cartController.removeProductFromCart);
router.put('/cart/update_quantity', verifyjwt.checkToken, cartValidation,cartController.updateProductQuantity);


/*--- product category ---*/
router.post('/category/create', verifyjwt.checkToken,categoryValidation, categoryController.create);
router.get('/category/:id/products', verifyjwt.checkToken, categoryValidation, categoryController.productsByCategory);
router.get('/category/list',verifyjwt.checkToken,categoryController.list);
router.delete('/category/:id/delete', verifyjwt.checkToken, categoryController.delete);
router.put('/category/:id/update',verifyjwt.checkToken, categoryValidation, categoryController.update);
router.get('/category/:id', verifyjwt.checkToken, categoryController.show);

/*--- order ---*/
router.post('/order/create',verifyjwt.checkToken, orderController.creatOrder);
router.get('/orders/:storeid',verifyjwt.checkToken, orderController.listOrders)

/*--- settings ---*/
router.post('/setting/add', settingValidation, settingController.add);
router.get('/setting/list',settingController.list);

/*---- shoppinglist ----*/

router.post('/shoppinglist/add_product', verifyjwt.checkToken, updateListValidation, shoppingController.addProductToshoppinglist);
router.post('/shoppinglist/create',verifyjwt.checkToken,shoppinglistValidation, shoppingController.createShoppingList);
router.post('/shoppinglist',verifyjwt.checkToken,getListValidation,shoppingController.allShoppingLists);
router.delete('/shoppinglist/remove_product/:shoppinglistid',verifyjwt.checkToken,shoppingController.deleteProductFromShoppinglist)
router.patch('/shoppinglist/product/quantity',shoppingController.updateShoppinglist);
router.get('/shoppinglist/:shoplist/products', verifyjwt.checkToken,shoppingController.shoppinglistProducts)
router.delete('/shoppinglist/:id/remove',verifyjwt.checkToken,shoppingController.deleteShoppinglist);

/*---- store ----*/
router.get('/departments', departmentController.list);
router.post('/store/create', storeController.create);
router.get('/store/list',storeController.list);
router.get('/store/zipcode/:zipcode',storeController.getStoreByZipcode);
router.post('/store/nearby/stores', storeNearByValidation,storeController.nearByStores);
router.put('/store/:id/update', storeValidation, storeController.updateStore);
router.delete('/store/:id/delete', verifyjwt.checkToken,storeController.deleteStore);
router.get('/store/:id',storeController.show);


/*----wishlist ---*/
router.post('/wishlist/add_product',  verifyjwt.checkToken,wishlistValidation, wishController.addPoductToWishlist);
router.post('/wishlist/products',  verifyjwt.checkToken,listProductsVali, wishController.allWishlistProducts);
router.delete('/wishlist/remove/product', wishController.deleteProductWishlist);

module.exports = router;