Meteor.methods({
   SaveMessage : function(message) {
       MessagesList.insert(message)
   }
});