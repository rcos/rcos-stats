var github = require("./github.js");
var fs = require("fs");
var util = require("./util.js");

// Create output directory
try{
    fs.mkdirSync("output");
}catch(e){
    console.error("Output directory already exists!");
    process.exit()
}

var users = require("./users.js");

// Create directory for each user
for (var i = 0; i < users.length; i++){
    (function(){
        var dirName = util.normalizeName(users[i].name);
        var user = users[i];
        user.dirName = dirName;
        try{
            fs.mkdirSync("./output/" + user.dirName);
        }catch(e){
            user.dirName = dirName+"2";
            try{
                fs.mkdirSync("./output/" + user.dirName);
            }catch(e){
                user.dirName = dirName+"3";
                try{
                    fs.mkdirSync("./output/" + user.dirName);
                }catch(e){
                    console.error("Could not make directory for " + user.name + " ("+user.dirName+")");
                }
            }
        }
    })();
}

// Create page for every user
for (var i = 0; i < users.length; i++){
    var username = users[i].github.login;
    (function(){
        var user = users[i];
        github.saveUserPage(username,"./output/"+user.dirName+"/profile.jpg", function(){
            console.log("Profile Generated for " + user.name);
        });
    })();
}
