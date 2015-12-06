var csv = require('csv');
var fs = require('fs');


var info;
module.exports.loadInfo = function(callback){
    csv.parse(fs.readFileSync('./collections/smallgroup.csv'), function(err, data){
        info = [];
        for (var i = 2; i < data.length;i++){
            if (data.length > 10){
                info.push({
                    'name': data[i][0],
                    'rcsid' : data[i][1],
                    'grading' : data[i][8],
                    'attendance': data[i][10]
                });
            }
        }
        callback();
    });
};

module.exports.getUserInfo = function(name, rcsid){
    if (!info){
        throw "CSV not yet loaded";
    }
    for (var i = 0;i < info.length;i++){
        var record = info[i];
        if (record.name.toLowerCase() == name.toLowerCase() || (rcsid && (rcsid.toLowerCase() == rcsid))){
            return record;
        }
    }
    return {
        'grading': "NOT FOUND",
        'attendance': "NOT FOUND"
    };
};
