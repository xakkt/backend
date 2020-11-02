const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
var bodyParser = require('body-parser');

const departmentController = require('../controllers/admin/departmentController')
const userController = require('../controllers/admin/userController')
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

  var upload = multer({ storage : storage})
  var userUpload = multer({storage: userStorage})

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

router.get('/product/create',(req, res)=> {
      res.render('admin/product/create', { menu:"products", submenu:"create"})
})
/*--------- Invoice ---------*/
router.get('/invoice',(req, res)=> {
  res.render('admin/invoice', { menu:"invoice", submenu:"create"})
})

/*----- product Category ------*/
router.get('/category',(req, res)=> { 
    res.render('admin/category/listing',{ menu:"category" })
})

router.get('/category/create',(req, res)=> { 
        res.render('admin/category/create', { menu:"category"})
})

router.get('/brands',(req, res)=> { 
   
    res.render('admin/brand/listing', { menu:"brands" })
})

router.get('/brand/create',(req, res)=> { 
       res.render('admin/brand/create',{ menu:"brands" })
})

    
router.get('/mobile/settings', (req, res)=> { 
       res.render('admin/brand/create',{ menu:"mobile" })
})

    
module.exports = router;