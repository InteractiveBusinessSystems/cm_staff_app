/**
 * Created by szischerk on 5/12/2015.
 */
Meteor.methods({getSchedule: function () {
    this.unblock();
    try {
        var result = HTTP.get("https://cmprod-speakers.azurewebsites.net/api/sessionsdata");
        return result.data.filter(function(item){
            return item.SessionType === "Pre-Compiler" ||
                item.SessionType === "Regular Session";
        });
    } catch (e) {
        // Got a network error, time-out or HTTP error in the 400 or 500 range.
        return '';
    }
}});