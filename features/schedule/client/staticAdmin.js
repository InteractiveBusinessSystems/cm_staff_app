var _modalDep = new Deps.Dependency;
var _currentSelectedSession = {};

Template.staticAdmin.helpers({
    staticSessionList: function () {
        return SessionList.find({SessionType: "Static"});
    },
    "modalData": function () {
        _modalDep.depend();
        return _currentSelectedSession;
    },
    "sessionDates": function () {
        return SessionDates.find();
    }
});

Template.staticAdmin.events({
    "click #addStaticSession": function () {
        _currentSelectedSession = this;
        _currentSelectedSession.Title = '';
        _currentSelectedSession.SessionStartTime = '';
        _currentSelectedSession.SessionEndTime = '';
        _currentSelectedSession.SessionDate = '';
        _currentSelectedSession.Rooms = [];
        _currentSelectedSession.NumberRequired = 0;

        $('#staticSessionDate').val('');
        $('#staticSessionTitle').val('');
        $('#staticSessionStartTime').val('');
        $('#staticSessionEndTime').val('');
        $('#staticSessionNumberRequired').val('');
        _modalDep.changed();
        $("#myModal").modal();
    },
    'click #editStaticAdmin': function (item) {
        _currentSelectedSession = this;
        _currentSelectedSession.SessionDate = moment(_currentSelectedSession.SessionStartTime).format('YYYY-MM-DD');
        _currentSelectedSession.SessionStartTime = moment(_currentSelectedSession.SessionStartTime).format('HH:mm');
        _currentSelectedSession.SessionEndTime = moment(_currentSelectedSession.SessionEndTime).format('HH:mm');
        _modalDep.changed();
        $("#myModal").modal();
    },
    "click #saveStaticSession": function () {
        _currentSelectedSession.Title = $('#staticSessionTitle').val();
        //2015-01-08T16:45:00
        _currentSelectedSession.SessionStartTime = moment($('#staticSessionDate').val() + ' ' + $('#staticSessionStartTime').val()).format('YYYY-MM-DDTHH:mm:ss');
        _currentSelectedSession.SessionEndTime = moment($('#staticSessionDate').val() + ' ' + $('#staticSessionEndTime').val()).format('YYYY-MM-DDTHH:mm:ss');
        _currentSelectedSession.Rooms = $('#staticSessionRoom').val().split(',');
        _currentSelectedSession.NumberRequired = $('#staticSessionNumberRequired').val();

        Meteor.call("addStaticSession", _currentSelectedSession);
        $("#myModal").modal('hide')
    },
    "click #deleteStaticAdmin": function(){
        var id = this._id;
        Meteor.call("deleteStaticSession", id);
    }
});