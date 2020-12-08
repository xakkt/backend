const admin  =  require('../../firebase-config');
const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };
exports.firebase = async(req,res) =>{
    try{
    const  registrationToken = 'eKwLWOdcD05cs56p0sS0Lf:APA91bH3g9Znv89NoervuQGVMty6Jv7lgnAsqM_5kUOQmQtvtye654b1nlUKNTjNWenn0rZKkbgHsyQ5GBHpr8qSqVZE1iaAXCRdZ5cy8HangxaurqimqCoB7QtdooSg_wIvq8hTX9E-'
    const message = req.body.message
    const options = {
        priority: 'high',
        timeToLive: 60 * 60 * 24, // 1 day
      };
          const payload = {
        'notification': {
          'title': 'test',
          'body': 'test',
        }, 
        // NOTE: The 'data' object is inside payload, not inside notification
        'data': { 
              'personSent': 'test' 
        }
      };
    admin.messaging().sendToDevice(registrationToken, payload,options)
    .then( response => {
       return res.status(200).json({message:"Notification sent successfully",data:response})
    })
    .catch( error => {
        console.log(error);
    })
}
catch(err)
{
    console.log('errr',err);

}
}