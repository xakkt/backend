const User = require('../../models/user');

var randomstring = require("randomstring");
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
var moment = require('moment');
const { validationResult } = require('express-validator');

var Timezone = require('../../models/timezone')
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//const transporter = require('../../config/transporter-mail');


class Mail {

    constructor(info) {
        this.email = info.email;
        this.subject = 'Xakkt New Password'
        this.body = `Here's your autogenerrated password <b>${info.password}</b>  . It is recommonded to change password after using it.`;
    }
    async sendmail() {

        let info = await transporter.sendMail({
            from: `Message from @xakkt.com <donotreply@xakkt.com>`, // sender address
            to: this.email, // list of receivers
            subject: this.subject, // Subject line
            html: `${this.body}`
        });

        return info;

    }

}


exports.check = function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    res.json(req.body.email);
},

    exports.list = async (req, res) => {

        try {
            let users = await User.find({}, { password: false, updatedAt: false }).lean();
            res.render('admin/user/list', { menu: "users", submenu: "list", users: users, success: await req.consumeFlash('success'), failure: await req.consumeFlash('failure') })
        } catch (err) {
            res.status(400).json({ status: "false", data: err });
        }

    },

    exports.edit = async (req, res) => {
        try {
            const user = await User.findById(req.params.id, { password: false, updatedAt: false }).exec();
            res.render('admin/user/edit',{ menu: "users", submenu: "edit",status: "success", message: "", user: user });
        } catch (err) {
            res.status(400).json({ status: "false", data: err });
        }
    }

exports.create = async (req, res) => {
    try {
        var timezone = await Timezone.find({}).lean();
        res.render('admin/user/create', { menu: "users", submenu: "create", timezone: timezone })

    } catch (err) {
        console.log(err)
        res.status(400).json({ data: err.message });
    }
}
exports.save = async (req, res) => {
    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let userinfo = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            contact_no: req.body.contact_no,
            status: req.body.status,
            last_login: req.body.last_login,
            ncrStatus: req.body.ncrStatus,
            superbuckId: req.body.superbuckId,
            timezone: req.body.timezone,
            profile_pic: req.file.path.replace('public/', ''),
            dob: moment(req.body.dob).format('YYYY-MM-DD')
        }
        
        let user = await User.create(userinfo)
        
        if (user){
            await req.flash('success', 'User added successfully!');
            res.redirect('/admin/users')
        } 
    } catch (err) {
            await req.flash('failure', err.message);
            res.redirect('/admin/users')
    }

};

exports.update = async function (req, res) {

    try {
        let userinfo = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            contact_no: req.body.contact_no,
            status: req.body.status,
            last_login: req.body.last_login,
            ncrStatus: req.body.ncrStatus,
            superbuckId: req.body.superbuckId,
            timezone: req.body.timezone,
            dob: moment(req.body.dob).format('YYYY-MM-DD')
        }

        if (req.file) { userinfo.profile_pic = req.file.path.replace('public/', ''); }
        if(req.body.password.trim()) {  userinfo.password = req.body.password  }
        const user = await User.findByIdAndUpdate({ _id: req.params.id }, userinfo, { new: true, upsert: true });

        if (!user) {
            await req.flash('success', 'User not found.');
            res.redirect('/admin/users')
        }

        await req.flash('success', 'User added successfully!');
        res.redirect('/admin/users')


    } catch (err) {
        res.status(400).json({ status: false, message: "Not updated", data: err });
    }


}

exports.authenticate = async (req, res) => {

    try {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userInfo = await User.findOne({ email: req.body.email }).exec();
        if (!userInfo) return res.status(400).json({ message: "User does not exist with this email." });

        if (!bcrypt.compareSync(req.body.password, userInfo.password)) return res.status(400).json({ status: false, message: "Invalid password!!!", data: null });

        const token = await jwt.sign({ id: userInfo._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        return res.json({ status: true, message: "user found!!!", data: { user: userInfo, token: token } });

    } catch (err) {
        res.status(400).json({ status: false, message: "", data: err });
    }

},

    exports.updatestatus = async (req, res, ) => {

        try {
            const user = await User.updateOne({ _id: req.params.userid }, { rider_status: req.params.status });
            if (user.nModified) {
                res.json({ status: true, message: "Status updated" });
            } else {
                res.json({ status: false, message: "Not found" });
            }
        } catch (err) {
            res.status(400).json({ status: false, message: "Not updated", data: err });
        }

    },

     exports.delete =  (req, res) => {
	
		User.deleteOne({ _id: req.params.userid }, async (err) => {
            if (err) return res.status(400).json({data:err});
             await req.flash('success', 'User deleted!');
			 return res.redirect('/admin/users')
		  });
	
    }


