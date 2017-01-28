/**
 * classroom.js
 * This contains the model for classrooms
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("classroom.js model connected to mongodb...");
});

var classroomSchema = new Schema({
	room: {
		type: String,
		required: true,
	},
	building: {
		type: String,
		required: true,
	},
	locked: {
		type: Date,
	},
	class: [{
		department: String,
		course: String,
		section: String,
		days: [String],
		start: String,
		end: String,
	}],
	reserved: {
		days: [{
			day: String,
			time: String,
		}],
	}
});
var Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;
