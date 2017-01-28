/**
 * routes.js
 * Specifies the routes in which the web application utilizes
 */
module.exports = function(app, passport) {
    app.get('/', function(req, res) {
        res.render('pages/index', {
            loginMessage: req.flash('loginMessage'),
            signupMessage: req.flash('signupMessage')
        });
    });
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/home',
        failureRedirect: '/fail',
        failureFlash: true
    }));

    app.get('/home', isLoggedIn, function(req, res) {
        res.render('pages/home', {
            user: req.user
        });
    });

    app.get('/logout', function(req,res) {
        req.logout();
        res.redirect('/')
    })
    // Page not found error
    app.get('/404', function(req,res,next) {
        // Trigger a 404
        next();
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
    res.redirect('/');
}
