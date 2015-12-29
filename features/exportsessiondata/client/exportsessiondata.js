Template.exportsessiondata.helpers({

});

Template.exportsessiondata.events({
    "click #download": function(){
        var data = SessionList.find().fetch();

        var sessionData = _.map(data,function(session){
            var sessionaMap =
            {
                "Id" : session.Id,
                "SessionStartTime" : session.SessionStartTime,
                "SessionEndTime" : session.SessionEndTime,
                "Rooms" : session.Rooms,
                "Title" : session.Title,
                "SessionType" : session.SessionType,
                "assignees" : getAssignees(session.assignees),
                "proctorCheckInTime" : session.checkInInfo.proctorCheckInTime,
                "sessionStartTime" : session.checkInInfo.sessionStartTime,
                "sessionEndTime" : session.checkInInfo.sessionEndTime,
                "attendees10" : session.checkInInfo.attendees10,
                "attendees50" : session.checkInInfo.attendees50,
                "notes" : session.checkInInfo.notes
            };
            return sessionaMap;
        });
        var json = $.parseJSON(JSON.stringify(sessionData));
        var csv = JSON2CSV(json);
        window.open("data:text/csv;charset=utf-8," + escape(csv))
    }
});

function getAssignees(assigneeIds){
    var assigneeNames = '';
    _.each(assigneeIds, function(assigneeId){
        var user = Meteor.users.findOne({_id:assigneeId});
        assigneeNames += user.profile.firstName + ' ' + user.profile.lastName + ';';
    });
    return assigneeNames;
}

function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '';
    var line = '';

    if ($("#labels").is(':checked')) {
        var head = array[0];
        if ($("#quote").is(':checked')) {
            for (var index in array[0]) {
                var value = index + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[0]) {
                line += index + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }

    for (var i = 0; i < array.length; i++) {
        var line = '';

        if ($("#quote").is(':checked')) {
            for (var index in array[i]) {
                var value = array[i][index] + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[i]) {
                line += array[i][index] + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;

}
