// Configure
var timers = [
  {
    hour: 2, minute: 4, text: "test"
  }
];


var fs = require('fs'), 
    path = require('path'), 
    Twit = require('twit'), 
    config = require(path.join(__dirname, 'config.js'));

var T = new Twit(config);


function SendTwit(text)
{
  T.post('statuses/update', { status: text }, function(err, data, response)
  {
    if (err){
      console.log(err);
    }
    else {
      console.log(data);
    }
  })
}


function start()
{
  var now = new Date();
  console.log("Actual time: " + now);
  
  for (var i = 0; i < timers.length; i++) {
    
  }
  
}

function prepareTwit(i)
{
  var now = new Date();
  
  var t = timers[i];
    
  var remaining = new Date(now.getFullYear(), now.getMonth(), now.getDate(), t.hour, t.minute, 0, 0) - now;
  if (remaining < 0) {
     remaining += 86400000; // it's after the configured hour, try tomorrow.
  }
  
  console.log(t.text + " set in about: " + remaining / 60000 + "minutes");
  
  setTimeout(TimeoutFunc, remaining, t.text);
  
  // 100 seconds after. The thing is it must be something grater to 1 minute (60000ms)
  setTimeout(TimeoutFunc, remaining + 100000, t.text);
}

function TimeoutFunc(text)
{
  console.log("Actual time: " + new Date());
  SendTwit(text);
}


// EXECUTION START

start();