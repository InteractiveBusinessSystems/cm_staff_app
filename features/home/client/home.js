Template.home.helpers({
    nextSessionCheckIn:function(){
        var startDate = moment().format('YYYY-MM-DDT00:00:00'); //'2015-12-22T00:00:00';
        var endDate = moment().add(1,'days').format('YYYY-MM-DDT00:00:00'); //'2015-12-23T00:00:00';
        var todaysSessions = SessionList.find({SessionStartTime : {
            '$gte' : startDate ,
            '$lte' : endDate
        }}).fetch();


        var todaysSessionsSorted = _.sortBy(todaysSessions, function(val){
            return moment(val.SessionStartTime).diff(moment("01-01-2000"))
        });

        var todaysSessionsGrouped = _.toArray(_.groupBy(todaysSessionsSorted, function(val){
            return moment(val.SessionStartTime).format('h:mm A');
        }));

        return todaysSessionsGrouped;
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
    },
    isCurrent:function(StartTime, EndTime){
        if(moment().isBetween(StartTime,EndTime)){
            return 'open';
        }
         return '';
    }
});

Template.home.events({
    "click .timeGroupHeader":function(e){
        $(e.currentTarget).parent().find('.timeGroupSessions').toggleClass('open');
    }
});