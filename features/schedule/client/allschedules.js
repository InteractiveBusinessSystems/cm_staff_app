Template.allschedules.helpers({
    "allsessions":function() {
        var volunteers = _.sortBy(Meteor.users.find({"groups": "Volunteers"}).fetch(), function (val) {
            return val.profile.lastName;
        });

        var allSessions = [];

        _.each(volunteers, function (volunteer) {
            var vs = SessionList.find({assignees:volunteer._id}).fetch();
            var volunteerSessions = _.groupBy(_.sortBy(vs,function(val){ return val.SessionStartTime}), function(val2){ return moment(val2.SessionStartTime).format('M-D-YY'); });

            var minutes = 0;
            for (var i = 0; i < vs.length; i++) {
                minutes += moment(vs[i].SessionEndTime).diff(moment(vs[i].SessionStartTime),'minutes');
            }

            allSessions.push({
                LastName:volunteer.profile.lastName,
                FirstName:volunteer.profile.firstName,
                NumSessions: vs.length,
                DurationHours: parseInt(minutes/60),
                DurationMinutes: minutes%60,
                Sessions:_.toArray(volunteerSessions)
            });

        });

        return allSessions;

    }
});