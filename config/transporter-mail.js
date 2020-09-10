const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: "ims.msnegi",
        pass: "negi@22341"
    }
});

transporter.verify(function(error, success) {
               if (error) {
                    console.log(error);
               } else {
                    console.log('Server is ready to take our messages');
               }
            });	
module.exports = transporter;           