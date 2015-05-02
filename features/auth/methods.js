Meteor.methods({
    AddUserToGroup: function (userId, groups) {
        Meteor.users.update({_id: userId}, {$push: {groups: groups}});
    },
    RemoveUserFromGroup: function (userId, groups) {
        Meteor.users.update({_id: userId}, {$pull: {groups: groups}});
    },
    SetUserRole: function (userId, role) {
        Meteor.users.update({_id: userId}, {$set: {role: role}});
    }
});