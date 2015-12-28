var _uploadingUsers = false;
var _uploadingStaticSessions = false;
var _uploadingUsersMessage = '';
var _uploadingStaticSessionsMessage = '';
var statusDep = new Deps.Dependency;

Template.adminHelpers.onRendered(function(){
    _uploadingUsers = false;
    _uploadingStaticSessions = false;
    _uploadingUsersMessage = '';
    _uploadingStaticSessionsMessage = '';
});


Template.adminHelpers.helpers({
    'uploadingUsers':function(){
        statusDep.depend();
        return _uploadingUsers;
    },
    'uploadingUsersMessage':function(){
        statusDep.depend();
        return _uploadingUsersMessage;
    },
    'uploadingStaticSessions':function(){
        statusDep.depend();
        return _uploadingStaticSessions;
    },
    'uploadingStaticSessionsMessage':function(){
        statusDep.depend();
        return _uploadingStaticSessionsMessage;
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
    }
});

Template.adminHelpers.events({

    "change .userImport": function(evt, templ){
        FS.Utility.eachFile(event, function(file){
            var theFile = new FS.File(file);
            Uploads.insert(theFile, function(err,fileObj){
                if(!err){
                    _uploadingUsers = true;
                    statusDep.changed();
                    Meteor.call('uploadUserFile', fileObj._id,file.name, function(){
                        _uploadingUsers = false;
                        _uploadingUsersMessage = 'User file was uploaded successfully!';
                        alert('Users have been imported.');
                        statusDep.changed();
                        $('.userImport').val('')
                    });
                }
            })
        })
    },
    "change .staticSessionsImport": function(evt, templ){
        FS.Utility.eachFile(event, function(file){
            var theFile = new FS.File(file);
            Uploads.insert(theFile, function(err,fileObj){
                if(!err){
                    _uploadingStaticSessions = true;
                    statusDep.changed();
                    Meteor.call('uploadStaticSessionFile', fileObj._id,file.name, function(){
                        _uploadingStaticSessions = false;
                        _uploadingStaticSessionsMessage = 'Session file was uploaded successfully!';
                        Meteor.call('refreshSessionDates');
                        alert('Static Sessions have been imported.');
                        statusDep.changed();
                        $('.staticSessionsImport').val('');

                    });
                }
            })
        })
    },
    "click #btnChangeDates": function(){
        var dateTransformations = [];
        $('.dateFromTo').each(function(e){
            var dateFrom = $(this).find('.dateFrom').text();
            var dateTo = $(this).find('.dateTo').val();
            dateTransformations.push({'dateFrom': dateFrom, 'dateTo': dateTo});
        });

        Meteor.call('changeDatesForTesting', dateTransformations, function(){
            alert('Completed');
            Meteor.call('refreshSessionDates');
        });
    },
    "click #refreshSessionDates": function(){
        Meteor.call('refreshSessionDates', function(){ alert('Refresh Session Dates Completed.');})
    },
    "click #deleteAllSessions": function(){
        Meteor.call('deleteAllSessions', function(){ alert('Delete All Sessions Completed.');})
    },
    "click #exportSessions": function () {
        Meteor.call("exportSessions");
    }
});