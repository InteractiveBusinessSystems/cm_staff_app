Meteor.methods({
    AddUserToGroup: function (userId, group) {
        Meteor.users.update({_id: userId}, {$addToSet: {groups: group}});
    },
    RemoveUserFromGroup: function (userId, group) {
        Meteor.users.update({_id: userId}, {$pull: {groups: group}});
    },
    SetUserRole: function (userId, role) {
        Meteor.users.update({_id: userId}, {$set: {role: role}});
    },
    UpdateUser: function (userId, firstName, lastName, gravatar, cell) {
        Meteor.users.update({_id: userId}, {
            $set: {
                "profile": {
                    firstName: firstName,
                    lastName: lastName,
                    gravatar: gravatar,
                    cell: cell
                }
            }
        });
    }
});

if (Meteor.isServer) {
    Meteor.methods({
        SendEmail: function (userId) {
            Accounts.sendEnrollmentEmail(userId);
        },
        ResetPassword: function (userId) {
            Accounts.sendResetPasswordEmail(userId);
        },
        CreateAccount: function (email) {
            var userId = Accounts.createUser({
                email: email,
                role: "user",
                password: 'garden'
            });
            Meteor.call("SendEmail", userId);
        },
        DeleteAccount: function (userId) {
            Meteor.users.remove({_id: userId});
        }
    })
}