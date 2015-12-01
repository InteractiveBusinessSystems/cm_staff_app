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
        _currentSelectedSession.SessionTime = '';
        _currentSelectedSession.SessionStartTime = '';
        _currentSelectedSession.SessionEndTime = '';
        _modalDep.changed();
        $("#myModal").modal();
    },
    'click #editStaticAdmin': function (item) {
        _currentSelectedSession = this;
        _modalDep.changed();
        $("#myModal").modal();
    },
    "click #saveStaticSession": function () {
        _currentSelectedSession.Title = $('#staticSessionTitle').val();
        Meteor.call("addStaticSession", _currentSelectedSession);
        $("#myModal").modal('hide')
    },
    "click #deleteStaticAdmin": function(){
        var id = this._id;
        Meteor.call("deleteStaticSession", id);
    }
});