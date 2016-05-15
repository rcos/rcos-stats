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
    console.log("Starting Stats");

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
var count = users.length;
// Create page for every user
for (var i = 0; i < users.length; i++){
    var username = users[i].github.login;
    (function(){
        var user = users[i];

        try{
            github.saveUserPage(username,"./output/"+user.dirName+"/profile.jpg", function(){
                console.log("Profile Generated for " + user.name + " ("+user.dirName+")");
                count--;
            });
        }catch(e){
            console.error("Could not make save github for " + user.name + " ("+username+") in "+ user.dirName);
            count--;
        }
    })();
}
