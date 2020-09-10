const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const shoppingController = require('../controllers/api/shoppinglistController')

const shoppinglistValidation = [
    body('_user').not().isEmpty().trim().escape().withMessage('_user should not be empty'),
    body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
    body('name').not().isEmpty().trim().escape().withMessage('name should not be empty')
]

const getListValidation = [
    body('_user').not().isEmpty().trim().escape().withMessage('_user should not be empty'),
    body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
   ]

const updateListValidation = [
    body('_shoppinglist').not().isEmpty().trim().escape().withMessage('_shoppinglist should not be empty'),
    body('_product').not().isEmpty().trim().escape().withMessage('_product should not be empty'),
    body('quantity').not().isEmpty().trim().escape().withMessage('quantity should not be empty')   
]

router.post('/shoppinglist/add_product', updateListValidation, shoppingController.addProductToshoppinglist);
router.post('/shoppinglist/create',shoppinglistValidation, shoppingController.createShoppingList);
router.post('/shoppinglist',getListValidation,shoppingController.allShoppingLists);
router.get('/shoppinglist/:shoplist/products', shoppingController.shoppinglistProducts)



module.exports = router;