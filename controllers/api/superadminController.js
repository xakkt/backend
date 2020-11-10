const User = require('../../models/user');
var moment = require('moment');

exports.create = async(req,res) =>{

    try{
        console.log("---test",req.body)
        const superadmininfo = {
            first_name: 'Admin',
            last_name: 'Admin',
            email: 'Admin@gmail.com',
            password: 'Admin@123',
            role_id:req.body.role,
            contact_no: 99999999,
            dob: moment('Mon 03-Jul-2020, 11:00 AM').format('YYYY-MM-DD')   
        }
    //    const user =  await User.create(superadmininfo).exec()
    User.create(superadmininfo,function (err, result) {
        if (err) return res.status(400).json({ data: err.message }); 

        //mail.sendmail();
        return res.json({status: "success", message: "User Created.", data: result});
        
        });
    }catch(err)
    {
        console.log("----err",err)
      return res.json({status:false ,error:err})
    }
}