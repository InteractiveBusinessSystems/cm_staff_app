var _editAttendanceType = null;
var _modalDep = new Deps.Dependency;

Template.checkinsession.helpers({
    'sessionInfo': function () {
        return SessionList.find({'_id': Router.current().params.sessionId});
    },
    'sessionStatus': function () {
        if (this.checkInInfo.proctorCheckInTime === "") {
            return "Not Started";
        }
        else if (this.checkInInfo.proctorCheckInTime !== "" && this.checkInInfo.sessionStartTime === "") {
            return "Checked In";
        }
        else if (this.checkInInfo.proctorCheckInTime !== "" && this.checkInInfo.sessionStartTime !== "" && this.checkInInfo.sessionEndTime === "") {
            return "Started";
        }
        else {
            return "Done";
        }
    },
    'checkInStatusColor': function () {
        if (this.checkInInfo.proctorCheckInTime !== "") {
            return "#666666";
        }
        return '#f67e00';
    },
    'startTimeStatusColor': function () {
        if (this.checkInInfo.sessionStartTime !== "") {
            return "#666666";
        }
        return '#f67e00';
    },
    'endTimeStatusColor': function () {
        if (this.checkInInfo.sessionEndTime !== "") {
            return "#666666";
        }
        return '#f67e00';
    },
    'modalData': function () {
        return SessionList.findOne({'_id': Router.current().params.sessionId});
    },
    'modalTitle': function () {
        _modalDep.depend();
        if (_editAttendanceType === 10) return '10 Minute';
        return '50 Minute';
    },
    'numberSelected': function (num) {
        _modalDep.depend();
        var attNum = _editAttendanceType === 10 ? this.checkInInfo.attendees10 : this.checkInInfo.attendees50;
        var numArray = num.toString().split('');
        var attNumArray = attNum.toString().padZero(3).split('');

        if (numArray[0] == attNumArray[3 - numArray.length]) return 'selected';
        return '';
    }
});


Template.checkinsession.events({
    'click #startTime': function (e) {
        if (this.checkInInfo.sessionStartTime === '') {
            this.checkInInfo.sessionStartTime = new Date();
        } else {
            this.checkInInfo.sessionStartTime = '';
        }
        Meteor.call('saveCheckInInfo', this._id, this.checkInInfo);
    },
    'click #endTime': function (e) {
        if (this.checkInInfo.sessionEndTime === '') {
            this.checkInInfo.sessionEndTime = new Date();
        } else {
            this.checkInInfo.sessionEndTime = '';
        }
        Meteor.call('saveCheckInInfo', this._id, this.checkInInfo);
    },
    'click #checkInBtn': function (e) {
        if (this.checkInInfo.proctorCheckInTime === '') {
            this.checkInInfo.proctorCheckInTime = new Date();
        }
        else {
            this.checkInInfo.proctorCheckInTime = '';
        }
        Meteor.call('saveCheckInInfo', this._id, this.checkInInfo);
    },
    'click #attendees10': function (e) {
        _editAttendanceType = 10;
        _modalDep.changed();
        $("#myModal").modal();
    },
    'click #attendees50': function (e) {
        _editAttendanceType = 50;
        _modalDep.changed();
        $("#myModal").modal();
    },
    'click .numberButton': function (e) {
        var num = $(e.target).text().split('');

        if (_editAttendanceType === 10) {
            var oldNum = this.checkInInfo.attendees10.toString().padZero(3).split('');
            oldNum[3 - num.length] = oldNum[3 - num.length] === num[0] ? '0' : num[0];
            this.checkInInfo.attendees10 = parseInt(oldNum.join(''));
        }
        else {
            var oldNum = this.checkInInfo.attendees50.toString().padZero(3).split('');
            oldNum[3 - num.length] = oldNum[3 - num.length] === num[0] ? '0' : num[0];
            this.checkInInfo.attendees50 = parseInt(oldNum.join(''));
        }
        Meteor.call('saveCheckInInfo', this._id, this.checkInInfo);
        _modalDep.changed();
    },
    'blur #notes': function (e) {
        this.checkInInfo.notes = $('#notes').val().trim();
        Meteor.call('saveCheckInInfo', this._id, this.checkInInfo);
    }
});