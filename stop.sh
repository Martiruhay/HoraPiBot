#! /bin/bash

# If the bot is running, kill it
if [ -f pid ]; then
  echo "Stopping bot..."
  
  pid=$(cat pid)
  kill $pid &> /dev/null
  rm pid
  
  echo "Bot stopped!"
else
  echo "The bot is not running"
fi


