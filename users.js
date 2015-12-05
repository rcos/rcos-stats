var fs = require("fs");

// Read all user data
var users_raw = fs.readFileSync('collections/users.json', 'utf8').split("\n");
var users = [];
for (var i = 0;i < users_raw.length;i++){
    if (users_raw[i]){
        users.push(JSON.parse(users_raw[i]));
    }
}

// Remove any invalid users
for (var i = users.length-1;i>=0;i--){
    if (/^[a-zA-Z0-9- ]*$/.test(users[i].name) == false){
        users.splice(i,1);
    }
}

module.exports = users;
