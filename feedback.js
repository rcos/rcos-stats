var csv = require('csv');
var fs = require('fs');
var util = require("./util.js");

// 0 Project
// 1 Mentors
// 2 Members
// 3 Feedback
// 4 Extra Feedback
// 4 Individual Feedback

var parseMembers = function(members){
  var parsed = members.split(',');
  parsed = parsed.map((currentValue)=>{return currentValue.trim()});
  return parsed;
}

var info;
var midtermInfo;
module.exports.loadInfo = function(callback){
    csv.parse(fs.readFileSync('./csvs/final-review.csv'), function(err, data){
        info = [];
        for (var i = 2; i < data.length;i++){
            if (data.length > 3){
                info.push({
                    "project": data[i][0],
                    "mentors": data[i][1],
                    "members": data[i][2],
                    "feedback": data[i][3],
                    "extraFeedback": data[i][3],
                    "individualFeedback": data[i][4]
                });
            }
        }
        csv.parse(fs.readFileSync('./csvs/midterm-review.csv'), function(err, data){
            midtermInfo = [];
            for (var i = 2; i < data.length;i++){
                if (data.length > 3){
                    midtermInfo.push({
                        "project": data[i][0],
                        "mentors": data[i][1],
                        "members": data[i][2],
                        "feedback": data[i][3],
                        "extraFeedback": data[i][3],
                        "individualFeedback": data[i][4]
                    });
                }
            }
            callback();
        });
    });
};

module.exports.getReview = function(name, project, midterm){
    var data;
    if (midterm){
      data = midtermInfo
    }
    else{
      data = info
    }
    if (!data){
        throw "CSV not yet loaded";
    }
    var record;

    for (var i = 0;i < data.length;i++){
        var record = info[i];
        // check project
          if (project.toLowerCase() == record.project.toLowerCase()){
            return record;
          }
  }

    return {
        "date": new Date(),
        "project": "None",
        "mentors": "None",
        "members": "None",
        "membersParsed": ["None"],
        "feedback": "None",
        "extraFeedback": "None",
        "individualFeedback": "None",
    };
};
module.exports.getUserInfo = function(name, project){
  var ret = {
    "finalReview": module.exports.getReview(name, project, false),
    "midtermReview": module.exports.getReview(name, project, true)
  }
  return ret
};
