const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/api/productController')

const productValidation = [
    body('sku').not().isEmpty().trim().escape(),
   // body('ar_name').not().isEmpty().trim().escape(),
    body('en_name').not().isEmpty().trim().escape(),
    body('es_name').not().isEmpty().trim().escape(),
    body('description').not().isEmpty().trim().escape(),
    body('valid_from').not().isEmpty().trim().escape(),
    body('valid_till').not().isEmpty().trim().escape()
]


router.post('/product/create', productValidation, productController.create);
router.get('/product/list',productController.list);
router.get('/product/:id',productController.show);
router.delete('/product/:id/delete', productController.delete);
router.put('/product/:id/update', productValidation, productController.update);



module.exports = router;