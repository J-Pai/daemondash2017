/**
 * server.js
 * Main code for the web application backend
 */

// Dependencies
var express = require('express');
var http = require("http");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Authentication Dependencies
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// Database Declaration/connection
mongoose.connect('mongodb://daemondash:Mech*123@ds133249.mlab.com:33249/jpai_mongodb_main');
mongoose.promise = global.Promise;
var models = require('./config');
var User = mongoose.model('User');
var Classroom = mongoose.model('Classroom');

// Server Configuration
app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

// Authentication Configuration
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Required for passport
app.use(session({ 
    secret : 'kycu9r49UcvTUh5d4zF3b8TVV8IErBpx',
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

// Routing
require('./app/routes.js')(app, passport);

io.on('connection', function(socket) {
    console.log('A user has connected...');
    socket.on('get building', function(building) {
    	Classroom.getClassrooms({building: building}, function(err, rooms) {
    		io.emit('set rooms', rooms);
    	})
    })
})

http.listen(app.get('port'), function() {
    console.log("room_phil Live at Port " + app.get('port'));
});
