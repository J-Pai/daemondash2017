require('../load.js');
var Classroom = require('/home/jpai/Documents/daemondash2017/app/models/classroom.js');

Classroom.getClassrooms({building: "csic"}, function (err, rooms) {
    console.log(rooms);
});
