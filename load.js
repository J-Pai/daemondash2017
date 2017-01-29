var mongoose = require('mongoose');
mongoose.connect('mongodb://daemondash:Mech*123@ds133249.mlab.com:33249/jpai_mongodb_main');
var data = require('./info.json');
var _ = require('lodash');
var models = require('./config');

var User = mongoose.model("User");
var Classroom = mongoose.model("Classroom");

var days = {
    "M": "Monday",
    "Tu": "Tuesday",
    "W": "Wednesday",
    "Th": "Thursday",
    "F" : "Friday",
    "Sa": "Saturday",
    "Su": "Sunday",
};

//converts time to seconds since 00:00:00
//time is a string
function convert_time(time) {
    var hour = parseInt(time.substr(0, time.length-2).split(':')[0]);
    var min = parseInt(time.substr(0, time.length-2).split(':')[1]);
    var ampm = time.substr('-2');
    var seconds = 0;
    seconds += hour * 60 * 60;
    seconds += min * 60
    if (ampm === "pm") {
        seconds += 12 * 60 * 60;
    }
    console.log(seconds);
}

_.forEach(data, function(value, key) {
    var split = key.split('-');
    var dept = split[0].substr(0,4);
    var course = split[0].substr(4);
    var section = split[1];
    _.forEach(value, function(loc) {
        var new_days = [];
        var end = 0;
        var start = 0;
        if (loc.days && loc.days !== "TBA" && loc.building && loc.room && loc.start_time && loc.end_time) {
            //convert 'MWF' to [Monday, Wednesday, Friday]
            while (end < loc.days.length) {
                var sub = loc.days.substr(start, (end - start) + 1);
                if (sub in days) {
                    new_days.push(days[sub]);
                } else {
                    while (!(sub in days)) {
                        end++;
                        sub = loc.days.substr(start, (end - start) + 1);
                    }
                    new_days.push(days[sub]);
                }
                end++;
                start = end;
            }
            convert_time(loc.start_time);
            // Classroom.find({
            //     building: loc.building,
            //     room: loc.room,
            // }).count().exec(function(err, result) {                
            //     if (result !== 0) {
            //         Classroom.update({
            //             building: loc.building,
            //             room: loc.room,
            //         }, 
            //         {
            //             $push: { 
            //                 class: {
            //                     department: dept,
            //                     course: course,
            //                     section: section,
            //                     days: new_days,
            //                     start: loc.start_time,
            //                     end: loc.end_time,
            //                 }
            //             }
            //         }).exec(function(err) {
            //             if (err) {
            //                 console.log(err);
            //             }
            //         });
            //     } else {
            //         var classroom = Classroom({
            //             building: loc.building,
            //             room: loc.room, 
            //             class: [{
            //                 department: dept,
            //                 course: course,
            //                 section: section,
            //                 days: new_days,
            //                 start: loc.start_time,
            //                 end: loc.end_time,
            //             }]                    
            //         });
            //         classroom.save(function(err) {
            //             if (err) {
            //                 console.log(err);
            //                 console.log(classroom);
            //             }
            //         });
            //     }
            // });
        }
    })
    
});

