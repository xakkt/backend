var admin = require('firebase-admin')
var serviceAccount = require("./xakkt-grocery.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://xakkt-grocery-387b2-default-rtdb.firebaseio.com"
  });
module.exports  = admin
