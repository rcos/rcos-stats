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
    // if (!info.credits){
    //   continue;
    // }

    // PAGE ONE HEADER
    var page1 = doc.addPage()
        .fontSize(24)
        .text(info.name, 50,50)
        .fontSize(14)
        .text(info && info.credits? String(info.credits)+" credits" : "Not for credit")
        .text(info && info.project? info.project : "No project")
        .fontSize(9)
        .text(info ? info.githubLink : '', {link: info.githubLink})
        .text(info ? info.observatoryLink : '', {link: info.observatoryLink})

    var ypos = 62;

    // PAGE ONE ATTENDANCE
    ypos += 16;
    page1.text("L/Attendance: " +
               info.largeGroupDays,
               360, ypos);
    ypos += 16;
    page1.text("Bonus Days: " +
               info.bonusDays,
               360, ypos);

    var smallGroupName = info.smallGroupName?info.smallGroupName:"No Small Group";
    ypos += 24;
    page1.text("Smallgroup: " +
               smallGroupName,
               360, ypos);
    ypos += 16;
    page1.text("S/Attendance: " +
               info.smallGroupDays + "/" + info.maxSmallGroupDays,
               360, ypos);
    ypos += 16;
    page1.text("Small Bonus: " +
               info.bonusSmallGroupDays,
               360, ypos);
    ypos += 24;

    // // PAGE ONE COMMITS
    // if (info){
    //     page1.text("Example Commits", 360, ypos + 24 );
    //     ypos += 30;
    //     page1.fontSize(7);
    //     for (var u = 0;u < 10 && info.commitStrings && u < info.commitStrings.length;u++, ypos += 9){
    //         var str = info.commitStrings[u];
    //         page1.text(str.replace(/\n/g,"").substring(0,40) + (str.length > 40 ? "..." : ""), 360, ypos + 7);
    //     }
    // }

    // PAGE ONE Blogs
    if (info){
        page1.fontSize(12)
            .text("Blog Posts: " + info.posts.length, 360, ypos+14)
        ypos += 24;
        page1.fontSize(9);
    }
    // PAGE ONE MENTOR REVIEWS
    if (info && info.feedback && info.feedback.midtermReview){
        ypos +=16;
        page1.fontSize(12).text("Mentor Review: "+info.feedback.midtermReview.project, 360, ypos);
        page1.fontSize(9);
        ypos +=15;
        page1.text("Mentors: " + String(info.feedback.midtermReview.mentors),370, ypos);
        ypos +=30;
        page1.text("Members: " + String(info.feedback.midtermReview.members),370, ypos);
        ypos +=30;
    }
    if (info && info.feedback && info.feedback.midtermReview){
        page1.text("Midterm Feedback: ",370, ypos);
        ypos +=15;
        page1.text("Project: "+info.feedback.midtermReview.feedback ,380, ypos);
        ypos +=50;
        page1.text("Moorthy/Theo: " + info.feedback.midtermReview.extraFeedback ,380, ypos);
        ypos +=50;
        page1.text("Individual "+info.feedback.midtermReview.individualFeedback ,380, ypos);
        ypos +=50;
    }
      if (info && info.feedback && info.feedback.finalReview){
          page1.text("Final Feedback: ",370, ypos);
          ypos +=15;
          page1.text("Project: "+info.feedback.finalReview.feedback ,380, ypos);
          ypos +=50;
          page1.text("Moorthy/Theo: "+info.feedback.finalReview.extraFeedback ,380, ypos);
          ypos +=15;
          page1.text("Individual: "+String(info.feedback.finalReview.individualFeedback));
          ypos +=50;
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
