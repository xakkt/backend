const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
var bodyParser = require('body-parser');
const _global = require('../helper/common')
var isloggedin = require('../middlewares/isloggedin')
const departmentController = require('../controllers/admin/departmentController')
const userController = require('../controllers/admin/userController')
const productController = require('../controllers/admin/productController')
const brandController = require('../controllers/admin/brandController')
const dealController = require('../controllers/admin/dealController')
const storeproductController = require('../controllers/admin/storeproductController')
const rpController = require('../controllers/admin/rolesnpermissionController')
const authController = require('../controllers/admin/authController')
const regularproductController = require('../controllers/admin/regularproductController')
const unitController = require('../controllers/admin/unitController')
const bannerController = require('../controllers/admin/bannerController.js')
const compController = require('../controllers/admin/compController.js')
const uploadController = require('../controllers/admin/uploadController.js')
const coupanController = require('../controllers/admin/coupanController.js')
const dashboardController = require('../controllers/admin/dashboardController.js')
const orderController = require('../controllers/admin/orderController.js')
const currencyController = require('../controllers/admin/currencyController.js')


// var auth = function(req, res, next) {
//   if (req.session.email)
//       return next();
//   else
//       return res.redirect('/admin/login')
// };

const storeController = require('../controllers/admin/storeController')
const verifyjwt = require('../middlewares/tokenVerification');
var moment = require('moment');
const path = require('path')



var multer  = require('multer')
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/images/departments');
    },
    filename: function (req, file, callback) { const img = path.basename(file.originalname,path.extname(file.originalname));
      callback(null, img.replace(' ','_').toLowerCase()+'_'+moment().unix() + path.extname(file.originalname));
    }
  });

  var userStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/images/users');
    },
    filename: function (req, file, callback) { const img = path.basename(file.originalname,path.extname(file.originalname));
      callback(null, img.replace(' ','_').toLowerCase()+'_'+moment().unix() + path.extname(file.originalname));
    }
  });
  var productStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/images/products');
    },
    filename: function (req, file, callback) { const img = path.basename(file.originalname,path.extname(file.originalname));
      callback(null, img.replace(' ','_').toLowerCase()+'_'+moment().unix() + path.extname(file.originalname));
    }
  });
  var brandStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/images/brands');
    },
    filename: function (req, file, callback) { const img = path.basename(file.originalname,path.extname(file.originalname));
      callback(null, img.replace(' ','_').toLowerCase()+'_'+moment().unix() + path.extname(file.originalname));
    }
  });
  var bannerStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/images/banners');
    },
    filename: function (req, file, callback) { const img = path.basename(file.originalname,path.extname(file.originalname));
      callback(null, img.replace(' ','_').toLowerCase()+'_'+moment().unix() + path.extname(file.originalname));
    }
  });
  var csvStorage =   multer.diskStorage({
    destination: './public/images/files',
    filename: function (req, file, callback) {
      callback(null, Date.now() + "-" + file.originalname);
    }
  });

  var upload = multer({ storage : storage})
  var userUpload = multer({storage: userStorage})
  var productUpload = multer({storage: productStorage})
  var brandUpload = multer({storage: brandStorage})
  var csvUpload = multer({storage: csvStorage})

  var bannerUpload = multer({storage: bannerStorage})


/*-------- validation -------------*/

const storeValidation = [
  body('name').not().isEmpty().trim().escape(),
  body('description').not().isEmpty().trim().escape(),
  body('contact_no').not().isEmpty().trim().escape(),
  verifyjwt.checkToken
]

router.get('/',isloggedin,dashboardController.dashboard)
// (req,res)=>{
//       res.render('admin/index',{ menu:"dashboard"}) 
// });

/*------------ User ---------*/
router.get('/users',isloggedin,userController.list)
router.get('/managers',isloggedin,userController.adminlist)
router.get('/user/create',isloggedin,userController.create);
router.post('/user/save',isloggedin,userUpload.single('profile_pic'),userController.save)
router.get('/user/delete/:userid',isloggedin, userController.delete);
router.get('/user/edit/:id',isloggedin, userController.edit);
router.post('/user/update/:id',userUpload.single('profile_pic'),isloggedin,userController.update)

/*------------- Department -------*/
router.get('/departments',isloggedin,departmentController.list)
router.get('/department/create',isloggedin,departmentController.create);
router.post('/department/save',isloggedin,upload.single('logo'),departmentController.save)
router.get('/department/delete/:id',isloggedin, departmentController.delete);
router.get('/department/edit/:id',isloggedin, departmentController.edit);
router.post('/department/update/:id',isloggedin,upload.single('logo'),departmentController.update)

/*------------- Store --------*/
// _global.permission('store_edit')
router.get('/stores',isloggedin,_global.permission('store_view'),storeController.list)
router.get('/store/create',isloggedin,_global.permission('store_add'),storeController.create)
router.post('/store/save',isloggedin,_global.permission('store_add'),storeController.saveStore)
router.get('/store/edit/:storeid',isloggedin,_global.permission('store_edit'),storeController.editStore)
router.get('/store/delete/:id',isloggedin,_global.permission('store_delete'), storeController.deleteStore);
router.post('/store/update/:id', isloggedin,_global.permission('store_edit'),storeController.updateStore)



/*------------ Products --------*/
router.get('/products',(req, res)=> {
    res.render('admin/product/listing', { menu:"products", submenu:"list" })
})
router.post('/product/delete',isloggedin, productController.product_delete)
router.post('/product/create',isloggedin,productUpload.single('logo'),_global.permission('product_add'),productController.productsave)
router.get('/product',isloggedin,_global.permission('product_view'),productController.productlisting)
router.get('/product/delete/:id',isloggedin,_global.permission('product_delete'),productController.productdelete);
router.get('/product/edit/:id',isloggedin,_global.permission('product_edit'),productController.productedit)
router.post('/product/update/:id',isloggedin,_global.permission('product_edit'),productUpload.single('logo'), productController.productupdate)
router.get('/product/pricing/:productid',isloggedin,productController.addPrice);
router.get('/product/create',isloggedin, productController.productCreate)
router.post('/product_price/create',isloggedin, productController.priceSave)
router.post('/product_price/remove',isloggedin, productController.remove)

router.get('/product/list',isloggedin,_global.permission('product_view'),productController.product_listing)

/*--------- Invoice ---------*/
router.get('/invoice',(req, res)=> {
  res.render('admin/invoice', { menu:"invoice", submenu:"create"})
})

/*----- product Category ------*/
router.get('/category',isloggedin,productController.list)
router.get('/category/create',isloggedin,productController.create)
router.post('/category/save',isloggedin,upload.single('logo'),productController.save)
router.get('/category/delete/:id',isloggedin, productController.delete)
router.get('/category/edit/:id',isloggedin,productController.edit)
router.post('/category/update/:id',isloggedin,upload.single('logo'), productController.update)


router.get('/category/create',isloggedin,(req, res)=> { 
        res.render('admin/category/create', { menu:"category"})
})
/*----------brand ------------*/
router.get('/brand/create',isloggedin,brandController.create)
router.get('/brand',isloggedin,brandController.listing)
router.post('/brand/save',isloggedin,brandUpload.single('logo'),brandController.save)
router.get('/brand/delete/:id', isloggedin,brandController.delete)
router.get('/brand/edit/:id',isloggedin,brandController.edit)
router.post('/brand/update/:id',isloggedin,brandUpload.single('logo'), brandController.update)

// router.get('/brands',(req, res)=> { 
   
//     res.render('admin/brand/listing', { menu:"brands" })
// })

// router.get('/brand/create',(req, res)=> { 
//        res.render('admin/brand/create',{ menu:"brands" })
// })

    
router.get('/mobile/settings', (req, res)=> { 
       res.render('admin/brand/create',{ menu:"mobile" })
})
/*----------Deals------*/
const dealsValidation = [
  body('name').not().isEmpty().trim().escape(),
 
]
router.get('/deal/create',isloggedin,dealController.create)
router.post('/deal/save',isloggedin,dealsValidation,dealController.save)
router.get('/deal',isloggedin,dealController.listing)
router.get('/deal/list',isloggedin,dealController.list)
router.get('/deal/delete/:id', isloggedin,dealController.delete)
router.get('/deal/edit/:id',isloggedin,dealController.edit)
router.post('/deal/update/:id',isloggedin,dealController.update)


/*------------Store Product ----------*/
router.post('/storeproduct',isloggedin,storeproductController.save)
router.get('/storeproduct/delete/:id', isloggedin,storeproductController.delete)
router.get('/storeproduct/view/:id',isloggedin,storeproductController.view)
router.post('/storeproduct/update/:id',isloggedin,storeproductController.update)

/*------------ Roles n Permissions --------*/
router.get('/roles',isloggedin,rpController.createRole)
router.post('/roles/create',isloggedin,rpController.create)
router.post('/roles/createPermission',isloggedin,rpController.createPermission)
router.post('/roles/update',isloggedin,rpController.update)

/*-------------login -------------- */
router.get('/login',authController.create)
router.post('/login',authController.login)
router.get('/logout',isloggedin,authController.logout)
 
/*-----------Regular Product -------*/

router.get('/regularprice/create/:productid',isloggedin,regularproductController.create)
router.post('/regularprice/update',isloggedin,regularproductController.addprice)
router.post('/regularprice/remove',isloggedin,regularproductController.remove)
router.post('/regularprice/get',isloggedin,regularproductController.get)

/*---------Unit --------------*/
router.get('/unit/create',isloggedin,unitController.create)
router.post('/unit/create',isloggedin,unitController.save)
router.get('/unit',isloggedin,unitController.listing)
router.get('/unit/edit/:id',isloggedin,unitController.edit)
router.post('/unit/edit/:id',isloggedin,unitController.update)
router.get('/unit/delete/:id',isloggedin,unitController.delete)

 /*----------Banner -------*/
 router.get('/banner/create',isloggedin,bannerController.create)
 router.post('/banner/deal',isloggedin,bannerController.deals)
 router.post('/banner/save',isloggedin,bannerUpload.single('logo'),bannerController.save)
 router.get('/banner/list',isloggedin,bannerController.list)
 router.get('/banner/delete/:id',isloggedin,bannerController.delete)
 router.get('/banner/edit/:id',isloggedin,bannerController.edit)
 router.post('/banner/update/:id',isloggedin,bannerUpload.single('banner_image'),bannerController.update)
 router.get('/banner/agreement',isloggedin,bannerController.agreement)



 /*---------Company--------- */
 
 router.get('/company/create',isloggedin,compController.create)
 router.post('/company/save',isloggedin,compController.save)
 router.get('/company/list',isloggedin,compController.list)
 router.get('/company/delete/:id',isloggedin,compController.delete)
 router.get('/company/edit/:id',isloggedin,compController.edit)
 router.post('/company/update/:id',isloggedin,compController.update)


/******-------upload */
 router.post('/upload', csvUpload.single('file'),uploadController.upload)


/********Coupon*********/
router.get('/coupon/create',isloggedin,coupanController.create) 
router.post('/coupon/save',isloggedin,coupanController.save) 
router.get('/coupon/list',isloggedin,coupanController.listing) 
router.get('/coupon/delete/:id',isloggedin,coupanController.delete) 
router.get('/coupon/edit/:id',isloggedin,coupanController.edit) 
router.post('/coupon/update/:id',isloggedin,coupanController.update) 

/*****Order ******/
router.get('/order/list',isloggedin,orderController.listing) 
router.get('/order/edit/:id',isloggedin,orderController.edit) 
router.post('/order/update/:id',isloggedin,orderController.update) 
/******Currecny******/
router.post('/currency/add',isloggedin,currencyController.save) 
router.get('/currency/create',isloggedin,currencyController.create) 
router.get('/currency/list',isloggedin,currencyController.list) 
router.get('/currency/delete/:id',isloggedin,currencyController.delete) 
router.get('/currency/edit/:id',isloggedin,currencyController.edit) 
router.post('/currency/update/:id',isloggedin,currencyController.update) 

module.exports = router;