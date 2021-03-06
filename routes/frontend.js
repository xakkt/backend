const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
var bodyParser = require('body-parser');
const _global = require('../helper/common')
var isloggedin = require('../middlewares/isloggedin')

const IndexController = require('../controllers/frontend/indexController')
const AuthController = require('../controllers/frontend/authController')
const StoreController = require('../controllers/frontend/storeController')
const CartController = require('../controllers/frontend/cartController')



// var auth = function(req, res, next) {
//   if (req.session.email)
//       return next();
//   else
//       return res.redirect('/admin/login')
// };

const verifyjwt = require('../middlewares/tokenVerification');
var moment = require('moment');
const path = require('path');


/*-------- validation -------------*/

router.get('/product/:id',IndexController.list)
router.post('/cookie',IndexController.cookie)
router.get('/cookiees',IndexController.cookiees)


router.post('/create',AuthController.create)
router.post('/login',AuthController.login)
router.get('/logout',AuthController.logout)

/*------------ User ---------*/
router.get('/',StoreController.list)

router.get('/cart',CartController.list)

module.exports = router;