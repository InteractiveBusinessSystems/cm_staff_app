Template.navigation.helpers({
    isAdminRole: function(){

        return Meteor.user().role === 'admin' || false;
    }
});