const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
var bodyParser = require('body-parser');
const _global = require('../helper/common')
var rbac = require('../middlewares/rbac')

const departmentController = require('../controllers/admin/departmentController')
const userController = require('../controllers/admin/userController')
const productController = require('../controllers/admin/productController')
const brandController = require('../controllers/admin/brandController')
const dealController = require('../controllers/admin/dealController')
const storeproductController = require('../controllers/admin/storeproductController')
const rpController = require('../controllers/admin/rolesnpermissionController')
const authController = require('../controllers/admin/authController')
const regularproductController = require('../controllers/admin/regularproductController')


var auth = function(req, res, next) {
  if (req.session.email)
      return next();
  else
      return res.redirect('/admin/login')
};

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
      callback(null, './$/images/brands');
    },
    filename: function (req, file, callback) { const img = path.basename(file.originalname,path.extname(file.originalname));
      callback(null, img.replace(' ','_').toLowerCase()+'_'+moment().unix() + path.extname(file.originalname));
    }
  });

  var upload = multer({ storage : storage})
  var userUpload = multer({storage: userStorage})
  var productUpload = multer({storage: productStorage})
  var brandUpload = multer({storage: brandStorage})


/*-------- validation -------------*/

const storeValidation = [
  body('name').not().isEmpty().trim().escape(),
  body('description').not().isEmpty().trim().escape(),
  body('contact_no').not().isEmpty().trim().escape(),
  verifyjwt.checkToken
]

router.get('/',rbac,(req,res)=>{
      res.render('admin/index',{ menu:"dashboard"}) 
});

/*------------ User ---------*/
router.get('/users',rbac,userController.list)
router.get('/managers',rbac,userController.adminlist)
router.get('/user/create',rbac,userController.create);
router.post('/user/save',rbac,userUpload.single('profile_pic'),userController.save)
router.get('/user/delete/:userid',rbac, userController.delete);
router.get('/user/edit/:id',rbac, userController.edit);
router.post('/user/update/:id',userUpload.single('profile_pic'),rbac,userController.update)

/*------------- Department -------*/
router.get('/departments',rbac,departmentController.list)
router.get('/department/create',rbac,departmentController.create);
router.post('/department/save',rbac,upload.single('logo'),departmentController.save)
router.get('/department/delete/:id',rbac, departmentController.delete);
router.get('/department/edit/:id',rbac, departmentController.edit);
router.post('/department/update/:id',rbac,upload.single('logo'),departmentController.update)

/*------------- Store --------*/
// _global.permission('store_edit')
router.get('/stores',rbac,storeController.list)
router.get('/store/create',rbac,storeController.create)
router.post('/store/save',rbac,storeController.saveStore)
router.get('/store/edit/:storeid',rbac,storeController.editStore)
router.get('/store/delete/:id',rbac, storeController.deleteStore);
router.post('/store/update/:id', rbac,storeController.updateStore)


/*------------ Products --------*/
router.get('/products',(req, res)=> {
    res.render('admin/product/listing', { menu:"products", submenu:"list" })
})
router.post('/product/create',rbac,productUpload.single('logo'),productController.productsave)
router.get('/product',rbac,productController.productlisting)
router.get('/product/delete/:id',rbac,productController.productdelete);
router.get('/product/edit/:id',rbac,productController.productedit)
router.post('/product/update/:id',rbac,productUpload.single('logo'), productController.productupdate)
router.get('/product/pricing/:productid',rbac,productController.addPrice);
router.get('/product/create',rbac, productController.productCreate)
router.post('/product_price/create',rbac, productController.priceSave)
router.post('/product_price/remove',rbac, productController.remove)

/*--------- Invoice ---------*/
router.get('/invoice',(req, res)=> {
  res.render('admin/invoice', { menu:"invoice", submenu:"create"})
})

/*----- product Category ------*/
router.get('/category',rbac,productController.list)
router.get('/category/create',rbac,productController.create)
router.post('/category/save',rbac,upload.single('logo'),productController.save)
router.get('/category/delete/:id',rbac, productController.delete)
router.get('/category/edit/:id',rbac,productController.edit)
router.post('/category/update/:id',rbac,upload.single('logo'), productController.update)


router.get('/category/create',auth,(req, res)=> { 
        res.render('admin/category/create', { menu:"category"})
})
/*----------brand ------------*/
router.get('/brand/create',rbac,brandController.create)
router.get('/brand',rbac,brandController.listing)
router.post('/brand/save',rbac,brandUpload.single('logo'),brandController.save)
router.get('/brand/delete/:id', auth,brandController.delete)
router.get('/brand/edit/:id',rbac,brandController.edit)
router.post('/brand/update/:id',rbac,brandUpload.single('logo'), brandController.update)

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
router.get('/deal/create',rbac,dealController.create)
router.post('/deal/save',rbac,dealsValidation,dealController.save)
router.get('/deal',rbac,dealController.listing)
router.get('/deal/delete/:id', rbac,dealController.delete)
router.get('/deal/edit/:id',rbac,dealController.edit)
router.post('/deal/update/:id',rbac,dealController.update)


/*------------Store Product ----------*/
router.post('/storeproduct',rbac,storeproductController.save)
router.get('/storeproduct/delete/:id', rbac,storeproductController.delete)
router.get('/storeproduct/view/:id',rbac,storeproductController.view)
router.post('/storeproduct/update/:id',rbac,storeproductController.update)

/*------------ Roles n Permissions --------*/
router.get('/roles',rbac,rpController.createRole)
router.post('/roles/create',rbac,rpController.create)
router.post('/roles/createPermission',rbac,rpController.createPermission)
router.post('/roles/update',rbac,rpController.update)

/*-------------login -------------- */
router.get('/login',authController.create)
router.post('/login',authController.login)
router.get('/logout',rbac,authController.logout)
 
/*-----------Regular Product -------*/

router.get('/regularprice/create/:productid',rbac,regularproductController.create)
router.post('/regularprice/update',rbac,regularproductController.addprice)
router.post('/regularprice/remove',rbac,regularproductController.remove)
router.post('/regularprice/get',rbac,regularproductController.get)

module.exports = router;