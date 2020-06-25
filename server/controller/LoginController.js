// @ts-ignore
let jwt = require('jsonwebtoken');
require('dotenv').config();
let User = require('../models/User');
var Helpers = require('../helpers/utils');
var EmailHelper = require('../helpers/emailhelper');
const secret = process.env.SECRET;

module.exports = {
    login: (req, res, next) => {
        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        let {email, password} = req.body;
        User.findOne({email: email.toLowerCase()}, (err, user) => {
            if(err || !user) {
                res.status(401).json({status: false, error: 'Incorrect email/password'});
            }else{
                if(user.comparePassword(password)) {
                    var payload = user.toJson();
                    payload.id = payload._id;
                    const token = jwt.sign(payload, secret, {expiresIn: "24h"});
                    res.cookie('token', token, {httponly: true}
                    ).status(200).json({user: payload, token: token});
                }else{
                    res.status(401).json({status: false, error: 'Incorrect email/password'});
                }
            }
        });
    },
    register: async (req, res, next) => {
        let {email, password, confirm_password, fullname} = req.body;
        if(password === confirm_password) {
            //check if we have a user in the system
            let checkUser = await User.findOne({ deleted: null });
            var user = new User({email:email.toLowerCase()
                , password: password, fullname: fullname}); 
            if(!checkUser)
                //make the first user an administrator
                user.isAdmin = true;

            return user.save((err) =>  {
                if(err) {
                    res.status(401).json({status: false, error: 'Error registering new user'});
                }else{
                    res.status(200).json({status: true, message: 'Success'});
                }
            });
        }
        res.status(401).json({status: false, error: "Password combination does not match"});
    },    
    forgotPassword: async (req, res, nex) => {
        let {email} = req.body;
        // lets find the user
        let user = await User.findOne({ deleted: null, email: email.toLowerCase() });
        if(user) {
            //generate token
            var payload = user.toJson();
            payload.id = payload._id;
            const token = jwt.sign(payload, secret, { expiresIn: "1h" });
            //send an email
            let message = `<h3>Dear ${user.fullname.split(" ")[0]},</h3>
                <p> <p>You requested for a password reset, 
                    kindly use this <a href="${process.env.BASEURL}/change/password/${token}">link</a> 
                    to reset your password</p></p>`;

            let resp = await EmailHelper.send(user, "Password Reset", message);
            if(resp.status == 'Failed') {
                console.log(resp.response);
                res.status(401).json({ status: false, error: "Password reset failed. Please try again." });
            }else{
                res.status(200).json(resp);
            }
        }else {
            res.status(401).json({status: false, error: "Email does not exist"});
        }
    },
    reset: async (req, res, nex) => {
        let {password, confirm_password} = req.body;
        // lets find the user
        let user = await User.findOne({ deleted: null, email: email });
        if(user) {
            //generate token
            //send an email
        }else {
            res.status(401).json({status: false, error: "Email does not exist"});
        }
    },
    changePassword: async (req, res, nex) => {
        let {token, password, confirm_password} = req.body;
        //lets decode the token
        var payload = jwt.decode(token, secret);
        if(!payload) {
            res.status(401).json({ status: false
                , error: "Your password cannot be changed. Please try again later." });
        }
        // lets find the user
        let user = await User.findOne({ deleted: null, email: payload.email });
        if(user) {
            //update the password
            if (password === confirm_password) {
                user.password = password;
                return user.save((err) => {
                    if (err) {
                        res.status(401).json({ status: false, msg: 'Password reset failed' });
                    } else {
                        res.status(200).json({ status: true, msg: 'Your password was changed successfully.' });
                    }
                });
            }else {
                res.status(401).json({ status: false, error: "Password does not match" });
            }
        }else {
            res.status(401).json({status: false, error: "Email does not exist"});
        }
    },
    validateResetPassword: (req,res,next) =>  {
        //retrieves and validate token
        if(tokenIsValidated) {
            res.status(200).json({status: true, error: "Success"});
        }else{
            res.status(401).json({status: false, error: "Invalid Token"});
        }
    }
}