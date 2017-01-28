/**
 * server.js
 * Main code for the web application backend
 */

// Dependencies
var express = require('express');
var http = require('http');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Helper Dependencies
var Account = require('./helpers/account.js');
var acc = new Account;
// Server Configuration
app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

// Routing
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/home', function(req, res) {
    res.render('pages/home');
});

// API
app.post('/create_user', acc.create_user);
app.post('/login', acc.login);

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

// Socker and Web Server Initialization
io.on('connection', function(socket) {
    console.log('A user has connected...')
});

http.listen(app.get('port'), function() {
    console.log("room_phil Live at Port " + app.get('port'));
});
