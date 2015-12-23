SessionList = new Meteor.Collection('session');

SessionCollisions = new Meteor.Collection('sessionCollision');

SessionDates = new Meteor.Collection("sessionDates");
MessagesList = new Meteor.Collection('messages');
Uploads = new FS.Collection('uploads',
    {stores:[new FS.Store.FileSystem('uploads',{path:'/imports'})]
    });

Uploads.allow({
    insert:function(){return true;},
    update:function(){return true;},
    remove:function(){return true;},
    download:function(){return true;}
});