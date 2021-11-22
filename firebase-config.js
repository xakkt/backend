var admin = require("firebase-admin");

// var serviceAccount =  require("./xakkt-grocery.json");
// var key = 'AAAA0r_CIVo:APA91bEnbhrsj9726TmWMcupZ4KSSetg5pDF2LoXy2j0bnGjYA7-bejiWvkH-WddDxAllgauhJ6_Jm8H-SIal0kcEvkuw-E2yIxyItInHQNAf0PqRFOodjc1kMAjRVNoM9tN3DhpCILS'
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://xakkt-grocery-387b2-default-rtdb.firebaseio.com"
//   });
  var serviceAccount =  require("./xakkt-3981c-firebase-adminsdk-rns9z-1e6b61e13c.json");
 var key = 'AAAAtVWi260:APA91bES03m-fyc2ygrl2ry4e25SfgTfTvj2KKb3t_kXwQlj133NcFgPGjHUjPB472w72ymVzb5NT0_KL58QN5Fu1GPw8Ei-4IgMk0lUfKYQ5AAxzNEn81Yhd_GR4QlAWGyLseighDJ1'
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://xakkt-3981c-default-rtdb.firebaseio.com"
  });

module.exports  = admin
