var pdf = require("pdfkit");
var fs = require('fs');
var users = require('./users.js');
var util = require("./util.js");

var doc = new pdf();

doc.pipe(fs.createWriteStream('output.pdf'));

users.sort(function(a,b){
    return a.name.localeCompare(b.name);
});

for (var i = 0;i < users.length;i++){
    var user = users[i];
    doc.addPage()
        .fontSize(24)
        .text(user.name, 100,100)
        .fontSize(14)
        .text("Large Group/Bonus Attendance: " + user.attendance.length, 100, 124)
        .image("./output/" + util.normalizeName(user.name) + "/profile.jpg",50,150,{
            fit: [540, 400]
        });
}

doc.end();
