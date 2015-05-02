Accounts.config({
    forbidClientAccountCreation: true
});

if(Meteor.isServer) {
    Meteor.startup(function() {
        //Meteor.users.remove({});
        if(Meteor.users.findOne({"emails.address":"ibs@ibs.com"}) == null) {
            Accounts.createUser({
                email: "ibs@ibs.com",
                password: "garden",
                role: "admin"
            });
        }

    });

    Accounts.onCreateUser(function (options, user) {
        user.profile = options.profile;
        user.role = options.role || "user";
        user.groups = [];
        return user;
    });

    Meteor.publish("userData", function () {
        if (this.userId) {
            var find = Meteor.users.find({_id: this.userId},
                {fields: {'role': 1, 'groups': 1}});
            return find;
        } else {
            this.ready();
        }
    });
}

if(Meteor.isClient) {
    Meteor.subscribe('userData');
}