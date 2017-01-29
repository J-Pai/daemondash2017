var mongoose = require('mongoose');
mongoose.connect('mongodb://daemondash:Mech*123@ds133249.mlab.com:33249/jpai_mongodb_main');
require('../config');
var Classroom = require('/home/jpai/Documents/daemondash2017/app/models/classroom.js');

Classroom.getClassrooms({building: "CSI"}, function (err, rooms) {
    console.log(rooms);
    mongoose.connection.close();
});
