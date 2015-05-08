Template.group.helpers({
    'usersInGroup': function () {
        return Meteor.users.find({'groups': Router.current().params.groupName});
    },
    usersNotInGroup: function () {
        return Meteor.users.find({'groups': {$ne:Router.current().params.groupName}});
    },
    email: function(user) {
        return user.emails[0].address;
    }
});

Template.group.events({
    'click .not-in-button': function(user) {
        console.log(this);
        Groups.AddUserToGroup(this._id, Router.current().params.groupName);
        return false;
    },
    'click .in-button': function() {
        Groups.RemoveUserFromGroup(this._id, Router.current().params.groupName);
        return false;
    }
})