const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const wishController = require('../controllers/api/wishlistController')
const verifyjwt = require('../middlewares/tokenVerification');


router.use(verifyjwt.checkToken);

const wishlistValidation = [
    body('_product').not().isEmpty().trim().escape().withMessage('_product should not be empty'),
    body('_user').not().isEmpty().trim().escape().withMessage('_user should not be empty'),
    body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
    body('wish_price').not().isEmpty().trim().escape().withMessage('wish_price should not be empty'),
    body('max_price').not().isEmpty().trim().escape().withMessage('max_price should not be empty'),
]

const listProductsVali = [
    body('_user').not().isEmpty().trim().escape().withMessage('_user should not be empty'),
    body('_store').not().isEmpty().trim().escape().withMessage('_store should not be empty'),
]
router.post('/wishlist/add_product', wishlistValidation, wishController.addPoductToWishlist);
router.post('/wishlist/products', listProductsVali, wishController.allWishlistProducts);
router.delete('/wishlist/remove/:wishlistid', wishController.deleteProductWishlist);



module.exports = router;