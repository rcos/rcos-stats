var github = require("./github.js");
var users = require("./users.js");
var posts = require("./posts.js");
var projects = require("./projects.js");
var smallgroup = require('./smallgroup.js');
var feedback = require('./feedback.js');
var roster = require("./roster.js");
var fs = require("fs");

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
    smallgroup.loadInfo(function(){
        feedback.loadInfo(function(){
          roster.loadInfo(()=>{
              // User info json object
              var info = {};
              for (var i = 0;i < users.length;i++){
                  info[users[i]._id.$oid] = {
                      id: users[i]._id.$oid,
                      raw: users[i]
                  };
              }
              begin();

              for (var i = 0;i < users.length;i++){
                  getUserInfo(users[i], info[users[i]._id.$oid])
              }

              // Remove unrostered users
              for (var k in users){
                if (users[k].offRoster){
                  delete users[k];
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
};

function getUserInfo(user, info){
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
                if (user.projects[i].$oid == projects[u]._id.$oid){
                    info.projects.push(projects[u].name);
                }
            }
        }
    }

    // Get posts
    var userPosts = [];
    for (var u = 0; u < posts.length; u++){
        if (posts[u].author.$oid == user._id.$oid){
            userPosts.push(posts[u].content);
        }
    }
    info.posts = userPosts;

    // Get roster information
    var rosterInfo = roster.getUserInfo(user.name, user.rcsid);
    if (rosterInfo == null){
      info.offRoster = true;
      return;
    }
    user.rcsid = rosterInfo.rcsid;
    user.requestingCredit = rosterInfo.requesting == "credit";
    user.slack = rosterInfo.slack;
    user.email = rosterInfo.email;
    user.semesters = rosterInfo.semesters;
    user.RIN = rosterInfo.RIN;

    // Get small group attendance
    var smallgroupInfo = smallgroup.getUserInfo(user.name, user.rcsid);
    info.grading = smallgroupInfo.grading;
    info.smallGroupAttendance = smallgroupInfo.attendance;

    // Get feedback from mentors
    var mentorFeedback = feedback.getUserInfo(user.name, info.projects);
    info.feedback = mentorFeedback;
}

if (!module.parent){
    module.exports.createInfo();
}
