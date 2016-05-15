var csv = require('csv');
var fs = require('fs');
var util = require("./util.js");

// 0 Timestamp
// 1 Mentor Name
// 2 Project Name
// 3 Group Members
// 4 All Members are Contributing
// 5 Project is Making Good Progress
// 6 Project is Meeting Expectations
// 7 Comments on Project
// 8 Comments on Group or Individuals in Group
// 9 Comments to Moorthy/Goldschmidt

var parseMembers = function(members){
  var parsed = members.split(',');
  parsed = parsed.map((currentValue)=>{return currentValue.trim()});
  return parsed;
}

var info;
module.exports.loadInfo = function(callback){
    csv.parse(fs.readFileSync('./csvs/feedback.csv'), function(err, data){
        info = [];
        for (var i = 2; i < data.length;i++){
            if (data.length > 3){
                info.push({
                    "date": data[i][0],
                    "mentor": data[i][1],
                    "project": data[i][2],
                    "members": data[i][3],
                    "membersParsed": parseMembers(data[i][3]),
                    "membersContributing": data[i][4],
                    "projectProgress": data[i][5],
                    "meetingExpectations": data[i][6],
                    "comments": data[i][7],
                    "commentsIndividuals": data[i][8],
                    "commentsGrading": data[i][9],
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
        for (var u = 0;u < record.membersParsed.length;u++){
            var memberName = record.membersParsed[u];
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
            return record;
        }
    }

    return {
        "date": new Date(),
        "mentor": "None",
        "project": "None",
        "members": "None",
        "membersParsed": ["None"],
        "membersContributing": 0,
        "projectProgress": 0,
        "meetingExpectations": 0,
        "comments": "None",
        "commentsIndividuals": "None",
        "commentsGrading": "None",
    };
};
