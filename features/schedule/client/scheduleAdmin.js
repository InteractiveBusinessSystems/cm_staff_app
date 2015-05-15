/**
 * Created by szischerk on 5/12/2015.
 */

Meteor.call("getSchedule", function(err, data) {
    Session.set('sessionList', data);
});

Template.scheduleAdmin.helpers ({
    "sessionList": function(){
        return Session.get('sessionList');
    }
});