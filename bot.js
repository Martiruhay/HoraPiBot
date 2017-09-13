// Configure
var timers = [
  {
    hour: 3, minute: 14, text: "Hora Pi!", search: "hora pi"
  },
  {
    hour: 4, minute: 14, text: "Hora Pi canaria!", search: "hora pi"
  },
  {
    hour: 22, minute: 35, text: "Test ¯(°_o)/¯", search: "jadsiuofhasdijvnsdvnsdjfksdjkfhaskjf"
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
     remaining += 86400000; // tomorrow
  }
  
  console.log(t.text + " set in about: " + remaining / 60000 + "minutes");
  
  setTimeout(TimeoutFunc, remaining, t.text);
  
  // Must be something grater than 1 minute (60000ms)
  setTimeout(SearchTwits, remaining + 60001, i);
  setTimeout(prepareTwit, remaining + 60001, i);
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
      for (var j = 0; j < data.statuses.length; j++)
      {
        if (inTime(i, data.statuses[j]))
        {
          var id = data.statuses[j].id_str;
          console.log("ID: " + id);
          T.post('favorites/create', { id: id }, function (err, data, response) {
            console.log(data);
          });
        }
      }
    }
  })
}

function startStream(i)
{
  console.log("Starting stream: " + t.search)
  
  var t = timers[i];
  
  var stream = T.stream('statuses/filter', { track: t.search })
  
  stream.on('tweet', function (tweet) {
    if (inTime(i, tweet))
    {
      var tweet_id = tweet.id_str
      T.post('favorites/create', { id: tweet_id }, function (err, data, response) {
        console.log(data);
      });
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
  
  console.log("Now: " + now)
  console.log("Start: " + start)
  console.log("Created at: " + tweetTime)
  console.log("End: " + end)
  
  var b = (tweetTime >= start && tweetTime < end)
  console.log("inTime?: " + b)
  
  return b
}

// Refactor pending
function _callback(err, data, response)
{
  
}


// EXECUTION START

start();