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
    groupId: Number,
    creator: {
        type: ObjectId,
        ref: 'User'
    }
    members: [{
        type: ObjectId,
        ref: 'User'
    }],
    invitations: [{
        user: {
            type: ObjectId,
            ref: 'User'
        },
        accepted: Boolean
    }]
});

groupSchema.statics = _.merge(groupSchema.statics, {
    group.createGroup
})

var Group = momngoose.model('Group', groupSchema);

module.exports = Group;
