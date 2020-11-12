const Roles = require('../models/role')
const Permission = require('../models/permission')


abc = function(value,id){
    return value
 }

module.exports = function (req, res, next) {
    if (req.session.email) {
        res.locals.user = req.session.userid

        // res.locals.check = (value, id) => {
             
        //     /*const permission = await Permission.findOne({ name: value, _roles: { $in: id } }, {}).exec()
        //     // if (!permission) return false
        //     console.log("-----role",permission)*/
        //     return this.abc(value,id)
        // }

        next()
    }
    else {
        return res.redirect('/admin/login')
    }
};


