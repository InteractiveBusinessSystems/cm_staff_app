
var _modalDep = new Deps.Dependency;
var _currentSelectedSession = {};

Template.scheduleAdmin.helpers({
    "sessionList": function () {
        if (SessionList.find().count() <= 0) return false;
        var sessionsForDate = SessionList.find({
            $where: function () {
                return moment(this.SessionStartTime).format('M-D-YY') == Session.get('selectedScheduleDate')
            }
        }).fetch();
        var sessionsGrouped = _.toArray(_.groupBy(sessionsForDate, function (item) {
            return item.Rooms;
        }));
        //return _.first(sessionsGrouped, 1);
        return sessionsGrouped;
    },
    "dateList": function () {

        var distinctData = _.sortBy(SessionDates.find().fetch(), function(val){
            return moment(val.date).diff(moment("01-01-2000"))
        });

        var dates = _.map(distinctData, function (item) {
            return moment(item.date).format('M-D-YY');
        });

        if (typeof(Session.get('selectedScheduleDate')) === "undefined" && dates.length > 0) {
            Session.set('selectedScheduleDate', dates[0]);
        }
        return dates;
    },
    "volunteerList": function () {
        _modalDep.depend();
        if (typeof(_currentSelectedSession.assignees) !== "undefined")
            return _.sortBy(Meteor.users.find({"groups": "Volunteers", "_id": {$nin: _currentSelectedSession.assignees}}).fetch(),function(val){ return val.profile.lastName;});
        else
            return [];
    },
    "modalData": function () {
        _modalDep.depend();
        return _currentSelectedSession;
    },
    "getUser": function (id) {
        return Meteor.users.findOne({_id: id});
    },
    "collisionList": function (id) {
        _modalDep.depend();
        return SessionCollisions.find({origSession: id});
    },
    "getCollisionData": function (sessionId, userId) {
        return {
            session: SessionList.findOne({_id: sessionId}),
            user: Meteor.users.findOne({_id: userId})
        }
    }
});

Template.scheduleAdmin.events({
    'click #scheduleRefresh': function () {
        Meteor.call('refreshSchedule', function (err, data) {
            alert('Refreshed Schedule');
        });
    },

    'click #scheduleVerify': function () {
        Meteor.call('verifySchedule', function (err, data) {
        });
    },

    'click #scheduleAutofill': function () {
        Meteor.call('scheduleAutofill', function (err, data) {
        });
    },

    'click .datePicker': function () {
        Session.set('selectedScheduleDate', this.toString());
    },

    'click .scheduleAdminSession': function (item) {
        _currentSelectedSession = this;
        _modalDep.changed();
        $("#myModal").modal()

    },
    "click #saveAssigneeButton": function () {
        var id = this._id;
        Meteor.call("saveAssignees", id, this.assignees);
        $("#myModal").modal('hide')
    },
    "change #newVolunteer": function (evnt) {
        var id = $(evnt.target).val();
        if (id == "0")
            return;

        _currentSelectedSession.assignees.push(id);

        _modalDep.changed();
    },
    "click .removeVolunteer": function (evnt) {
        var _id = this._id;
        _currentSelectedSession.assignees = _currentSelectedSession.assignees.filter(function (val) {
            return val != _id
        });
        _modalDep.changed();
    }
});

Template.scheduleAdminSession.helpers({
    "getCardState": function (item) {
        var cls = "";

        var collisions = SessionCollisions.find({origSession: item._id}).fetch();

        if (collisions.length > 0) {
            return "error";
        }
        else if (item.assignees.length > 0) {
            return "ok";
        }
        return cls;
    }
});

Template.registerHelper('getTop', function (startTime) {
    var x = moment.duration(moment(startTime).format('HH:mm')) / 60000;
    x = x - 375;
    return x.toString() + 'px';
});

Template.registerHelper('getHeight', function (startTime, endTime) {
    var x = moment.duration(moment(startTime).format('HH:mm')) / 60000;
    var y = moment.duration(moment(endTime).format('HH:mm')) / 60000;
    var z = (y - x);
    return z.toString() + 'px';
});
