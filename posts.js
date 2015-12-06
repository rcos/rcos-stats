var fs = require("fs");

// Read all user data
var posts_raw = fs.readFileSync('collections/posts.json', 'utf8').split("\n");
var posts = [];
for (var i = 0;i < posts_raw.length;i++){
    if (posts_raw[i]){
        posts.push(JSON.parse(posts_raw[i]));
    }
}

module.exports = posts;
