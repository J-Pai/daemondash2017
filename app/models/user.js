/**
 * user.js
 * This contains the model for user accounts
 */

// Setup db connection
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
mongoose.Promise = global.Promise;

var userSchema = new Schema({
    name: String,
    local : {
        phonenumber: String, 
        password: String
    },
    meta: {
        verified: Boolean,
        code: String
    },
    reservations: [{
        room: String,
        building: String
    }],
    messages: [{
        from: String,
        body: String,
        time_received: Date
    }],
    sent_messages: [{
        from: String,
        body: String,
        time_received: Date
    }],
    friends: [String],
    groups: [Number]
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
