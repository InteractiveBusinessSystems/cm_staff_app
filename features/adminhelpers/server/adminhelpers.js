Meteor.methods({
    'uploadUserFile':function(fileid,filename){
        var fs = Meteor.npmRequire('fs');
        var file = Uploads.find({_id:fileid});
        Meteor.setTimeout(function(){
            var filepath = '/imports/uploads-' + fileid + '-' + filename;
            CSV().from.stream(
                fs.createReadStream(filepath),
                {'escape':'\\'})
                .on('record', Meteor.bindEnvironment(function(row,index){
                    if (Meteor.users.findOne({"emails.address": row[2]}) == null) {
                        Accounts.createUser({
                            email: row[2],
                            password: "codemash",
                            role: "user"

                        });
                        var u = Meteor.users.findOne({"emails.address": row[2]});
                        Meteor.users.update({_id: u._id}, {
                            $set: {
                                groups: ["Everyone","Volunteers"],
                                "profile": {
                                    firstName: row[0],
                                    lastName: row[1],
                                    gravatar: null,
                                    cell: row[3]
                                }
                            }
                        });

                    }
                }, function(error){
                    console.log(error);
                }))
                .on('error', function(err){
                    console.log(err);
                })
                .on('end', function(count){

                })
        },1000)
    },
    'uploadStaticSessionFile':function(fileid,filename){
        var fs = Meteor.npmRequire('fs');
        var file = Uploads.find({_id:fileid});
        Meteor.setTimeout(function(){
            var filepath = '/imports/uploads-' + fileid + '-' + filename;
            CSV().from.stream(
                fs.createReadStream(filepath),
                {'escape':'\\'})
                .on('record', Meteor.bindEnvironment(function(row,index){
                    var sessionTemplate = SessionList.findOne({});
                    delete sessionTemplate._id;
                    sessionTemplate = clearObject(sessionTemplate);
                    sessionTemplate.SessionType = row[5];
                    sessionTemplate.Title = row[3];
                    sessionTemplate.SessionTime = null;
                    sessionTemplate.SessionStartTime = moment(row[0]).format('YYYY-MM-DDTHH:mm:ss');
                    sessionTemplate.SessionEndTime = moment(row[1]).format('YYYY-MM-DDTHH:mm:ss');
                    sessionTemplate.Rooms = [row[2]];
                    sessionTemplate.NumberRequired = row[6];
                    SessionList.insert(sessionTemplate);
                }, function(error){
                    console.log(error);
                }))
                .on('error', function(err){
                    console.log(err);
                })
                .on('end', function(count){

                })
        },1000)
    }
});

function clearObject(obj) {
    for (var key in obj) {
        if (obj[key] == null)
            continue
        if (key.indexOf("Time") !== -1) {
            obj[key] = "";
            continue;
        }
        switch (typeof obj[key]) {
            case "string":
                obj[key] = "";
                break;
            case "number":
                obj[key] = 0;
                break;
            case "object":
                if (Array.isArray(obj[key])) {
                    obj[key] = [];
                }
                else {
                    obj[key] = clearObject(obj[key]);
                }
                break;
        }
    }
    return obj;
}