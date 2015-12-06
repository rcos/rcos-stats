var webshot = require('webshot');
var octo = require('octonode');
var token = "5a70d65f4bf45cffc90619229586e7a1280dd5c6";
var octoclient = octo.client(token);

// Image Settings
var webshotOptions = {
  screenSize: {
    width: 1024 , height: 800
  },
  shotSize: {
      width: 1024, height: 'all'
  },
  renderDelay: 150,
  timeout: 100000,
  userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
};

// Concurrency Variables
var maxConcurrentThreads = 10;
var runningThreads = 0;
var queuedThreads = [];

function saveUserPageNoQueue(username, outputfile, callback){
    runningThreads ++;
    // Take screenshot of github page
        console.log("start: "+username);

    webshot("http://www.github.com/" + username + "?tab=contributions&period=monthly", outputfile, webshotOptions, function(err){
        if (err) console.log("Error: ", err);
        runningThreads --;
        if (queuedThreads.length > 0){
            queuedThreads.shift()();
        }
        if (callback) callback();
    });
}

function runThread(func){
    // If we've exceeded the max number of threads, delay the call
    if (queuedThreads.length > 0  || runningThreads >= maxConcurrentThreads){
        queuedThreads.push(func);
    }else{
        func();
    }
}

module.exports.saveUserPage = function(username, outputfile, callback){
    runThread(function(){
        saveUserPageNoQueue(username, outputfile, callback);
    });
};

module.exports.getCommitStrings = function(username, callback){
    runThread(function(){
        var ghuser = octoclient.user(username);
    	var pushEvents = ghuser.events(['PushEvent'], function(_, pushEvents){
            var strings = [];
        	for (var i = 0; i < pushEvents.length;i++){
        		var payload = pushEvents[i].payload;
        		var commits = payload.commits;
        		for (var u = 0; u < commits.length; u++){
        			strings.push(commits[u].message);
        		}
        	}
        	callback(strings);
        });
    });
};
