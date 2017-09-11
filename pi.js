// Configure
var timers = [
  {
    hour: 1, minute: 44, text: "Hora Pi canaria!", search: "adfjlasdbnviaberngklsenfgljksbnfksdbvfaksdbajdlkfvbalsdjbvadfv2"
  }
];


var fs = require('fs'), 
    path = require('path'), 
    Twit = require('twit'), 
    config = require(path.join(__dirname, 'config.js'));

var T = new Twit(config);


// Initialize all timers
function start()
{
  for (var i = 0; i < timers.length; i++) {
    prepareTwit(i);
  }
}

function prepareTwit(i)
{
  var now = new Date();
  console.log("Actual time: " + now);
  
  var t = timers[i];
    
  var remaining = new Date(now.getFullYear(), now.getMonth(), now.getDate(), t.hour, t.minute, 0, 0) - now;
  if (remaining < 0) {
     remaining += 86400000; // it's after the configured hour, try tomorrow.
  }
  
  console.log(t.text + " set in about: " + remaining / 60000 + "minutes");
  
  setTimeout(TimeoutFunc, remaining, t.text);
  
  // 100 seconds after. Must be something grater than 1 minute (60000ms)
  setTimeout(prepareTwit, remaining + 100000, i);
}

function TimeoutFunc(text)
{
  console.log("Actual time: " + new Date());
  SendTwit(text);
}

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

function SearchTwits(i)
{
  var search = timers[i].search;
  
  var date = todayDate()
  T.get('search/tweets', { q: search +' since:' + date, count: 100 }, function(err, data, response) {
    if (err)
      console.log(err);
    else {
      console.log(data);
      for (var i = 0; i < data.statuses.length; i++)
      {
        if (inTime(i, data.statuses[i]))
        {
          var id = data.statuses[i].id_str;
          console.log("ID: " + id);
          T.post('favorites/create', { id: id }, function (err, data, response) {
            console.log(data);
          });
        }
      }
    }
  })
}

function todayDate()
{
  var now = new Date();
  
  var y = now.getFullYear();
  var m = now.getMonth();
  var d = now.getDate();
  
  return y + "-" + m + "-" + d
}

function inTime(i, tweet)
{
  var t = timers[i]
  
  var now = new Date()
  var start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), t.hour, t.minute, 0, 0)
  var end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), t.hour, t.minute + 1, 0, 0)
  
  var tweetTime = new Date(tweet.created_at)
  
  console.log("Created at: " + tweetTime)
  console.log("Now: " + now)
  
  var b = tweetTime >= start && tweetTime < end
  console.log(b)
  
  return false
}


// EXECUTION START

//start();

SearchTwits(0);
