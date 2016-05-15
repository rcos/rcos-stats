var fs = require('fs');

var info;
module.exports.loadInfo = function(callback){
    var attendance_raw = fs.readFileSync('collections/attendances.json', 'utf8').split("\n");
    attendances = [];
    for (var i = 0; i < attendance_raw.length; i++){
        if(attendance_raw[i]){
            var attendance = JSON.parse(attendance_raw[i]);
            attendances.push(attendance);
        }
    }
    info = attendances;
    callback();
};

module.exports.getUserAttendance = function(userid, currentClassYear){
    if (!info){
        throw "attendances.json not yet loaded";
    }

    function smallGroupFilter(a) {
        return a.user.$oid === userid && a.classYear.$oid === currentClassYear._id.$oid && a.smallgroup && !a.bonusDay;
    }

    function largeGroupFilter(a) {
        return a.user.$oid === userid && a.classYear.$oid === currentClassYear._id.$oid && !a.smallgroup && !a.bonusDay;
    }

    function bonusDayFilter(a) {
        return a.user.$oid === userid && a.classYear.$oid === currentClassYear._id.$oid && a.bonusDay;
    }

    var smallGroupDays = info.filter(smallGroupFilter).length;
    var largeGroupDays = info.filter(largeGroupFilter).length;
    var bonusDays = info.filter(bonusDayFilter).length;

    return {
        'smallGroupDays': smallGroupDays,
        'largeGroupDays': largeGroupDays,
        'bonusDays': bonusDays
    }
};
