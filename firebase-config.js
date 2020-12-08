var admin = require('firebase-admin')
var serviceAccount = require("./push.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://push-f1dae-default-rtdb.firebaseio.com"
})
module.exports  = admin
