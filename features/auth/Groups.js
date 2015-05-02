Groups =  {

    AddUserToGroup: function (userId, groups) {
        Meteor.call("AddUserToGroup", userId, groups);
    },

    RemoveUserFromGroup: function (userId, groups) {
        Meteor.call("RemoveUserFromGroup", userId, groups);
    },

    UserHasGroup: function (group) {
        return Meteor.user().groups.indexOf("group") !== -1;
    }
};