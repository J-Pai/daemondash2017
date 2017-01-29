/**
 * user.js
 * This contains the model for user accounts
 */

// Setup db connection
var mongoose = require('mongoose');
var async = require('async');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("user.js model connected to mongodb...");
});

var userSchema = new Schema({
    name: String,
    username: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    meta: {
        verified: Boolean,
        phone: String,
        code: String
    },
    reservations: [{
        room : String,
        building: String,
    }],
    created_at: Date,
    updated_at: Date
});

var User = mongoose.model('User', userSchema);

module.exports = User;
