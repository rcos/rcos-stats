var fs = require("fs");

// Read all user data
module.exports = JSON.parse(fs.readFileSync('output/info.json', 'utf8'));
