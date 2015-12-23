Template.home.helpers({
    nextSessionCheckIn:function(){
        return SessionList.find({SessionStartTime : '2016-01-05T08:00:00'});
    },
    isCheckedIn:function(session){
        return !(session.checkInInfo.proctorCheckInTime == null || session.checkInInfo.proctorCheckInTime == '');
    },
    getProctor:function(proctorIds){
        var proctorString = '';
        for(var i = 0; i < proctorIds.length; i++){
            var user = Meteor.users.find(proctorIds[i]).fetch()[0];
            proctorString += user.profile.lastName;
        }
        return proctorString;
    }
});