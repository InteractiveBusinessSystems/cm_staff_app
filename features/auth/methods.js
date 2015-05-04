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

if (Meteor.isServer) {
    process.env.MAIL_URL = "smtp:dotsonjb14:Garden817@smtp.sendgrid.net:587";
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
                role: "user"
            });
            Meteor.call("SendEmail", userId);
        },
        DeleteAccount: function (userId) {
            Meteor.users.remove({_id: userId});
        }
    })
}