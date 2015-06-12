Meteor.publish('sessionList', function () {
    return SessionList.find();
});

Meteor.publish('sessionCollisions', function () {
    return SessionCollisions.find();
});

Meteor.publish('sessionDates', function () {
    return SessionDates.find();
});