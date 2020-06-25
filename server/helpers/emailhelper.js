"use strict";
const nodemailer = require("nodemailer");
const path = require('path');
const auth = {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
    // type: 'OAuth2',
    // clientId: process.env.CLIENTID,
    // clientSecret: process.env.CLIENTSECRET,
    // // expires: process.env.EXPIRES,
    // refreshToken: process.env.REFRESHTOKEN,
    // accessToken: process.env.ACCESSTOKEN
};
// console.log(auth);
let transporter = nodemailer.createTransport({
    // host: "smtp.mail.yahoo.com",
    service: 'Gmail',
    // service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: auth,
    requireTLS: true,
    // scope: ["https://www.googleapis.com/auth/gmail.send"]
});
// let templatePath = path.join(__dirname, "../templates");
// var handlebarsOptions = {
//     viewEngine: 'handlebars',
//     viewPath: templatePath,
//     extName: '.html'
//   };
  
const EmailHelper = {
    // create reusable transporter object using the default SMTP transport
    send: (user, subject, message) => {
        // var hbs = require('nodemailer-express-handlebars');
        //attach the plugin to the nodemailer transporter
        // transporter.use('compile', hbs(handlebarsOptions));
        return new Promise((resolve, reject) => {
            transporter.sendMail({
                from: process.env.EMAIL, // sender address
                to: user.email, // list of receivers
                subject: subject, // Subject line
                // template: 'forgot_password',
                // context: {
                //     url: `${process.BASEURL}/change/password/${token}`,
                //     name: user.fullname.split(' ')[0]
                // }
                text: message,// plain text body
                html: message, // html body
                auth: auth
            }, (err) => {
                let response = { msg: "", status: "" };
                if (!err) {
                    response.msg = "Password reset successful";
                    response.status = "Success";
                } else {
                    response.msg = err;
                    response.status = "Failed";
                }
                resolve(response);
            });
        });
    }
}
module.exports = EmailHelper;