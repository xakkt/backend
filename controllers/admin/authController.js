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
            match: { name: 'SuperAdmin' }
        }).exec();

        if (!userInfo.role_id.length) return res.status(400).json({ message: "Email does not exist." });
        if (!bcrypt.compareSync(req.body.password, userInfo.password)) return res.status(400).json({ status: false, message: "Invalid password!!!", data: null });
        const token = await jwt.sign({ id: userInfo._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        req.session.email = userInfo.email;

        //		return res.json({status:true, message: "user found!!!", data:{user: userInfo, token:token}});	
        return res.redirect('/admin')
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong",
            error: err
        });
    }
}
exports.create = async (req, res) => {
    try {
        res.render('admin/auth/login')
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