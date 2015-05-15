/**
 * Created by szischerk on 5/12/2015.
 */

Template.scheduleAdmin.helpers ({
    "sessionList": function(){
        var result =  Meteor.call("getSchedule");
        debugger;
        return result;
    }
});