const Roles = require('../models/role')
const Permission = require('../models/permission');
const { check } = require('../controllers/admin/userController');


abc = function(value,id){
    return value
 }

module.exports =  (req, res, next)=>{
    if (req.session.email) { 
        res.locals.user = req.session.userid
        res.locals.check = async (value, id) => {
           console.log("value",value)
             const permission = await Permission.findOne({ name: value}).exec()
             return res.json({abc:"abc"})
            //console.log("cjecl",permission)
            }
        next()
    }
    else {
        return res.redirect('/admin/login')
    }
};


