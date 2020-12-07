var FCM = require('fcm-node');
var serverKey = 'AAAAlADFJtE:APA91bFhSI_2wFJCGVM8ZCB18VN44mEK5cCYUw-PjCnNi2q7zroYYsgMXxI9-c24nbAXKUZyFesub8dI3ws1Tf6pLM6izNDkTMJUpG6ZR_Oe32pVQsU8-Zn5oT2wQDSeo6z8AICTV7ID'
var fcm = new FCM(serverKey);

exports.push = async(req,res) =>{
    console.log("--logsssss")
var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: 'fzLHmLLbUk6qupbvtt_shP:APA91bFu9KQ1ISpG6QS6b8KcmmYf6plvlnrBtp6XbxP4ZHZaMZwdLHus6B1J03TWxbXFSSp8DgBHcOuLzyFGeHcYHaYTi4vr-LtEMQYoS9hgAbLBOdgYwyHpPULbxVZHSIzk-x77F4FI', 
    // collapse_key: 'your_collapse_key',
    
    notification: {
        title: 'Title of your push notification', 
        body: 'Body of your push notification' 
    },
    
    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
};

fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!",err);
    } else {
        console.log("Successfully sent with response: ", response);
    }
})
}