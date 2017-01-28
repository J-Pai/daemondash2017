/**
 * passport.js
 * Code necessary for the handling of login and signup.
 */

var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user,done) {
        done(null,user.id);
    });
    passport.deserializeUser(function(id,done) {
        User.findById(id,function(err,user) {
            done(err,user);
        })
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallBack: true
        },
        function(req,username,password,done) {
            console.log(username);
            process.nextTick(function() {
                User.findOne({
                    'local.username': username
                }, function (err, user) {
                    if (err) return done(err);
                    if (user) {
                        return done(null,false,req.flash('signupMessage',
                            'That username is already taken.'));
                    } else {
                        var newUser = new User();

                        newUser.local.username = username;
                        newUser.local.password = newUser.generateHash(password);

                        console.log(newUser.local.username)

                        newUser.save(function(err) {
                            if (err) return done(err);
                            return done(null, newUser);
                        });
                    }
                })
            })
        }
    ));

}
