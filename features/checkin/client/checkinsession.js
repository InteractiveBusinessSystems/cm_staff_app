Template.checkinsession.helpers({
    'sessionInfo': function () {
        return SessionList.find({'_id': Router.current().params.sessionId});
    },
    'sessionStatus': function () {
        if (this.checkInInfo.sessionStartTime === "") {
            return "Not yet started"
        }
        else {
            return "Started"
        }
    }
});


Template.checkinsession.events({
    'click #startTimeBtn': function(e){
        this.checkInInfo.sessionStartTime = new Date();
        Meteor.call('saveCheckInInfo', this._id, this.checkInInfo);
    }
});