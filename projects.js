var fs = require("fs");

// Read all user data
var projects_raw = fs.readFileSync('collections/projects.json', 'utf8').split("\n");
var projects = [];
var project_map = new Map();
for (var i = 0;i < projects_raw.length;i++){
    if (projects_raw[i]){
        var project=JSON.parse(projects_raw[i]);
        projects.push(project);
        project_map.set(project._id.$oid, project);
    }
}

module.exports = {};
module.exports.projectList = projects;
module.exports.projectMap = project_map;
