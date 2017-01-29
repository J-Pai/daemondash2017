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

    passport.use('local-signup', new LocalStrategy(
        function(username,password,done) {
            username = username.toLowerCase();
            process.nextTick(function() {
                User.findOne({
                    'local.username': username
                }, function (err, user) {
                    if (err) return done(err);
                    if (user) {
                        console.log('Username exists...')
                        return done(null, false, { message: 'That username is already taken.'});
                    } else {
                        console.log('Creating new user...')
                        var newUser = new User();

                        newUser.local.username = username;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err) return done(err);
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy(
        function(username,password,done) {
            username = username.toLowerCase();
            User.findOne({
                'local.username' : username
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
