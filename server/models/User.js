const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

let UserSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    fullname: {type: String, required: true},
    password: {type: String,  required: true},
    isActive: {type: Boolean, default: true},
    isAdmin: {type: Boolean, default: false},
    resetToken: {type: String},
    resetTokenDate: {type: Date, default: null},
    date_entered: {type: Date, default: Date.now},
    deleted: {type: Date, default: null}
});
UserSchema.method('comparePassword', function (password) {
    if (bcrypt.compareSync(password, this.password)) return true;
    return false;
});
UserSchema.methods.toJson = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

UserSchema.pre('save', function(next) {
// Check if document is new or a new password has been set
    // Saving reference to this because of changing scopes
    const document = this;
    // @ts-ignore
    bcrypt.hash(this.password, saltRounds,
    function(err, hashedPassword) {
    if (err) {
        next(err);
    }
    else {
        // @ts-ignore
        document.password = hashedPassword;
        next();
    }
    });
});
module.exports = mongoose.model('User', UserSchema);