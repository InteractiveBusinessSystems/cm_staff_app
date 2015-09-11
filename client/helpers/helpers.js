Template.registerHelper('formatToTime', function (dateTime) {
    var formattedTime = moment(dateTime).format('h:mma');
    if (formattedTime == 'Invalid date') return '';
    return formattedTime;
});

Template.registerHelper('formatToDate', function (dateTime) {
    var formattedTime = moment(dateTime).format('MM/DD/YYYY');
    if (formattedTime == 'Invalid date') return '';
    return formattedTime;
});

Template.registerHelper("arrayJoin", function (arr) {
    if (arr == null)
        return "No Group";
    else
        return arr.join(",");
});

Template.registerHelper("isAdmin", function (user) {
    var _user = user || Meteor.user();
    return _user.role == "admin";
});

String.prototype.padZero= function(len, c){
    var s= this, c= c || '0';
    while(s.length< len) s= c+ s;
    return s;
};