/**
 * Created by szischerk on 6/5/2015.
 */
//SessionList = new Meteor.Collection('session');
//Meteor.subscribe('sessionList');

Template.schedule.helpers({
    mySchedule:function(){

        var sessionsForCurrentUser = SessionList.find({
            $where: function () {
                return this.assignees.filter(function(assignee){ return assignee == Meteor.userId();}).length > 0;
            }
        }).fetch();
        return _.toArray(
                        _.groupBy(
                            _.sortBy(sessionsForCurrentUser, function(session){
                                debugger;
                                return moment(session.SessionStartTime).format('YYDDMMHHMM');
                            }
                            ), function(session){ return moment(session.SessionStartTime).format('M-D-YY'); })
                            );
    },
    dateGroup:function(session){
        debugger;
        return moment(session[0].SessionStartTime).format('dddd, MMMM Do YYYY');
    }
});

Template.registerHelper('formatToTime', function (dateTime) {
    return moment(dateTime).format('h:mma');
});