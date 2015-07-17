Template.account.helpers(
    {
        myAccount:function(){
            return Meteor.user();
        }
    }
);

Template.account.events({
    "submit #edit-user-form": function (evnt) {
        Meteor.call("UpdateEmail", Meteor.user()._id, evnt.target.email.value);
        Meteor.call("UpdateUser"
            , Meteor.user()._id
            , evnt.target.firstName.value
            , evnt.target.lastName.value
            , evnt.target.gravatar.value
            , evnt.target.cell.value);
        return false;
    }
});