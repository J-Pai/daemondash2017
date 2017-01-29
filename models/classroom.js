/**
 * classroom.js
 * This contains the model for classrooms
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var _ = require('lodash');
var User = mongoose.model('User');
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("classroom.js model connected to mongodb...");
});

var ClassroomSchema = new Schema({
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
	reserved: [{
		user: {
			type : ObjectId,
			ref : 'User',
		},
		day: String,
		time: String,
	}]
});

ClassroomSchema.statics = _.merge(ClassroomSchema.statics, {
	/**Reserves a room
	 * @param {Object} opts - Parameters for the room to reserve
	 * @param {String} opts.time - day and time that this will be reserved
	 * @param {ObjectId} opts.user - user that is reserving this time slot
	 * @param {String} opts.room - room to be reserved
	 * @param {String} opts.building - building the room is in
	*/
	reserve : function(opts, cb) {
		var Classroom = this;
		Classroom.update({
			building : opts.building,
			room : opts.room
		},
		{
			$addToSet : {
				reserved : {
					user : user,
					day : opts.day,
					time: opts.time,
				}
			}
		}).exec(function(err) {
			if (err) {
				console.log(err);
			}
		});
	},
	/**Removes reservation for a room
	 * @param {Object} opts - Parameters for the room to remove reservation from 
	 * @param {String} opts.user - user to remove from reservation
	 * @param {String} opts.room - room to be reserved
	 * @param {String} opts.building - building the room is in
	*/
	remove : function(opts, cb) {
		var Classroom = this;
		Classroom.update({
			building: opts.building,
			room : opts.room
		}, 
		{
			$pull : {
				user : opts.user
			}
		}).exec(function(err) {
			if (err) {
				console.log(err);
			}
		});
	}
});

var Classroom = mongoose.model('Classroom', ClassroomSchema);

module.exports = Classroom;
