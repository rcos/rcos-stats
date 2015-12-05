var sanitize = require("sanitize-filename");
var randomWords = require('random-words');

module.exports.normalizeName = function(name){
    var result = name.toLowerCase().replace(" ", "-");
    result = sanitize(result);
    result = result.replace(" ", "-");
    result = result.replace(".", "-");
    if (result === ""){
        result = randomWords({ exactly: 2, join: '-' })
    }
    return result;
};
