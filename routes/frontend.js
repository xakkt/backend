const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
var bodyParser = require('body-parser');
const _global = require('../helper/common')
var isloggedin = require('../middlewares/isloggedin')

const IndexController = require('../controllers/frontend/indexController')
const AuthController = require('../controllers/frontend/authController')
const StoreController = require('../controllers/frontend/storeController')
const cartController = require('../controllers/frontend/cartController')
const categoryController = require('../controllers/frontend/categoryController')

const userValidation = [
    body('email').not().isEmpty().trim().escape().withMessage('Email should not be empty'),
    body('email').isEmail().withMessage('Should be an email'),
    body('first_name').not().isEmpty().trim().escape().withMessage('first_name should not be empty'),
    body('contact_no').not().isEmpty().trim().escape().withMessage('Contact no should not be empty'),
    body('password').not().isEmpty().trim().escape().withMessage('Password should not be empty'),
    body('dob').not().isEmpty().trim().escape().withMessage('Date of birth should not be empty'),
]

const userLoginValidation = [
    body('email').not().isEmpty().trim().escape().withMessage('Email should not be empty'),
    body('email').isEmail().withMessage('Should be an email'),
    body('password').not().isEmpty().trim().escape().withMessage('Password should not be empty'),
   
]

const cartValidation = [
    body('_product').not().isEmpty().trim().escape().withMessage('_product should not be empty'),
    body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
    body('quantity').not().isEmpty().withMessage('cart_price should not be empty'),
]

router.use(function(req,res,next){
    res.locals.userEmail =(req.session?.customer) ?? null;
    res.locals.userid =(req.session?.userid) ?? null;
    next();
})
/*-------- validation -------------*/

router.get('/product/:id',IndexController.list)
router.post('/cookie',IndexController.cookie)
router.get('/cookiees',IndexController.cookiees)

router.post('/user/create',userValidation,AuthController.create)
router.post('/user/login',userLoginValidation,AuthController.login)
router.get('/user/logout',AuthController.logout)

/*------------ User ---------*/
router.get('/',StoreController.homepage)
router.get('/products/:slug',StoreController.products)
router.post('/product/add-to-cart',cartValidation,cartController.addPoductToCart)
router.get('/checkout',function(req, res){
    return res.render('frontend/checkout')
})
router.get('/myorders',function(req, res){
    return res.render('frontend/order-listing')
})
router.get('/:store/category/products/:category',categoryController.categoryProducts)
router.get('/:store/main-category/products/:category',categoryController.productbyParentCategory)
router.get('/cart',function(req, res){
    return res.render('frontend/cart')
})

router.post('/products/cart',cartController.cartProducts)
module.exports = router;