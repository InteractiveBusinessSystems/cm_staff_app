Template.messages.helpers({
    allmessages : function(){
        return MessagesList.find();
    }
})

Template.messages.events({
   'click #sendmsg' : function(){
       alert("as")
    Meteor.call('SaveMessage', {message : $("#msgtosend").val(),"group": "everyone" });
   }
});