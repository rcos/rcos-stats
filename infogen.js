var fs = require("fs");
var util = require("./util.js");
var attendance = require("./attendance.js");
var classYear = require("./classyear.js");
var feedback = require('./feedback.js');
var github = require("./github.js");
var posts = require("./posts.js");
var projects = require("./projects.js");
var roster = require("./roster.js");
var smallgroup = require('./smallgroup.js');
var users = require("./users.js");

var runningThreads = 0;
var completionFunction;
function begin(){
    runningThreads ++;
}
function finish(){
    runningThreads --;
    if (runningThreads == 0){
        completionFunction();
    }
}

module.exports.createInfo = function(){
    classYear.loadInfo(function(){
        attendance.loadInfo(function(){
            smallgroup.loadInfo(function(){
                feedback.loadInfo(function(){
                    roster.loadInfo(()=>{
                        var currentClassYear = classYear.getCurrentClassYear();
                        // User info json object
                        var info = {};
                        for (var i = 0;i < users.length;i++){
                            info[users[i]._id.$oid] = {
                                id: users[i]._id.$oid,
                                raw: users[i],
                            };
                        }
                        begin();

                        for (var i = 0;i < users.length;i++){
                            getUserInfo(users[i], info[users[i]._id.$oid], currentClassYear)
                        }

                        // Remove unrostered users
                        for (var k in info){
                            if (info[k].offRoster){
                                delete info[k];
                            }
                        }

                        // create output directory if it doesn't exist
                        try{
                            fs.mkdirSync("output");
                        }catch(e){
                        }

                        // Write the output info file on completion
                        completionFunction = function(){
                            fs.writeFileSync("output/info.json", JSON.stringify(info, null, 4));
                        };
                        finish();
                    });
                });
            });
        });
    });
};

function getUserInfo(user, info, currentClassYear){
    // Get Links
    info.githubLink = "http://www.github.com/" + user.github.login;
    info.observatoryLink = "http://rcos.io/users/"+user._id.$oid+"/profile";

    // Get commits
    begin();
    github.getCommitStrings(user.github.login, function(strings){
        info.commitStrings = strings;
        finish();
    });

    // Get bio
    info.role = user.role;

    // Get all user projects
    info.projects = [];
    if (user.projects){
        for (var i = 0; i < user.projects.length; i++){
            for (var u = 0; u < projects.length;u++){
                if (user.projects[i].$oid == projects[u]._id.$oid && projects[u].active){
                    info.projects.push(projects[u].name);
                }
            }
        }
    }

    // Get roster information
    var rosterInfo = roster.getUserInfo(user.name, user.rcsid);
    if (rosterInfo == null){
        info.offRoster = true;
        return;
    }
    info.rcsid = rosterInfo.rcsid;
    info.credits = rosterInfo.requesting;
    info.project = rosterInfo.project;
    info.email = rosterInfo.email;
    info.dirName = util.normalizeName(user.name);
    info.name = user.name;

    // Get posts
    info.posts = posts.getUserInfo(user._id.$oid);

    // Get small group attendance
    var smallgroupInfo = smallgroup.getUserInfo(user._id.$oid, currentClassYear);
    info.maxSmallGroupDays = smallgroupInfo.maxDays;
    info.smallGroupName = smallgroupInfo.name;

    // Get attendance numbers
    var attendanceInfo = attendance.getUserAttendance(user._id.$oid, currentClassYear);
    info.smallGroupDays = attendanceInfo.smallGroupDays;
    info.bonusSmallGroupDays = attendanceInfo.bonusSmallGroupDays;
    info.largeGroupDays = attendanceInfo.largeGroupDays;
    info.bonusDays = attendanceInfo.bonusDays;

    // Get feedback from mentors
    var mentorFeedback = feedback.getUserInfo(user.name, info.project);
    info.feedback = mentorFeedback;
}

if (!module.parent){
    module.exports.createInfo();
}
