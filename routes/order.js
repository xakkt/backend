const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/api/orderController')
const verifyjwt = require('../middlewares/tokenVerification');

const productValidation = [
    body('sku').not().isEmpty().trim().escape(),
   // body('ar_name').not().isEmpty().trim().escape(),
    body('en_name').not().isEmpty().trim().escape(),
    body('es_name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('valid_from').not().isEmpty().trim().escape(),
    body('valid_till').not().isEmpty().trim().escape()
]


router.post('/order/create',verifyjwt, orderController.create);




module.exports = router;