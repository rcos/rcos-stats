var fs = require('fs');

var info;
module.exports.loadInfo = function(callback){
    var smallgroup_raw = fs.readFileSync('collections/smallgroups.json', 'utf8').split("\n");
    smallgroups = [];
    for (var i = 0; i < smallgroup_raw.length; i++){
        if(smallgroup_raw[i]){
            var smallgroup = JSON.parse(smallgroup_raw[i]);
            smallgroups.push({
              students: smallgroup.students.filter((student) => student).map((student) => student.$oid),
              classYear: smallgroup.classYear.$oid,
              maxDays: smallgroup.dayCodes.length,
              name: smallgroup.name
            });
        }
    }
    info = smallgroups;
    callback();
};

module.exports.getUserInfo = function(userid){
    if (!info){
        throw "Smallgroups.json not yet loaded";
    }

    for (var i = 0; i < info.length; i++){
      if (info[i].students.indexOf(userid) != -1){
        return info[i];
      }
    }

    return {
        'maxDays': "NO SMALLGROUP FOUND",
        'name': "NO SMALLGROUP FOUND"
    };
};
