var pdf = require("pdfkit");
var fs = require('fs');
var users = require('./users.js');
var util = require("./util.js");
var github = require("./github.js");
var allInfo = require("./info.js");

var doc = new pdf();

doc.pipe(fs.createWriteStream('output.pdf'));

users.sort(function(a,b){
    // Compare by last word in name
    var la = a.name.split(" ").slice(-1)[0];
    var lb = b.name.split(" ").slice(-1)[0];
    return la.localeCompare(lb);
});


for (var i = 0;i < users.length;i++){
    var user = users[i];
    var info = allInfo[user._id.$oid];

    // PAGE ONE HEADER
    var page1 = doc.addPage()
        .fontSize(24)
        .text(user.name, 50,50)
        .fontSize(14)
        .text(info ? info.grading : "")
        .fontSize(9)
        .text(info ? info.githubLink : '', {link: info.githubLink})
        .text(info ? info.observatoryLink : '', {link: info.observatoryLink});

    var ypos = 82;

    // PAGE ONE ATTENDANCE
    page1.text("L/Attendance" + ":" + user.attendance.length, 360, ypos + 24);
    page1.text("S/Attendance" + ":" + info.smallGroupAttendance, 360, ypos + 48);
    ypos += 48;

    // PAGE ONE COMMITS
    if (info){
        page1.text("Example Commits", 360, ypos + 24 );
        ypos += 30;
        page1.fontSize(7);
        for (var u = 0;u < 10 && info.commitStrings && u < info.commitStrings.length;u++, ypos += 9){
            var str = info.commitStrings[u];
            page1.text(str.replace(/\n/g,"").substring(0,40) + (str.length > 40 ? "..." : ""), 360, ypos + 7);
        }
    }

    // PAGE ONE Projects
    if (info){
        page1.fontSize(9);
        page1.text("Projects: " + info.projects.join(","),360, ypos + 9,{
            height:40
        });
        ypos += 40;
    }

    // PAGE ONE Blogs
    if (info){
        page1.fontSize(14)
            .text("Blog Posts: " + info.posts.length, 360, ypos+14)
        ypos += 24;
        page1.fontSize(9);
        if (info.posts.length > 0){
            page1.text(info.posts[Math.floor(Math.random() * info.posts.length)].replace(/\n/g,''), 360, ypos + 9, {
                height: 140
            });
            ypos += 140;
        }
    }

    // PAGE ONE MENTOR REVIEWS
    if (info){
        page1.text("Midterm Mentor Review: " + info.feedback.midtermReview, 360, ypos + 16).moveDown(1);
        page1.text("Final Mentor Review: " + info.feedback.finalReview);
    }

    // PAGE ONE GITHUB
    page1.image("./output/" + util.normalizeName(user.name) + "/profile.jpg",50,130,{
            fit: [300, 1000]
        });
}

doc.end();
