const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
var bodyParser = require('body-parser');
const cartController = require('../controllers/api/cartController')
const departmentController = require('../controllers/admin/departmentController')
const storeController = require('../controllers/admin/storeController')
const verifyjwt = require('../middlewares/tokenVerification');
var moment = require('moment');
const path = require('path')

var multer  = require('multer')
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './public/departments');
    },
    filename: function (req, file, callback) { const img = path.basename(file.originalname,path.extname(file.originalname));
      callback(null, img.replace(' ','_').toLowerCase()+'_'+moment().unix() + path.extname(file.originalname));
    }
  });
  var upload = multer({ storage : storage})


router.get('/',(req,res)=>{
      res.render('admin/index',{ menu:"dashboard" }) 
});


/*------------- Department -------*/
router.get('/departments',departmentController.list)

router.get('/department/create',(req, res)=> { 
    res.render('admin/department/create', { menu:"departments", submenu:"create" })
})

router.post('/departments/save',upload.single('logo'),departmentController.create)
/*------------- Store --------*/

router.get('/stores',storeController.list)
router.get('/store/create',storeController.create)
router.post('/store/save',storeController.saveStore)


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