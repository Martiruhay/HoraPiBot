// Configure
var timers = [
  {
    hour: 4, minute: 14, text: "Hora Pi canaria!"
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

function SearchTwits(text)
{
  //  search twitter for all tweets containing <text>
  T.get('search/tweets', { q: text +' since:2017-09-10', count: 1 }, function(err, data, response) {
    if (err)
      console.log(err);
    else {
      console.log(data);
      for (var i = 0; i < data.statuses.length; i++){
        var id = data.statuses[i].id_str;
        console.log("ID: " + id);
        T.post('favorites/create', { id: id }, function (err, data, response) {
          console.log(data);
        });
      }
    }
  })
}


// EXECUTION START

//start();

SearchTwits("adfjlasdbnviaberngklsenfgljksbnfksdbvfaksdbajdlkfvbalsdjbvadfv");
