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
        const userInfo = await User.findOne({ email: req.body.email }).populate({
            path: 'role_id',
            match: { name: 'SUPERADMIN' }
        }).
            exec();
        if (!userInfo.role_id.length) return res.status(400).json({ message: "Email does not exist." });
        if (!bcrypt.compareSync(req.body.password, userInfo.password))
        { 
            await req.flash('failure',"Invalid password!!!" );
            res.redirect('/admin/login');
            // return res.status(400).json({ status: false, message: "Invalid password!!!", data: null });
      }
        const token = await jwt.sign({ id: userInfo._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        req.session.email = userInfo.email;
        req.session.roleid = userInfo.role_id[0]._id
        // console.log("---login",)

        return res.redirect('/admin')
    } catch (err) {
        await req.flash('failure', err.message);
        res.redirect('/admin/login');
        // return res.status(400).json({
        //     success: false,
        //     message: "Something went wrong",
        //     error: err
        // });
    }
}
exports.create = async (req, res) => {
    try {
        // res.render('admin/user/list', { menu: "users", submenu: "list", users: users, success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
        res.render('admin/auth/login',{success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure')})
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