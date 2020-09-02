const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const settingController = require('../controllers/api/settingController');

const settingValidation = [
    body('key').not().isEmpty().trim().escape(),
    //body('images').not().isEmpty().trim().escape() 
]


router.post('/setting/add', settingValidation, settingController.add);
router.get('/setting/list',settingController.list);



module.exports = router;