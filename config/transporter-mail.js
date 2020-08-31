const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
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