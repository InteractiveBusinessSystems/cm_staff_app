SessionList = new Meteor.Collection('session');
Meteor.publish('sessionList', function () {
    return SessionList.find();
});

Meteor.methods({
        refreshSchedule: function () {
            this.unblock();
            try {
                var result = HTTP.get("https://cmprod-speakers.azurewebsites.net/api/sessionsdata");
                //var result = HTTP.get("http://localhost:3000/public/data/sessionsdata.xml");
                var sessions = result.data.filter(function (item) {
                    return item.SessionType === "Pre-Compiler" ||
                        item.SessionType === "Regular Session";
                });

                _.map(sessions, function (session) {
                    if (SessionList.findOne({'Id': session.Id})) {
                        SessionList.update({'Id': session.Id}, {$set: session});
                    }
                    else {
                        session.assignees = [];
                        SessionList.insert(session);
                    }
                });


            } catch (e) {
                // Got a network error, time-out or HTTP error in the 400 or 500 range.
                return '';
            }
        },
        saveAssignees: function (id, assignees) {
            SessionList.update({Id: id}, {$set: {assignees: assignees}})
        },
        verifyScheduleIntegrity: function() {

        }
    }
);

