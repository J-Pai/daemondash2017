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
            usernameField: 'phonenumber',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req,phonenumber,password,done) {
            User.findOne({
                'local.phonenumber': phonenumber
            }, function (err, user) {
                var pattern = /^\+\d \(\d{3}\) \d{3}-\d{4}$/;
                var match = pattern.exec(phonenumber);
                console.log(match);
                if (err) return done(err);
                if (user) {
                    console.log('Username exists...');
                    return done(null, false, { message: 'That username is already taken.'});
                } else if (!match){
                    console.log('Phonenumber is NOT a valid phonenumber');
                    return done(null, false, { message: 'Phone number is invalid.' });
                }else {
                    console.log('Creating new user...');
                    var newUser = new User();

                    newUser.local.phonenumber = phonenumber;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.name = req.body.name;

                    newUser.save(function(err) {
                        if (err) return done(err);
                        return done(null, newUser);
                    });
                }
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'phonenumber',
            passwordField: 'password'
        },
        function(phonenumber,password,done) {
            phonenumber = phonenumber.toLowerCase();
            User.findOne({
                'local.phonenumber' : phonenumber
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    console.log('User not found...');
                    return done(null, false, { message: 'No user found.'});
                }
                if (!user.validPassword(password)) {
                    console.log('Incorrect password...');
                    return done(null, false, { message: 'Wrong Password.'});
                }
                return done(null, user);
            });
        }));

}
