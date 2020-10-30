const User = require('../../models/user');
const Bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');				

const {validationResult} = require('express-validator');

exports.login = async (req, res) => {
    try {
        const errors = await validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const userInfo = await User.findOne({email:req.body.email}).exec();
		if(!userInfo) return res.status(400).json({message: "User does not exist with this email."}); 
		
		if(!bcrypt.compareSync(req.body.password, userInfo.password)) return res.status(400).json({status:false, message: "Invalid password!!!", data:null});
		
		const token = await jwt.sign({id: userInfo._id}, process.env.JWT_SECRET, { expiresIn: '1d' }); 
		return res.json({status:true, message: "user found!!!", data:{user: userInfo, token:token}});	
	
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Something went wrong",
            error:err
        });
    }
}