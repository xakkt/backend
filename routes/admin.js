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

router.get('/',(req,res)=>{
      res.render('admin/index',{ menu:"dashboard" }) 
});

/*------------ User ---------*/
router.get('/users',userController.list)
router.get('/user/create',userController.create);
router.post('/user/save',userUpload.single('profile_pic'),userController.save)
router.get('/user/delete/:userid', userController.delete);
router.get('/user/edit/:id', userController.edit);
router.post('/user/update/:id',userUpload.single('profile_pic'),userController.update)

/*------------- Department -------*/
router.get('/departments',departmentController.list)
router.get('/department/create',departmentController.create);
router.post('/department/save',upload.single('logo'),departmentController.save)
router.get('/department/delete/:id', departmentController.delete);
router.get('/department/edit/:id', departmentController.edit);
router.post('/department/update/:id',upload.single('logo'),departmentController.update)

/*------------- Store --------*/

router.get('/stores',storeController.list)
router.get('/store/create',storeController.create)
router.post('/store/save',storeController.saveStore)
router.get('/store/edit/:storeid',storeController.editStore)
router.get('/store/delete/:id', storeController.deleteStore);
router.post('/store/update/:id', storeController.updateStore)


/*------------ Products --------*/
router.get('/products',(req, res)=> {
    res.render('admin/product/listing', { menu:"products", submenu:"list" })
})
router.post('/product/create',productUpload.single('logo'),productController.productsave)
router.get('/product',productController.productlisting)
router.get('/product/delete/:id', productController.productdelete);
router.get('/product/edit/:id',productController.productedit)
router.post('/product/update/:id',productUpload.single('logo'), productController.productupdate)

router.get('/product/create', productController.productCreate)
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



module.exports = router;