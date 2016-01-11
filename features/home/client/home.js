var _modalDep = new Deps.Dependency;
var _currentSelectedSession = {};

Template.home.helpers({
    nextSessionCheckIn:function(){
        var startDate = moment().format('YYYY-MM-DDT00:00:00'); //'2015-12-22T00:00:00';
        var endDate = moment().add(1,'days').format('YYYY-MM-DDT00:00:00'); //'2015-12-23T00:00:00';
        var todaysSessions = SessionList.find({SessionStartTime : {
            '$gte' : startDate ,
            '$lte' : endDate
        }}).fetch();


        var todaysSessionsSorted = _.sortBy(todaysSessions, function(val){
            return moment(val.SessionStartTime).diff(moment("2000-01-01"))
        });

        var todaysSessionsGrouped = _.toArray(_.groupBy(todaysSessionsSorted, function(val){
            return moment(val.SessionStartTime).format('h:mm A');
        }));

        return todaysSessionsGrouped;
    },
    isCheckedIn:function(session){
        return !(session.checkInInfo.proctorCheckInTime == null || session.checkInInfo.proctorCheckInTime == '');
    },
    checkedInClass: function(session){
        if(session.assignees.length !== session.checkInInfo.proctorCheckIns.length){
            if(getSessionStatus(session.checkInInfo) == 'Done')
            return 'checkedInDone';
        }
        return 'checkedIn';
    },
    getProctor:function(proctorIds, proctorCheckIns){
        var proctorString = '';
        for(var i = 0; i < proctorIds.length; i++){
            var user = Meteor.users.find(proctorIds[i]).fetch()[0];
            if(_.findWhere(this.checkInInfo.proctorCheckIns, {proctorId:proctorIds[i]}))
                proctorString += '<div>&#9745; ' + user.profile.lastName + ', ' + user.profile.firstName + '</div>';
            else
                proctorString += '<div>&#9744; ' + user.profile.lastName + ', ' + user.profile.firstName + '</div>';
        }
        return proctorString;
    },
    isCurrent:function(StartTime, EndTime){
        if(moment().isBetween(StartTime,EndTime)){
            return 'open';
        }
         return '';
    },
    "modalData": function () {
        _modalDep.depend();
        return _currentSelectedSession;
    },
    "notStatic":function(sessionType){
        return sessionType != 'Static';
    },
    'sessionStatus': function (checkInInfo) {
        return getSessionStatus(checkInInfo);
    }
});

Template.home.events({
    "click .timeGroupHeader":function(e){
        $(e.currentTarget).parent().find('.timeGroupSessions').toggleClass('open');
    },
    'click .checkInStatus': function (item) {
        _currentSelectedSession = this;
        _modalDep.changed();
        $("#myModal").modal()

    }
});

function getSessionStatus(checkInInfo){
    if (checkInInfo.proctorCheckInTime === "") {
        return "Not Started";
    }
    else if (checkInInfo.proctorCheckInTime !== "" && checkInInfo.sessionStartTime === "") {
        return "Checked In";
    }
    else if (checkInInfo.proctorCheckInTime !== "" && checkInInfo.sessionStartTime !== "" && checkInInfo.sessionEndTime === "") {
        return "Started";
    }
    else {
        return "Done";
    }
}