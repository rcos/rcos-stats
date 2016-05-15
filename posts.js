var fs = require("fs");

// Read all user data
var posts_raw = fs.readFileSync('collections/posts.json', 'utf8').split("\n");
var posts = [];
for (var i = 0;i < posts_raw.length;i++){
    if (posts_raw[i]){
      var post = JSON.parse(posts_raw[i]);
      posts.push({
        title: post.title,
        content: post.content,
        userid: post.author.$oid
      });
    }
}

module.exports.getUserInfo = (userid) => {
  var userPosts = [];
  for (var i = 0; i < posts.length; i++){
    var post = posts[i];
    if (post.userid == userid){
      userPosts.push(post);
    }
  }
  return userPosts;
};
