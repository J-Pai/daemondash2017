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
mongoose.connect('');
mongoose.promise = global.Promise;
var models = require('./config');
var User = mongoose.model('User');
var Classroom = mongoose.model('Classroom');
var Group = mongoose.model('Group');

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
    socket.on('group select', function(groupId) {
        Group.findOne({ groupId: parseInt(groupId.split('_')[1]) },
            function (err, group) {
                if (err) throw err;
                io.emit('change data', group);
            }
        );
    })
    socket.on('get building', function(building) {
    	Classroom.getClassrooms({building: building}, function(err, rooms) {
    		io.emit('set rooms', rooms);
    	});
    });
    socket.on('clear all', function(id) {
    	var str = id.toString();
    	str = "+" + str[0] + " (" + str.substring(1,4) + ") " + str.substring(4,7) + "-" + str.substring(7);
    	console.log(str);
    	Classroom.update({
    		reserved : {
    			$elemMatch: {
    				user: str
    			}
    		}
    	},
    		{ $pull : { 
    			reserved : { user : str }
    		}
    	},{multi: true}).exec(function(err) {
    		if (err) {
    			console.log(err);
    		}
    		console.log('done');
    	});
    });
});


http.listen(app.get('port'), function() {
    console.log("room_phil Live at Port " + app.get('port'));
});
