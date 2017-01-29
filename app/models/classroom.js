/**
 * classroom.js
 * This contains the model for classrooms
*/

var mongoose = require('mongoose');
var async = require('async');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var _ = require('lodash');
var User = mongoose.model('User');
mongoose.Promise = global.Promise;

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
        start: Number,
        end: Number,
    }],
    reserved: [{
        user: String,
        day: String,
        start: Number,
        end: Number,
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
        async.waterfall([
            function(d) {
                var result = [];
                opts.data.forEach(function(dat) {
                    opts.building = dat.buildingname;
                    opts.room = dat.room;
                    var s_hour = parseInt(dat.time.split(':')[0]);
                    var s_min = parseInt(dat.time.split(':')[1]);
                    var e_hour = s_hour
                    var e_min = s_min + 15;
                    var start = (s_hour * 60 * 60) + (s_min * 60);
                    if (e_min === 60) {
                        e_hour += 1;
                        e_min = 0;
                    }
                    var end = (e_hour * 60 * 60) + (e_min * 60);
                    var obj = {
                        user : opts.user.name,
                        day : dat.day,
                        start : start,
                        end : end,
                    }
                    result.push(obj);
                })
                d(null, result);
            },
            function(arr, d) {
                async.forEach(arr, function(value, c) {
                    Classroom.update({
                        building : opts.building,
                        room : opts.room
                    },
                    {
                        $addToSet : {
                            reserved : {
                                user : value.user,
                                day : value.day,
                                start : value.start,
                                end : value.end
                            }
                        }
                    }).exec(function(err) {
                        if (err) {
                            console.log(err);
                        }
                        c();
                    });
                }, d);
            }
        ], function(err, result) {
            console.log('done');
            if (err) {
                console.log(err);
            };
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
    },

    /**Gets top 3 rooms with longest times to return as a sms
     * @param {Object} opts - Parameters for this function 
     * @param {String} opts.building - building that you want to view rooms in
     * @param {String} opts.dat - current day
     * @param {String} opts.time - current time
    */
    getTop : function(opts, cb) {
        Classroom.find({
            building: opts.building,
            
        })
        collection.find({
            "building" : building_acronym,
            "class" : { $all : {
                "$or" : [
                    {"start" : { "$gt" : time }},
                    {"end" : { "$lt" : time }},
                ]
            } }
        });
    },

    /**Gets top 3 rooms with longest times to return as a sms
     * @param {Object} opts - Parameters for this function 
     * @param {String} opts.building - building that you want to view rooms in
     * @param {String} opts.time - current time
    */
    getClassrooms : function(opts, cb) {
        var Classroom = this;
        Classroom.find({
            'building': opts.building 
        }).sort('room').exec(cb);
    }
});

var Classroom = mongoose.model('Classroom', ClassroomSchema);

module.exports = Classroom;
