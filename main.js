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

// Read all user data
var users_raw = fs.readFileSync('users.json', 'utf8').split("\n");
var users = [];
for (var i = 0;i < users_raw.length;i++){
    if (users_raw[i]){
        users.push(JSON.parse(users_raw[i]));
    }
}

// Create directory for each user
for (var i = 0; i < users.length; i++){
    (function(){
        var dirName = util.normalizeName(users[i].name);
        var user = users[i];
        try{
            fs.mkdirSync("./output/" + dirName);
        }catch(e){
            dirName = dirName + '2';
            try{
                fs.mkdirSync("./output/" + dirName);
            }catch(e){
                console.error("Could not make directory for " + user.name + " ("+dirName+")");
            }
        }
        user.dirName = dirName;
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
