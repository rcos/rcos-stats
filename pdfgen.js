var pdf = require("pdfkit");
var fs = require('fs');
var util = require("./util.js");
var projects = require("./projects.js");

var genpdf = function(users){
    var doc = new pdf();

    doc.pipe(fs.createWriteStream('output.pdf'));

    for (var i = 0;i < users.length;i++){
        var user = users[i];

        doc.addPage()
            .fontSize(24)
            .text(user.name, 25,25)
            .fontSize(9)
            .text("Github: "+user.github.login, 25,55)
            .text("Email: "+user.email, 25,65)
            .text("Attendence (large group): "+user.attendance.length, 25,75)
            .text("Projects: "+((function(user){
                if (!user || ! "projects" in user || !user.projects || user.projects == undefined){
                    return "None";
                }
                return user.projects.map(function (value){
                    return projects.projectMap.get(value.$oid);
                }).reduce(function(previousValue, currentValue){
                    return previousValue + currentValue.name + " ("+currentValue.repositories + "),  ";
                }, "");

            })(user)), 25,85)

            .image("./output/" + user.dirName + "/profile.jpg",25,250,{
                fit: [540, 1000]
            });
    }

    doc.end();

};
module.exports = genpdf

if (!module.parent) {
    var users = require('./users.js');
    for (var a = 0 ; a < users.length ; a++){
        users[a].dirName = util.normalizeName(users[a].name)
    }
    genpdf(users);
}
