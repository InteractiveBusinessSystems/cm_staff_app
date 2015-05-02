Template.listUsers.helpers({
    "userlist": function () {
        return Meteor.users.find({});
    },
    "getEmail": function (emails) {
        return emails[0].address;
    }
});