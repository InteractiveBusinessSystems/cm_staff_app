Template.home.helpers({
    nextSessionCheckIn:function(){
        return SessionList.find({SessionStartTime : '2015-01-07T08:00:00'});
    },
    isCheckedIn:function(session){
        return !(session.checkInInfo.proctorCheckInTime == null || session.checkInInfo.proctorCheckInTime == '');
    }
});