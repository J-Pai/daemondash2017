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
    creator: [String], 
    members: [String],
    invitations: [{
        user: String,
        accepted: Boolean
    }]
});

groupSchema.statics = _.merge(groupSchema.statics, {
})

var Group = mongoose.model('Group', groupSchema);

module.exports = Group;
