Template.staticAdminEdit.helpers({
    sessionData: function() {
        var id = Router.current().params._id;
        return SessionList.findOne({_id: id});
    },
    sessionDates: function() {
        return SessionDates.find();
    }
});

Template.staticAdminEdit.events({
    "change .format-time": function(evnt) {
        debugger;
    }
});