var pdf = require("pdfkit");
var fs = require('fs');
var users = require('./users.js');
var util = require("./util.js");

var doc = new pdf();

doc.pipe(fs.createWriteStream('output.pdf'));

for (var i = 0;i < users.length;i++){
    var user = users[i];
    doc.addPage()
        .fontSize(24)
        .text(user.name, 100,100)
        .image("./output/" + util.normalizeName(user.name) + "/profile.jpg",50,150,{
            fit: [540, 1000]
        });
}

doc.end();
