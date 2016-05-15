var fs = require('fs');

var info;
module.exports.loadInfo = function(callback){
    var smallgroup_raw = fs.readFileSync('collections/smallgroups.json', 'utf8').split("\n");
    smallgroups = [];
    for (var i = 0; i < smallgroup_raw.length; i++){
        if(smallgroup_raw[i]){
            var smallgroup = JSON.parse(smallgroup_raw[i]);
            smallgroups.push(smallgroup);
        }
    }
    info = smallgroups;
    callback();
};

module.exports.getUserInfo = function(smallgroupid){
    if (!info){
        throw "Smallgroups.json not yet loaded";
    }

    for (var i = 0; i < info.length; i++){
        var record = info[i];
        if (record && record._id.$oid == smallgroupid){
            return {
                'maxDays': record.dayCodes.length,
                'smallGroupName': record.name
            }
        }
    }

    return {
        'maxDays': "NO SMALLGROUP FOUND",
        'smallGroupName': "NO SMALLGROUP FOUND"
    };
};
