Template.listUsers.helpers({
    "userlist": function () {
        return Meteor.users.find({});
    },
    "getEmail": function (emails) {
        return emails[0].address;
    }
});

Template.listUsers.events({
    "submit #addUserForm": function (event) {
        Meteor.call("CreateAccount", event.target.email.value);
        return false;
    }
});