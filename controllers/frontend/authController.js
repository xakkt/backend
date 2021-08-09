const Role = require('../../models/role');
const User = require('../../models/user');
const Store = require('../../models/store');
var md5 = require('md5');
const bcrypt = require("bcrypt")
// const moment = require('moment')
var moment = require('moment-timezone');

const { validationResult } = require('express-validator');

exports.login = async (req, res) => {
    try {
            const errors = await validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ status:0,errors: errors.array()[0].msg,data:'fds'});
            }
            const userInfo = await User.findOne({ email: req.body.email }).lean()
            if (!userInfo) return res.status(400).json({ status:0,errors: 'Email not exists' });
            if (md5(req.body.password) !== userInfo.password) return res.status(400).json({ status:0,errors: 'Email not exists' })

            await User.findOneAndUpdate({ email: req.body.email }, { last_login: Date.now() }).lean()
            req.session.customer = userInfo.email;
            req.session.userid = userInfo._id

            return res.json({ status:1,errors: '' });
    } catch (err) {
             if (!userInfo) return res.status(400).json({ status:0,errors: err.message });

    }
}
exports.create = async (req, res) => {
    try { 
        
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