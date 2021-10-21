const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
var bodyParser = require('body-parser');
const _global = require('../helper/common')

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
const fieldrepController = require('../controllers/admin/fieldrepController.js')
const paymentController = require('../controllers/admin/paymentController.js')
const shippingController = require('../controllers/admin/shippingController.js')


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
      callback(null, img.split(' ').join('_').toLowerCase()+'_'+moment().unix() + path.extname(file.originalname));
    }
  });

  var userStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/images/users');
    },
    filename: function (req, file, callback) { const img = path.basename(file.originalname,path.extname(file.originalname));
      callback(null, img.split(' ').join('_').toLowerCase()+'_'+moment().unix() + path.extname(file.originalname));
    }
  });
  var productStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/images/products');
    },
    filename: function (req, file, callback) { const img = path.basename(file.originalname,path.extname(file.originalname));
      callback(null, img.split(' ').join('_').toLowerCase()+'_'+moment().unix() + path.extname(file.originalname));
    }
  });
  var brandStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/images/brands');
    },
    filename: function (req, file, callback) { const img = path.basename(file.originalname,path.extname(file.originalname));
      callback(null, img.split(' ').join('_').toLowerCase()+'_'+moment().unix() + path.extname(file.originalname));
    }
  });
  var bannerStorage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/images/banners');
    },
    filename: function (req, file, callback) { const img = path.basename(file.originalname,path.extname(file.originalname));
      callback(null, img.split(' ').join('_').toLowerCase()+'_'+moment().unix() + path.extname(file.originalname));
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

router.get('/',dashboardController.dashboard)
// (req,res)=>{
//       res.render('admin/index',{ menu:"dashboard"}) 
// });

/*------------ User ---------*/
router.get('/users',userController.list)
router.get('/user/create',userController.create);
router.post('/user/save',userUpload.single('profile_pic'),userController.save)
router.get('/user/delete/:userid', userController.delete);
router.get('/user/edit/:id', userController.edit);
router.post('/user/update/:id',userUpload.single('profile_pic'),userController.update)
router.get('/user/update/status',userController.updateStatus);
router.post('/user/checkEmail',userController.checkEmail)

/*---------- Field Rep ---------*/
router.get('/fieldrep/companies',fieldrepController.assignCompanies)

/*------------- Department -------*/
router.get('/departments',departmentController.list)
router.get('/department/create',departmentController.create);
router.post('/department/save',upload.single('logo'),departmentController.save)
router.get('/department/delete/:id', departmentController.delete);
router.get('/department/edit/:id', departmentController.edit);
router.post('/department/update/:id',upload.single('logo'),departmentController.update)

/*------------- Store --------*/
// _global.permission('store_edit')
router.get('/stores',_global.permission('store_view'),storeController.list)
router.get('/store/create',_global.permission('store_add'),storeController.create)
router.post('/store/save',_global.permission('store_add'),storeController.saveStore)
router.get('/store/edit/:storeid',_global.permission('store_edit'),storeController.editStore)
router.get('/store/delete/:id',_global.permission('store_delete'), storeController.deleteStore);
router.post('/store/update/:id', _global.permission('store_edit'),storeController.updateStore)



/*------------ Products --------*/
/*router.get('/products',(req, res)=> {
    res.render('admin/product/listing', { menu:"products", submenu:"list" })
})*/
router.post('/product/delete', productController.product_delete)
router.post('/product/create',productUpload.single('logo'),_global.permission('product_add'),productController.productsave)
router.get('/product',_global.permission('product_view'),productController.productlisting)
router.get('/product/delete/:id',_global.permission('product_delete'),productController.productdelete);
router.get('/product/edit/:id',_global.permission('product_edit'),productController.productedit)
router.post('/product/update/:id',_global.permission('product_edit'),productUpload.single('logo'), productController.productupdate)
router.get('/product/pricing/:productid',_global.permission('add_product_pricing'),productController.addPrice);
router.get('/product/create', productController.productCreate)
router.post('/product_price/create', productController.priceSave)
router.post('/product_price/remove', productController.remove)
router.get('/product/list',_global.permission('product_view'),productController.product_listing)
router.post('/product/sku',_global.permission('product_view'),productController.unique_sku)

/*--------- Invoice ---------*/
router.get('/invoice',(req, res)=> {
  res.render('admin/invoice', { menu:"invoice", submenu:"create"})
})

/*----- product Category ------*/
router.get('/category',productController.list)
router.get('/category/create',productController.create)
router.post('/category/save',upload.single('logo'),productController.save)
router.get('/category/delete/:id', productController.delete)
router.get('/category/edit/:id',productController.edit)
router.post('/category/update/:id',upload.single('logo'), productController.update)


router.get('/category/create',(req, res)=> { 
        res.render('admin/category/create', { menu:"category"})
})
/*----------brand ------------*/
router.get('/brand/create',brandController.create)
router.get('/brand',brandController.listing)
router.post('/brand/save',brandUpload.single('logo'),brandController.save)
router.get('/brand/delete/:id', brandController.delete)
router.get('/brand/edit/:id',brandController.edit)
router.post('/brand/update/:id',brandUpload.single('logo'), brandController.update)

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
router.get('/deal/create',dealController.create)
router.post('/deal/save',dealsValidation,dealController.save)
router.get('/deal',dealController.listing)
router.get('/deal/list',dealController.list)
router.get('/deal/delete/:id', dealController.delete)
router.get('/deal/edit/:id',dealController.edit)
router.post('/deal/update/:id',dealController.update)


/*------------Store Product ----------*/
router.post('/storeproduct',storeproductController.save)
router.get('/storeproduct/delete/:id', storeproductController.delete)
router.get('/storeproduct/view/:id',storeproductController.view)
router.post('/storeproduct/update/:id',storeproductController.update)

/*------------ Roles n Permissions --------*/
router.get('/roles',rpController.createRole)
router.post('/roles/create',rpController.create)
router.post('/roles/createPermission',rpController.createPermission)
router.post('/roles/update',rpController.update)

/*-------------login -------------- */
router.get('/login',authController.create)
router.post('/login',authController.login)
router.get('/logout',authController.logout)
 
/*-----------Regular Product -------*/

router.get('/regularprice/create/:productid',_global.permission('add_product_pricing'),regularproductController.create)
router.post('/regularprice/update',_global.permission('add_product_pricing'),regularproductController.addprice)
router.post('/regularprice/remove',_global.permission('add_product_pricing'),regularproductController.remove)
router.post('/regularprice/get',_global.permission('add_product_pricing'),regularproductController.get)

/*---------Unit --------------*/
router.get('/unit/create',unitController.create)
router.post('/unit/create',unitController.save)
router.get('/unit',unitController.listing)
router.get('/unit/edit/:id',unitController.edit)
router.post('/unit/edit/:id',unitController.update)
router.get('/unit/delete/:id',unitController.delete)

 /*----------Banner -------*/
 router.get('/banner/create',bannerController.create)
 router.post('/banner/deal',bannerController.deals)
 router.post('/banner/save',bannerUpload.single('logo'),bannerController.save)
 router.get('/banner/list',bannerController.list)
 router.get('/banner/delete/:id',bannerController.delete)
 router.get('/banner/edit/:id',bannerController.edit)
 router.post('/banner/update/:id',bannerUpload.single('banner_image'),bannerController.update)
 router.get('/banner/agreement',bannerController.agreement)



 /*---------Company--------- */
 
 router.get('/company/create',compController.create)
 router.post('/company/save',compController.save)
 router.get('/company/list',compController.list)
 router.post('/company/checkEmail',compController.checkEmail)
 /*---- need to discuss ----*/
 /*router.get('/company/delete/:id',compController.delete)*/
 router.get('/company/edit/:id',compController.edit)
 router.post('/company/update/:id',compController.update)


/******-------upload */
 router.post('/upload', csvUpload.single('file'),uploadController.upload)


/********Coupon*********/
router.get('/coupon/create',coupanController.create) 
router.post('/coupon/save',coupanController.save) 
router.get('/coupon/list',coupanController.listing) 
router.get('/coupon/delete/:id',coupanController.delete) 
router.get('/coupon/edit/:id',coupanController.edit) 
router.post('/coupon/update/:id',coupanController.update) 

/*****Order ******/
router.get('/order/list',orderController.listing) 
router.get('/order/edit/:id',orderController.edit) 
router.post('/order/update/:id',orderController.update) 
router.get('/order/delete/:id',orderController.orderDelete) 
/******Currecny******/
router.post('/currency/add',currencyController.save) 
router.get('/currency/create',currencyController.create) 
router.get('/currency/list',currencyController.list) 
router.get('/currency/delete/:id',currencyController.delete) 
router.get('/currency/edit/:id',currencyController.edit) 
router.post('/currency/update/:id',currencyController.update) 


router.get('/payment/list',paymentController.listing)

router.get('/shipping/list',shippingController.listing)
router.get('/zone/list',shippingController.list)
router.get('/forbidden',(req, res) => {
  return res.render('admin/forbidden/forbidden')
})
module.exports = router;