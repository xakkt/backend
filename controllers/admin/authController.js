const Role = require('../../models/role');
const User = require('../../models/user');

const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

exports.login = async (req, res) => {
    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userInfo = await User.findOne({ email: req.body.email,role_id:{$in:req.body.role} }).exec()
        if (!userInfo.role_id.length){await req.flash('failure',"Email is not valid" ); return res.redirect('/admin/login')};
        if (!bcrypt.compareSync(req.body.password, userInfo.password))
        { 
            await req.flash('failure',"Invalid password!!!" );
            res.redirect('/admin/login');
      }
        req.session.email = userInfo.email;
        req.session.userid = userInfo._id
        req.session.roleid = userInfo.role_id[0]._id

        return res.redirect('/admin')
    } catch (err) {
        await req.flash('failure', "Please select a appropiate role");
        res.redirect('/admin/login');
       
    }
}
exports.create = async (req, res) => {
    try {
        let role =  await Role.find({}).lean()
        // res.render('admin/user/list', { menu: "users", submenu: "list", users: users, success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
        res.render('admin/auth/login',{success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure'),role:role})
    } catch (err) {
        res.status(400).json({ status: "false", data: err });
    }
}
exports.logout = async(req,res) =>{
    if (req.session) {
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                req.session = null;
                console.log("logout successful");
                return res.redirect('/admin/login');
            }
        });
    }
}