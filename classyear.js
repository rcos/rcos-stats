var fs = require('fs');

var info;
module.exports.loadInfo = function(callback){
    var class_year_raw = fs.readFileSync('collections/classyears.json', 'utf8').split("\n");
    classYears = [];
    for (var i = 0; i < class_year_raw.length; i++){
        if(class_year_raw[i]){
            var classYear = JSON.parse(class_year_raw[i]);
            classYears.push(classYear);
        }
    }
    info = classYears;
    callback();
};

module.exports.getCurrentClassYear = function(){
    if (!info){
        throw "classyears.json not yet loaded";
    }

    var currentClassYear = info.filter(function(cy) {
        return cy.current === true;
    });

    return currentClassYear[0];
}
