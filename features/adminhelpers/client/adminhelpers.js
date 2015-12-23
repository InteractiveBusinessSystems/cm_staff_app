var _uploadingUsers = false;
var _uploadingStaticSessions = false;
var _uploadingUsersMessage = '';
var _uploadingStaticSessionsMessage = '';

Template.adminHelpers.helpers({
    uploadingUsers:function(){
        return _uploadingUsers;
    },
    uploadingUsersMessage:function(){
        return _uploadingUsersMessage;
    },
    uploadingStaticSessions:function(){
        return _uploadingStaticSessions;
    },
    uploadingStaticSessionsMessage:function(){
        return _uploadingStaticSessionsMessage;
    }
});

Template.adminHelpers.events({
    "change .userImport": function(evt, templ){
        FS.Utility.eachFile(event, function(file){
            var theFile = new FS.File(file);
            Uploads.insert(theFile, function(err,fileObj){
                if(!err){
                    _uploadingUsers = true;
                    Meteor.call('uploadUserFile', fileObj._id,file.name, function(){ _uploadingUsers = false; _uploadingUsersMessage = 'User file was uploaded successfully!'});
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
                    Meteor.call('uploadStaticSessionFile', fileObj._id,file.name, function(){
                        _uploadingStaticSessions = false;
                        _uploadingStaticSessionsMessage = 'Session file was uploaded successfully!'
                        Meteor.call('refreshSessionDates');
                    });
                }
            })
        })
    }});