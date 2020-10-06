const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../controllers/api/cartController')
const verifyjwt = require('../middlewares/tokenVerification');


router.use(verifyjwt.checkToken);

const cartValidation = [
    body('_product').not().isEmpty().trim().escape().withMessage('_product should not be empty'),
    body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
    body('quantity').not().isEmpty().trim().escape().withMessage('cart_price should not be empty'),
    //body('total_price').not().isEmpty().trim().escape().withMessage('max_price should not be empty'),
]

const removeProductValidation = [
    body('_product').not().isEmpty().trim().escape().withMessage('_product should not be empty'),
    body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
   // body('quantity').not().isEmpty().trim().escape().withMessage('cart_price should not be empty'),
   // body('total_price').not().isEmpty().trim().escape().withMessage('max_price should not be empty'),
]

router.post('/cart/add_product', cartValidation,cartController.addPoductToCart);
router.get('/cart/products/:store', cartController.listCartProduct);
router.delete('/cart/remove_product', removeProductValidation, cartController.removeProductFromCart);
router.put('/cart/update_quantity', cartValidation,cartController.updateProductQuantity);

module.exports = router;