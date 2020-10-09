const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../controllers/api/cartController')
const verifyjwt = require('../middlewares/tokenVerification');


//router.use(verifyjwt.checkToken);

router.get('/',(req,res)=>{
      res.render('admin/index',{ menu:"dashboard" }) 
});

router.get('/stores',(req, res)=> {
     res.render('admin/store/listing',{ menu:"stores", submenu:"list" })
})
router.get('/store/create',(req, res)=> { 
    res.render('admin/store/create', { menu:"stores", submenu:"create" })
})
    
router.get('/products',(req, res)=> {
    res.render('admin/store/listing', { menu:"products", submenu:"list" })
})

router.get('/product/create',(req, res)=> {
      res.render('admin/store/create', { menu:"products", submenu:"create"})
})

    
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