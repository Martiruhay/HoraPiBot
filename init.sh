#! /bin/bash

# If the bot is already running, kill it
if [ -f pid ]; then
  pid=$(cat pid)
  kill $pid &> /dev/null
fi

echo "Starting bot..."

# Start bot
node pi.js > logs &
echo $!
echo $! > pid

echo "Bot started!"

