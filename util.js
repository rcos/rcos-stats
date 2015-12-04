var sanitize = require("sanitize-filename");
var randomWords = require('random-words');

module.exports.normalizeName = function(name){
    var result = name.toLowerCase().replace(" ", "-");
    result = sanitize(result);
    if (result === ""){
        result = randomWords({ exactly: 2, join: '-' })
    }
    return result;
};
