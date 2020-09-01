const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const homeController = require('../controllers/api/homeController')

router.get('/app/dashboard/:storeid', homeController.dashboard);

module.exports = router;