// Configure
var timers = [
  {
    hour: 3, minute: 14, text: "Hora Pi!", search: "hora pi"
  },
  {
    hour: 4, minute: 14, text: "Hora Pi canaria!", search: "hora pi"
  },
  {
    hour: 22, minute: 35, text: "test", search: "-----------test------------"
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
  
  setTimeout(startStream, remaining - 1000*10, i);  // 10 seconds earlier to ensure we catch the first tweet
  setTimeout(SendTwit, remaining, t.text);
  
  // Must be something grater than 1 minute
  setTimeout(prepareTwit, remaining + 1000*70, i);
}

function SendTwit(text)
{
  console.log("Actual time: " + new Date())
  //console.log("GO!")
  T.post('statuses/update', { status: text }, _callback)
}

function like(id)
{
  T.post('favorites/create', { id: id }, _callback)
}

function retweet(id)
{
  T.post('statuses/retweet/:id', { id: id }, _callback)
}


var count = 0;
function startStream(i)
{
  var t = timers[i];
  count = 0;
  
  console.log("Starting stream: " + t.search)
  
  
  var stream = T.stream('statuses/filter', { track: t.search })
  
  stream.on('tweet', function (tweet) {
    if (inTime(i, tweet))
    {
      var tweet_id = tweet.id_str
      T.post('favorites/create', { id: tweet_id }, _callback);
      count++;
    }
  })
  T.currentTwitStream = stream;
  
  // Stop the stream after 1 minute (10 seconds later to ensure we catch the last tweet)
  setTimeout(stopStream, 1000*70);
}

function stopStream()
{
  if (T.currentTwitStream){
    console.log("Stopping stream")
    T.currentTwitStream.stop()
  }
  
  console.log("Total (in time): " + count)
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


function _callback(err, data, response)
{
  //console.log("RESPONSE: " + response)
  if (err)
    console.log(err)
  else
    console.log(data)
}


// EXECUTION START

start();