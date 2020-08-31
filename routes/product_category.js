const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/api/categoryController')

const categoryValidation = [
    body('name').not().isEmpty().trim().escape(),
   // body('ar_name').not().isEmpty().trim().escape(),
]


router.post('/category/create', categoryValidation, categoryController.create);
router.get('/category/:id/products', categoryValidation, categoryController.productsByCategory);
router.get('/category/list',categoryController.list);
router.delete('/category/:id/delete', categoryController.delete);
router.put('/category/:id/update', categoryValidation, categoryController.update);
router.get('/category/:id',categoryController.show);


module.exports = router;