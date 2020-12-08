var admin = require("firebase-admin");
var serviceAccount =  require("./xakkt-grocery.json");
var key = 'AAAA0r_CIVo:APA91bEnbhrsj9726TmWMcupZ4KSSetg5pDF2LoXy2j0bnGjYA7-bejiWvkH-WddDxAllgauhJ6_Jm8H-SIal0kcEvkuw-E2yIxyItInHQNAf0PqRFOodjc1kMAjRVNoM9tN3DhpCILS'
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://xakkt-grocery-387b2-default-rtdb.firebaseio.com"
  });
module.exports  = admin
