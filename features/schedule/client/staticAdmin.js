Template.staticAdmin.helpers({
    staticSessionList: function () {
        return Session.find({SessionType: "Static"});
    }
});

Template.staticAdmin.events({
    "click #addStaticSession": function () {
        var x = Meteor.call("addStaticSession", function (err, data) {
            window.location = Router.routes["staticAdminEdit"].url({_id: data});
        });
    }
});