/**
 * routes.js
 * Specifies the routes in which the web application utilizes
 */
var User = require('../app/models/user');
var Classroom = require('../app/models/classroom');
var Group = require('../app/models/group');

module.exports = function(app, passport) {
    // Page routing
    app.get('/', function(req, res) {
        if(req.isAuthenticated())
            res.redirect('/home');
        else {
            res.render('pages/index', { message: req.flash('error')[0] });
        }
    });

    app.get('/about', function(req,res) {
        res.render('pages/about');
    });

    app.get('/home', isLoggedIn, function(req, res) {
        res.render('pages/home', { user: req.user });
    });

    app.get('/groups', isLoggedIn, function(req, res) {
        var ext_groups = null;
        Group.getUserGroups({'phonenumber': req.user.local.phonenumber}, function (err,groups){
            if (err) throw err;
            if (groups) {
                ext_groups = groups;
            }
            res.render('pages/groups', { user: req.user, groups: ext_groups });
        });
    });
    
    app.get('/link', function(req, res) {
        res.render('pages/link');
    });
    app.get('/reservations', function(req, res) {
        function convert(num) {
            var date = new Date(null);
            date.setSeconds(num);
            return date.toISOString().substr(11, 5);
        }
        Classroom.find({
            reserved : {
                $elemMatch : {
                    user : req.user.local.phonenumber
                }
            }
        }, function(err, result) {
            res.render('pages/reservations', { user : req.user.local.phonenumber, classrooms : result, change: convert});
        });
    });

    app.get('/logout', function(req,res) {
        req.logout();
        res.redirect('/')
    });
    // Page not found error
    app.get('/404', function(req,res,next) {
        // Trigger a 404
        next();
    });
    
    // API
    app.post('/signup', function(req, res) {
        passport.authenticate('local-signup', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        })(req,res);
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));
    
    app.post('/createGroup', function(req, res) {
        Group.createGroup({phonenumber: req.user}, function(err,group) {
            if (err) throw err;
            console.log(group);
        });
        res.end();
    });

    app.post('/reserve', function(req, res)  {
        Classroom.reserve({
            user: req.user,
            data: req.body.data
        });
    });

    app.use(function(req, res, next) {
        res.status(404);
        res.render('pages/404', {url: req.url});
        return;
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    req.flash('error', 'Not logged in.')
    res.redirect('/');
}
