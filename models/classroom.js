var mongoose = requre('mongoose');
mongoose.connect('mongodb://daemondash:Mech*123@ds133249.mlab.com:33249/jpai_mongodb_main');
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
	class: {
		days: [String],
		time: [String],
	}
	reserved: {
		days: [String],
		time: [String].
	}
});
var Classroom = mongoose.model('Classroom', classroomSchema);

module.exports = Classroom;
