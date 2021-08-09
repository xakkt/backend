const Role = require('../../models/role');
const User = require('../../models/user');
const Store = require('../../models/store');

const bcrypt = require("bcrypt")
// const moment = require('moment')
var moment = require('moment-timezone');

const { validationResult } = require('express-validator');

exports.login = async (req, res) => {
    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userInfo = await User.findOne({ email: req.body.email }).exec()
        if (!userInfo) { await req.flash('failure', "Email is not valid"); return res.redirect('/admin/login') };
        if (md5(req.body.password) !== userInfo.password) {
            await req.flash('failure', "Invalid password!!!");
            res.redirect('/');
        }
        await User.findOneAndUpdate({ email: req.body.email }, { last_login: Date.now() }).lean()
        req.session.customer = userInfo.email;
        req.session.userid = userInfo._id

        return res.redirect('/')
    } catch (err) {
        console.log("--err", err)
        await req.flash('failure', "Please enter valid email and password");
        res.redirect('/admin/login');

    }
}
exports.create = async (req, res) => {
    try { 
        console.log(req.body,"=============>>>>")
            const errors = await validationResult(req);
            if (!errors.isEmpty()) {
                
                return res.json({ status:0, errors: errors.array()[0].msg });
            }
            if(req.body.password==req.body.confirm_password){
                return res.json({errors: "Password and Confirm password should be same.",status:0});
            }
           
       
        let userInfo = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            contact_no: req.body.contact_no,
            dob: req.body.dob
        }
        let user = await User.create(userInfo)
        if (user) {
          // return res.render('/index')
             return res.json({ status: 1 })
        }
        return res.json({ status: 0 })

    } catch (err) {
        console.log(err)
        res.status(400).json({ status: 0, errors: err.message });
    }
}
exports.logout = async (req, res) => {
    console.log("--sessionslogout",req.session)
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                req.session = null;
                console.log("logout successful");
                return res.redirect('/');
            }
        });
    }
}