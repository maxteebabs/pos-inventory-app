const User = require('../models/User');
const Helpers = require('../helpers/utils');

module.exports = {
    addUser: (req, res, next) => {
        let {username, email, password} = req.body;
        let obj = {username, email, password};
        new User(obj).save((err, user) => {
            if(err) {
                res.send(err)
            }else if(!user){
                res.send(400);
            }else {
                console.log(user);
            }
            next();
        });
    },
    findAll: (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        User.find({ deleted: null}, null, { sort: { 'date_entered': -1 }}, (err, users) => {
            if(err || !users) {
                return res.status(401).json({status: false, error: 'Invalid request'});
            }
            return res.status(200).json({users: users});
        });   
    },
    
    passwordReset: (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        User.findOne({ email: req.body.email}, (err, user) => {
            if(err || user) {
                return res.status(401).json({status: false, error: 'Invalid Request'});
            }
            //generate token

            //send email
            return res.status(200).json({status: 'success'});
        });   
    },
    validateResetToken: (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        User.findOne({ resetToken : req.params.token, resetTokenDate : { $gte: Date.now() } }, (err, user) => {
            if(err || user) {
                return res.status(401).json({status: false, error: 'Invalid Request'});
            }
            return res.status(200).json({status: 'success', user: user.toJson() });
        });   
    },
    resetPassword: (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        User.findOne({ _id : req.body.id }, (err, user) => {
            if(err || user) {
                return res.status(401).json({status: false, error: 'Invalid Request'});
            }
            if(req.body.password === req.body.confirm_password) {
                user.password = req.body.password;
                user.save(err => {
                    if(err) {
                        return res.status(401).json(err);
                    }else {
                        return res.status(200).json({status: 'success', user: user.toJson() });
                    }
                });
            }
            
        });   
    },
    destroy: async (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        try {
            //get the auth user
            if(!await Helpers.isAdmin(req.body.userId)) {
                throw('User has to be an Administrator to delete a user');
            }
            User.findOne( { _id: req.params.id }, (err, user) => {
                if(err || !user) {
                    throw(err);
                }
                user.deleted = Date.now();
                user.save();
                return res.status(200).json({ msg: "user deleted successfully." });
            });
        }catch(err) {
            return res.status(401).json({msg: err});
        }
    }
}