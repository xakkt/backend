const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/api/userController');
const verifyjwt = require('../middlewares/tokenVerification');
const storage = require('../config/storage');


const userValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Should be an email'),
    body('first_name').not().isEmpty().trim().escape().withMessage('first_name should not be empty'),
    body('last_name').not().isEmpty().trim().escape().withMessage('last_name should not be empty'),
    body('contact_no').not().isEmpty().trim().escape().withMessage('contact_no should not be empty'),
    
]

const authValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').not().isEmpty().trim().escape()
]

router.post('/create',userValidation,userController.create);
router.get('/list', userController.list);
router.post('/authenticate', authValidation, userController.authenticate);
router.put('/update/:id',verifyjwt.checkToken,userController.updateProfile);
router.get('/:id', verifyjwt.checkToken,userController.getUser);

/*router.get('/editform', userController.editProfile);
router.post('/update-profile/:userid',storage.upload,userController.updateProfile);
router.get('/changestatus/:userid/:status',userController.updatestatus);
router.post('/authenticate', userController.authenticate);
router.get('/forget-password',userController.forgotPassword);
router.put('/change-password',userController.changePassword);*/

module.exports = router;