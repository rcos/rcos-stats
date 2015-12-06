var fs = require("fs");

// Read all user data
var projects_raw = fs.readFileSync('collections/projects.json', 'utf8').split("\n");
var projects = [];
for (var i = 0;i < projects_raw.length;i++){
    if (projects_raw[i]){
        projects.push(JSON.parse(projects_raw[i]));
    }
}

module.exports = projects;
