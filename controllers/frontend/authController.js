const Role = require('../../models/role');
const User = require('../../models/user');
const Store = require('../../models/store');

const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
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
        if(!req.body.fname){
           return res.json({message: "First name is required.", status:400});  
         }
          if(!req.body.lname){
            return res.json({message: "Last name is required." , status:400});  
         }
         if(!req.body.email){
            return res.json({message: "Email is required.", status:400});  
         }
         if(!req.body.dob){
            return res.json({message: "Date of Birth is required.", status:400});  
         }
         if(!req.body.password){
            return res.json({message: "Password is required.", status:400});  
         }
         if(!req.body.confirmpassword){
            return res.json({message: "Confirm password is required.", status:400});  
         }
        const findUser = await User.findOne({$or:[{email: req.body.email}, {contact_no: req.body.mobile}]});
        if(findUser) {
            if(findUser.email === req.body.email) {
              return res.json({message: "Email already exist.",status:401});
            }
            if(findUser.contact_no === req.body.mobile) {
                return res.json({message: "Mobile number already exist.",status:401});
            }
        }
        let userInfo = {
            first_name: req.body.fname,
            last_name: req.body.lname,
            email: req.body.email,
            password: req.body.password,
            contact_no: req.body.mobile,
            dob: req.body.dob
        }
        let user = await User.create(userInfo)
        if (user) {
          // return res.render('/index')
             return res.json({ status: true })
        }
        return res.json({ status: false })

    } catch (err) {
        res.status(400).json({ status: "false", err: err });
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