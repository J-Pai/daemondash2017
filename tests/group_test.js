var mongoose = require('mongoose');
mongoose.connect('mongodb://daemondash:Mech*123@ds133249.mlab.com:33249/jpai_mongodb_main');
require('../config');
var group = require('/home/jpai/Documents/daemondash2017/app/models/group.js');

//group.createGroup({phonenumber: '+1 (123) 456-7890'}, function(err,group) {
//    if (err) throw err;
//    console.log(group);
//});
group.createGroup({creator: '+1 (123) 456-7890'}, function(err,group) {
    if (err) throw err;
    console.log(group);
});

