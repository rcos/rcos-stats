'use strict'
var pdf = require("pdfkit");
var fs = require('fs');
var util = require("./util.js");
var projects = require("./projects.js");
var github = require("./github.js");

var genpdf = function(allInfo){
    var doc = new pdf();

    doc.pipe(fs.createWriteStream('output.pdf'));


for (var key in allInfo){
    if (!allInfo.hasOwnProperty(key)) {
      //The current property is not a direct property of p
      continue;
    }

    // var user = users[i];
    var info = allInfo[key];

    // Don't print users who are not requesting credit
    // TODO make command line option
    if (!info.requestingCredit){
      continue;
    }

    // PAGE ONE HEADER
    var page1 = doc.addPage()
        .fontSize(24)
        .text(info.name, 50,50)
        .fontSize(14)
        .text(info && info.requestingCredit? "Credit" : "No grade")
        .text(info && info.project? info.project : "No project")
        .fontSize(9)
        .text(info ? info.githubLink : '', {link: info.githubLink})
        .text(info ? info.observatoryLink : '', {link: info.observatoryLink})

    var ypos = 82;

    // PAGE ONE ATTENDANCE

    page1.text("L/Attendance:" +
               info.largeGroupDays,
               360, ypos + 24);
    page1.text("S/Attendance:" +
               info.smallGroupDays + "/" + info.maxSmallGroupDays,
               360, ypos + 48);
    page1.text("Bonus Days:" +
               info.bonusDays,
               360, ypos + 72);
    ypos += 24 * 3;

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
            var postnum = Math.floor(Math.random() * info.posts.length)
            ypos += 9;
            page1.text(info.posts[postnum].title.replace(/\n/g,''), 360, ypos);
            ypos += 9;
            page1.text(info.posts[postnum].content.replace(/\n/g,''), 360, ypos, {
                height: 140
            });
            ypos += 140;
        }
    }
    // PAGE ONE MENTOR REVIEWS
    if (info && info.feedback){
        ypos +=16;
        page1.text("Midterm Mentor Review: ", 360, ypos);
        ypos +=15;
        page1.text("Date: " + String(info.feedback.date), 370, ypos);
        ypos +=15;
        page1.text("Mentors: " + String(info.feedback.mentor),370, ypos);
        ypos +=15;
        page1.text("Members: " + String(info.feedback.members),370, ypos);
        ypos +=40;
        page1.text("Members all Contribute: " + String(info.feedback.membersContributing)+"/5",370, ypos);
        ypos +=15;
        page1.text("Project Progress: " + String(info.feedback.projectProgress)+"/5",370, ypos);
        ypos +=15;
        page1.text("Meeting Expectations: " + String(info.feedback.meetingExpectations)+"/5",370, ypos);
        ypos +=20;
        page1.text("Comments: ",370, ypos);
        ypos +=15;
        page1.text("Project: "+String(info.feedback.comments),380, ypos).moveDown(1);
        ypos +=15;
        page1.text("Individuals: "+String(info.feedback.commentsIndividuals)).moveDown(1);
        ypos +=15;
        page1.text("Grading: "+String(info.feedback.commentsGrading)).moveDown(1);
    }
    // PAGE ONE GITHUB
    console.log(info.dirName,"output/" + info.dirName + "/profile.jpg");
    page1.image("output/" + info.dirName + "/profile.jpg",50,130,{
            fit: [300, 1000]
        });
}

    doc.end();

};
module.exports = genpdf

if (!module.parent) {
    var allInfo = require("./info.js");
    genpdf(allInfo);
}
