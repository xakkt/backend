const Role = require('../../models/role');
const User = require('../../models/user');
const Store = require('../../models/store');
const User = require('../../models/user');

const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
// const moment = require('moment')
var moment = require('moment-timezone');
const { validationResult } = require('express-validator');

exports.dashboard = async (req,res) =>{

}