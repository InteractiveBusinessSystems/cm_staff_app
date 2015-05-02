Roles = {
    PossibleRoles: ["user", "admin"],

    SetUserRole: function (userId, role) {
        Meteor.call("SetUserRole", userId, role);
    }
};