/**
 * group.js
 * This contains the model for groups
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var _ = require('lodash');
var User = mongoose.model('User');
mongoose.Promise = global.Promise;

var groupSchema = new Schema({
    groupId: { 
        type: Number,
        required: true
    },
    creator: {
        type: Number,
        required: true
    }, 
    members: [String],
    invitations: [String],
    reservations: [{
        room: String,
        building: String
    }]
});

groupSchema.statics = _.merge(groupSchema.statics, {
    getMaxId: function(cb) {
         Group.findOne({}).sort('-groupId').exec(cb);
    },
    getUserGroups: function(opts, cb) {
        Group.find({
            $or : [ { creator: opts.phonenumber },
                { members: opts.phonenumber } ]
        }, cb);
    },
    createGroup: function(opts, cb) {
        var next_id = 0;
        var newGroup = new this({
            groupId: -1,
            creator: opts.creator
        });
        this.getMaxId(function(err, group) {
            if (err) throw err;
            if (!group) next_id = 0;
            else next_id = group.groupId + 1;
            console.log(group);
            newGroup.groupId = next_id;
            newGroup.save(cb);
        });
    },
    deleteGroup: function(opts, cb) {
        Group.findOne({
            groupId: opts.groupId
        }).remove(cb);
    },
    invite: function(opts, cb) {
        Group.findOne({
            groupId: opts.groupId
        }, function(err,group) {
            if(err) throw err;
            console.log(group);
            group.invitations.push(opts.phonenumber);
            group.save(cb);
        });
    },
    join: function(opts, cb) {
        Group.findOne({
            groupId: opts.groupId
        }, function(err,group) {
            if (err) throw err;
            group.members.push(opts.phonenumber);
            group.invitations.remove(opts.phonenumber);
            group.save(cb);
        });
    },
    leave: function(opts, cb) {
        Group.findOne({
            groupId: opts.groupId
        }, function(err,group) {
            if (err) throw err;
            group.members.remove(opts.phonenumber);
            group.save(cb);
        });
    }
})

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;
