/**
 * user.js
 * This contains the model for user accounts
 */

// Setup db connection
var mongoose = requre('mongoose');
mongoose.connect('mongodb://daemondash:Mech*123@ds133249.mlab.com:33249/jpai_mongodb_main');
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
        verified: boolean,
        phone: String,
        code: String
    },
    reservations: [String],
    created_at: Date,
    updated_at: Date
});

var User = moongoose.model('User', userSchema);

module.exports = User;
