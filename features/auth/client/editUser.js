Template.editUser.helpers({
    user: function () {
        return Meteor.users.find({_id: Router.current().params._id}).fetch()[0];
    }
});

Template.editUser.events({
    "submit #edit-user-form": function (evnt) {
        var newRole = "user";
        if (evnt.target.isAdmin.checked)
            newRole = "admin";

        Roles.SetUserRole(Router.current().params._id, newRole);
        Meteor.call("UpdateUser"
                        , Router.current().params._id
                        , evnt.target.firstName.value
                        , evnt.target.lastName.value
                        , evnt.target.gravatar.value
                        , evnt.target.cell.value);
        return false;
    }
});