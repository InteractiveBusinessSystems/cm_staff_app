SessionList = new Meteor.Collection('session');
Meteor.subscribe('sessionList');

Template.scheduleAdmin.helpers ({
    "sessionList": function(){
        if (SessionList.find().count() <= 0) return false;
        var sessionsForDate = SessionList.find({$where: function(){ return moment(this.SessionStartTime).format('M-D-YY') == Session.get('selectedScheduleDate')}}).fetch();
        var sessionsGrouped = _.toArray(_.groupBy(sessionsForDate, function(item){ return item.Rooms; }));
        //return _.first(sessionsGrouped, 1);
        return sessionsGrouped;
    },
    "dateList": function(){
        var data = SessionList.find().fetch();
        var distinctData = _.uniq(data, false, function(d) {return new Date(d.SessionStartTime).toDateString()});
        var dates = _.map(distinctData, function(item){ return moment(item.SessionStartTime).format('M-D-YY');});
        if(dates.length > 0)
            Session.set('selectedScheduleDate', dates[0]);
        return dates;
    }
});

Template.scheduleAdmin.events({
    'click #scheduleRefresh': function(){
        Meteor.call('refreshSchedule', function(err, data) {
            alert('Refreshed Schedule');
        });
    },

    'click .datePicker': function(){
        Session.set('selectedScheduleDate', this.toString());
    },

    'click .scheduleAdminSession': function(item){
        $("#myModalLabel").text(this.Title);
        $("#currentCardId").val(this.Id);
        $("#myModal").modal();
    }
});

Template.scheduleAdminSession.helpers({
    "getCardState": function(item) {
        var cls = "";
        if(item.assignees.length > 0) {
            return "ok";
        }
        return cls;
    }
});

Template.registerHelper('getTop', function(startTime){
    var x = moment.duration(startTime) / 60000;
    x = x - 445;
    return x.toString() + 'px';
});

Template.registerHelper('getHeight', function(startTime, endTime){
    var x = moment.duration(startTime) / 60000;
    var y = moment.duration(endTime) / 60000;
    var z = (y-x);
    return z.toString() + 'px';
});
