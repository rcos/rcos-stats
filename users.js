var fs = require("fs");

// Read all user data
var users_raw = fs.readFileSync('users.json', 'utf8').split("\n");
var users = [];
for (var i = 0;i < users_raw.length;i++){
    if (users_raw[i]){
        var user=JSON.parse(users_raw[i]);
        users.push(user);
    }
}

module.exports = users;
