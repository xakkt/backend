const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const shoppingController = require('../controllers/api/shoppinglistController')
const verifyjwt = require('../middlewares/tokenVerification');


router.use(verifyjwt.checkToken);

const shoppinglistValidation = [
    body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
    body('name').not().isEmpty().trim().escape().withMessage('name should not be empty')
]

const getListValidation = [
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
router.delete('/shoppinglist/remove_product/:shoppinglistid',shoppingController.deleteProductFromShoppinglist)
router.patch('/shoppinglist/product/quantity',shoppingController.updateShoppinglist);
router.get('/shoppinglist/:shoplist/products', shoppingController.shoppinglistProducts)
router.delete('/shoppinglist/:id/remove',shoppingController.deleteShoppinglist);


module.exports = router;