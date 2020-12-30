const Roles = require('../models/role')
const User = require('../models/user')
const Permission = require('../models/permission');
const { check } = require('../controllers/admin/userController');


module.exports = async (req, res, next)=>{
    if (req.session.customer) { 
        next()
    }
    else {
        return res.redirect('/')
    }
};


