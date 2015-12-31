_ = lodash;

Meteor.methods({
        refreshSchedule: function () {
            this.unblock();
            try {
                var result = HTTP.get("https://cmprod-speakers.azurewebsites.net/api/sessionsdata");

                //var result = HTTP.get("http://ibs-dev-smz4.enterprisesolutions.ibs.com:3003/sessionsdata");

                var sessions = result.data.filter(function (item) {
                    return item.SessionType === "Pre-Compiler" ||
                        item.SessionType === "Regular Session" ||
                        item.SessionType === "Static";
                });

                _.map(sessions, function (session) {
                    if (SessionList.findOne({'Id': session.Id})) {
                        SessionList.update({'Id': session.Id}, {$set: session});
                    }
                    else {
                        session.assignees = [];
                        session.checkInInfo = {
                            proctorCheckInTime: '',
                            sessionStartTime: '',
                            sessionEndTime: '',
                            proctorCheckIns: [],
                            attendees10: 0,
                            attendees50: 0,
                            notes: ''
                        };
                        SessionList.insert(session);
                    }
                });

                var data = sessions;
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
            var distinctData = _.sortBy(SessionDates.find().fetch(), function (val) {
                return moment(val.date).diff(moment("01-01-2000"))
            });

            return _.map(distinctData, function (item) {
                return moment(item.date).format('M-D-YY');
            });
        },
        saveAssignees: function (id, assignees) {
            SessionList.update({_id: id}, {$set: {assignees: assignees}})
        },
        verifySchedule: function () {
            // clean the list at the start

            var newColList = [];
            var sessions = SessionList.find({"assignees.0": {$exists: true}}).fetch();
            _.forEach(sessions, function (session) {
                _.forEach(sessions, function (session2) {
                    if (session._id != session2._id) {
                        var sessionRange1 = moment.range(session.SessionStartTime, session.SessionEndTime);
                        var sessionRange2 = moment.range(session2.SessionStartTime, session2.SessionEndTime);
                        if (sessionRange1.overlaps(sessionRange2)) {
                            _.forEach(session.assignees, function (userId) {
                                if (session2.assignees.indexOf(userId) != -1) {

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

            _.forEach(newColList, function (coll) {
                SessionCollisions.insert(coll);
            });
        },
        scheduleAutofill: function () {
            var sessions = SessionList.find({}).fetch();

            var dates = SessionDates.find({}).fetch();
            var volunteers = Meteor.users.find({"groups": "Volunteers"}).fetch();

            var split = "13:00:00";

            _.each(dates, function (date) {
                var morning = [];
                var afternoon = [];
                var needsPeople = [];

                var day = moment(date.date);

                // getting the list of users already
                _.each(sessions, function (session) {
                    var sessionStartTime = moment(session.SessionStartTime).format("YYYY-MM-DD");
                    if (day.format("YYYY-MM-DD") != sessionStartTime) {
                        // not the correct day
                        return;
                    }

                    if (session.assignees.length > 0) {
                        _.each(session.assignees, function (asignee) {
                            var user = _.first(_.where(volunteers, {"_id": asignee}));
                            user.minutes = user.minutes || 0;

                            user.minutes += moment(session.SessionEndTime).diff(moment(session.SessionStartTime), "minutes");

                            var s = moment(session.SessionStartTime).diff(moment(sessionStartTime + "T" + split));

                            if (s >= 0) {
                                // afternoon person
                                afternoon.push(vol);
                            }
                            else {
                                morning.push(vol);
                            }
                        });
                    }
                });

                _.each(volunteers, function (vol) {
                    // check if their already in it

                    vol.minutes = vol.minutes || 0;

                    if (_.contains(afternoon, vol._id) || _.contains(morning, vol._id)) {
                        return;
                    }

                    if (morning.length < afternoon.length || true) {
                        morning.push(vol);
                    }
                    else {
                        afternoon.push(vol);
                    }
                });

                var morningList = _.shuffle(_.where(morning, {minutes: _.min(morning, "minutes").minutes}));
                var afternoonList = _.shuffle(_.where(afternoon, {minutes: _.min(afternoon, "minutes").minutes}));

                var morningIndex = 0;
                var afternoonIndex = 0;

                _.each(sessions, function (session) {
                    var sessionStartTime = moment(session.SessionStartTime).format("YYYY-MM-DD");
                    if (day.format("YYYY-MM-DD") != sessionStartTime) {
                        // not the correct day
                        return;
                    }

                    var numReq = session.NumberRequired || 1;

                    if (numReq == session.assignees.length) {
                        return; // no need to assign anyone
                    }

                    var s = moment(session.SessionStartTime).diff(moment(sessionStartTime + "T" + split));

                    var isAfternoon = false;

                    if (s >= 0) {
                        //isAfternoon = true;
                    }

                    var collide = [];

                    _.forEach(sessions, function (session2) {
                        if (session._id != session2._id) {
                            var sessionRange1 = moment.range(session.SessionStartTime, session.SessionEndTime);
                            var sessionRange2 = moment.range(session2.SessionStartTime, session2.SessionEndTime);
                            if (sessionRange1.overlaps(sessionRange2)) {
                                _.forEach(session2.assignees, function (userId) {
                                    collide.push(userId);
                                });
                            }
                        }
                    });

                    for (var i = session.assignees.length; i < numReq; i++) {
                        if(morningList.length == 0) {
                            morningList = _.shuffle(_.where(morning, {minutes: _.min(morning, "minutes").minutes}));
                        }
                        if(afternoonList.length == 0) {
                            afternoonList = _.shuffle(_.where(afternoon, {minutes: _.min(afternoon, "minutes").minutes}));
                        }

                        var cUser = null;

                        if(isAfternoon) {
                            for(var j = 0; j < afternoonList.length; j++) {
                                if(!_.contains(collide, afternoonList[j]._id)) {
                                    cUser = afternoonList[j];
                                    _.remove(afternoonList, {_id: afternoonList[j]._id});
                                    break;
                                }
                            }

                            if(cUser == null) {
                                // the current list is no good;

                                var aList = _.sortBy(afternoon, "minutes");

                                for(var j = 0; j < aList.length; j++) {
                                    if(!_.contains(collide, aList[j]._id)) {
                                        cUser = aList[j];
                                        break;
                                    }
                                }
                            }

                            if(cUser == null) {
                                // no good, check morning people

                                var aList = _.sortBy(morning, "minutes");

                                for(var j = 0; j < aList.length; j++) {
                                    if(!_.contains(collide, aList[j]._id)) {
                                        cUser = aList[j];
                                        break;
                                    }
                                }
                            }

                            // if it's not here it's no good
                        }
                        else {
                            for(var j = 0; j < morningList.length; j++) {
                                if(!_.contains(collide, morningList[j]._id)) {
                                    cUser = morningList[j];
                                    _.remove(morningList, {_id: morningList[j]._id});
                                    break;
                                }
                            }

                            if(cUser == null) {
                                // the current list is no good;

                                var aList = _.sortBy(morning, "minutes");

                                for(var j = 0; j < aList.length; j++) {
                                    if(!_.contains(collide, aList[j]._id)) {
                                        cUser = aList[j];
                                        break;
                                    }
                                }
                            }

                            if(cUser == null) {
                                // no good, check afternoon people

                                var aList = _.sortBy(afternoon, "minutes");

                                for(var j = 0; j < aList.length; j++) {
                                    if(!_.contains(collide, aList[j]._id)) {
                                        cUser = aList[j];
                                        break;
                                    }
                                }
                            }

                            // if it's not here it's no good
                        }

                        if(cUser != null) {
                            //console.log("assigned user to", '"' + session.Title + '"', "in seat", i);
                            session.assignees.push(cUser._id);
                            var start = session.SessionStartTime.replace("2015", "2016");
                            var end = session.SessionEndTime.replace("2015", "2016");
                            cUser.minutes += moment(end).diff(moment(session.SessionStartTime), "minutes");
                        }
                        else {
                            console.log("failed assigning user to", '"' + session.Title + '"', "in seat", i, "on day", day.format());
                        }
                    }

                    Meteor.call("saveAssignees", session._id, session.assignees);
                });
                /*console.log("morning min on", day.format(), _.min(morning, "minutes"));
                console.log("morning max on", day.format(), _.max(morning, "minutes"));
                console.log("afternoon min on", day.format(), _.min(afternoon, "minutes"));
                console.log("afternoon max on", day.format(), _.max(afternoon, "minutes"));*/
            });

            console.log("done");
        },
        saveCheckInInfo: function (id, checkInInfo) {
            SessionList.update({_id: id}, {$set: {checkInInfo: checkInInfo}})
        },
        refreshSessionDates: function () {
            var data = SessionList.find().fetch();
            var distinctData = _.uniq(data, false, function (d) {
                return new Date(d.SessionStartTime).toDateString()
            });
            SessionDates.remove({});
            _.forEach(distinctData, function (d) {
                SessionDates.insert({date: d.SessionStartTime});
            });
        },
        changeDatesForTesting: function (dateTransformations) {
            var sessions = SessionList.find().fetch();
            _.forEach(sessions, function (session) {
                for (var i = 0; i < dateTransformations.length; i++) {
                    if (moment(session.SessionStartTime).format('YYYY-MM-DD') == moment(dateTransformations[i].dateFrom).format('YYYY-MM-DD')) {
                        //Transform date
                        var x = moment(moment(dateTransformations[i].dateTo).format('YYYY-MM-DD') + moment(session.SessionStartTime).format('THH:mm:ss')).format('YYYY-MM-DDTHH:mm:ss');
                        var y = moment(moment(dateTransformations[i].dateTo).format('YYYY-MM-DD') + moment(session.SessionEndTime).format('THH:mm:ss')).format('YYYY-MM-DDTHH:mm:ss');
                        SessionList.update({_id: session._id}, {$set: {SessionStartTime: x, SessionEndTime: y}});
                    }
                }
            });
        },
        addStaticSession: function (session) {
            if (session._id) {
                session.Id = session._id;
                SessionList.update({'_id': session._id}, {$set: session});
                return;
            }
            var sessionTemplate = SessionList.findOne({});
            delete sessionTemplate._id;
            sessionTemplate = clearObject(sessionTemplate);
            sessionTemplate.SessionType = "Static";
            sessionTemplate.Title = session.Title;
            sessionTemplate.SessionTime = session.SessionTime;
            sessionTemplate.SessionStartTime = session.SessionStartTime;
            sessionTemplate.SessionEndTime = session.SessionEndTime;
            sessionTemplate.Rooms = session.Rooms;
            sessionTemplate.NumberRequired = session.NumberRequired;
            return SessionList.insert(sessionTemplate);
        },
        deleteStaticSession: function (id) {
            SessionList.remove({_id: id});
        },
        deleteAllSessions: function () {
            SessionList.remove({});
        }
    }
);

function clearObject(obj) {
    for (var key in obj) {
        if (obj[key] == null)
            continue
        if (key.indexOf("Time") !== -1) {
            obj[key] = "";
            continue;
        }
        switch (typeof obj[key]) {
            case "string":
                obj[key] = "";
                break;
            case "number":
                obj[key] = 0;
                break;
            case "object":
                if (Array.isArray(obj[key])) {
                    obj[key] = [];
                }
                else {
                    obj[key] = clearObject(obj[key]);
                }
                break;
        }
    }
    return obj;
}