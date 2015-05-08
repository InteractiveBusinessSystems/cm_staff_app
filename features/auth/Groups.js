Groups = {
    PossibleGroups: ['Everyone', 'Volunteers', 'Committee Members', 'Committee Chairs', 'Board Members'],

    AddUserToGroup: function (userId, group) {
        Meteor.call("AddUserToGroup", userId, group);
    },

    RemoveUserFromGroup: function (userId, group) {
        Meteor.call("RemoveUserFromGroup", userId, group);
    },

    /**
     * @return {boolean}
     */
    UserHasGroup: function (group) {
        return Meteor.user().groups.indexOf("group") !== -1;
    }
};