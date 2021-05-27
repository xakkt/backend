const Roles = require('../models/role')
const User = require('../models/user')
const Permission = require('../models/permission');
const { check } = require('../controllers/admin/userController');


module.exports = async (req, res, next)=>{
    console.log(req.body)
    if (req.session.email) { 
        res.locals.user = req.session.userid
        res.locals.roleid = req.session.roleid
        res.locals.check = async (value, id) => {
            const permission = await Permission.findOne({ name: value,_roles:{$in:id}}).exec()
            if(!permission) return false
            return true
           }
           
           res.locals.admin = async (value, id) => {
               const role = await User.findOne({_id:req.session.userid}).populate({
                   path: 'role_id', 
                   model: 'Role', 
                   match: {
                     name:{$eq:'SYSTEM ADMININSTRATOR'}
                   }
               }).exec()
              if(!role.role_id.length) return false
               return true
              }
        next()
    }
    else {
        return res.redirect('/admin/login')
    }
};


