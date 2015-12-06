var github = require("./github.js");
var users = require("./users.js");
var posts = require("./posts.js");
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
    // User info json object
    var info = {};
    for (var i = 0;i < users.length;i++){
        info[users[i]._id.$oid] = {
            id: users[i]._id.$oid,
            raw: users[i]
        };
    }
    begin();

    // Get commits for every user
    /*
    for (var i = 0;i < users.length;i++){
        (function(user){
            github.getCommitStrings(user.github.login, function(strings){
                info[user._id.$oid].commitStrings = strings;
                finish();
            });
        })(users[i]);
        begin();
    }*/

    // Get posts/post count for each user
    for (var i = 0; i < users.length; i++){
        var userPosts = [];
        for (var u = 0; u < posts.length; u++){
            if (posts[u].author.$oid == users[i]._id.$oid){
                userPosts.push(posts[u].content);
            }
        }
        info[users[i]._id.$oid].posts = userPosts;
    }

    // Write the output info file on completion
    completionFunction = function(){
        fs.writeFileSync("output/info.json", JSON.stringify(info, null, 4));
    };
    finish();
};

if (!module.parent){
    module.exports.createInfo();
}
