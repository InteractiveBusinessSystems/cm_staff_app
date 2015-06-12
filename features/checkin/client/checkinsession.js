Template.checkinsession.helpers({
    'sessionInfo': function () {
        return Meteor.session.find({'_id': Router.current().params.sessionId});
    }
});
