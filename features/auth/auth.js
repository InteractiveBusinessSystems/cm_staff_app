Accounts.config({
    forbidClientAccountCreation: true
});

if (Meteor.isServer) {
    Meteor.startup(function () {
        //Meteor.users.remove({});
        if (Meteor.users.findOne({"emails.address": "ibs@ibs.com"}) == null) {
            Accounts.createUser({
                email: "ibs@ibs.com",
                password: "garden",
                role: "admin"
            });
        }
        if (Meteor.users.findOne({"emails.address": "user@ibs.com"}) == null) {
            Accounts.createUser({
                email: "user@ibs.com",
                password: "garden",
                role: "user"
            });
        }
    });

    Accounts.onCreateUser(function (options, user) {
        user.profile = options.profile;
        user.role = options.role || "user";
        user.groups = ['Everyone'];
        return user;
    });

    Meteor.publish("userData", function () {
        if (this.userId) {
            return Meteor.users.find({_id: this.userId},
                {fields: {'role': 1, 'groups': 1}});
        } else {
            this.ready();
        }
    });

    //TODO: secure this
    Meteor.publish("allUserData", function () {
        return Meteor.users.find({}, {
            fields: {
                'role': 1,
                'groups': 1,
                'emails': 1,
                'profile': 1
            }
        });
    });
}

if (Meteor.isClient) {
    Meteor.subscribe('userData');
    Meteor.subscribe("allUserData");
}