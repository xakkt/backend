const admin  =  require('../../firebase-config');
const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
  };
exports.firebase = async(req,res) =>{
    try{
    const  registrationToken = req.body.registrationToken
    console.log("---logs0",registrationToken)
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