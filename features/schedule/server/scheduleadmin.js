Meteor.methods({
        refreshSchedule: function () {
            this.unblock();
            try {
                var result = HTTP.get("https://cmprod-speakers.azurewebsites.net/api/sessionsdata");
                //var result = HTTP.get("http://localhost:3000/data/sessionsdata.xml");
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
                        session.checkInInfo = {
                            proctorCheckInTime:'',
                            sessionStartTime:'',
                            sessionEndTime:'',
                            proctor:'',
                            attendees10: 0,
                            attendees50: 0,
                            notes:''
                        };
                        SessionList.insert(session);
                    }
                });

                var data = SessionList.find().fetch();
                var distinctData = _.uniq(data, false, function (d) {
                    return new Date(d.SessionStartTime).toDateString()
                });

                SessionDates.remove({});
                _.forEach(distinctData, function (d) {
                    SessionDates.insert({date: d.SessionStartTime});
                });


            } catch (e) {
                // Got a network error, time-out or HTTP error in the 400 or 500 range.
                return '';
            }
        },
        getAvailableDates: function () {
            var distinctData = _.sortBy(SessionDates.find().fetch(), function(val){
                return moment(val.date).diff(moment("01-01-2000"))
            });

            return _.map(distinctData, function (item) {
                return moment(item.date).format('M-D-YY');
            });
        },
        saveAssignees: function (id, assignees) {
            SessionList.update({Id: id}, {$set: {assignees: assignees}})
        },
        verifySchedule: function() {
            // clean the list at the start

            var newColList = [];
            var sessions = SessionList.find({"assignees.0": {$exists: true}}).fetch();
            _.forEach(sessions, function (session) {
                _.forEach(sessions, function (session2) {
                    if(session._id != session2._id) {
                        var sessionRange1 = moment.range(session.SessionStartTime, session.SessionEndTime)
                        var sessionRange2 = moment.range(session2.SessionStartTime, session2.SessionEndTime)
                        if(sessionRange1.overlaps(sessionRange2)) {
                            _.forEach(session.assignees, function (userId) {
                                if(session2.assignees.indexOf(userId) != -1) {

                                    newColList.push({
                                        userId: userId,
                                        origSession: session._id,
                                        secSession: session2._id
                                    });
                                }
                            });
                        }
                    }
                });
            });
            SessionCollisions.remove({});

            _.forEach(newColList, function(coll) {
                SessionCollisions.insert(coll);
            });
        },
        saveCheckInInfo: function(id, checkInInfo){
            SessionList.update({_id: id},{$set: {checkInInfo: checkInInfo}})
        }
    }
);

