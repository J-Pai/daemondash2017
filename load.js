var mongoose = require('mongoose');
mongoose.connect('mongodb://daemondash:Mech*123@ds133249.mlab.com:33249/jpai_mongodb_main');
var data = require('./info.json');
var _ = require('lodash');
var models = require('./models/classroom');
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
_.forEach(data, function(value, key) {
    var split = key.split('-');
    var dept = split[0].substr(0,4);
    var course = split[0].substr(4);
    var section = split[1];
    _.forEach(value, function(loc) {
        var new_days = [];
        var end = 0;
        var start = 0;
        if (loc.days && loc.days !== "TBA" && loc.building && loc.room) {
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
            Classroom.find({
                building: loc.building,
                room: loc.room,
            }).count().exec(function(err, result) {                
                if (result !== 0) {
                    Classroom.update({
                        building: loc.building,
                        room: loc.room,
                    }, 
                    {
                        $addToSet: { 
                            class: {
                                department: dept,
                                course: course,
                                section: section,
                                day: new_days,
                                start: loc.start_time,
                                end: loc.end_time,
                            }
                        }
                    });
                } else {
                    var classroom = Classroom({
                        building: loc.building,
                        room: loc.room, 
                        class: [{
                            department: dept,
                            course: course,
                            section: section,
                            days: new_days,
                            start: loc.start_time,
                            end: loc.end_time,
                        }]                    
                    });
                    classroom.save(function(err) {
                        if (err) {
                            console.log(err);
                            console.log(classroom);
                        }
                    });
                }
            });
        }
    })
    
});

