Template.checkinsession.helpers({
    'sessionInfo': function () {
        return SessionList.find({'_id': Router.current().params.sessionId});
    }
});


Template.checkinsession.events({
    'click #startTimeBtn': function(e){
        debugger;
        this.checkInInfo.sessionStartTime = new Date();
        Meteor.call('saveCheckInInfo', this._id, this.checkInInfo);
    }
});