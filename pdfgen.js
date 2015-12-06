var pdf = require("pdfkit");
var fs = require('fs');
var users = require('./users.js');
var util = require("./util.js");
var github = require("./github.js");
var allInfo = require("./info.js");

var doc = new pdf();

doc.pipe(fs.createWriteStream('output.pdf'));

users.sort(function(a,b){
    return a.name.localeCompare(b.name);
});


for (var i = 0;i < users.length;i++){
    var user = users[i];
    var info = allInfo[user._id.$oid];
    console.log(user.name, info);

    // PAGE ONE HEADER
    var page1 = doc.addPage()
        .fontSize(24)
        .text(user.name, 100,100)
        .fontSize(14);
    var ypos = 124;
    // PAGE ONE ATTENDANCE
    page1.text("L/Attendance" + ":" + user.attendance.length, 360, ypos + 24);
    ypos += 24;
    // PAGE ONE COMMITS
    if (info){
        page1.text("Example Commits", 360, ypos + 24 );
        ypos += 30;
        page1.fontSize(9);
        for (var u = 0;u < 10 && info.commitStrings && u < info.commitStrings.length;u++, ypos += 11){
            var str = info.commitStrings[u];
            page1.text(str.replace(/\n/g,"").substring(0,40) + (str.length > 40 ? "..." : ""), 360, ypos + 9);
        }
    }

    // PAGE ONE Blogs
    if (info){
        page1.fontSize(14)
            .text("Blog Posts: " + info.postCount, 360, ypos)
        ypos += 16;
    }


    // PAGE ONE GITHUB
    page1.image("./output/" + util.normalizeName(user.name) + "/profile.jpg",50,150,{
            fit: [300, 1000]
        });
}

doc.end();
