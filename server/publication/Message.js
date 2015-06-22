Meteor.publish('messageList', function () {
    return MessagesList.find();
});