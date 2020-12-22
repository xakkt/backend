const Role = require('../../models/role');
const User = require('../../models/user');
const Store = require('../../models/store');
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
// const moment = require('moment')
var moment = require('moment-timezone');
const { validationResult } = require('express-validator');

exports.dashboard = async (req,res) =>{
    try{
        // let ip = req.ip

      let ip = req.connection.remoteAddress;


        console.log("client IP is *********************" + ip);
     let user =  await User.count().lean();
    //  console.log("--logs",user)
   return res.render('admin/index',{ menu:"dashboard",data:user}) 
    }catch(err)
    {
        console.log("--err",err)
    }
}