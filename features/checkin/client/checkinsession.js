Template.checkinsession.helpers({
    'sessionInfo': function () {
        return SessionList.find({'_id': Router.current().params.sessionId});
    },
    'sessionStatus': function () {
        if (this.checkInInfo.proctorCheckInTime === ""){
            return "Not Started";
        }
        else if (this.checkInInfo.proctorCheckInTime !== "" && this.checkInInfo.sessionStartTime === "") {
            return "Checked In";
        }
        else if (this.checkInInfo.proctorCheckInTime !== "" && this.checkInInfo.sessionStartTime !== "" && this.checkInInfo.sessionEndTime === "") {
            return "Started";
        }
        else {
            return "Done";
        }
    },
    'checkInStatusColor': function(){
        if (this.checkInInfo.proctorCheckInTime !== ""){
            return "#666666";
        }
        return '#f67e00';
    },
    'startTimeStatusColor': function(){
        if (this.checkInInfo.sessionStartTime !== ""){
            return "#666666";
        }
        return '#f67e00';
    },
    'endTimeStatusColor': function(){
        if (this.checkInInfo.sessionEndTime !== ""){
            return "#666666";
        }
        return '#f67e00';
    }
});


Template.checkinsession.events({
    'click #startTime': function(e){
        if(this.checkInInfo.sessionStartTime === '') {
            this.checkInInfo.sessionStartTime = new Date();
        } else {
            this.checkInInfo.sessionStartTime = '';
        }
        Meteor.call('saveCheckInInfo', this._id, this.checkInInfo);
    },

    'click #endTime': function(e){
        if(this.checkInInfo.sessionEndTime === '') {
            this.checkInInfo.sessionEndTime = new Date();
        } else {
            this.checkInInfo.sessionEndTime = '';
        }
        Meteor.call('saveCheckInInfo', this._id, this.checkInInfo);
    },

    'click #checkInBtn': function(e){
        if(this.checkInInfo.proctorCheckInTime === '') {
            this.checkInInfo.proctorCheckInTime = new Date();
        }
        else{
            this.checkInInfo.proctorCheckInTime = '';
        }
        Meteor.call('saveCheckInInfo', this._id, this.checkInInfo);
    }

});