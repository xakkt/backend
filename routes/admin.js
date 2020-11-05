const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
var bodyParser = require('body-parser');

const departmentController = require('../controllers/admin/departmentController')
const userController = require('../controllers/admin/userController')
const productController = require('../controllers/admin/productController')
const brandController = require('../controllers/admin/brandController')
const dealController = require('../controllers/admin/dealController')
const storeproductController = require('../controllers/admin/storeproductController')
const rpController = require('../controllers/admin/rolesnpermissionController')
const authController = require('../controllers/admin/authController')

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
      callback(null, './public/images/brands');
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

router.get('/',auth,(req,res)=>{
      res.render('admin/index',{ menu:"dashboard" }) 
});

/*------------ User ---------*/
router.get('/users',auth,userController.list)
router.get('/user/create',auth,userController.create);
router.post('/user/save',auth,userUpload.single('profile_pic'),userController.save)
router.get('/user/delete/:userid',auth, userController.delete);
router.get('/user/edit/:id',auth, userController.edit);
router.post('/user/update/:id',userUpload.single('profile_pic'),auth,userController.update)

/*------------- Department -------*/
router.get('/departments',auth,departmentController.list)
router.get('/department/create',auth,departmentController.create);
router.post('/department/save',auth,upload.single('logo'),departmentController.save)
router.get('/department/delete/:id',auth, departmentController.delete);
router.get('/department/edit/:id',auth, departmentController.edit);
router.post('/department/update/:id',auth,upload.single('logo'),departmentController.update)

/*------------- Store --------*/

router.get('/stores',auth,storeController.list)
router.get('/store/create',auth,storeController.create)
router.post('/store/save',auth,storeController.saveStore)
router.get('/store/edit/:storeid',auth,storeController.editStore)
router.get('/store/delete/:id',auth, storeController.deleteStore);
router.post('/store/update/:id', auth,storeController.updateStore)


/*------------ Products --------*/
router.get('/products',(req, res)=> {
    res.render('admin/product/listing', { menu:"products", submenu:"list" })
})
router.post('/product/create',auth,productUpload.single('logo'),productController.productsave)
router.get('/product',auth,productController.productlisting)
router.get('/product/delete/:id',auth,productController.productdelete);
router.get('/product/edit/:id',auth,productController.productedit)
router.post('/product/update/:id',auth,productUpload.single('logo'), productController.productupdate)
router.get('/product/pricing/:productid',auth,productController.addPrice);
router.get('/product/create',auth, productController.productCreate)
router.post('/product_price/create',auth, productController.priceSave)
/*--------- Invoice ---------*/
router.get('/invoice',(req, res)=> {
  res.render('admin/invoice', { menu:"invoice", submenu:"create"})
})

/*----- product Category ------*/
router.get('/category',auth,productController.list)
router.get('/category/create',auth,productController.create)
router.post('/category/save',auth,upload.single('logo'),productController.save)
router.get('/category/delete/:id',auth, productController.delete)
router.get('/category/edit/:id',auth,productController.edit)
router.post('/category/update/:id',auth,upload.single('logo'), productController.update)


router.get('/category/create',auth,(req, res)=> { 
        res.render('admin/category/create', { menu:"category"})
})
/*----------brand ------------*/
router.get('/brand/create',auth,brandController.create)
router.get('/brand',auth,brandController.listing)
router.post('/brand/save',auth,brandUpload.single('logo'),brandController.save)
router.get('/brand/delete/:id', auth,brandController.delete)
router.get('/brand/edit/:id',auth,brandController.edit)
router.post('/brand/update/:id',auth,brandUpload.single('logo'), brandController.update)

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
router.get('/deal/create',auth,dealController.create)
router.post('/deal/save',auth,dealsValidation,dealController.save)
router.get('/deal',auth,dealController.listing)
router.get('/deal/delete/:id', auth,dealController.delete)
router.get('/deal/edit/:id',auth,dealController.edit)
router.post('/deal/update/:id',auth,dealController.update)


/*------------Store Product ----------*/
router.post('/storeproduct',auth,storeproductController.save)
router.get('/storeproduct/delete/:id', auth,storeproductController.delete)
router.get('/storeproduct/view/:id',auth,storeproductController.view)
router.post('/storeproduct/update/:id',auth,storeproductController.update)

/*------------ Roles n Permissions --------*/
router.get('/roles',auth,rpController.createRole)
router.post('/roles/create',auth,rpController.create)
router.post('/roles/createPermission',auth,rpController.createPermission)
router.post('/roles/update',auth,rpController.update)

/*-------------login -------------- */
router.get('/login',authController.create)
router.post('/login',authController.login)
router.get('/logout',auth,authController.logout)


module.exports = router;