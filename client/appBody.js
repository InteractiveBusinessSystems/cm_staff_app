Template.navigation.helpers({
    isAdminRole: function(){

        if(!Meteor.user()) return false;
        return Meteor.user().role === 'admin' || false;
    }
});