const Roles = require('../models/role')
const User = require('../models/user')
const Permission = require('../models/permission');
const { check } = require('../controllers/admin/userController');


module.exports = async (req, res, next)=>{


    if (req.session.customer) { 
        console.log("======1",req.session.userid)
        console.log("======2",req.session.customer)

        // locals.user = req.session.userid
        

        // res.locals.check = async (...value) => {
        console.log("=======ppww")
               const role = await User.findOne({_id:req.session.userid})
            //    .populate({
            //     path: 'role_id',
            //     model: 'Role', 
            //     match: {
            //       key:{$eq:'system_admin'}
            //     }
            // }).exec()
            // if(role.role_id.length) return true

            // const permission = await Permission.findOne({ name: value,_roles:{$in:req.session.rolesId}}).exec()
            // if(!permission) return false
            // return true
        //    }


        next()
    }
    else {
        console.log("=======pjp")
        return res.render('frontend/login')
    }
};

