var mongoose = require('mongoose');
mongoose.connect('mongodb://daemondash:Mech*123@ds133249.mlab.com:33249/jpai_mongodb_main');
var data = require('./info.json');
var _ = require('lodash');
var models = require('./config');
var async = require('async');
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
    seconds += min * 60;
    if (hour === 12) {
        if (ampm === "pm") {
            seconds += 12 * 60 * 60;
        }
    } else {
        if (ampm === "pm") {
            seconds += (hour + 12) * 60 * 60;
        } else {
            seconds += hour * 60 * 60;
        }
    }
    return seconds;
}
var database = {};
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
            var start_time = convert_time(loc.start_time);
            var end_time = convert_time(loc.end_time);
            var id = loc.building + "-" + loc.room;
            if (id in database) {
                var obj = {
                    department: dept,
                    course: course,
                    section: section,
                    days: new_days,
                    start: start_time,
                    end: end_time,
                };
                database[id].class.push(obj);
            } else {
                var obj = {
                    building : loc.building,
                    room : loc.room,
                    class : [{
                        department : dept,
                        course : course,
                        section : section,
                        days : new_days,
                        start : start_time,
                        end : end_time
                    }]
                }
                database[id] = obj;
            }
        }
    });
});
async.each(database, function(d, cb) {
    var classroom = new Classroom(d);
    classroom.save(function(err) {
        cb();
    })
}, function(err) {
    console.log("done");
    mongoose.connection.close();
})

