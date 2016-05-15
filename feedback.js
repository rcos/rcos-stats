var csv = require('csv');
var fs = require('fs');


var info;
module.exports.loadInfo = function(callback){
    csv.parse(fs.readFileSync('./csvs/feedback.csv'), function(err, data){
        info = [];
        for (var i = 2; i < data.length;i++){
            if (data.length > 3){
                info.push({
                    "project": data[i][0],
                    "mid": data[i][5],
                    "mentor_mid": data[i][6],
                    "final": data[i][7],
                    "mentor_final": data[i][8],
                    "members": data[i].slice(13)
                });
            }
        }
        callback();
    });
};

module.exports.getUserInfo = function(name, projects){
    if (!info){
        throw "CSV not yet loaded";
    }
    for (var i = 0;i < info.length;i++){
        var correctRecord = false;
        var record = info[i];
        for (var u = 0;u < record.members.length;u++){
            var memberName = record.members[u];
            if (memberName.toLowerCase() == name.toLowerCase()){
                correctRecord = true;
            }
        }
        if (!correctRecord){
            // check projects
            for (var u = 0; u < projects.length;u++){
                if (projects[u].toLowerCase() == record.project.toLowerCase()){
                    correctRecord = true;
                }
            }
        }
        if (correctRecord){
            return {
                "midtermReview": record.mid + " - " + record.mentor_mid,
                "finalReview": record.final + " - " + record.mentor_final
            };
        }
    }
    
    return {
        "midtermReview": "NOT FOUND",
        "finalReview": "NOT FOUND"
    };
};
