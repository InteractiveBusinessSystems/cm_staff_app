Meteor.methods({
    AddUserToGroup: function (userId, group) {
        Meteor.users.update({_id: userId}, {$addToSet: {groups: group}});
    },
    RemoveUserFromGroup: function (userId, group) {
        Meteor.users.update({_id: userId}, {$pull: {groups: group}});
    },
    SetUserRole: function (userId, role) {
        Meteor.users.update({_id: userId}, {$set: {role: role}});
    }
});